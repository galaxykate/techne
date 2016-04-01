/**
 * @author Kate and Johnathan
 * Create a virtual artist
 */
var tracery = require('./tracery.js'); //Powered by the Tracery grammar engine
var grammar = require('./grammar.js'); //Some prefab grammars that are useful for things

// coping the getRandom function from the main app file
var getRandom = function(a){
    return a[Math.floor(Math.random() * a.length)];
};

//a simplified trace node
//used for communicating over a network
function ArtNode(){
    this.children = [];
}

/**
 * Create an art generator that this bot can use to make new art
 */
function Generator() {
    //types of art this generator makes
    this.genre = getRandom(["painting"]);
    //generate a name for the state that the bot is in when it generates this art
    this.period = grammar.flatten("#emotionAdj.capitalize# #phase.capitalize#");
    var hexDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    //return a string encoding of a hex color code
    function randomHex() {
        return "\\#" + getRandom(hexDigits) + getRandom(hexDigits) + getRandom(hexDigits) + getRandom(hexDigits) + getRandom(hexDigits) + getRandom(hexDigits);
    }

    //SVG code for various shapes.  Represented are squares of various sizes, circles of various sizes and polygons with 3 points (triangles)
    this.shapes = ['rect width="#num#" height="#num#" x="#num#" y="#num#"', 'circle cx="#num#" cy="#num#" r="#num#"', 'polygon points="#num#,#num# #num#,#num# #num#,#num#"'];

    //Tracery grammar
    var raw = {
        color : [randomHex(), randomHex()],
        digit : ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        hexdigit : [],
        num : ["#digit##digit#"],
        type : [getRandom(this.shapes)],
        stroke : ['stroke="#color#" stroke-width="#digit#" stroke-opacity="0.#digit#"', ""],
        fill : ['fill="#color#" fill-opacity="0.#digit#"'],
        shape : ["<#type# #stroke# #fill# />"],
        bg : ["<rect width='300' height='300' x='-100' y='-100' fill='black' />"],
        origin : ['<svg width="100" height="100">#bg##shape##shape##shape##shape##shape##shape##shape#</svg>']

    };
    this.raw = raw;
    //reference to the tracery art-creating grammar
    this.grammar = tracery.createGrammar(raw);
}

/**
 * Create a new artwork!  Each artwork is a trace through the Tracery grammar
 * @return {Object} the artwork.  The tree param contains the trace, code has the finished text,
 *                      					title uses a seperate grammar to create the artwork
 */
Generator.prototype.createArt = function() {
    var tree = this.grammar.expand("#origin#");
    var art = {
        title : grammar.flatten("#workName#"),
        tree : tree,
        code : tree.finishedText,
        genre : this.genre,
        generator : this,
    };

    //tracery traces have a lot of extra stuff in them, build a new tree that only has
    //the bare minimum needed to transmit an art
    art.reducedTree = this.createReducedTree(art.tree, new ArtNode());
    return art;
};

/**
 * Convert a tracery trace to a simplified trace that has the minimum amount
 * of information needed to transmit an art.
 * Essentally this is just the expansion text and what it expanded into in this trace
 * @param  {Object} traceryTreeNode the tracery trace node we want to reduce
 * @param  {Object} reducedTreeNode the reduce node we want to fill in with relevant trace node data
 * @return {Object}                 the reduced trace
 */
Generator.prototype.createReducedTree = function(traceryTreeNode, reducedTreeNode){
    //for all potential values of the type of a the tracery node...
    switch(traceryTreeNode.type){
        case -1:
            //node is a root
            reducedTreeNode.lhs = traceryTreeNode.childRule;
            reducedTreeNode.rhs = traceryTreeNode.childRule;
            break;
        case 0:
            //node is a leaf
            reducedTreeNode.lhs = traceryTreeNode.raw;
            reducedTreeNode.rhs = traceryTreeNode.finishedText;
            break;
        case 1:
            //node is in the middle somewhere
            reducedTreeNode.lhs = traceryTreeNode.raw;
            reducedTreeNode.rhs = traceryTreeNode.childRule;
            break;
    }

    if(traceryTreeNode.children){
        //recursively finish out the tree if this node has children
        for(var i = 0; i < traceryTreeNode.children.length; i++){
            reducedTreeNode.children.push(this.createReducedTree(traceryTreeNode.children[i], new ArtNode()));
        }
    }

    return reducedTreeNode;
};

