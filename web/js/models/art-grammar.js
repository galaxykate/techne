// Create an art grammar that can generate images

var grammarCount = 0;


function createDefaultGrammar(size) {
	var w = size.x;
	var h = size.y;


	// Default components of all grammars
	var g = {
		digit: "0123456789".split(""),
		lowDigit: "12345".split(""),
		midDigit: "3456".split(""),
		highDigit: "6789".split(""),
		r36: "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35".split(" ").push(" "),

		pathPoints: ["M0 0 #pathPoint# #pathPoint# #pathPoint# #pathPoint# #pathPoint# #pathPoint# #pathPoint#  Z"],
		createGroup: "<g id=#myID#>#myShape#</g>",
		midNum: ["#digit#", "1#digit#", "1#digit#", "2#digit#", "4#digit#", "-#digit#", "-1#digit#", "-1#digit#", "-2#digit#", "-4#digit#"],

		rect: toClosedTag("rect", {
			x: "#midNum#",
			y: "#midNum#",
			width: "#digit##digit#",
			height: "#digit##digit#"
		}, "#style#"),

		triangle: ["<path #style# d='M#midNum# #midNum# L#midNum# #midNum# L#midNum# #midNum# Z'/>"],
		longPath: ["<path #style# d='M0 0 #pathPoint# #pathPoint# #pathPoint# #pathPoint# #pathPoint# #pathPoint# #pathPoint#  Z'/>"],
		shortPath: ["<path #style# d='M#midNum# #midNum# #pathPoint# #pathPoint#'/>"],

		smoothCubic: "s#midNum#,#midNum# #midNum#,#midNum# ",
		quadPt: "q#midNum#,#midNum# #midNum#,#midNum#",
		cubicPt: "c#midNum#,#midNum# #midNum#,#midNum# #midNum#,#midNum#",
		linearPt: "l#midNum# #midNum#",
		circle: toClosedTag("circle", {
			cx: "#midNum#",
			cy: "#midNum#",
			r: "#digit##digit#",
		}, "#style#"),

		bg: toClosedTag("rect", {
			x: 0,
			y: 0,
			width: w,
			height: h,
			fill: "#bgColor#"
		}),

		bgColor: "hsl(#hue#,100%,#lowDigit#0%)",

		shapes: ["#shape##shape##shape##shape##shape##shape##shape##shape##shape#"],
		image: "#bg#<g transform='translate(" + w / 2 + "," + h / 2 + ")'>#shapes#</g>",
		art: toTag("svg", {
			viewBox: "0 0 " + w + " " + h,
			width: w,
			height: h
		}, "#image# "),
		"xlinks": " xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"",
		"origin": ["{svg <?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><svg #xlinks#  version=\"1.1\" width=\"315\" height=\"315\" viewBox=\"0 0 90 120\" style=\"enable-background:new 0 0 255 255;\" id=\"svg2\" xml:space=\"preserve\">#image#</svg>}"]
	};
	return g;
}

var defaultGrammar = createDefaultGrammar(artSize);

var pathPointTypes = ["smoothCubic", "linearPt"];

var shapes = "longPath shortPath circle rect triangle".split(" ");
//var shapes = "longPath shortPath".split(" ");

