var mongoose=require('mongoose');
const {quiz}=require("../models/Quiz");
async function GetQuiz(req,res,next)
{
  const filter = {};
  const AllQuizes = await quiz.find(filter);
  res.send(AllQuizes);
  
}
async function  AddQuiz(req,res,next)
{
  
      const first_quiz=new quiz({Quiz_title:req.body.quiz_title, Start_date:req.body.start_date, End_date:req.body.end_date, Questions:req.body.questions});
      first_quiz.save().then((result) => res.send("success"))
     .catch((error) => res.send(error));
     
      // res.send(docs);
};
async function DeleteQuiz(req,res,next)
{
  
  quiz.findByIdAndRemove({_id: mongoose.Types.ObjectId(req.query.temp_id)}, (err) =>{

    if(err){
        res.send({"indicator":"error","messege":err}); //server run kr k check kren
    }
    else{
      res.send({"indicator":"success","messege":"Quiz deleted successfully"});
    }
 })
};
async function FindQuiz(req,res,next)
{
  
  const QuizData = await quiz.findOne({_id : mongoose.Types.ObjectId(req.query.temp_id)});
  res.send(QuizData);
};
async function EditQuiz(req,res,next)
{
  
  quiz.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.id),{Quiz_title:req.body.quiz_title, Start_date:req.body.start_date, End_date:req.body.end_date, Questions:req.body.questions}, function(error,docs)
  {
    if(error)
    {
      res.send("Failed to update the Quiz");
    }
    else
    {
     res.send("success");
    }
      
      // res.send(docs);
    })
 };

module.exports={AddQuiz,GetQuiz,DeleteQuiz,EditQuiz,FindQuiz};
  
