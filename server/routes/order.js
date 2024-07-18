import express from "express";
import verifyToken, { isAdminOrStockManager, isStockManager } from "../middleware/verification.js";
import product from "../models/product.js";
// import {default as product_supplier} from "../models/supplier.js";
import moment from 'moment'
import procurement from "../models/procurement.js";
import zohoMail from '../utils/zoho.js'
import pkg from 'lodash';
const {isEqual} = pkg;

const router = express.Router();
const filtered_fields = '-createdAt -updatedAt -__v';

router.post("/orders",verifyToken,isAdminOrStockManager, async(req,res)=>{
    const companyData = req.req_company;
    const {
        orders:product_orders,
        remark
    } =req.body;

    if(!Array.isArray(product_orders) || product_orders.length ===0){
        return res.status(401).json({
            msg: "please specify what you want to order",
            type: "NOT_EXIST",
            code: 603,
          })
    }

    try {

        const check_for_order = await procurement.findOne({order_date:{$gt:moment().subtract(2,'hours')},status:"pending"},`${filtered_fields}`);
        if(check_for_order){
            return res.status(401).json({
                msg: "this order already exist for this products, wait for 2-HOURS if you wish to place order for the same product",
                type: "NOT_EXIST",
                code: 603,
              });
        }
        const id = "ORDR" + Math.floor(Math.random() * 104068 + 11);  

        const order_payload = procurement({
        procurement_id:id,
        company:companyData?._id,
        // supplier: supplier_data?._id,
        order_date: moment(),
        orders:product_orders,
        procurement_by:req.user?._id
     })
       
        const saved_order = await order_payload.save();
        const {_id:order_key,__v,createdAt,updatedAt,...data} = saved_order._doc;
        let arrayOfvariations = product_orders.map(obj => obj.product_variation);
        const products_data = await product.find({ variations: { $in: arrayOfvariations } }, { _id: 0 })
        .populate([{
            path: 'product_suppliers',
            match: { status:"active" },
            select: 'supplier_id email',
            options: { lean: true },
            // transform: (doc, id) => doc == null ? id : doc
          }]).exec();

          if (products_data && products_data.length > 0) {
            products_data.forEach(product => {
                if (product.product_suppliers && product.product_suppliers.length > 0) {
                    product.product_suppliers.forEach(async supplier => {
                        if(supplier){
                            await zohoMail({
                                user_email: supplier?.email, // Change to your recipient
                                msg_title: `Product order from ${companyData?.name}`,
                                message:`order #: ${data?.procurement_id} has been placed for some products in your supply, click the link below to honor order. 
                               link will expire in 30 minutes, http://localhost:3005/api/v1/`
                       });
                        }
                    });
                }
            });
        }
        res.status(201).json({ msg: "order created success", data, type: "SUCCESS", code: 600 });
    } catch (error) {
        res.status(500).json({ msg: "create order error", data: error, type: "FAILED", code: 601 });
    }
})

export default router;