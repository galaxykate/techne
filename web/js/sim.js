var sim = {
	artists: [],
	art: [],
	critics: [],
	critiques: [],
	preferenceGenerators: [],

};


function clearSim() {
	sim.artists = [];
	sim.art = [];
	sim.critics = [];
	sim.critiques = [];
	sim.preferenceGenerators = [];

}

// Create artist generators (schools)

function createPreferenceGenerators(count) {
	for (var i = 0; i < count; i++) {
		//pulled out the random preference generator, put in the color preference generator
		sim.preferenceGenerators.push(new ContrastPreferenceGenerator());
		sim.preferenceGenerators.push(new ColorPreferenceGenerator());
	}
}


function createCritics(count) {
	for (var i = 0; i < count; i++) {
		var generator = getRandom(sim.preferenceGenerators);
		//set a color parameter here to make a critic that looks for a particular color
		sim.critics.push(new Critic({
			generator: generator
		}));
	}
}


function createArtists(count) {
	for (var i = 0; i < count; i++) {

		var preferenceGenerator = getRandom(sim.preferenceGenerators);
		sim.artists.push(new Artist({
			preferenceGenerator: preferenceGenerator
		}));
	}
}

// Each bot creates N arts, and calls back when finished
function createArt(count, callback) {
	var finished = 0;

	var artistCount = sim.artists.length;
	var createdArt = [];

	function checkFinish(art) {
		createdArt.push(art);
		finished++;
		//console.log("finished art" + finished + "/" + artistCount * count);
		if (finished === artistCount * count) {
		//	console.log("Finished creating art ", createdArt);
			sim.art = sim.art.concat(createdArt);
		callback(createdArt);
			}
	}

	for (var i = 0; i < artistCount; i++) {
		for (var j = 0; j < count; j++) {
			sim.artists[i].createArt(checkFinish);

		}
	}
}



/**
 * Funtion to wrap the critic process and add the critique to the sim so we can see it
 * This is gross and weird because of how svgToPixels works-- that function is recusrive,
 * and I need to fit it into an interative wrapper.
 * provided critic critiques art and adds the critique to the provided sim's list
 * of critiques
 * @param  {Object} art    art to critique.  Art has a pixels member that has pixel data
 * @param  {Object} critic critic to provide a critique to art.
 * @param  {Object} sim    a sim context to add the critique too, used for seeing various critiques that have happened
 * @return {None}        		function just manipulated provided parameters, does not return anything
 */
function critAndSave(art, critic, sim) {
	var crit = critic.critiqueArt(art);
	sim.critiques.push(crit);
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
	return sim.critiques.filter(function(crit) {
		return crit.art === art;
	});
}
