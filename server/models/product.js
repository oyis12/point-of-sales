import { ObjectId } from "mongodb";
import mongoose from "mongoose";


const ProductsSchema = new mongoose.Schema(
    {
        product_id: { type: String, required: true },
        for_company:{ type:ObjectId,ref:'companies',required:true },
        name: { type: String, required: true },
        product_type:{ type: String, required: true },
        manufacturer:{ type: String, required: true },
        image:{ type: String, required: true, default: "No avatar" },
        categories: [{ type:ObjectId,ref:'categories',required:true }],
        variations:[{
            type:ObjectId,ref:'product_variations'
        }],
        product_suppliers:[{
            type:ObjectId,ref:'suppliers'
        }],
        description:{type:String}
    },
    { timestamps: true }
);

export default mongoose.models.products ||
    mongoose.model("products", ProductsSchema);