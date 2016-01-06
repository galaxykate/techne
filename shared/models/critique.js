/**
 * @author Kate and Johnathan
 * Model of a critique object
 */

var mongoose     = require('mongoose');
var Art		 = require('./art.js');
var Schema       = mongoose.Schema;

var CritiqueSchema   = new Schema({
    tree: Schema.Types.Mixed,
    score: Number,
    art: {type: mongoose.Schema.Types.ObjectId, ref: 'Art'}
});

module.exports = mongoose.model('Critique', CritiqueSchema);
