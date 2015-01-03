var fs = require('fs');
var express = require('express');
var router = express.Router();
var questions = JSON.parse(fs.readFileSync('questions.json', 'utf8'));
var instructions = JSON.parse(fs.readFileSync('instructions.json', 'utf8'));

router.get('/questions', function(req, res) {
    console.log("questions retrieved");
    res.json(questions);
});

router.get('/instructions', function(req, res) {
    console.log("instructions retrieved");
    res.json(instructions);
});

router.post('/answer', function(req, res) {
    console.log("answer received" );
    res.status(200);  // ok
    res.send("");
});

module.exports = router;
