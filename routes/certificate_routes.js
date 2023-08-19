const express=require('express');
const router=express.Router();
const authController=require('../controllers/Certificate');
router.post('/GenerateCertificate' , authController.GenerateCertificate);
router.get('/GetAllCertificates' , authController.GetAllCertificates);
router.get('/SearchCertificate' , authController.SearchCertificate);

module.exports=router;
