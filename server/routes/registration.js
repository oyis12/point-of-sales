import express from 'express';
import CryptoJS from "crypto-js";
import companies from '../models/company.js'
import mongoose from 'mongoose';
import staff from '../models/staff.js';
import company from '../models/company.js';
import verifyToken from '../middleware/verification.js';

const router = express.Router();

//=========create the company=========
router.post("/company", verifyToken, async (req, res) => {
    const {
        name,
        phone,
        email,
        house_number,
        street,
        landmark,
        city,
        country,
        logo,
    } = req.body

    if (!req.user?.previleges.includes(111)) return res.status(403).json({
        msg: "you're not authorized to create company",
        type: "NOT_AUTHORISED",
        code: 604,
    });
    try {
        // console.log("test=====>", req.user.company, req.user, req.user.company?._id,)
        const checkForCompany = await companies.findById(req.user?.company?._id, 'company_id name company_admin')
        if (checkForCompany) return res.status(403).json({ msg: "you have created a company already", type: "EXIST", code: 602 });
        const c_id = "CMP" + Math.floor(Math.random() * 10406 + 2);
        const newCompany = new companies({
            _id: req.user?.company?._id,
            id: c_id,
            name,
            phone,
            email,
            address: {
                house_number,
                street,
                landmark,
                city,
                country
            },
            logo: logo ? logo : "",
            admins: [req.user?._id]
        })
        const savedCompany = await newCompany.save();
        const { createdAt, updatedAt, _id, __v, admins, ...data } = savedCompany._doc//filter company response
        // console.log("data==>",data)
        res.status(201).json({ msg: "company created success", data, type: "SUCCESS", code: 600 });
    } catch (error) {
        res.status(500).json({ msg: "error creating company", data: error, type: "FAILED", code: 601 });
    }
})

// =====create company-admin=======
router.post('/admin', async (req, res) => {
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
        // role,//"company_admin"
        password
    } = req.body

    const id = "ADM" + Math.floor(Math.random() * 105700 + 1);

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
            previleges: [111],
            company: new mongoose.Types.ObjectId(),
            status: "active",
            password: CryptoJS.AES.encrypt(password, process.env.PW_CRYPT).toString()
        }
    )

    try {
        const checkForStaff = await staff.findOne({ $or: [{ email }, { phone }] }, 'staff_id first_name last_name');
        if (checkForStaff) return res.status(403).json({ msg: "this email and/or phone has been used by another user", type: "EXIST", code: 602 });

        const savedStaff = await newStaff.save();
        const { password, _id, createdAt, updatedAt, __v, company, ...data } = savedStaff._doc //filter the response

        res.status(201).json({ msg: "admin created success", data: { ...data }, type: "SUCCESS", code: 600 });

    } catch (error) {
        res.status(500).json({ msg: "error creating admin++", data: error, type: "FAILED", code: 601 });
    }

})

export default router;