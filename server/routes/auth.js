import express from "express";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import staff from "../models/staff.js";
// import sendEmail from '../utils/email.js'
// import sendGrid from "../utils/sendGrid.js";
import zohoMail from "../utils/zoho.js";
import moment from "moment";


const router = express.Router();

// login===
router.post("/accounts/auth", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(401).json({
    msg: "login data missing",
    type: "WRONG_OR_MISSING_PAYLOAD",
    code: 605,
  });
  try {
    // check the kind of input supplied by the user for login
    const userData = await staff.findOne({ email }, '-_id -updatedAt -__v')
      .populate('company', 'id')
      .populate('office', 'id address');

    if (!userData) {
      return res.status(401).json({
        msg: "user not found, signup",
        type: "WRONG_OR_MISSING_PAYLOAD",
        code: 605,
      });
    } else {
      const bytes = CryptoJS.AES.decrypt(
        userData?.password,
        process.env.PW_CRYPT
      );
      const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

      if (originalPassword !== password) {
        return res.status(401).json({
          msg: "wrong login credentials",
          type: "WRONG_OR_MISSING_PAYLOAD",
          code: 605,
        });
      } else {
 
        const access_token = jwt.sign(
          {
            id: userData?.id,
            email: userData?.email,
            phone: userData?.phone
          },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
          // 25minutes 1 day
        );
        // create a refresh token for loggedin user
        const refresh_token = jwt.sign(
          {
            email: userData?.email,
            roles: userData?.previleges,
            company: userData?.company?.id,
            office: userData?.office?.id,
            status: userData?.status,
            id: userData?.id,
          },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
          // 30m
        );
        // console.log("tokens=====>", accessToken, refreshToken);
        // save the refresh token to the loggedin user incase o
        const updated_user = await staff.findOneAndUpdate(
          { email },
          { $set: { refresh_token,last_loggin:moment()} },{new:true}
        );
        // console.log("let's set cookies for loggedin=>", refreshToken)
        res.cookie("jwt", refresh_token, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        // ========test email sending======
        // 
        // const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/resetPassword`;
        // const message = `SENDGRID::=>please reset your password with this link\n\n${resetPasswordUrl}\n\nThis reset link is valid for only 10 minutes.`;
        
        //   await zohoMail({
        //     user_email: 'ubasioji@gmail.com', // Change to your recipient
        //     // subject: 'Sending with SendGrid is Fun',
        //     // message,
        //     // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        //   });
          // res.status(200).json({ msg: "email send success", type: "SUCCESS", code: 600 });
        
        
        // =======test end============
        const {
          password: saved_password,
          updatedAt,
          refresh_token: user_refresh,
          first_name,
          last_name,
          last_loggin,
          // phone,
          __v,
          _id,
          company,
          ...data
        } = userData._doc;
        // { msg: "staff created success", data, type: "SUCCESS", code: 600 }
        // console.log("looged in==>", userData)
        res.status(200).json({ msg: "login success", data: { user: { ...data, full_name: `${first_name} ${last_name}`,last_loggin:updated_user?.last_loggin, company: { id: userData?.company?.id, name: userData?.company?.name } }, access_token }, type: "SUCCESS", code: 600 });
      }
    }
  } catch (err) {
    res.status(500).json({ msg: err, type: "FAILED", code: 602 });
  }
});

export default router;