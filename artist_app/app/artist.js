/**
 * @author Kate and Johnathan
 * Create a virtual artist
 */
var tracery = require('./tracery.js'); //Powered by the Tracery grammar engine
var grammar = require('./grammar.js'); //Some prefab grammars that are useful for things
// coping the getRandom function from the main app file
var getRandom = function(a){
	return a[Math.floor(Math.random() * a.length)]
}

//a simplified tracery node for communication
function ArtNode(){
	this.children = [];
}

function Generator() {
    this.genre = getRandom(["painting"]);
    this.period = grammar.flatten("#emotionAdj.capitalize# #phase.capitalize#");
    var hexDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    function randomHex() {
        return "\\#" + getRandom(hexDigits) + getRandom(hexDigits) + getRandom(hexDigits) + getRandom(hexDigits) + getRandom(hexDigits) + getRandom(hexDigits);
    };

    this.shapes = ['rect width="#num#" height="#num#" x="#num#" y="#num#"', 'circle cx="#num#" cy="#num#" r="#num#"', 'polygon points="#num#,#num# #num#,#num# #num#,#num#"'];

    var raw = {
        color : [randomHex(), "\\##digit##digit##digit##digit##digit##digit#"],
        digit : ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        hexdigit : [],
        num : ["#digit##digit#"],
        type : [getRandom(this.shapes), getRandom(this.shapes)],
        stroke : ['stroke="#color#" stroke-width="#digit#" stroke-opacity="0.#digit#"', ""],
        fill : ['fill="#color#" fill-opacity="0.#digit#"'],
        shape : ["<#type# #stroke# #fill# />"],
        bg : ["<rect width='300' height='300' x='-100' y='-100' fill='black' />"],
        origin : ['<svg width="100" height="100">#bg##shape##shape##shape##shape##shape##shape##shape#</svg>']

    };
    this.raw = raw;
    this.grammar = tracery.createGrammar(raw);
};

Generator.prototype.createArt = function() {
    var tree = this.grammar.expand("#origin#");
    var art = {
        title : grammar.flatten("#workName#"),
        tree : tree,
        code : tree.finishedText,
        genre : this.genre,
        generator : this,
    };

	// adding in an art category called sendTree
	// a sendTree is a simplified tracery tree, with just the left hand rule
	// as the symbol this node expanded from and the right hand
	art.reducedTree = this.createReducedTree(art.tree, new ArtNode());
    return art;
};

Generator.prototype.createReducedTree = function(traceryTreeNode, reducedTreeNode){
	switch(traceryTreeNode.type){
		case -1:
			//node is a root
			reducedTreeNode.lhs = traceryTreeNode.childRule
			reducedTreeNode.rhs = traceryTreeNode.childRule
			break;
		case 0:
			//node is a leaf
			reducedTreeNode.lhs = traceryTreeNode.raw
			reducedTreeNode.rhs = traceryTreeNode.finishedText
			break;
		case 1:
			//node is in the middle somewhere
			reducedTreeNode.lhs = traceryTreeNode.raw
			reducedTreeNode.rhs = traceryTreeNode.childRule
			break;
	}
	if(traceryTreeNode.children){
		for(var i = 0; i < traceryTreeNode.children.length; i++){
			reducedTreeNode.children.push(this.createReducedTree(traceryTreeNode.children[i], new ArtNode()));
		}
	}
	return reducedTreeNode;
};

function Opinion(basis) {
    //My opinions are things I want to see in art.
    this.description = "I score things based on how much of other things they have that I like.";

    //gets a symbol from the generator to form an opinion on
    //currently hardcoded, but we could use reflection to derive this information
    this.value = getRandom(basis.raw.type);
    this.context = 'type';
};

Opinion.prototype.applyOpinion = function(artNode, feeling) {
    // recursively apply this opinion to the art tree
    var nodeVal = artNode.rhs
	var nodeCtx = artNode.lhs

    if (nodeVal == undefined || nodeCtx == undefined){
        return feeling
    }

	//I see the thing I like!
    if(nodeVal == this.value && nodeCtx == this.context){
        feeling = feeling + 1
    }

    if(artNode.children){
        for(var i = 0; i < artNode.children.length; i++){
            feeling = this.applyOpinion(artNode.children[i], feeling);
        }
    }
    return feeling
};

Opinion.prototype.evaluate = function(art) {
    // this opinion is validated by the number of things I see in the art
    var fitsOpinion = 0
    var composition = art.reducedTree || art.tree
    fitsOpinion = this.applyOpinion(composition, 0)

    return {
        value: fitsOpinion
    }
};

