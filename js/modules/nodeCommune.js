/**
 * Initalizing a couple of node art bots (running in browser)
 */
/*jshint esversion:6 */

 var NodeVisualArtist = require('./artist/visualNodeArtist');
 var NodeArtStoreView = require('./views/nodeArtStoreView');
 /**
  * Constructor for a web commune.
  */
 var NodeCommune = function(){
   this.artsLoc = "http://localhost:8080/techne/art";
   this.members = [];
 };

 NodeCommune.prototype = {

   /**
    * Add a new member to this commune
    * creates a new node art bot
    */
   addMember: function(){
     var newArtFriend = new NodeVisualArtist(this.artsLoc);   //WebArtists have a direct reference to the ArtStore
     this.members.push(newArtFriend);
   },

   /**
    * Set up a new Commune
    * @return {Undefined} Add some node artists, get them to create some art to kick off the Commune
    */
   initalize: function(){
     //FIXME hardcoded intalization constants.
     for(let i = 0; i < 2; i++){
       this.addMember();
     }

     NodeArtStoreView.drawGraph();
     /**
    this.members[1].createArt()
     .then(publishedArt => {
       console.log("Art should be published in the commune.");
       console.log(publishedArt);
       return this.members[0].createCritique()
     })
     .then(publishedCrit => {
       console.log("Crit should be published in the commune.");
       console.log(publishedCrit);
       return this.members[1].getCritiqueAndSelfModify()
     })
     .then(() => {
       this.members[1].createArt();
     })
     .catch(err => {
       console.error(error);
     })
     .then(() => {
       NodeArtStoreView.drawGraph();
     });
     */
   }
 };

 module.exports = NodeCommune;
