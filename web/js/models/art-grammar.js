// Create an art grammar that can generate images

var ArtGrammar = Class.extend({

	init: function() {
		this.size = new Vector(artSize);

		// Create a grammar that creates artworks of this dimension

		var baseGrammar = {
			digit: "0123456789".split(""),
			r36: "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35".split(" ").push(" "),

			color: "hsl(#hue#,100%,#digit#0%)",
			art: toTag("svg", {
				viewBox: "0 0 " + w + " " + h,
				width: w,
				height: h
			}, "#gradient#")
		};
	},


	// Create a view for this grammar
	toView: function() {

	}


});