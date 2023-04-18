const express=require('express');
const router=express.Router();
const authController=require('../controllers/User');
router.get('/GetUser', authController.GetUser);
router.post('/AddUser' , authController.AddUser);
router.get('/DeleteUser', authController.DeleteUser);
router.get('/FindUser', authController.FindUser);
router.post('/EditUser', authController.EditUser);
module.exports=router;