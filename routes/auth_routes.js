const express=require('express');
const router=express.Router();
const authController=require('../controllers/auth');
router.post('/validate' , authController.validate);
router.post('/register' , authController.register);
router.post('/logout' , authController.logout);
router.post('/ForgotPassword' , authController.ForgotPassword);
router.get('/CheckToken' , authController.CheckToken);
router.post('/ResetPassword' , authController.ResetPassword);

module.exports=router;
