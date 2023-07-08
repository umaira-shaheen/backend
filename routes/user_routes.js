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
const authController=require('../controllers/User');
router.get('/GetUser', authController.GetUser);
router.post('/AddUser' , authController.AddUser);
router.get('/DeleteUser', authController.DeleteUser);
router.get('/FindUser', authController.FindUser);
router.post('/EditUser', authController.EditUser);
router.post('/EditProfile', authController.EditProfile);
router.post('/AddProfileImage', upload.single('file'), authController.AddImage);
module.exports=router;