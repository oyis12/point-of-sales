import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const SuppliesSchema = new mongoose.Schema(
    {
        batch_id:{ type: String, required: true },
        order:{type:ObjectId,ref:'procurements',required:true},
        product_vitals:[
            {   
                variation_id:{ type: String},
                product_batch_no:{ type: String},
                production_date: { type: Date, required: true },
                expiry_date: { type: Date, required: true },
            }
        ],
        supply_details:[{
            product_variation:{type:Object,required:[true,"please specify the product"]},
            bulk_qty:{type: Number,required:[function(){
                return !this.unit_qty || this.unit_qty < 1;
            },"please specify either or both of bulk or unit quantity supplied"]},
            unit_qty:{type: Number,required:[function(){
                return !this.bulk_qty || this.bulk_qty < 1;
            },"please specify either or both of bulk or unit quantity supplied"]},
            cost_price_per_bulk: { type: Number,required:[function () {
                return typeof this.bulk_qty === 'number' && this.bulk_qty > 0;
              },"enter the price per item bulk supplied"]},
            cost_price_per_unit: { type: Number,required:[function () {
                return typeof this.unit_qty ==='number' && this.unit_qty > 0;
              },"enter the price per item unit supplied"]},
        }],
        delivery_date:{type:Date, required: true}
    },
    { timestamps: true }
);

export default mongoose.models.supplies ||
    mongoose.model("supplies", SuppliesSchema);