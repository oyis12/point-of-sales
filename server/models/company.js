import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        address: {
            house_number: { type: String },
            street: { type: String, required: true },
            landmark: { type: String },
            city: { type: String },
            country: { type: String }
        },
        avatar: { type: String },
        admins: [{
            type: ObjectId,
            ref: 'staff',
            required: [true, 'company admin is required']
        }] 
    },
    { timestamps: true }
);

export default mongoose.models.companies ||
    mongoose.model("companies", CompanySchema);