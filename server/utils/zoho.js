import nodemailer from 'nodemailer';


const zohoMail = async(options)=>{
    // Create a transporter object using SMTP

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465, // Use port 587 for TLS
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // Your Zoho email address
        pass: process.env.EMAIL_PASS, // App-specific password generated earlier
    },
});

// Define email options
const mailOptions = {
    from: process.env.EMAIL_USER,
    to: options.user_email,
    subject: options?.msg_title,
    text: options?.message,
};

// Send email
await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Email sent:', info.response);
    }
});

}
 export default zohoMail;