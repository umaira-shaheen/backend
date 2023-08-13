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
  const authController=require('../controllers/Lecture');
router.post('/AddLecture', upload.array('files') , authController.AddLecture);  
router.get('/GetLecture', authController.GetLecture);  
router.get('/StudentLectures', authController.StudentLectures);  
router.get('/FindLecture', authController.FindLecture); 
router.get('/DeleteLecture', authController.DeleteLecture); 
router.post('/EditLecture', upload.single('file') ,authController.EditLecture); 
module.exports=router;