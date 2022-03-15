const express = require('express')
const router = express.Router()

const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
    const {email, name, message} = req.body
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
    });
    
    const mailOptions = {
      from: email,
      to: 'enoshelliott.ee@gmail.com',
      subject: `${name} wants to contact you!`,
      text: message
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
})

module.exports = router