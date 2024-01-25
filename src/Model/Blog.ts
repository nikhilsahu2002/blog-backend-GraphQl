import { Schema, model } from "mongoose";

const BlogSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  comments: [{ type: Schema.Types.ObjectId, ref: "comment" }],
});

export default model("Blog", BlogSchema);
