var artSize = new Vector(90, 120);
var artCount = 0;

var Art = Class.extend({
	init: function(generator, settings, callback) {
		this.id = artCount++;
		var art = this;

		$.extend(this, settings);

		this.generator = generator;
		this.tree = this.generator.generate();

		this.title = "ART" + this.id;
		this.svg = this.tree.text;

		this.size = new Vector(artSize);

		//art can calculate some properites about itself.
		//These properties are stored in the calculations array.
		this.calculations = [];

		this.selfrating = -1;

		this.renderToPixels(callback);
	},



	calculateHueDist: function() {
		this.hueDist = [];

		var bucketCount = 24;
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

			this.hueDist[bucket] += 1 * strength;
			this.hueDist[bucket] *= 0.9;
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

	getQualityFor: function(hue) {
		var qual = 0;
		var total = 0;
		var p = ((hue / 360) * this.hueDist.length);
		for (var i = 0; i < this.hueDist.length; i++) {
			var d = Math.abs(p - i);


			var v = 20 * (this.hueDist[i]) / (d * d + 1);
			total += v;
		}


		return total;
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


	// Create a view for this grammar
	toView: function(holder) {
		var art = this;
		var thumbView = $("<div/>", {
			class: "card art-view art-view" + this.id,
			html: this.name,
		}).appendTo(holder).css({}).click(function() {
			selectArt(art);
		});

		var thumbnail = art.image.clone().appendTo(thumbView);


		var title = $("<div/>", {
			class: "art-view-title",
			html: this.title,
		}).appendTo(thumbView);



		// View test information on this art
		var artDebugInfo = $("<div/>", {
			class: "art-thumbnail art-thumbnail-large",
		}).appendTo(thumbView);

		var pixelBar = $("<div/>", {
			class: "pixelbar",
		}).appendTo(artDebugInfo);


		var distribution = $("<div/>", {
			class: "art-distribution",
		}).appendTo(artDebugInfo);

		var grammar = $("<div/>", {
			class: "art-svg-data",
			text: art.svg
		}).appendTo(artDebugInfo);

		//		var node = new UINode(art.tree, treeView);

		createGraph(distribution, art.hueDist);

		function drawPixelData() {
			//artDebugInfo.append(art.image);



			// Draw pixels
			var spacing = 55;
			var w = art.size.x;
			var h = art.size.y;
			var xTiles = Math.floor(w / spacing);
			var yTiles = Math.floor(h / spacing);

			var pixelCount = art.pixelData.length / 4;


			for (var i = 0; i < pixelCount / spacing; i++) {
				var start = i * 4 * spacing;
				start *= 1;
				var r = art.pixelData[start];
				var g = art.pixelData[start + 1];
				var b = art.pixelData[start + 2];

				$("<div/>", {
					class: "pixelbar-swatch"
				}).appendTo(pixelBar).css({
					backgroundColor: "rgb(" + r + "," + g + "," + b + ")"
				});
			}



		}

		function updateCritiqueUI() {
			// Make dots for each critique
			var critiques = getCritsFor(art);
			$.each(critiques, function(index, crit) {
				var dot = $("<div/>", {
					html: evalToEmoji(crit.evaluation),
					class: "art-critdot",
				}).appendTo(card.critique).css({
					backgroundColor: "hsl(" + (380 + crit.evaluation * 170) % 360 + ",100%," + (crit.evaluation * 50 + 20) + "%)"
				}).click(function() {
					selectCritic(crit.critic);
					selectArt(crit.art);
				});
			});
		}
		// Is the pixel data set yet?
		if (!art.pixelData) {
			console.log("load pixel data");
			art.renderToPixels(function() {
				updateCritiqueUI();
				drawPixelData();
			});
		} else {
			console.log("pixel data already loaded");
			drawPixelData();
			updateCritiqueUI();
		}
	}
});
