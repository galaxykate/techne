var View = Class.extend({
	init: function(holder, settings) {
		this.div = $("<div/>", {
			class: "view " + (settings.classes?settings.classes:"")
		}).appendTo(holder);



		this.header = $("<div/>", {
			class: "header",
			html: settings.title?settings.title:""
		}).appendTo(this.div);

		this.content = $("<div/>", {
			class: "content"
		}).appendTo(this.div);
	},


});