
/**
 * @authorr Kate and Johnathan
 * Model of an art object (right now, this is an SVG tracery image)
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ArtSchema   = new Schema({
    title: String,
    tree: Schema.Types.Mixed,
    artist: String,
    content: Schema.Types.Mixed
});

module.exports = mongoose.model('Art', ArtSchema);
