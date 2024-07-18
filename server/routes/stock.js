import express from "express";
import verifyToken, { isStockManager } from "../middleware/verification.js";
import procurement from "../models/procurement.js";
import supply from "../models/supply.js";
import moment from "moment";

const router = express.Router();

router.post("/stocks", verifyToken,isStockManager, async(req,res)=>{
   
})


export default router;