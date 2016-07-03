var artBotCount = 0;

var Artist = Class.extend({
	init: function(settings) {
		if (!settings)
			console.warn("No settings provided");

		if (!settings.grammarGenerator && !settings.grammar)
			console.warn("No grammar generator or grammar provided");

		this.id = artBotCount++;
		this.name = "Artist" + this.id;

		if (settings.grammar) {
			this.grammar = tracery.createGrammar(settings.grammar);
		} else {
			this.grammar = tracery.createGrammar(settings.grammarGenerator.generate());
		}


		this.art = [];

	},

	createArt: function(count) {
		var art = [];
		for (var i = 0; i < count; i++) {
			art.push(new Art(this, {
				generator: this.grammar
			}));
		}

		this.art = this.art.concat(art);
		return art;
	},

	toString: function() {
		return this.name;
	}




});