var ArtGrammar = Class.extend({

	init: function(bot) {
		this.bot = bot;
		this.art = [];
		var artGrammar = this;
		this.id = grammarCount++;
		this.size = new Vector(artSize);
		this.artCount = artPerGenerator;
		var w = this.size.x;
		var h = this.size.y;
		// Create a grammar that creates artworks of this dimension

		this.customSymbols = {

		};
		var myShapes = [];
		for (var i = 0; i < 2; i++) {
			myShapes.push("#" + getRandom(shapes) + "#");
		}
		var myPts = [];
		for (var i = 0; i < 1; i++) {
			myPts.push("#" + getRandom(pathPointTypes) + "#");
		}
		var myStyles = [];
		for (var i = 0; i < 2; i++) {
			var opacity = getRandom(["fill-opacity='0.#highDigit#' ", "fill-opacity='0.#midDigit#' ", "fill-opacity='0.#lowDigit#' "]);
			var color = getRandom(["fill='hsl(#hue#,100%,#highDigit#0%)' ", "fill='hsl(#hue#,100%,#midDigit#0%)' ", "fill='hsl(#hue#,100%,#lowDigit#0%)' "]);
			var strokeWeight = getRandom(["stroke-width='#lowDigit#' ", "stroke-width='#lowDigit#' ", "stroke-width='#highDigit#' "]);
			var strokeColor = getRandom(["stroke='hsl(#hue#,100%,#highDigit#0%)' "]);
			var strokeOpacity = getRandom(["stroke-opacity='0.#midDigit#'  ", "stroke-opacity='0.#highDigit#'  "]);
			if (Math.random() > .5) {
				myStyles.push(color + opacity);

			} else
				myStyles.push(color + opacity + strokeWeight + strokeColor + strokeOpacity);

		}
			this.addCustomSymbol("hue", [Math.floor(Math.random() * 360) + "", Math.floor(Math.random() * 360) + ""]);
		this.addCustomSymbol("pathPoint", myPts);
	this.addCustomSymbol("shape", myShapes);
		this.addCustomSymbol("style", myStyles);
		pathPoint:
			this.updateGrammar();

	},

	addCustomSymbol: function(key, rules) {
		var grammar = this;
		if (!Array.isArray(rules)) {
			rules = [rules];
		}
		this.customSymbols[key] = {
			key: key,
			rules: rules.map(function(rule) {
				return {
					text: rule,
					origin: grammar,
					isDeleted: false,
				}
			})
		};
	},



	updateGrammar: function() {
		this.grammar = this.toTraceryGrammar();
	},
	// Create the grammar that can actually manufacture art
	toTraceryGrammar: function() {
		var raw = jQuery.extend({}, defaultGrammar);

		$.each(this.customSymbols, function(key, symbol) {
			var validRules = [];
			for (var i = 0; i < symbol.rules.length; i++) {
				if (!symbol.rules[i].isDeleted)
					validRules.push(symbol.rules[i].text);
			}
			raw[key] = validRules;


		});
		return new TraceryGrammar(raw);
	},

	prune: function() {
		var counts = {};
		$.each(this.customSymbols, function(key, val) {
			// Count up undeleted rules
			counts[key] = val.rules.filter(function(rule) {
				return !rule.isDeleted;
			}).length;

			if (counts[key] > 1) {
				var toRemove = getRandom(val.rules);
				toRemove.isDeleted = true;

			}
		});
		this.updateGrammar();
	},


	learnFrom: function(g2) {
		var counts = {};
		$.each(this.customSymbols, function(key, s1) {
			var rules1 = s1.rules;
			var rules2 = g2.customSymbols[key].rules;
			// Count up undeleted rules

			var alternateRules = rules2.filter(function(rule) {
				return !rule.isDeleted && !ruleIsInArray(rules1, rule);
			});



			var toAdd = getRandom(rules2);
			rules1.push(toAdd);

		});
		this.updateGrammar();
	},


	createArt(callback) {
		var count = this.artCount;
		var grammar = this;
		var finished = false;

		for (var i = 0; i < count; i++) {
			var allArt = [];
			new Art(this, {}, function(art) {
				grammar.art.push(art);
				allArt.push(art);
				count--;
				if (count === 0) {
					finished = true;
				}
				if (finished) {
						grammar.bot.setFavoriteHue(true);
					callback(allArt);
				}
			});


		}
		
	
	},

	generate: function() {

		var tree = this.grammar.expand("#art#");


		return tree;

	},

	refreshView: function() {
		var holders = $(".grammar-view-symbols" + this.id);
		holders.html("");
		$.each(this.customSymbols, function(key, symbol) {

			var div = $("<div/>", {
				class: "card grammar-view-symbol"
			}).appendTo(holders);

			var keyDiv = $("<div/>", {
				class: "grammar-view-key",
				html: key,
			}).appendTo(div);
			var rulesHolder = $("<span/>", {
				class: "grammar-view-rules",

			}).appendTo(div);
			$.each(symbol.rules, function(index, rule) {
				var ruleDiv = $("<div/>", {
					class: "grammar-view-rule",
					html: escapeHtml(rule.text)
				}).appendTo(rulesHolder).css({
					backgroundColor: grammarIDtoOutlineColor(rule.origin.id)
				})

				if (rule.isDeleted) {
					ruleDiv.addClass("deleted").append("<div class='strikethrough'></div>");
				}

			});

		});
	},

	refreshArtView: function() {

		var artView = $(".grammar-artview" + this.id);

		$.each(this.art, function(index, art) {
			art.toView(artView);
		});
	},

	toArtView: function(holder) {
		var grammar = this;
		holder.html("");
		var artView = $("<div/>", {
			class: "grammar-artview grammar-artview" + this.id

		}).appendTo(holder).css({
			//backgroundColor: grammarIDtoOutlineColor(this.id)
		}).click(function() {
			selectGrammar(grammar);
		});

		this.refreshArtView();
	},

	// Create a view for this grammar
	toView: function(holder) {
		var grammar = this;
		var hue = (this.id * 39.58) % 360;
		var grammarView = $("<div/>", {
			class: "grammar-view grammar-view" + this.id

		}).appendTo(holder).css({
			backgroundColor: grammarIDtoOutlineColor(this.id)
		}).click(function() {
			selectGrammar(grammar);
		});

		var showGrammar = $("<button/>", {
			html: "show grammar"
		}).click(function() {

			grammarView.append("<textarea>" + JSON.stringify(grammar.grammar.raw, null, 2) + "</textarea>");

		}).appendTo(grammarView);

		var pruneButton = $("<button/>", {
			html: "prune"
		}).click(function() {
			grammar.prune();
			grammar.art = [];
			grammar.createArt(function() {
				grammar.refreshArtView();
				grammar.refreshView();
			});


		}).appendTo(grammarView);


		var breedWith = $("<button/>", {
			html: "learn from random teacher"
		}).click(function() {
			var g2 = new ArtGrammar();
			grammar.learnFrom(g2);

			grammar.art = [];
			grammar.createArt(function() {
				grammar.refreshArtView();
				grammar.refreshView();
			});
		}).appendTo(grammarView);

		var symbolHolder = $("<div/>", {
			class: "grammar-view-symbols" + this.id
		}).appendTo(grammarView);
		this.refreshView();

		return grammarView;
	},
	toString: function() {
		return "ArtGrammar" + this.id;
	}

});

function ruleIsInArray(rules, rule) {
	var found = rules.filter(function(r2) {
		return r2.text === rule.text;
	})
}

function grammarIDtoOutlineColor(id) {
	return "hsla(" + (id * 44.9) % 360 + ",90%, 70%, 1)"
}