var mongoose=require('mongoose');
const {user}=require("../models/Users");
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
        res.send({"indicator":"error","messege":err}); //server run kr k check kren
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

module.exports={GetUser,AddUser,FindUser,EditUser,DeleteUser};