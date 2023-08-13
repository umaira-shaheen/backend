var express = require('express');
const path = require('path');
var app = express();
var cors=require('cors');

app.use(cors({ credentials: true, origin: true }))

app.options('*', cors());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

const session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
app.use(cookieParser('secret', {
  cookie: {
    httpOnly: false,
    path: '/',
    domain: 'localhost',
    expires: new Date(Date.now() + 900000),
    maxAge: 900000,
    secure: false
  }
}));
app.use(session({
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  secret: "secret"
}))
var mongoose=require('mongoose');

const authRouter=require('./routes/auth_routes');
const courseRouter=require('./routes/course_routes');
var usersRouter = require('./routes/user_routes');
var quizRouter = require('./routes/quiz_routes');
var feedbackRouter= require('./routes/feedback_routes');
var messegeRouter= require('./routes/messege_routes');
var assignmentRouter = require('./routes/assignment_routes');
var questionRouter = require('./routes/question_routes');
var lectureRouter = require('./routes/lecture_routes');

var createError = require('http-errors');
const { User } = require("./models/Users");
const { course } = require("./models/Courses");
const { quiz} = require("./models/Quiz");
const { feedback} = require("./models/Feedback");
const { messege} = require("./models/Messege");
const { assignment} = require("./models/Assignment")
const { question} = require("./models/Question")
const { lecture} = require("./models/Lecture")

var indexRouter = require('./routes/index');



const { Console } = require('console');
const string='mongodb://localhost:27017/UKCELL';
// const string= 'mongodb://localhost:27017/test_db';
mongoose.connect(string).then((result) => app.listen(4000))
.catch((error) => console.log(error));
// var Schema=mongoose.Schema;
// const dog_schema=Schema({_id:String ,id:Number ,name:StriSng , breed:String , age:Number});

// const student_schema=Schema({firstname:String , lastname:String, email:String, password:String});
// const Dog=mongoose.model('Dog', dog_schema);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/auth',authRouter);
app.use('/course',courseRouter);
app.use('/User',usersRouter);
app.use('/Quiz',quizRouter);
app.use('/Assignment',assignmentRouter);
app.use('/Question',questionRouter);
app.use('/Feedback',feedbackRouter);
app.use('/Messege',messegeRouter);
app.use('/Lecture',lectureRouter);
app.use('/', indexRouter);
app.use('/about-me', indexRouter);
app.use('/uploads', express.static('uploads'));
// app.use('/users', usersRouter);


app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
