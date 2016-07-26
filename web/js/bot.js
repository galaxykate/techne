var botCount = 0;


var portraitSize = 70;
var Bot = Class.extend({
	init: function(callback) {
		var bot = this;
		this.id = botCount++;
		this.name = nameGrammar.flatten("#userName#");
		this.dna = [];

		for (var i = 0; i < 33; i++) {
			this.dna[i] = Math.random();
		}

		this.favoriteHue = Math.floor(Math.random() * 360);
		this.grammars = [];

		var grammarCount = 1;
		var returned = 0;
		for (var i = 0; i < grammarCount; i++) {
			this.grammars[i] = new ArtGrammar(this);


			this.grammars[i].createArt(function(art) {
				returned++;
				if (returned >= grammarCount) {
					callback(bot);
				}
			});


		}
	},

	setFavoriteHue: function(save) {
		console.log("Save favorite");
		var bot = this;
		bot.happiness = 0;
		if (!save)
		this.favoriteHue = Math.floor(Math.random() * 360);
		$(".bot-view" + this.id + " .bot-colordot").css({
			backgroundColor: "hsla(" + this.favoriteHue + ",90%,50%,1)"

		});

		$.each(this.grammars, function(index, grammar) {
			$.each(grammar.art, function(index, art) {
				var qual = art.getQualityFor(bot.favoriteHue);
				bot.happiness += qual;
			});
		});
		bot.happiness *= 0.07;
		console.log(bot.happiness);
		$(".bot-view" + this.id + " .bot-happiness").html(bot.happiness.toFixed(2) + evalToEmoji(bot.happiness));
	},

	toSVGPortrait: function() {
		var headR = portraitSize * 0.36;
		var r0 = headR * (0.7 - 0.4 * this.dna[9]);
		var r1 = headR * 1.2;
		var r2 = headR * 1.1;
		var tilt = -0.3 + 0.6 * utilities.noise(20 * this.dna[2] + 20);
		var subR = r0 * 0.9;
		var outerTilt0 = -0.4 + 0.8 * utilities.noise(20 * this.dna[0]);
		var outerTilt1 = -0.4 + 0.8 * utilities.noise(20 * this.dna[1] + 10);
		var theta0 = -Math.PI / 2;

		var theta1 = theta0 + 1.2;
		var theta3 = theta0 - 1.2;
		var p0 = Vector.polar(r0, tilt + theta0);
		var p1 = Vector.polar(r1, tilt + theta1);
		var p2 = Vector.polar(r2, tilt + theta0);
		var p3 = Vector.polar(r1, tilt + theta3);
		var cp0a = Vector.polarOffset(p0, subR, tilt + theta0 - Math.PI / 2);
		var cp0b = Vector.polarOffset(p0, subR, tilt + theta0 + Math.PI / 2);
		var cp1a = Vector.polarOffset(p1, subR, tilt + Math.PI + theta1 + outerTilt0);
		var cp1b = Vector.polarOffset(p1, subR, tilt + theta1 + outerTilt0);
		var cp2a = Vector.polarOffset(p2, subR * 1.5, tilt + theta0 + Math.PI / 2);
		var cp2b = Vector.polarOffset(p2, subR * 1.5, tilt + theta0 - Math.PI / 2);
		var cp3a = Vector.polarOffset(p3, subR, tilt + theta3 + outerTilt1);
		var cp3b = Vector.polarOffset(p3, subR, tilt + Math.PI + theta3 + outerTilt1);


		var b0 = Vector.polar(r2 * 0.8, tilt + theta0);
		var b1 = Vector.polarOffset(p2, r2 * (0.3 + 0.3 * this.dna[5]), tilt + theta0);
		var cb0 = Vector.polarOffset(b1, subR * 0.8, tilt + theta0 - Math.PI / 2);
		var cb1 = Vector.polarOffset(b1, subR * 0.8, tilt + theta0 + Math.PI / 2);

		var h = (this.dna[3] * 360);
		var s = Math.round(60 + 30 * this.dna[7]);
		var l = Math.round(40 + 20 * this.dna[8]);
		var beret = toTag("path", {
			d: "M" + p0.toSVG() + " " + toSVGBezier(cp0b, cp1a, p1) + " " + toSVGBezier(cp1b, cp2a, p2) + " " + toSVGBezier(cp2b, cp3a, p3) + " " + toSVGBezier(cp3b, cp0a, p0),

			fill: "hsla(" + h + "," + s + "%," + l + "%,1)"
		});

		var beretTag = toTag("path", {
			d: "M" + b0.toSVG() + " " + toSVGBezier(cb0, cb1, b0),

			fill: "hsla(" + h + "," + s + "%," + (l + 34 * Math.sin(20 * this.dna[9])) + "%,1)"

		});

		var face = toTag("ellipse", {
			cx: 0,
			cy: 0,
			rx: headR,
			ry: headR,
			fill: "black",
		});

		var head = toTag("g", {
			transform: "translate(" + portraitSize / 2 + "," + portraitSize / 2 + ")",
		}, face + beret + beretTag);

		var bg = toTag("rect", {
			x: 0,
			y: 0,
			width: portraitSize,
			height: portraitSize,
			fill: "white",
		});

		return toTag("svg", {
			width: portraitSize,
			height: portraitSize
		}, head);
	},

	toString: function() {
		return this.name;
	},

	toView: function(holder) {

		var bot = this;
		var grammar = this;
		var hue = (this.id * 39.58) % 360;
		var botView = $("<div/>", {
			class: "card bot-view bot-view" + this.id

		}).appendTo(holder).click(function() {
			selectBot(bot);
		});

		var portraitDiv = $("<div/>", {
			class: "bot-portrait",
			html: this.toSVGPortrait()
		}).appendTo(botView);

		var nameDiv = $("<div/>", {
			class: "bot-name",
			html: this.name
		}).appendTo(botView);

		var favColorHolder = $("<div/>", {
			class: "bot-colorholder",
			html: "favorite color ",
		}).appendTo(botView);

		var favColor = $("<div/>", {
			class: "data bot-colordot",

		}).appendTo(favColorHolder).click(function() {
			bot.setFavoriteHue();
			return false;

		});

			var happinessHolder = $("<div/>", {
			class: "bot-happinessholder",
			html: "happiness: ",
		}).appendTo(botView);

		var happiness = $("<div/>", {
			class: "data bot-happiness",
		}).appendTo(happinessHolder);

		var criticHolder = $("<div/>", {
			class: "bot-criticholder"
		}).appendTo(botView);
		this.setFavoriteHue();
	}

});


