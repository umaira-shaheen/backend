const mongoose=require("mongoose");
const assignmentSchema=new mongoose.Schema({
    Assignment_title: {
        type: String,
        required: true,
      }, 
      description:{
        type: String,
        required:true,
      },
      Date:{
        type:Date,
        required:true,

      },
      Total_marks:{
        type:Number,
        required:true,

      },
      Status:{
        type:String,
        required:true,

      }
      
});
const assignment = mongoose.model("assignment", assignmentSchema);
module.exports = { assignment }; 