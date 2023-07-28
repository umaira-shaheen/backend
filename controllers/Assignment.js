var mongoose = require('mongoose');
const { assignment } = require("../models/Assignment");
const { course } = require("../models/Courses");
const { user } = require("../models/Users");
async function GetAssignment(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  const filter = {};
  const AllAssignments = await assignment.find(filter);
  res.send(AllAssignments);

}
async function FindAssignment(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  const AssignmentData = await assignment.findOne({ _id: mongoose.Types.ObjectId(req.query.temp_id) });
  res.send(AssignmentData);
};
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
      response_data = []
      for (const current_assignment of assignmentData) {
        const student_ids = current_assignment.Submitted_by;
        const students = student_ids.map(studentId => user.findById(studentId));
        const studentsData = await Promise.all(students);
        let current_assignment_names = []
        const studentData = studentsData.map(student => {
          current_assignment_names.push({ "student_id": student._id, "student_Firstname": student.First_name, "student_Lastname": student.Last_name })
        })

        // quizData.push(...studentData);
        new_obj = { ...current_assignment, ...{ "students": current_assignment_names } }
        response_data.push(new_obj);
      }
      
      res.send({ message: 'success', data: response_data });
    }
  }
  else 
  {
    res.send({ message: 'Only Teacher can access this', data: null });
  }


}
async function GetOnlyTeacherAssignment(req, res, next) {
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
      
      res.send({ message: 'success', data: assignmentData  });
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
      for (const current_assignment of assignments) {
        // Check if the student's ID is present in the Submitted_by array for each quiz
        const submitted_by_ids = current_assignment.Submitted_by.map(submittedBy => submittedBy.toString());
        var has_submitted = submitted_by_ids.includes(studentId.toString());
        let sub_assignment = { ...current_assignment, ...{ "has_submitted": has_submitted } }
        assignmentData.push(sub_assignment);
      }
      // assignmentData.push(...assignments);
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
async function UploadAssignment(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  if (req.session.user.Role === 'Student') {

    const assignmentId = mongoose.Types.ObjectId(req.query.temp_id);
    const studentId = mongoose.Types.ObjectId(req.session.user._id);

    file_path = null
    if (req.file) {
      const file = req.file;
      file_path = file.path;
    }
    if (file_path) {
      try {
        const assignmentData = await assignment.findOne({ _id: assignmentId });

        if (!assignmentData) {
          res.status(404).send('Assignment not found');
          return;
        }

        if (assignmentData.Submitted_by && assignmentData.Submitted_files && assignmentData.Submitted_by.includes(studentId)) {
          res.status(200).send('You have already submitted the quiz');
          return;
        }
        // Add the student's ID to the course's Students array
        else if (assignmentData.Submitted_by && assignmentData.Submitted_files) {
          assignmentData.Submitted_files.push(file_path);
          assignmentData.Submitted_by.push(studentId);
          await assignmentData.save();
          res.status(200).send('Assignment Submitted!');
        }
        else {
          const student_Ids = [req.session.user._id];
          const Files_path = [file_path];
          assignmentData.Submitted_by = student_Ids;
          assignmentData.Submitted_files = Files_path;
          await assignmentData.save();
          res.status(200).send('Assignment Submitted');
        }

      }
      catch (error) {
        console.log(error)
        res.status(500).send(error);
      }
    }
  }
  else {
    res.status(403).send('Only students can submit the Assignment');
  }


}
async function UploadMarks(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in');
    return
  }
  if (req.session.user.Role == "Teacher") {
    try {


      const student_id = mongoose.Types.ObjectId(req.body.Student_ID);
      const obtainedMarks = req.body.obtained_marks;
      const assignment_data = await assignment.findOne({ _id: mongoose.Types.ObjectId(req.body.assignment_id) });
      if (!assignment_data) {
        res.status(404).send({ message: 'Assignment not found', data: null });
        return;
      }
      const studentIndex = assignment_data.Submitted_by.indexOf(student_id);
      console.log(studentIndex);
      if (studentIndex !== -1) {
        // Update the obtained_marks array for the specific student index
        assignment_data.obtained_marks[studentIndex] = obtainedMarks;

        // Save the updated quiz document
        const updatedAssignment = await assignment_data.save();

        res.send({ message: 'Marks uploaded successfully', data: updatedAssignment });
      }
      else {
        res.status(404).send({ message: 'Student not found in Submitted_by array', data: null });
      }
    }
    catch (error) {
      res.status(500).send({ message: 'Error uploading marks', data: null });
    }
  }
  else {
    res.status(403).send({ message: 'Only Teacher can access this', data: null });

  }

}

module.exports = { AddAssignment, GetAssignment, DeleteAssignment, EditAssignment, FindAssignment, GetTeacherAssignment, GetStudentAssignment, SearchAssignment ,FindAssignmentQuestion,UploadAssignment, UploadMarks, GetOnlyTeacherAssignment, FindAssignment};

