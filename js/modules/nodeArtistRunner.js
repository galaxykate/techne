//Run a node artist in it's own node process.
//Life-loop: make an art every minute or so.  Before making an art, look around
//for a critique of your art, see if you like it, poke at it, then create a
//new art.
/*jshint esversion:6*/

var NodeArtist = require('./artist/visualNodeArtist');
var url =  process.env.CommuneLoc !== undefined ? process.env.CommuneLoc : "http://localhost:8080/techne/art";
var nodeArtist = new NodeArtist(url);

console.log("Initalized, ready to go!");
//life-loop
setInterval(() => {
  console.log("Starting my life loop!");
  //first, be a good art bot and crit someone else's work
  nodeArtist.createCritique()
  .then(() => {
    console.log("I added a crit to the commune like a good bot.");
    return nodeArtist.requestCritique(); //ask for a critique of my work
  })
  .then(crit => {
    if(crit !== undefined){
      console.log("I'm gonna change how I do art.");
      return nodeArtist.selfModify(crit);
    }
    return new Promise(); //empty promise, we just want to chain on it.
  })
  .then(() => {
    console.log("I'm gonna create a new art!");
    nodeArtist.createArt();
  });
}, 30 * 1000); //do this every five minutes
