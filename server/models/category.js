import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const CategoriesSchema = new mongoose.Schema(
    {
        category_id: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String },
        company:{type:ObjectId,ref:'companies', required:true}
    },
    { timestamps: true }
);

export default mongoose.models.categories ||
    mongoose.model("categories", CategoriesSchema);