import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const defaultProductImage = "https://www.google.com/imgres?q=no%20product%20avatar%20image&imgurl=https%3A%2F%2Foldprintshop.com%2Fbundles%2Fsite%2Fimages%2Fno_image_product.png&imgrefurl=https%3A%2F%2Foldprintshop.com%2Fproduct%2F167064%3Finventoryno%3D101507%26itemno%3D1&docid=tjBFk0vUH-mmnM&tbnid=M7bO8uJUY559jM&vet=12ahUKEwiUhruP9cGHAxU2L1kFHVVNAAMQM3oECH8QAA..i&w=500&h=500&hcb=2&itg=1&ved=2ahUKEwiUhruP9cGHAxU2L1kFHVVNAAMQM3oECH8QAA";


const ProductsSchema = new mongoose.Schema(
    {
        product_id: { type: String, required: true },
        for_company:{ type:ObjectId,ref:'companies',required:true },
        name: { type: String, required: true },
        product_type:{ type: String, required: true },
        manufacturer:{ type: String, required: true },
        product_image: { type: String, default: defaultProductImage },
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