/**
 * Cards are useful UI elements that wrap an 'art' with lots of other
 * useful things.
 * @author Kate
 */
var $ = require('jquery');

var Card = function(holder, owner, settings){
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
	}).appendTo(this.header);

  if (this.useControls) {
	   // Controls

		this.customControls = $("<div/>", {
			class: "section-control-subsection"
		}).appendTo(this.header);


		this.controls = $("<div/>", {
			class: "section-controls"
		}).appendTo(this.header);
	}

	if (this.useDetails) {
		// Details
		this.details = $("<div/>", {
			class: "section-details"
		}).appendTo(this.div);
	}

	this.contents = $("<div/>", {
		class: "section-contents"
	}).appendTo(this.div);

	if (settings.title)
		this.title.html(settings.title);
};

module.exports = Card;
