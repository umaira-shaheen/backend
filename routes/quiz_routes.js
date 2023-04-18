const express=require('express');
const router=express.Router();
const authController=require('../controllers/Quiz');
router.post('/AddQuiz' , authController.AddQuiz);
router.get('/GetQuiz', authController.GetQuiz);
router.get('/DeleteQuiz', authController.DeleteQuiz);
router.get('/FindQuiz', authController.FindQuiz);
router.post('/EditQuiz', authController.EditQuiz);
module.exports=router;