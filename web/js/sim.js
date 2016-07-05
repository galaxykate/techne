var sim = {
	artists: [],
	art: [],
	critics: [],
	critiques: [],
	preferenceGenerators: [],
	grammarGenerators: [],
}


function clearSim() {
	sim.artists = [];
	sim.art = [];
	sim.critics = [];
	sim.critiques = [];
	sim.preferenceGenerators = [];
	sim.grammarGenerators = [];
}

// Create artist generators (schools)
function createGrammarGenerators(count) {
	for (var i = 0; i < count; i++) {

		sim.grammarGenerators.push(new GrammarGenerator());
	}
}

function createPreferenceGenerators(count) {
	for (var i = 0; i < count; i++) {

		sim.preferenceGenerators.push(new PreferenceGenerator());
	}
}


function createCritics(count) {
	for (var i = 0; i < count; i++) {
		console.log(sim.preferenceGenerators);
		var generator = getRandom(sim.preferenceGenerators);
		sim.critics.push(new Critic({
			generator: generator
		}));
	}
}


function createArtists(count) {
	for (var i = 0; i < count; i++) {

		var generator = getRandom(sim.grammarGenerators);
		sim.artists.push(new Artist({
			grammarGenerator: generator
		}));
	}
}
// Each bot creates N arts
function createArt(count) {
	for (var i = 0; i < sim.artists.length; i++) {
		var art = sim.artists[i].createArt(count);
		sim.art = sim.art.concat(art);
	}
}

function critiqueAll() {
	for (var i = 0; i < sim.critics.length; i++) {
		for (var j = 0; j < sim.art.length; j++) {
			var crit = sim.critics[i].critiqueArt(sim.art[j]);
			sim.critiques.push(crit);
		}
	}

}

function getCritsFor(art) {
	return 	sim.critiques.filter(function(crit) {
		return crit.art === art;
	});
}

/**
 * Get the pixel values for a particular art.
 * TODO: this might not be where this function wants to live forever, but it's
 * where it lives right now
 * @param  {object} art An SVG Art
 * @return {Array}     the pixel data for this art
 */
function svgToPixels(art){
	if(!art.svg){
		console.log("Art doesn't have an SVG representation!");
	}

	
}