var nameGrammar = new TraceryGrammar({
	never: ["always", "never", "ever", "sometimes", "perhaps", "forever", "frequently", "eternally", "once again"],
	animal: ["okapi", "pheasant", "cobra", "amoeba", "capybara", "kangaroo", "chicken", "rooster", "boaconstrictor", "nematode", "sheep", "otter", "quail", "goat", "agouti", "zebra", "giraffe", "yak", "corgi", "pomeranian", "rhinoceros", "skunk", "dolphin", "whale", "duck", "bullfrog", "okapi", "sloth", "monkey", "orangutan", "grizzlybear", "moose", "elk", "dikdik", "ibis", "stork", "robin", "sparrow", "puppy", "kitten", "eagle", "hawk", "iguana", "tortoise", "panther", "lion", "tiger", "gnu", "reindeer", "raccoon", "opossum", "camel", "dromedary", "pigeon", "squirrel", "hamster", "leopard", "panda", "boar", "squid", "parakeet", "crocodile", "flamingo", "terrier", "cat", "wallaby", "wombat", "koala", "orangutan", "bonobo", "lion", "salamander"],
	emotion: ["sorrow", "glee", "pomposity", "vexation", "grandiosity", "melancholia", "ardour", "verve", "passion", "tremulousness", "piety", "dignity", "rage"],
	emotionAdj: "vexed pleased happy delighted angry bemused elated skeptical morose gleeful curious sleepy hopeful ashamed alert energetic exhausted giddy grateful groggy grumpy irate jealous jubilant lethargic mournful joyous blessed thankful lonely relaxed restless surprised tired thankful".split(" "),
	color: "ivory silver ecru scarlet red burgundy ruby crimson carnelian pink rose grey pewter charcoal slate onyx mahogany brown green emerald blue sapphire turquoise aquamarine teal gold yellow carnation orange lavender purple magenta lilac periwinkle amethyst garnet".split(" "),
	adventure: "lament story epic tears wish desire dance mystery enigma drama path training sorrows joy tragedy comedy riddle puzzle regret victory loss song adventure question quest vow oath tale travels".split(" "),
	of: ["concerning", "of", "with", "for"],

	nounMod: ["cyber", "necro", "vorpal", "magna", "electro", "glitter", "robo", "magic", "fairy", "alien", "xeno"],
	noun2: "queen king sunrise boy heaven fever kiss mountain river magic power robot cyborg mama daddy lover angel wizard geek child princess witch".split(" "),
	allNoun: ["#noun2#", "#animal#"],

	digit: "0123456789".split(""),
	number: ["#digit##digit#", "#digit#"],
	adj: ["#color#", "#emotionAdj#"],
	noun: ["#animal#"],
	grammarName: ["#adventure.a.capitalizeAll# #of# #emotion.capitalize#", "The #adj.capitalize# #adventure.capitalize#", "#adventure.capitalize# with #noun.capitalize.s#", "#never.capitalize# #noun.capitalize.a#", "#adventure.capitalize# of the #noun.capitalize#", "#never.capitalize# #adj.capitalize#"],
	userName: ["#nounMod.capitalize##allNoun.capitalize#", "#adj.capitalize##allNoun.capitalize#", "#animal.capitalize##noun2.capitalize#"],
	origin: ["#grammarName# by #userName#"],
});
