var db = require("./models");

var guideList = [];
var cardList = [];

/* QUESTIONS */

cardList = [
{
  subject: 'Medicine',
  prompt: 'Heart',
  answer: 'Pumps things'
},
{
  subject: 'Health',
  prompt: 'Fun',
  answer: 'Good things'
}]



var guideOne = {
  creator: 'Maria',
  subject: 'Medicine',
  cards: []
}

guideList.push(guideOne);

// Creating Questions

db.Card.remove({}, function(err, cards) {
  db.Card.create(cardList, function(err, cards) {
    if (err) { return console.log("Error:", err) }
  });
  console.log("Cards SAVED");

  db.Guide.remove({}, function(err, guides) {
    guideList.forEach(function(guideData) {
      var guide = new db.Guide(guideData); 
      db.Card.find({ subject: guideData.subject}, function(err, foundCards) {
          if (err) { return console.log("Error:",err) };
          guide.cards = foundCards;
          guide.save(function(err, savedECard) {
            if (err) { return console.log("Error:",err) };
          });
        });
    });
    console.log("Guides SAVED");

  }); // End Themes

});
