# Techne: A Brief Installation Guide To Get The Thing To Do

## A note on why things are this way

I wanted code to try and be cross-platform, which means Techne is written as a bunch
of CommonJS modules (they use `require()` and `module.exports`).

To bundle CommonJS modules for the browser, I'm currently using [webpack](https://webpack.github.io/).

## Notes on Installation

The node SVG-to-Pixel code depends on two npm packages:
1. [svg2img](https://www.npmjs.com/package/svg2img) for converting SVG strings to PNG images

2. [sharp](http://sharp.dimens.io/) for extracting pixel data from PNG images

Both of these packages are in the `package.json` file, and their installation instructions
don't claim that they need any extra code.  However, in practice (and this may have been due
to the fact that I was trying out lots of different things) I remember needing to install
Cairo and GraphicsMagick, which are external image processing libraries.  It's still TODO
experiment with a clean install and see what's needed.

If you hit a problem, try installing either/or of these libraries.

## Installation

Run `npm install` in the source directory. It's gonna pull in a lot.  Work TODO is having less dependencies.
Jasmine is a dependency for testing, to install it `npm install --dev`

## How the bundling do

Running `webpack` in the source directory will create two bundles and two source maps
in the `dist` directory.  The configuring for webpack is in `webpack.config.js`.

1. __app.bundle.js__ the bundle for the SVG example
2. __test.bundle.js__ bundles of all the test specs together for a Jasmine runner.


## Running
Remember to bundle first with `webpack`!  For the SVG example, include `dist/app.bundle.js`.

When actually building things on top of this, use `require()` to pull in the modules
you need.  This can get a little gnarly, because some of the strings get really long.  It's TODO work to
bundle a library that you can just include in a webpack before any of your scripts that exposes all the Techne
goodness you need.

`js/modules/commonlib.js` is a useful library of functionality that gets conditionally bundled
together with code that can only run in the browser (broswerlib) or code that can only run in node (nodelib).

See the associated paper on Techne for which interfaces you might find useful.

## Running The Tests
There are two environments we need to test Techne in: the browser and node.

1. `npm test` bundles and tests Techne in a node environments

2. opening tests/SpecRunner.html in a browser tests Techne in a broswer (like Chrome or Firefox)

3. TODO: add an easy way to test in PhantomJS

# Structure!
What is where in the project:
* *js/models* holds onto Mongoose Schemas of Arts and Tags.  Validation code for both these things is also here.
* *js/modules* the rest!
  * *js/modules/artist* artist code.  Create/Evaluate art, push art to an art store, pull art back.  Currently, supporting code for art creation also lives here.
  * *js/modules/artstore* artstore code.  Space for holding onto arts, providing art to pull requests for it, etc.
  * *js/modules/views* UI code.  Views and Controllers to actually see arts or bots
* *js/&ast;lib.js* library code.  All of this should eventually get mixed in to commonlib, and commonlib is the module to include if you need library functionality.  Other things of this pattern are environment specific implementations of code that we want to look general to bots, and will get mixed into commonlib.js
* *js/&ast;Commune.js* code for setting up a commune.  Initalizes an artstore and some bots.
* *app.js* runs a WebCommune, gets bundled into __app.bundle.js__
