/**
 * @author Kate
 * Create a virtual artist
 */

function Generator() {
    this.genre = getRandom(["painting"]);
    this.period = grammar.flatten("#emotionAdj.capitalize# #phase.capitalize#");
    var hexDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    function randomHex() {
        return "\\#" + getRandom(hexDigits) + getRandom(hexDigits) + getRandom(hexDigits) + getRandom(hexDigits) + getRandom(hexDigits) + getRandom(hexDigits);
    };

    var shapes = ['rect width="#num#" height="#num#" x="#num#" y="#num#"', 'circle cx="#num#" cy="#num#" r="#num#"', 'polygon points="#num#,#num# #num#,#num# #num#,#num#"'];

    console.log(randomHex());
    var raw = {
        color : [randomHex(), "\\##digit##digit##digit##digit##digit##digit#"],
        digit : ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        hexdigit : [],
        num : ["#digit##digit#"],
        type : [getRandom(shapes), getRandom(shapes)],
        stroke : ['stroke="#color#" stroke-width="#digit#" stroke-opacity="0.#digit#"', ""],
        fill : ['fill="#color#" fill-opacity="0.#digit#"'],
        shape : ["<#type# #stroke# #fill# />"],
        bg : ["<rect width='300' height='300' x='-100' y='-100' fill='black' />"],
        origin : ['<svg width="100" height="100">#bg##shape##shape##shape##shape##shape##shape##shape#</svg>']

    };
    console.log(raw);
    this.grammar = tracery.createGrammar(raw);
};

Generator.prototype.createArt = function() {
    var tree = this.grammar.expand("#origin#");
    var art = {
        title : grammar.flatten("#workName#"),
        tree : tree,
        code : tree.finishedText,
        genre : this.genre,
        generator : this
    };
    console.log(art.code);
    return art;
};

function Opinion() {
    this.description = "Just a feeling";
};

Opinion.prototype.evaluate = function(art) {
    // relevant?

    if (Math.random() > .5) {
        return {
            value : Math.random(),
            reason : this.description + ": I just kinda feel it"
        };
    }
};

function Bot() {
    // Create a name
    this.name = grammar.flatten("#botName#");
    this.art = [];

    // Create opinions
    this.opinions = [];
    for (var i = 0; i < 30; i++) {
        this.opinions[i] = new Opinion();
    }

    // Create ways of making art
    this.generators = [];
    for (var i = 0; i < 3; i++) {
        this.generators[i] = new Generator();
    }

    for (var i = 0; i < 10; i++) {
        this.createArt();
    }
};

// Create art
Bot.prototype.createArt = function() {
    var art = getRandom(this.generators).createArt();
    console.log(this.name + " creates an art", art);
    this.art.push(art);

    art.selfEvaluation = this.evaluateArt(art);
    console.log(art.selfEvaluation);
    return art;
};

// Evaluate art
// Return a floating point number?
// What is love? What is hate? Is indifference the same as loathing?
// Do we pass through indifference on the road from hate to love?
Bot.prototype.evaluateArt = function(art) {

    // Are my opinions meaningful or relevant?
    // Record them nonetheless.
    var opinions = [];
    for (var i = 0; i < this.opinions.length; i++) {
        var result = this.opinions[i].evaluate(art);
        if (result) {
            opinions.push(result);
        }
    }

    var distance = 1;

    // Reduce love to a number.
    var value = opinions.reduce(function(prev, current) {
        return prev + Math.max(0, current.value);
    }, 0);

    //
    var bitterness = -opinions.reduce(function(prev, current) {
        return prev + Math.abs(Math.min(0, current.value));
    }, 0);
    bitterness *= value;

    // I hate and love this in equal measure
    // It is what I wish to be and wish to make and never will.
    // What do I do with it and with myself?

    var envy = (value - bitterness) / (distance * this.selfSatisfaction);
    return {
        envy : envy,
        value : value,
        bitterness : bitterness,
    };
};

// Respond to art
Bot.prototype.respondToArt = function(art) {
    // What kind of art is this?
    // Can I understand this kind of art?
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
