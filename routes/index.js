var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

router.get('/about-me',function(req, res, next) {
  // res.send('umaira shaheen. 21 years old');
  res.send('rida fatima here');
 
} );
