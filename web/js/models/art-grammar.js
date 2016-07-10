// Create an art grammar that can generate images

var shapes = [toClosedTag("rect", {
	x: "#digit##digit#",
	y: "#digit##digit#",
	width: "#digit##digit#",
	height: "#digit##digit#"
}, "#style#")];

var ArtGrammar = Class.extend({

	init: function() {
		this.size = new Vector(artSize);

		var w = this.size.x;
		var h = this.size.y;
		// Create a grammar that creates artworks of this dimension

		var raw = {
			digit: "0123456789".split(""),
			r36: "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35".split(" ").push(" "),

			style: "fill='#color#' fill-opacity=0.#digit#",

			color: "hsl(#hue#,100%,#digit#0%)",

			bg: toClosedTag("rect", {
				x: 0,
				y: 0,
				width: w,
				height: h,
				fill: "#color#"
			}),

			shapes: ["#shape##shape##shape##shape##shape##shape##shape##shape##shape##shape##shape##shape##shape##shape##shape##shape##shape##shape#"],
			art: toTag("svg", {
				viewBox: "0 0 " + w + " " + h,
				width: w,
				height: h
			}, "#bg##shapes#")
		};

		// Add colors
		raw.hue = [];
		for (var i = 0; i < 5; i++) {
			raw.hue.push(Math.floor(Math.random() * 360) + "");
		}

		raw.shape = shapes;
		console.log(raw);
		this.grammar = tracery.createGrammar(raw);
	},
	generate: function() {
		var tree = this.grammar.expand("#art#");
		//console.log(tree.finishedText);
		return tree;

	},

	// Create a view for this grammar
	toView: function(holder) {

	}


});