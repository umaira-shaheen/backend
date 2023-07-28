const express=require('express');
const router=express.Router();
const multer = require('multer');
const path = require('path');
const authController=require('../controllers/Quiz');
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
  
router.post('/AddQuiz' , authController.AddQuiz);
router.post('/UploadQuiz', upload.single('file') , authController.UploadQuiz);
router.post('/UploadMarks',  authController.UploadMarks);

router.get('/GetQuiz', authController.GetQuiz);
router.get('/DeleteQuiz', authController.DeleteQuiz);
router.get('/FindQuiz', authController.FindQuiz);
router.get('/SearchQuiz', authController.SearchQuiz);
router.post('/EditQuiz', authController.EditQuiz);
router.get('/GetStudentQuiz', authController.GetStudentQuiz);
router.get('/GetTeacherQuiz', authController.GetTeacherQuiz);
router.get('/GetOnlyTeacherQuiz', authController.GetOnlyTeacherQuiz);
module.exports=router;