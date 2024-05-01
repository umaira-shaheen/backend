var mongoose = require('mongoose');
const { course } = require("../models/Courses");
const fs = require('fs');
async function AddCourse(req, res, next) {
  const file = req.file;
  const file_path = file.path;
  // res.send(req.session.user);
  if (req.session.user.Role === "Admin") {
    const admin_id = req.session.user._id;
    course.findOne(
      {
        $or: [
          { Course_code: req.body.course_code },
          { Course_title: req.body.course_name }
        ]
      },
      function (error, docs) {      
        if (docs) {
        res.send("Course with the same coursecode or coursename exists");
      }
      else {

        const first_course = new course({ created_by: admin_id, Course_title: req.body.course_name, Course_code: req.body.course_code, course_img: file_path, status: req.body.status, Course_category: req.body.Category, start_date: req.body.start_date, end_date: req.body.end_date, description: req.body.Description });
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
    const course_id = req.body.course_id;
    course.findOne({ _id: course_id }, function (error, docs) {
      if (!docs) {
        res.send("Course not found");
      }
      else {
        const teacher_id = req.body.teacher_id;
        course.findOne({ assigned_to: teacher_id }, function (error, docs) {
          if (docs) {
            res.send("You have already assigned this course to this teacher");
          }
          else {
            course.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.course_id), { assigned_to: req.body.teacher_id }, { new: true }, function (error, docs) {
              if (error) {
                res.send("Failed to update the course");
              }
              else {
                res.send("success!");
              }

              // res.send(docs);
            })
          }
        })
      }
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

  const file = req.file;
  const file_path = file.path;
  course.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.id), { Course_title: req.body.course_name, Course_code: req.body.course_code,course_img: file_path, Course_category: req.body.Category, start_date: req.body.start_date, end_date: req.body.end_date, description: req.body.Description, status: req.body.status }, function (error, docs) {
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
  else if (req.session.user.Role == "Teacher") {
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

async function EnrollCourse(req, res, next) {

  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  if (req.session.user.Role === 'Student') {

    const courseId = mongoose.Types.ObjectId(req.query.temp_id);
    const studentId = mongoose.Types.ObjectId(req.session.user._id);

    try {
      const courseData = await course.findOne({ _id: courseId });

      if (!courseData) {
        res.status(404).send('Course not found');
        return;
      }

      if (courseData.Students && courseData.Students.includes(studentId)) {
        res.status(200).send('You are already enrolled in this course');
        return;
      }
      // Add the student's ID to the course's Students array
      else if (courseData.Students) {
        courseData.Students.push(studentId);
        await courseData.save();
        res.status(200).send('Enrollment successful');
      }
      else {
        my_obj = [req.session.user._id]
        courseData.Students = my_obj
        await courseData.save();
        res.status(200).send('Enrollment successful');
      }

    }
    catch (error) {
      console.log(error)
      res.status(500).send(error);
    }
  }
  else {
    res.status(403).send('Only students can enroll in courses');
  }



}
async function StudentCourses(req, res, next) {

  if (!req.session.user) {
    res.status(403).send({ "message": "Not logged in", "data": null })
    return
  }

  if (req.session.user.Role == "Student") {
    const studentId = mongoose.Types.ObjectId(req.query.temp_id);

    try {
      const courseData = await course.find({ Students: studentId });
      console.log(courseData);
      if (!courseData) {
        res.status(404).send({ "message": 'No Course Found', "data": null });
        return;
      }

      else {
        res.send({ "message": "success", "data": courseData });
      }

    }
    catch (error) {
      console.log(error)
      res.status(500).send({ "message": "error", "data": error });
    }
  }
  else {
    res.send({ "message": "only student can access this", "data": null });
  }

}






module.exports = { AddCourse, GetRecentCourse, DeleteCourse, GetAllCourse, FindCourse, EditCourse, GetTeacherCourses, AssignCourse, EnrollCourse, StudentCourses };