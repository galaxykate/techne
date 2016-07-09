var grammarGeneratorCount = 0;

var GrammarGenerator = Class.extend({
	init: function() {
		this.id = grammarGeneratorCount++;
		this.name = "GrammarGenerator" + this.id;


	},


	// Create a json object that generates 
	generate: function() {
		var w = artSize.x;
		var h = artSize.y;

		var grammar = {
			bg: toClosedTag("rect", {
				x: 0,
				y: 0,
				width: w,
				height: h,
				fill: "#color#"
			}),

			digit: "0123456789".split(""),
			color: "hsl(#hue#,100%,50%)",

			cornerMarkers: [toClosedTag("rect", {
				x: 0,
				y: 0,
				width: 5,
				height: 5,
				fill: "red",
				stroke: "black",
			}) + " " + toClosedTag("rect", {
				x: w - 5,
				y: h - 5,
				width: 5,
				height: 5,
				fill: "red",
				stroke: "black",
			})],



			shapes: ["#shape##shape##shape##shape##shape##shape##shape##shape##shape##shape##shape##shape#"],
			art: toTag("svg", {
				viewBox: "0 0 " + w + " " + h,
				//	preserveAspectRatio: "xMaxYMax",
				width: w,
				height: h
			}, "#gradient#")
		};

		// Create a rainbow
		var s = "";
		for (var i = 0; i < 10; i++) {
			for (var j = 0; j < 16; j++) {
				s += toClosedTag("rect", {
					x: i * 8,
					y: j * 8,
					width: 8,
					height: 8,
					fill: "hsl(" + (35 * i + 190)%360 + ", 100%," + (10 + j * 9) + "%)",

				});
			}
		}
		//console.log(s);
		grammar.gradient = s;

		grammar.hue = [Math.random() * 360];
		grammar.hue.push((grammar.hue[0] + 180) % 360);
		grammar.hue = grammar.hue.map(function(s) {
			return s.toFixed(2);
		})

		grammar.shape = [toClosedTag("rect", {
			x: "#digit##digit#",
			y: "#digit##digit#",
			"fill-opacity": "1",
			width: "#digit##digit#",
			height: "#digit##digit#",
			fill: "#color#"
		})];


		// For each key in this type of grammar, create the appropriate rules

		return grammar;
	}
});