var mongoose=require('mongoose');
const {course}=require("../models/Courses");

async function  AddCourse(req,res,next)
{
  res.send(req.session.user);

  // course.findOne({Course_code:req.body.course_code},function(error,docs)
  // {
  //   if(docs)
  //   {
  //     res.send("Course with the same coursecode exists");
  //   }
  //   else{

  //     const first_course=new course({Course_title:req.body.course_name, Course_code:req.body.course_code, Course_category:req.body.Category, start_date:req.body.start_date, end_date:req.body.end_date, description:req.body.Description});
  //     first_course.save().then((result) => res.send("success"))
  //    .catch((error) => res.send(error));
     
  //     // res.send(docs);
  //   }
  // })
}
async function GetCourse(req,res,next)
{
  const filter = {}; 
  const AllCourses = await course.find(filter);
  res.send(AllCourses);
  
}
async function DeleteCourse(req,res,next)
{
  
  course.findByIdAndRemove({_id: mongoose.Types.ObjectId(req.query.temp_id)}, (err) =>{

    if(err){
        res.send({"indicator":"error","messege":err}); //server run kr k check kren
    }
    else{
      res.send({"indicator":"success","messege":"Course deleted successfully"});
    }
 })
};
async function FindCourse(req,res,next)
{
  
  const CourseData = await course.findOne({_id : mongoose.Types.ObjectId(req.query.temp_id)});
  res.send(CourseData);
};
async function  EditCourse(req,res,next)
{
  
  course.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.id), {Course_title:req.body.course_name, Course_code:req.body.course_code, Course_category:req.body.Category, start_date:req.body.start_date, end_date:req.body.end_date, description:req.body.Description}, function(error,docs)
  {
    if(error)
    {
      res.send("Failed to update the course");
    }
    else
    {
     res.send("success");
    }
      
      // res.send(docs);
    })
 };

module.exports={AddCourse, GetCourse, DeleteCourse, FindCourse,EditCourse};