var mongoose = require('mongoose');
const { question } = require("../models/Question");
async function AddQuestion(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  if (req.session.user.Role === "Teacher") {
    const teacher_id = req.session.user._id;

    const first_question = new question({ created_by: teacher_id, quiz_title: req.body.quiz_title, Question: req.body.question, options: req.body.options, questions_type: req.body.question_type, marks: req.body.marks, quiz_id: req.body.quiz_id });
    first_question.save().then((result) => res.send("success"))
      .catch((error) => res.send(error));
  }


  else {
    res.status(403).send("Only teacher can access this");
  }


}
async function GetQuestions(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  const filter = {};
  const AllQuestions = await question.find(filter);
  res.send(AllQuestions);

}
async function FindQuestion(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  const QuestionData = await question.findOne({ _id: mongoose.Types.ObjectId(req.query.temp_id) });
  res.send(QuestionData);
};
async function EditQuestion(req, res, next) {
  console.log('hello');
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  if (req.session.user.Role === "Teacher") {
    question.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.id), { Question: req.body.question_title, question_type: req.body.type, options: req.body.options, marks: req.body.marks }, function (error, docs) {
      if (error) {
        res.send("Failed to update the Question");
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
async function DeleteQuestion(req, res, next) {

  if (req.session.user.Role === "Teacher") {
    question.findByIdAndRemove({ _id: mongoose.Types.ObjectId(req.query.temp_id) }, (err) => {

      if (err) {
        res.send({ "indicator": "error", "messege": err });
      }
      else {
        res.send({ "indicator": "success", "messege": "Question deleted successfully" });
      }
    })
  }


  else {
    res.status(403).send("Only teacher can access this");
  }


};

module.exports = { AddQuestion, GetQuestions, EditQuestion, FindQuestion, DeleteQuestion }