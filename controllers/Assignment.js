var mongoose = require('mongoose');
const { assignment } = require("../models/Assignment");
const { course } = require("../models/Courses");
async function GetAssignment(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  const filter = {};
  const AllAssignments = await assignment.find(filter);
  res.send(AllAssignments);

}
async function AddAssignment(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  if (req.session.user.Role === "Teacher") {
    const first_assignment = new assignment({ Assignment_title: req.body.assignment_title, Date: req.body.date, Total_marks: req.body.total_marks, Status: req.body.status, description: req.body.description,Assignment_Course: req.body.Assignment_course });
    first_assignment.save().then((result) => res.send("success"))
      .catch((error) => res.send(error));
  }


  else {
    res.status(403).send("Only teacher can access this");
  }

  // res.send(docs);
};

async function DeleteAssignment(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  if (req.session.user.Role === "Teacher") {
    assignment.findByIdAndRemove({ _id: mongoose.Types.ObjectId(req.query.temp_id) }, (err) => {

      if (err) {
        res.send({ "indicator": "error", "messege": err }); //server run kr k check kren
      }
      else {
        res.send({ "indicator": "success", "messege": "Assignment deleted successfully" });
      }
    })
  }


  else {
    res.status(403).send("Only teacher can access this");
  }
};
async function FindAssignment(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  const AssignmentData = await assignment.findOne({ _id: mongoose.Types.ObjectId(req.query.temp_id) });
  res.send(AssignmentData);
};
async function FindAssignmentQuestion(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  const AssignmentData = await assignment.findOne({ _id: mongoose.Types.ObjectId(req.query.temp_id) });
  res.send(AssignmentData);
};
async function EditAssignment(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  if (req.session.user.Role === "Teacher") {
    assignment.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.id), { Assignment_title: req.body.assignment_title, Date: req.body.date, Total_marks: req.body.total_marks, Status: req.body.status , description:req.body.description }, function (error, docs) {
      if (error) {
        res.send("Failed to update the Assignment");
      }
      else {
        res.send("success");
      }

      // res.send(docs);
    })
  }


  else {
    res.status(403).send("Only teacher can access this");
  }
};
async function GetTeacherAssignment(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }

  if(req.session.user.Role=="Teacher")
  {
    const teacherId = mongoose.Types.ObjectId(req.query.temp_id);
    const courseData = await course.find({ assigned_to: teacherId });

    if (!courseData || courseData.length === 0) {
      res.status(404).send({ message: 'No Course Found', data: null });
      return;
    }

    const assignmentData = [];
    for (const courseItem of courseData) {
      const course_name = courseItem.Course_title;
      const assignments = await assignment.find({ Assignment_Course: course_name });
      assignmentData.push(...assignments);
    }
    if (assignmentData.length === 0) {
      res.status(404).send({ message: 'No Assignment Found', data: null });
      return;
    } 
    else
     {
      res.send({ message: 'success', data: assignmentData });
    }
  }
  else 
  {
    res.send({ message: 'Only Teacher can access this', data: null });
  }


}
async function GetStudentAssignment(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }

  if(req.session.user.Role=="Student")
  {
    const studentId = mongoose.Types.ObjectId(req.query.temp_id);
    const courseData = await course.find({ Students: studentId });

    if (!courseData || courseData.length === 0) {
      res.status(404).send({ message: 'No Course Found', data: null });
      return;
    }

    const assignmentData = [];
    for (const courseItem of courseData) {
      const course_name = courseItem.Course_title;
      const assignments = await assignment.find({ Assignment_Course: course_name });
      assignmentData.push(...assignments);
    }
    if (assignmentData.length === 0) {
      res.status(404).send({ message: 'No Assignment Found', data: null });
      return;
    } 
    else
     {
      res.send({ message: 'success', data: assignmentData });
    }
  }
  else 
  {
    res.send({ message: 'Only Student can access this', data: null });
  }


}
async function SearchAssignment(req, res, next) {

  if (!req.session.user) {
    res.status(403).send('Not logged in');
    return
  }
  if (req.session.user.Role == "Student") {
    const AssignmentData = await assignment.findOne({ _id: mongoose.Types.ObjectId(req.query.temp_id) });
    res.send({ message: 'success', data: AssignmentData });
  }
  
  else {
    res.send({ message: 'Only students can access this', data: null });
  }

};


module.exports = { AddAssignment, GetAssignment, DeleteAssignment, EditAssignment, FindAssignment, GetTeacherAssignment, GetStudentAssignment, SearchAssignment ,FindAssignmentQuestion};

