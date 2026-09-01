import mongoose from "mongoose";
const Schema = mongoose.Schema;

const listSchema = new Schema({
   title: {
      type: String,
      required: true,
      trim: true,
    },
    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const List = mongoose.model("List", listSchema);
export default List;