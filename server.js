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

app.get('/cards', function homepage(req, res) {
  res.sendFile(__dirname + '/views/cards.html');
});

/* API ROUTES */ 

app.get('/api/cards', function indexCards(req, res) {
  db.Card.find({}, function(err, allCards) {
    if (err) { throw err; };
    res.json(allCards);
  });
});

app.get('/api/cards/:id', function showCard(req, res) {
  db.Card.findById({ _id: req.params.id }, function(err, card) {
    if (err) { throw err; };
    res.json(card);
  });
});

app.post('/api/cards', function createCard(req, res) {
  var newCard = {
    subject: req.body.subject,
    prompt: req.body.prompt,
    response: req.body.response
  }
  db.Card.create(newCard, function(err, card) {
    if (err) { throw err; };
    res.json(card);
  });
});

app.delete('/api/cards/:id', function deleteCard(req, res) {
  db.Card.remove({ _id: req.params.id }, function(err, card) {
    if (err) { throw err; };
    res.json(card);
  })
})

app.put('/api/cards/:id', function updateCard(req, res) {
  db.Card.findOne({_id: req.params.id}, function(err, foundCard) {
    if (err) { console.log('error', err); }
    if (req.body.prompt) { foundCard.prompt = req.body.prompt; }
    if (req.body.response) { foundCard.response = req.body.response; }
    if (req.body.subject) { foundCard.subject = req.body.subject; }
    foundCard.save(function(err, saved) {
      if(err) { console.log('error', err); }
      res.json(saved);
    });
  });
});

/* SERVER SET UP */ 

app.listen(process.env.PORT || 3000, function() {
  console.log('Your server is running on port 3000');
});