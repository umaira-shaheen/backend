var mongoose = require('mongoose');
const { lecture } = require("../models/Lecture");
const fs = require('fs');
const { course } = require("../models/Courses");
async function AddLecture(req, res, next) {
 res.send(req.files);
//  return;
  const lecturefilespath = req.files.map(file=>file.path);
 
  if (req.session.user.Role === "Teacher") {
       const teacher_id = req.session.user._id;
        const first_lecture = new lecture({ Added_by: teacher_id, Lecture_title: req.body.Lecture_title, Lecture_Course: req.body.Lecture_Course, Lecture_files:lecturefilespath, Lecture_Number: req.body.Lecture_Number, description: req.body.Description });
        first_lecture.save().then((result) => res.send("success"))
          .catch((error) => res.send(error));
      }
    
  
  else {
    res.status(403).send("Only Teacher can access this");
  }



}
async function GetLecture(req, res, next) {


    if (req.session.user.Role == "Teacher") {
      const teacher_id = req.session.user._id;
      lecture.find({ Added_by: teacher_id }, function (err, lectures) {
        if (err) {
          console.log("Error finding Lectures: ", err);
          return;
        }
  
        res.send(lectures);
      });
    }
  
  }
  async function FindLecture(req, res, next) {
    
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
    const LectureData = await lecture.findOne({ _id: mongoose.Types.ObjectId(req.query.temp_id) });
    res.send(LectureData);
  };
  async function StudentFindLecture(req, res, next) {
    
    // if (!req.session.user) {
    //   res.status(403).send('Not logged in')
    //   return
    // }
      let courseID=req.query.course_id;
      
      const courseData = await course.findOne({_id:courseID});
      let coursename=courseData.Course_title;
      const LectureData = await lecture.find({ Lecture_Course:coursename });

      res.send(LectureData);
    };

  async function EditLecture(req, res, next) 
  {
  
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  if (req.session.user.Role === "Teacher") {
   const teacher_id = req.session.user._id;
   const lecturefilespath = req.files.map(file=>file.path);
    lecture.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.id), { Added_by: teacher_id, Lecture_title: req.body.Lecture_title,Lecture_files:lecturefilespath, Lecture_Course: req.body.Lecture_Course, Lecture_Number: req.body.Lecture_Number, description: req.body.Description  }, function (error, docs) {
      if (error) {
        res.send("Failed to update the Lecture");
      }
      else {
        res.send("success");
      }
    }
    );
  }
}
  async function DeleteLecture(req, res, next) {
    if (!req.session.user) {
      res.status(403).send('Not logged in')
      return
    }
    if (req.session.user.Role === "Teacher") {
      lecture.findByIdAndRemove({ _id: mongoose.Types.ObjectId(req.query.temp_id) }, (err) => {
  
        if (err) {
          res.send({ "indicator": "error", "messege": err }); //server run kr k check kren
        }
        else {
          res.send({ "indicator": "success", "messege": "Lecture deleted successfully" });
        }
      })
    }
  
  
    else {
      res.status(403).send("Only teacher can access this");
    }
  };
  async function StudentLectures(req, res, next) {
    if (!req.session.user) {
      res.status(403).send('Not logged in');
      return;
    }
    
    if (req.session.user.Role === "Student") {
      const studentId = mongoose.Types.ObjectId(req.query.temp_id);
      const courseData = await course.find({ Students: studentId });
  
      if (!courseData || courseData.length === 0) {
        res.status(404).send({ message: 'No Course Found', data: null });
        return;
      }
  
      const lectures = [];
      for (const courseItem of courseData) {
        const course_name = courseItem.Course_title;
        const courseLectures = await lecture.find({ Lecture_Course: course_name });
        lectures.push(...courseLectures);
      }
  
      if (lectures.length > 0) {
        res.send({ message: 'success', data: lectures });
      } else {
        res.status(404).send({ message: 'No Lecture Found', data: null });
      }
    } else {
      res.send({ message: 'Only students can access this', data: null });
    }
  }
  
module.exports = { AddLecture, GetLecture, FindLecture, EditLecture, DeleteLecture, StudentLectures, StudentFindLecture };
