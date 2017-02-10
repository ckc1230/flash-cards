var mongoose = require("mongoose");
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/fun-ecards");

var Guide = require('./guides');
var Card = require('./cards');

module.exports.Guide = Guide;
module.exports.Card = Card;
