const express=require('express');
const router=express.Router();
const authController=require('../controllers/Feedback');
router.post('/AddFeedback' , authController.AddFeedback);
router.get('/GetFeedback', authController.GetFeedback);
router.get('/GetAllFeedback', authController.GetAllFeedback);
router.get('/DeleteFeedback', authController.DeleteFeedback);
module.exports=router;