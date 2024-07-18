import nodemailer from 'nodemailer';

const sendEmail =async(option)=>{
    // create transporter
    var transport = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
          user: process.env.MAILTRAP_USERNAME,
          pass: process.env.MAILTRAP_PW
        }
      });

    //   define email options
    const emailOptions = {
        from:'Motif support<support@Motifinc.com',
        to:option.email,
        subject:option.subject,
        text:option.message
    };

    // send the email
    await transport.sendMail(emailOptions);

}

export default sendEmail;