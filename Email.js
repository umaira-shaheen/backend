const nodemailer = require('nodemailer');

const sendEmail = (to, subject, text, as_html=false) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'umairaraja01@gmail.com',
      pass: 'pxknibizrdlxknxl'
    }
  });
  let mailOptions = {}
  if(as_html)
  {
    mailOptions = {
      from: 'noreply@ukcell.com',
      to,
      subject,
      html: text
    };
  }
  else {
    mailOptions = {
      from: 'noreply@ukcell.com',
      to,
      subject,
      text
    };
  }

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