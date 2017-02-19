//Get a view of a NodeArtStore.

//The important part here is to fire up D3 with an ajax request for the influence
//from an ArtStore.  We can also get all the arts if we want.

/*jshint esversion: 6*/
var d3 = require('d3');
var $ = require('jquery');

function createInfluenceChart(){
  //chart setup, set the height and width of the chart, and what element it
  //gets appended to
  var width = 420;
  var height = 560;
  var svg = d3.select("div#content-main")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  //Set up on SVG marker to use for the arrowheads
  svg.append("svg:defs").selectAll("marker")
    .data(["end"]).enter().append("svg:marker")
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", 0)
      .attr("markerWidth", 4)
      .attr("markerHeight", 4)
      .attr("orient", "auto")
    .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");

  //Set up unique coloring for each node type, based on medium tags
  var nodeColor = d3.scaleOrdinal(d3.schemeCategory10);
  nodeColor.domain(["medium:picture", "medium:critique"]);

  //Set up unique coloring for each link type.
  var linkColor = d3.scaleOrdinal(["#bcbd22", "#9467bd"]);
  linkColor.domain(["influence", "critique"]);

  //Set up force directed simulation, forces present:
  //link forces-- draw two linked nodes together (default force of 30,
  //id is important here because we're using our own ids and not d3's defaults)
  //charge forces-- pushes nodes away from eachother
  //center forces-- draws all nodes to the specified point
  var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id))
    .force("charge", d3.forceManyBody().strength(d => -300))
    .force("center", d3.forceCenter(width / 2, height / 3));


  $.ajax({
    type: "GET",
    contentType: "application/json; charset=utf-8",
    url: "http://localhost:8080/techne/influence",
    dataType:'json',
    async: true,
    success: (graph) => {
      var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", 2.5)
        .attr("stroke", d => linkColor(d.type))
        .attr("marker-end", "url(#end)");

      var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
          .attr("r", 7)
          .attr("fill", d => nodeColor(d.medium))
          .call(d3.drag()
            .on("start", d => {
              if(!d3.event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
            })
            .on("drag", d => {
              d.fx = d3.event.x;
              d.fy = d3.event.y;
            })
            .on("end", d => {
              if(!d3.event.active) simulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
            })
          );
      node.append("title")
        .text(d => d.id + "(" + d.medium + ")");

      link.append("title")
        .text(d => d.type);

      simulation
        .nodes(graph.nodes)
        .on("tick", () => {
          link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

          node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
        });

      simulation.force("link")
        .links(graph.links);
    }
  });
}

module.exports = {'drawGraph' : createInfluenceChart};
