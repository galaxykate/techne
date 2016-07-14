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

		//art can calculate some properites about itself.
		//These properties are stored in the calculations array.
		this.calculations = [];

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
			var strength = (c[1] / 100) * (1 - 0.02 * Math.abs(50 - c[2]) * 0.01);
			//console.log(c.sat + " " + c.value + " " + bucket + " " + strength);
			this.hueDist[bucket] += strength;
			total += 1;
		}

		for (var i = 0; i < bucketCount; i++) {
			this.hueDist[i] /= total;
		}
	},

	calculateContrastScore: function(){
		this.contrastScore = getContrastRatio(this.pixelData);
		this.calculations.push(this.contrastScore);
	},

	calculateEdgeScore: function(){
		var w = this.size.x;
		var h = this.size.y;
		var scores = [];
		//doing large tiles for contrast bins
		//apply to every pixel!
		var tileSize = 3;
		for(var y = 0; y < h - tileSize; y++) {
			for(var x = 0; x < w - tileSize; x++) {
				var pixelWindow = [];

				for(var v=0; v < tileSize; v++){
					for(var u=0; u < tileSize; u++){
						pixelWindow = pixelWindow.concat(getPixel(this.pixelData, w, h, x + u, y + v));
					}
				}
				//scores near zero mean that this is probably not a pixel.
				//high scores mean that this is probably a pixel
				scores.push(Math.abs(applyKernel(pixelWindow, edgeDetectionKernel)));
			}
		}

		//display the score as the ratio of edge results to total number of results
		var numEdges = scores.reduce(function(iter, val){
			if(val > 0){
				return iter + 1;
			}else{
				return iter + 0;
			}
		});
		var finalScore = numEdges / scores.length;
		this.calculations.push(finalScore);
		this.edgeScore = finalScore;
	},

	/**
	 * !!!DEPRECIATED!!!
	 * Unused.  Function was to get a distribution of contrast scores in the
	 * image from running looking at parts of the window.
	 * @return {None} Set the art's property, doesn't return in traditional sense
	 */
	calculateContrastDist: function(){
		this.contrastDist = [];

		var bucketCount = 16;
		var total = 0;
		for (var i = 0; i < bucketCount; i++) {
			this.contrastDist[i] = 0;
		}

		var w = this.size.x;
		var h = this.size.y;

		//doing large tiles for contrast bins
		var tileSize = 3;
		for(var y = 0; y < h - tileSize; y += tileSize) {
			for(var x = 0; x < w - tileSize; x += tileSize) {
				var pixelWindow = [];

				for(var v=0; v < tileSize; v++){
					for(var u=0; u < tileSize; u++){
						pixelWindow = pixelWindow.concat(getPixel(this.pixelData, w, h, x + u, y + v));
					}
				}

				var contrastRatio = getContrastRatio(pixelWindow);
				var bucket = Math.floor((contrastRatio / 21) * bucketCount);
				this.contrastDist[bucket] += (Math.pow(contrastRatio, Math.E));
				total += 1;
			}
		}

		//console.log("Total Calcs: ", total);
		for(var i = 0; i < bucketCount; i++){
			this.contrastDist[i] /= total;
		}

		console.log("Distribution Buckets: " + this.contrastDist.length);
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
			art.calculateContrastScore();
			art.calculateEdgeScore();
			//art.calculateContrastDist();
			callback(art);
		});
	},



	toString: function() {
		return "Art" + this.id;
	},



});
