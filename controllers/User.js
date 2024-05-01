var mongoose=require('mongoose');
const {user}=require("../models/Users");
const fs = require('fs');
const sendEmail = require("../Email");
const crypto = require('crypto');
async function GetUser(req,res,next)
{
  const filter = {};
  const AllUsers = await user.find(filter);
  res.send(AllUsers);
  
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
async function  AddUser(req,res,next)
{
  const user_password = generateRandomString(8); // Generate random token
  user.findOne({Email:req.body.email},function(error,docs)
  {
    if(docs)
    {
      res.send("Email Address already exists!");
    }
    else{

      const first_user=new user({First_name:req.body.first_name, Last_name:req.body.last_name, Email:req.body.email,Password:user_password, Address:req.body.address, Phone_no:req.body.phone_no, Role:req.body.role});
      first_user.save();
      const userEmail = req.body.email // Specify the recipient's email address
      const subject = 'Your Account Registered!';
      const emailContent = `
          <html>
            <body>
              <h1>Hello!</h1>
              <p>Here is your <strong>password and email</strong> to get login to UKCELL's Website  .${userEmail} and ${user_password}</p>
              <p><a href="http://localhost:3000/auth/login?password=${user_password}">Click here</a> to visit our website and get login</p>
            </body>
          </html>
        `;  
      try {
        sendEmail(userEmail, subject, emailContent, true);
        res.send("Email Sent to user and account registered")
      } catch (error) {
        console.log(error)
        res.send(" email not sent")
      }
         // res.send(docs);
    }
  })
}
async function DeleteUser(req,res,next)
{
  
  user.findByIdAndRemove({_id: mongoose.Types.ObjectId(req.query.temp_id)}, (err) =>{

    if(err){
        res.send({"indicator":"error","messege":err}); 
    }
    else{
      res.send({"indicator":"success","messege":"User Record deleted successfully"});
    }
 })
};
async function FindUser(req,res,next)
{
  
  const UserData = await user.findOne({_id : mongoose.Types.ObjectId(req.query.temp_id)});
  res.send(UserData);
};
async function EditUser(req,res,next)
{
  
  user.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.id), {First_name:req.body.first_name, Last_name:req.body.last_name, Email:req.body.email, Address:req.body.address, Phone_no:req.body.phone_no, Role:req.body.role}, function(error,docs)
  {
    if(error)
    {
      res.send("Failed to update the User Record");
    }
    else
    {
     res.send("success");
    }
      
      // res.send(docs);
    })
 };

 async function EditProfile(req,res,next)
{
  
  if(!req.session.user)
  {
    res.status(403).send('Not logged in')
    return
  }
  file_path = null
  if(req.file)
  {
    const file = req.file;
    file_path = file.path;
  }
  if(file_path)
  {
    user.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.id), {UserName:req.body.user_name, First_name:req.body.first_name, Last_name:req.body.last_name, Email:req.body.email, Address:req.body.address, Phone_no:req.body.phone_no, Role:req.body.role,User_img:file_path,  Bio: req.body.bio}, function(error,docs)
    {
      if(error)
      {
        res.send({"indicator": "error", "messege": "Failed to update your profile" });
      }
      else
      {
       res.send({'indicator': 'success', 'path' : file_path, "messege": "Profile Updated successfully" })
      }
        
        // res.send(docs);
      })
  }
  else
  {
    user.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.id), {UserName:req.body.user_name, First_name:req.body.first_name, Last_name:req.body.last_name, Email:req.body.email, Address:req.body.address, Phone_no:req.body.phone_no, Role:req.body.role, Bio: req.body.bio}, function(error,docs)
    {
      if(error)
      {
        res.send({"indicator": "error", "messege": err });
      }
      else
      {
        res.send({'indicator': 'success', 'path' : null, "messege": "Profile Updated successfully" })
      }
        
        // res.send(docs);
      })
  }
  
 };

 

module.exports={GetUser,AddUser,FindUser,EditUser,DeleteUser, EditProfile};
