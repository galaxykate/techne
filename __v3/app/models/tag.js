/**
 * @author Johnathan
 * Model of a tag.  Tags a pair of strings in a key-value pair
 * Lets us do searches based on things like 'author' but an artist can add
 * whatever tags they want
 */
 var mongoose  = require('mongoose');
 var Schema    = mongoose.Schema;
 
 var TagSchema = new Schema({
   key: String,
   value: String
 });

 module.exports = mongoose.model('Tag', TagSchema);
