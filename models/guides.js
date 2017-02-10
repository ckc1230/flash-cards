var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Guide = require('./guides');

var GuideSchema = new Schema({
  creator: String,
  subject: String,
  cards: [{ type : Schema.Types.Object, ref: 'Card' }]
});

var Guide = mongoose.model('Guide', GuideSchema);

module.exports = Guide;
