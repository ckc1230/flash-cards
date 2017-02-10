/* MODULE IMPORTS */

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

/* DATABASE */

var db = require('./models');

/* HTML ROUTES */ 

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// app.get('/templates/:name', function templates(req, res) {
//   var name = req.params.name;
//   res.sendFile(__dirname + '/views/templates/' + name + '.html');
// });

/* API ROUTES */ 

// app.get('/api/ecards', function indexECards(req, res) {
//   db.ECard.find({}, function(err, allECards) {
//     if (err) { throw err; };
//     res.json(allECards);
//   });
// });

// app.get('/api/ecards/:id', function showECard(req, res) {
//   db.ECard.findById({ _id: req.params.id }, function(err, eCard) {
//     if (err) { throw err; };
//     res.json(eCard);
//   });
// });


// app.post('/api/ecards', function createECard(req, res) {
//   var newECard = {
//     message: req.body.message,
//     theme: req.body.theme
//   }
//   db.ECard.create(newECard, function(err, ecard) {
//     if (err) { throw err; };
//     res.json(ecard);
//   });
// });

/* SERVER SET UP */ 

app.listen(process.env.PORT || 3000, function() {
  console.log('Your server is running on port 3000');
});