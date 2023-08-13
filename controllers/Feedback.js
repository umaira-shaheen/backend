var mongoose = require('mongoose');
const sendEmail = require("../Email");
const { course } = require("../models/Courses");
const { feedback } = require("../models/Feedback");

async function AddFeedback(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in');
    return;
  }
  if (req.session.user.Role == "Student") {
    const student_id = req.session.user._id;
    const FindStudentId = await course.find({ Students: student_id });
    if (FindStudentId) {
      const first_feedback = new feedback({ StudentId: student_id, Name: req.body.name, Email: req.body.email, Course: req.body.course, Phone_Number: req.body.phonenumber, Experience: req.body.feedback, Comments: req.body.comments });
      first_feedback.save();
      const userEmail = req.body.email // Specify the recipient's email address
      const subject = 'Course Feedback';
      const message = 'We have received your feedback! Thankyou for your valuable words. It helps us to improve more and provide you with best';
      try {
        console.log("sending email to:" + userEmail)
        await sendEmail(userEmail, subject, message);
        res.send("successfully submitted")
      } catch (error) {
        console.log(error)
        res.send("successfully submitted but email not sent");
      }

    }
    else {
      res.send("You are not authorized to give this Feedback");
    }
  }
  else {
    res.send("Only Student can access this")
  }


}
async function GetFeedback(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in');
    return;
  }
  if (req.session.user.Role == "Student") {
    const studentId = mongoose.Types.ObjectId(req.query.temp_id);
    const AllFeedbacks = await feedback.find({ StudentId: studentId });
    res.send(AllFeedbacks);

  }
  else {
    res.send("Only Student can access this")

  }

}
async function GetAllFeedback(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in');
    return;
  }
  if (req.session.user.Role == "Admin") {
    const filter = {};
    const AllFeedbacks = await feedback.find(filter);
    res.send(AllFeedbacks);

  }
  else {
    res.send("Only Admin can access this")

  }

}
async function DeleteFeedback(req, res, next) {

  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  feedback.findByIdAndRemove({ _id: mongoose.Types.ObjectId(req.query.temp_id) }, (err) => {

    if (err) {
      res.send({ "indicator": "error", "messege": err });
    }
    else {
      res.send({ "indicator": "success", "messege": "Feedback deleted successfully" });
    }
  })



};

module.exports = { AddFeedback, GetFeedback, DeleteFeedback, GetAllFeedback };