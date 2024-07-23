import express from "express";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import staff from "../models/staff.js";
// import verify, { isAdmin } from "../middleware/verification.js";
import store from "../models/store.js";
import company from "../models/company.js";
import verifyToken, { isAdmin, isCompanyStaff } from "../middleware/verification.js";
import upload from "../utils/upload.js";
import cloudinary from "../utils/cloudinaryConfig.js";

const router = express.Router();


// =====create staff record=====
router.post('/staffs', verifyToken, isAdmin,upload.single('avatar'), async (req, res) => {
  const {
    first_name,
    last_name,
    phone,
    email,
    house_number,
    street,
    landmark,
    city,
    country,
    avatar,
    role,//"products_manager" || "store_manager"||"cashier"
    password
  } = req.body
  const companyData = req.req_company;

  try {

    let avatar = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      avatar = result.secure_url;
    }

    const checkForStaff = await staff.findOne({ $or: [{ email }, { phone }] }, 'staff_id first_name last_name');
    if (checkForStaff) return res.status(403).json({ msg: "this email and/or phone has been used by another staff", type: "EXIST", code: 602 });
    const id = "STF" + Math.floor(Math.random() * 105700 + 1)
    const newStaff = new staff(
      {
        id,
        first_name,
        last_name,
        phone,
        email,
        address: {
          house_number,
          street,
          landmark,
          city,
          country
        },
        avatar: avatar ? avatar : "",
        previleges: [role === "stock_manager" ? 112 : role === "shop_manager" ? 113 : role === "cashier" ? 114 : 100],
        company: companyData?._id,
        status: role === "stock_manager" ? "active" : "inactive",
        password: CryptoJS.AES.encrypt(password, process.env.PW_CRYPT).toString()
      }
    )

    const savedStaff = await newStaff.save();
    console.log("created staff")
    const { password: repsonsePass, _id, createdAt, updatedAt, __v, company, refresh_token, ...data } = savedStaff._doc //filter the response
    res.status(201).json({ msg: "staff created success", data, type: "SUCCESS", code: 600 });
  } catch (error) {
    res.status(500).json({ msg: "error creating staff++", data: error, type: "FAILED", code: 601 });
  }
})

// get a single staff record===
router.get("/staffs/:staff_id/single", verifyToken, isCompanyStaff, async (req, res) => {
  if (!req.params?.staff_id)
    return res.status(401).json({
      msg: "staff_id missing",
      type: "WRONG_OR_MISSING_PAYLOAD",
      code: 605,
    });
  const fetchStaff = staff
    .findOne({ id: req.params?.staff_id }, "-_id -createdAt -updatedAt -__v -password")
    .populate("company", "-_id id name")
    .populate({path:"office", select:"-_id id address",transform: (doc, id) => doc == null ? { _id: id } : doc });

  try {
    const staffdata = await fetchStaff.exec();
    if (!staffdata)
      return res.status(401).json({
        msg: "staff NOT found",
        type: "NOT_EXIST",
        code: 603,
      });
    if (
      req.user?.previleges.includes(114) && req.user?.id !== staffdata?.id
    )
      return res.status(403).json({
        msg: "you're NOT authorized to fetch THIS staff's record",
        type: "NOT_AUTHORISED",
        code: 604,
      });

    const { _id, password, createdAt, updatedAt, __v, refresh_token, ...data } =
      staffdata._doc;
      // console.log("staff=>",staffdata._doc)
    res
      .status(200)
      .json({ msg: "staff record found", data, type: "SUCCESS", code: 600 });
  } catch (error) {
    res
      .status(500)
      .json({
        msg: "fetching staff error",
        data: error,
        type: "FAILED",
        code: 601,
      });
  }
});

