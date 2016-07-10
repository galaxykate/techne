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


	createArt: function(count) {
		var grammar = getRandom(this.artGrammars);
		var art = [];

		for (var i = 0; i < count; i++) {

			art.push(new Art(this, {
				generator: grammar,
				tree: grammar.generate()
			}));
		}

		this.art = this.art.concat(art);
		return art;
	},

	evaluateArt: function() {
		$.each(this.art, function() {

		});
	},

	toString: function() {
		return this.name;
	}



});