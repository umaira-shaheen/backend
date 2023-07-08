var mongoose = require('mongoose');
const { course } = require("../models/Courses");
const fs = require('fs');
async function AddCourse(req, res, next) {
  const file = req.file;
  const file_path = file.path;
  // res.send(req.session.user);
  if (req.session.user.Role === "Admin") {
    const admin_id = req.session.user._id;
    course.findOne({ Course_code: req.body.course_code }, function (error, docs) {
      if (docs) {
        res.send("Course with the same coursecode exists");
      }
      else {

        const first_course = new course({ created_by: admin_id, Course_title: req.body.course_name, Course_code: req.body.course_code,course_img:file_path, status:req.body.status, Course_category: req.body.Category, start_date: req.body.start_date, end_date: req.body.end_date, description: req.body.Description });
        first_course.save().then((result) => res.send("success"))
          .catch((error) => res.send(error));
      }
    })
  }
  else {
    res.status(403).send("Only administrator can access this");
  }


}
async function AssignCourse(req, res, next) {

  if (req.session.user.Role === "Admin") {

    course.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.course_id), { assigned_to: req.body.teacher_id }, { new: true }, function (error, docs) {
      if (error) {
        res.send("Failed to update the course");
      }
      else {
        res.send("success");
      }

      // res.send(docs);
    })
  }
  else {
    res.status(403).send("Only administrator can access this");
  }

}
async function GetRecentCourse(req, res, next) {
  const filter = {};
  const AllCourses = await course.find(filter).limit(6);
  res.send(AllCourses);

}
async function GetAllCourse(req, res, next) {
  const filter = {};
  const AllCourses = await course.find(filter);
  res.send(AllCourses);

}
async function DeleteCourse(req, res, next) {


  course.findByIdAndRemove({ _id: mongoose.Types.ObjectId(req.query.temp_id) }, (err) => {

    if (err) {
      res.send({ "indicator": "error", "messege": err }); //server run kr k check kren
    }
    else {
      res.send({ "indicator": "success", "messege": "Course deleted successfully" });
    }
  })



};
async function FindCourse(req, res, next) {

  const CourseData = await course.findOne({ _id: mongoose.Types.ObjectId(req.query.temp_id) });
  res.send(CourseData);
};
async function EditCourse(req, res, next) {
   
   
    course.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.id), { Course_title: req.body.course_name, Course_code: req.body.course_code, Course_category: req.body.Category, start_date: req.body.start_date, end_date: req.body.end_date, description: req.body.Description, status:req.body.status }, function (error, docs) {
      if (error) {
        res.send("Failed to update the course");
      }
      else {
        res.send("success");
      }
    } 
  );
}


async function GetTeacherCourses(req, res, next) {

 
    if (req.session.user.Role == "Admin") {
      // get all courses
      const filter = {};
      const AllCourses = await course.find(filter);
      res.send(AllCourses);
    }
    else if(req.session.user.Role == "Teacher") {
      const teacher_id = req.session.user._id;
      course.find({ assigned_to: teacher_id }, function (err, courses) {
        if (err) {
          console.log("Error finding courses: ", err);
          return;
        }

        res.send(courses);
      });
    }
  
}


module.exports = { AddCourse, GetRecentCourse, DeleteCourse, GetAllCourse, FindCourse, EditCourse, GetTeacherCourses, AssignCourse };