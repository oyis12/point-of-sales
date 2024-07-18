import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const ProcurementsSchema = new mongoose.Schema(
    {
        procurement_id: { type: String, required: true },
        company:{type:ObjectId,ref:"companies"},
        order_date:{ type: Date, required: true },
        orders:[{
            product_variation:{type:ObjectId,ref:"product_variations",required:[true,"please specify the product"]},
            bulk_qty:{type: Number,required:[function(){
                return !this.unit_qty || this.unit_qty < 1;
            },"please specify the either or both of bulk or unit quantity you want"]},
            unit_qty:{type: Number,required:[function(){
                return !this.bulk_qty || this.bulk_qty < 1;
            },"please specify the either or both of bulk or unit quantity you want"]}
        }],
        settlement_date: { type: Date },
        status: { type: String, enum: ["success", "pending", "failed", "disputed"],default:"pending" },
        contingencies: { amount: { type: Number, default: 0 }, description: { type: String } },
        procurement_by: {
            type:ObjectId,ref:'staffs',required:true
        },
        remark: { type: String }
    },
    { timestamps: true }
);

export default mongoose.models.Procurements ||
    mongoose.model("Procurements", ProcurementsSchema);