/**
 * An opinion is what this bot is looking for in a trace.
 * lhs is a node in the trace that the bot thinks is important
 * rhs is how the bot thinks lhs should be expanded in a trace
 * @param {Generator} basis the generator that this opinion is formed over.  Ensures that the bot makes opinions it can react to
 * @param {Object} lhs   A node in a trace that a bot thinks should be expanded in a particular way
 */
function Opinion(basis, lhs) {
    //My opinions are things I want to see in art.
    this.description = "I score things based on how much of other things they have that I like.";

    //look at how the generator can expand the lhs symbol, and pick one.  This is how the bot thinks the lhs symbol
    //should always be expanded
    this.rhs = getRandom(basis.raw[lhs]);
    this.lhs = lhs;
}

/**
 * Recursively search over a trace for all instances of this particular opinion (points where the lhs did expand into the rhs),
 * and count all of those instances
 * @param  {ArtNode} artNode current location in the trace
 * @param  {Number} feeling current count of all the times that we've seen this opinion
 * @return {Number}         count of all the times the tree contained this opinion
 */
Opinion.prototype.applyOpinion = function(artNode, feeling) {
    // get information on the current node
    var nodeVal = artNode.rhs;
    var nodeCtx = artNode.lhs;

    // if this node doesn't have any of the information we expect a node to have,
    // just return the current score
    if (nodeVal === undefined || nodeCtx === undefined){
        return feeling;
    }

    //I see the thing I like!
    if(nodeVal == this.rhs && nodeCtx == this.lhs){
        //increment the feeling
        feeling = feeling + 1;
    }

    //if this node has children, keep recusrively going through the tree
    if(artNode.children){
        for(var i = 0; i < artNode.children.length; i++){
            feeling = this.applyOpinion(artNode.children[i], feeling);
        }
    }

    return feeling;
};

/**
 * Evalaute how this opinion makes us feel about a trace.
 * @param  {Object} art an art that we want to evaluate
 * @return {Object}     An object that contains all the information we'd want to have after finishing an evaluation.
 *                         Currently, it's just this opinion's score
 */
Opinion.prototype.evaluate = function(art) {
    // how well this art fits this opinion
    var fitsOpinion = 0;

    // the trace (tree representation of the art we want to evaluate)
    var composition = art.reducedTree || art.tree;

    //start our scoring at 0, but maybe other factors could change this start point?
    fitsOpinion = this.applyOpinion(composition, 0);

    return {
        value: fitsOpinion
    };
};

/**
 * Constructor for a new art bot.  Bots have a name, a place to store some art,
 * various state variables that can be tweaked, a set of generators to make art,
 * and opinions about how art should be made
 */
function Bot() {
    // Create a name
    this.name = grammar.flatten("#botName#");
    this.art = [];

    //openness is how likely I am to use someone else's ideas.
    //if openness is <= 0 I don't care about other's critique and won't use it
    //in my art ('fuck em' mode)
    this.openness = 0;

    // Ways of making art
    this.generators = [];
    // Create opinions
    this.opinions = [];

    this.generators.push(new Generator());
    //form an opinion based on this generator
    this.opinions[0] = new Opinion(this.generators[0], "type");
    this.opinions[1] = new Opinion(this.generators[0], "color");

    //lets have some starting art
    for (var i = 0; i < 1; i++) {
        this.createArt();
    }
}


/**
 * Create a new art!
 * @return {Object} An object that contains the trace of this art, along with metadata
 */
