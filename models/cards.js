var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Card = require('./cards');

var CardSchema = new Schema({
  prompt: String,
  response: String,
  image: String,
  theme: String,
  count: Number
});

var Card = mongoose.model('Card', CardSchema);

module.exports = Card;
