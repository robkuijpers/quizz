var fs = require('fs');
var path = require('path');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var session = require('express-session');
var socketio = require('socket.io');
//var clientAdmin = require('quizzclients');

var app = express();
var server = http.Server(app);

var routes = require('./routes/index');
var questions = require('./routes/questions');

// View engine setup
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: '$#%!@#@@#SSDASASDVV@@@@',  name: 'sid', saveUninitialized: true, resave: true}));

app.use('/questions', questions);
app.use('/', routes);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

server.listen(app.get('port'), function() {
    console.log('listening on port:' + app.get('port'));
});

// Socket.io
var io = socketio.listen(server);
io.on('connection', function (client) {
    console.log('client connected');

    client.on('question', function (data) {
        console.log('Question message received from dashboard:' + data);
        // send 'question' event to all clients except myself.
        client.broadcast.emit('question', data);
        console.log('Question message send to all clients:' + data);
    });
    
    client.on('start', function () {
        console.log('Start message received from dashboard.');
        // send 'start' event to all (other) clients.
        client.broadcast.emit('start');
        console.log('Start message send to all clients.');
    });
    
    client.on('end', function () {
        console.log('End message received from dashboard.');
        // send 'end' event to all (other) clients.
        client.broadcast.emit('end');
        console.log('End message send to all clients.');
    });
    
    client.on('answer', function (data) {
        console.log('Answer message received from client:' + data);
    });
    
    client.on('disconnect ', function () {
        console.log('Client disconnected.');
    });
});