Bot.prototype.createArt = function() {
    //pick a random generator to use to make art, then tell it to make a new art
    var art = getRandom(this.generators).createArt();
    //sign the art with our name
    art.artist = this.name;
    console.log(this.name + " creates an art");

    if(this.art.length > 5){ //bots only hold onto 6 arts at any time
        this.art.shift();
    }

    this.art.push(art);

    //create a critique of this art that we just made
    artSelfEvaluation = this.evaluateArt(art);

    if(artSelfEvaluation.score === 0){
        //the trace doesn't contain any of our opinions.  Flip into 'fuck 'em'
        //mode
        console.log(this.name + " hase gone into 'fuck 'em' mode.");
        this.openness = 0;
    }

    //if we have decided against listening to other bots, allow this critique to change how
    //we make art in the future
    if(this.openness === 0){
        //allow how we feel about art to change how we make art
        this.findInspiration(artSelfEvaluation);
    }

    return art;
};

/**
 * Create a critique for the provided art
 * @param  {Object} art The art we want to evaluate
 * @return {Object}     A critique of the art we were just provided
 */
Bot.prototype.evaluateArt = function(art) {
    // How can I evaluate art?  What my opinions verus the vast gulf of experience?
    //I can look for elements I like in the trace.
    var feelingAboutArt = 0;
    for(var i = 0; i < this.opinions.length; i++){
        var result = this.opinions[i].evaluate(art);
        // result in this case stores how much of thing X art has
        // love is nothing more than an unweighted linear combination of things I like
        feelingAboutArt = feelingAboutArt + result.value;
    }
    console.log(this.name + " evaluated " + art.title + " and felt " + feelingAboutArt);

    //compile opinions in a way that someone else can read
    //FIXME this looks like it isn't actually used.  Our opinions are already readable by others.
    opinionVals = [];
    for(var i = 0; i < this.opinions.length; i++){
        opinionVals.push(this.opinions[i].value);
    }

    //a critique is a score, the set of opinions we applied to this art, and the art (unused)
    return {
        score: feelingAboutArt, //the score of this art (how much of the expected key-->value pairs the trace has)
        tree: this.opinions,  //the set of opinions (key-->value pairs we expect to see in art)
        art: art              //the trace we're talking about (unused)
    };
};

//function to change our generator based on a critique
/**
 * Given a critique, allow it to change how we make new art
 * @param  {Object} critique object that contains
 * @return {[type]}          [description]
 */
