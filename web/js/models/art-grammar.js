var ArtGrammar = Class.extend({

	init: function() {
		this.dimensions = (commonArtWidth * .4 + 150 * Math.random(), commonArtHeight * .4 + 150 * Math.random());

		// Create a grammar that creates artworks of this dimension

		var baseGrammar = {
			digit: "0123456789".split(""),
			color: "hsl(#hue#,100%,#digit#0%)",
		};
	},



});