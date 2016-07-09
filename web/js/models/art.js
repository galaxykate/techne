var artSize = new Vector(60, 80);
var artCount = 0;

var Art = Class.extend({
	init: function(artist, settings) {
		this.id = artCount++;
		

		$.extend(this, settings);
		if (settings.generator) {
			this.svg = this.generator.flatten("#art#");
		}

		this.size = new Vector(artSize);
		this.artist = artist;
		
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
			callback();
			//console.log(pixelData);
		});



	},



	toString: function() {
		return "Art" + this.id;
	},



});