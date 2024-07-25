import express from "express";
import verify, { isAdminOrStockManager, isCompanyStaff, isStockManager } from "../middleware/verification.js";
import category from "../models/category.js";
import product from "../models/product.js";
import product_variation from "../models/product_variation.js";
import supplier from "../models/supplier.js";
import upload from "../utils/upload.js";
import cloudinary from "../utils/cloudinaryConfig.js";


const router = express.Router();

const filtered_fields = '-createdAt -updatedAt -__v';

// create products for a company===
router.post("/products/:category_id", verify, isStockManager, async (req, res) => {
  const {
    name,
    product_type,
    manufacturer,
    description,
    product_image
  } = req.body
  const { category_id } = req.params
  const companyData = req.req_company;
  if (!category_id) return res.status(401).json({
    msg: "category_id is missing, check your parameter",
    type: "WRONG_OR_MISSING_PAYLOAD",
    code: 605,
  })
  const fetchCategory = category.findOne({ category_id, company: companyData?._id }, 'name category_id');

  try {
    const categoryData = await fetchCategory.exec();
    if (!categoryData) return res.status(401).json({
      msg: "category NOT found",
      type: "NOT_EXIST",
      code: 603,
    });

    let product_image = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      product_image = result.secure_url;
    }

    const { _id: cat_key } = categoryData
    // ```categories: { $in: [cat_key]```====>used to check if cat is found in the categories array
    const checkProducts = await product.findOne({ name, for_company:companyData?._id.toString() }, 'name description -_id')
    if (checkProducts) return res.status(401).json({
      msg: "this product ALREADY exists for THIS category",
      type: "EXIST",
      code: 602,
    });

    
    const prod_id = "PRD" + Math.floor(Math.random() * 104026 + 7);
    
    const newproduct = new product(
      {
        product_id:prod_id,
        for_company:companyData?._id,
        name,
        product_type,
        manufacturer,
        categories: [cat_key],
        description:description?description:undefined,
        product_image: product_image?product_image:product_image
    }
    )
    const savedProduct = await newproduct.save();
    const { _id, __v, createdAt, updatedAt, categories,for_company, ...data } = savedProduct._doc
    res.status(201).json({
       msg: "product created success",
        data: { ...data, 
        categories: [{ cat_id: categoryData?.category_id, name: categoryData?.name }] },
        type: "SUCCESS", code: 600 });
  } catch (error) {
    res.status(500).json({ msg: "create product error", data: error, type: "FAILED", code: 601 });
  }
})

// create product variations for a company===
router.post("/products/:product_id/variation", verify, isStockManager,upload.single('image'), async (req, res) => {
  const {
  image,
  size,
  color,
  weight,
  alias,
  bulk_type,
  packaging,
  other_details
} = req.body;

  const { product_id } = req.params
  const companyData = req.req_company;
  if (!product_id) return res.status(401).json({
    msg: "product_id is missing, check your parameter",
    type: "WRONG_OR_MISSING_PAYLOAD",
    code: 605,
  })
  const fetch_product = product.findOne({ product_id, for_company: companyData?._id }, 'name product_id');

  try {
    const product_data = await fetch_product.exec();
    if (!product_data) return res.status(401).json({
      msg: "product NOT found",
      type: "NOT_EXIST",
      code: 603,
    });

    let image = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      image = result.secure_url;
    }
    // const { _id: prod_key } = product_data
    // ```categories: { $in: [cat_key]```====>used to check if cat is found in the categories array
    const check_for_variation = await product_variation.findOne({ 
      product:product_data?._id,
      size,
      color,
      weight,
      alias,
      packaging,
      other_details}, 'variation_id description -_id')
    if (check_for_variation) return res.status(401).json({
      msg: "this variation ALREADY exists for THIS product",
      type: "EXIST",
      code: 602,
    });
    const var_id = "VAR" + Math.floor(Math.random() * 10402446 + 7);
    
    const new_variation = new product_variation({
           variation_id:var_id,
            product:product_data?._id,
            image: image?image:undefined,
            size:size?size:undefined,
            color:color?color:undefined,
            weight:weight?weight:undefined,
            alias:alias?alias:undefined,
            bulk_type:bulk_type?bulk_type:undefined,
            packaging:packaging?packaging:undefined,
            other_details:other_details?other_details:undefined
    });

    const saved_varition = await new_variation.save();
    const { _id, __v, createdAt, updatedAt, ...data } = saved_varition._doc
    // ===update the variations array in the product document
    await product.findByIdAndUpdate(product_data?._id,{
      $addToSet:{variations:saved_varition?._id}
    },{new:true});

    res.status(201).json({ msg: "variation created success", data: { ...data, product:{ product_id: product_data?.product_id, name: product_data?.name } }, type: "SUCCESS", code: 600 });
  } catch (error) {
    res.status(500).json({ msg: "create variation error", data: error, type: "FAILED", code: 601 });
  }
}) 

