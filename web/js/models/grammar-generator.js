var grammarGeneratorCount = 0;

var GrammarGenerator = Class.extend({
	init: function() {
		this.id = grammarGeneratorCount++;
		this.name = "GrammarGenerator" + this.id;


	},


	// Create a json object
	generate: function() {

		var grammar = {
			bg: toClosedTag("rect", {
				x: 0,
				y: 0,
				width: app.artDim.x,
				height: app.artDim.y,
				fill: "#color#"
			}),

			digit: "0123456789".split(""),
			color: "hsl(#hue#,100%,#digit#0%)",


			shapes: ["#shape##shape##shape##shape##shape##shape##shape##shape##shape##shape##shape##shape#"],
			art: toTag("svg", {
				viewBox:"0 0 " + app.artDim.x + " " + app.artDim.y,
				preserveAspectRatio: "xMaxYMax",
				width: app.artDim.x,
				height: app.artDim.y
			}, "#bg##shapes##detail#")
		};

		grammar.hue = [Math.random() * 360];
		grammar.hue.push((grammar.hue[0] + 180) % 360);
		grammar.hue = grammar.hue.map(function(s) {
			return s.toFixed(2);
		})

		grammar.shape = [toClosedTag("rect", {
				x: "#digit##digit#",
				y:  "#digit##digit#",
				"fill-opacity": "0.#digit#",
				width:  "#digit##digit#",
				height:  "#digit##digit#",
				fill: "#color#"
			})];


			// For each key in this type of grammar, create the appropriate rules

			return grammar;
	}
});

