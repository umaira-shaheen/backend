var mongoose = require('mongoose');
const sendEmail= require("../Email");

const { messege } = require("../models/Messege");
async function SendMessege(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
    const first_messege = new messege({  Name: req.body.name, Email: req.body.email, Subject: req.body.subject, Messege: req.body.messege});
    first_messege.save();
    const userEmail = req.body.email // Specify the recipient's email address
    const subject = 'Contact to UKCELL';
    const message = 'We have received your messege! Our team will contact you shortly and resolve your issue';
    try {
      sendEmail(userEmail, subject, message);
       res.send("successfully submitted")
     } catch (error) {
       console.log(error)
       res.send("successfully submitted but email not sent");
     }
}
async function GetMessege(req, res, next) {
  const filter = {};
  const AllMesseges = await messege.find(filter);
  res.send(AllMesseges);

}
module.exports = { SendMessege , GetMessege };