//get a single product variation
router.get("/products/:variation_id/variation", verify, isCompanyStaff, async (req, res) => {
  const { variation_id } = req.params;
  // const companyData = req.req_company;

  if (!variation_id)
    return res.status(401).json({
      msg: "variation_id missing",
      type: "WRONG_OR_MISSING_PAYLOAD",
      code: 605,
    });

  const fetch_variation = product_variation.findOne({ variation_id }, "-_id -createdAt -updatedAt -__v ")
    // .populate([{ path: 'categories', select: '-_id category_id name company' }])

  try {
    const variation_data = await fetch_variation.exec();
    if (!variation_data)
      return res.status(401).json({
        msg: "this product variation NOT found",
        type: "NOT_EXIST",
        code: 603,
      });

    const {data} =
      variation_data._doc;

    res
      .status(200)
      .json({ msg: "product variation found", data, type: "SUCCESS", code: 600 });
  } catch (error) {
    res
      .status(500)
      .json({
        msg: "fetching product variation error",
        data: error,
        type: "FAILED",
        code: 601,
      });
  }
});

// get all variation for a product
router.get("/products/:product_id/all_variations", verify,isCompanyStaff, async (req, res) => {
  const {product_id} = req.params;
  if (!product_id)
    return res.status(401).json({
      msg: "product_id missing",
      type: "WRONG_OR_MISSING_PAYLOAD",
      code: 605,
    });
  const companyData = req.req_company;

  const fetch_product = product.findOne({product_id},'-createdAt -updatedAt -__v -variations');

  try {
    const product_data = await fetch_product.exec();
    if (!product_data)
      return res.status(401).json({
        msg: "this product NOT found",
        type: "NOT_EXIST",
        code: 603,
      });
      // console.log("===>",product_data?.for_company,companyData?._id)
      if(product_data?.for_company.toString() !== companyData?._id.toString()){
       return res.status(403).json({
          msg: "you're NOT authorized to fetch all variations for this product",
          type: "NOT_AUTHORISED",
          code: 604,
        })
      }
    const all_variations = await product_variation.find({product:product_data?._id},'-product -createdAt -updatedAt -__v')

    res.status(200).json({ msg: `fetch all products success`, data: {product:product_data, all_variations}, type: "SUCCESS", code: 600 });

  } catch (error) {
    res.status(500).json({ msg: "fetching all products failed", data: err, type: "FAILED", code: 602 });

  }
})

// get a single product record===
router.get("/products/:product_id/single", verify, isCompanyStaff, async (req, res) => {
  const { product_id } = req.params;
  const companyData = req.req_company;

  if (!product_id)
    return res.status(401).json({
      msg: "product_id missing",
      type: "WRONG_OR_MISSING_PAYLOAD",
      code: 605,
    });

  const fetchProduct = product.findOne({ product_id }, "-_id -createdAt -updatedAt -__v ")
    .populate([{ path: 'categories', select: '-_id category_id name company' }])

  try {
    const productData = await fetchProduct.exec();
    if (!productData)
      return res.status(401).json({
        msg: "product NOT found",
        type: "NOT_EXIST",
        code: 603,
      });
    if (productData?.categories[0]?.company !== companyData?._id) {
      res.status(403).json({
        msg: "you're NOT authorized to fetch this product",
        type: "NOT_AUTHORISED",
        code: 604,
      })
    }
    // productData?.categories.forEach()
    const {data} =
      productData._doc;
    res
      .status(200)
      .json({ msg: "product found", data, type: "SUCCESS", code: 600 });
  } catch (error) {
    res
      .status(500)
      .json({
        msg: "fetching product error",
        data: error,
        type: "FAILED",
        code: 601,
      });
  }
});
// add supplier to a product
router.put("/products/suppliers",verify,isAdminOrStockManager, async(req,res)=>{
  const {supplier_id, product_id} = req.query;
  const company = req.req_company;
  if(!supplier_id || !product_id){
    return res.status(401).json({
      msg: "one of supplier_id and product_id is missing",
      type: "WRONG_OR_MISSING_PAYLOAD",
      code: 605,
    });
  }
  const fetch_product = product.findOne({product_id},`${filtered_fields} -variations`);
  const fetch_supplier = supplier.findOne({supplier_id},`${filtered_fields}`)

  try {
    const product_data = await fetch_product.exec();
    if(!product_data){
      return res.status(401).json({
        msg: "this product NOT found",
        type: "NOT_EXIST",
        code: 603,
      });
    }
    // console.log("first",company,product_data)
    if(!product_data?.for_company.equals(company?._id)){
      res.status(403).json({
        msg: "you're NOT authorized to fetch this product",
        type: "NOT_AUTHORISED",
        code: 604,
      })
    }
    const supplier_data = await fetch_supplier.exec();
    if(!supplier_data){
      return res.status(401).json({
        msg: "this product NOT found",
        type: "NOT_EXIST",
        code: 603,
      });
    }
    if(!product_data?.for_company.equals(supplier_data?.for_company)){
      res.status(403).json({
        msg: "the supplier is not registered with this company",
        type: "NOT_AUTHORISED",
        code: 604,
      })
    }
    const updated_product = await product.findByIdAndUpdate(product_data?._id,{
      $addToSet:{product_suppliers:supplier_data?._id}
    },{new:true});
    const {_id, createdAt,updatedAt,__v,...data}= updated_product._doc
    
    res.status(200).json({ msg: "supplier added to product", data, type: "SUCCESS", code: 600 });
} catch (error) {
  res
    .status(500)
    .json({
      msg: "error adding supplier to product",
      data: error,
      type: "FAILED",
      code: 601,
    });
}
})
//   // update staff record
//   router.put("/staff/:staff_id/update", verify, async (req, res) => {
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