// assign staff to a store or office
router.put("/staffs/assign", verifyToken, isAdmin, async (req, res) => {
  const { staff_id, store_id } = req.query;

  if (!staff_id || !store_id)
    return res.status(401).json({
      msg: "atleast one of staff_id and store_id is  missing",
      type: "WRONG_OR_MISSING_PAYLOAD",
      code: 605,
    });
  const companyData = req.req_company;
  const fetchStaff = staff
    .findOne(
      { id: staff_id },
      "-createdAt -updatedAt -__v -password -refresh_token"
    )
    .populate("company", "-_id id name");
  const fetchStore = store
    .findOne({ id: store_id })
    .populate("company", "id name");
  try {
    const staffdata = await fetchStaff.exec();
    if (!staffdata)
      return res.status(401).json({
        msg: "staff NOT found",
        type: "NOT_EXIST",
        code: 603,
      });

    if (companyData?.id !== staffdata?.company?.id)
      return res.status(403).json({
        msg: "you're NOT authorized to assign THIS staff to any store or office of this company",
        type: "NOT_AUTHORISED",
        code: 604,
      });
    const storeData = await fetchStore.exec();
    if (!storeData)
      return res.status(401).json({
        msg: "store NOT found",
        type: "NOT_EXIST",
        code: 603,
      });
    if (staffdata?.company?.id !== storeData?.company?.id)
      return res.status(403).json({
        msg: "you CANNOT assign THIS staff to THIS store or office",
        type: "NOT_AUTHORISED",
        code: 604,
      });
    const assignStaff = await store.findByIdAndUpdate(
      storeData?._id,
      {
        $addToSet: { staffs: staffdata?._id },
      },
      {
        new: true,
      }
    );
    // ===update the staff's status and office to 'active'
    const updateStaffRec = await staff.findByIdAndUpdate(staffdata?._id, {
      status: "active",
      office: storeData?._id,
    });
// console.log("updatedstaff==>",updateStaffRec,storeData?._id)
    const { _id, createdAt, updatedAt, __v, ...data } = assignStaff._doc;
    res
      .status(200)
      .json({
        msg: "staff assigned to store success",
        data: { ...data, staff: { office: updateStaffRec._doc?.office, status: updateStaffRec._doc?.status } },
        type: "SUCCESS",
        code: 600,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        msg: "staff assignment error",
        data: error,
        type: "FAILED",
        code: 601,
      });
  }
});

// update staff record
router.put("/staffs/:staff_id/update", verifyToken, isAdmin, async (req, res) => {
  const { staff_id } = req.params;
  if (!staff_id)
    return res.status(401).json({
      msg: "atleast one of staff_id and store_id is  missing",
      type: "WRONG_OR_MISSING_PAYLOAD",
      code: 605,
    });
  const companyData = req.req_company;

  const fetchStaff = staff
    .findOne(
      { id: staff_id },
      "-createdAt -updatedAt -__v -password -refresh_token"
    );

  try {
    const staffdata = await fetchStaff.exec();
    if (!staffdata)
      return res.status(401).json({
        msg: "staff NOT found",
        type: "NOT_EXIST",
        code: 603,
      });

    if (companyData?._id.toString() !== staffdata?.company.toString())
      return res.status(403).json({
        msg: "you're NOT authorized to edit THIS staff record",
        type: "NOT_AUTHORISED",
        code: 604,
      });
    //limit the number of items that can be sent in the req.body
    if (Object.keys(req.body).length > 20) return res.status(403).json({
      msg: "you request isn't genuine",
      type: "NOT_AUTHORISED",
      code: 604,
    })
    // put checks on the fields that the admin can edit
    if (Object.keys(req.body).includes("previleges") || Object.keys(req.body).includes("company")
      || Object.keys(req.body).includes("office") || Object.keys(req.body).includes("id")
      || Object.keys(req.body).includes("email") || Object.keys(req.body).includes("phone")
      || Object.keys(req.body).includes("refresh_token")) {
      return res.status(403).json({
        msg: "you're NOT AUTHORIZED to edit SOME data in the staff document, contact the system admin",
        type: "NOT_AUTHORISED",
        code: 604,
      })
    }
    // ===update the staff's record
    const updatedStaff = await staff.findByIdAndUpdate(
      staffdata?._id,
      {
        $set: req.body,
      },
      { new: true }
    )

    const { _id, createdAt, updatedAt, __v, password, refresh_token, company, ...data } = updatedStaff._doc;
    res.status(200).json({ msg: "staff record update success", data, type: "SUCCESS", code: 600 });

  } catch (error) {
    res
      .status(500)
      .json({
        msg: "staff record update error",
        data: error,
        type: "FAILED",
        code: 601,
      });
  }
});

// get all staff record for a company
router.get("/staffs/all", verifyToken, isAdmin, async (req, res) => {
  const companyData = req.req_company;
  try {
    const allStaff = await staff.find({ company: companyData?._id, previleges: { $nin: [111] } }, '-company -office -createdAt -updatedAt -__v -_id -password -refresh_token')
      .populate('office', 'status address id -_id')
    res.status(200).json({ msg: "fetch all staff success", data: { company_staffs: allStaff, company: { id: companyData?.id, name: companyData?.name } }, type: "SUCCESS", code: 600 });
  } catch (error) {
    res.status(500).json({ msg: "fetching all staff failed", data: err, type: "FAILED", code: 602 });
  }
})

export default router;