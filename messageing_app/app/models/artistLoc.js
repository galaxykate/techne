/**
*
* @author Johnathan Pagnutti
*
* This is schema for a bot's location in the central messaging server
*/

var mongoose = 	require('mongoose');
var Schema =	mongoose.Schema

var BotLocSchema = new Schema({
	location: String,
	type: String,
	name: String
});

module.exports = mongoose.model('BotLoc', BotLocSchema);
