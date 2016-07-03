var artCount = 0;

var Art = Class.extend({
	init: function(artist, settings) {
		this.id = artCount++;
		if (settings.svg)
			this.svg = svg;

		if (settings.generator) {
			this.svg = settings.generator.flatten("#art#");
		}

		this.artist = artist;
	},

	toString: function() {
		return "Art" + this.id;	}

});