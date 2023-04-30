var express = require('express');

var app = express();
var cors=require('cors');
app.use(cors({
  origin: '*',
  credentials: true
}));

app.options('*', cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const session = require('express-session');
var path = require('path');
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
var assignmentRouter = require('./routes/assignment_routes');
var createError = require('http-errors');
const { User } = require("./models/Users");
const { course } = require("./models/Courses");
const { quiz} = require("./models/Quiz");
const { assignment} = require("./models/Assignment")


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
app.use('/', indexRouter);
app.use('/about-me', indexRouter);
// app.use('/users', usersRouter);

// app.get("/add_courses", async (req, res) => {
//  const first_course=new course({Course_title:'IELTS', Course_id: 1});
//   first_course.save().then((result) => res.send("successfully inserted"))
//  .catch((error) => console.log(error));
// });

// app.get('/add_dog',(req, res)=>{
//   const first_dog=new Dog({id:'1', name:'rock', breed: 'booly',age:'11'});
//   first_dog.save().then((result) => res.send('successfully inserted'))
//   .catch((error) => console.log(error));
// });
// app.get('/get_dog',async (req, res)=>{
//   var response= await Dog.find();
//   res.send(response);
// });

// app.get("/update_dogs", async (req, res) => {
//   const my_id = req.query.id
//   const dog = await Dog.findOneAndUpdate({breed: my_id}, {age: 23}, {new:true});
//   res.send(dog);
//   // return res.status(200).json(dog);
// });
// app.get("/delete_dogs", async (req, res) => {
//   const my_id = req.query.id
//    Dog.findOneAndDelete({breed: my_id},function (err, docs) {
//     res.send(docs);
// });
  
  // return res.status(200).json(dog);
// });

// app.get('/add_data',(req, res)=>{
//   const first_student=new Student({firstname:'ali', lastname:'hassan', email:'ali@gmail.com', password:'ali12'});
//   first_student.save().then((result) => res.send('successful'))
//   .catch((error) => console.log(error));
// });

// catch 404 and forward to error handler
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
