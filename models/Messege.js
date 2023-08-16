const mongoose=require("mongoose");
const messegeSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  }, 
  Email: {
    type: String,
    required: true,
  },
   PhoneNumber:{
    type: String,
    required: true,
   },
  Subject:{
    type: String,  
    required: true,
  },
  Messege:{
    type: String, 
    required: true, 
  }
}, { timestamps: true });
const messege = mongoose.model("messege", messegeSchema);
module.exports = {messege }; 