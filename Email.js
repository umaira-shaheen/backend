const nodemailer = require('nodemailer');

const sendEmail = (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'umairaraja01@gmail.com',
      pass: 'pxknibizrdlxknxl'
    }
  });

  const mailOptions = {
    from: 'noreply@ukcell.com',
    to,
    subject,
    text
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        reject(error);
      } else {
        console.log('Email sent:', info.response);
        resolve(info.response);
      }
    });
  });
};

module.exports = sendEmail;