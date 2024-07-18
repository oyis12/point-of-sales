import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const SuppliersSchema = new mongoose.Schema(
    {
        supplier_id: { type: String, required: true },
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        phone: { type: String, required: true,unique:true },
        email: { type: String, required: true,unique:true },
        for_company:{type:ObjectId,ref:"companies",required: true},
        address: {
            house_number: { type: String },
            street: { type: String },
            landmark: { type: String },
            city: { type: String },
            state: { type: String },
            country: { type: String }
        },
        avatar: { type: String },
        // products: [{type:ObjectId,ref:"products"}],
        // orders_received: [{type:ObjectId,ref:"procurements"}],
        status: { type: String, enum: ["active", "suspended", "relieved", "inactive"],default:"active"}
    },
    { timestamps: true }
);

export default mongoose.models.suppliers ||
    mongoose.model("suppliers", SuppliersSchema);