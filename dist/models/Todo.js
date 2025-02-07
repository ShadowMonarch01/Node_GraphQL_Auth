import mongoose from "mongoose";
const TodoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: String }, // Stores name of the last user who updated it
}, { timestamps: true });
export default mongoose.model("Todo", TodoSchema);