// get all products for a specific category

// 
router.get("/products/:category_id/all", verify,isCompanyStaff, async (req, res) => {
  const { category_id } = req.params
  if (!category_id) return res.status(403).json({
    msg: "category_id is missing, check parameter",
    type: "NOT_EXIST",
    code: 603,
  });
  const companyData = req.req_company;

  const fetchCategory = category.findOne({ category_id }, 'category_id name company');

  try {
    const categoryData = await fetchCategory.exec()
    if (!categoryData) return res.status(403).json({
      msg: "category NOT found",
      type: "NOT_EXIST",
      code: 603,
    });

    if (companyData?._id.toString() !== categoryData?.company.toString()) return res.status(403).json({
      msg: "you're NOT authorized to fetch all products for THIS category and company",
      type: "NOT_AUTHORISED",
      code: 604,
    });

    const allProducts = await product.find({ categories: { $in: [categoryData?._id] } }, '-company -createdAt -updatedAt -__v')

    res.status(200).json({ msg: `fetch all ${categoryData?.name} products success`, data: { category_products: allProducts, category: { id: categoryData?.category_id, name: categoryData?.name } }, type: "SUCCESS", code: 600 });

  } catch (error) {
    res.status(500).json({ msg: "fetching products failed", data: err, type: "FAILED", code: 602 });

  }
})

// get all products
// router.get("/products/all", verify,isCompanyStaff, async (req, res) => {
  
//   const companyData = req.req_company;

//   try {

//     const allProducts = await product.find({for_company:companyData?._id.toString()},'-company -createdAt -updatedAt -__v')

//     res.status(200).json({ msg: `fetch all products success`, data: allProducts, type: "SUCCESS", code: 600 });

//   } catch (error) {
//     res.status(500).json({ msg: "fetching all products failed", data: err, type: "FAILED", code: 602 });

//   }
// })

router.get("/products/all", verify, isCompanyStaff, async (req, res) => {
  const companyData = req.req_company;

  try {
    const allProducts = await product.find({ for_company: companyData?._id.toString() }, '-company -createdAt -updatedAt -__v')
      .populate('categories', 'category_id name')
      .exec();

    const formattedProducts = allProducts.map(prod => {
      const { _id, __v, createdAt, updatedAt, categories, for_company, ...data } = prod._doc;
      const categoriesFormatted = categories.map(cat => ({
        cat_id: cat.category_id,
        name: cat.name,
      }));
      return {
        ...data,
        categories: categoriesFormatted
      };
    });

    res.status(200).json({ 
      msg: `fetch all products success`, 
      data: formattedProducts, 
      type: "SUCCESS", 
      code: 600 
    });
  } catch (error) {
    res.status(500).json({ 
      msg: "fetching all products failed", 
      data: error, 
      type: "FAILED", 
      code: 602 
    });
  }
});


export default router;