const { user } = require("../models/users");
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
  user.findOne({email:req.body.email , password:req.body.password},function(error,docs)
  {
    if(error)
    {
      res.send(error);
    }
    else{
      res.send(docs);
    }
  });
  // const email=req.body.email;
  // const password=req.body.password;
  // const email="umairaraja01@gmail.com";
  // const password ="3606";
  // if(email==req.body.email & password==req.body.password)
  // {
  //   res.send('logged in');
  // }
  // else
  // {
  //   res.send('failed');
  // }
}
module.exports={get_data, get_age, get_marks , validate};