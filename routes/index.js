var express = require('express');
var router = express.Router();
var clients = {};

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quizz', message: '' });
});

router.post('/register', function(req, res) {
    if(!req.body.name) {
        res.status(400);  // error
        res.send('Please fill in your name.');
        return;
    }
    if( clients.hasOwnProperty(req.body.name)) {
        res.status(400);
        res.send('Name already exists, choose anotherone.');
    } else {
      req.session.cookie.expires = false;   // only as long as useragent exists.    
      req.session.name = req.body.name;     // used for check on login.
      req.session.score = { correct: 0, error: 0};  
      res.cookie('quizz', req.body.name);   // set a cookie 'quizz' with user name.  
      
      clients[req.body.name] = req.session;
      console.log("User registered with name=" + req.body.name);
    
      res.status(200);  // ok
      res.send("");     // client should redirect to quizz page.
    }
});

/* GET quizz page. */
router.get('/quizz', function(req, res) {
    // if registered show quizz question page.
    if(req.session.name) {
        console.log('Name from cookie:' + res.cookie.quizz);  // ???
        res.render('quizz', { title: 'Quizz', name: req.session.name });
    } else {
        // if not registered show index/register page.
        res.render('index', { title: 'Quizz' });
    }
});

/*********** ADMIN MODULE ***************/
/* GET dashboard login page. */
router.get('/dashboard', function(req, res) {
    // if user logged in: show dashboard page.
    if(req.session.loggedin === true) {
        console.log('req.session.loggedin=' + req.session.loggedin);
        res.render('dashboard', { title: 'Quizz Dashboard' });
    } else {        
        console.log('req.session.loggedin=' + req.session.loggedin);
        // if not logged in: show login page.
        res.render('login', { title: 'Quizz Dashboard login', message: '' });
    }
});

/* POST login page. */
router.post('/login', function(req, res) {
    // check username and password, if ok set login to true in session.
    if(req.body.username === '1' && req.body.password === '1') {
        req.session.loggedin = true;
        res.redirect ('/dashboard');
    } else {
        // if not ok back to login page.
        req.session.loggedin = false;
        res.render('login', { title: 'Quizz Dashboard login', message: 'Invalid username or password' });
    }
});

router.get('/logout', function(req, res) {
    req.session.loggedin = false;
    req.session.destroy(function(error){});
    res.render('login', { title: 'Quizz Dashboard login', message: '' });
});

module.exports = router;
