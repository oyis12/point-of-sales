import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const VariationsSchema = new mongoose.Schema(
    {
            variation_id:{ type: String, required: true },
            product:{type:ObjectId,ref:"products",required: true},
            image:{ type: String, required: true },
            size:{type:String},
            color:{type:String},
            weight:{type:String},
            alias:{type:String},
            bulk_type:{type:String,enum:["bulk","pack", "roll", "carton", "wrap", "dozen"],default:"carton"},
            packaging:{type:String},
            price_per_bulk:{type:Number,default:0},
            price_per_unit:{type:Number,default:0},
            other_details:{type:String}
    },
    { timestamps: true }
);

export default mongoose.models.product_variations ||
    mongoose.model("product_variations", VariationsSchema);