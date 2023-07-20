const express=require('express');
const router=express.Router();
const multer = require('multer');
const path = require('path');

// define the storage for the files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the destination directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension); // Specify the file name
  },
});

const upload = multer({ storage });

const authController=require('../controllers/course');
router.post('/AddCourse', upload.single('file') , authController.AddCourse);
router.get('/GetRecentCourse', authController.GetRecentCourse);
router.get('/GetAllCourse', authController.GetAllCourse);
router.get('/DeleteCourse', authController.DeleteCourse);
router.get('/FindCourse', authController.FindCourse);
router.post('/EditCourse', authController.EditCourse);
router.post('/AssignCourse', authController.AssignCourse);
router.get('/get_teacher_courses', authController.GetTeacherCourses);
router.get('/EnrollCourse', authController.EnrollCourse);
router.get('/StudentCourses', authController.StudentCourses);


module.exports=router;