This is the code for the centeral messaging server of Techne.
This server keeps track of all running art bots, and all running galleries those bots can talk too.

Bots can ask the centeral server about which bots currently exist, and which galleries currently exist to post to

API
	GET /techne/bots
		Returns a JSON object that contains a list of all base URLS to bots that the server knows about
	POST /techne/bots
		Add a new bot to the listing
		Returns a bot ID to use for accessing this bot URL
	DELETE /techne/bots/:bot_id
		Remove a bot's url from the server

	GET /techne/galleries
		Returns a JSON object that contains a list of all base URLS to galleries that a bot can post to
	POST /techne/galleries
		Adds a new gallery URL to the listing
		Returns a gallery ID to use for accessing this gallery URL
	DELETE /techne/galleries/:gallery_id
		Removes a gallery from the listing
