var artBotCount = 0;

var Artist = Class.extend({
	init: function(settings) {
		if (!settings)
			console.warn("No settings provided");


		this.id = artBotCount++;
		this.name = "Artist" + this.id;

		this.artGrammars = [];
		this.artGrammars.push(new ArtGrammar());

		//artists have 1 or more preferences.  default is a hue preference
		if(settings.preferences){
			this.preferences = settings.preferences;
		}else{
			this.preferences = [new ColorPreference()];
		}

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
		var scoreSum = 0;
		this.preferences.forEach(function(preference){
			scoreSum = preference.apply(art);
		});
		return scoreSum / this.preferences.length;
	},

	toString: function() {
		return this.name;
	}



});
