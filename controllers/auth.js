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
    else
    {
      res.send(docs);
    }
  })
}
async function register(req, res,next) 
{
  // madam g... findOne? aap data insert kr rhi hen ya find kr rhi hen?
  //mujay pata tha ap ko samaj ni ayegi
  //call krein samjhaun
  // oh acha acha... advance kaam kr rhi hen.. pely email cec kr rhihen k db me a ha ya nai
  // good good
  //ni ni call to krein samjhati hu
  // acha 1 min
  // internet behtreen chal rha aaj to aap ka
  user.findOne({email:req.body.email},function(error,docs)
  {
    if(docs)
    {
      res.send("Email ALready exists");
    }
    else{

      const first_user=new user({name:req.body.name, email:req.body.email,password:req.body.password});
      first_user.save().then((result) => res.send("successfully inserted"))
     .catch((error) => res.send(error));
     
      // res.send(docs);
    }
  })
};
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

module.exports={get_data, get_age, get_marks , validate, register};