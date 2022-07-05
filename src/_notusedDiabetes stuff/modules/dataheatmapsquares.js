import $ from "jquery";
import canvg from "canvgModule";
import * as d3 from "../lib/d3_v4-min";
import HelperUtil from "../modules/helperutils";
import CSVFileDownload from "../modules/csvFileDownload";
import PPTPostSubmitForm from "../modules/pptPostSubmitForm";

function DataHeatMapSquares() {
  var publicAPI = {};
  var mConfig;
  var mActiveLegendItems;
  var mChartSVG;
  var mChartSVGGroup;
  var mNumOfCols;
  var mNumOfRows;
  var mMediator;
  var mCellSizeConfig;
  var mChartData = [];
  var mChartWidth;
  var mChartHeight;
  var mMargin;
  var mLegendData;
  var mAllYearsData;
  var mNoDataFlagID = -1;
  var mSuppressedFlagID = -2;
  var mInActiveFlagID = -3;
  var mInActiveColor = "#FFFFFF";
  var mHelperUtil;
  var mContainerWidth; // 09Oct2020
  var mAgeMeasureID = 41;
  var mTotalMeasureID = 40;
  var mSelectedStatesList; // 26Apr2022

  publicAPI.setMediator = function (m) {
    mMediator = m;
  };

  publicAPI.getMediator = function () {
    return mMediator;
  };

  function setChartSize() {
    mMargin = {
      top: 50,
      right: 10,
      bottom: 15,
      left: 30
    };
    mChartWidth =
      mCellSizeConfig.CellSize * mNumOfCols + mMargin.left + mMargin.right;
    mChartHeight =
      mCellSizeConfig.CellSize * mNumOfRows + mMargin.top + mMargin.bottom;
  }

  function addSVG() {
    const $HeatmapParentContainer = $("#" + mConfig.ParentID);
    $HeatmapParentContainer.append(
      "<div id='" +
        mConfig.HeatMapID +
        "' class='d-flex justify-content-center'></div>"
    );

    mChartSVG = d3
      .select("#" + mConfig.HeatMapID)
      .append("svg")
      .attr("width", mChartWidth)
      .attr("height", mChartHeight);

    mChartSVGGroup = mChartSVG
      .append("g")
      .attr("transform", "translate(" + mMargin.left + "," + mMargin.top + ")");
  }

  function defineCellSizeConfig() {
    mCellSizeConfig = {};
    if (mContainerWidth < 300) {
      mCellSizeConfig = {
        CellSize: 8,
        CellSizeClass: "HeatMapLabelSmall"
      };
    } else if (mContainerWidth >= 300 && mContainerWidth < 550) {
      mCellSizeConfig = {
        CellSize: 10,
        CellSizeClass: "HeatMapLabelMedium"
      };
    } else if (mContainerWidth >= 550) {
      mCellSizeConfig = {
        CellSize: 16,
        CellSizeClass: "HeatMapLabelLarge"
      };
    }
  }

  function getAllYearsDataForTotalMeasure() {
    const currentMeasureData = mConfig.BusinessData.MeasureData;

    const currentAgeClassificationType =
      mConfig.DataParameters.getAgeClassificationType();
    const currentDataClassificationType =
      mConfig.DataParameters.getDataClassificationType();

    const ageClassificationTypeData =
      currentAgeClassificationType === "Age-Adjusted"
        ? currentMeasureData.Data.AgeAdjustedData
        : currentMeasureData.Data.CrudeData;

    return currentDataClassificationType === "Natural Breaks"
      ? ageClassificationTypeData.NaturalBreaksData
      : ageClassificationTypeData.QuartilesData;
  }

  function getAllYearsDataForAgeMeasure() {
    const currentMeasureData = mConfig.BusinessData.MeasureData;
    const currentSubmeasureID = mConfig.DataParameters.getSubmeasureID();
    const currentDataClassificationType =
      mConfig.DataParameters.getDataClassificationType();

    const currentSubmeasureData = currentMeasureData.Data.filter(function (a) {
      return a.SubmeasureID === currentSubmeasureID;
    })[0];

    return currentDataClassificationType === "Natural Breaks"
      ? currentSubmeasureData.NaturalBreaksData
      : currentSubmeasureData.QuartilesData;
  }

  function getAllYearsDataForNonTotalAndAgeMeasure() {
    const currentMeasureData = mConfig.BusinessData.MeasureData;
    const currentSubmeasureID = mConfig.DataParameters.getSubmeasureID();

    const currentAgeClassificationType =
      mConfig.DataParameters.getAgeClassificationType();
    const currentDataClassificationType =
      mConfig.DataParameters.getDataClassificationType();

    const ageClassificationTypeData =
      currentAgeClassificationType === "Age-Adjusted"
        ? currentMeasureData.Data.AgeAdjustedData
        : currentMeasureData.Data.CrudeData;

    const currentSubmeasureData = ageClassificationTypeData.filter(function (
      a
    ) {
      return a.SubmeasureID === currentSubmeasureID;
    })[0];

    return currentDataClassificationType === "Natural Breaks"
      ? currentSubmeasureData.NaturalBreaksData
      : currentSubmeasureData.QuartilesData;
  }

  function getAllYearsData() {
    var allYearsData = [];

    const currentMeasureID = mConfig.DataParameters.getMeasureID();

    if (currentMeasureID === mTotalMeasureID) {
      allYearsData = getAllYearsDataForTotalMeasure();
    } else if (currentMeasureID === mAgeMeasureID) {
      allYearsData = getAllYearsDataForAgeMeasure();
    } else {
      allYearsData = getAllYearsDataForNonTotalAndAgeMeasure();
    }

    return allYearsData;
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

  // 28Feb2022
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

  // 28Feb2022
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

  publicAPI.setMediator = function (m) {
    mMediator = m;
  };

  publicAPI.getMediator = function () {
    return mMediator;
  };

  function highlightCurrentYearLabel(newYear) {
    d3.select(".colLabelRectG")
      .selectAll("rect")
      .each(function (d) {
        if (d.YearID === newYear) {
          // 26Apr2022 d3.select("#colLabelRect" + d.YearID).style("fill", "#2b9eff");
          d3.select("#colLabelRect" + d.YearID).style("fill", "#003942"); // 26Apr2022
          d3.select("#colLabelText" + d.YearID).classed("text-selected", true);
        } else {
          d3.select("#colLabelRect" + d.YearID).style("fill", "none");
          d3.select("#colLabelText" + d.YearID).classed("text-selected", false);
        }
      });
  }

 

  // 11Feb2021
  function getLegendData() {
    var legendData;
    // ! legend data will be same for all years.

    for (let i = 0; i < mAllYearsData.Data.length; i += 1) {
      const elem = mAllYearsData.Data[i].LegendData;
      if (elem.length) {
        legendData = elem;
        break;
      }
    }

    return legendData;
  }

  function setLegendData() {
    mLegendData = getLegendData(); // 11Feb2021

    // ! mActiveLegendItems.length < 3 because when a year has 'No Data' or 'Suppressed' for all states
    // !  then mActiveLegendItems = [ -1,-2];
    if (mActiveLegendItems.length < 3) {
      mActiveLegendItems = getDefaultActiveLegendItems();
      mMediator.broadcast("ActiveLegendItemsResetEvent", [mActiveLegendItems]);
    }
  }

  function getValues(dataObj) {
    var val;
    var displayVal;
    var lowerLimit;
    var upperLimit;
    var chartDataObj = {};

    if (dataObj.IsSuppressed) {
      val = mSuppressedFlagID;
      displayVal = "Suppressed";
      lowerLimit = "Suppressed";
      upperLimit = "Suppressed";
    } else if (dataObj.IsNoData) {
      val = mNoDataFlagID;
      displayVal = "No Data";
      lowerLimit = "No Data";
      upperLimit = "No Data";
    } else {
      val = dataObj.Value;
      displayVal = val;
      lowerLimit = dataObj.LowerLimit;
      upperLimit = dataObj.UpperLimit;
    }

    if (isValueInActiveLegend(val)) {
      chartDataObj.Value = displayVal;
      chartDataObj.LowerLimit = lowerLimit;
      chartDataObj.UpperLimit = upperLimit;
      chartDataObj.Color_HexVal = dataObj.Color_HexVal;
    } else {
      chartDataObj.Value = mInActiveFlagID;
      chartDataObj.LowerLimit = null;
      chartDataObj.UpperLimit = null;
      chartDataObj.Color_HexVal = mInActiveColor;
    }

    return chartDataObj;
  }

  function setData() {
    var stateIdx;
    var yearIdx;
    mChartData = [];
    mAllYearsData = getAllYearsData();
    mNumOfCols = mAllYearsData.YearsList.length;
    mSelectedStatesList = mConfig.SelectedStatesList; // 26Apr2022
    setLegendData();
    if (!mActiveLegendItems.length) {
      mActiveLegendItems = getDefaultActiveLegendItems();
    }

    // 28Feb2022
    const stateIdxArr = mConfig.StatesList.map(function (d) {
      return d.SABBR;
    });
    const yearIdxArr = mAllYearsData.YearsList.map(function (y) {
      return y.YearID;
    });

    // CODE SNIPPET - Nested loop
    const data = mAllYearsData.Data.map(function (d0) {
      yearIdx = yearIdxArr.indexOf(d0.YearID);

      return d0.Data.map(function (d1) {
        stateIdx = stateIdxArr.indexOf(d1.GeoABBR);

        const dataObj = {
          row: stateIdx,
          col: yearIdx,
          YearID: d0.YearID,
          YearLabel: mAllYearsData.YearsList.find(function (a) {
            return a.YearID === d0.YearID;
          }).YearLabel,
          StateName: d1.GeoLabel
        };
        const valuesObj = getValues(d1);
        dataObj.Value = valuesObj.Value;
        dataObj.LowerLimit = valuesObj.LowerLimit;
        dataObj.UpperLimit = valuesObj.UpperLimit;
        dataObj.Color_HexVal = valuesObj.Color_HexVal;
        return dataObj;
      });
    });

    mChartData = [].concat(...data);
  }

  function getTooltipText(d) {
    var measureName;
    var subMeasureLabel;
    var h5Txt;
    var dataTypeLabel;
    var val;

    measureName = mConfig.DataParameters.getMeasureName();
    subMeasureLabel = mConfig.DataParameters.getSubmeasureLabel();
    dataTypeLabel = mConfig.DataParameters.getDataTypeLabel();

    // 13Feb2018
    // TODO: Investigate this problem
    // For unknown reason, sometimes the 'd.Value' property points to an old value and is not properly refreshed, so need to get that value directly from the attached data array.
    // Might need to change 'Value' property name to something else, since it might be a keyword for D3 or Bootstrap.
    val = mChartData.filter(function (a) {
      return a.YearID === d.YearID && a.StateName === d.StateName;
    })[0].Value;

    if (measureName === "Total") {
      h5Txt = "<h5>" + subMeasureLabel + " for " + d.YearLabel + "</h5>";
    } else {
      h5Txt =
        "<h5>" +
        subMeasureLabel +
        " (" +
        measureName +
        ") for " +
        d.YearLabel +
        "</h5>";
    }

    h5Txt =
      '<div class="popup">' +
      h5Txt +
      "<span><label style='font-size:14px;;font-weight:bold'>" +
      dataTypeLabel +
      "</label> : <label style='font-size:25px'>" +
      val +
      "</label></span>" +
      "</div>";

    return h5Txt;
  }

  function highlightSelectedStatesLabel() {
    d3.select(".rowLabelRectG")
      .selectAll("rect")
      .each(function (d) {
        if (mSelectedStatesList.indexOf(+d.SC) !== -1) {
          $("#rowLabelRect_" + +d.SC).addClass("active");
        } else {
          $("#rowLabelRect_" + +d.SC).removeClass("active");
        }
      });
  }

  function renderChart() {
    var rowLabelsG;
    var colLabelsRectG;
    var colLabelsTextG;
    var cellG;
    var rowLabelsRectG;

    // ROW LABELS RECTANGLES  // 26Apr2022
    if (!$(".rowLabelRectG").length) {
      rowLabelsRectG = mChartSVGGroup
        .append("g")
        .attr("class", "rowLabelRectG")
        .selectAll(".rowLabelRect")
        .data(mConfig.StatesList);
    } else {
      rowLabelsRectG = d3
        .select(".rowLabelRectG")
        .selectAll(".rowLabelRect")
        .data(mConfig.StatesList);
    }

    // EXIT old elements  // 26Apr2022
    rowLabelsRectG
      .exit()
      .attr("class", function (d, i) {
        return "rowLabelRect r" + i;
      })
      .style("fill-opacity", 0)
      .remove();

    // UDPATE old elements  // 26Apr2022
    rowLabelsRectG
      .attr("class", function (d, i) {
        return "rowLabelRect r" + i;
      })
      .attr("id", function (d) {
        return "rowLabelRect_" + +d.SC;
      })
      .attr("x", 0)
      .attr("y", function (d, i) {
        return i * mCellSizeConfig.CellSize;
      })
      .attr("transform", "translate(-21,0)")
      .attr("width", 15)
      .attr("height", mCellSizeConfig.CellSize)
      .style("fill", "none");

    // ENTER new elements  // 26Apr2022
    rowLabelsRectG
      .enter()
      .append("rect")
      .attr("class", function (d, i) {
        return "rowLabelRect r" + i;
      })
      .attr("id", function (d) {
        return "rowLabelRect_" + +d.SC;
      })
      .attr("x", 0)
      .attr("y", function (d, i) {
        return i * mCellSizeConfig.CellSize;
      })
      .attr("transform", "translate(-21,0)")
      .attr("width", 15)
      .attr("height", mCellSizeConfig.CellSize)
      .style("fill", "none");

    // ROW LABELS TEXT
    if (!$(".rowLabelG").length) {
      rowLabelsG = mChartSVGGroup
        .append("g")
        .attr("class", "rowLabelG")
        .selectAll(".rowLabel")
        .data(mConfig.StatesList);
    } else {
      rowLabelsG = d3
        .select(".rowLabelG")
        .selectAll(".rowLabel")
        .data(mConfig.StatesList);
    }

    // UPDATE old elements
    rowLabelsG
      .attr("class", function (d, i) {
        // 26Apr2022 return mCellSizeConfig.CellSizeClass + " rowLabel r" + i;
        // 26Apr2022
        const geoIDIndex = mSelectedStatesList.indexOf(+d.SC);
        if (geoIDIndex !== -1) {
          return mCellSizeConfig.CellSizeClass + " active rowLabel r" + i;
        }
        return mCellSizeConfig.CellSizeClass + " rowLabel r" + i;
      })
      .attr("id", function (d) {
        return "state_" + +d.SC; // 26Apr2022
      })
      .text(function (d) {
        // 5Nov2018  return d.StateABBR;
        return d.SABBR;
      })
      .style("text-anchor", "end");

    // ENTER new elements
    rowLabelsG
      .enter()
      .append("text")
      .attr("class", function (d, i) {
        // 26Apr2022 return mCellSizeConfig.CellSizeClass + " rowLabel r" + i;
        // 26Apr2022
        const geoIDIndex = mSelectedStatesList.indexOf(+d.SC);
        if (geoIDIndex !== -1) {
          return mCellSizeConfig.CellSizeClass + " active rowLabel r" + i;
        }
        return mCellSizeConfig.CellSizeClass + " rowLabel r" + i;
      })
      .attr("id", function (d) {
        return "state_" + +d.SC; // 26Apr2022
      })
      .text(function (d) {
        return d.SABBR;
      })
      .attr("x", 0)
      .attr("y", function (d, i) {
        return i * mCellSizeConfig.CellSize;
      })
      .style("text-anchor", "end")
      .attr("transform", "translate(-7," + mCellSizeConfig.CellSize / 1.5 + ")")
      .on("mouseover", function (d) {
        d3.select(this).classed("text-hover", true);
      })
      .on("mouseout", function (d) {
        d3.select(this).classed("text-hover", false);
      });

    // COLUMN LABELS RECTANGLES
    if (!$(".colLabelRectG").length) {
      colLabelsRectG = mChartSVGGroup
        .append("g")
        .attr("class", "colLabelRectG")
        .selectAll(".colLabelRect")
        .data(mAllYearsData.YearsList);
    } else {
      colLabelsRectG = d3
        .select(".colLabelRectG")
        .selectAll(".colLabelRect")
        .data(mAllYearsData.YearsList);
    }
    // EXIT old elements
    colLabelsRectG
      .exit()
      .attr("class", function (d, i) {
        return "colLabelRect r" + i;
      })
      .style("fill-opacity", 0)
      .remove();

    // UDPATE old elements
    colLabelsRectG
      .attr("class", function (d, i) {
        return "colLabelRect r" + i;
      })
      .attr("id", function (d) {
        return "colLabelRect" + d.YearID;
      })
      .attr("x", 14)
      .attr("y", function (d, i) {
        return i * mCellSizeConfig.CellSize;
      })
      .attr("transform", "translate(0,7) rotate(-90)")
      .attr("width", 32)
      .attr("height", mCellSizeConfig.CellSize)
      .style("fill", "none");

    // ENTER new elements
    colLabelsRectG
      .enter()
      .append("rect")
      .attr("class", function (d, i) {
        return "colLabelRect r" + i;
      })
      .attr("id", function (d) {
        return "colLabelRect" + d.YearID;
      })
      .attr("x", 14)
      .attr("y", function (d, i) {
        return i * mCellSizeConfig.CellSize;
      })
      .attr("transform", "translate(0,7) rotate(-90)")
      .attr("width", 32)
      .attr("height", mCellSizeConfig.CellSize)
      .style("fill", "none");

    // COLUMN LABELS TEXT
    if (!$(".colLabelTextG").length) {
      colLabelsTextG = mChartSVGGroup
        .append("g")
        .attr("class", "colLabelTextG")
        .selectAll(".colLabelText")
        .data(mAllYearsData.YearsList);
    } else {
      colLabelsTextG = d3
        .select(".colLabelTextG")
        .selectAll(".colLabelText")
        .data(mAllYearsData.YearsList);
    }

    // EXIT old elements
    colLabelsTextG
      .exit()
      .attr("id", function (d) {
        return "colLabelText" + d.YearID;
      })
      .style("fill-opacity", 0)
      .remove();

    // UPDATE old elements
    colLabelsTextG
      .attr("id", function (d) {
        return "colLabelText" + d.YearID;
      })
      .text(function (d) {
        return d.YearLabel;
      })
      .attr("x", 15)
      .attr("y", function (d, i) {
        return i * mCellSizeConfig.CellSize;
      })
      .style("text-anchor", "start")
      .style("cursor", "pointer")
      .attr(
        "transform",
        "translate(" + (mCellSizeConfig.CellSize / 2 + 4) + ",5) rotate (-90)"
      )
      .attr("class", function (d, i) {
        return mCellSizeConfig.CellSizeClass + " colLabelText c" + i;
      });

    // ENTER new elements
    colLabelsTextG
      .enter()
      .append("text")
      .attr("id", function (d) {
        return "colLabelText" + d.YearID;
      })
      .text(function (d) {
        return d.YearLabel;
      })
      .attr("x", 15)
      .attr("y", function (d, i) {
        return i * mCellSizeConfig.CellSize;
      })
      .style("text-anchor", "start")
      .style("cursor", "pointer")
      .attr(
        "transform",
        "translate(" + (mCellSizeConfig.CellSize / 2 + 4) + ",5) rotate (-90)"
      )
      .attr("class", function (d, i) {
        return mCellSizeConfig.CellSizeClass + " colLabelText c" + i;
      })
      .on("mouseover", function (d) {
        d3.select(this).classed("text-hover", true);
      })
      .on("mouseout", function (d) {
        d3.select(this).classed("text-hover", false);
      });

    // CELLS
    if (!$(".cellG").length) {
      cellG = mChartSVGGroup
        .append("g")
        .attr("class", "cellG")
        .selectAll(".cell")
        .data(mChartData);
    } else {
      cellG = d3.select(".cellG").selectAll(".cell").data(mChartData);
    }

    // EXIT old elements
    cellG
      .exit()
      .attr("x", function (d) {
        return d.col * mCellSizeConfig.CellSize;
      })
      .attr("y", function (d) {
        return d.row * mCellSizeConfig.CellSize;
      })
      .attr("class", function (d) {
        return "cell cell-border cr" + d.row + " cc" + d.col;
      })
      .style("fill-opacity", 0)
      .remove();

    // UPDATE old elements
    cellG
      .transition()
      .duration(100)
      .delay(function (d) {
        return d.row * 10 + d.col * 5;
      })
      .attr("x", function (d) {
        return d.col * mCellSizeConfig.CellSize;
      })
      .attr("y", function (d) {
        return d.row * mCellSizeConfig.CellSize;
      })
      .attr("class", function (d) {
        return "cell cell-border cr" + d.row + " cc" + d.col;
      })
      .attr("width", mCellSizeConfig.CellSize)
      .attr("height", mCellSizeConfig.CellSize)
      .style("fill", function (d) {
        return d.Color_HexVal;
      });

    // ENTER new elements
    cellG
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return d.col * mCellSizeConfig.CellSize;
      })
      .attr("y", function (d) {
        return d.row * mCellSizeConfig.CellSize;
      })
      .attr("class", function (d) {
        return "cell cell-border cr" + d.row + " cc" + d.col;
      })
      .attr("width", mCellSizeConfig.CellSize)
      .attr("height", mCellSizeConfig.CellSize)
      .style("fill", function (d) {
        return d.Color_HexVal;
      })
      .style("fill-opacity", 1)
      .on("mouseover", function (d) {
        d3.select(this).classed("cell-hover", true);
        d3.selectAll(".rowLabel").classed("text-highlight", function (r, ri) {
          return ri === d.row;
        });
        d3.selectAll(".colLabelText").classed(
          "text-highlight",
          function (c, ci) {
            return ci === d.col;
          }
        );
        d3.select(this).transition().duration(300).style("opacity", 0.8);

        if (d.Value !== mInActiveFlagID) {
          $(this)
            .popover({
              container: "body",
              title: d.StateName,
              placement: "right",
              sanitize: false,
              html: true,
              content: function () {
                return getTooltipText(d);
              }
            })
            .popover("show");
        }
      })
      .on("mouseout", function () {
        d3.select(this).classed("cell-hover", false);
        d3.selectAll(".rowLabel").classed("text-highlight", false);
        d3.selectAll(".colLabelText").classed("text-highlight", false);
        d3.select(this).transition().duration(300).style("opacity", 1);
        $(this).popover("dispose");
        $(".popover").remove(); // brute force removal of any lingering popovers
      });

    highlightSelectedStatesLabel();
  }

  function getCSVHeader() {
    var regexComma;
    var commaStrippedCurrentIndicatorName;
    var commaStrippedCurrentDataTypeLabel;
    var commaStrippedCurrentDataSetLabel;
    var commaStrippedCurrentMeasureName;
    var commaStrippedCurrentSubMeasureLabel;
    const currentIndicatorName = mConfig.DataParameters.getIndicatorName();
    const currentDataTypeLabel = mConfig.DataParameters.getDataTypeLabel();
    const currentDatasetLabel = mConfig.DataParameters.getDatasetLabel();
    const currentMeasureName = mConfig.DataParameters.getMeasureName();
    const currentDataType = mConfig.DataParameters.getDataType();
    const currentSubmeasureLabel = mConfig.DataParameters.getSubmeasureLabel();

    const currentAgeClassificationType =
      mConfig.DataParameters.getAgeClassificationType();

    regexComma = new RegExp(",", "g");
    commaStrippedCurrentIndicatorName = currentIndicatorName.replace(",", "-");
    commaStrippedCurrentDataTypeLabel = currentDataTypeLabel.replace(
      regexComma,
      ""
    );
    commaStrippedCurrentDataSetLabel = currentDatasetLabel.replace(",", "-");
    commaStrippedCurrentMeasureName = currentMeasureName.replace(",", "-");
    commaStrippedCurrentSubMeasureLabel = currentSubmeasureLabel.replace(
      ",",
      "-"
    );

    const csvHeaderAge =
      commaStrippedCurrentIndicatorName +
      "; " +
      commaStrippedCurrentSubMeasureLabel +
      " (" +
      commaStrippedCurrentMeasureName +
      "); " +
      commaStrippedCurrentDataSetLabel +
      "; " +
      commaStrippedCurrentDataTypeLabel +
      "; " +
      "U.S. States";

    const csvHeaderTotalEstimateValue =
      commaStrippedCurrentIndicatorName +
      "; " +
      commaStrippedCurrentMeasureName +
      "; " +
      commaStrippedCurrentDataSetLabel +
      "; " +
      currentAgeClassificationType +
      " " +
      commaStrippedCurrentDataTypeLabel +
      "; " +
      "U.S. States";

    const csvHeaderTotalNumberValue =
      commaStrippedCurrentIndicatorName +
      "; " +
      commaStrippedCurrentMeasureName +
      "; " +
      commaStrippedCurrentDataSetLabel +
      "; " +
      commaStrippedCurrentDataTypeLabel +
      "; " +
      "U.S. States";

    const csvHeaderEstimateValue =
      commaStrippedCurrentIndicatorName +
      "; " +
      commaStrippedCurrentSubMeasureLabel +
      " (" +
      commaStrippedCurrentMeasureName +
      "); " +
      commaStrippedCurrentDataSetLabel +
      "; " +
      currentAgeClassificationType +
      " " +
      commaStrippedCurrentDataTypeLabel +
      "; " +
      "U.S. States";

    const csvHeaderNumberValue =
      commaStrippedCurrentIndicatorName +
      "; " +
      commaStrippedCurrentSubMeasureLabel +
      " (" +
      commaStrippedCurrentMeasureName +
      "); " +
      commaStrippedCurrentDataSetLabel +
      "; " +
      commaStrippedCurrentDataTypeLabel +
      "; " +
      "U.S. States";

    if (currentMeasureName === "Age") {
      return csvHeaderAge;
    }
    if (currentMeasureName === "Total") {
      if (currentDataType === "NumberValue") {
        return csvHeaderTotalNumberValue;
      }
      return csvHeaderTotalEstimateValue;
    }
    if (currentDataType === "NumberValue") {
      return csvHeaderNumberValue;
    }
    return csvHeaderEstimateValue;
  }

  function getCSVDataHeader() {
    const regexComma = new RegExp(",", "g");
    const currentDataType = mConfig.DataParameters.getDataType();
    const currentDataTypeLabel = mConfig.DataParameters.getDataTypeLabel();
    const commaStrippedCurrentDataTypeLabel = currentDataTypeLabel.replace(
      regexComma,
      ""
    );

    if (currentDataType === "NumberValue") {
      return "Year,State," + commaStrippedCurrentDataTypeLabel;
    }
    return (
      "Year,State," +
      commaStrippedCurrentDataTypeLabel +
      ",Lower Limit, Upper Limit"
    );
  }

  function createCSVDataRows(csvArray, filteredData) {
    const currentDataType = mConfig.DataParameters.getDataType();

    filteredData.forEach(function (d) {
      if (currentDataType === "NumberValue") {
        csvArray.push(d.YearLabel + "," + d.StateName + "," + d.Value);
      } else {
        csvArray.push(
          d.YearLabel +
            "," +
            d.StateName +
            "," +
            d.Value +
            "," +
            d.LowerLimit +
            "," +
            d.UpperLimit
        );
      }
    });

    return csvArray;
  }

  function downloadCSV() {
    var csvArray = [];
    var csvHeader;
    var csvDate;
    const csvFooter =
      "US Diabetes Surveillance System; www.cdc.gov/diabetes/data; Division of Diabetes Translation - Centers for Disease Control and Prevention.";
    var csvFileDownload;
    var csvConfig;
    const downloadFileName = "DiabetesAtlas_AllStatesHeatMapData.csv";

    csvHeader = getCSVHeader();
    csvArray.push(csvHeader);

    csvDate = "Data downloaded on " + mHelperUtil.getTodaysDate();
    csvArray.push(csvDate);

    const csvDataHeader = getCSVDataHeader();
    csvArray.push(csvDataHeader);

    const filteredChartData = mChartData.filter(function (d) {
      return d.Value !== mInActiveFlagID;
    });

    csvArray = createCSVDataRows(csvArray, filteredChartData);

    csvArray.push(csvFooter);

    csvArray = csvArray.join("\r\n");
    csvFileDownload = new CSVFileDownload();
    csvConfig = {
      CSVContent: csvArray,
      Filename: downloadFileName
    };
    csvFileDownload.downloadCSV(csvConfig);
  }

  /*  // 01Mar2022
  publicAPI.downloadCSV = function () {
    var csvArray = [];
    var csvHeader;
    var regexComma;
    var commaStrippedCurrentIndicatorName;
    var commaStrippedCurrentDataTypeLabel;
    var commaStrippedCurrentDataSetLabel;
    var commaStrippedCurrentMeasureName;
    var commaStrippedCurrentSubMeasureLabel;
    var csvDataHeader;
    var downloadFileName;
    var csvDate;
    var csvFooter =
      "US Diabetes Surveillance System; www.cdc.gov/diabetes/data; Division of Diabetes Translation - Centers for Disease Control and Prevention.";
    var chartDataCopy;
    var filteredChartDataCopy;
    var currentIndicatorName = mConfig.DataParameters.getIndicatorName();
    var currentDataTypeLabel = mConfig.DataParameters.getDataTypeLabel();
    var currentDatasetLabel = mConfig.DataParameters.getDatasetLabel();
    var currentMeasureName = mConfig.DataParameters.getMeasureName();
    var currentSubmeasureLabel = mConfig.DataParameters.getSubmeasureLabel();
    var currentAgeClassificationType =
      mConfig.DataParameters.getAgeClassificationType();
    var currentDataType = mConfig.DataParameters.getDataType();
    var csvFileDownload; // 26Jul2020
    var csvConfig; // 26Jul2020

    regexComma = new RegExp(",", "g");
    commaStrippedCurrentIndicatorName = currentIndicatorName.replace(",", "-");
    commaStrippedCurrentDataTypeLabel = currentDataTypeLabel.replace(
      regexComma,
      ""
    );
    commaStrippedCurrentDataSetLabel = currentDatasetLabel.replace(",", "-");
    commaStrippedCurrentMeasureName = currentMeasureName.replace(",", "-");
    commaStrippedCurrentSubMeasureLabel = currentSubmeasureLabel.replace(
      ",",
      "-"
    );

    // 12Feb2019
    if (currentMeasureName === "Age") {
      csvHeader =
        commaStrippedCurrentIndicatorName +
        "; " +
        commaStrippedCurrentSubMeasureLabel +
        " (" +
        commaStrippedCurrentMeasureName +
        "); " +
        commaStrippedCurrentDataSetLabel +
        "; " +
        commaStrippedCurrentDataTypeLabel +
        "; " +
        "U.S. States";
    } else if (currentMeasureName === "Total") {
      if (currentDataType === "NumberValue") {
        csvHeader =
          commaStrippedCurrentIndicatorName +
          "; " +
          commaStrippedCurrentMeasureName +
          "; " +
          commaStrippedCurrentDataSetLabel +
          "; " +
          commaStrippedCurrentDataTypeLabel +
          "; " +
          "U.S. States";
      } else {
        csvHeader =
          commaStrippedCurrentIndicatorName +
          "; " +
          commaStrippedCurrentMeasureName +
          "; " +
          commaStrippedCurrentDataSetLabel +
          "; " +
          currentAgeClassificationType +
          " " +
          commaStrippedCurrentDataTypeLabel +
          "; " +
          "U.S. States";
      }
    } else if (currentDataType === "NumberValue") {
      csvHeader =
        commaStrippedCurrentIndicatorName +
        "; " +
        commaStrippedCurrentSubMeasureLabel +
        " (" +
        commaStrippedCurrentMeasureName +
        "); " +
        commaStrippedCurrentDataSetLabel +
        "; " +
        commaStrippedCurrentDataTypeLabel +
        "; " +
        "U.S. States";
    } else {
      csvHeader =
        commaStrippedCurrentIndicatorName +
        "; " +
        commaStrippedCurrentSubMeasureLabel +
        " (" +
        commaStrippedCurrentMeasureName +
        "); " +
        commaStrippedCurrentDataSetLabel +
        "; " +
        currentAgeClassificationType +
        " " +
        commaStrippedCurrentDataTypeLabel +
        "; " +
        "U.S. States";
    }

    csvArray.push(csvHeader);

    csvDate = "Data downloaded on " + mHelperUtil.getTodaysDate();
    csvArray.push(csvDate);

    if (currentDataType === "EstimateValue") {
      csvDataHeader =
        "Year,State," +
        commaStrippedCurrentDataTypeLabel +
        ",LowerLimit,UpperLimit";
    } else if (currentDataType === "NumberValue") {
      csvDataHeader = "Year,State," + commaStrippedCurrentDataTypeLabel;
    }
    csvArray.push(csvDataHeader);

    chartDataCopy = $.extend([], true, mChartData);
    filteredChartDataCopy = chartDataCopy.filter(function (d) {
      return d.Value !== mInActiveFlagID;
    });

    if (currentDataType === "EstimateValue") {
      filteredChartDataCopy.forEach(function (d) {
        csvArray.push(
          d.YearLabel +
            "," +
            d.StateName +
            "," +
            d.Value +
            "," +
            d.LowerLimit +
            "," +
            d.UpperLimit
        );
      });
    } else if (currentDataType === "NumberValue") {
      filteredChartDataCopy.forEach(function (d) {
        csvArray.push(d.YearLabel + "," + d.StateName + "," + d.Value);
      });
    }

    csvArray.push(csvFooter);

    // 26Jul2020 csvArray = csvArray.join("\\n");
    csvArray = csvArray.join("\r\n");
    downloadFileName = "DiabetesAtlasData.csv";

    // 26Jul2020
    csvFileDownload = new CSVFileDownload();
    csvConfig = {
      CSVContent: csvArray,
      Filename: downloadFileName
    };
    csvFileDownload.downloadCSV(csvConfig);
  }; */

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

  /*  // 02Mar2022
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

  /*  // 02Mar2022
   publicAPI.downloadPPT = function (token) {
    var canvasdata;
    var legendCanvasData;
    var canvas;
    var context;
    var legendSVGHTML;
    var style;
    var rules;
    var svgDiv;
    var svgElem;
    var currentIndicatorName;
    var currentAgeClassificationType;
    var currentDataTypeLabel;
    var currentDataType;
    var currentDatasetLabel;
    var currentMeasureName;
    var currentSubmeasureLabel;
    var customHeading;
    var pptFileName = "DataHeatMap";
    var callType = "PowerPoint";
    var legendTitle;
    var currentDataClassificationType;
    var str;
    var scrubbedSVGElem;
    var chartType = "AllStatesHeatMap"; // 22Jul2020
    var pptPostSubmitForm; // 22Jul2020
    var formConfig; // 22Jul2020

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

    style = "\n";
    for (let i = 0; i < document.styleSheets.length; i += 1) {
      if (document.styleSheets[i].href) {
        str = document.styleSheets[i].href.split("/");
        if (
          
          str[str.length - 1] === "styles." + mConfig.FileHashID + ".css" ||
          str[str.length - 1] === "diabetes." + mConfig.FileHashID + ".css" // 22Apr2021
        ) {
          rules = document.styleSheets[i].rules;
          if (typeof rules !== "undefined") {
            for (let j = 0; j < rules.length; j += 1) {
              style += rules[j].cssText + "\n";
            }
          }
        }
      }
    }

    // 11Nov2020 svgDiv = $("#" + mConfig.HeatmapDivID + " svg");
    svgDiv = $("#" + mConfig.ContainerID + " svg");
    svgDiv.prepend("\n<style type='text/css'></style>");
    svgDiv.find("style").html("\n<![CDATA[" + style + "]]>\n");

    svgElem = d3
      // 11Nov2020 .select("#" + mConfig.HeatmapDivID)
      .select("#" + mConfig.ContainerID)
      .select("svg")
      .attr("version", 1.1)
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .node().parentNode.innerHTML;

    context.clearRect(0, 0, canvas.width, canvas.height);
    scrubbedSVGElem = scrubSVG(svgElem);
    canvg(canvas, scrubbedSVGElem, {
      scaleWidth: 900,
      scaleHeight: 700,
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

    // 11Feb2019
    if (currentMeasureName === "Total") {
      if (currentDataType === "NumberValue") {
        customHeading =
          currentIndicatorName +
          ", " +
          currentMeasureName +
          ", " +
          currentDatasetLabel +
          ", " +
          currentDataTypeLabel +
          ", " +
          currentDataClassificationType +
          " , U.S. States";
      } else {
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
          ", " +
          currentDataClassificationType +
          " , U.S. States";
      }
    } else if (currentMeasureName === "Age") {
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
        ", U.S. States";
    } else if (currentDataType === "NumberValue") {
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
        " , U.S. States";
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
        ", " +
        currentDataClassificationType +
        " , U.S. States";
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
  }

  function getLegendCanvasData() {
    var legendCanvasData;
    const canvas = document.getElementById("canvasImageCreation"); // 11Nov2020
    const context = canvas.getContext("2d");
    const legendSVGHTML = getLegendSVGHTML();

    context.clearRect(0, 0, canvas.width, canvas.height);
    canvg(canvas, legendSVGHTML, {
      scaleWidth: 750, // 200,
      scaleHeight: 200,
      ignoreDimensions: true
    });
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

  function getPPTHeading() {
    var customHeading;
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
    const headingTotalEstimateValue =
      currentIndicatorName +
      ", " +
      currentMeasureName +
      ", " +
      currentDatasetLabel +
      ", " +
      currentAgeClassificationType +
      " " +
      currentDataTypeLabel +
      ", " +
      currentDataClassificationType +
      " , U.S. States";

    const headingTotalNumberValue =
      currentIndicatorName +
      ", " +
      currentMeasureName +
      ", " +
      currentDatasetLabel +
      ", " +
      currentDataTypeLabel +
      ", " +
      currentDataClassificationType +
      " , U.S. States";

    const headingAge =
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
      ", U.S. States";

    const headingNumberValue =
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
      " , U.S. States";

    const headingEstimateValue =
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
      ", " +
      currentDataClassificationType +
      " , U.S. States";

    if (currentMeasureName === "Age") {
      return headingAge;
    }
    if (currentMeasureName === "Total") {
      if (currentDataType === "NumberValue") {
        return headingTotalNumberValue;
      }
      return headingTotalEstimateValue;
    }
    if (currentDataType === "EstimateValue") {
      return headingEstimateValue;
    }
    return headingNumberValue;
  }

  function downloadPPT(token) {
    const currentDataTypeLabel = mConfig.DataParameters.getDataTypeLabel();
    const currentDataClassificationType =
      mConfig.DataParameters.getDataClassificationType();

    const legendCanvasData = getLegendCanvasData();
    const style = getStyle();

    const svgDiv = $("#" + mConfig.HeatMapID + " svg");
    svgDiv.prepend("\n<style type='text/css'></style>");
    svgDiv.find("style").html("\n<![CDATA[" + style + "]]>\n");

    const svgElem = d3
      .select("#" + mConfig.HeatMapID)
      .select("svg")
      .attr("version", 1.1)
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .node().parentNode.innerHTML;

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
    const pptFileName = "DiabetesAtlas_AllStateHeatMap";
    const callType = "PowerPoint";
    const currentIndicatorName = mConfig.DataParameters.getIndicatorName();
    const chartType = "AllStatesHeatMap";
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
  }

  // 27Feb2022
  function createChart() {
    $("#viz2Visual").empty();
    defineCellSizeConfig();
    setData();
    setChartSize();
    addSVG();
    renderChart();
  }

  function addEventListeners() {
    window.addEventListener("resize", createChart);
  }

  function removeEventListeners() {
    window.removeEventListener("resize", createChart);
  }

  publicAPI.dispose = function () {
    removeEventListeners();
  };

  publicAPI.downloadCSV = function () {
    downloadCSV();
  };

  publicAPI.downloadPPT = function (token) {
    downloadPPT(token);
  };

  publicAPI.update = function (updateConfig) {
    mConfig.DataParameters = updateConfig.DataParameters;
    mConfig.BusinessData = updateConfig.BusinessData;
    mActiveLegendItems = updateConfig.ActiveLegendItems;
    setChartSize();
    setData();
    renderChart();
    highlightCurrentYearLabel(mConfig.DataParameters.getYear()); // 24Aug2017
  };

  // 11Apr2019
  publicAPI.onUpdateHeatMapOnActiveLegendItemsChangeEvent = function (
    activeLegendItems
  ) {
    mActiveLegendItems = activeLegendItems;
    setData();
    renderChart();
    highlightCurrentYearLabel(mConfig.DataParameters.getYear());
  };

  /*   publicAPI.reload = function () {
    renderChart();
  }; */

  publicAPI.onMapSliderChangeEvent = function (newYearObj) {
    highlightCurrentYearLabel(newYearObj.YearID);
  };

  publicAPI.onColumnChartSliderChangeEvent = function (newYearObj) {
    highlightCurrentYearLabel(newYearObj.YearID);
  };

  publicAPI.onDataTableSliderChangeEvent = function (newYearObj) {
    highlightCurrentYearLabel(newYearObj.YearID);
  };

  publicAPI.init = function (config) {
    mConfig = config;
    // 17Mar2022 mMediator = mConfig.Mediator;
    mActiveLegendItems = mConfig.ActiveLegendItems;
    mNumOfRows = mConfig.StatesList.length;
    // 28Feb2022  mContainerWidth = $("#" + mConfig.ContainerID).width();
    mContainerWidth = $("#" + mConfig.ParentID).width();
    mHelperUtil = new HelperUtil();
    /*  // 27Feb2022
    defineCellSizeConfig();
    setData();
    setChartSize();
    addSVG();
    renderChart(); */
    createChart(); // 27Feb2022
    highlightCurrentYearLabel(mConfig.DataParameters.getYear()); // 24Aug2017
    addEventListeners();
  };

  return publicAPI;
}

export default DataHeatMapSquares;
