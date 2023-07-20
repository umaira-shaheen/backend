var mongoose=require('mongoose');
const {user}=require("../models/Users");
const fs = require('fs');
async function GetUser(req,res,next)
{
  const filter = {};
  const AllUsers = await user.find(filter);
  res.send(AllUsers);
  
}
async function  AddUser(req,res,next)
{
  user.findOne({Email:req.body.email},function(error,docs)
  {
    if(docs)
    {
      res.send("Email Address already exists!");
    }
    else{

      const first_user=new user({First_name:req.body.first_name, Last_name:req.body.last_name, Email:req.body.email, Address:req.body.address, Phone_no:req.body.phone_no, Role:req.body.role});
      first_user.save().then((result) => res.send("success"))
     .catch((error) => res.send(error));
     
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
