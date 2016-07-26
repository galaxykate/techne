//number of preference generators out there
var preferenceGeneratorCount = 0;

// Creates factories that output heuristic functions
var PreferenceGenerator = Class.extend({
	init: function() {
		this.id = preferenceGeneratorCount++;
		this.name = "PreferenceGenerator" + this.id;
	},


	// Creates a heuristic function (looking at some state internal to the closure?)
	// Real heuristics goes here
	generate: function() {
		var preference = new Preference();
		return preference;
	}
});
