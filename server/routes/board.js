import express from "express";
import Board from "../models/board.js";
import {protect} from "../middleware/auth.js";
import Card from "../models/card.js";
import List from "../models/list.js";

const router = express.Router();
router.use(protect);


// Show boards
router.get("/", async (req, res) => {
  const boards = await Board.find({ owner: req.userId }).sort({ position: 1 });
  res.json(boards);
});

// Show a board with lists and cards
router.get("/:id", async (req, res) => {
  const board = await Board.findOne({ _id: req.params.id, owner: req.userId });
  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }

  const lists = await List.find({ board: board._id }).sort({ position: 1 });
  const cards = await Card.find({ board: board._id }).sort({ position: 1 });

  const listsWithCards = lists.map((list) => ({
    ...list.toObject(),
    cards: cards.filter((card) => String(card.list) === String(list._id)),
  }));

  res.json({ ...board.toObject(), lists: listsWithCards });
});


// New boards
router.post("/", async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const count = await Board.countDocuments({ owner: req.userId });
  const board = await Board.create({
    title,
    owner: req.userId,
    position: count,
  });

  res.status(201).json(board);
});


// Edit board
router.put("/:id", async (req,res) => {
   const board = await Board.findOneAndUpdate(    { _id: req.params.id, owner: req.userId },
    req.body,
    { new: true });

   if(!board){
     return res.status(404).json({ message: "Board not found" });
   }

   res.status(200).json(board);

});


// Delete board
router.delete("/:id", async (req,res) => {
const board = await Board.findOneAndDelete({ _id: req.params.id, owner: req.userId });
     if(!board){
     return res.status(404).json({ message: "Board not found" });
    }

     await List.deleteMany({ board: board._id });
     await Card.deleteMany({ board: board._id });


    res.status(200).json({message : "board was deleted"});

});


export default router;