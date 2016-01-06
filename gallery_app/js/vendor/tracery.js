/**
 * @author Kate
 */

var tracery = function() {
    function isVowel(c) {
        var c2 = c.toLowerCase();
        return (c2 === 'a') || (c2 === 'e') || (c2 === 'i') || (c2 === 'o') || (c2 === 'u');
    };

    function isAlphaNum(c) {
        return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9');
    };

    var baseModifiers = {

        varyTune : function(s) {
            var s2 = "";
            var d = Math.ceil(Math.random() * 5);
            for (var i = 0; i < s.length; i++) {
                var c = s.charCodeAt(i) - 97;
                if (c >= 0 && c < 26) {
                    var v2 = (c + d) % 13 + 97;
                    s2 += String.fromCharCode(v2);
                } else {
                    s2 += String.fromCharCode(c + 97);
                }

            }
            return s2;
        },

        capitalizeAll : function(s) {
            var s2 = "";
            var capNext = true;
            for (var i = 0; i < s.length; i++) {

                if (!isAlphaNum(s.charAt(i))) {
                    capNext = true;
                    s2 += s.charAt(i);
                } else {
                    if (!capNext) {
                        s2 += s.charAt(i);
                    } else {
                        s2 += s.charAt(i).toUpperCase();
                        capNext = false;
                    }

                }
            }
            return s2;
        },

        capitalize : function(s) {
            return s.charAt(0).toUpperCase() + s.substring(1);
        },

        a : function(s) {
            if (s.length > 0) {
                if (s.charAt(0).toLowerCase() === 'u') {
                    if (s.length > 2) {
                        if (s.charAt(2).toLowerCase() === 'i')
                            return "a " + s;
                    }
                }

                if (isVowel(s.charAt(0))) {
                    return "an " + s;
                }
            }

            return "a " + s;

        },

        s : function(s) {
            switch (s.charAt(s.length -1)) {
            case 's':
                return s + "es";
                break;
            case 'h':
                return s + "es";
                break;
            case 'x':
                return s + "es";
                break;
            case 'y':
                if (!isVowel(s.charAt(s.length - 2)))
                    return s.substring(0, s.length - 1) + "ies";
                else
                    return s + "s";
                break;
            default:
                return s + "s";
            }
        }
    };

    function getRandom(a) {
        return a[Math.floor(Math.random() * a.length)];
    }

    var Node = function(grammar, settings) {
        if (settings.raw === undefined) {
            throw ("No raw input for node");
        }
        this.grammar = grammar;
        this.raw = settings.raw;
        this.type = settings.type;
        this.grammar = grammar;

    };

    Node.prototype.expandChildren = function(childRule) {
        this.childRule = childRule;
        var sections = tracery.parse(childRule);
        this.children = [];
        this.finishedText = "";
        for (var i = 0; i < sections.length; i++) {

            this.children[i] = new Node(this.grammar, sections[i]);
            this.children[i].expand();

            this.finishedText += this.children[i].finishedText;
        }
    };

    Node.prototype.expand = function() {
        switch(this.type) {
        // Raw rule
        case -1:

            this.expandChildren(this.raw);
            break;

        // plaintext, do nothing but copy text into finsihed text
        case 0:
            this.finishedText = this.raw;
            break;

        // Tag
        case 1:
            // Parse to find any actions, and figure out what the symbol is
            this.preactions = [];
            var parsed = tracery.parseTag(this.raw);

            this.symbol = parsed.symbol;
            this.preactions = parsed.preactions;
            this.modifiers = parsed.modifiers;

            // Break into symbol and modifiers

            // Perform pre-actions
            for (var i = 0; i < this.preactions.length; i++) {
                var response = this.activateAction(this.preactions[i].raw);

            }

            this.finishedText = this.raw;

            // Expand
            this.expandChildren(this.grammar.selectRule(this.symbol));

            // Apply modifiers
            for (var i = 0; i < this.modifiers.length; i++) {
                var mod = this.grammar.modifiers[this.modifiers[i]];
                if (!mod)
                    this.finishedText += "((." + this.modifiers[i] + "))";
                else
                    this.finishedText = mod(this.finishedText);
            }
            // Perform post-actions
            break;
        case 2:
            this.activateAction(this.raw);
            this.finishedText = "";
            break;

        }

    };

    Node.prototype.activateAction = function(raw) {
        var s = raw.split(":");
        var target = s[0];
        var rule = s[1];
        if (rule === "POP") {
            this.grammar.popRules(target);
        } else {
            // Is it a rule, or an array of rules?
            var pushChild = new Node(this.grammar, {
                type : -1,
                raw : rule
            });
            pushChild.expand();

            this.grammar.pushRules(target, pushChild.finishedText);
        }
        return {
            target : target,
            rule : rule,
            pushChild : pushChild
        };
    };

    var RuleSet = function(raw) {

    };

    var Symbol = function(grammar, key, raw) {
        // Symbols can be made with a single value, and array, or array of objects of (conditions/values)
        this.key = key;
        if (!Array.isArray(raw))
            raw = [raw];
        this.raw = raw;
        this.stack = [raw];
    };

    Symbol.prototype.pushRules = function(rules) {
        if (!Array.isArray(rules))
            rules = [rules];
        this.stack.push(rules);
    };

    Symbol.prototype.popRules = function() {
        this.stack.pop();
    };

    Symbol.prototype.selectRule = function() {
        if (this.stack.length === 0)
            throw ("No rules for " + this.key);
        return getRandom(this.stack[this.stack.length - 1]);
    };

    var Grammar = function(raw, settings) {
        this.raw = raw;
        this.symbols = {};
        this.subgrammars = [];
        this.modifiers = {};

        // copy over the base modifiers
        for (var key in baseModifiers) {
            if (baseModifiers.hasOwnProperty(key)) {
                this.modifiers[key] = baseModifiers[key];
            }
        };

        // Add all rules to the grammar
        for (var key in this.raw) {
            if (this.raw.hasOwnProperty(key)) {
                this.symbols[key] = new Symbol(this, key, this.raw[key]);
            }
        }

    };

    Grammar.prototype.expand = function(rule) {
        // Create a node and subnodes
        var root = new Node(this, {
            type : -1,
            raw : rule,
        });
        root.expand();
        return root;
    };

    Grammar.prototype.flatten = function(rule) {
        return this.expand(rule).finishedText;
    };

    // Create or push rules
    Grammar.prototype.pushRules = function(key, rules) {
        if (this.symbols[key] === undefined) {
            this.symbols[key] = new Symbol(this, key, rules);
        } else {
            this.symbols[key].pushRules(rules);
        }
    };

    Grammar.prototype.popRules = function(key) {
        this.symbols[key].popRules();
    };

    Grammar.prototype.selectRule = function(key) {
        if (this.symbols[key])
            return this.symbols[key].selectRule();

        // Failover to alternative subgrammars
        for (var i = 0; i < this.subgrammars.length; i++) {

            if (this.subgrammars[i].symbols[key])
                return this.subgrammars[i].symbols[key].selectRule();
        }

        return "((" + key + "))";
    };

    // Parses a plaintext rule in the tracery syntax
    tracery = {

        createGrammar : function(raw) {
            return new Grammar(raw);
        },

        parseAction : function(action) {

        },

        parseTag : function(tagContents) {

            var parsed = {
                symbol : undefined,
                preactions : [],
                postactions : [],
                modifiers : []
            };
            var sections = tracery.parse(tagContents);
            var symbolSection = undefined;
            for (var i = 0; i < sections.length; i++) {
                if (sections[i].type === 0) {
                    if (symbolSection === undefined) {
                        symbolSection = sections[i].raw;
                    } else {
                        throw ("multiple main sections in " + tagContents);
                    }
                } else {
                    parsed.preactions.push(sections[i]);
                }
            }

            if (symbolSection === undefined) {
                throw ("no main section in " + tagContents);
            } else {
                var components = symbolSection.split(".");
                parsed.symbol = components[0];
                parsed.modifiers = components.slice(1);
            }
            return parsed;
        },

        parse : function(rule) {
            var depth = 0;
            var inTag = false;
            var sections = [];
            var escaped = false;

            sections.errors = [];
            var start = 0;

            var escapedSubstring = "";
            var lastEscapedChar = undefined;
            function createSection(start, end, type) {
                if (end - start < 1) {
                    sections.errors.push(start + ": 0-length section of type " + type);
                }
                var rawSubstring;
                if (lastEscapedChar !== undefined) {
                    rawSubstring = escapedSubstring + rule.substring(lastEscapedChar + 1, end);
                } else {
                    rawSubstring = rule.substring(start, end);
                }
                sections.push({
                    type : type,
                    raw : rawSubstring
                });
                lastEscapedChar = undefined;
                escapedSubstring = "";
            };

            for (var i = 0; i < rule.length; i++) {

                if (!escaped) {
                    var c = rule.charAt(i);

                    switch(c) {

                    // Enter a deeper bracketed section
                    case '[':
                        if (depth === 0 && !inTag) {
                            if (start < i)
                                createSection(start, i, 0);
                            start = i + 1;
                        }
                        depth++;
                        break;
                    case ']':
                        depth--;

                        // End a bracketed section
                        if (depth === 0 && !inTag) {
                            createSection(start, i, 2);
                            start = i + 1;

                        }
                        break;

                    // Hashtag
                    //   ignore if not at depth 0, that means we are in a bracket
                    case '#':
                        if (depth === 0) {
                            if (inTag) {
                                createSection(start, i, 1);
                                start = i + 1;
                            } else {
                                if (start < i)
                                    createSection(start, i, 0);
                                start = i + 1;
                            }
                            inTag = !inTag;
                        }
                        break;

                    case '\\':
                        escaped = true;
                        escapedSubstring = escapedSubstring + rule.substring(start, i);
                        start = i + 1;
                        lastEscapedChar = i;
                        break;
                    }
                } else {
                    escaped = false;
                }
            }
            if (start < rule.length)
                createSection(start, rule.length, 0);

            if (inTag) {
                sections.errors.push("Unclosed tag");
            }
            if (depth > 0) {
                sections.errors.push("Too many [");
            }
            if (depth < 0) {
                sections.errors.push("Too many ]");
            }

            /*
             console.log(sections.map(function(section) {
             console.log(section);
             return section.raw;
             }));
             */
            return sections;
        },

        test : function() {
            var content = $("#content-col");
            var testlog = $("<div/>", {
                class : "card debug-output",
            }).appendTo(content);

            var tests = {
                basic : ["", "a", "tracery"],
                hashtag : ["#a#", "a#b#", "aaa#b##cccc#dd#eee##f#"],
                hashtagWrong : ["##", "#", "a#a", "#aa#aa###"],
                escape : ["\\#test\\#", "\\[#test#\\]"],
            };

            var testGrammar = tracery.createGrammar({
                animal : ["capybara", "unicorn", "university", "umbrella", "u-boat", "boa", "ocelot", "zebu", "finch", "fox", "hare", "fly"],
                color : ["yellow", "maroon", "indigo", "ivory", "obsidian"],
                mood : ["elated", "irritable", "morose", "enthusiastic"],
                story : ["[mc:#animal#]Once there was #mc.a#, a very #mood# #mc#"]
            });

            var toParse = [];
            for (var i = 0; i < 20; i++) {
                var expansion = testGrammar.expand("[test:#foo#]foo");
                console.log(expansion.finishedText);
            }

            /*
             $.each(tests, function(index, testSet) {
             for (var i = 0; i < testSet.length; i++) {
             var parsed = tracery.parse(testSet[i]);
             var output = "<span class='section-raw'>" + testSet[i] + "</span> ";
             output += tracery.parsedSectionsToHTML(parsed);
             output = output.replace(/\\/g, "&#92;");
             testlog.append(output + "<p>");

             }
             });
             */
        },

        parsedSectionsToHTML : function(sections) {
            var output = "";
            for (var i = 0; i < sections.length; i++) {
                output += "<span class='section-" + sections[i].type + "'>" + sections[i].raw + "</span> ";
            }
            if (sections.errors) {
                for (var i = 0; i < sections.errors.length; i++) {
                    output += "<span class='section-error'>" + sections.errors[i] + "</span> ";
                }
            }
            return output;
        },
    };
    return tracery;
}();
