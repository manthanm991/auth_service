const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.MAIL_USERNAME, pass: process.env.MAIL_PASSWORD }
});

const sendResetPasswordEmail = async (to, name, resetURL) => {
  const templatePath = path.join(__dirname, '../templates/resetPassword.ejs');
  const html = await ejs.renderFile(templatePath, { user: { name }, resetURL });
  return transporter.sendMail({ to, subject: 'Password Reset Request', html, });
};

module.exports = { sendResetPasswordEmail };