const mongoose=require("mongoose");
const courseSchema=new mongoose.Schema({
    Course_title: {
        type: String,
        required: true,
      }, 
      Course_code: {
        type: String,
        required: true,
      },
      Course_category:{
        type: String,
        required:true,
      },
      start_date:{
        type: Date,
        required:true,
      },
      end_date:{
        type:Date,
        required:true,

      },
      description:{
        type:String,
        required:true,

      }
      
});
const course = mongoose.model("course", courseSchema);
module.exports = { course }; 