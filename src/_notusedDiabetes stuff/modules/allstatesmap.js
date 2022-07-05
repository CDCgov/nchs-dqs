import $ from "jquery";
import * as d3 from "lib/d3_v4-min";
import * as d3topo from "lib/topojson_v302.min";
import HelperUtil from "modules/helperutils";
import canvg from "canvgModule";
import Handlebars from "Handlebars";
import CSVFileDownload from "modules/csvFileDownload";
import PPTPostSubmitForm from "modules/pptPostSubmitForm";
import Slider from "modules/slider";
import sparkline from "modules/sparkline";
import sliderplayerTemplateHTML from "HtmlTemplates/sliderplayer.html";
import legendTemplateHTML from "HtmlTemplates/legend.html";

function AllStatesMap() {
  var publicAPI = {};
  var mMediator;
  var mSideMargin = 50;
  var mMapWidth;
  var mMapHeight;
  var mMapSVG;
  var mMapSVGGroup;
  var mMapProjection;
  var mMapPath;
  var mMapBounds;
  var mConfig;
  var mEstimateByStateID = {};
  var mStateNameByStateID = {};
  var mActiveLegendItems = [];
  var mLegendData;
  var mSliderMod;
  var mSelectedStatesList;
  var stopped;
  var mAllYearsData;
  var mCurrentYearData;
  var mSuppressedFlagID = -2;
  var mNoDataFlagID = -1;
  var mInActiveFlagID = -3;
  var mColorByStateID = {};
  var mInActiveColor = "#FFFFFF";
  var mCurrentYearAllStatesMedianData;
  var mHelperUtil;
  var mMapGeom;

  function registerHandlebarsHelperMethods() {
    Handlebars.registerHelper("checkedIf", function (condition) {
      return condition ? "checked" : "";
    });
  }

  async function loadMapGeometry() {
    const mapJSON = await mHelperUtil.getJsonFile("DiabetesMapTopoJSON.json");
    const geomCollectionID = mapJSON.objects.DiabetesMap;
    mMapGeom = d3topo.feature(mapJSON, geomCollectionID);
  }

  function setMapSize() {
    var $MapContainer;
    var bottomSliderMarginFactor;

    bottomSliderMarginFactor = 0.67;

    // 23Feb2022 $MapContainer = $("#" + mConfig.ContainerID); //
    $MapContainer = $("#" + mConfig.ParentID); //
    mMapWidth = $MapContainer.width() - mSideMargin;
    mMapHeight = $MapContainer.width() * bottomSliderMarginFactor;
  }

  function setProjectionScaleTranslation() {
    var center;
    var scaleParam;
    var translateParam;

    center = d3.geoCentroid(mMapGeom);

    mMapProjection = d3
      .geoAlbers()
      .rotate([Math.abs(Math.round(center[0])), 0])
      .center([-0.6, Math.round(center[1])])
      .scale(1)
      .translate([0, 0]);

    mMapPath = d3.geoPath().projection(mMapProjection);
    mMapBounds = mMapPath.bounds(mMapGeom);
    scaleParam =
      0.95 /
      Math.max(
        (mMapBounds[1][0] - mMapBounds[0][0]) / mMapWidth,
        (mMapBounds[1][1] - mMapBounds[0][1]) / mMapHeight
      );
    translateParam = [
      (mMapWidth - scaleParam * (mMapBounds[1][0] + mMapBounds[0][0])) / 2,
      (mMapHeight - scaleParam * (mMapBounds[1][1] + mMapBounds[0][1])) / 2
    ];

    mMapProjection.scale(scaleParam).translate(translateParam);
  }

  stopped = function () {
    // If the drag behavior prevents the default click,
    // also stop propagation so we don’t click-to-zoom.
    if (d3.event.defaultPrevented) {
      d3.event.stopPropagation();
    }
  };

  function addSVG() {
    const $MapContainer = $("#" + mConfig.ParentID);
    $MapContainer.empty(); // 17Mar2022
    $MapContainer.append("<div id='" + mConfig.MapID + "'></div>");

    mMapSVG = d3
      .select("#" + mConfig.MapID)
      .append("svg")
      .attr("viewBox", "0 0 " + mMapWidth + " " + mMapHeight)
      .on("click", stopped, true);

    mMapSVGGroup = mMapSVG.append("g");
  }

  function getTotalMeasureData() {
    var ageClassificationTypeData;
    var currentAgeClassificationType;
    var currentMeasureData;
    var currentDataClassificationType;
    var dataClassificationTypeData = [];

    currentMeasureData = mConfig.BusinessData.MeasureData;
    currentAgeClassificationType =
      mConfig.DataParameters.getAgeClassificationType();
    currentDataClassificationType =
      mConfig.DataParameters.getDataClassificationType();

    ageClassificationTypeData =
      currentAgeClassificationType === "Age-Adjusted"
        ? currentMeasureData.Data.AgeAdjustedData
        : currentMeasureData.Data.CrudeData;

    dataClassificationTypeData =
      currentDataClassificationType === "Natural Breaks"
        ? ageClassificationTypeData.NaturalBreaksData
        : ageClassificationTypeData.QuartilesData;

    return dataClassificationTypeData;
  }

  function getAgeMeasureData() {
    var currentSubmeasureData;
    var currentMeasureData;
    var currentSubmeasureID;
    var currentDataClassificationType;
    var dataClassificationTypeData = [];

    currentMeasureData = mConfig.BusinessData.MeasureData;
    currentSubmeasureID = mConfig.DataParameters.getSubmeasureID();
    currentDataClassificationType =
      mConfig.DataParameters.getDataClassificationType();

    currentSubmeasureData = currentMeasureData.Data.filter(function (a) {
      return a.SubmeasureID === currentSubmeasureID;
    })[0];

    dataClassificationTypeData =
      currentDataClassificationType === "Natural Breaks"
        ? currentSubmeasureData.NaturalBreaksData
        : currentSubmeasureData.QuartilesData;

    return dataClassificationTypeData;
  }

  // 20Mar2019
  function getOtherMeasureData() {
    var ageClassificationTypeData = [];
    var currentAgeClassificationType;
    var currentMeasureData;
    var currentSubmeasureID;
    var currentDataClassificationType;
    var currentSubmeasureData;
    var dataClassificationTypeData;

    currentMeasureData = mConfig.BusinessData.MeasureData;
    currentAgeClassificationType =
      mConfig.DataParameters.getAgeClassificationType();
    currentSubmeasureID = mConfig.DataParameters.getSubmeasureID();
    currentDataClassificationType =
      mConfig.DataParameters.getDataClassificationType();

    ageClassificationTypeData =
      currentAgeClassificationType === "Age-Adjusted"
        ? currentMeasureData.Data.AgeAdjustedData
        : currentMeasureData.Data.CrudeData;

    currentSubmeasureData = ageClassificationTypeData.filter(function (a) {
      return a.SubmeasureID === currentSubmeasureID;
    })[0];

    dataClassificationTypeData =
      currentDataClassificationType === "Natural Breaks"
        ? currentSubmeasureData.NaturalBreaksData
        : currentSubmeasureData.QuartilesData;

    return dataClassificationTypeData;
  }

  function getAllYearsData() {
    var currentMeasureID;
    var ageMeasureID = 41;
    var totalMeasureID = 40;
    var allYearsData = [];

    currentMeasureID = mConfig.DataParameters.getMeasureID();

    if (currentMeasureID === totalMeasureID) {
      allYearsData = getTotalMeasureData(); // 20Mar2019
    } else if (currentMeasureID === ageMeasureID) {
      allYearsData = getAgeMeasureData(); // 20Mar2019
    } else {
      allYearsData = getOtherMeasureData(); // 20Mar2019
    }

    return allYearsData;
  }

  function getCurrentYearData() {
    var currentYear;
    var currentYearData;

    currentYear = mConfig.DataParameters.getYear();
    mAllYearsData = getAllYearsData();
    currentYearData = mAllYearsData.Data.filter(function (d) {
      return d.YearID === currentYear;
    })[0];

    return currentYearData;
  }

  function getCurrentYearAllStatesMedianData() {
    // 24Jan2018
    var dataCopy;
    var currentYear;
    var currentYearAllStatesMedianData;

    currentYear = mConfig.DataParameters.getYear();
    dataCopy = $.extend(true, [], mAllYearsData.AllStatesMedianData.Data);
    currentYearAllStatesMedianData = dataCopy.filter(function (d) {
      return d.YearID === currentYear;
    })[0];
    if (
      !currentYearAllStatesMedianData.IsSuppressed &&
      !currentYearAllStatesMedianData.IsNoData
    ) {
      currentYearAllStatesMedianData.Value = mHelperUtil.roundNumericStrings(
        currentYearAllStatesMedianData.Value,
        1
      );
      currentYearAllStatesMedianData.UpperLimit =
        mHelperUtil.roundNumericStrings(
          currentYearAllStatesMedianData.UpperLimit,
          1
        );
      currentYearAllStatesMedianData.LowerLimit =
        mHelperUtil.roundNumericStrings(
          currentYearAllStatesMedianData.LowerLimit,
          1
        );
    } else if (currentYearAllStatesMedianData.IsSuppressed) {
      currentYearAllStatesMedianData.Value = "Suppressed";
      currentYearAllStatesMedianData.UpperLimit = "Suppressed";
      currentYearAllStatesMedianData.LowerLimit = "Suppressed";
    } else {
      currentYearAllStatesMedianData.Value = "No Data";
      currentYearAllStatesMedianData.UpperLimit = "No Data";
      currentYearAllStatesMedianData.LowerLimit = "No Data";
    }

    return currentYearAllStatesMedianData;
  }

  function getDefaultActiveLegendItems() {
    var activeLegendItems;
    activeLegendItems = [];
    activeLegendItems.push(String(mNoDataFlagID)); // No Data
    activeLegendItems.push(String(mSuppressedFlagID)); // Suppressed

    for (let i = 0; i < mLegendData.length; i += 1) {
      activeLegendItems.push(mLegendData[i].min + " - " + mLegendData[i].max);
    }

    return activeLegendItems;
  }

  function AreActiveItemsNoDataAndSuppressedOnly() {
    // when latest year has 'No Data' or 'Suppressed' for all states
    // then mActiveLegendItems = [ -1,-2];
    if (
      mActiveLegendItems.length === 2 &&
      parseInt(mActiveLegendItems[0], 10) === -1 &&
      parseInt(mActiveLegendItems[1], 10) === -2
    ) {
      return true;
    }
    return false;
  }

  function setLegendData() {
    mLegendData = mCurrentYearData.LegendData;
    if (!mActiveLegendItems.length || AreActiveItemsNoDataAndSuppressedOnly()) {
      mActiveLegendItems = getDefaultActiveLegendItems();
    }
  }

  // 24Feb2022
  function isNoDataOrSuppressedAndActive(activeLegendItem, val) {
    if (
      (activeLegendItem === String(mNoDataFlagID) ||
        activeLegendItem === String(mSuppressedFlagID)) &&
      String(val) === activeLegendItem
    ) {
      return true;
    }
    return false;
  }

  function isValueInActiveLegend(val) {
    var minVal;
    var maxVal;
    var splitVal;

    for (let i = 0; i < mActiveLegendItems.length; i += 1) {
      if (isNoDataOrSuppressedAndActive(mActiveLegendItems[i], val)) {
        return true;
      }
      splitVal = mActiveLegendItems[i].split("-");
      minVal = +splitVal[0];
      maxVal = +splitVal[1];
      if (+val >= minVal && +val <= maxVal) {
        return true;
      }
    }

    return false;
  }

  function setData() {
    var val;

    mEstimateByStateID = {};
    mStateNameByStateID = {};
    mColorByStateID = {};
    mCurrentYearData = getCurrentYearData();
    if (
      mAllYearsData.AllStatesMedianData.Data &&
      mAllYearsData.AllStatesMedianData.Data.length
    ) {
      mCurrentYearAllStatesMedianData = getCurrentYearAllStatesMedianData();
    }
    setLegendData();

    mCurrentYearData.Data.forEach(function (d) {
      if (d.IsSuppressed) {
        val = mSuppressedFlagID;
      } else if (d.IsNoData) {
        val = mNoDataFlagID;
      } else {
        val = d.Value;
      }

      if (isValueInActiveLegend(val)) {
        mEstimateByStateID[+d.GeoID] = val;
        mColorByStateID[+d.GeoID] = d.Color_HexVal;
      } else {
        mEstimateByStateID[+d.GeoID] = mInActiveFlagID;
        mColorByStateID[+d.GeoID] = mInActiveColor;
      }
      mStateNameByStateID[+d.GeoID] = d.GeoLabel;
    });
  }

  /*   function doubleClickEvtHandler(d) {
    var geoID;
    var geoLabel;
    var geoInfo;

    d3.event.stopPropagation();
    d3.event.preventDefault();

    geoID = +d.properties.STATE_FIPS;
    geoLabel = d.properties.STATE;
    geoInfo = {
      GeoID: geoID,
      GeoLabel: geoLabel
    };
    $(this).popover("dispose");
    mMediator.broadcast("MapStateDblClicked", [geoInfo]);
  } */

  function highlightSelectedStates() {
    var geoID;
    var geoIDIndex;

    mMapSVGGroup
      .selectAll("path")
      .style("stroke", function (d) {
        geoID = +d.properties.STATE_FIPS;
        geoIDIndex = mSelectedStatesList.indexOf(geoID);
        if (geoIDIndex === -1) {
          return "#ADADAD";
        }
        return "yellow";
      })
      .style("stroke-width", function (d) {
        geoID = +d.properties.STATE_FIPS;
        geoIDIndex = mSelectedStatesList.indexOf(geoID);
        if (geoIDIndex === -1) {
          return "0.5";
        }
        return "2";
      });
  }

  function singleClickEvtHandler(d) {
    var clickedGeoID;
    var clickedGeoIDIndex;
    var selectedStatesData;
    var eventBroadcastName;

    d3.event.stopPropagation();
    d3.event.preventDefault();

    clickedGeoID = +d.properties.STATE_FIPS;
    clickedGeoIDIndex = mSelectedStatesList.indexOf(clickedGeoID);

    if (clickedGeoIDIndex === -1) {
      mSelectedStatesList.push(clickedGeoID);
      eventBroadcastName = "StateSelected";
    } else {
      mSelectedStatesList.splice(clickedGeoIDIndex, 1);
      eventBroadcastName = "StateUnSelected";
    }

    selectedStatesData = {
      ClickedStateGeoID: clickedGeoID,
      SelectedStatesList: mSelectedStatesList
    };
    mMediator.broadcast(eventBroadcastName, [selectedStatesData]);

    highlightSelectedStates();
  }

  function getTooltipText(d) {
    var val;
    var displayVal;
    var h5Txt;
    var year;
    var yearLabel;
    var measureName;
    var submeasureLabel;
    var dataType;
    var dataTypeLabel;

    val = mEstimateByStateID[+d.properties.STATE_FIPS];
    year = mConfig.DataParameters.getYear();
    yearLabel = mAllYearsData.YearsList.filter(function (a) {
      return a.YearID === year;
    })[0].YearLabel;
    measureName = mConfig.DataParameters.getMeasureName();
    submeasureLabel = mConfig.DataParameters.getSubmeasureLabel().toUpperCase();
    dataTypeLabel = mConfig.DataParameters.getDataTypeLabel();
    dataType = mConfig.DataParameters.getDataType();

    if (+val === -1) {
      displayVal = "No Data";
    } else if (+val === -2) {
      displayVal = "Suppressed";
    } else if (dataType === "EstimateValue") {
      displayVal = mHelperUtil.roundNumericStrings(val, 1);
    } else {
      displayVal = Math.round(parseFloat(val)); // "NumberValue"
    }

    if (measureName === "Total") {
      h5Txt = "<h6>" + submeasureLabel + " for " + yearLabel + "</h6>";
    } else {
      h5Txt =
        "<h6>" +
        submeasureLabel +
        " (" +
        measureName +
        ") for " +
        yearLabel +
        "</h6>";
    }

    /*  // 17Mar2022
    h5Txt =
      '<div class="popup">' +
      h5Txt +
      "<span><label style='font-size:14px;font-weight:bold'>" +
      dataTypeLabel +
      "</label> : <label style='font-size:25px'>" +
      displayVal +
      "</label><div id='divSparkLine'></div></span>" +
      "<p>Click to select OR<br>" +
      "Double Click for more information</p>" +
      "</div>"; */

    h5Txt =
      '<div class="popup">' +
      h5Txt +
      "<span><label style='font-size:14px;font-weight:bold'>" +
      dataTypeLabel +
      "</label> : <label style='font-size:25px'>" +
      displayVal +
      "</label><div id='divSparkLine'></div></span>" +
      "<p>Click to select and display in Line chart" +
      "</div>";

    return h5Txt;
  }

  function createSparkLine(d) {
    var geoID;
    var currentYear;
    var geoIDMapData;
    var obj;
    var currentYearIndx;
    var currentYearVal;
    var config;
    var sparklineMod;

    geoID = +d.properties.STATE_FIPS;
    currentYear = mConfig.DataParameters.getYear();

    if (mAllYearsData) {
      geoIDMapData = mAllYearsData.Data.map(function (a) {
        obj = a.Data.filter(function (e) {
          return parseInt(e.GeoID, 10) === geoID;
        })[0];
        obj.YearID = a.YearID;
        return obj;
      });

      currentYearIndx = geoIDMapData
        .map(function (e) {
          return e.YearID;
        })
        .indexOf(currentYear);
      currentYearVal = geoIDMapData[currentYearIndx].Value;

      config = {
        LineData: geoIDMapData,
        ContainerID: "divSparkLine",
        Width: 100,
        Height: 25,
        xValDataPoint: currentYear,
        yValDataPoint: currentYearVal,
        xVar: "YearID",
        yVar: "Value"
      };

      sparklineMod = sparkline();
      sparklineMod.init(config);
    }
  }

  function renderMap() {
    var states;
    var t = d3.transition().duration(250);
    var val;

    // JOIN new data with old elements.
    states = mMapSVGGroup.selectAll("path").data(mMapGeom.features);

    // EXIT old elements not present in new data.
    states
      .exit()
      .attr("class", "stateGeom")
      .transition(t)
      .style("fill-opacity", 1e-6)
      .remove();

    // UPDATE old elements present in new data.
    states
      .attr("class", "stateGeom")
      .style("fill", function (d) {
        return mColorByStateID[+d.properties.STATE_FIPS];
      })
      .style("stroke", "#ADADAD")
      .style("stroke-width", "0.5")
      .transition(t)
      .style("fill-opacity", 1);

    // ENTER new elements present in new data.
    states
      .enter()
      .append("path")
      .attr("class", "stateGeom")
      .attr("d", mMapPath)
      .style("fill", function (d) {
        return mColorByStateID[+d.properties.STATE_FIPS];
      })
      .style("stroke", "#ADADAD")
      .style("stroke-width", "0.5")
      .on("click", singleClickEvtHandler)
      // 17Mar2022 .on("dblclick", doubleClickEvtHandler)
      .on("mouseover", function (d) {
        d3.select(this).transition().duration(300).style("opacity", 0.8);
        d3.select(this).style("cursor", "pointer");
        val = mEstimateByStateID[+d.properties.STATE_FIPS];
        if (+val !== mInActiveFlagID) {
          $(this)
            .popover({
              container: "body",
              title: mStateNameByStateID[+d.properties.STATE_FIPS],
              placement: "right",
              html: true,
              sanitize: false,
              content: function () {
                return getTooltipText(d);
              }
            })
            .popover("show");

          createSparkLine(d);
        }
      })
      .on("mouseout", function () {
        d3.select("#divSparkLine").remove();

        d3.select(this).transition().duration(100).style("opacity", 1);
        d3.select(this).style("cursor", "default");

        $(this).popover("dispose");
        $(".popover").remove(); // brute force removal of any lingering popovers
      })
      .transition(t)
      .style("fill-opacity", 1);

    highlightSelectedStates();
  }

  function loadSlider() {
    var config;
    var currentYear;
    var yearsList;
    var sliderplayerConfig;
    var sliderplayerCompiledTemplateHTML;
    var sliderplayerGeneratedHTML;
    // 25Feb2022 var parentContainerWidth; // 19Mar2019

    $(document).off("click", "body, #btnPlayMap"); // 19Aug2019

    config = {
      PlayBtnDivID: "divBtnPlayMap",
      PlayBtnID: "btnPlayMap",
      SliderDivID: "divYearSliderMap"
    };

    sliderplayerCompiledTemplateHTML = Handlebars.compile(
      sliderplayerTemplateHTML
    );
    sliderplayerGeneratedHTML = sliderplayerCompiledTemplateHTML(config);
    const $MapContainer = $("#" + mConfig.ParentID); // 24Feb2022
    $MapContainer.append(sliderplayerGeneratedHTML);
    currentYear = mConfig.DataParameters.getYear();
    yearsList = mAllYearsData.YearsList;
    // 24Feb2022 parentContainerWidth = 0.95 * $MapContainer.width(); // 19Mar2019

    sliderplayerConfig = {
      ContainerID: config.SliderDivID,
      ParentID: mConfig.ParentID, // 24Feb2022
      SliderPlayBtnID: config.PlayBtnID,
      CurrentYear: currentYear,
      YearsList: yearsList,
      // 24Feb2022 ParentContainerWidth: parentContainerWidth, // 19Mar2019
      SliderPlayBtnWidth: 50,
      Mediator: mMediator,
      SliderChangeEventName: "MapSliderChangeEvent", // TODO: Change it to ChangeEventsList
      RecordSliderPlayBtnEventName: "MapSliderPlayBtnClickEvent", // 19Aug2019  // TODO: Change it to ChangeEventsList
      IntervalTime: 1000
    };
    mSliderMod = new Slider();
    mMediator.registerComponent("mapslider", mSliderMod);
    mSliderMod.init(sliderplayerConfig);
  }

  function loadMapLegend() {
    var i;
    var legendTemplateConfig;
    var legendItems = [];
    var legendItemObj;
    var displayLabel;
    var colorHexVal;
    var colorStyle;
    var noDataColorHexVal;
    var suppressedDataColorHexVal;
    var legendCompiledTemplateHTML;
    var legendGeneratedHTML;
    var legendItemVal; // 11Apr2019

    $("#divMapLegend").remove();

    if (mLegendData.length) {
      for (i = 0; i < mLegendData.length; i += 1) {
        displayLabel = mLegendData[i].min + " - " + mLegendData[i].max;
        legendItemVal = mLegendData[i].min + " - " + mLegendData[i].max; // 11Apr2019
        colorHexVal = mLegendData[i].color_hexval;

        // 18Mar2022, DIAB-88 colorStyle = "color:black !important;background-color:" + colorHexVal;
        // 18Mar2022, DIAB-88
        if (i > 1) {
          colorStyle = "color:white !important;background-color:" + colorHexVal;
        } else {
          colorStyle = "color:black !important;background-color:" + colorHexVal;
        }

        legendItemObj = {
          ColorStyle: colorStyle,
          DisplayLabel: displayLabel,
          ItemValue: legendItemVal,
          IsChecked: mActiveLegendItems.indexOf(displayLabel) > -1
        };
        legendItems.push(legendItemObj);
      }

      // No Data
      noDataColorHexVal = mConfig.DataParameters.getNoDataColorHexVal();
      legendItemObj = {
        ColorStyle:
          "color:black !important; background-color:" + noDataColorHexVal,
        DisplayLabel: "No Data",
        ItemValue: mNoDataFlagID.toString(), // 12Apr2021 DIAB-13
        IsChecked: mActiveLegendItems.indexOf(String(mNoDataFlagID)) > -1
      };
      legendItems.push(legendItemObj);

      // Suppressed Data
      suppressedDataColorHexVal =
        mConfig.DataParameters.getSuppressedDataColorHexVal();
      legendItemObj = {
        ColorStyle:
          "color:black !important; background-color:" +
          suppressedDataColorHexVal,
        DisplayLabel: "Suppressed",
        ItemValue: mSuppressedFlagID.toString(), // 12Apr2021 DIAB-13
        IsChecked: mActiveLegendItems.indexOf(String(mSuppressedFlagID)) > -1
      };
      legendItems.push(legendItemObj);

      legendTemplateConfig = {
        LegendDivID: "divMapLegend",
        LegendItems: legendItems
      };

      legendCompiledTemplateHTML = Handlebars.compile(legendTemplateHTML);
      legendGeneratedHTML = legendCompiledTemplateHTML(legendTemplateConfig);
      const $MapContainer = $("#" + mConfig.ParentID); // 25Feb2022
      $MapContainer.append(legendGeneratedHTML);
    }
  }

  // 12Apr2021 DIAB-13
  function updateData() {
    var val;
    mEstimateByStateID = {};
    mColorByStateID = {};

    mCurrentYearData.Data.forEach(function (d) {
      if (d.IsSuppressed) {
        val = mSuppressedFlagID;
      } else if (d.IsNoData) {
        val = mNoDataFlagID;
      } else {
        val = d.Value;
      }

      if (isValueInActiveLegend(val)) {
        mEstimateByStateID[+d.GeoID] = val;
        mColorByStateID[+d.GeoID] = d.Color_HexVal;
      } else {
        mEstimateByStateID[+d.GeoID] = mInActiveFlagID;
        mColorByStateID[+d.GeoID] = mInActiveColor;
      }
    });
  }
  function legendClickHandler(evt) {
    // 12Apr2021  var legendItemLabel;
    var index;
    var itemLabel;
    var $chkBxObj;

    // 12Apr2021 DIAB-13
    if (
      evt.target &&
      evt.target.nodeName.toLowerCase() === "input".toLowerCase()
    ) {
      itemLabel = $(evt.target).val();
      $chkBxObj = $(evt.target);
      // 24Feb2022 } else if (evt.target.className === "dataBox") {
    } else if ($(evt.target).hasClass("da-maplegend-box")) {
      itemLabel = $(evt.target).find("input").val();
      $chkBxObj = $(evt.target).find("input");
    }
    index = mActiveLegendItems.indexOf(itemLabel);
    if (index > -1) {
      mActiveLegendItems.splice(index, 1);
      $chkBxObj.prop("checked", false);
    } else {
      // 12Apr2021 DIAB-13  mActiveLegendItems.push(legendItemLabel);
      mActiveLegendItems.push(itemLabel);
      $chkBxObj.prop("checked", true);
    }

    mMediator.broadcast("ActiveLegendItemsResetEvent", [mActiveLegendItems]);
    mMediator.broadcast("UpdateHeatMapOnActiveLegendItemsChangeEvent", [
      mActiveLegendItems
    ]); // 11Apr2019

    // 12Apr2021 setData();
    updateData(); // 12Apr2021 DIAB-13
    renderMap();
  }

  function removeEventListeners() {
    $(document).off("click", "#divMapLegend");
    window.removeEventListener("resize", createMap);
    publicAPI["on" + mConfig.ChangeEventTypesList.Viz1ContainerResizedEvent] =
      function () {
        // empty function
      };
  }

  function addEventListeners() {
    removeEventListeners();
    $(document).on("click", "#divMapLegend", legendClickHandler);
    window.addEventListener("resize", createMap);
    publicAPI["on" + mConfig.ChangeEventTypesList.Viz1ContainerResizedEvent] =
      function () {
        createMap();
      };
  }

  publicAPI.setMediator = function (m) {
    mMediator = m;
  };

  publicAPI.getMediator = function () {
    return mMediator;
  };

  function getCSVTitle(parameterLabels) {
    var csvTitle = "";
    if (
      parameterLabels.MeasureName === "Age" ||
      parameterLabels.DataTypeLabel === "NumberValue"
    ) {
      csvTitle =
        parameterLabels.IndicatorName +
        "; " +
        parameterLabels.SubMeasureLabel +
        " (" +
        parameterLabels.MeasureName +
        "); " +
        parameterLabels.DataSetLabel +
        "; " +
        parameterLabels.DataTypeLabel +
        "; " +
        parameterLabels.SuffixLabel +
        parameterLabels.Year;
    } else {
      csvTitle =
        parameterLabels.IndicatorName +
        "; " +
        parameterLabels.SubMeasureLabel +
        " (" +
        parameterLabels.MeasureName +
        "); " +
        parameterLabels.DataSetLabel +
        "; " +
        parameterLabels.AgeClassificationType +
        " " +
        parameterLabels.DataTypeLabel +
        "; " +
        parameterLabels.SuffixLabel +
        parameterLabels.Year;
    }
    return csvTitle;
  }

  function getCSVColumns(parameterLabels, dataParametersObj) {
    var csvColumns;
    var dataType;
    dataType = dataParametersObj.getDataType();
    if (dataType === "NumberValue") {
      csvColumns = "State," + parameterLabels.DataTypeLabel;
    } else {
      csvColumns =
        "State," + parameterLabels.DataTypeLabel + ",Lower Limit, Upper Limit";
    }

    return csvColumns;
  }

  function addMedianDataRow(csvArray) {
    if (
      mConfig.DataParameters.getDataType() !== "NumberValue" &&
      mCurrentYearAllStatesMedianData
    ) {
      csvArray.push(
        mAllYearsData.AllStatesMedianData.DataTypeLabel +
          "," +
          mCurrentYearAllStatesMedianData.Value +
          "," +
          mCurrentYearAllStatesMedianData.LowerLimit +
          "," +
          mCurrentYearAllStatesMedianData.UpperLimit
      );
    }
    return csvArray;
  }

  function addCSVDataRows(csvArray) {
    var val;
    var displayVal;
    var lowerLimit;
    var upperLimit;

    if (!mCurrentYearData) {
      return csvArray;
    }
    mCurrentYearData.Data.forEach(function (d) {
      if (d.IsSuppressed) {
        val = mSuppressedFlagID;
        displayVal = "Suppressed";
        lowerLimit = "Suppressed";
        upperLimit = "Suppressed";
      } else if (d.IsNoData) {
        val = mNoDataFlagID;
        displayVal = "No Data";
        lowerLimit = "No Data";
        upperLimit = "No Data";
      } else {
        val = d.Value;
        displayVal = val;
        lowerLimit = d.LowerLimit;
        upperLimit = d.UpperLimit;
      }

      if (isValueInActiveLegend(val)) {
        if (mConfig.DataParameters.getDataType() === "NumberValue") {
          csvArray.push(d.GeoLabel + "," + displayVal);
        } else {
          csvArray.push(
            d.GeoLabel + "," + displayVal + "," + lowerLimit + "," + upperLimit
          );
        }
      }
    });

    return csvArray;
  }

  function replaceSpecialCharacter(addChar, removeChar, text) {
    var strippedText;
    var regex = new RegExp(removeChar, "g");
    strippedText = text.replace(regex, addChar);
    return strippedText;
  }

  function getParameterLabels(dataParametersObj) {
    var processedParameterLabelsObj;
    var currentYear;
    var currentYearLabel;
    currentYear = dataParametersObj.getYear();
    currentYearLabel = mAllYearsData.YearsList.filter(function (a) {
      return a.YearID === currentYear;
    })[0].YearLabel;

    processedParameterLabelsObj = {
      IndicatorName: replaceSpecialCharacter(
        "-",
        ",",
        dataParametersObj.getIndicatorName()
      ),
      DataTypeLabel: replaceSpecialCharacter(
        "",
        ",",
        dataParametersObj.getDataTypeLabel()
      ),
      DataSetLabel: replaceSpecialCharacter(
        "-",
        ",",
        dataParametersObj.getDatasetLabel()
      ),
      MeasureName: replaceSpecialCharacter(
        "-",
        ",",
        dataParametersObj.getMeasureName()
      ),
      SubMeasureLabel: replaceSpecialCharacter(
        "-",
        ",",
        dataParametersObj.getSubmeasureLabel()
      ),
      AgeClassificationType: dataParametersObj.getAgeClassificationType(),
      Year: currentYearLabel,
      SuffixLabel: "U.S. States; "
    };

    return processedParameterLabelsObj;
  }

  function downloadCSV() {
    var csvArray = [];
    var downloadFileName;
    var csvDate;
    var csvFooter =
      "US Diabetes Surveillance System; www.cdc.gov/diabetes/data; Division of Diabetes Translation - Centers for Disease Control and Prevention.";
    var parameterLabels; // 21Mar2019
    var csvTitle; // 21Mar2019
    var csvColumns; // 21Mar2019
    var csvFileDownload; // 26Jul2020
    var csvConfig; // 26Jul2020

    parameterLabels = getParameterLabels(mConfig.DataParameters);
    csvTitle = getCSVTitle(parameterLabels);
    csvArray.push(csvTitle);
    csvDate = "Data downloaded on " + mHelperUtil.getTodaysDate();
    csvArray.push(csvDate);
    csvColumns = getCSVColumns(parameterLabels, mConfig.DataParameters);
    csvArray.push(csvColumns);
    csvArray = addMedianDataRow(csvArray);
    csvArray = addCSVDataRows(csvArray);
    csvArray.push(csvFooter);
    // 26Jul2020 csvArray = csvArray.join("\\n");
    csvArray = csvArray.join("\r\n");
    downloadFileName = "DiabetesAtlas_AllStatesMapData.csv";

    // 26Jul2020
    csvFileDownload = new CSVFileDownload();
    csvConfig = {
      CSVContent: csvArray,
      Filename: downloadFileName
    };
    csvFileDownload.downloadCSV(csvConfig);
  }

  /*  // 01Mar2022
   function getLegendSVGHTML() {
    var label;
    var noDataLabel;
    var suppressedDataLabel;
    var colorHexVal;
    var rectX;
    var rectY;
    var textX;
    var textY;
    var rectWidth;
    var rectHeight;
    var svgContainer;
    var svgHTML;
    var noDataColorHexVal;
    var suppressedDataColorHexVal;
    var rectYOffset = 25;
    var textYOffset = 25;
    var fontSize;

    $("#svgLegend").empty();
    svgContainer = d3.select("#svgLegend");

    rectWidth = 25;
    rectHeight = 25;
    rectX = 0;
    rectY = 0;
    textX = 28;
    textY = 15;
    fontSize = 10;
    noDataColorHexVal = mConfig.DataParameters.getNoDataColorHexVal();
    suppressedDataColorHexVal =
      mConfig.DataParameters.getSuppressedDataColorHexVal();

    for (let i = 0; i < mLegendData.length; i += 1) {
      label = mLegendData[i].min + " - " + mLegendData[i].max;
      colorHexVal = mLegendData[i].color_hexval;
      svgContainer
        .append("rect")
        .attr("x", rectX)
        .attr("y", rectY)
        .attr("width", rectWidth)
        .attr("height", rectHeight)
        .attr("stroke", "black")
        .attr("stroke-width", "1")
        .attr("fill", colorHexVal);

      svgContainer
        .append("text")
        .attr("x", textX)
        .attr("y", textY)
        .attr("font-family", "sans-serif")
        .attr("font-size", fontSize)
        .attr("fill", "#000000")
        .text(label);
      rectY += rectYOffset;
      textY += textYOffset;
    }

    // add 'No Data'
    noDataLabel = "No Data";
    svgContainer
      .append("rect")
      .attr("x", rectX)
      .attr("y", rectY)
      .attr("width", rectWidth)
      .attr("height", rectHeight)
      .attr("stroke", "black")
      .attr("stroke-width", "1")
      .attr("fill", noDataColorHexVal);

    svgContainer
      .append("text")
      .attr("x", textX)
      .attr("y", textY)
      .attr("font-family", "sans-serif")
      .attr("font-size", fontSize)
      .attr("fill", "#000000")
      .text(noDataLabel);

    rectY += rectYOffset;
    textY += textYOffset;

    // add 'Suppressed Data'
    suppressedDataLabel = "Suppressed";
    svgContainer
      .append("rect")
      .attr("x", rectX)
      .attr("y", rectY)
      .attr("width", rectWidth)
      .attr("height", rectHeight)
      .attr("stroke", "black")
      .attr("stroke-width", "1")
      .attr("fill", suppressedDataColorHexVal);

    svgContainer
      .append("text")
      .attr("x", textX)
      .attr("y", textY)
      .attr("font-family", "sans-serif")
      .attr("font-size", fontSize)
      .attr("fill", "#000000")
      .text(suppressedDataLabel);

    $("#svgLegendParentDiv").width(rectWidth + 75);
    $("#svgLegendParentDiv").height(rectY + 25);

    svgHTML = d3
      .select("#svgLegendParentDiv")
      .select("svg")
      .attr("width", rectWidth + 75)
      .attr("height", rectY + 25)
      .attr("version", 1.1)
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .node().parentNode.innerHTML;

    svgHTML = svgHTML.trim().replace("\n", "");

    $("#svgLegendParentDiv").width(0); // reset hidden element to 0
    $("#svgLegendParentDiv").height(0);

    return svgHTML;
  } */

  /*  // 01Mar2022
  publicAPI.downloadPPT = function (token) {
    var canvasdata;
    var legendCanvasData;
    var canvas;
    var context;
    var legendSVGHTML;
    var style;
    // 20Mar2019  var rules;
    var svgDiv;
    var svgElem;
    var currentIndicatorName;
    var currentAgeClassificationType;
    var currentDataTypeLabel;
    var currentDatasetLabel;
    var currentMeasureName;
    var currentSubmeasureLabel;
    var currentYear;
    var customHeading;
    var pptFileName = "Map";
    var callType = "PowerPoint";
    var legendTitle;
    var currentDataType;
    var currentDataClassificationType;
    // 20Mar2019 var str;
    var scrubbedSVGElem;
    var currentYearLabel;
    var imageWidth = "960";
    var imageHeight = "700";
    var geoLabelText = ", U.S. States, "; // 20Mar2019
    var pptPostSubmitForm; // 22Jul2020
    var formConfig; // 22Jul2020
    var chartType = "AllStatesMap";

    // 19Mar2018
    $("#canvasImageCreation").attr("width", String(imageWidth) + "px");
    $("#canvasImageCreation").attr("height", String(imageHeight) + "px");
    // 17Nov2020 $("#divImageCreation svg").attr("width", String(imageWidth) + "px");
    // 17Nov2020 $("#divImageCreation svg").attr("height", String(imageHeight) + "px");

    // 11Nov2020 canvas = document.querySelector("canvas");
    canvas = document.getElementById("canvasImageCreation"); // 11Nov2020
    context = canvas.getContext("2d");

    // get legend canvas data
    legendSVGHTML = getLegendSVGHTML();
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvg(canvas, legendSVGHTML, {
      scaleWidth: 600,
      scaleHeight: 300,
      ignoreDimensions: true
    });
    legendCanvasData = canvas.toDataURL("image/png");
    legendCanvasData = legendCanvasData.replace(
      "/^data:image/png|jpg;base64",
      "/",
      ""
    );

    style = getSVGStyles(); // 20Mar2019

    // 19Mar2018
    renderMapForImageCreation(imageWidth, imageHeight);
    svgDiv = $("#divImageCreation svg");
    svgDiv.prepend("\n<style type='text/css'></style>");
    svgDiv.find("style").html("\n<![CDATA[" + style + "]]>\n");

    svgElem = d3
      .select("#divImageCreation")
      .select("svg")
      .attr("version", 1.1)
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .node().parentNode.innerHTML;

    context.clearRect(0, 0, canvas.width, canvas.height);

    scrubbedSVGElem = scrubSVG(svgElem);
    canvg(canvas, scrubbedSVGElem, {
      scaleWidth: canvas.width,
      scaleHeight: canvas.height,
      ignoreDimensions: true
    });

    canvasdata = canvas.toDataURL("image/png");
    canvasdata = canvasdata.replace("/^data:image/png|jpg;base64", "/", "");

    currentIndicatorName = mConfig.DataParameters.getIndicatorName();
    currentAgeClassificationType =
      mConfig.DataParameters.getAgeClassificationType();
    currentDataType = mConfig.DataParameters.getDataType();
    currentDataTypeLabel = mConfig.DataParameters.getDataTypeLabel();
    currentDatasetLabel = mConfig.DataParameters.getDatasetLabel();
    currentMeasureName = mConfig.DataParameters.getMeasureName();
    currentSubmeasureLabel = mConfig.DataParameters.getSubmeasureLabel();
    currentDataClassificationType =
      mConfig.DataParameters.getDataClassificationType();
    currentYear = mConfig.DataParameters.getYear();
    currentYearLabel = mAllYearsData.YearsList.filter(function (a) {
      return a.YearID === currentYear;
    })[0].YearLabel;

    // 08Apr2021 DIAB-23
    if (currentMeasureName === "Total") {
      customHeading =
        currentIndicatorName +
        ", " +
        currentMeasureName +
        ", " +
        currentDatasetLabel +
        ", " +
        currentAgeClassificationType +
        " " +
        currentDataTypeLabel +
        geoLabelText +
        currentYearLabel;
    } else if (
      currentMeasureName === "Age" ||
      currentDataType === "NumberValue"
    ) {
      customHeading =
        currentIndicatorName +
        ", " +
        currentSubmeasureLabel +
        " (" +
        currentMeasureName +
        "), " +
        currentDatasetLabel +
        ", " +
        currentDataTypeLabel +
        ", " +
        currentDataClassificationType +
        geoLabelText +
        currentYearLabel;
    } else {
      customHeading =
        currentIndicatorName +
        ", " +
        currentSubmeasureLabel +
        " (" +
        currentMeasureName +
        "), " +
        currentDatasetLabel +
        ", " +
        currentAgeClassificationType +
        " " +
        currentDataTypeLabel +
        geoLabelText +
        currentYearLabel;
    }

    legendTitle =
      currentDataTypeLabel + " ( " + currentDataClassificationType + " ) ";

    // 22Jul2020
    pptPostSubmitForm = new PPTPostSubmitForm();
    formConfig = {
      CallType: callType,
      ChartType: chartType,
      ChartTitle: customHeading,
      LegendTitle: legendTitle,
      IndicatorName: currentIndicatorName,
      Canvasdata: canvasdata,
      LegendCanvasData: legendCanvasData,
      PPTFileName: pptFileName,
      Token: token
    };
    pptPostSubmitForm.submit(formConfig);
  }; */

  function getLegendSVGHTML() {
    var colorHexVal;
    var label;
    var rectX = 0;
    var rectY = 0;
    var textX = 28;
    var textY = 15;
    var rectWidth = 25;
    var rectHeight = 25;
    var svgHTML;
    var rectYOffset = 25;
    var textYOffset = 25;

    const legendRects = mLegendData.map(function (d) {
      colorHexVal = d.color_hexval;
      label = d.min + " - " + d.max;
      return { ColorHexVal: colorHexVal, Label: label };
    });

    $("#svgLegend").empty();
    const svgContainer = d3.select("#svgLegend");

    legendRects.forEach(function (a) {
      svgContainer
        .append("rect")
        .attr("x", rectX)
        .attr("y", rectY)
        .attr("width", rectWidth)
        .attr("height", rectHeight)
        .attr("stroke", "black")
        .attr("stroke-width", "1")
        .attr("fill", a.ColorHexVal);

      svgContainer
        .append("text")
        .attr("x", textX)
        .attr("y", textY)
        .attr("font-family", "sans-serif")
        .attr("fill", "#000000")
        .attr("font-size", "10px") // 27Apr2022
        .text(a.Label);
      rectY += rectYOffset;
      textY += textYOffset;
    });

    // add 'No Data'
    const noDataLabel = "No Data";
    const noDataColorHexVal = mConfig.DataParameters.getNoDataColorHexVal();

    svgContainer
      .append("rect")
      .attr("x", rectX)
      .attr("y", rectY)
      .attr("width", rectWidth)
      .attr("height", rectHeight)
      .attr("stroke", "black")
      .attr("stroke-width", "1")
      .attr("fill", noDataColorHexVal);

    svgContainer
      .append("text")
      .attr("x", textX)
      .attr("y", textY)
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px") // 27Apr2022
      .attr("fill", "#000000")
      .text(noDataLabel);

    rectY += rectYOffset;
    textY += textYOffset;

    // add 'Suppressed Data'
    const suppressedDataLabel = "Suppressed";
    const suppressedDataColorHexVal =
      mConfig.DataParameters.getSuppressedDataColorHexVal();

    svgContainer
      .append("rect")
      .attr("x", rectX)
      .attr("y", rectY)
      .attr("width", rectWidth)
      .attr("height", rectHeight)
      .attr("stroke", "black")
      .attr("stroke-width", "1")
      .attr("fill", suppressedDataColorHexVal);

    svgContainer
      .append("text")
      .attr("x", textX)
      .attr("y", textY)
      .attr("font-family", "sans-serif")
      .attr("fill", "#000000")
      .attr("font-size", "10px") // 27Apr2022
      .text(suppressedDataLabel);

    // 27Apr2022 $("#svgLegendParentDiv").width(rectWidth + 75);
    // 27Apr2022  $("#svgLegendParentDiv").height(rectY + 25);

    svgHTML = d3
      .select("#svgLegendParentDiv")
      .select("svg")
      // 27Apr2022 .attr("width", rectWidth + 75)
      // 27Apr2022 .attr("height", rectY + 25)
      .attr("width", rectWidth + 150) // 27Apr2022
      .attr("height", rectY) // 27Apr2022
      .attr("version", 1.1)
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .node().parentNode.innerHTML;

    svgHTML = svgHTML.trim().replace("\n", "");

    $("#svgLegendParentDiv").width(0); // reset hidden element to 0
    $("#svgLegendParentDiv").height(0);

    return svgHTML;
  }

  // 27Apr2022
  function setCanvasImageCreationToDefault() {
    d3.select("#canvasImageCreation")
      .attr("width", "960px")
      .attr("height", "700px")
      .attr("style", "display:none");
  }

  function getLegendCanvasData() {
    var legendCanvasData;
    const canvas = document.getElementById("canvasImageCreation"); // 11Nov2020
    const context = canvas.getContext("2d");
    const legendSVGHTML = getLegendSVGHTML();

    setCanvasImageCreationToDefault(); // 27Apr2022
    context.clearRect(0, 0, canvas.width, canvas.height);
    /*  // 27Apr2022
     canvg(canvas, legendSVGHTML, {
      scaleWidth: 750,
      scaleHeight: 200,
      ignoreDimensions: true
    }); */
    canvg(canvas, legendSVGHTML); // 27Apr2022
    legendCanvasData = canvas.toDataURL("image/png");
    legendCanvasData = legendCanvasData.replace(
      "/^data:image/png|jpg;base64",
      "/",
      ""
    );
    return legendCanvasData;
  }

  function getStyle() {
    var style;

    const styleSheets = [...document.styleSheets];
    style = styleSheets
      .filter(function (d) {
        return d.href !== null;
      })
      .filter(function (a) {
        const str = a.href.split("/");
        return (
          str[str.length - 1] === "common." + mConfig.FileHashID + ".css" ||
          str[str.length - 1] ===
            "surveillance." + mConfig.FileHashID + ".css" ||
          str[str.length - 1] === "bootstrap.min.css"
        );
      })
      .map(function (b) {
        return [...b.cssRules]
          .map(function (rule) {
            return rule.cssText;
          })
          .join("");
      })
      .filter(Boolean)
      .join("\n");

    return style;
  }

  function scrubSVG(svgElem) {
    var xmlDoc = $.parseXML(svgElem);
    var $xml = $(xmlDoc);

    $xml.find("rect").each(function (j, rect) {
      $.each(rect.attributes, function (i, attrib) {
        if (attrib.name === "height" && +attrib.value < 0) {
          $(rect).remove();
        }
      });
    });

    return xmlDoc;
  }

  function getPPTHeading() {
    const currentIndicatorName = mConfig.DataParameters.getIndicatorName();
    const currentAgeClassificationType =
      mConfig.DataParameters.getAgeClassificationType();
    const currentDataType = mConfig.DataParameters.getDataType();
    const currentDataTypeLabel = mConfig.DataParameters.getDataTypeLabel();
    const currentDatasetLabel = mConfig.DataParameters.getDatasetLabel();
    const currentMeasureName = mConfig.DataParameters.getMeasureName();
    const currentSubmeasureLabel = mConfig.DataParameters.getSubmeasureLabel();
    const currentDataClassificationType =
      mConfig.DataParameters.getDataClassificationType();
    const currentYear = mConfig.DataParameters.getYear();
    const currentYearLabel = mAllYearsData.YearsList.find(function (a) {
      return a.YearID === currentYear;
    }).YearLabel;
    const geoLabelText = ", U.S. States, "; // 20Mar2019

    // DIAB-23
    const heading1 =
      currentIndicatorName +
      ", " +
      currentMeasureName +
      ", " +
      currentDatasetLabel +
      ", " +
      currentAgeClassificationType +
      " " +
      currentDataTypeLabel +
      geoLabelText +
      currentYearLabel;

    const heading2 =
      currentIndicatorName +
      ", " +
      currentSubmeasureLabel +
      " (" +
      currentMeasureName +
      "), " +
      currentDatasetLabel +
      ", " +
      currentDataTypeLabel +
      ", " +
      currentDataClassificationType +
      geoLabelText +
      currentYearLabel;

    const heading3 =
      currentIndicatorName +
      ", " +
      currentSubmeasureLabel +
      " (" +
      currentMeasureName +
      "), " +
      currentDatasetLabel +
      ", " +
      currentAgeClassificationType +
      " " +
      currentDataTypeLabel +
      geoLabelText +
      currentYearLabel;

    if (currentMeasureName === "Total") {
      return heading1;
    }
    if (currentMeasureName === "Age" || currentDataType === "NumberValue") {
      return heading2;
    }

    return heading3;
  }

  function downloadPPT(token) {
    const currentDataTypeLabel = mConfig.DataParameters.getDataTypeLabel();
    const currentDataClassificationType =
      mConfig.DataParameters.getDataClassificationType();

    const legendCanvasData = getLegendCanvasData();
    const style = getStyle();

    const svgDiv = $("#" + mConfig.MapID + " svg");
    svgDiv.prepend("\n<style type='text/css'></style>");
    svgDiv.find("style").html("\n<![CDATA[" + style + "]]>\n");

    const svgElem = d3
      .select("#" + mConfig.MapID)
      .select("svg")
      .attr("version", 1.1)
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .node().parentNode.innerHTML;

    setCanvasImageCreationToDefault(); // 27Apr2022
    const canvas = document.getElementById("canvasImageCreation"); // 11Nov2020
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    const scrubbedSVGElem = scrubSVG(svgElem);
    canvg(canvas, scrubbedSVGElem);
    let canvasdata = canvas.toDataURL("image/png");
    canvasdata = canvasdata.replace("/^data:image/png|jpg;base64", "/", "");

    const pptHeading = getPPTHeading();
    const legendTitle =
      currentDataTypeLabel + " ( " + currentDataClassificationType + " ) ";
    const pptFileName = "DiabetesAtlas_AllStatesMap";
    const callType = "PowerPoint";
    const currentIndicatorName = mConfig.DataParameters.getIndicatorName();
    const chartType = "AllStatesMap";
    const pptPostSubmitForm = new PPTPostSubmitForm();
    const formConfig = {
      CallType: callType,
      ChartType: chartType,
      ChartTitle: pptHeading,
      LegendTitle: legendTitle,
      IndicatorName: currentIndicatorName,
      Canvasdata: canvasdata,
      LegendCanvasData: legendCanvasData,
      PPTFileName: pptFileName,
      Token: token
    };
    pptPostSubmitForm.submit(formConfig);
    setCanvasImageCreationToDefault(); // 27Apr2022
  }

  function setFooter() {
    var methodChangeURL;
    var methodChangeDisplayText;
    var methodChangeInfo;
    var $FootnotesDiv;

    $FootnotesDiv = $("#" + mConfig.MapID + "Footer");
    $FootnotesDiv.empty();

    methodChangeInfo = mConfig.BusinessData.MethodChangeInfo;

    if (methodChangeInfo.IsMethodChange) {
      methodChangeURL = methodChangeInfo.MethodChangeURL;
      methodChangeDisplayText =
        methodChangeInfo.HeadingText +
        " " +
        methodChangeInfo.DetailText.toLowerCase();
      $FootnotesDiv.append('<a id="lnkTxtMethodChange"></a>');
      $FootnotesDiv.find("a").last().attr("href", methodChangeURL);
      $FootnotesDiv
        .find("a")
        .last()
        .attr("target", "_blank")
        .attr("rel", "noreferrer noopener");
      $FootnotesDiv.find("a").last().html(methodChangeDisplayText);
    }
  }

  function addFooter() {
    if (mConfig.HasFooter) {
      $("#" + mConfig.MapID + "Footer").remove();
      $("#" + mConfig.ParentID).append(
        "<div id='" +
          mConfig.MapID +
          "Footer' class='w-100 p-2 small text-center'></div>"
      );
      setFooter();
    }
  }

  function createMap() {
    setMapSize();
    setProjectionScaleTranslation();
    addSVG();
    setData();
    renderMap();
    loadSlider();
    loadMapLegend();
    addFooter();
  }

  /*  // 24Feb2022
  publicAPI.reload = function () {
    $("#" + mConfig.ContainerID).empty();
    setMapSize();
    setProjectionScaleTranslation();
    addSVG();
    setData();
    renderMap();
    loadSlider();
    loadMapLegend();
  }; */

  publicAPI.dispose = function () {
    removeEventListeners();
    if (mSliderMod) {
      mSliderMod.dispose();
    }
  };

  publicAPI.downloadCSV = function () {
    downloadCSV();
  };

  publicAPI.downloadPPT = function (token) {
    downloadPPT(token);
  };

  publicAPI.update = function (updateConfig) {
    var currentYear;
    var sliderConfig;

    mConfig.DataParameters = updateConfig.DataParameters;
    mConfig.BusinessData = updateConfig.BusinessData;
    mActiveLegendItems = updateConfig.ActiveLegendItems;
    mSelectedStatesList = updateConfig.SelectedStatesList;

    // 02Mar2022 mMapSVG = d3.select("#mapSVGDiv").select("svg"); // 19Mar2019
    // 02Mar2022   mMapSVGGroup = mMapSVG.select("g"); // 19Mar2019

    setData();
    renderMap();
    loadMapLegend();
    addFooter(); // 24Feb2022
    currentYear = mConfig.DataParameters.getYear();
    if (mSliderMod) {
      sliderConfig = {
        YearsList: mAllYearsData.YearsList,
        CurrentYear: currentYear // 31Jan2018
      };
      mSliderMod.update(sliderConfig);
    } else {
      loadSlider();
    }
    mSliderMod.updateCurrentYear(currentYear);
  };

  publicAPI.onMapSliderChangeEvent = function (newYearObj) {
    var currentDataClassificationID;
    var quartilesID = 1500;

    currentDataClassificationID =
      mConfig.DataParameters.getDataClassificationID();
    if (currentDataClassificationID === quartilesID) {
      mActiveLegendItems = [];
    }
    mConfig.DataParameters.setYear(newYearObj.YearID);

    setData();
    renderMap();
    loadMapLegend();
    addFooter(); // 24Feb2022

    mSliderMod.moveSliderHandleToYearID(newYearObj.YearID); // 26Mar2019
  };

  publicAPI.onClearAllSelections = function (updatedSelectedStatesList) {
    mSelectedStatesList = updatedSelectedStatesList;
    setData();
    renderMap();
  };

  publicAPI.init = function (config) {
    mConfig = config;
    mActiveLegendItems = mConfig.ActiveLegendItems;
    mSelectedStatesList = mConfig.SelectedStatesList;
    const $MapContainer = $("#" + mConfig.ParentID);
    $MapContainer.empty();
    mHelperUtil = new HelperUtil();
    registerHandlebarsHelperMethods();
    addEventListeners();
    loadMapGeometry().then(createMap);
  };
  return publicAPI;
}
export default AllStatesMap;
