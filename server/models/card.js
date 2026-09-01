import mongoose from "mongoose";
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true
    },
    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    list: {
      type: Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    dueDate:{
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

const Card = mongoose.model("Card", cardSchema);
export default Card;