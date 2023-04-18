var mongoose=require('mongoose');
const {assignment}=require("../models/Assignment");
async function GetAssignment(req,res,next)
{
  const filter = {};
  const AllAssignments= await assignment.find(filter);
  res.send(AllAssignments);
  
}
async function  AddAssignment(req,res,next)
{
  
      const first_assignment=new assignment({Assignment_title:req.body.assignment_title, File:req.body.file, Date:req.body.date, Total_marks:req.body.total_marks, Description:req.body.description});
      first_assignment.save().then((result) => res.send("success"))
     .catch((error) => res.send(error));
     
      // res.send(docs);
};
async function DeleteAssignment(req,res,next)
{
  
  assignment.findByIdAndRemove({_id: mongoose.Types.ObjectId(req.query.temp_id)}, (err) =>{

    if(err){
        res.send({"indicator":"error","messege":err}); //server run kr k check kren
    }
    else{
      res.send({"indicator":"success","messege":"Assignment deleted successfully"});
    }
 })
};
async function FindAssignment(req,res,next)
{
  
  const AssignmentData = await assignment.findOne({_id : mongoose.Types.ObjectId(req.query.temp_id)});
  res.send(AssignmentData);
};
async function EditAssignment(req,res,next)
{
  
  assignment.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.id),{Assignment_title:req.body.assignment_title, File:req.body.file, Date:req.body.date, Total_marks:req.body.total_marks, Description:req.body.description}, function(error,docs)
  {
    if(error)
    {
      res.send("Failed to update the Assignment");
    }
    else
    {
     res.send("success");
    }
      
      // res.send(docs);
    })
 };

module.exports={AddAssignment,GetAssignment,DeleteAssignment,EditAssignment,FindAssignment};
  
