/**
 * @author Johnathan
 * Model of an art.  Arts are a blob of stuff (using Mongoose's anything goes
 * Mixed SchemaType) and of tags
 */
var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var Tag = require('./tag').schema;

var ArtSchema = new Schema({
  tags: [Tag],
  art:  Schema.Types.Mixed
});

module.exports = mongoose.model('Art', ArtSchema);
