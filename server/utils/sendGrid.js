import sgMail from '@sendgrid/mail'


const sendGrid =(options)=>{

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: options?.user_email, // Change to your recipient
  from: 'ojiinnocent@gmail.com', // Change to your verified sender
  subject: options?.subject,
  text: options?.message,
  html: options?.html,
} 
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent success')
  })
  .catch((error) => {
    console.error(error)
  })
}

export default sendGrid