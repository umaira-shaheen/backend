var mongoose = require('mongoose');
const { user } = require("../models/Users");
const { quiz } = require("../models/Quiz");
const { assignment } = require("../models/Assignment");
const { course } = require("../models/Courses");

async function StudentRegistrationReport(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  console.log('hy');
  const date_from = req.query.date_from;
  const date_to = req.query.date_to;
  const All_Time = req.query.All_Time;
  let start_date = new Date(date_from);
  let end_date = new Date(date_to);


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
async function CourseReport(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  const courses = req.query.course;
  const category = req.query.category;
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  console.log(courses);
  console.log(category);
  console.log(start_date);
  console.log(end_date);
  const StudentAndteachersWithNames = [];
  if (category === 'all' && courses == 'all') {
    const filter = {};
    const courseData = await course.find(filter);
    for (const current_course of courseData) {
      const teacher_id = current_course.assigned_to;
      const student_ids = current_course.Students;

      const teacherUserDoc = await user.findOne({ _id: teacher_id });
      const students = await user.find({ _id: { $in: student_ids } });
      if (teacherUserDoc) {
        const teacherDataWithNames = {
          ...current_course.toObject(), // Convert Mongoose doc to plain object
          Teacher_First_name: teacherUserDoc.First_name,
          Teacher_Last_name: teacherUserDoc.Last_name,
          Students: students.map(student => ({
            Student_First_name: student.First_name,
            Student_Last_name: student.Last_name,
            // Add other student data properties if needed
          })),
          Num_Students: students.length, // Count of students in the course
        };

        StudentAndteachersWithNames.push(teacherDataWithNames);

      }

    }
    res.status(200).send({ message: 'Success!', data: StudentAndteachersWithNames });
  }
  if (category !== 'all' && courses !== 'all') {

    const courseData = await course.findOne({ _id: courses });
    console.log(courseData);
    if (!courseData) {
      res.status(404).send({ message: 'Course Not Found!', data: null });

    }
    const teacher_id = courseData.assigned_to;
    const student_ids = courseData.Students;

    const teacherUserDoc = await user.findOne({ _id: teacher_id });
    const students = await user.find({ _id: { $in: student_ids } });
    if (teacherUserDoc) {
      const teacherDataWithNames = {
        ...courseData.toObject(), // Convert Mongoose doc to plain object
        Teacher_First_name: teacherUserDoc.First_name,
        Teacher_Last_name: teacherUserDoc.Last_name,
        Students: students.map(student => ({
          Student_First_name: student.First_name,
          Student_Last_name: student.Last_name,
          // Add other student data properties if needed
        })),
        Num_Students: students.length, // Count of students in the course
      };

      StudentAndteachersWithNames.push(teacherDataWithNames);

    }


    res.status(200).send({ message: 'Success!', data: StudentAndteachersWithNames });
  }
  if (category !== 'all' && courses == 'all') {
    const courseData = await course.find({ Course_category: category });
    for (const current_course of courseData) {
      const teacher_id = current_course.assigned_to;
      const student_ids = current_course.Students;

      const teacherUserDoc = await user.findOne({ _id: teacher_id });
      const students = await user.find({ _id: { $in: student_ids } });
      if (teacherUserDoc) {
        const teacherDataWithNames = {
          ...current_course.toObject(), // Convert Mongoose doc to plain object
          Teacher_First_name: teacherUserDoc.First_name,
          Teacher_Last_name: teacherUserDoc.Last_name,
          Students: students.map(student => ({
            Student_First_name: student.First_name,
            Student_Last_name: student.Last_name,
            // Add other student data properties if needed
          })),
          Num_Students: students.length, // Count of students in the course
        };

        StudentAndteachersWithNames.push(teacherDataWithNames);

      }

    }
    res.status(200).send({ message: 'Success!', data: StudentAndteachersWithNames });
  }

}
async function StudentQuizReport(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  const StudentWithNames = [];
  const student_Names = req.query.students;
  const quizes_title = req.query.quizes;
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  const sortQuiz = req.query.sorting;
  console.log(student_Names);
  console.log(quizes_title);
  console.log(start_date);
  console.log(end_date);
  if (student_Names === 'all' && quizes_title === 'all') {
    const filter = {};
    const quizData = await quiz.find(filter);
    for (const current_quiz of quizData) {
      const student_ids = current_quiz.Submitted_by;
      const students = await user.find({ _id: { $in: student_ids } });

      if (students) {
        const studentDataWithNames = {
          ...current_quiz.toObject(), // Convert Mongoose doc to plain object
          Submitted_by: students.map(student => ({
            Student_First_name: student.First_name,
            Student_Last_name: student.Last_name,
            // Add other student data properties if needed
          }))
        };
        StudentWithNames.push(studentDataWithNames);

      }

    }
    if (sortQuiz === "heighest") {
      // Sort StudentWithNames based on obtained marks in descending order
      StudentWithNames.sort((a, b) => {
        // Assuming obtained_marks is a property of the quiz object
        return b.obtained_marks - a.obtained_marks;
      });
    }
    else if (sortQuiz === "lowest") {
      // Sort StudentWithNames based on obtained marks in ascending order
      StudentWithNames.sort((a, b) => {
        // Assuming obtained_marks is a property of the quiz object
        return a.obtained_marks - b.obtained_marks;
      });
    }
    // sort StudentWithNames here.
    res.status(200).send({ message: 'Success!', data: StudentWithNames });

  }

  if (student_Names !== 'all' && quizes_title !== 'all') {
    try {
      const StudentWithNames = [];
      const sortQuiz = req.query.sorting;
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
      const student_ids = quiz_data.Submitted_by;
      const students = await user.find({ _id: { $in: student_ids } });
      if (students) {
        const studentDataWithNames = {
          ...quiz_data.toObject(), // Convert Mongoose doc to plain object
          Submitted_by: students.map(student => ({
            Student_First_name: student.First_name,
            Student_Last_name: student.Last_name,
            // Add other student data properties if needed
          }))
        };
        StudentWithNames.push(studentDataWithNames);

      }
      if (sortQuiz === "heighest") {
        // Sort StudentWithNames based on obtained marks in descending order
        StudentWithNames.sort((a, b) => {
          // Assuming obtained_marks is a property of the quiz object
          return b.obtained_marks - a.obtained_marks;
        });
      }
      else if (sortQuiz === "lowest") {
        // Sort StudentWithNames based on obtained marks in ascending order
        StudentWithNames.sort((a, b) => {
          // Assuming obtained_marks is a property of the quiz object
          return a.obtained_marks - b.obtained_marks;
        });
      }
      res.status(200).send({ message: 'Success!', data: StudentWithNames });
    } catch (error) {
      res.status(500).send({ message: 'Internal server error', data: null });
    }
  }
  
  if (student_Names !== 'all' && quizes_title === 'all') {
    try {
      const sortQuiz = req.query.sorting;
      const studentId = mongoose.Types.ObjectId(student_Names);
  
      // Find all quizes
      const allQuizes = await quiz.find({});
      
      if (!allQuizes || allQuizes.length === 0) {
        res.status(404).send({ message: 'No quizes found', data: null });
        return;
      }
  
      const StudentWithNames = [];
  
      for (const quizData of allQuizes) {
        if (quizData.Submitted_by.includes(studentId)) {
          const student_ids = quizData.Submitted_by;
          
          // Find student data
          const students = await user.find({ _id: { $in: student_ids } });
          
          if (students && students.length > 0) {
            const studentDataWithNames = {
              ...quizData.toObject(), // Convert Mongoose doc to plain object
              Submitted_by: students.map(student => ({
                Student_First_name: student.First_name,
                Student_Last_name: student.Last_name,
                // Add other student data properties if needed
              }))
            };
            StudentWithNames.push(studentDataWithNames);
          }
        }
      }
  
      if (StudentWithNames.length > 0) {
        if (sortQuiz === "heighest") {
          // Sort StudentWithNames based on obtained marks in descending order
          StudentWithNames.sort((a, b) => {
            // Assuming obtained_marks is a property of the quiz object
            return b.obtained_marks - a.obtained_marks;
          });
        }
        else if (sortQuiz === "lowest") {
          // Sort StudentWithNames based on obtained marks in ascending order
          StudentWithNames.sort((a, b) => {
            // Assuming obtained_marks is a property of the quiz object
            return a.obtained_marks - b.obtained_marks;
          });
        }
        res.status(200).send({ message: 'Success!', data: StudentWithNames });
      } else {
        res.status(404).send({ message: 'Student not found in submitted list', data: null });
      }
    } catch (error) {
      console.error(error);
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
      const student_ids = quiz_data.Submitted_by;
      const students = await user.find({ _id: { $in: student_ids } });
      if (students && students.length > 0) {
        const studentDataWithNames = {
          ...quiz_data.toObject(), // Convert Mongoose doc to plain object
          Submitted_by: students.map(student => ({
            Student_First_name: student.First_name,
            Student_Last_name: student.Last_name,
            // Add other student data properties if needed
          }))
        };
        StudentWithNames.push(studentDataWithNames);
        if (StudentWithNames.length > 0) {
          if (sortQuiz === "heighest") {
            StudentWithNames.sort((a, b) => {
              return b.obtained_marks - a.obtained_marks;
            });
          }
          else if (sortQuiz === "lowest") {
            StudentWithNames.sort((a, b) => {
              return a.obtained_marks - b.obtained_marks;
            });
          }
        }  
        res.status(200).send({ message: 'Success!', data: StudentWithNames });

    } 
    else {
      res.status(404).send({ message: 'No Student has Submitted Quiz Yet!', data: null });
    }

  }catch (error) {
      res.status(500).send({ message: 'Internal server error', data: null });
    }
}
}

async function StudentAssignmentReport(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  const sortAssignment = req.query.sorting;
  const StudentWithNames = [];
  const student_Names = req.query.students;
  const assignment_title = req.query.assignments;
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  console.log(student_Names);
  console.log(assignment_title);
  console.log(start_date);
  console.log(end_date);
  if (student_Names === 'all' && assignment_title === 'all') {
    const filter = {};
    const assignmentData = await assignment.find(filter);
    for (const current_assignment of assignmentData) {
      const student_ids = current_assignment.Submitted_by;
      const students = await user.find({ _id: { $in: student_ids } });

      if (students) {
        const studentDataWithNames = {
          ...current_assignment.toObject(), // Convert Mongoose doc to plain object
          Submitted_by: students.map(student => ({
            Student_First_name: student.First_name,
            Student_Last_name: student.Last_name,
            // Add other student data properties if needed
          }))
        };
        StudentWithNames.push(studentDataWithNames);
      }
    }
    if (sortQuiz === "heighest") {
      // Sort StudentWithNames based on obtained marks in descending order
      StudentWithNames.sort((a, b) => {
        // Assuming obtained_marks is a property of the quiz object
        return b.obtained_marks - a.obtained_marks;
      });
    }
    else if (sortQuiz === "lowest") {
      // Sort StudentWithNames based on obtained marks in ascending order
      StudentWithNames.sort((a, b) => {
        // Assuming obtained_marks is a property of the quiz object
        return a.obtained_marks - b.obtained_marks;
      });
    }
    res.status(200).send({ message: 'Success!', data: StudentWithNames });
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
      const student_ids = assignment_data.Submitted_by;
      const students = await user.find({ _id: { $in: student_ids } });
      if (students) {
        const studentDataWithNames = {
          ...assignment_data.toObject(), // Convert Mongoose doc to plain object
          Submitted_by: students.map(student => ({
            Student_First_name: student.First_name,
            Student_Last_name: student.Last_name,
           
          }))
        };
        StudentWithNames.push(studentDataWithNames);
      }
      if (sortQuiz === "heighest") {
        // Sort StudentWithNames based on obtained marks in descending order
        StudentWithNames.sort((a, b) => {
          // Assuming obtained_marks is a property of the quiz object
          return b.obtained_marks - a.obtained_marks;
        });
      }
      else if (sortQuiz === "lowest") {
        // Sort StudentWithNames based on obtained marks in ascending order
        StudentWithNames.sort((a, b) => {
          // Assuming obtained_marks is a property of the quiz object
          return a.obtained_marks - b.obtained_marks;
        });
      }
      res.status(200).send({ message: 'Success!', data: StudentWithNames });
    } catch (error) {
      res.status(500).send({ message: 'Internal server error', data: null });
    }
  }
  if (student_Names !== 'all' && assignment_title === 'all') {
    try {
      const sortAssignment = req.query.sorting;
      const studentId = mongoose.Types.ObjectId(student_Names);
  
      // Find all quizes
      const allAssignments = await assignment.find({});
      
      if (!allAssignments || allAssignments.length === 0) {
        res.status(404).send({ message: 'No Assignment found', data: null });
        return;
      }
      const StudentWithNames = [];
  
      for (const assignmentData of allAssignments) {
        if (assignmentData.Submitted_by.includes(studentId)) {
          const student_ids = assignmentData.Submitted_by; 
          // Find student data
          const students = await user.find({ _id: { $in: student_ids } });
          
          if (students && students.length > 0) {
            const studentDataWithNames = {
              ...assignmentData.toObject(), // Convert Mongoose doc to plain object
              Submitted_by: students.map(student => ({
                Student_First_name: student.First_name,
                Student_Last_name: student.Last_name,
                // Add other student data properties if needed
              }))
            };
            StudentWithNames.push(studentDataWithNames);
          }
        }
      }
  
      if (StudentWithNames.length > 0) {
        if (sortAssignment === "heighest") {
          // Sort StudentWithNames based on obtained marks in descending order
          StudentWithNames.sort((a, b) => {
            // Assuming obtained_marks is a property of the quiz object
            return b.obtained_marks - a.obtained_marks;
          });
        }
        else if (sortAssignment === "lowest") {
          // Sort StudentWithNames based on obtained marks in ascending order
          StudentWithNames.sort((a, b) => {
            // Assuming obtained_marks is a property of the quiz object
            return a.obtained_marks - b.obtained_marks;
          });
        }
        res.status(200).send({ message: 'Success!', data: StudentWithNames });
      } else {
        res.status(404).send({ message: 'Student not found in submitted list', data: null });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error', data: null });
    }
  }
  if (student_Names === 'all' && assignment_title !== 'all') {
    try {
      const assignmentId = mongoose.Types.ObjectId(assignment_title);
      const assignment_data = await assignment.findOne({ _id: assignmentId });
      if (!assignment_data) {
        res.status(404).send({ message: 'Assignment not found', data: null });
        return;
      }
      const student_ids = assignment_data.Submitted_by;
      const students = await user.find({ _id: { $in: student_ids } });
      if (students && students.length > 0) {
        const studentDataWithNames = {
          ...assignment_data.toObject(), // Convert Mongoose doc to plain object
          Submitted_by: students.map(student => ({
            Student_First_name: student.First_name,
            Student_Last_name: student.Last_name,
            // Add other student data properties if needed
          }))
        };
        StudentWithNames.push(studentDataWithNames);
        if (StudentWithNames.length > 0) {
          if (sortAssignment === "heighest") {
            StudentWithNames.sort((a, b) => {
              return b.obtained_marks - a.obtained_marks;
            });
          }
          else if (sortAssignment === "lowest") {
            StudentWithNames.sort((a, b) => {
              return a.obtained_marks - b.obtained_marks;
            });
          }
        }  
        res.status(200).send({ message: 'Success!', data: StudentWithNames });

    } 
    else {
      res.status(404).send({ message: 'No Student has Submitted Assignment Yet!', data: null });
    }

  }catch (error) {
      res.status(500).send({ message: 'Internal server error', data: null });
    }
}
}

async function CourseEnrollmentReport(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  const courses = req.query.courses;
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  console.log(courses);
  console.log(start_date);
  console.log(end_date);
  if (courses === 'all') {
    const filter = {};
    const courseData = await course.find(filter);
    res.status(200).send({ message: 'Success!', data: courseData });
  }
  if (courses !== 'all') {
    try {
      const courseId = mongoose.Types.ObjectId(courses);
      const course_data = await course.findOne({ _id: courseId });
      if (!course_data) {
        res.status(404).send({ message: 'Course not found', data: null });
        return;
      }
      res.status(200).send({ message: 'Success!', data: course_data });
    } catch (error) {
      res.status(500).send({ message: 'Internal server error', data: null });
    }
  }


}
async function TeacherReport(req, res, next) {
  if (!req.session.user) {
    res.status(403).send('Not logged in')
    return
  }
  const teachers = req.query.teachers;
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  console.log(teachers);
  console.log(start_date);
  console.log(end_date);
  const StudentAndteachersWithNames = [];
  if (teachers === 'all') {

    const filter = {};
    const teacherData = await course.find(filter);
    for (const current_teacher of teacherData) {
      const teacher_id = current_teacher.assigned_to;
      const student_ids = current_teacher.Students;

      const teacherUserDoc = await user.findOne({ _id: teacher_id });

      const students = await user.find({ _id: { $in: student_ids } });

      if (teacherUserDoc) {
        const teacherDataWithNames = {
          ...current_teacher.toObject(), // Convert Mongoose doc to plain object
          Teacher_First_name: teacherUserDoc.First_name,
          Teacher_Last_name: teacherUserDoc.Last_name,
          Students: students.map(student => ({
            Student_First_name: student.First_name,
            Student_Last_name: student.Last_name,
            // Add other student data properties if needed
          }))
        };
        StudentAndteachersWithNames.push(teacherDataWithNames);
        // for (const current_teacher of teacherData) {
        //   const teacher_id = current_teacher.assigned_to;
        //   const student_ids = current_teacher.Students;
        //   const students = student_ids.map(studentId => user.findById(studentId));
        //   const studentsData = await Promise.all(students);
        //   console.log(teacher_id);
        //     const userDoc = await user.findOne({_id:teacher_id});
        //      console.log(userDoc);
        //      if (userDoc) {
        //       // Push teacher data along with names to the array
        //       StudentAndteachersWithNames.push({
        //         ...current_teacher.toObject(), // Convert Mongoose doc to plain object
        //         First_name: userDoc.First_name,
        //         Last_name: userDoc.Last_name
        //         Student_First_name: studentsData.First_name,
        //         Student_Last_name: studentsData.Last_name
        //       });
        //     }
      }

    }
    res.status(200).send({ message: 'Success!', data: StudentAndteachersWithNames });
  }

  if (teachers !== 'all') {
    try {
      const teacherId = mongoose.Types.ObjectId(teachers);
      const course_data = await course.find({ assigned_to: teacherId });
      if (!course_data) {
        res.status(404).send({ message: 'Course not found', data: null });
        return;
      }
      for (const current_teacher of course_data) {
        const teacher_id = current_teacher.assigned_to;
        const student_ids = current_teacher.Students;

        const teacherUserDoc = await user.findOne({ _id: teacher_id });

        const students = await user.find({ _id: { $in: student_ids } });

        if (teacherUserDoc) {
          const teacherDataWithNames = {
            ...current_teacher.toObject(), // Convert Mongoose doc to plain object
            Teacher_First_name: teacherUserDoc.First_name,
            Teacher_Last_name: teacherUserDoc.Last_name,
            Students: students.map(student => ({
              Student_First_name: student.First_name,
              Student_Last_name: student.Last_name,
              // Add other student data properties if needed
            }))
          };
          StudentAndteachersWithNames.push(teacherDataWithNames);

        }

      }

      res.status(200).send({ message: 'Success!', data: StudentAndteachersWithNames });
    } catch (error) {
      res.status(500).send({ message: 'Internal server error', data: null });
    }
  }


}


module.exports = { StudentRegistrationReport, StudentQuizReport, StudentAssignmentReport, CourseEnrollmentReport, TeacherReport, CourseReport };
