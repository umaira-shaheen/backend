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
async function AddQuiz(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  if (req.session.user.Role === "Teacher") {
    
   
      const first_quiz = new quiz({ Quiz_title: req.body.quiz_title, Start_date: req.body.start_date, End_date: req.body.end_date, Questions: req.body.questions, Status: req.body.status , Quiz_Course:req.body.quiz_course});
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

  if(req.session.user.Role=="Student")
  {
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
    else
     {
      res.send({ message: 'success', data: quizData });
    }
  }
  else 
  {
    res.send({ message: 'Only students can access this', data: null });
  }

}
async function GetTeacherQuiz(req, res, next) {
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
    else
     {
      res.send({ message: 'success', data: quizData });
    }
  }
  else 
  {
    res.send({ message: 'Only students can access this', data: null });
  }

}

module.exports = { AddQuiz, GetQuiz, DeleteQuiz, EditQuiz, FindQuiz, GetStudentQuiz, GetTeacherQuiz };

