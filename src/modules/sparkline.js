
import $ from "jquery";
import * as d3 from "../lib/d3_v4-min";

function Sparkline() {
  var publicAPI = {};

  publicAPI.init = function(config) {
    var xValDataPoint;
    var yValDataPoint;
    var lineData;
    var width;
    var height;
    var containerID;
    var xVar;
    var yVar;
    var mXScale;
    var mYScale;
    var line;
    var svg;

    xValDataPoint = config.xValDataPoint;
    yValDataPoint = config.yValDataPoint;
    lineData = config.LineData;
    width = config.Width;
    height = config.Height;
    containerID = config.ContainerID;
    xVar = config.xVar;
    yVar = config.yVar;

    // 5Apr2018 x = d3.scale.linear().range([0, width - 2]);
    // 5Apr2018 y = d3.scale.linear().range([height - 4, 0]);

    mXScale = d3.scaleLinear().range([0, width - 2]);
    mYScale = d3.scaleLinear().range([height - 4, 0]);

    // 5Apr2018 line = d3.svg
    line = d3
      .line()
      .defined(function(d) {
        // return !isNaN(d[yVar]);
        return d[yVar] !== null;
      })
      .x(function(d) {
        return mXScale(d[xVar]);
      })
      .y(function(d) {
        return mYScale(+d[yVar]);
      });

    mXScale.domain(
      d3.extent(lineData, function(d) {
        return d[xVar];
      })
    );
    mYScale.domain(
      d3.extent(lineData, function(d) {
        return +d[yVar];
      })
    );

    svg = d3
      .select("#" + containerID)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(0,2)");
    svg
      .append("path")
      .datum(lineData)
      .attr("class", "sparkline")
      .attr("d", line);

    svg
      .append("circle")
      .attr("class", "sparkcircle")
      .attr("cx", function() {
        return mXScale(xValDataPoint);
      })
      .attr("cy", function() {
        return mYScale(yValDataPoint);
      })
      .attr("r", 1.5);
  };

  return publicAPI;
}
export default Sparkline;
