var mongoose = require('mongoose');
const { quiz } = require("../models/Quiz");
const { course } = require("../models/Courses");

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
    if(req.file)
    {
      const file = req.file;
      file_path = file.path;
    }
    if(file_path)
    {
    try {
      const quizData = await quiz.findOne({ _id: quizId });

      if (!quizData) {
        res.status(404).send('Quiz not found');
        return;
      }

      if (quizData.Submitted_by && quizData.Submitted_files &&  quizData.Submitted_by.includes(studentId)) {
        res.status(200).send('You have already submitted the quiz');
        return;
      }
      // Add the student's ID to the course's Students array
      else if (quizData.Submitted_by && quizData.Submitted_files ) {
        quizData.Submitted_files.push(file_path);
        quizData.Submitted_by.push(studentId);
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
    first_quiz.save().then((result) => res.send("success"))
      .catch((error) => res.send(error));


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


module.exports = { AddQuiz, GetQuiz, DeleteQuiz, EditQuiz, FindQuiz, GetStudentQuiz, GetTeacherQuiz, SearchQuiz, UploadQuiz };

