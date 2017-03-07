var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Card = require('./cards');

var CardSchema = new Schema({
  subject: String,
  prompt: String,
  response: String
});

var Card = mongoose.model('Card', CardSchema);

module.exports = Card;
