var critiqueCount = 0;

var Critique = Class.extend({
	init: function(critic, art, evaluation) {
		this.id = critiqueCount++;
		
		this.critic = critic;
		this.art = art;
		this.evaluation = evaluation;
		console.log(this.toString());
		
	},

	toString: function() {
		return "Critique" + this.id + "(" + this.critic + " " + this.art + " -> " + this.evaluation.toFixed(2) + ")";
	}

});