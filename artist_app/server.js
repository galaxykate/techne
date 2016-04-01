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
    limit: '5mb',
    extended : true
}));
app.use(bodyParser.json({
    limit: '5mb'
}));

app.use(express.static('web'));

// set our port
var port = process.env.PORT || 8081;

// SCHEMA DEFINITIONS
// ============================================================================
var Art = require('../shared/models/art.js');
var Critique = require('../shared/models/critique.js');

// SCHEMA FILLING FUNCTIONS
// =============================================================================
/**
 * Fill the art schema from a provided data object.  Does some translation /
 * clean up of a provided art object to fit the bots internal art representation
 * @param  {Object} gen_object provided art object
 * @return {Object}            art that fits this bot's art representation
 */
var fillArt = function(gen_object){
    var art = new Art();
    // fill in art fields with stuff from the in-memory art representation
    art.title = gen_object.title || gen_object.name;
    art.tree = gen_object.reducedTree || gen_object.tree;
    if(gen_object.artist){
        art.artist = gen_object.artist;
    }
    art.content = gen_object.code || gen_object.content;
    return art;
};

/**
 * Fill the critique scheme from a provided data object.  Does some translation /
 * clean up of the provided data object to fit the internal cirtique representation
 * @param  {Object} gen_object provided critque Object
 * @return {Object}            critique object that fits this bot's critique representation
 */
var fillCritique = function(gen_object){
    var crit = new Critique();
    // fill in fields from the body
    crit.score = gen_object.score;
    if(gen_object.tree || gen_object.opinions){
        if(gen_object.opinions){
            crit.tree = gen_object.opinions;
        }else if(gen_object.tree){
            crit.tree = gen_object.tree;
        }
    }
    if(gen_object.art){
        crit.art = fillArt(gen_object.art);
    }

    return crit;
};


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();
// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log("Someone sent me a request");
    // allow for cross-domain resource sharing
    //res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
    // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://[serverloc]:[PORT]/techne/artist)
router.get('/', function(req, res) {
    res.json({
        message : "Hello, I'm a bot that's currently part of Techne."
    });
});


// on routes that end in /techne/artist/critique
// ----------------------------------------------------
router.route('/critique')

// pass the artist a critique to respond to (accessed at POST http://[serverloc]:[PORT]/techne/artist/critique)
/**
 * POST request for this bot to respond to another bot's critique of some art that
 * this bot generated.
 * @param  {Object}   req         A critique object of art this bot has made
 * @param  {Object}   res         This bot's response to that critique (what could this be?)
 * @return {None}                 This function just changes state and does not return anything
 */
.post(function(req, res) {
    //get the provided critique
    var temp_crit = req.body;
    //do some cleaning to the critique so our bot can read it
    var crit = fillCritique(temp_crit);
    //read the critique, change our internal state from it
    bot.respondToCritique(crit);

    //reply back
    res.json({
    message: "Thanks for your input.  It's given me a lot to think over."
    });
});

// on routes that end in /techne/artist/art
// ----------------------------------------------------
router.route('/art')

// get all the art that this artist feels like sharing  with that id (accessed at GET http://[serverloc]:[PORT]/techne/artist/art)
/**
 * GET request for this bot to return all the art it is currently storing
 * @param  {Object}   req         request for the bot to send its art.  (Empty?)
 * @param  {Object}   res         A list of all the art this bot wants to send back
 * @return {None}                 This function just changes state and does not return anything
 */
.get(function(req, res) {
    // TODO store art in someplace that isn't memory.
    var artList = [];
    console.log("Someone asked me for all my art.  I can't wait to show them what I've been making!");

    for(var i = 0; i < bot.art.length; i++){
        //make sure to clean the art before sending it out
        artList.push(fillArt(bot.art[i]));
    }
    res.json(artList);
});

// on routes that end in /techne/artist/art/:art_id
router.route('/art/:art_id')

// get the art at this id if the bot feels like sharing (accessed at GET http://[serverloc]:[PORT]/techne/artist/art/:art_id
/**
 * Get a particular art based on art ID, if the bot feels like sharing that particular art
 * @param  {Object} req           Request object for the bot to give a particular art.  (Empty?)
 * @param  {Object} res           Response with the particular art if the bot wants to share it
 * @return {None}                 This function just changes state and does not return anything
 */
.get(function(req, res) {
    //TODO currently unimplemented.
    res.json({
    message: "I'm not showing that particular art right now."
    });
});

// on routes that end in /techne/artist/respond
// --------------------------------------------------
router.route('/respond')

// pass this artist an art to critique (accessed at POST http://[serverloc]:[POST]/techne/artist/respond)
/**
 * Respond to a provided art with a critique
 * @param  {Object} req           Art object should be in the body of the request to this bot
 * @param  {Object} res           Critique object should be in the body of the response to this bot
 * @return {None}                 This function just changes state and does not return anything
 */
