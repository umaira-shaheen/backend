const express=require('express');
const router=express.Router();
const authController=require('../controllers/Assignment');
router.post('/AddAssignment' , authController.AddAssignment);
router.get('/GetAssignment', authController.GetAssignment);
router.get('/DeleteAssignment', authController.DeleteAssignment);
router.get('/FindAssignment', authController.FindAssignment);
router.post('/EditAssignment', authController.EditAssignment);
router.get('/GetTeacherAssignment', authController.GetTeacherAssignment);
router.get('/GetStudentAssignment', authController.GetStudentAssignment);

module.exports=router;