import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const StoresSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        company:{type:ObjectId, ref:'companies'},
        address:{
            house_number:{type: String},
            street:{type: String, required:true},
            landmark:{type: String, required:true},
            city:{type: String, required:true},
            state:{type: String, required:true},
            country:{type: String, required:true}
        },
       staffs:[{type:ObjectId, ref:'staffs'}],
       items_categories:[
        {type:ObjectId, ref:'categories'}
       ],
       status:{type:String,enum:["open","closed","inactive"],default:"open"}
    },
    { timestamps: true }
);

export default mongoose.models.stores ||
    mongoose.model("stores", StoresSchema);