.post(function(req, res) {
    console.log("Someone gave me an art to critique, I'm honored!");
    //clean the incomming art
    var art = fillArt(req.body);
    //clean the critique that this bot gave to the provided art
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

    //if it takes to long to get a reply from the delete request, just go down hard
    setTimeout(function() {
      console.log("Something happened and I couldn't finish my work or say goodbye.");
      process.exit();
    }, 10*1000);
};

// START THE SERVER
// =============================================================================
var server = app.listen(port);
console.log("I'm an artist listening on " + port);

//TODO: connect to a database that can store arts this bot has made, or arts
//this bot likes, or other important, percistant data
//var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/test');
// connect to our database

// KILL LOGIC
// =============================================================================
// try to send a message to the commune that we're about to go down if we get a kill signal or a interupt signal
process.on('SIGTERM', shutdownGracefully);
process.on('SIGINT', shutdownGracefully);

//sub for the actual bot
var bot = new Bot();

// AGENT BEHVOUR LOGIC (INTRODUCTIONS + setInterval) LOOP
//==============================================================================
//start the live-loop by joining the commune.
// We do this by sending a POST request to the commune server announcing our IP and port,
// what type of art we do and our name
request.post(communeAddress + "/techne/artists", {
    'form': {
    'type': 'pictures', //we do picture art
    'location' : 'http://45.55.28.224:' + port, //we live at this IP and Port number
    'name': bot.name    //our name
    }
}, function(error, response, body){
    if(error){
      //initial request to commune errored out, we're about to cash.  whamp.
      console.log(error);
      bot.locId = undefined;
    }

    // We get a UUID from the commune, acknowledging that the commune knows we're
    // a member and will tell anyone else about us if we ask.
    var info = JSON.parse(body);
    bot.locId = info.locId;
    console.log("I should say hi to all my new art friends!");

    // Ask the commune for all the artists currently registered with it.
    request.get(communeAddress + "/techne/artists", function(error, response, body){
    if(error){
      //got an explicit error back.  Whamp.
       console.log(error);
       bot.fellowBots = undefined;
    }else if(response.statusCode != 200){
       //got an HTTP error code back.  Whamp-whamp.
       console.log("HTTP ERROR: " + response.statusCode);
       bot.fellowBots = undefined;
    }else{

       // got a list of bots back!
       var communeBots = JSON.parse(body);
       var friendLocations = [];
       //filter out our location from the response, we don't want to send arts to ourselves.
       for(var i = 0; i < communeBots.length; i++){
        if(communeBots[i]._id == bot.locId){
            continue;
        }

        friendLocations.push(communeBots[i].location);
       }

       //have the bot hold onto the friend locations out there.
       bot.friendLocations = friendLocations;
    }

    // now we've done introductions, check to make sure that we've introduced ourself properly.
    // (the bot has a location ID and a list of friends to send art to)
    if(bot.locId !== undefined && bot.friendLocations !== undefined){
        console.log("Ok, I've said hi to everyone and settled in...");
        // we've done our introductions correctly.  Start the live-loop

        setInterval(function(){
          console.log("I'm going to create a new art!");
          //create a new art and sanitize it for sending out to other bots
          var newestArt = fillArt(bot.createArt());

          // check to see if anyone new has joined the commune.
          request.get(communeAddress + "/techne/artists", function(error, response, body){
            if(error){
                //got an explicit error.
                console.log(error);
            }else if(response.statusCode != 200){
                //got a error code.
                console.log("HTTP ERROR: " + response.statusCode);
            }else{
                // successfully got a list of bots currently in the commune, parse the list
                var communeBots = JSON.parse(body);
                var friendLocations = [];
                //compile all locations of the commune bots, filtering out our own
                //location
                for(var i = 0; i < communeBots.length; i++){
                    if(communeBots[i]._id == bot.locId){
                        continue;
                    }
                    friendLocations.push(communeBots[i].location);
                }
                //save the current friend locations
                bot.friendLocations = friendLocations;

                for(var locIdx = 0; locIdx < bot.friendLocations.length; locIdx++){
                    //send a request to each bot in the list to critique all our art
                    console.log("Asking my friend at " + bot.friendLocations[locIdx] + " for some critique...");
                    console.log(bot.friendLocations[locIdx] + "/techne/artist/respond");
                    //send a request to a bot to critique the new piece of art
                    request.post(bot.friendLocations[locIdx] + "/techne/artist/respond",{
                        'form': {
                            'title': newestArt.title, //art title
                            'tree': newestArt.tree,   //tree representation of the art
                            '_id': newestArt._id,     //art UUID
                            'code': newestArt.content //raw code for the art content
                        }
                    }, function(error, response, body){
                        if(error){
                            //got an error back when we asked for a critique on our new art
                            console.log("Got an error back.");
                            console.log(error);
                            console.log(response);
                            console.log(body);
                        }else{
                            //got a critique back from the art I presented, see if I want that
                            //critique to change how I make art.
                            console.log("I got a critique back!");
                            console.log(body);
                            var crit = fillCritique(JSON.parse(body));
                            bot.respondToCritique(crit);
                        }
                    });
                }
            }
        });
      }, 1*30*1000); //do the live loop every 30 seconds.
    }
    });
});