Bot.prototype.findInspiration = function(critique){
    var tree = critique.tree; //this is a list of opinions that others think I should have in my art

    //TODO right now, each bot only has one generator
    var randGenIndx = Math.floor(Math.random() * this.generators.length); //I'm going to change one of my generators over this

    //get a random opinion from the set to use to change the generator to make more things that satisfy the opinion
    var opinionToIncorperate = getRandom(tree);

    console.log("I'm gonna try " + opinionToIncorperate.rhs);
    var generatorToUpdate = this.generators[randGenIndx]; //pick a random generator (TODO but we only have one right now, so...)

    var addedIn = false; //if we've ever incorperated the opinion, exit
    for (var lhs in generatorToUpdate.raw){ //for each key in the raw generator...
        if(generatorToUpdate.raw.hasOwnProperty(lhs)){ //(safety check)
            //if this particular key has a ruleset that contains the rule the opinion says the key should expand into
            if(generatorToUpdate.raw[lhs].indexOf(opinionToIncorperate.rhs) > -1){
                // this bot already can generate art that incorperates this concept,
                // so lets push it towards making more art that fits this concept.
                // This is actually a little subtle:
                //        At some particular key (lhs), the ruleset contains an expansion that the opinion says is important
                //        for art to contain (ruleset contains opinionToIncorperate.rhs).
                //        Therefore, even though the key is different than what the opinion expects (opinionToIncorperate.lhs),
                //        the art bot can still create art that looks like what the opinion says it should look like.  Modify this
                //        particular ruleset, rather than adding a new key-->ruleset pair to the grammar
                for(var i = 0; i < generatorToUpdate.raw[lhs].length; i++){
                    //we found a rule that isn't the opinion's rule in this key's ruleset.  Swap it for the opinion's rule
                    if(generatorToUpdate.raw[lhs][i] != opinionToIncorperate.rhs){
                        generatorToUpdate.raw[lhs][i] = opinionToIncorperate.rhs;
                        console.log("I already do that, I'll try doing it more.");
                        addedIn = true;
                        break;
                    }
                }
                //the art bot doesn't have any conflicting ways to make art.
                // Read as: for this key, all of the rules are the rule that our opinion says should be true.
                // we'll just move on and not tweak the grammar
                addedIn = true;
            }
        }

        if(addedIn){
            break;
        }
    }

    //if we haven't added in any rules yet, it means that the grammar does not contain the key --> rule pair
    //the opinion says it should.  Find a key that matches the opinion's key, and add in a new rule.
    if(!addedIn){
        //lets let the generator discover some new way of creating art
        for (var lhs in generatorToUpdate.raw){
            if(generatorToUpdate.raw.hasOwnProperty(lhs)){
                //the key we're considering matches the key of the opinion
                if(lhs == opinionToIncorperate.lhs){
                    //add a new rule for this key that fits the opinion
                    generatorToUpdate.raw[lhs].push(opinionToIncorperate.rhs);
                    console.log("Hm.  I never through about doing that here before.");
                    addedIn = true;
                    break;
                }
            }
        }
    }

    // We're in deep water.  The grammar does not have a key that fits the opinion's key, nor does it
    // have another key that potentially follows the opinion's rule.  Add both the new key, and the new rule
    // and hope that at some future date we can get a critique that has an opinion that allows us to
    // access this
    if(!addedIn){
        //this is an entirely new rule for this bot
        console.log("I've never even considered that I could do something like that.");
        generatorToUpdate.raw[opinionToIncorperate.lhs] = [opinionToIncorperate.rhs];
        addIn = true;
    }

    //and recompile.
    this.generators[randGenIndx].grammar = tracery.createGrammar(generatorToUpdate.raw); //recompile the grammar
    console.log(this.generators[randGenIndx].grammar);

};

// Respond to a critique
/**
 * This bot just got a new critique.  If the bot isn't currently ignoring all critique, allow this critique
 * to change the grammar.
 * @param  {Object} critique the critique that we might let change the bot's grammar
 * @return {None}          Function just modifies state, does not return
 */
Bot.prototype.respondToCritique = function(critique) {
    var score = critique.score;
    if (score === 0){
        //we don't do any part of what the critique talks about.  Engage sellout mode
        //allow the critique (and future critiques) to change how we make art.
        console.log(this.name + " has gone into 'sellout' mode.");
        this.openness = 1;
    }

    if(this.openness > 0){
        this.findInspiration(critique);
    }
};


//TODO BEYOND THIS POINT, LEGACY DISPLAY CODE HERE.  NOT USED IN CURRENT COMMUNE.

Bot.prototype.display = function(holder) {
    var bot = this;
    var div = $("<div/>", {
        class : "artist card",

    }).appendTo(holder);

    this.card = createCard({
        title : this.name
    });
    this.card.div.appendTo(holder);
    var controls = $("<div/>", {
        class : "controls"
    }).appendTo(this.card.contents);
    this.card.artHolder = $("<div/>", {
        class : "art-holder"
    }).appendTo(this.card.contents);

    var newArt = $("<button/>", {
        html : "create art",
    }).appendTo(controls).click(function() {
        bot.createArt();
        bot.displayArt();
    });

    var newArt = $("<button/>", {
        html : "create many art",
    }).appendTo(controls).click(function() {
        for (var i = 0; i < 5; i++) {
            bot.createArt();
            bot.displayArt();
        }
    });

    bot.displayArt();
};

Bot.prototype.displayArt = function() {
    var artHolder = this.card.artHolder;
    artHolder.html("");

    $.each(this.art, function(index, art) {
        var artCard = createCard({
            title : art.title
        });
        artCard.div.addClass("minicard");
        artCard.div.appendTo(artHolder);
        artCard.contents.append(art.code);
        artCard.details.append(art.genre);
        artCard.details.append("<br><span class='period'>From the artist's <b>" + art.generator.period + "</b></span>");

    });
};

module.exports = Bot;
