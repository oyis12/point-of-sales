import express from "express";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import store from "../models/store.js";
// import store from "../models/store.js";
import company from "../models/company.js";
import verifyToken, { isAdmin, isAdminOrStockManager, isCompanyStaff } from "../middleware/verification.js";

const router = express.Router();

// create store for a company===
router.post("/stores",  verifyToken,isAdmin, async (req, res) => {
    const {
        house_number,
        street,
        landmark,
        city,
        state,
        country,
    } = req.body
    const companyData = req.req_company;
    try {
        const id = "STR" + Math.floor(Math.random() * 10406 + 2);
        const newStore = new store(
            {
                id,
                company: companyData?._id,
                address: {
                    house_number,
                    street,
                    landmark,
                    city,
                    state,
                    country
                }
            },
        )

        const savedStore = await newStore.save();
        const { __v, createdAt, updatedAt, ...data } = savedStore._doc
        res.status(201).json({ msg: "store created success", data, type: "SUCCESS", code: 600 });

    } catch (error) {
        res.status(500).json({ msg: "create store error", data: error, type: "FAILED", code: 601 });
    }
});

// get a single store record===
router.get("/stores/:store_id/single", verifyToken, isCompanyStaff, async (req, res) => {
    if (!req.params?.store_id)
      return res.status(401).json({
        msg: "store_id missing",
        type: "WRONG_OR_MISSING_PAYLOAD",
        code: 605,
      });
    const fetchStore = store
      .findOne({ id: req.params?.store_id }, " -createdAt -updatedAt -__v")
      .populate("company", "-_id id name")
      .populate([{path:"staffs", select:"-_id -company -password -refresh_token address first_name last_name status avatar previleges email phone"}]);
   
    try {
      const storeData = await fetchStore.exec();
      if (!storeData)
        return res.status(401).json({
          msg: "store NOT found",
          type: "NOT_EXIST",
          code: 603,
        });
      if (
        (req.user?.previleges.includes(113) || req.user?.previleges.includes(114)) 
        && req.user?.office.toString() !== storeData?._id.toString()
      )
        return res.status(403).json({
          msg: "you're NOT authorized to fetch THIS store's record",
          type: "NOT_AUTHORISED",
          code: 604,
        });
  
      const { _id, createdAt, updatedAt, __v, ...data } =
        storeData._doc;
      res
        .status(200)
        .json({ msg: "store record found", data, type: "SUCCESS", code: 600 });
    } catch (error) {
      res
        .status(500)
        .json({
          msg: "fetching store error",
          data: error,
          type: "FAILED",
          code: 601,
        });
    }
  });

// =======get all stores for a company====
router.get("/stores/all", verifyToken,isAdminOrStockManager, async (req, res) => {
    const companyData = req.req_company;
    try {
        const storesdata = await store.find({ company: companyData?._id }, '-company -createdAt -updatedAt -__v -_id')
        res.status(200).json({ msg: "fetch all stores success", data: { stores: storesdata, company: companyData?.name}, type: "SUCCESS", code: 600 });
    } catch (error) {
        res.status(500).json({ msg: "fetching all stores failed", data: err, type: "FAILED", code: 602 });
    }
})

// delete store
router.delete('/stores/:store_id', verifyToken,isAdmin,async(req,res)=>{
    const {store_id} = req.params
    if (!store_id) return res.status(403).json({
        msg: "store_id is missing, check query parameter",
        type: "NOT_EXIST",
        code: 603,
    });
    const companyData = req.req_company;
    const fetchStore = store.findOne({id:store_id},'id status company').populate('company','id name')
    try {
        const storeData = await fetchStore.exec();
        if (!storeData) return res.status(403).json({
            msg: "store NOT found",
            type: "NOT_EXIST",
            code: 603,
        });
        if(companyData?.id !== storeData?.company?.id) return res.status(403).json({
            msg: "you're NOT authorized to delete THIS store",
            type: "NOT_AUTHORISED",
            code: 604,
        });
        
        const deletedStore = await store.findOneAndDelete({id:store_id});
        res.status(200).json({ msg: `store number: ${deletedStore?.id} deleted success`, type: "SUCCESS", code: 600 });
    } catch (error) {
        res.status(500).json({ msg: "delete store failed", data: err, type: "FAILED", code: 602 });
    }
})
 
export default router;