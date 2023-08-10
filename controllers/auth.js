const { user } = require("../models/Users");
const sendEmail= require("../Email");
async function get_data(req,res,next)
{
  res.send(req.query.name);
}

async function get_age(req,res,next) 
{
  res.send(req.query.age); 
}

async function get_marks(req,res,next)
{
  res.send(req.query.marks);
}

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
        // when you add an assignment
        // get course of that assignment
        // const user_info = course.studnet_ids .map(id => await user.getbyId(id))
        // based on course.students get info from Users table , user = ["email1@gmail.com", "email2@gmail.com"]
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


module.exports={get_data, get_age, get_marks , validate, register, logout};