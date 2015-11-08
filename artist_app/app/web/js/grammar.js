/**
 * @author Kate
 */

var grammar = tracery.createGrammar({
    never : ["always", "never", "ever", "sometimes", "perhaps", "forever", "frequently", "eternally", "once again"],
    animal : ["okapi", "pheasant", "cobra", "amoeba", "capybara", "kangaroo", "chicken", "rooster", "boa-constrictor", "nematode", "sheep", "otter", "quail", "goat", "agouti", "zebra", "giraffe", "yak", "corgi", "pomeranian", "rhinoceros", "skunk", "dolphin", "whale", "duck", "bullfrog", "okapi", "sloth", "monkey", "orangutan", "grizzly-bear", "moose", "elk", "dikdik", "ibis", "stork", "robin", "eagle", "hawk", "iguana", "tortoise", "panther", "lion", "tiger", "gnu", "reindeer", "raccoon", "opossum", "camel", "dromedary", "pigeon", "squirrel", "hamster", "leopard", "panda", "boar", "squid", "parakeet", "crocodile", "flamingo", "terrier", "cat", "wallaby", "wombat", "koala", "orangutan", "bonobo", "lion", "salamander"],
    emotion : ["sorrow", "glee", "pomposity", "vexation", "grandiosity", "melancholia", "ardour", "verve", "passion", "tremulousness", "piety", "dignity", "rage", "mourning", "loss", "regret", "pride"],
    emotionAdj : "vexed pleased happy bold earnest honest distressed ferocious fierce vain expressive guilty effusive jovial mysterious languid warm cold frigid wistful delighted angry enimatic grateful bemused elated skeptical morose gleeful curious sleepy hopeful ashamed alert energetic exhausted giddy grateful groggy grumpy irate jealous jubilant lethargic sated lonely relaxed restless surprised tired thankful".split(" "),
    phase : ["experimentation", "phase", "movement", "period"],
    color : "ivory white silver ecru scarlet red burgundy ruby crimson carnelian pink rose grey pewter charcoal slate onyx black mahogany brown green emerald blue sapphire turquoise aquamarine teal gold yellow carnation orange lavender purple magenta lilac ebony amethyst garnet".split(" "),
    adventure : "lament story epic wish desire dance mystery enigma voyage drama path training joy tragedy comedy riddle puzzle regret victory loss song adventure question quest vow oath tale journey".split(" "),
    of : ["concerning", "of", "with", "for"],

    substance : ["water", "tears", "blood", "dreams", "sound", "memory", "#emotion#", "#emotion#", "#emotion#", "#emotion#"],
    quantity : ["ounce", "river", "scent", "dream", "sound", "noise", "touch", "fullness", "memory", "quantum", "weight", "loss", "fear", "unbearable weight", "feeling"],

    digit : "0123456789".split(""),
    number : ["#digit##digit#", "#digit#"],
    adj : ["#color#", "#emotionAdj#"],
    noun : ["#animal#"],

    workName : ["The #quantity.capitalizeAll# of #substance.capitalizeAll#", "#quantity.a.capitalizeAll# of #substance.capitalizeAll#", "#adventure.a.capitalizeAll# #of# #emotion.capitalize#", "The #adj.capitalizeAll# #adventure.capitalize#", "#adventure.capitalize# with #noun.capitalize.s#", "#never.capitalizeAll# #noun.capitalize.a#", "#adventure.capitalize# of the #noun.capitalize#", "#never.capitalize# #adj.capitalize#"],
    botName : ["#adj.capitalize##noun.capitalize#", "#never.capitalize##animal.capitalizeAll#"],

});
