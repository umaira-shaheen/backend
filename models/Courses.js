const mongoose=require("mongoose");
const courseSchema = new mongoose.Schema({
  Course_title: {
    type: String,
    required: true,
  }, 
  Course_code: {
    type: String,
    required: true,
  },
  course_img:{
    type:String,
    required: true,
  },
  Course_category: {
    type: String,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value > this.start_date; // check if end date is greater than start date
      },
      message: 'End date should be greater than start date',
    },
  },
  description: {
    type: String,
    required: true,
  },
  created_by: {
    type: String,
    required: true,
  },
  assigned_to: {
    type: String,
  },
  status:{
    type:String,
    required:true,
  },
  Students:{
    type:[String]
  }
}, { timestamps: true });
const course = mongoose.model("course", courseSchema);
module.exports = { course }; 