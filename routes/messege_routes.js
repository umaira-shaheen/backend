const express=require('express');
const router=express.Router();
const authController=require('../controllers/Messege');
router.post('/SendMessege' , authController.SendMessege);
router.get('/GetMessege', authController.GetMessege);

module.exports=router;