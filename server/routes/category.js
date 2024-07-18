import express from "express";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import staff from "../models/staff.js";
// import verify from "../middleware/verification.js";
import store from "../models/store.js";
import company from "../models/company.js";
import category from "../models/category.js";
import verifyToken, { isCompanyStaff, isStockManager } from "../middleware/verification.js";

const router = express.Router();

// create products category for a company===
router.post("/categories", verifyToken, isStockManager, async (req, res) => {
  const {
    name,
    description,
  } = req.body
  const companyData = req.req_company;

  try {
    const checkCategory = await category.findOne({ name }, 'name description -_id')
    if (checkCategory) return res.status(401).json({
      msg: "this category already exist for this company",
      type: "NOT_EXIST",
      code: 603,
    });
    const id = "CAT" + Math.floor(Math.random() * 10406 + 2);
    const newCategory = new category(
      {
        category_id: id,
        name,
        description,
        company: companyData?._id
      }
    )
    const savedCategory = await newCategory.save();
    const { _id, __v, createdAt, updatedAt, ...data } = savedCategory._doc

    res.status(201).json({ msg: "category created success", data, type: "SUCCESS", code: 600 });

  } catch (error) {
    res.status(500).json({ msg: "create category error", data: error, type: "FAILED", code: 601 });
  }
})

// get a single category record===
router.get("/categories/:category_id/single", verifyToken, isCompanyStaff, async (req, res) => {
  const { category_id } = req.params;
  const companyData = req.req_company;

  if (!category_id)
    return res.status(401).json({
      msg: "category_id missing",
      type: "WRONG_OR_MISSING_PAYLOAD",
      code: 605,
    });
  const fetchCategory = category
    .findOne({ category_id ,company:companyData?._id}, "-_id -createdAt -updatedAt -__v ")
    .populate("company", "-_id id name")
  try {
    const categoryData = await fetchCategory.exec();
    if (!categoryData)
      return res.status(401).json({
        msg: "category NOT found",
        type: "NOT_EXIST",
        code: 603,
      });
    const { createdAt, updatedAt, __v, ...data } =
      categoryData._doc;
    res
      .status(200)
      .json({ msg: "category record found", data, type: "SUCCESS", code: 600 });
  } catch (error) {
    res
      .status(500)
      .json({
        msg: "fetching category error",
        data: error,
        type: "FAILED",
        code: 601,
      });
  }
});

//   // update staff record 
//   router.put("/staff/:staff_id/update", verifyToken, async (req, res) => {
//     const { staff_id } = req.params;
//     if (!staff_id)
//       return res.status(401).json({
//         msg: "atleast one of staff_id and store_id is  missing",
//         type: "WRONG_OR_MISSING_PAYLOAD",
//         code: 605,
//       });
//     const { roles: userRoles, company: userCompany, id: userId } = req.user;

//     if (!userRoles.includes(111))
//       return res.status(403).json({
//         msg: "you're NOT authorized to edit ANY staff record ",
//         type: "NOT_AUTHORISED",
//         code: 604,
//       });
//     const fetchStaff = staff
//       .findOne(
//         { id: staff_id },
//         "-createdAt -updatedAt -__v -password -refresh_token"
//       )
//       .populate("company", "-_id id name");
//     // const fetchStore = store
//     //   .findOne({ id: store_id })
//     //   .populate("company", "id name");
//     try {
//       const staffdata = await fetchStaff.exec();
//       if (!staffdata)
//         return res.status(401).json({
//           msg: "staff NOT found",
//           type: "NOT_EXIST",
//           code: 603,
//         });

//       if (userRoles.includes(111) && userCompany !== staffdata?.company?.id)
//         return res.status(403).json({
//           msg: "you're NOT authorized to edit THIS staff record",
//           type: "NOT_AUTHORISED",
//           code: 604,
//         });
//       //limit the number of items that can be sent in the req.body
//       if (Object.keys(req.body).length > 20) return res.status(403).json({
//         msg: "you request isn't genuine",
//         type: "NOT_AUTHORISED",
//         code: 604,
//       })
//       // put checks on the fields that the admin can edit
//       if (Object.keys(req.body).includes("previleges") || Object.keys(req.body).includes("company")
//         || Object.keys(req.body).includes("office") || Object.keys(req.body).includes("id")
//         || Object.keys(req.body).includes("email") || Object.keys(req.body).includes("phone")
//         || Object.keys(req.body).includes("refresh_token")) {
//         return res.status(403).json({
//           msg: "you're NOT AUTHORIZED to edit SOME data in the staff document, contact the system admin",
//           type: "NOT_AUTHORISED",
//           code: 604,
//         })
//       }
//       // ===update the staff's record
//       const updatedStaff = await staff.findByIdAndUpdate(
//         staffdata?._id,
//         {
//           $set: req.body,
//         },
//         { new: true }
//       )

//       const { _id, createdAt, updatedAt, __v, password, refresh_token, ...data } = updatedStaff._doc;
//       res.status(200).json({ msg: "staff record update success", data, type: "SUCCESS", code: 600 });

//     } catch (error) {
//       res
//         .status(500)
//         .json({
//           msg: "staff record update error",
//           data: error,
//           type: "FAILED",
//           code: 601,
//         });
//     }
//   });

// get all categories for a company
router.get("/categories/all", verifyToken, isCompanyStaff, async (req, res) => {
  try {
    const companyData = req.req_company;
    const allCategories = await category.find({ company: companyData?._id.toString() }, '-company -createdAt -updatedAt -__v')
    res.status(200).json({ msg: "fetch all categories success", data: { products_categories: allCategories, company: { id: companyData?.id, name: companyData?.name } }, type: "SUCCESS", code: 600 });
  } catch (error) {
    res.status(500).json({ msg: "fetching all categories failed", data: err, type: "FAILED", code: 602 });
  }
})

export default router;