const mongoose=require("mongoose");
const questionSchema=new mongoose.Schema({
    Question: {
        type: String,
        required: true,
      }, 
      questions_type:{
        type: String,
        required:true,
      },
      options:{
        type:String,

      },
      marks:{
        type:Number,
        required:true,

      },
      created_by: {
        type: String,
        required: true,
      },
      quiz_title: {
        type: String,
        required: true,
      },
});
const question = mongoose.model("question", questionSchema);
module.exports = { question }; 