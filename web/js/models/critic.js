var criticCount = 0;

var Critic = Class.extend({
	init: function(settings) {


		this.id = criticCount++;
		this.name = "Critic" + this.id;

		this.preference = settings.generator.generate();

		this.critiques = [];
	},

	critiqueArt: function(art) {
		// Apply the function to the art
		var crit = new Critique(this, art, this.preference.apply(art));
		this.critiques.push(crit);
		return crit;
	},

	toString: function() {
		return this.name;
	},

	clearCritiques: function(){
		this.critiques = [];
	}
});
