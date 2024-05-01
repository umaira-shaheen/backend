const mongoose=require("mongoose");
const lectureSchema = new mongoose.Schema({
  Lecture_title: {
    type: String,
    required: true,
  }, 
  Lecture_Course: {
    type: String,
    required: true,
  },
  Lecture_Number: {
    type: Number,
    required: true,
  },
  Lecture_files:{
    type:[String],

  },
 
  description: {
    type: String,
    
  },
  Added_by: {
    type: String,
    required: true,
  },
}, { timestamps: true });
const lecture = mongoose.model("lecture", lectureSchema);
module.exports = { lecture }; 