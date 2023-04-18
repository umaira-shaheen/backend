const express=require('express');
const router=express.Router();
const authController=require('../controllers/course');
router.post('/AddCourse' , authController.AddCourse);
router.get('/GetCourse', authController.GetCourse);
router.get('/DeleteCourse', authController.DeleteCourse);
router.get('/FindCourse', authController.FindCourse);
router.post('/EditCourse', authController.EditCourse);
module.exports=router;