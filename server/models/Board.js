import mongoose from "mongoose";
const Schema = mongoose.Schema;

const boardSchema = new Schema({
   title: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
   
  },
  { timestamps: true }
);

const Board = mongoose.model("Board", boardSchema);
export default Board;