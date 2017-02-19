/**
 * @author Johnathan
 * Model of an art.  Arts are a blob of stuff (using Mongoose's anything goes
 * Mixed SchemaType) and of tags
 */
/*jshint esversion: 6 */
/*jslint node: true */
"use strict";
var mongoose  = require('mongoose');
var uuid = require('node-uuid');
var Schema    = mongoose.Schema;
var lib = require('../modules/commonlib'); //extra code to do things that might be shared among a lot of modules

//some extra custom validation functions

/**
 * Validate if a tag is a correct author tags.
 * Author tags have a key of "author" and a value of a valid UUID string
 * @param  {String} tag contents of an author tag!
 * @return {Boolean}     true if the tag passes validation, false if otherwise
 */
function validateUUID(tag){
  //http://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
  //FIXME not entirely true to fit all potential UUID schemes, assumes things like
  //dashes, but works for now.
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/.test(tag);
}

/**
 * The actual art schema!
 * @type {Schema}
 */
var ArtSchema = new Schema({
  tags: {type: [String],
    validate: [
      {
        //Need at least two tags! Author and timestamp.
        validator: v => v.length < 1 ? false : true,
        message : "Need at least one tags: author"
      },
      {
        validator: v => {
          console.log(v);
          var authorTag = v.filter(tag => tag.includes("author"))[0];

          return validateUUID(authorTag.slice(authorTag.indexOf(":") + 1));
        },
        message: "Unable to find valid author tag"
      },
    ],
    required: true},
  art:  {type: Schema.Types.Mixed, required: true}
});

//FIXME Surprise! Mongoose isn't fully isomorphic (doesn't completely replicate functionality in the client [browser, for our cases])
//FIXME current fix: sometimes return a mongoose model if we can. Otherwise,
//FIXME return a constructor for an anonymous object around a mongoose document.
//FIXME I know this is disgusting, but it works for now.  Talk to Kate ASAP
//FIXME for beter strategies.
module.exports = lib.exportModel(mongoose, 'Art', ArtSchema);
