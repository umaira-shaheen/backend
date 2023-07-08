const { user } = require("../models/Users");

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
  user.findOne({Email:req.body.email},function(error,docs)
  {
    if(docs)
    {

      res.send("An account with the same email aLready exists");
    }
    else{

      const first_user=new user({First_name:req.body.Firstname, Last_name:req.body.Lastname, Email:req.body.email,Password:req.body.password, Role: req.body.role});
      first_user.save().then((result) => res.send("successfully inserted"))
     .catch((error) => res.send(error));
     
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