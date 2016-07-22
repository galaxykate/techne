// Show a tree of nodes

function UINode(node, holder) {
	var uiNode = this;
	this.node = node;
	this.div = $("<div/>", {
		class: "tracery-node tracery-nodetype" + node.type
	}).appendTo(holder);

	if (node.hasMask) {

	}

	this.card = new Card(this.div, this, {
		title: node.toString(),
		classes: "tracery-node-maincard"
	});
	this.card.isOpen = true;

	this.card.onClose = function() {
		console.log("close " + node);
		uiNode.children.hide();
	}


	this.card.onOpen = function() {
		console.log("open " + node);
		uiNode.children.show();
	}

	this.card.div.hover(function() {
		uiNode.card.details.show();
	}, function() {
		uiNode.card.details.hide();
	});

if (node.rules) {
	this.seed = $("<div/>", {
		html: node.seed,
		class: "tracery-node-data"
	}).appendTo(this.card.details).click(function() {
		node.reroll();
		$(this).html(node.seed);
		// uiNode.rebuildChildren();
	});

	this.seedDetails = $("<div/>", {
		html: (node.ruleIndex + 1) + "/" + node.rules.length,
		class: "tracery-node-data"
	}).appendTo(this.card.details);
}

	if (node.rule) {
		this.rule = $("<div/>", {
			html: node.rule,
			class: "node-rule card"
		}).appendTo(this.div);
	}

	if (node.key) {
		this.card.title.html(node.key);
	} else {
		this.card.title.html(node.text);

	}

	this.children = $("<div/>", {
		class: "node-children"
	}).appendTo(this.div);

	this.card.title.hide();
	this.card.details.hide();
	this.card.contents.hide();



	this.expand();
}

UINode.prototype.expand = function() {
	this.children.html("");
	this.children.slideDown(200);

	this.card.title.show();
	for (var i = 0; i < this.node.children.length; i++) {
		new UINode(this.node.children[i], this.children);
	}

}


// Grammar view

function GrammarView(holder) {
	this.div = $("<div/>").appendTo(holder);


}

GrammarView.prototype.setGrammar = function(grammar, maskStack) {
	var grammarView = this;
	this.grammar = grammar;
	this.maskStack = maskStack;

	this.div.html("");
	$.each(grammar.symbols, function(key, val) {

		// Create
		grammarView.createSymbolLine(key, val);
	});
}

GrammarView.prototype.createSymbolLine = function(key, val) {
	var div = $("<div/>", {
		class: "tracery-grammar-symbol",
	}).appendTo(this.div);

	div.key = $("<span/>", {
		html: key,
		class: "tracery-grammar-key",
	}).appendTo(div);


	div.rules = $("<div/>", {
		class: "tracery-grammar-rules",
	}).appendTo(div);


	$.each(val.rules, function(index, rule) {
		var ruleBlock = $("<div/>", {
			html: rule,
			class: "tracery-grammar-rule",
		}).appendTo(div.rules);
	})

}