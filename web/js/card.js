var Card = Class.extend({
	init: function(holder, owner, settings) {
		var card = this;
		this.holder = holder;
		this.owner = owner;

		$.extend(this, settings);

		// Create the card
		this.div = $("<div/>", {
			class: "card section"
		}).appendTo(holder);

		if (settings.classes)
			this.div.addClass(settings.classes);

		this.header = $("<div/>", {
			class: "section-header"
		}).appendTo(this.div);

		this.title = $("<div/>", {
			class: "section-title"
		}).appendTo(this.header).click(function() {
			card.toggleOpen();
		});


		// Controls

		this.customControls = $("<div/>", {
			class: "section-control-subsection"
		}).appendTo(this.header);


		this.controls = $("<div/>", {
			class: "section-controls"
		}).appendTo(this.header);

		// Details
		this.details = $("<div/>", {
			class: "section-details"
		}).appendTo(this.div);

		this.contents = $("<div/>", {
			class: "section-contents"
		}).appendTo(this.div);


		if (settings.title)
			this.title.html(settings.title);

		this.isOpen = true;
		this.toggleOpen();
	},

	toggleOpen: function() {
		this.isOpen = !this.isOpen;
		if (this.isOpen) {
			if (this.hideTitle)
				this.title.show();
			if (this.hideControls)
				this.controls.show();
			if (this.hideDetails)
				this.details.show();
			if (this.hideContent)
				this.content.show();
		} else {
			if (this.hideTitle)
				this.title.hide();
			if (this.hideControls)
				this.controls.hide();
			if (this.hideDetails)
				this.details.hide();
			if (this.hideContent)
				this.content.hide();

		}

	}


});