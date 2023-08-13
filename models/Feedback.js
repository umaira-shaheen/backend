const mongoose=require("mongoose");
const feedbackSchema = new mongoose.Schema({
  StudentId:{
    type:String,
     required:true,
  },
  Name: {
    type: String,
    required: true,
  }, 
  Email: {
    type: String,
    required: true,
  },
  Course:{
    type:String,
    required:true,
  },
  Phone_Number:{
    type:String,
    required: true,
  },
  Experience:{
    type: String,
    required: true,
  },
  Comments: {
    type: String,
    required: true,
  },
  Subject:{
    type: String,  
  },
  Messege:{
    type: String,  
  }
}, { timestamps: true });
const feedback = mongoose.model("feedback", feedbackSchema);
module.exports = {feedback }; 