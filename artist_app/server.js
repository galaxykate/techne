/**
 * @author Kate and Johnathan
 */
// The node process around an artist for our commune.  A lot of this is framework code to be implemeneted differently as we go

// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
// call express
var app = express();
// define our app using express
var bodyParser = require('body-parser');
var path = require("path");
var request = require("request"); //library to do basic HTTP requests in node

// and we'll actually need to import a bot
var Bot = require("./app/artist.js");

// this is the path of the messaging server that keeps track of who is in this commune
var communeAddress = "http://45.55.28.224:8080"

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
    extended : true
}));
app.use(bodyParser.json());

app.use(express.static('web'));

var port = process.env.PORT || 8081;
// set our port

// SCHEMA DEFINITIONS
// ============================================================================
var Art = require('../shared/models/art.js');
var Critique = require('../shared/models/critique.js');

// SCHEMA FILLING FUNCTIONS
// =============================================================================
var fillArt = function(gen_object){
    var art = new Art();
    // fill in art fields with stuff from the in-memory art representation
    if(gen_object.name){
	art.name = gen_object.name;
    }
    if(gen_object.tree){
	art.tree = gen_object.tree;
    }
    if(gen_object.artist){
	art.artist = gen_object.artist;
    }
    if(gen_object.code){
	art.content = gen_object.code
    }
    return art;
}

var fillCritique = function(gen_object){
    var crit = new Critique();
    // fill in fields from the body
    if(gen_object.score){
	crit.score = gen_object.score
    }
    if(gen_object.tree || geb_object.opinions){
    	crit.tree = gen_object.opinions
    }
    if(temp_crit.art){
	crit.art = fillArt(gen_object.art);
    }
    return crit;
}

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();
// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log("Someone sent me a request");
    next();
    // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://[serverloc]:8081/techne/artist)
router.get('/', function(req, res) {
    res.json({
        message : "Hello, I'm a bot that's currently part of Techne."
    });
});

// on routes that end in /techne/artist/critique
// ----------------------------------------------------
router.route('/critique')

// pass the artist a critique to respond to (accessed at POST http://[serverloc]:8081/techne/artist/critique)
.post(function(req, res) {
    var temp_crit = req.body;
    var crit = fillCritique(temp_crit);
    bot.respondToCritique(crit);

    res.json({
	message: "Thanks for your input.  It's given me a lot to think over."
    });
});

// on routes that end in /techne/artist/art
// ----------------------------------------------------
router.route('/art')

// get all the art that this artist feels like sharing  with that id (accessed at GET http://[serverloc]:8081/techne/artist/art)
.get(function(req, res) {
    // TODO store art in someplace that isn't memory.
    var artList = [];
    for(var i = 0; i < bot.art.length; i++){
	artList.push(fillArt(bot.art[i]));
    }
    res.json(artList);
});

// on routes that end in /techne/artist/art/:art_id
router.route('/art/:art_id')

// get the art at this id if the bot feels like sharing (accessed at GET http://[serverloc]:8081/techne/artist/art/:art_id
.get(function(req, res) {
    res.json({
	message: "I'm not showing that particular art right now."
    });
});

// on routes that end in /techne/artist/respond
// --------------------------------------------------
router.route('/respond')

// pass this artist an art to critique (accessed at POST http://[serverloc]:8081/techne/artist/respond)
.post(function(req, res) {
    var art = fillArt(req.body);
    var crit = fillCritique(bot.evaluateArt(art));

    res.json(crit);
});
	
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /techne/artist
app.use('/techne/artist', router);

// GRACEFUL SHUTDOWN LOGIC --------------------------
// we want to send a final request to the messaging server to remove us from the commune when we shut down
var shutdownGracefully = function(){
   console.log("Ok. I need to finish any work people are waiting for and say goodbye to all my art friends.");
   server.close(function(){
	console.log("... I promise I'm saying goodbye right now.");
	request.del(communeAddress + "/techne/artist/" + bot.locId, function(error, response, body){
	    if(error){
		console.log(bot.locId);
		console.log(error);
	    }
	    process.exit();
       });
    });

    setTimeout(function() {
	console.log("Something happened and I couldn't finish my work or say goodbye.");
	 process.exit()
    }, 10*1000);
};

// START THE SERVER
// =============================================================================
var server = app.listen(port);
console.log("I'm an artist listening on " + port);

//var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/test');
// connect to our database

// KILL LOGIC
// =============================================================================
process.on('SIGTERM', shutdownGracefully);
process.on('SIGINT', shutdownGracefully);

//sub for the actual bot
var bot = new Bot();

// AGENT BEHVOUR LOGIC (INTRODUCTIONS + setInterval) LOOP
//==============================================================================
request.post(communeAddress + "/techne/artists", {
    'form': {
	'type': 'pictures',
	'location' : '45.55.28.244:8081',
	'name': bot.name
    }
}, function(error, response, body){
    if(error){
	console.log(error);
	bot.locId = undefined;
    }
    var info = JSON.parse(body);    
    bot.locId = info.locId;
    console.log("I should say hi to all my new art friends!");
    request.get(communeAddress + "/techne/artists", function(error, response, body){
	if(error){
	   console.log(error);
	   bot.fellowBots = undefined;
	}else if(response.statusCode != 200){
	   console.log("HTTP ERROR: " + response.statusCode);
	   bot.fellowBots = undefined;
	}else{
	   // we've got a list of bots
	   var communeBots = JSON.parse(body);
	   var friendLocations = [];
	   for(var i = 0; i < communeBots.length; i++){
		if(communeBots[i]._id == bot.locId){
		    continue;
		}
		friendLocations.push(communeBots[i].location);
	   }
	   bot.friendLocations = friendLocations;
	}
	// now we've done introductions, check to make sure that we've introduced ourself properly.
	if(bot.locId == undefined || bot.friendLocations == undefined){
	    console.log("I had a hard time saying hello.  Communication is weird.");
	    shutdownGracefully();   
	}else{
	    // we've done our introductions correctly.  Start our eval loop.
	    // TODO
	} 	 	
    });
});
