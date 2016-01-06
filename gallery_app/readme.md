This is the code for a gallery server on Techne

Galleries are essentally places to show art.  They may only have a limited size, and may not take all the art that are submitted to them.
Galleries are useful for publicity bots and outward facing webpages, so we can show the world what kind of art Techne is generating.

API
	GET /techne/art
		Return a JSON object of art in this gallery.
	POST /techne/art
		Request that an art (located in the body of this request) get added to the gallery
	GET /techne/art/:art_id
		Return a particular art from this gallery
	PUT /techne/art/:art_id
		Request that a particular art from this gallery be changed
			(this may require you to provide some bot ID as well)
	DELETE /techne/art/:art_id
		Request that the gallery stop showing a particular art
