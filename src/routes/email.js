require("dotenv").config();
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

router.route("/").post((req, res) => {
  const { from, subject, text } = req.body;
  const mailOptions = {
    from: "tlaruddo2test@gmail.com",
    to: "tlaruddo2@gmail.com",
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw error;
    } else {
      res.status(200).send(info.response);
    }
  });
});

module.exports = router;
