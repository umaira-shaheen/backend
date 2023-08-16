var mongoose = require('mongoose');
const { user } = require("../models/Users");
const { quiz } = require("../models/Quiz");
const { assignment } = require("../models/Assignment");

async function StudentRegistrationReport(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  console.log('hy');
  const date_from = req.query.date_from;
  const date_to = req.query.date_to;
  const All_Time = req.query.All_Time;
  console.log(date_from);
  console.log(date_to);
  console.log(All_Time);
  let query = {};

  if (All_Time) {
    // If All_Time is true, no additional filtering is needed
  } else {
    // If not All_Time, add createdAt filtering
    query.createdAt = {
    
      $gte: new Date(date_from),
      $lte: new Date(date_to),  
      
    };
  }

  const users = await user.find(query);
  res.send(users);
  return users;
}
async function StudentQuizReport(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  const student_Names = req.query.students;
  const quizes_title = req.query.quizes;
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  console.log(student_Names);
  console.log(quizes_title);
  console.log(start_date);
  console.log(end_date);
  if(student_Names==='all' && quizes_title==='all')
  {
    const filter = {};
    const quizData = await quiz.find(filter);
    res.status(200).send({ message: 'Success!', data: quizData });
  }

  if (student_Names !== 'all' && quizes_title !== 'all') {
    try {
      const quizId = mongoose.Types.ObjectId(quizes_title);
      const quiz_data = await quiz.findOne({ _id: quizId });
      if (!quiz_data) {
        res.status(404).send({ message: 'Quiz not found', data: null });
        return;
      }
      const student_data = quiz_data.Submitted_by.includes(student_Names);
      if (!student_data) {
        res.status(404).send({ message: 'Student not found in submitted list', data: null });
        return;
      }
      res.status(200).send({ message: 'Success!', data: quiz_data });
    } catch (error) {
      res.status(500).send({ message: 'Internal server error', data: null });
    }
  }
  if (student_Names !== 'all' && quizes_title === 'all') {
    try {
      const allQuizes = await quiz.find({});
      if (!allQuizes) {
        res.status(404).send({ message: 'No quizes found', data: null });
        return;
      }
      
      const studentId = mongoose.Types.ObjectId(student_Names);
      const validQuizes = [];
      
      for (const quizData of allQuizes) {
        if (quizData.Submitted_by.includes(studentId)) {
          validQuizes.push(quizData);
        }
      }
      
      res.status(200).send({ message: 'Success!', data: validQuizes });
    } catch (error) {
      res.status(500).send({ message: 'Internal server error', data: null });
    }
  }
  if (student_Names === 'all' && quizes_title !== 'all') {
    try {
      const quizId = mongoose.Types.ObjectId(quizes_title);
      const quiz_data = await quiz.findOne({ _id: quizId });
      
      if (!quiz_data) {
        res.status(404).send({ message: 'Quiz not found', data: null });
        return;
      }
      
      res.status(200).send({ message: 'Success!', data: quiz_data });
    } catch (error) {
      res.status(500).send({ message: 'Internal server error', data: null });
    }
  }
  
  
}
async function StudentAssignmentReport(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  const student_Names = req.query.students;
  const assignment_title = req.query.assignments;
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  console.log(student_Names);
  console.log(assignment_title);
  console.log(start_date);
  console.log(end_date);
  if(student_Names==='all' && assignment_title==='all')
  {
    const filter = {};
    const assignmentData = await assignment.find(filter);
    res.status(200).send({ message: 'Success!', data: assignmentData });
  }

  if (student_Names !== 'all' && assignment_title !== 'all') {
    try {
      const assignmentId = mongoose.Types.ObjectId(assignment_title);
      const assignment_data = await assignment.findOne({ _id: assignmentId });
      if (!assignment_data) {
        res.status(404).send({ message: 'Assignment not found', data: null });
        return;
      }
      const student_data = assignment_data.Submitted_by.includes(student_Names);
      if (!student_data) {
        res.status(404).send({ message: 'Student not found in submitted list', data: null });
        return;
      }
      res.status(200).send({ message: 'Success!', data: assignment_data });
    } catch (error) {
      res.status(500).send({ message: 'Internal server error', data: null });
    }
  }
  if (student_Names !== 'all' && assignment_title === 'all') {
    try {
      const allAssignments = await quiz.find({});
      if (!allAssignments) {
        res.status(404).send({ message: 'No Assignments found', data: null });
        return;
      }
      
      const studentId = mongoose.Types.ObjectId(student_Names);
      const validAssignments = [];
      
      for (const assignmentData of allAssignments) {
        if (assignmentData.Submitted_by.includes(studentId)) {
          validAssignments.push(assignmentData);
        }
      }
      
      res.status(200).send({ message: 'Success!', data: validAssignments });
    } catch (error) {
      res.status(500).send({ message: 'Internal server error', data: null });
    }
  }
  if (student_Names === 'all' && assignment_title !== 'all') {
    try {
      const assignmentId = mongoose.Types.ObjectId(assignment_title);
      const assignment_data = await quiz.findOne({ _id: assignmentId });
      
      if (!assignment_data) {
        res.status(404).send({ message: 'Assignment not found', data: null });
        return;
      }
      
      res.status(200).send({ message: 'Success!', data: assignment_data });
    } catch (error) {
      res.status(500).send({ message: 'Internal server error', data: null });
    }
  }
  
  
}
module.exports = {StudentRegistrationReport, StudentQuizReport , StudentAssignmentReport};
