const mongoose=require("mongoose");
const certificateSchema=new mongoose.Schema({
    Course_id: {
        type: String,
        required: true,
      }, 
      Course_name:{
        type: String,
        required: true,
      },
      feedback:{
        type: String,
        required:true,
      },  
      generated_by:{
        type: String,
        required:true,
      },
      Students:{
        type: [String],
        required:true,
      }
      
}, { timestamps: true });;
const certificate = mongoose.model("certificate", certificateSchema);
module.exports = { certificate }; 