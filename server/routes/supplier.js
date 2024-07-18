import express from "express";
import verifyToken, {
  isAdminOrStockManager,
} from "../middleware/verification.js";
import product from "../models/product.js";
import supplier from "../models/supplier.js";

const router = express.Router();

router.post(
  "/suppliers",
  verifyToken,
  isAdminOrStockManager,
  async (req, res) => {
    const companyData = req.req_company;
    const {
      first_name,
      last_name,
      phone,
      email,
      house_number,
      street,
      landmark,
      city,
      state,
      country,
      avatar,
      goods,
    } = req.body;

    try {
      const check_if_created = await supplier.findOne(
        { $or: [{ email }, { phone }] },
        "supplier_id first_name last_name"
      );
      if (check_if_created) {
        return res
          .status(403)
          .json({
            msg: "this email and/or phone has been used by another user",
            type: "EXIST",
            code: 602,
          });
      }
      const id = "SUP" + Math.floor(Math.random() * 10428 + 11);
      const supplier_data = supplier({
        supplier_id: id,
        first_name,
        last_name,
        phone,
        email,
        for_company: companyData?._id,
        address: {
          house_number,
          street,
          landmark,
          city,
          state,
          country,
        },
        avatar: avatar ? avatar : "link/to/avatar",
        products: goods,
      });
      const saved_supplier = await supplier_data.save();
      const { _id, __v, createdAt, updatedAt, ...data } = saved_supplier._doc;
      res
        .status(201)
        .json({
          msg: "supplier created success",
          data,
          type: "SUCCESS",
          code: 600,
        });
    } catch (error) {
      res
        .status(500)
        .json({
          msg: "create supplier error",
          data: error,
          type: "FAILED",
          code: 601,
        });
    }
  }
);

router.get(
  "/suppliers/:supplier_id/single",
  verifyToken,
  isAdminOrStockManager,
  async (req, res) => {
    const { supplier_id } = req.params;
    const companyData = req.req_company;

    if (!supplier_id)
      return res.status(401).json({
        msg: "supplier_id missing",
        type: "WRONG_OR_MISSING_PAYLOAD",
        code: 605,
      });

    const fetchSupplier = supplier
      .findOne({ supplier_id }, "-_id -createdAt -updatedAt -__v ")
      .populate({ path: "for_company", select: "id name " });

    try {
      const supplier_data = await fetchSupplier.exec();
      if (!supplier_data)
        return res.status(401).json({
          msg: "supplier NOT found",
          type: "NOT_EXIST",
          code: 603,
        });
      if (
        supplier_data?.for_company?._id.toString() !==
        companyData?._id.toString()
      ) {
        res.status(403).json({
          msg: "you're NOT authorized to fetch this company's supplier",
          type: "NOT_AUTHORISED",
          code: 604,
        });
      }
      // productData?.categories.forEach()
      const { for_company, ...data } = supplier_data._doc;
      res
        .status(200)
        .json({
          msg: "supplier found",
          data: {
            ...data,
            company: {
              id: supplier_data?.for_company?.id,
              name: supplier_data?.for_company?.name,
            },
          },
          type: "SUCCESS",
          code: 600,
        });
    } catch (error) {
      res.status(500).json({
        msg: "fetching supplier error",
        data: error,
        type: "FAILED",
        code: 601,
      });
    }
  }
);

router.get(
  "/suppliers/all",
  verifyToken,
  isAdminOrStockManager,
  async (req, res) => {
    const companyData = req.req_company;
    try {
      const all_suppliers = await supplier.find(
        { for_company: companyData?._id },
        "-for_company -createdAt -updatedAt -__v -_id"
      );
      res
        .status(200)
        .json({
          msg: "fetch all suppliers success",
          data: { suppliers: all_suppliers, company: companyData?.name },
          type: "SUCCESS",
          code: 600,
        });
    } catch (error) {
      res
        .status(500)
        .json({
          msg: "fetching all suppliers failed",
          data: err,
          type: "FAILED",
          code: 602,
        });
    }
  }
);

router.put(
  "/suppliers/:supplier_id/update",
  verifyToken,
  isAdminOrStockManager,
  async (req, res) => {
    const { supplier_id } = req.params;
    const companyData = req.req_company;

    if (!supplier_id)
      return res.status(401).json({
        msg: "supplier_id missing",
        type: "WRONG_OR_MISSING_PAYLOAD",
        code: 605,
      });

    const fetch_supplier = supplier.findOne(
      { supplier_id },
      "-createdAt -updatedAt -__v"
    );

    try {
      const supplier_data = await fetch_supplier.exec();
      if (!supplier_data)
        return res.status(401).json({
          msg: "supplier NOT found",
          type: "NOT_EXIST",
          code: 603,
        });
      // console.log("we are almost=",companyData?._id.toString(),supplier_data?.for_company.toString())
      if (companyData?._id.toString() !== supplier_data?.for_company.toString())
        return res.status(403).json({
          msg: "you're NOT authorized to edit THIS supplier record",
          type: "NOT_AUTHORISED",
          code: 604,
        });
      //limit the number of items that can be sent in the req.body
      if (Object.keys(req.body).length > 16)
        return res.status(403).json({
          msg: "you request isn't genuine",
          type: "NOT_AUTHORISED",
          code: 604,
        });
      //   console.log("we are here==")
      // put checks on the fields that the admin can edit
      if (
        Object.keys(req.body).includes("for_company") ||
        Object.keys(req.body).includes("first_name") ||
        Object.keys(req.body).includes("last_name") ||
        Object.keys(req.body).includes("supplier_id") ||
        Object.keys(req.body).includes("orders_received")
      ) {
        return res.status(403).json({
          msg: "you're NOT AUTHORIZED to modify any of names,supplier-id or company,orders",
          type: "NOT_AUTHORISED",
          code: 604,
        });
      }
      // ===update the staff's record
      //   console.log("we are almost there",1)
      const { products, ...other_payload } = req.body;
      let updated_supplier = {};
      if (Object.keys(req.body).includes("products")) {
        // console.log("we are there",2)
        updated_supplier = await supplier.findByIdAndUpdate(
          supplier_data?._id,
          {
            $set: other_payload,
            $addToSet: { products: { $each: products } },
          },
          { new: true }
        );
        // update the products document with the supplier
        // await product.findOneAndUpdate
      } else {
        updated_supplier = await supplier.findByIdAndUpdate(
          supplier_data?._id,
          {
            $set: other_payload,
          },
          { new: true }
        );
      }

      const { _id, createdAt, updatedAt, __v, password, for_company, ...data } =
        updated_supplier._doc;
      res
        .status(200)
        .json({
          msg: "supplier record update success",
          data,
          type: "SUCCESS",
          code: 600,
        });
    } catch (error) {
      res.status(500).json({
        msg: "supplier record update error",
        data: error,
        type: "FAILED",
        code: 601,
      });
    }
  }
);

export default router;
