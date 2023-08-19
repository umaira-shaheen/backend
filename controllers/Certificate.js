var mongoose = require('mongoose');
const { certificate } = require("../models/Certificate");
const { course } = require("../models/Courses");
const { user } = require("../models/Users");
const sendEmail = require("../Email");
async function GenerateCertificate(req, res, next) {
    if (!req.session.user) {
        res.status(403).send('Not logged in')
        return
    }
    const course_id = req.body.course;
    const courseData = await course.findOne({ _id: course_id }); // Use course_id here
    if (courseData) {
        const course_name = courseData.Course_title;
        if (req.session.user.Role === "Admin") {
            const admin_id = req.session.user._id;

            try {
                const studentIDS = courseData.Students;
                const existingCertificate = await certificate.findOne({ Course_id: course_id });
                if (existingCertificate) {
                    res.send("You have already generated certificates for this course");
                } else {
                    const first_certificate = new certificate({ Students: studentIDS, generated_by: admin_id, Course_id: req.body.course, Course_name: course_name, feedback: req.body.feedback });
                    await first_certificate.save();


                    const studentDataPromises = studentIDS.map(async (studentID) => {
                        const userData = await user.findOne({ _id: studentID });
                        return userData;
                    });
                    const studentDataArray = await Promise.all(studentDataPromises);
                    // studentDataArray now contains user data for each student ID
                    console.log(studentDataArray);
                    const studentEmails = studentDataArray.map((studentData) => studentData.Email);
                    console.log(studentEmails);

                    const subject = 'Certificate Generated';
                    const message = `Congratulations 🎉✨!! Your certificate of ${course_name} has been generated. Go to your portal and download from there`;

                    try {
                        await sendEmail(studentEmails, subject, message);
                        res.send({ indicator: "Success!", message: "Certificates generated and emails sent to students" });
                    } catch (error) {
                        console.log(error)
                        res.send("Certificates generated but emails not sent");
                    }
                }
            } catch (error) {
                console.error(error);
                res.status(500).send({ message: 'Internal server error', data: null });
            }
        } else {
            res.status(403).send("Only administrator can access this");
        }
    }
}

async function GetAllCertificates(req, res, next) {
    const StudentWithNames = [];
    const filter = {};
    const AllCertificates = await certificate.find(filter);
   
    for (const current_certificate of AllCertificates) {
        const student_ids = current_certificate.Students;
        const students = await user.find({ _id: { $in: student_ids } });
  
        if (students) {
          const studentDataWithNames = {
            ...current_certificate.toObject(), // Convert Mongoose doc to plain object
            Students: students.map(student => ({
              Student_First_name: student.First_name,
              Student_Last_name: student.Last_name,
              // Add other student data properties if needed
            }))
          };
          StudentWithNames.push(studentDataWithNames);
          console.log(StudentWithNames);
        }
      }
      res.send(StudentWithNames);

}
async function SearchCertificate(req, res, next) {
    if (!req.session.user) {
      res.status(403).send('Not logged in');
      return;
    }
    
    if (req.session.user.Role === 'Student') {
      const user_id = req.session.user._id;
      
      try {
        const certificateData = await certificate.findOne({ Course_id: mongoose.Types.ObjectId(req.query.temp_id) });
  
        if (!certificateData) {
          res.send({ message: 'Certificate not generated yet by Admin', data: null });
          return;
        }
  
        if (!certificateData.Students.includes(user_id)) {
          res.status(404).send({ message: 'Student not found in Certificate Generation list', data: null });
          return;
        }
  
        const student_id = certificateData.Students.find(studentId => studentId.toString() === user_id.toString());
        const student = await user.findOne({ _id: student_id });
  
        if (!student) {
          res.status(404).send({ message: 'Student not found in User records', data: null });
          return;
        }
  
        const studentWithNames = {
          ...certificateData.toObject(),
          Students: [{
            Student_First_name: student.First_name,
            Student_Last_name: student.Last_name,
          }],
        };
  
        res.send({ message: 'Success', data: [studentWithNames] });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred', data: null });
      }
    } else {
      res.send({ message: 'Only students can access this', data: null });
    }
  };
  
module.exports = { GenerateCertificate, GetAllCertificates , SearchCertificate};

