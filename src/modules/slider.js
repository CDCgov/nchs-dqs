/* define(["jquery", "d3"], function($, d3) { */
import $ from "jquery";
import * as d3 from "../lib/d3_v4-min";

function Slider() {
  var publicAPI = {};
  var mMARGIN = {
    top: 5,
    right: 20,
    bottom: 15,
    left: 5
  };
  var mSliderWidth;
  var mSliderHeight;
  var mXScale;
  var mYearsList;
  var mConfig;
  var mSliderSVG;
  var mCurrentYear;
  var mMediator;
  var mSliderHandle;
  var mSliderSVGWidth;
  var mSliderPlayBtnID;
  var mIsSliderPlaying = false;
  var mYear;
  var mPlaySliderTrigger;
  var mSliderChangeEventName;
  // 2May2019  var mIntervalTime = 1000; // milliseconds
  var mIntervalTime;
  var mSlider;
  var mSliderHandleText;

  publicAPI.setMediator = function (m) {
    mMediator = m;
  };

  publicAPI.getMediator = function () {
    return mMediator;
  };

  function setSize() {
    /*  // 24Feb2022 mSliderSVGWidth =
      mConfig.ParentContainerWidth - mMARGIN.left - mMARGIN.right; */
    const $ParentContainer = $("#" + mConfig.ParentID);
    const availableWidth = 0.95 * $ParentContainer.width();
    mSliderSVGWidth = availableWidth - mMARGIN.left - mMARGIN.right;
    mSliderHeight = 60; // 1Jan2019
  }

  function findNearestTick(pos) {
    var ticks;
    var dist;
    var i = -1;
    var index = 0;
    var r;

    ticks = mXScale.ticks([mYearsList.length - 1]);
    dist = ticks.map(function (d) {
      return pos - mXScale(d);
    });
    r = mXScale.ticks ? mXScale.range()[1] : mXScale.rangeExtent()[1];
    do {
      i += 1;
      if (Math.abs(dist[i]) < r) {
        r = Math.abs(dist[i]);
        index = i;
      }
    } while (dist[i] > 0 && i < dist.length - 1);

    return ticks[index];
  }

  function buildScales() {
    var firstYear;
    var lastYear;

    firstYear = mYearsList[0].YearID;
    lastYear = mYearsList[mYearsList.length - 1].YearID;

    mXScale = d3
      .scaleLinear()
      .domain([firstYear, lastYear])
      // 09Oct2020 .range([0, mSliderWidth])
      .range([0, mSliderSVGWidth - 30]) // 09Oct2020
      .clamp(true);
  }

  // 26Mar2019 function moveSliderHandleToYearID(yearID) {
  publicAPI.moveSliderHandleToYearID = function (yearID) {
    mSliderHandle.attr("transform", "translate(" + mXScale(yearID) + ",0)");
    mSliderHandleText
      .text(function () {
        return mYearsList.filter(function (a) {
          return a.YearID === yearID;
        })[0].YearLabel;
      })
      .attr("transform", "translate(" + mXScale(yearID) + "," + -15 + ")");
  };

  // 3Apr2018
  function moveSliderHandleToX(d3EventX) {
    var newYear;
    var currentYearLabel;
    var currentYearObj;

    newYear = findNearestTick(d3EventX);
    if (newYear !== mCurrentYear) {
      publicAPI.moveSliderHandleToYearID(newYear);
      mCurrentYear = newYear;
      currentYearLabel = mYearsList.filter(function (d) {
        return d.YearID === mCurrentYear;
      })[0].YearLabel;
      currentYearObj = {
        YearID: mCurrentYear,
        YearLabel: currentYearLabel
      };
      mMediator.broadcast(mSliderChangeEventName, [currentYearObj]);
    }
    // TODO: 4Apr2018 implement tween movement for slider handle
    // https://bl.ocks.org/mbostock/6452972
  }

  // 3Apr2018
  publicAPI.render = function () {
    var sliderBackground;

    mSliderSVG = d3
      .select("#" + mConfig.ContainerID)
      .append("svg")
      .attr("width", mSliderSVGWidth)
      .attr("height", mSliderHeight)
      .append("g")
      .attr("transform", "translate(" + mMARGIN.left + "," + mMARGIN.top + ")");

    /*  // 24Feb2022
    mSlider = mSliderSVG.append("g").attr("class", function () {
      return mConfig.DeviceType === "desktop" ? "x desktopaxis" : "x axis";
    }); */

    mSlider = mSliderSVG.append("g").attr("class", "x axis"); // 24Feb2022

    mSlider
      .call(
        d3
          .axisBottom(mXScale)
          .ticks([mYearsList.length - 1])
          .tickFormat(function (d) {
            return mYearsList.filter(function (a) {
              return a.YearID === d;
            })[0].YearLabel;
          })
          .tickSize(10)
          .tickPadding(12)
      )
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-1.1em")
      .attr("dy", "-1.5em")
      .attr("transform", "rotate(-90)")
      .select(".domain")
      .select(function () {
        return this.parentNode.appendChild(this.cloneNode(true));
      })
      .attr("class", "halo");

    mSliderHandle = mSlider
      .append("path")
      .attr("class", "sliderHandle")
      .attr("d", "M 0 -10 V 10")
      .attr("transform", "translate(0," + mSliderHeight / 2 + ")");

    mSliderHandleText = mSlider
      .append("text")
      .attr("class", "sliderHandleText")
      .attr("transform", "translate(0," + mSliderHeight / 2 + ")");

    publicAPI.moveSliderHandleToYearID(mCurrentYear);

    sliderBackground = d3
      .select("#" + mConfig.ContainerID)
      .select("svg")
      .append("rect")
      .attr("id", "sliderBackground")
      .attr("class", "sliderOverlay")
      .attr("width", mSliderSVGWidth)
      .attr("height", mSliderHeight)
      .style("visibility", "hidden")
      .style("cursor", "crosshair")
      .call(
        d3
          .drag()
          .on("start.interrupt", function () {
            sliderBackground.interrupt();
          })
          .on("start drag", function () {
            moveSliderHandleToX(d3.event.x);
          })
      );
  };

  function stopSliderPlay() {
    clearInterval(mPlaySliderTrigger);
    mIsSliderPlaying = false;
    // 24Feb2022 $("#" + mSliderPlayBtnID).removeClass("fa-pause"); // 16Nov2017
    // 24Feb2022 $("#" + mSliderPlayBtnID).addClass("fa-play"); // 16Nov2017
    $("#" + mSliderPlayBtnID).removeClass("bi-pause-fill"); // 24Feb2022
    $("#" + mSliderPlayBtnID).addClass("bi-play-fill"); // 24Feb2022
  }

  // 5Apr2018
  function playSlider() {
    var currentYearLabel;
    var currentYearObj;

    if (mYear !== mYearsList[mYearsList.length - 1].YearID) {
      mYear += 1;
      mCurrentYear = mYear;
      currentYearLabel = mYearsList.filter(function (d) {
        return d.YearID === mCurrentYear;
      })[0].YearLabel;
      currentYearObj = {
        YearID: mCurrentYear,
        YearLabel: currentYearLabel
      };
      mMediator.broadcast(mSliderChangeEventName, [currentYearObj]);
    } else {
      stopSliderPlay();
    }
  }

  function addEventListeners() {
    $(document).on("click", "body, #" + mSliderPlayBtnID, function (evt) {
      if ($(evt.target).attr("id") === mSliderPlayBtnID) {
        if (mIsSliderPlaying === false) {
          mIsSliderPlaying = true;
          // 24Feb2022 $(evt.target).removeClass("fa-play"); // 16Nov2017
          // 24Feb2022 $(evt.target).addClass("fa-pause"); // 16Nov2017
          $(evt.target).removeClass("bi-play-fill"); // 24Feb2022
          $(evt.target).addClass("bi-pause-fill"); // 24Feb2022

          if (
            mYear === 0 ||
            mYear === mYearsList[mYearsList.length - 1].YearID
          ) {
            mYear = mYearsList[0].YearID - 1; // set to (firstyear - 1), so that first year map data can be rendered
          } else {
            mYear = mCurrentYear;
          }
          mMediator.broadcast(mConfig.RecordSliderPlayBtnEventName); // 19Aug2019
          mPlaySliderTrigger = setInterval(playSlider, mIntervalTime);
        } else {
          stopSliderPlay();
        }
        evt.preventDefault();
        return false;
      }
      // if the application is clicked anywhere else while the animation is running, then reset and stop animation.
      mYear = 0;
      stopSliderPlay();
      return null; // 29Mar2019
    });

    window.addEventListener("resize", createSlider); // 24Feb2022
  }

  function removeEventListeners() {
    window.removeEventListener("resize", setSize);
  }

  function createSlider() {
    $("#" + mConfig.ContainerID).empty();
    setSize();
    buildScales();
    publicAPI.render();
  }

  publicAPI.dispose = function () {
    removeEventListeners();
  };

  publicAPI.updateCurrentYear = function (newYear) {
    mCurrentYear = newYear;
    publicAPI.moveSliderHandleToYearID(mCurrentYear);
  };

  publicAPI.update = function (updateConfig) {
    $("#" + mConfig.ContainerID).empty();
    mYear = 0; // 23Aug2017

    mYearsList = updateConfig.YearsList;
    mCurrentYear = updateConfig.CurrentYear;
    buildScales();
    publicAPI.render();
  };

  publicAPI.init = function (config) {
    mConfig = config;
    mCurrentYear = config.CurrentYear;
    // 17Mar2022 mMediator = config.Mediator;
    mYearsList = config.YearsList;
    mSliderPlayBtnID = config.SliderPlayBtnID;
    mSliderChangeEventName = config.SliderChangeEventName;
    mIntervalTime = config.IntervalTime; // 2May2019
    mYear = 0;
    // 5Apr2018   mInitialYear = -1;

    createSlider(); // 24Feb2022
    addEventListeners();
  };

  return publicAPI;
}
export default Slider;
