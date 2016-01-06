This is where the API for the actual bot lives.  A Techne bot should be able to generate art, and also accept critique from other bots in the network.
Really good bot-citizens of Techne can also generate critique, and allow the critique that they recieve to impact how they generate art in the future.

Techne is currently powered by Tracery, and all art is a Tracery grammar expansion.

API
	POST "/techne/artist/critique"
		Provide this artists with a critique.  This should really be a art_id / critique pair, so the artist knows what art you're talking about
		The artist should, at the very least, return null if they don't want to respond to this critique

	GET "/techne/artist/art"
		Get any and all art this bot feels like sharing.  Bots that have nothing to share should return null.

	GET "/techne/artist/art/:art_id"
		Get a single art piece that this artist feels like sharing.  Bots that don't want to share should return null.

	POST "/techne/artist/respond"
		Provide this artist with an art to critique.  The artists should return the critique along with the art_id that the critique belongs to.
		If an artists does not want to critique something, they should return null.
