var artSize = new Vector(90, 120);
var artCount = 0;

var Art = Class.extend({
	init: function(artist, settings, callback) {
		this.id = artCount++;
		var art = this;

		$.extend(this, settings);

		this.svg = this.tree.finishedText;

		this.size = new Vector(artSize);
		this.artist = artist;

		this.calculations = [];

		this.calculations[0] = Math.random();
		this.calculations[1] = Math.random();
		this.calculations[2] = Math.random();
		this.calculations[3] = Math.random();
		this.selfrating = -1;

		this.renderToPixels(callback);


	},



	calculateHueDist: function() {
		this.hueDist = [];

		var bucketCount = 16;
		var total = 0;
		for (var i = 0; i < bucketCount; i++) {
			this.hueDist[i] = 0;
		}

		var spacing = 1000;
		var w = this.size.x;
		var h = this.size.y;
		var xTiles = Math.floor(w / spacing);
		var yTiles = Math.floor(h / spacing);

		var pixelCount = this.pixelData.length / 4;

		for (var i = 0; i < pixelCount / spacing; i++) {
			var start = i * 4 * spacing;
			start *= 1;
			var r = this.pixelData[start];
			var g = this.pixelData[start + 1];
			var b = this.pixelData[start + 2];

			var c = rgb2hsl([r, g, b]);
			//console.log(c);
			//console.log(c + " " + r + ", " + g + ", " + b);
			var bucket = Math.floor((c[0] / 360) * bucketCount);
			var strength = (c[1] / 100) * (1 - .02 * Math.abs(50 - c[2]) * .01);
			//console.log(c.sat + " " + c.value + " " + bucket + " " + strength);
			this.hueDist[bucket] += strength;
			total += 1;
		}

		for (var i = 0; i < bucketCount; i++) {
			this.hueDist[i] /= total;
		}


	
	},

	renderToPixels: function(callback) {
		var art = this;
		this.canvas = $("<canvas/>", {
			class: "art-canvas",
			width: this.size.x + "px",
			height: this.size.y + "px"
		});

		// Fill the canvas with pixels and get the pixel array back
		svgToCanvas(this.svg, this.canvas, function(pixelData, imgURL) {

			art.pixelData = pixelData;
			art.image = imgURL;
			art.calculateHueDist();
	callback(art);
		});


	},



	toString: function() {
		return "Art" + this.id;
	},



});