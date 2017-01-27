/**
 * @author Johnathan
 * Model of an art.  Arts are a blob of stuff (using Mongoose's anything goes
 * Mixed SchemaType) and of tags
 */
/*jshint esversion: 6 */

var mongoose  = require('mongoose');
var uuid = require('node-uuid');
var Schema    = mongoose.Schema;
var TagConstructor = require('./tag');
var Tag = new TagConstructor().schema;
var lib = require('../modules/commonlib'); //extra code to do things that might be shared among a lot of modules

//some extra custom validation functions

/**
 * Validate if a tag is a correct author tags.
 * Author tags have a key of "author" and a value of a valid UUID string
 * @param  {Tag} tag a tag object
 * @return {Boolean}     true if the tag passes validation, false if otherwise
 */
function validateAuthor(tag){
  //http://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
  //FIXME not entirely true to fit all potential UUID schemes, assumes things like
  //dashes, but works for now.
  if(tag.key == 'author'){
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/.test(tag.value);
  }

  return false;
}

/**
 * Validate if a set of tags contains a date tag that is the corret timestamp
 * date tags have a key of "timestamp" and a Date-parsable value
 * @param  {Tag} tag a tag object
 * @return {Boolean}     true if the tag passes validation, false if otherwise
 */
function validateTimestamp(tag){
  if(tag.key == "timestamp"){
    return (new Date(parseInt(tag.value, 10)).getTime()) > 0; //specifying a radix for parseInt, want it to fail if given anything not base-10
  }

  return false;
}

var ArtSchema = new Schema({
  tags: {type: [Tag],
    validate: [
      {
        //Need at least two tags! Author and timestamp.
        validator: v => v.length < 2 ? false : true,
        message : "Need at least two tags, author and timestamp"
      },
      {
        validator: v => {
          for(let i = 0; i < v.length; i++){
            if(validateAuthor(v[i])){
              return true;
            }
          }
          return false;
        },
        message: "Unable to find valid author tag"
      },
      {
        validator: v => {
          for(let i = 0; i < v.length; i++){
            if(validateTimestamp(v[i])){
              return true;
            }
          }
          return false;
        },
        message: "Unable to find valid timestep tag"
      }
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
