import express from "express";
import verifyToken, { isStockManager } from "../middleware/verification.js";
import procurement from "../models/procurement.js";
import supply from "../models/supply.js";
import moment from "moment";
import stock from "../models/stock.js";

const router = express.Router();

router.post("/supplies/:order_id", verifyToken,isStockManager, async(req,res)=>{
    const {order_id} = req.params;
    const {
            product_details,
            // product_vitals,    
            order_status
    } = req.body
    const company_data = req.req_company;
    if(!order_id){
        return res.status(401).json({
            msg: "order_id is  missing",
            type: "WRONG_OR_MISSING_PAYLOAD",
            code: 605,
          });
    }
    
    const fetch_order = procurement.findOne({procurement_id:order_id},'procurement_id order_date status orders')
      .populate({
        path:'orders.product_variation',
        select:'-price_per_bulk -price_per_unit -createdAt -updatedAt -__v',
        options: { lean: true },
        transform: (doc, id) => doc == null ? "PRODUCT_NOT_FOUND" : doc
      });
      
    try {
        const order_data = await fetch_order.exec();
        if(!order_data) return res.status(401).json({
            msg: "order NOT found",
            type: "NOT_EXIST",
            code: 603,
          });
        if(order_data?.status === "success"){
          return res.status(403).json({ msg: "order has been supplied already", type: "EXIST", code: 602 });
        }

        let array_of_variations = product_details.map(obj => obj?.product_variation_id);
        for(var product_id in array_of_variations){
          
        }
          const is_supply_recorded = await supply.findOne({order:order_data?._id},'-createdAt -updatedAt -__v -_id')
          if(is_supply_recorded){
            return res.status(403).json({ msg: "supply already delivered for this order", type: "EXIST", code: 602 });
        }
          
        //   const prod_details=[];
        // //   console.log("true?=>",Array.isArray(product_details))
        //   if(Array.isArray(product_details) && product_details.length !== 0){
        //     // console.log("det",moment())
        //     product_details.forEach(item=>{
        //         const reviewed = {...item,production_date:moment(item?.production_date),expiry_date:moment(item?.expiry_date)};
        //         prod_details.push(reviewed);
        //     })
        //     // console.log("==>",prod_details)
        //   }else{
        //     return res.status(401).json({
        //         msg: "please specify the vitals(expiry,production) of the product supplied",
        //         type: "NOT_EXIST",
        //         code: 603,
        //       })
        //   }
        //   console.log("prod==?",prod_details)
        
        let product_vitals = []; 
        for(let details in product_details){
            product_vitals = [...product_vitals, {
              variation_id:details?.product_variation_id,
              ...details?.product_vitals
            }];
        }

        const id = "SUPP" + Math.floor(Math.random() * 104068 + 11);
        const supply_data = supply({
          batch_id:id,
          order:order_data?._id,
          product_vitals,
          products_supplied:[{
              product_variation:{type:Object,required:[true,"please specify the product"]},
              bulk_qty:{type: Number,required:[function(){
                  return !this.unit_qty || this.unit_qty < 1;
              },"please specify the either or both of bulk or unit quantity supplied"]},
              unit_qty:{type: Number,required:[function(){
                  return !this.bulk_qty || this.bulk_qty < 1;
              },"please specify the either or both of bulk or unit quantity supplied"]},
              cost_price_per_bulk: { type: Number,required:[function () {
                  return typeof this.bulk_qty === 'number' && this.bulk_qty > 0;
                },"enter the price per item bulk supplied"]},
              cost_price_per_unit: { type: Number,required:[function () {
                  return typeof this.unit_qty ==='number' && this.unit_qty > 0;
                },"enter the price per item unit supplied"]},
          }],
          delivery_date:{type:Date, required: true}
      })
    
        const saved_supply = await supply_data.save();
        const {_id,createdAt,updatedAt,...data} = saved_supply._doc;
        await procurement.findByIdAndUpdate(order_data?._id,{
            status:order_status
        });
        const latest_stock_data = await stock.find({product:data?.product},'-createdAt -updatedAt -_id -__v');
        const total_cost_per_bulk = 0;
        const total_cost_per_unit = 0;
        const total_bulk_quantity = 0;
        const total_unit_quantity = 0;

        console.log("all stocks fetched=>", latest_stock_data);

        if(Array.isArray(latest_stock_data) && latest_stock_data.length < 1){
          const stock_id = "STCK" + Math.floor(Math.random() * 104068 + 11);
          await stock({
            stock_id,
            for_company:company_data?._id,
            product:data?.product,
            stock_bulk_stats: data?.bulk_stats,
            stock_unit_stats:data?.unit_stats,
        }).save();
        }else{
          console.log("let's do some aggregation...")

          for(var item in latest_stock_data){
            if(item?.stock_bulk_stats[0]?.bulk_qty > 0){
              for(var bulk_item in item?.stock_bulk_stats){
                total_cost_per_bulk += (bulk_item?.bulk_qty * bulk_item?.price_per_bulk);
                total_bulk_quantity += bulk_item?.bulk_qty;
              }
            }else if(item?.stock_unit_stats[0]?.unit_qty > 0){
              for(var unit_item in item?.stock_unit_stats){
                total_cost_per_unit += (unit_item?.unit_qty * unit_item?.price_per_unit);
                total_unit_quantity += unit_item?.unit_qty;
              }      
            } 
          }
          // let's add the current supply to the product we have in stock
            total_bulk_quantity += data?.bulk_stats?.bulk_qty * data?.bulk_stats?.price_per_bulk;
            total_bulk_quantity += data?.bulk_stats?.bulk_qty;
            total_cost_per_unit += data?.unit_stats?.unit_qty * data?.unit_stats?.price_per_unit;
            total_unit_quantity += data?.unit_stats?.unit_qty;
            // let's do cost averaging for the goods, both bulk and in unit
            const bulk_average_cost = total_cost_per_bulk / total_bulk_quantity;
            const unit_average_cost = total_cost_per_unit / total_unit_quantity; 
            console.log("results==>\n", total_bulk_quantity,"\n",total_unit_quantity,"\n",total_cost_per_bulk,"\n",total_cost_per_unit)
            console.log("wheeew!!==> finally")
            // let's update the stock record with this statistics
            await stock.findOneAndUpdate({product:data?.product},{
              stock_bulk_stats: {
                bulk_qty:total_bulk_quantity,
                cost_price_per_bulk: bulk_average_cost,
            },
            stock_unit_stats: {
                unit_qty:total_unit_quantity,
                cost_price_per_unit: unit_average_cost
            }
            },{
              new:true,
            });
        }
        
        res.status(201).json({ msg: "supply created success", data, type: "SUCCESS", code: 600 });
    } catch (error) {
        res.status(500).json({ msg: "create supply error", data: error, type: "FAILED", code: 601 });
    }
})


export default router;