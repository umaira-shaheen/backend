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
const authController=require('../controllers/Assignment');
router.post('/AddAssignment' , authController.AddAssignment);
router.get('/GetAssignment', authController.GetAssignment);
router.get('/FindAssignment', authController.FindAssignment);

router.get('/DeleteAssignment', authController.DeleteAssignment);
router.get('/FindAssignment', authController.FindAssignment);
router.post('/EditAssignment', authController.EditAssignment);
router.get('/GetTeacherAssignment', authController.GetTeacherAssignment);
router.get('/GetOnlyTeacherAssignment', authController.GetOnlyTeacherAssignment);
router.get('/GetStudentAssignment', authController.GetStudentAssignment);
router.get('/SearchAssignment', authController.SearchAssignment);
router.get('/FindAssignmentQuestion', authController.FindAssignmentQuestion);
router.post('/UploadAssignment', upload.single('file') , authController.UploadAssignment);
router.post('/UploadMarks',  authController.UploadMarks);
module.exports=router;