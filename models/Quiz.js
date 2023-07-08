const mongoose=require("mongoose");
const quizSchema=new mongoose.Schema({
    Quiz_title: {
        type: String,
        required: true,
      }, 
      Start_date:{
        type: Date,
        required:true,
      },
      End_date:{
        type:Date,
        required:true,

      },
      Questions:{
        type:Number,
        required:true,

      },
      Status:{
        type:String,
        required:true,
      }
      
});
const quiz = mongoose.model("quiz", quizSchema);
module.exports = { quiz }; 