const { user } = require("../models/Users");
const sendEmail= require("../Email");
async function validate(req,res,next)
{
  user.findOne({Email:req.body.email , Password:req.body.password},function(error,docs)
  {
    if(docs)
    {
      
      req.session.user = {"email": req.body.email};
      req.session.user = docs;
      req.session.save();
      res.status(200).send(docs);
     
    }
    else
    {
      res.status(404).send('invalid credientials');
      
      // res.send(req.session);
    }
  })
}
async function register(req, res,next) 
{
  const password=req.body.password;
  const confirm_password=req.body.confirm_password;
  user.findOne({Email:req.body.email},function(error,docs)
  {
    if(docs)
    {

      res.send("An account with the same email aLready exists");
    }
    
    else if( password!==confirm_password)
    {
      res.send("Password and Confirm Password are not same");
    }
    else{

      const first_user=new user({First_name:req.body.Firstname, Last_name:req.body.Lastname, Email:req.body.email,Password:req.body.password,Confirm_Password:req.body.confirm_password,Phone_no:req.body.phone_no, Role: req.body.role});
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
async function ForgotPassword(req,res,next)
{
  user.findOne({Email:req.body.email},function(error,docs)
  {
    if(docs)
    {
      const userEmail = req.body.email // Specify the recipient's email address
      const subject = 'Forgot Password';
      const message = 'Here is the password reset link. Click here to reset your Password';
      try {
       sendEmail(userEmail, subject, message);
        res.send("Email Sent")
      } catch (error) {
        console.log(error)
        res.send(" email not sent")
      }
     
    }
    else
    {
      res.status(404).send('invalid Email');
      
      // res.send(req.session);
    }
  })
}

module.exports={ validate, register, logout, ForgotPassword};