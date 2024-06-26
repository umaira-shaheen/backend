const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  UserName: {
    type: String
  },
  First_name: {
    type: String,
    required: true,
  },
  Last_name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Phone_no: {
    type: String,
    // required: true,

  },
  Role: {
    type: String,
    // required: true,

  },
  Address: {
    type: String,
    // required: true,

  },
  Password: {
    type: String,
    // required: true,

  },
  Confirm_Password:{
    type:String,
  },
  User_img:{
    type:String,
    
  },
  Bio:{
    type:String,
  },
  Token:{
    type:String
  }

}, { timestamps: true });

const user = mongoose.model("user", userSchema);
module.exports = { user }; 