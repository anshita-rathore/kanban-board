import express from "express";
import Board from "../models/board.js";
import {protect} from "../middleware/auth.js";
import Card from "../models/card.js";
import List from "../models/list.js";

const router = express.Router();
router.use(protect);

// New card
router.post("/", async (req,res) => {
 let {title,list,board,description,dueDate} = req.body;

 if (!title || !board  || !list) {
    return res.status(400).json({ message: "Title, list and board are required" });
 }

 const check = await Board.findOne({ _id: board, owner: req.userId });
 if (!check){
 return res.status(403).json({ message: "Not authorized" });
 }

 const count = await Card.countDocuments({ list });
 const card = await Card.create({ title, description, board, list, position: count, dueDate });
 res.status(201).json(card);

});

// Edit list
router.put("/:id", async (req, res) => {
  const { title, description, dueDate,board } = req.body;
  
  if (!title || !board ) {
  return res.status(400).json({ message: "Title, description and board are required" });
  }


  const check = await Board.findOne({ _id: board, owner: req.userId });
  if (!check) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const card = await Card.findOneAndUpdate(
    { _id: req.params.id, board },
    req.body,
    { new: true }
  );

  if (!card) {
    return res.status(404).json({ message: "Card not found" });
  }

  res.status(200).json(card);
});


//Delete cards
router.delete("/:id", async (req,res) => {
const { board } = req.body;

if (!board) {
    return res.status(400).json({ message: "Board is required" });
}


const check = await Board.findOne({ _id: board, owner: req.userId });
if (!check) {
  return res.status(403).json({ message: "Not authorized" });
}


const card = await Card.findOneAndDelete({ _id: req.params.id, board });
     if(!card){
     return res.status(404).json({ message: "Card not found" });
    }
res.status(200).json({message : "Card was deleted"});

});


// drag and drop
router.put("/reorder/bulk", async (req, res) => {
  const { updates, board } = req.body;

  const check = await Board.findOne({ _id: board, owner: req.userId });
  if (!check) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await Promise.all(
    updates.map(({ id, list, position }) => Card.findByIdAndUpdate(id,{list,position}))
  );
  res.json({ message: "card reordered" });
});

export default router;