import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const StockSchema = new mongoose.Schema(
    {
        stock_id: { type: String, required: true },
        for_company:{ type:ObjectId,ref:'companies',required:function () {
            return this.for_store === undefined; // 'this' refers to the document being saved
          } },
        for_store:{type:ObjectId,ref:'stores',required:function () {
            return this.for_company === undefined;
          }},
        product: { type: ObjectId,ref:'products', required: true },
        variety:{type:ObjectId},
        bulk_stats: {
            qty:{type:Number},
            cost_price:{type:Number},
            unit: { type: String, enum: ["pack", "roll", "carton", "wrap", "dozen"]},
            items_per_bulk:{ type: Number}
        },
        unit_stats:{
            qty:{type:Number},
            cost_price:{type:Number}
        },
    },
    { timestamps: true }
);

export default mongoose.models.stocks ||
    mongoose.model("stocks", StockSchema);