function Bot() {
    // Create a name
    this.name = grammar.flatten("#botName#");
    this.art = [];

    this.motivation = 20; //for right now, we want bots to be very mutable.
    // Create ways of making art
    this.generators = [];
    // Create opinions
    this.opinions = [];
    for (var i = 0; i < 1; i++) {
        this.generators[i] = new Generator();
        //form an opinion based on this generator
        this.opinions[i] = new Opinion(this.generators[i]);
    }

    //lets have some starting art
    for (var i = 0; i < 5; i++) {
        this.createArt();
    }
	console.log(this.art[0]);
};

//Find inspiration in Art
//Bot.prototype.findInspiration = function(art){
    //randomly go through the tree, look for a branch to get inspiried by,
    //return that entire branch
//    branch = getRandomPath(art.tree)
//    return branch
//};

//Let that inspiration change how we feel about the world
//Bot.prototype.updateOpinions = function(inspringBranch){
    // Update Opinions by looking at individual elements.
    // then with some random chance, swap an opinions value out for a new one
//    elementCollection = getElementsAlongPath(inspiringBranch)

//};

// Create art
Bot.prototype.createArt = function() {
    var art = getRandom(this.generators).createArt();
    console.log(this.name + " creates an art");
    this.art.push(art);

    artSelfEvaluation = this.evaluateArt(art);
    return art;
};

// Evaluate art
// Return a floating point number?
// What is love? What is hate? Is indifference the same as loathing?
// Do we pass through indifference on the road from hate to love?
Bot.prototype.evaluateArt = function(art) {
    // How can I evaluate art?  What my opinions verus the vast gulf of experience?
    //I can look for elements I like in the built tree.
    var feelingAboutArt = 0;
    for(var i = 0; i < this.opinions.length; i++){
        var result = this.opinions[i].evaluate(art);
        // result in this case stores how much of thing X art has
        // love is nothing more than an unweighted linear combination of things I like
        feelingAboutArt = feelingAboutArt + result.value
    }
    console.log(this.name + " evaluated " + art.title + " and felt " + feelingAboutArt);
    // do I want this art to change how I feel about art as a whole?
    // does it transend my world view and make me see the world in a new way?
    //var paradigmShift = Math.random() > 0.5
    //if(paradigmShift){
    //    inspiringBranch = this.findInspiration(art);
    //    this.updateOpinions(inspiringBranch);
    //}

    //compile opinions in a way that someone else can read
    opinionVals = []
    for(var i = 0; i < this.opinions.length; i++){
        opinionVals.push(this.opinions[i].value);
    }

    return {
        score: feelingAboutArt,
        tree: this.opinions,
        art: art
    }
};

// Respond to a critique
Bot.prototype.respondToCritique = function(critique) {
    var score = critique.score
	var tree = critique.tree
    //I think critiques should be scores with sets of symbols I like
    //pick a random symbol
    if (score < this.motivation){
        var randGenIndx = Math.floor(Math.random() * this.generators.length);

		//TODO: change this to doing a search through the critique tree
        var opinionToIncorperate = tree;

		console.log("I'm gonna try " + opinionToIncorperate.rhs);
        var generatorToUpdate = this.generators[randGenIndx]; //pick a random generator

        var addedIn = false;
        for (var lhs in generatorToUpdate.raw){
            if(generatorToUpdate.raw.hasOwnProperty(lhs)){
                if(generatorToUpdate.raw[lhs].indexOf(opinionToIncorperate.rhs) > -1){
                    // this bot already can generate art that incorperates this concept,
                    // so lets push it towards making more art that fits this concept.
                    for(var i = 0; i < generatorToUpdate.raw[lhs].length; i++){
                        if(generatorToUpdate.raw[lhs][i] != opinionToIncorperate.rhs){
                            generatorToUpdate.raw[lhs][i] = opinionToIncorperate.rhs;
			    			console.log("I already do that, I'll try doing it more.");
                            addedIn = true;
                            break;
                        }
                    }
                }
            }
            if(addedIn){
                break;
            }
        }

        if(!addedIn){
            // lets let the generator discover some new way of creating art
            for (var lhs in generatorToUpdate.raw){
                if(generatorToUpdate.raw.hasOwnProperty(lhs)){
                    if(lhs == opinionToIncorperate.lhs){
                        generatorToUpdate.raw[lhs].push(opinionToIncorperate.rhs);
                        console.log("Hm.  I never through about doing that here before.");
						addedIn = true;
                        break;
                    }
                }
            }
	    if(!addedIn){
                //this is an entirely new rule for this bot
				console.log("I've never even considered that I could do something like that.");
                generatorToUpdate.raw[opinionToIncorperate.lhs] = [opinionToIncorperate.rhs];
				addIn = true;
       		}
		}

    	//and recompile.
    	this.generators[randGenIndx].grammar = tracery.createGrammar(generatorToUpdate.raw); //recompile the grammar
    }
};

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
