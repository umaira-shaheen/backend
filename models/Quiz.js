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
        validate: {
          validator: function(value) {
            return value > this.Start_date; // check if end date is greater than start date
          },
          message: 'End date should be greater than start date',
        },

      },
      Questions:{
        type:Number,
        required:true,

      },
      Status:{
        type:String,
        required:true,
      },
      Quiz_Course:{
        type:String,
        required:true,
      },
      Submitted_files:{
        type:Object,
        
      },
      Submitted_by:{
        type:Object,
        
      }
      
});
const quiz = mongoose.model("quiz", quizSchema);
module.exports = { quiz }; 