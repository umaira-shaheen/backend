const express=require('express');
const router=express.Router();
const authController=require('../controllers/Reports');
router.get('/StudentRegistrationReport', authController.StudentRegistrationReport);
router.get('/StudentQuizReport', authController.StudentQuizReport);
router.get('/StudentAssignmentReport', authController.StudentAssignmentReport);

module.exports=router;