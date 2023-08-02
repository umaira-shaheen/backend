var mongoose = require('mongoose');
const { quiz } = require("../models/Quiz");
const { course } = require("../models/Courses");
const { user } = require("../models/Users");
async function GetQuiz(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  const filter = {};
  const AllQuizes = await quiz.find(filter);
  res.send(AllQuizes);

}
async function UploadQuiz(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  if (req.session.user.Role === 'Student') {

    const quizId = mongoose.Types.ObjectId(req.query.temp_id);
    const studentId = mongoose.Types.ObjectId(req.session.user._id);

    file_path = null
    if (req.file) {
      const file = req.file;
      file_path = file.path;
    }
    if (file_path) {
      try {
        const quizData = await quiz.findOne({ _id: quizId });

        if (!quizData) {
          res.status(404).send('Quiz not found');
          return;
        }

        if (quizData.Submitted_by && quizData.Submitted_files && quizData.Submitted_by.includes(studentId)) {
          res.status(200).send('You have already submitted the quiz');
          return;
        }
        // Add the student's ID to the course's Students array
        else if (quizData.Submitted_by && quizData.Submitted_files) {
          quizData.Submitted_files.push(file_path);
          quizData.Submitted_by.push(studentId);
          quizData.obtained_marks.push("-1")
          await quizData.save();
          res.status(200).send('Quiz Submitted!');
        }
        else {
          const student_Ids = [req.session.user._id];
          const Files_path = [file_path];
          quizData.Submitted_by = student_Ids;
          quizData.Submitted_files = Files_path;
          await quizData.save();
          res.status(200).send('Quiz Submitted');
        }

      }
      catch (error) {
        console.log(error)
        res.status(500).send(error);
      }
    }
  }
  else {
    res.status(403).send('Only students can submit the Quiz');
  }


}
async function AddQuiz(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  if (req.session.user.Role === "Teacher") {


    const first_quiz = new quiz({ Quiz_title: req.body.quiz_title, Start_date: req.body.start_date, End_date: req.body.end_date, Questions: req.body.questions, Status: req.body.status, Quiz_Course: req.body.quiz_course });
    first_quiz.save().then((result) => res.send({ "indicator": "success", "messege": "Quiz Added successfully" }))
      .catch((error) => res.send({ "indicator": "error", "messege": error }));

  }
  else {
    res.status(403).send("Only teacher can access this");
  }

  // res.send(docs);
};
async function DeleteQuiz(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  quiz.findByIdAndRemove({ _id: mongoose.Types.ObjectId(req.query.temp_id) }, (err) => {

    if (err) {
      res.send({ "indicator": "error", "messege": err });
    }
    else {
      res.send({ "indicator": "success", "messege": "Quiz deleted successfully" });
    }
  })
};
async function FindQuiz(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  const QuizData = await quiz.findOne({ _id: mongoose.Types.ObjectId(req.query.temp_id) });
  res.send(QuizData);
};
async function EditQuiz(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }

  quiz.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.id), { Quiz_title: req.body.quiz_title, Start_date: req.body.start_date, End_date: req.body.end_date, Questions: req.body.questions, Status: req.body.status }, function (error, docs) {
    if (error) {
      res.send("Failed to update the Quiz");
    }
    else {
      res.send("success");
    }

    // res.send(docs);
  })
};
async function GetStudentQuiz(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }

  if (req.session.user.Role == "Student") {
    const studentId = mongoose.Types.ObjectId(req.query.temp_id);
    const courseData = await course.find({ Students: studentId });

    if (!courseData || courseData.length === 0) {
      res.status(404).send({ message: 'No Course Found', data: null });
      return;
    }

    const quizData = [];
    for (const courseItem of courseData) {
      const course_name = courseItem.Course_title;
      const quizzes = await quiz.find({ Quiz_Course: course_name });
      for (const current_quiz of quizzes) {
        // Check if the student's ID is present in the Submitted_by array for each quiz
        const submitted_by_ids = current_quiz.Submitted_by.map(submittedBy => submittedBy.toString());
        let mark_obt_obj = {}
        if(current_quiz.Submitted_by.includes(studentId.toString()))
        {
          const studentIndex = current_quiz.Submitted_by.indexOf(studentId);
          const marks =  current_quiz.obtained_marks[studentIndex];
           mark_obt_obj = {"marks_obtained": marks}
        }
        else
        {
        mark_obt_obj = {"marks_obtained": "-1"}
        }
        // mark_obt_obj = { "marks_obtained": marks !== -1 ? marks : "Not marked yet" };
        
        var has_submitted = submitted_by_ids.includes(studentId.toString());
        let sub_quiz = { ...current_quiz, ...{ "has_submitted": has_submitted }, ...mark_obt_obj }
        quizData.push(sub_quiz);
      }
      // quizData.push(...quizzes);
    }
    if (quizData.length === 0) {
      res.status(404).send({ message: 'No Quiz Found', data: null });
      return;
    }
    else {

      res.send({ message: 'success', data: quizData });
    }
  }
  else {
    res.send({ message: 'Only students can access this', data: null });
  }

}
async function GetTeacherQuiz(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }

  if (req.session.user.Role == "Teacher") {
    const teacherId = mongoose.Types.ObjectId(req.query.temp_id);
    const courseData = await course.find({ assigned_to: teacherId });

    if (!courseData || courseData.length === 0) {
      res.status(404).send({ message: 'No Course Found', data: null });
      return;
    }

    const quizData = [];
    for (const courseItem of courseData) {
      const course_name = courseItem.Course_title;
      const quizzes = await quiz.find({ Quiz_Course: course_name });
      quizData.push(...quizzes);
    }
    if (quizData.length === 0) {
      res.status(404).send({ message: 'No Quiz Found', data: null });
      return;
    }
    else {
      response_data = []
      for (const current_quiz of quizData) {
        const student_ids = current_quiz.Submitted_by;

        const students = student_ids.map(studnetId => user.findById(studnetId));
        const studentsData = await Promise.all(students);
        let current_quiz_names = []
        const studentData = studentsData.map(student => {
          // you have student id here
          // find obtained marks of student._id in current quiz. current_quiz._id
          let marks_obt = "-1"
          if(current_quiz.Submitted_by.includes(student._id.toString()))
          {
            const studentIndex = current_quiz.Submitted_by.indexOf(student._id);
            const marks =  current_quiz.obtained_marks[studentIndex];
            marks_obt = marks
          }
          current_quiz_names.push({ "student_id": student._id, "student_Firstname": student.First_name, "student_Lastname": student.Last_name, "marks_obtained": marks_obt })
        })

        // quizData.push(...studentData);
        new_obj = { ...current_quiz, ...{ "students": current_quiz_names } }
        response_data.push(new_obj)

      }
     
      res.send({ message: 'success', data: response_data });


    }
  }
  else {
    res.send({ message: 'Only students can access this', data: null });
  }

}
async function GetOnlyTeacherQuiz(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }

  if (req.session.user.Role == "Teacher") {
    const teacherId = mongoose.Types.ObjectId(req.query.temp_id);
    const courseData = await course.find({ assigned_to: teacherId });

    if (!courseData || courseData.length === 0) {
      res.status(404).send({ message: 'No Course Found', data: null });
      return;
    }

    const quizData = [];
    for (const courseItem of courseData) {
      const course_name = courseItem.Course_title;
      const quizzes = await quiz.find({ Quiz_Course: course_name });
      quizData.push(...quizzes);
    }
    if (quizData.length === 0) {
      res.status(404).send({ message: 'No Quiz Found', data: null });
      return;
    }
    else {
      

      res.send({ message: 'success', data: quizData });


    }
  }
  else {
    res.send({ message: 'Only students can access this', data: null });
  }

}
async function SearchQuiz(req, res, next) {

  if (!req.session.user) {
    res.status(403).send('Not logged in');
    return
  }
  if (req.session.user.Role == "Student") {
    const QuestionData = await quiz.findOne({ _id: mongoose.Types.ObjectId(req.query.temp_id) });
    res.send({ message: 'success', data: QuestionData });
  }

  else {
    res.send({ message: 'Only students can access this', data: null });
  }

};
async function UploadMarks(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in');
    return
  }
  if (req.session.user.Role == "Teacher") {
    try {


      const student_id = mongoose.Types.ObjectId(req.body.Student_ID);
      const obtainedMarks = req.body.obtained_marks;
      const quiz_data = await quiz.findOne({ _id: mongoose.Types.ObjectId(req.body.quiz_id) });
      if (!quiz_data) {
        res.status(404).send({ message: 'Quiz not found', data: null });
        return;
      }
      const studentIndex = quiz_data.Submitted_by.indexOf(student_id);
      console.log(studentIndex);
      if (studentIndex !== -1) {
        // Update the obtained_marks array for the specific student index
        quiz_data.obtained_marks[studentIndex] = obtainedMarks;
        // Save the updated quiz document
        //  const has_marked = quiz_data.obtained_marks[studentIndex] !== -1;
        // let sub_quiz = {  ...{ "has_submitted": has_marked } }
        //  quiz_data.push(sub_quiz);

        const updatedQuiz = await quiz_data.save();

        res.send({ message: 'Marks uploaded successfully', data: updatedQuiz });
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
async function GetObtainedMarks(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  if (req.session.user.Role == "Student") {
    const studentId = mongoose.Types.ObjectId(req.query.temp_id);
    const studentquizes = await quiz.find({ Submitted_by: studentId });
    console.log(studentquizes);
    if (!studentquizes) {
      res.status(404).send({ message: 'No Quiz Found', data: null });
      return;
    }
    else
    {
      const student_marks=[];
      const quizObtained_Marks = [];
      for (const current_quiz of studentquizes) 
      {
        const studentIndex = current_quiz.Submitted_by.indexOf(studentId);
        console.log("student_index =", studentIndex);

        if (studentIndex !== -1) {
          
          const student_marks = current_quiz.obtained_marks[studentIndex];
      
          console.log("student_marks =", student_marks);
          quizObtained_Marks.push(...student_marks);
        }
      }
        if (quizObtained_Marks.length === 0) {
          res.status(404).send({ message: 'No Marks Given by teacher yet!!', data: null });
          return;
        }
        else {
          console.log(quizObtained_Marks);
          res.send({ message: 'success', data: quizObtained_Marks });
  
        }

      }
    

  }
  else
  {
    res.status(403).send({ message: 'Only Student can access this', data: null });

  }


}
module.exports = { AddQuiz, GetQuiz, DeleteQuiz, EditQuiz, FindQuiz, GetStudentQuiz, GetTeacherQuiz, SearchQuiz, UploadQuiz, UploadMarks, GetOnlyTeacherQuiz, GetObtainedMarks };

