var artBotCount = 0;

var Artist = Class.extend({
	init: function(settings) {
		if (!settings)
			console.warn("No settings provided");


		this.id = artBotCount++;
		this.name = "Artist" + this.id;

		this.artGrammars = [];
		this.artGrammars.push(new ArtGrammar());

		this.favoriteHue = Math.random();

		this.art = [];

	},


	rerollGrammar: function(callback) {
		this.artGrammars = [];
		this.artGrammars.push(new ArtGrammar());

		$.each(this.art, function(art) {
			art.isDeleted = true;
		});
		this.art = [];
	},

	createArt: function(callback) {
		var artist = this;
		var grammar = getRandom(this.artGrammars);

		// Create the art and callback when loaded
		var newArt = new Art(this, {
			generator: grammar,
			tree: grammar.generate()
		}, function() {
			artist.art.push(newArt);
			callback(newArt);
		});
	},

	evaluateArt: function(art) {
		var bucketCount = art.hueDist.length;
		var favBucket = Math.floor((this.favoriteHue) * bucketCount);
		rating = art.hueDist[favBucket] * bucketCount;
		return rating;

	},

	toString: function() {
		return this.name;
	}



});