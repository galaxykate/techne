// Show a tree of nodes

function UINode(node, holder) {
	console.log("new node for " + node);
	var uiNode = this;
	this.node = node;
	this.div = $("<div/>", {
		class: "tracery-node tracery-nodetype" + node.type
	}).appendTo(holder);

	if (node.hasMask) {

	}
	this.card = new Card(this.div, this, {
		title: "node",
		classes: "tracery-node-maincard"
	});

	if (node.symbol) {
		this.card.title.text(node.symbol);
	} else {
		this.card.title.text(node.finishedText);

	}

	this.card.contents.hide();
	

	if (node.childRule) {
		this.rule = $("<div/>", {
			text: node.childRule,
			class: "node-rule card"
		}).appendTo(this.div);
	}


	this.children = $("<div/>", {
		class: "node-children"
	}).appendTo(this.div).click(function() {
		uiNode.toggleExpand();
		return false;
	});


	this.isExpanded = true;
	this.toggleExpand();
}

UINode.prototype.toggleExpand = function(recursive) {
	this.isExpanded = !this.isExpanded;
	this.children.html("");
	this.childrenNodes = [];

	if (this.node.children) {
		if (this.isExpanded || this.node.children.length === 1) {
			for (var i = 0; i < this.node.children.length; i++) {
				this.childrenNodes.push(new UINode(this.node.children[i], this.children));
			}

			this.children.removeClass("closed");
		} else {
			this.children.html(this.node.children.length + " subnodes");
			this.children.addClass("closed");

		}


		if (recursive) {
			for (var i = 0; i < this.childrenNodes.length; i++) {
				this.childrenNodes[i].toggleExpand(true);
			}
		}
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