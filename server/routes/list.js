import express from "express";
import Board from "../models/board.js";
import {protect} from "../middleware/auth.js";
import Card from "../models/card.js";
import List from "../models/list.js";

const router = express.Router();
router.use(protect);

// New list
router.post("/", async (req, res) => {
  const { title, board } = req.body;

  if (!title || !board) {
    return res.status(400).json({ message: "Title and board are required" });
  }

  const check = await Board.findOne({ _id: board, owner: req.userId });
  if (!check){
    return res.status(403).json({ message: "Not authorized" });
  }

  const count = await List.countDocuments({ board });
  const list = await List.create({ title, board, position: count });

  res.status(201).json(list);
});

// Edit list
router.put("/:id", async (req, res) => {
  const { board } = req.body;

  if (!board) {
    return res.status(400).json({ message: "Board is required" });
  }


  const check = await Board.findOne({ _id: board, owner: req.userId });
  if (!check) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const list = await List.findOneAndUpdate(
    { _id: req.params.id, board },
    req.body,
    { new: true }
  );

  if (!list) {
    return res.status(404).json({ message: "List not found" });
  }

  res.status(200).json(list);
});

//Delete list
router.delete("/:id", async (req,res) => {
const { board } = req.body;

if (!board) {
    return res.status(400).json({ message: "Board is required" });
}


const check = await Board.findOne({ _id: board, owner: req.userId });
if (!check) {
  return res.status(403).json({ message: "Not authorized" });
}


const list = await List.findOneAndDelete({ _id: req.params.id, board });
     if(!list){
     return res.status(404).json({ message: "List not found" });
    }

    await Card.deleteMany({ list: list._id });

    res.status(200).json({message : "list was deleted"});

});

export default router;