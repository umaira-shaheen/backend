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

  user.findOne({email:req.body.email , password:req.body.password},function(error,docs)
  {
    if(docs)
    {
      // create session here
      req.session.user = {"email": req.body.email};
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
}
async function  AddCourse(req,res,next)
{
  course.findOne({courseCode:req.body.coursecode},function(error,docs)
  {
    if(docs)
    {

      res.send("Course with the same coursecode exists");
    }
    else{

      const course=new course({coursename:req.body.course_name, coursecode:req.body.course_code, category:req.body.Category, startdate:req.body.start_date, enddate:req.body.end_date, description:req.body.Description});
      course.save().then((result) => res.send("Course Added successfully"))
     .catch((error) => res.send(error));
     
      // res.send(docs);
    }
  })
}
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

module.exports={get_data, get_age, get_marks , validate, register, AddCourse};