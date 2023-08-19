const { user } = require("../models/Users");
const sendEmail = require("../Email");
const crypto = require('crypto');
async function validate(req, res, next) {
  user.findOne({ Email: req.body.email, Password: req.body.password }, function (error, docs) {
    if (docs) {

      req.session.user = { "email": req.body.email };
      req.session.user = docs;
      req.session.save();
      res.status(200).send(docs);

    }
    else {
      res.status(404).send('invalid credientials');

      // res.send(req.session);
    }
  })
}
async function register(req, res, next) {
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;
  user.findOne({ Email: req.body.email }, function (error, docs) {
    if (docs) {

      res.send("An account with the same email aLready exists");
    }

    else if (password !== confirm_password) {
      res.send("Password and Confirm Password are not same");
    }
    else {

      const first_user = new user({ First_name: req.body.Firstname, Last_name: req.body.Lastname, Email: req.body.email, Password: req.body.password, Confirm_Password: req.body.confirm_password, Phone_no: req.body.phone_no, Role: req.body.role });
      first_user.save()

      const userEmail = req.body.email // Specify the recipient's email address
      const subject = 'Account created successfully';
      const message = 'We are pleased to announce you that your account has been created at UKCELL Website.';

      try {
        sendEmail(userEmail, subject, message);
        res.send("successfully inserted")
      } catch (error) {
        console.log(error)
        res.send("successfully inserted but email not sent")
      }

      // res.send(docs);
    }
  })
}
async function logout(req, res, next) {
  req.session.destroy(err => {
    if (err) {
      res.send(err);
    } else {

      res.send('success'); // Redirect to the login page or any other page
    }
  });
}
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}

async function ForgotPassword(req, res, next) {
  user.findOne({ Email: req.body.email }, function (error, userDoc) {
    if (userDoc) {
      const token = generateRandomString(32); // Generate random token
      userDoc.Token = token; // Save token in the user's Token field
      userDoc.save();
      console.log(token);
      // save that token in token of that user
      const userEmail = req.body.email // Specify the recipient's email address
      const subject = 'Forgot Password';
      const tokenLink = `http://localhost:3000/reset-password?token=${token}`;
      const message = `
  <p>Here is the password reset link. Click <a href="${tokenLink}">here</a> to reset your password.</p>
`;
      try {
        sendEmail(userEmail, subject, message);
        res.send("Email Sent to reset your password")
      } catch (error) {
        console.log(error)
        res.send(" email not sent")
      }

    }
    else {
      res.status(404).send('invalid Email');

      // res.send(req.session);
    }
  })
}
async function CheckToken(req, res, next) {
  const token_id=req.query.token_id;
  user.findOne({ Token: token_id }, function (error, docs) {
     if(docs)
     {
        res.send("valid request");
     }
     else
     {
      res.send("invalid request");

     }
  })
  
}
async function CheckToken(req, res, next) {
  const Password=e.target.body.password;
  const Confirm_password=e.target.body.confirm_password;
  if (!req.session.user) {
    res.status(403).send('Not logged in');
    return;
  }
  const user_id=req.session.user._id;
  user.findByIdAndUpdate(mongoose.Types.ObjectId(user_id), { Password:Password, Confirm_Password:Confirm_password }, function (error, docs) {
    if (error) {
      res.send("Failed to update your password");
    }
    else {
      res.send("success");
    }

    // res.send(docs);
  })
}
module.exports = { validate, register, logout, ForgotPassword, CheckToken };