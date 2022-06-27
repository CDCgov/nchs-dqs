import $ from "jquery";
import canvg from "canvgModule";
import * as d3 from "../lib/d3_v4-min";
import HelperUtil from "../modules/helperutils";
import CSVFileDownload from "./csvFileDownload";
import PPTPostSubmitForm from "./pptPostSubmitForm";

function AllStatesLineChart() {
  var publicAPI = {};
  var mMediator;
  var mConfig;
  var mFormatYear;
  var mHelperUtil;
  var mLargeDeviceModeName = "LargeDevice";
  var mSmallDeviceModeName = "SmallDevice";
  var mChartHeight;
  var mChartSVGHeight;
  var mChartWidth;
  var mChartSVGWidth;
  var mMargin;
  var mChartSVG;
  var mChartSVGGroup;
  var mUnFilteredChartData;
  var mAllYearsData;
  var mChartGroupedData;
  var mMaxVal;
  var mNoDataFlagID = -1;
  var mSuppressedFlagID = -2;
  var mSelectedStatesList = [];
  var mXScale;
  var mYScale;
  var mXAxis;
  var mYAxis;
  var mLineDef;
  var mVoronoi;
  var mLineChartYAxisToggleBtn;
  var mIsYAxisTg100BtnActive;
  var mUniqueColorsList = [];
  var mChartGroupedDataWithGapValues; // 11Feb2021
  var mFormatThousands;

  publicAPI.setMediator = function (m) {
    mMediator = m;
  };

  publicAPI.getMediator = function () {
    return mMediator;
  };

  function setChartSize() {
    const heightFactor = 0.62;

    const $Container = $("#" + mConfig.ParentID); // 17Feb2022

    mMargin = { top: 10, right: 50, bottom: 40, left: 53 };

    mChartSVGWidth = $Container.width() - 10;
    mChartSVGHeight = heightFactor * $Container.width();
    mChartWidth = mChartSVGWidth - mMargin.left - mMargin.right;
    mChartHeight = mChartSVGHeight - mMargin.top - mMargin.bottom;
  }

  function addSVG() {
    var $LineChartDiv;

    const $ParentDiv = $("#" + mConfig.ParentID);
    const lineChartID = mConfig.LineChartID;
    $ParentDiv.empty();
    $ParentDiv.append("<div id='" + lineChartID + "' class='w-100'></div>");
    $LineChartDiv = $("#" + lineChartID);
    $LineChartDiv.append("<div id='" + lineChartID + "SVG' ></div>");
    mChartSVG = d3.select("#" + lineChartID + "SVG").append("svg");
  }

  function setSVGSize() {
    mChartSVG.attr("viewBox", "0 0 " + mChartSVGWidth + " " + mChartSVGHeight);

    mChartSVGGroup = mChartSVG
      .append("g")
      .attr("transform", "translate(" + mMargin.left + "," + mMargin.top + ")");
  }

  function filterDataByAgeClassification(data) {
    var filteredData;
    var currentAgeClassificationType;

    currentAgeClassificationType =
      mConfig.DataParameters.getAgeClassificationType();
    filteredData =
      currentAgeClassificationType === "Age-Adjusted"
        ? data.Data.AgeAdjustedData
        : data.Data.CrudeData;

    return filteredData;
  }

  function filterDataByDataClassification(data) {
    var filteredData;
    var currentDataClassificationType;

    currentDataClassificationType =
      mConfig.DataParameters.getDataClassificationType();
    filteredData =
      currentDataClassificationType === "Natural Breaks"
        ? data.NaturalBreaksData
        : data.QuartilesData;

    return filteredData;
  }

  function getAllYearsData() {
    var currentMeasureID;
    var currentSubmeasureID;
    var ageClassificationTypeData;
    var ageMeasureID = 41;
    var totalMeasureID = 40;
    var currentMeasureData;
    var currentSubmeasureData;
    var allYearsData = [];

    currentMeasureData = mConfig.BusinessData.MeasureData;
    currentMeasureID = mConfig.DataParameters.getMeasureID();
    currentSubmeasureID = mConfig.DataParameters.getSubmeasureID();

    if (currentMeasureID === totalMeasureID) {
      ageClassificationTypeData =
        filterDataByAgeClassification(currentMeasureData);

      allYearsData = filterDataByDataClassification(ageClassificationTypeData);
    } else if (currentMeasureID === ageMeasureID) {
      currentSubmeasureData = currentMeasureData.Data.filter(function (a) {
        return a.SubmeasureID === currentSubmeasureID;
      })[0];

      allYearsData = filterDataByDataClassification(currentSubmeasureData);
    } else {
      ageClassificationTypeData =
        filterDataByAgeClassification(currentMeasureData);

      currentSubmeasureData = ageClassificationTypeData.filter(function (a) {
        return a.SubmeasureID === currentSubmeasureID;
      })[0];

      allYearsData = filterDataByDataClassification(currentSubmeasureData);
    }

    return allYearsData;
  }

  function getMaxVal(data) {
    var maxVal;

    maxVal = d3.max(data, function (d) {
      return d.Value;
    });

    return maxVal;
  }

  // 11Feb2021
  function reorderSelectedStatesRecords() {
    // move the ids to the end of array, so that these lines are rendered on 'top'.
    var itemIndex;

    mSelectedStatesList.forEach(function (geoID) {
      itemIndex = mUnFilteredChartData
        .map(function (e) {
          return e.key;
        })
        .indexOf(geoID.toString());
      if (itemIndex !== -1) {
        mUnFilteredChartData = mHelperUtil.moveItemInArray(
          mUnFilteredChartData,
          itemIndex,
          mUnFilteredChartData.length - 1
        );
      }
    }, this);
  }

  function setData() {
    var stateIdx;
    var yearIdx;
    var chartDataObj;
    var val;
    var displayVal;
    var lowerLimit;
    var upperLimit;
    var chartDataWithGapValues; // 11Feb2021

    mUnFilteredChartData = [];
    mAllYearsData = getAllYearsData();

    mAllYearsData.Data.forEach(function (yearData) {
      yearData.Data.forEach(function (stateData) {
        stateIdx = mConfig.StatesList.map(function (x) {
          return x.SABBR; // 22Oct2018
        }).indexOf(stateData.GeoABBR);
        yearIdx = mAllYearsData.YearsList.map(function (y) {
          return y.YearID;
        }).indexOf(yearData.YearID);
        if (stateIdx !== -1 && yearIdx !== -1) {
          chartDataObj = {
            YearID: yearData.YearID,
            YearLabel: mAllYearsData.YearsList.filter(function (a) {
              return a.YearID === yearData.YearID;
            })[0].YearLabel,
            GeoLabel: stateData.GeoLabel,
            GeoID: stateData.GeoID,
            GeoABBR: stateData.GeoABBR,
            DatabaseCode: stateData.DatabaseCode
          };
          if (stateData.IsSuppressed) {
            val = mSuppressedFlagID;
            displayVal = "Suppressed";
            lowerLimit = "Suppressed";
            upperLimit = "Suppressed";
          } else if (stateData.IsNoData) {
            val = mNoDataFlagID;
            displayVal = "No Data";
            lowerLimit = "No Data";
            upperLimit = "No Data";
          } else {
            val = stateData.Value;
            displayVal = val;
            lowerLimit = stateData.LowerLimit;
            upperLimit = stateData.UpperLimit;
          }

          chartDataObj.Value = displayVal;
          chartDataObj.LowerLimit = lowerLimit;
          chartDataObj.UpperLimit = upperLimit;
          chartDataObj.Color_HexVal = stateData.Color_HexVal;

          mUnFilteredChartData.push(chartDataObj);
        }
      });
    });

    // 11Feb2021
    chartDataWithGapValues = mUnFilteredChartData.filter(function (d) {
      return d.Value !== "No Data" && d.Value !== "Suppressed";
    });
    // 11Feb2021
    mChartGroupedDataWithGapValues = d3
      .nest()
      .key(function (d) {
        return d[mConfig.DataKeyID];
      })
      .entries(chartDataWithGapValues);

    mChartGroupedData = d3
      .nest()
      .key(function (d) {
        return d[mConfig.DataKeyID];
      })
      .entries(mUnFilteredChartData);

    mMaxVal = getMaxVal(chartDataWithGapValues); // 11Feb2021
    mMaxVal += 0.1 * mMaxVal;

    reorderSelectedStatesRecords();
  }

  function defineScales() {
    var yearsList;

    yearsList = mAllYearsData.YearsList;

    mXScale = d3
      .scaleTime()
      .range([0, mChartWidth])
      .domain(
        d3.extent(yearsList, function (d) {
          return mFormatYear(d.YearLabel);
        })
      );

    mYScale = d3.scaleLinear().range([mChartHeight, 0]).domain([0, mMaxVal]);
  }

  function defineAxes() {
    var yearsList;

    yearsList = mAllYearsData.YearsList;

    mXAxis = d3
      .axisBottom(mXScale)
      .ticks(yearsList.length)
      .tickSizeInner(-mChartHeight)
      .tickSizeOuter(3)
      .tickPadding(-3);

    mYAxis = d3
      .axisLeft(mYScale)
      .tickFormat(function (d) {
        const dataType = mConfig.DataParameters.getDataType();
        if (dataType === "NumberValue") {
          return mFormatThousands(d);
        }
        return d;
      })
      .tickSizeInner(-mChartWidth)
      .tickSizeOuter(3)
      .tickPadding(5)
      .ticks(5);
  }

  function setLineDefinition() {
    mLineDef = d3
      .line()
      .x(function (d) {
        return mXScale(mFormatYear(d.YearLabel));
      })
      .y(function (d) {
        return mYScale(d.Value);
      })
      .defined(function (d) {
        // 11Feb2021
        return d.Value !== "No Data" && d.Value !== "Suppressed";
      });
  }

  function createVoronoiLayerDefinition() {
    mVoronoi = d3
      .voronoi()
      .x(function (d) {
        return mXScale(mFormatYear(d.YearLabel));
      })
      .y(function (d) {
        return mYScale(d.Value);
      })
      .extent([
        [0, 0],
        [mChartSVGWidth, mChartSVGHeight]
      ]);
  }

  function renderAxes() {
    mChartSVGGroup
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + mChartHeight + ")")
      .call(mXAxis);

    mChartSVGGroup.append("g").attr("class", "y axis").call(mYAxis);
  }

  function evalIsNoDataSuppressedCondition(keyID) {
    var resultSet1;

    resultSet1 = mUnFilteredChartData.filter(function (d) {
      return (
        +d[mConfig.DataKeyID] === +keyID && // 27Nov2018
        (d.Value === "No Data" || d.Value === "Suppressed")
      );
    });

    if (resultSet1.length) {
      return true;
    }
    return false;
  }

  function getNewColor(assignedToID) {
    var colorHexVal = "";
    var i;

    if (!mUniqueColorsList.length > 0) {
      mUniqueColorsList = mConfig.SubmeasuresColorsList.unique_colors.map(
        function (d) {
          return {
            HexVal: d,
            IsAssigned: false,
            AssignedTo: -1
          };
        }
      );
    }

    for (i = 0; i < mUniqueColorsList.length; i += 1) {
      if (mUniqueColorsList[i].IsAssigned === false) {
        colorHexVal = mUniqueColorsList[i].HexVal;
        mUniqueColorsList[i].IsAssigned = true;
        mUniqueColorsList[i].AssignedTo = assignedToID;

        break;
      }
    }

    return colorHexVal;
  }

  function getAssignedColor(assignedToID) {
    var colorHexVal = "";

    for (let i = 0; i < mUniqueColorsList.length; i += 1) {
      if (mUniqueColorsList[i].AssignedTo === assignedToID) {
        colorHexVal = mUniqueColorsList[i].HexVal;
        break;
      }
    }

    return colorHexVal;
  }

  function getColor(assignedToID) {
    var colorHexVal = "";

    colorHexVal = getAssignedColor(assignedToID);

    if (colorHexVal === "") {
      colorHexVal = getNewColor(assignedToID);
    }

    return colorHexVal;
  }

  function drawMedianLineLabel() {
    var medianLine;
    var medianLineParentNode;

    medianLine = d3.select("#tag5001");
    medianLineParentNode = medianLine.select(function () {
      return this.parentNode;
    });
    medianLineParentNode
      .append("text")
      .attr("class", "linelabel")
      .attr("transform", function (d) {
        return (
          "translate(" +
          (mChartWidth + 3) +
          "," +
          mYScale(d[d.length - 1].Value) +
          ")"
        );
      })
      .attr("dy", ".35em")
      .attr("font-size", 12)
      .attr("text-anchor", "start")
      .style("fill", "#000000")
      .text("Median");
  }

  function drawLineLabels() {
    var idx;
    var geoIDLine;
    var geoIDLineParentNode;

    d3.selectAll(".linelabel").remove();

    mSelectedStatesList.forEach(function (geoID) {
      geoIDLine = d3.select("#tag" + +geoID);
      geoIDLineParentNode = geoIDLine.select(function () {
        return this.parentNode;
      });
      geoIDLineParentNode
        .append("text")
        .attr("class", "linelabel")
        .attr("transform", function (d) {
          return (
            "translate(" +
            (mChartWidth + 3) +
            "," +
            mYScale(d.values[d.values.length - 1].Value) +
            ")"
          );
        })
        .attr("dy", ".35em")
        .attr("font-size", 12)
        .attr("font-weight", "bold") // 18Mar2022
        .attr("text-anchor", "start")
        .style("fill", "#000000")
        .style("fill", function (d) {
          idx = mSelectedStatesList.indexOf(+d.key);
          if (idx !== -1) {
            return getColor(+d.key);
          }
          return null;
        })
        .text(function (d) {
          idx = mSelectedStatesList.indexOf(+d.key);
          if (idx !== -1) {
            return d.values[0][mConfig.LineLabelField];
          }
          return null;
        });
    });
  }

  function evalAllStatesMedianIsNoDataSuppressedCondition() {
    var matches = [];

    matches = mAllYearsData.AllStatesMedianData.Data.filter(function (d) {
      return d.IsNoData === true || d.IsSuppressed === true;
    });

    if (matches.length > 0) {
      return true;
    }
    return false;
  }

  function addAllStatesMedianLine() {
    var allStatesMedianData;
    var allStatesMedianLineGrp;
    var isNoDataSuppressed;
    var filteredAllStatesMedianData;

    $(".AllStatesMedianLineGrp").remove();

    allStatesMedianData = $.extend(true, [], mAllYearsData.AllStatesMedianData);

    // 11Feb2021
    if (!allStatesMedianData.Data) {
      return;
    }

    isNoDataSuppressed = evalAllStatesMedianIsNoDataSuppressedCondition();
    filteredAllStatesMedianData = allStatesMedianData.Data.filter(function (d) {
      return d.IsNoData === false && d.IsSuppressed === false;
    });

    if (!filteredAllStatesMedianData || !filteredAllStatesMedianData.length) {
      return;
    }

    allStatesMedianLineGrp = mChartSVGGroup
      .append("g")
      .attr("class", "AllStatesMedianLineGrp");

    // ENTER new elements present in new data.
    allStatesMedianLineGrp
      .append("path")
      .datum(filteredAllStatesMedianData)
      .attr("class", "line")
      .attr("id", "tag5001")
      .attr("d", mLineDef)
      .style("stroke-width", "3")
      .style("stroke", "#000000")
      .style("stroke-dasharray", function () {
        if (isNoDataSuppressed) {
          return "7,5";
        }
        return null;
      });

    drawMedianLineLabel();
  }

  function checkForMethodChangeCondition() {
    var methodChangeYearsList;
    var methodChangeLineG;
    var methodChangeInfo;

    methodChangeInfo = mConfig.BusinessData.MethodChangeInfo;

    if (methodChangeInfo.IsMethodChange) {
      methodChangeYearsList = methodChangeInfo.MethodChangeYearsList;

      if (!$(".methodChangeLineGrp").length) {
        methodChangeLineG = mChartSVGGroup
          .append("g")
          .attr("class", "methodChangeLineGrp")
          .selectAll(".methodChangeLine")
          .data(methodChangeYearsList);
      } else {
        methodChangeLineG = d3
          .select(".methodChangeLineGrp")
          .selectAll(".methodChangeLine")
          .data(methodChangeYearsList);
      }

      // EXIT old elements
      methodChangeLineG
        .exit()
        .attr("class", ".methodChangeLine")
        .style("fill-opacity", 0)
        .remove();

      // UPDATE old elements
      methodChangeLineG
        .attr("class", "methodChangeLine")
        .style("stroke-dasharray", "3,2")
        .style("stroke", "#ff5a00")
        .attr("y2", mYScale.range()[0])
        .attr("y1", function () {
          return mYScale.range()[0];
        })
        .attr("x1", function (d) {
          return mXScale(mFormatYear(d.YearLabel));
        })
        .attr("x2", function (d) {
          return mXScale(mFormatYear(d.YearLabel));
        })
        .attr("stroke", "#2c3e50")
        .attr("stroke-width", 4)
        .transition()
        .delay(400)
        .duration(300)
        .ease(d3.easeExpOut)
        .attr("y1", mYScale.range()[1])
        .on("end", function () {});

      // ENTER new elements
      methodChangeLineG
        .enter()
        .append("line")
        .attr("class", "methodChangeLine")
        .style("stroke-dasharray", "3,2")
        .style("stroke", "#ff5a00")
        .attr("y2", mYScale.range()[0])
        .attr("y1", function () {
          return mYScale.range()[0];
        })
        .attr("x1", function (d) {
          return mXScale(mFormatYear(d.YearLabel));
        })
        .attr("x2", function (d) {
          return mXScale(mFormatYear(d.YearLabel));
        })
        .attr("stroke", "#2c3e50")
        .attr("stroke-width", 4)
        .transition()
        .delay(400)
        .duration(300)
        .ease(d3.easeExpOut)
        .attr("y1", mYScale.range()[1])
        .on("end", function () {});
    } else {
      $(".methodChangeLineGrp").remove();
    }
  }

  function addLineLabel(d) {
    var idx;
    var labelData;
    var mouseoverLineLabel;
    var mouseoverLineLabelG;

    labelData = mChartGroupedData.filter(function (a) {
      return +a.key === +d.GeoID;
    });
    mouseoverLineLabel = mChartSVGGroup
      .selectAll("g.mouseoverLineLabel")
      .data(labelData, function (m) {
        return m.key;
      });

    mouseoverLineLabelG = mouseoverLineLabel
      .enter()
      .append("g")
      .attr("class", "mouseoverLineLabelG");
    mouseoverLineLabelG
      .append("text")
      .attr("class", "mouseoverLineLabel")
      .attr("transform", function (a) {
        return (
          "translate(" +
          (mChartWidth + 3) +
          "," +
          mYScale(a.values[a.values.length - 1].Value) +
          ")"
        );
      })
      .attr("dy", ".35em")
      .attr("font-size", 12)
      .attr("text-anchor", "start")
      .style("fill", function (a) {
        idx = mSelectedStatesList.indexOf(+a.key);
        if (idx === -1) {
          return "#0080ff";
        }
        return "#000000";
      })
      .text(function (k) {
        idx = mSelectedStatesList.indexOf(+k.key);
        if (idx === -1) {
          return k.values[0][mConfig.LineLabelField];
        }
        return null;
      });
  }

  function removeLineLabel() {
    d3.selectAll(".mouseoverLineLabelG").remove();
  }

  function lineMouseoverEventHandler(d) {
    d3.select("#tag" + +d.GeoID)
      .style("stroke-opacity", 1)
      .style("stroke", function (a) {
        if (+a.key === 0) {
          return "#000000";
        }
        return "#0080ff";
      })
      .style("stroke-width", function (b) {
        if (+b.key === 0) {
          return 3;
        }
        const idx = mSelectedStatesList.indexOf(+b.key); // 18Mar2022
        if (idx !== -1) {
          return 3;
        }
        return 1.5;
      });

    // 12Feb2021
    d3.select("#gap" + +d.GeoID)
      .style("stroke-opacity", 1)
      .style("stroke", function (a) {
        if (+a.key === 0) {
          return "#000000";
        }
        return "#0080ff";
      })
      .style("stroke-width", function (b) {
        if (+b.key === 0) {
          return 3;
        }
        const idx = mSelectedStatesList.indexOf(+b.key); // 18Mar2022
        if (idx !== -1) {
          return 3;
        }
        return 1.5;
      });

    addLineLabel(d);
  }

  function lineMouseoutEventHandler(d) {
    var idx;

    d3.select("#tag" + +d.GeoID)
      .style("stroke", function (a) {
        if (+a.key === 0) {
          return "#000000";
        }
        idx = mSelectedStatesList.indexOf(+a.key);
        if (idx !== -1) {
          return getColor(+a.key);
        }
        return "#c9c9c9";
      })
      .style("stroke-width", function (b) {
        if (+b.key === 0) {
          return 3;
        }
        idx = mSelectedStatesList.indexOf(+b.key); // 18Mar2022
        if (idx !== -1) {
          return 3;
        }
        return 1;
      })
      .style("stroke-opacity", function (c) {
        if (+c.key === 0) {
          return 1;
        }
        idx = mSelectedStatesList.indexOf(+c.key);
        if (idx !== -1) {
          return 1;
        }
        return 0.5;
      });

    // 12Feb2021
    d3.select("#gap" + +d.GeoID)
      .style("stroke", function (a) {
        if (+a.key === 0) {
          return "#000000";
        }
        idx = mSelectedStatesList.indexOf(+a.key);
        if (idx !== -1) {
          return getColor(+a.key);
        }
        return "#c9c9c9";
      })
      .style("stroke-width", function (b) {
        if (+b.key === 0) {
          return 3;
        }
        idx = mSelectedStatesList.indexOf(+b.key); // 18Mar2022
        if (idx !== -1) {
          return 3;
        }
        return 1;
      })
      .style("stroke-opacity", function (c) {
        if (+c.key === 0) {
          return 1;
        }
        idx = mSelectedStatesList.indexOf(+c.key);
        if (idx !== -1) {
          return 1;
        }
        return 0.5;
      });

    removeLineLabel();
  }

  function addVoronoiCellLayer() {
    var voronoiGrp;
    var data;
    var voronoiData;

    d3.selectAll("path.voronoiCell").remove();
    data = d3
      .nest()
      .key(function (d) {
        return mXScale(mFormatYear(d.YearLabel)) + "," + mYScale(d.Value);
      })
      .rollup(function (v) {
        return v[0];
      })
      .entries(
        d3.merge(
          // 12Feb2021  mChartGroupedData.map(function(d) {
          mChartGroupedDataWithGapValues.map(function (d) {
            return d.values;
          })
        )
      )
      .map(function (d) {
        // 5Apr2018  return d.values;
        return d.value;
      });

    // 5Apr2018  voronoiData = mVoronoi(data);
    voronoiData = mVoronoi.polygons(data);

    voronoiGrp = mChartSVGGroup.append("g").attr("class", "voronoiGrp");

    voronoiGrp
      .selectAll(".voronoiCell")
      .data(voronoiData)
      .enter()
      .append("path")
      .attr("class", "voronoiCell")
      .filter(function (d) {
        return d !== undefined;
      })
      .attr("d", function (d) {
        return "M" + d.join("L") + "Z";
      })
      .datum(function (d) {
        // 5Apr2018 return d.point;
        return d.data; // 5Apr2018
      })
      // 5Apr2018  .style("stroke", "#d3d3d3")
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", lineMouseoverEventHandler)
      .on("mouseout", lineMouseoutEventHandler);
  }

  function getYAxisTitleText() {
    var dataTypeLabel = mConfig.DataParameters.getDataTypeLabel();
    return dataTypeLabel;
  }

  function updateYAxisTitle() {
    var isYAxisTitleElemEmpty;
    var containerElem = d3.select(".y.axis");
    isYAxisTitleElemEmpty = d3.select(".yAxisTextLineChart").empty();
    if (isYAxisTitleElemEmpty) {
      containerElem
        .append("text")
        .attr("class", "yAxisTextLineChart")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - mMargin.left + 5)
        .attr("x", 0 - mChartHeight / 2)
        .attr("dy", ".71em")
        .attr("font-size", function () {
          if (mConfig.DeviceType === "mobile") {
            return "0px";
          }
          return "12px";
        })
        .style("text-anchor", "middle")
        .text(function () {
          return getYAxisTitleText();
        });
    } else {
      d3.select(".yAxisTextLineChart").text(function () {
        return getYAxisTitleText();
      });
    }
  }

  // 11Feb2021
  function updateXYScaleDomains() {
    const yearsList = mAllYearsData.YearsList;

    mXScale.domain(
      d3.extent(yearsList, function (d) {
        return mFormatYear(d.YearLabel);
      })
    );

    // 9Jan2020
    if (mIsYAxisTg100BtnActive === true) {
      mYScale.domain([0, 100]);
    } else {
      mYScale.domain([0, mMaxVal]);
    }
  }

  // 11Feb2021
  function getLineWidth(d) {
    if (+d.key === 0) {
      return 3;
    }
    const idx = mSelectedStatesList.indexOf(+d.key); // 18Mar2022
    if (idx !== -1) {
      return 3;
    }
    return 1;
  }

  // 11Feb2021
  function getLineColor(d) {
    var index;

    if (+d.key === 0) {
      return "#000000";
    }
    index = mSelectedStatesList.indexOf(+d.key);
    if (index !== -1) {
      return getColor(+d.key);
    }
    return "#c9c9c9";
  }

  // 11Feb2021
  function getLineOpacity(d) {
    var index;

    if (+d.key === 0) {
      return 1;
    }
    index = mSelectedStatesList.indexOf(+d.key);
    if (index !== -1) {
      return 1;
    }
    return 0.5;
  }

  // 11Feb2021
  function getCircleRadius(d) {
    if (+d.GeoID === 0 && mConfig.DeviceType === mLargeDeviceModeName) {
      return 2.5;
    }
    if (
      mSelectedStatesList.indexOf(+d.GeoID) === -1 ||
      mConfig.DeviceType === mSmallDeviceModeName
    ) {
      return 0;
    }

    return null;
  }

  // 11Feb2021
  function getLineDashArray(d) {
    const isNoDataSuppressed = evalIsNoDataSuppressedCondition(d.key);
    if (isNoDataSuppressed) {
      return "7,5";
    }
    return null;
  }

  // 11Feb2021
  function getCircleColor(d) {
    if (+d.GeoID === 0) {
      return "#000000";
    }
    return getAssignedColor(+d.GeoID);
  }

  // 11Feb2021
  function renderChart() {
    var yearsList;
    var states;
    var index;
    var isNoDataSuppressed;
    var t = d3.transition().duration(350);
    var statesG;
    // var dataType;
    var dataPointCircles;
    var dataTypeID;
    var gapLineG;

    dataTypeID = mConfig.DataParameters.getDataTypeID();
    yearsList = mAllYearsData.YearsList;

    updateXYScaleDomains();

    mChartSVGGroup.select(".x.axis").call(mXAxis);

    mChartSVGGroup
      .selectAll(".x.axis text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("dx", function () {
        return mConfig.DeviceType === mSmallDeviceModeName
          ? "-0.95em"
          : "-0.75em";
      })
      .attr("dy", function () {
        return mConfig.DeviceType === mSmallDeviceModeName
          ? "0.70em"
          : "0.60em";
      })
      .attr("font-size", function () {
        return mConfig.DeviceType === mSmallDeviceModeName ? "8px" : "11px";
      });

    mChartSVGGroup.select(".y.axis").call(mYAxis);

    // JOIN new data with old elements
    states = mChartSVGGroup
      .selectAll("g.state")
      .data(mChartGroupedData, function (d) {
        return d.key;
      });

    // EXIT old elements not present in new data
    states
      .exit()
      .attr("class", "state")
      .transition(t)
      .style("fill-opacity", 0)
      .remove();

    // UPDATE old elements present in new data
    states
      .select("path.line")
      .transition(t)
      .attr("d", function (d) {
        return mLineDef(d.values);
      })
      .style("stroke-width", function (d) {
        return getLineWidth(d);
      })
      .style("stroke", function (d) {
        return getLineColor(d);
      })
      .style("stroke-opacity", function (d) {
        return getLineOpacity(d);
      });

    // ENTER new elements present in new data.
    statesG = states.enter().append("g").attr("class", "state");
    statesG
      .append("path")
      .attr("class", "line")
      .attr("id", function (d) {
        return "tag" + +d.key;
      })
      .attr("d", function (d) {
        return mLineDef(d.values);
      })
      .style("stroke-width", function (d) {
        return getLineWidth(d);
      })
      .style("stroke", function (d) {
        return getLineColor(d);
      })
      .style("stroke-opacity", function (d) {
        return getLineOpacity(d);
      });

    // GAP LINES
    if (!$(".gaplineG").length) {
      gapLineG = mChartSVGGroup
        .append("g")
        .attr("class", "gaplineG")
        .selectAll(".gapline")
        .data(mChartGroupedDataWithGapValues, function (d) {
          return d.key;
        });
    } else {
      gapLineG = d3
        .select(".gaplineG")
        .selectAll(".gapline")
        .data(mChartGroupedDataWithGapValues, function (d) {
          return d.key;
        });
    }
    // EXIT
    gapLineG.exit().attr("class", "gapline").remove();

    // UPDATE
    gapLineG
      .attr("class", function (d) {
        return "gapline L" + d.key;
      })
      .attr("d", function (d) {
        return mLineDef(d.values);
      })
      .style("stroke", function (d) {
        return getLineColor(d);
      })
      .style("stroke-width", function (d) {
        return getLineWidth(d);
      })
      .style("stroke-dasharray", function (d) {
        return getLineDashArray(d);
      })
      .style("stroke-opacity", function (d) {
        return getLineOpacity(d);
      });

    // ENTER
    gapLineG
      .enter()
      .append("path")
      .attr("class", function (d) {
        return "gapline L" + d.key;
      })
      .attr("id", function (d) {
        return "gap" + +d.key;
      })
      .attr("d", function (d) {
        return mLineDef(d.values);
      })
      .style("stroke", function (d) {
        return getLineColor(d);
      })
      .style("stroke-width", function (d) {
        return getLineWidth(d);
      })
      .style("stroke-dasharray", function (d) {
        return getLineDashArray(d);
      })
      .style("stroke-opacity", function (d) {
        return getLineOpacity(d);
      });

    if (mConfig.DrawLineLabel) {
      drawLineLabels();
    }

    addAllStatesMedianLine();
    checkForMethodChangeCondition();
    addVoronoiCellLayer();
    updateYAxisTitle();
  }

  /*  publicAPI.reload = function () {
    $("#" + mConfig.LineChartDivID).empty();
    setChartSize(0.62);
    addSVG();
    setSVGSize();
    defineScales();
    defineAxes();
    setLineDefinition();
    createVoronoiLayerDefinition();
    renderAxes();
    renderChart();
  }; */

  function setFooter() {
    var methodChangeURL;
    var methodChangeDisplayText;
    var methodChangeInfo;
    var $FootnotesDiv;

    $FootnotesDiv = $("#" + mConfig.LineChartID + "Footer");
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
      $FootnotesDiv.append("<br>");
    }

    $FootnotesDiv.append("<label></label>");
    $FootnotesDiv
      .find("label")
      .last()
      .html(
        'Horizontal dotted line indicates "No Data", "Suppressed Data" or both.'
      );
  }

  function addFooter() {
    if (mConfig.HasFooter) {
      $("#" + mConfig.LineChartID + "Footer").remove();
      $("#" + mConfig.ParentID).append(
        "<div id='" +
          mConfig.LineChartID +
          "Footer' class='w-100 p-2 small text-center'></div>"
      );
      setFooter();
    }
  }

  function createChart() {
    const $ParentContainer = $("#" + mConfig.ParentID);
    $ParentContainer.empty();
    setChartSize();
    addSVG();
    setSVGSize();
    setData();
    defineScales();
    defineAxes();
    setLineDefinition();
    createVoronoiLayerDefinition();
    renderAxes();
    renderChart();
    addFooter();
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
    const currentDataType = mConfig.DataParameters.getDataType();
    const currentMeasureName = mConfig.DataParameters.getMeasureName();
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

  function addAllStatesMedianData(csvArray) {
    var medianVal;
    var medianLowerLimit;
    var medianUpperLimit;
    const currentDataType = mConfig.DataParameters.getDataType();

    if (
      mAllYearsData.AllStatesMedianData.Data &&
      currentDataType === "EstimateValue"
    ) {
      mAllYearsData.AllStatesMedianData.Data.forEach(function (d) {
        if (d.IsSuppressed) {
          medianVal = "Suppressed";
          medianLowerLimit = "Suppressed";
          medianUpperLimit = "Suppressed";
        } else if (d.IsNoData) {
          medianVal = "No Data";
          medianLowerLimit = "No Data";
          medianUpperLimit = "No Data";
        } else {
          medianVal = d.Value;
          medianLowerLimit = d.LowerLimit;
          medianUpperLimit = d.UpperLimit;
        }

        csvArray.push(
          d.YearLabel +
            "," +
            mAllYearsData.AllStatesMedianData.DataTypeLabel +
            "," +
            medianVal +
            "," +
            medianLowerLimit +
            "," +
            medianUpperLimit
        );
      });
    }

    return csvArray;
  }

  function createCSVDataRows(csvArray) {
    const currentDataType = mConfig.DataParameters.getDataType();
    if (currentDataType === "EstimateValue") {
      mUnFilteredChartData.forEach(function (d) {
        csvArray.push(
          d.YearLabel +
            "," +
            d.GeoLabel +
            "," +
            d.Value +
            "," +
            d.LowerLimit +
            "," +
            d.UpperLimit
        );
      });
    } else {
      // NumberValue
      mUnFilteredChartData.forEach(function (d) {
        csvArray.push(d.YearLabel + "," + d.GeoLabel + "," + d.Value);
      });
    }

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
    const downloadFileName = "DiabetesAtlas_AllStatesLineChartData.csv";

    csvHeader = getCSVHeader();
    csvArray.push(csvHeader);

    csvDate = "Data downloaded on " + mHelperUtil.getTodaysDate();
    csvArray.push(csvDate);

    const csvDataHeader = getCSVDataHeader();
    csvArray.push(csvDataHeader);

    csvArray = addAllStatesMedianData(csvArray);

    csvArray = createCSVDataRows(csvArray);

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
    var currentIndicatorName = mConfig.DataParameters.getIndicatorName();
    var currentDataTypeLabel = mConfig.DataParameters.getDataTypeLabel();
    var currentDatasetLabel = mConfig.DataParameters.getDatasetLabel();
    var currentMeasureName = mConfig.DataParameters.getMeasureName();
    var currentSubmeasureLabel = mConfig.DataParameters.getSubmeasureLabel();
    var currentAgeClassificationType =
      mConfig.DataParameters.getAgeClassificationType();
    var currentDataType = mConfig.DataParameters.getDataType();
    var medianVal;
    var medianLowerLimit;
    var medianUpperLimit;
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
    } else {
      if (currentDataType === "NumberValue") {
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

    if (currentDataType === "EstimateValue") {
      // AllStatesMedian 25Jan2018
      if (mAllYearsData.AllStatesMedianData.Data) {
        mAllYearsData.AllStatesMedianData.Data.forEach(function (d) {
          if (d.IsSuppressed) {
            medianVal = "Suppressed";
            medianLowerLimit = "Suppressed";
            medianUpperLimit = "Suppressed";
          } else if (d.IsNoData) {
            medianVal = "No Data";
            medianLowerLimit = "No Data";
            medianUpperLimit = "No Data";
          } else {
            medianVal = d.Value;
            medianLowerLimit = d.LowerLimit;
            medianUpperLimit = d.UpperLimit;
          }

          csvArray.push(
            d.YearLabel +
              "," +
              mAllYearsData.AllStatesMedianData.DataTypeLabel +
              "," +
              medianVal +
              "," +
              medianLowerLimit +
              "," +
              medianUpperLimit
          );
        });
      }

      mUnFilteredChartData.forEach(function (d) {
        csvArray.push(
          d.YearLabel +
            "," +
            d.GeoLabel +
            "," +
            d.Value +
            "," +
            d.LowerLimit +
            "," +
            d.UpperLimit
        );
      });
    } else if (currentDataType === "NumberValue") {
      mUnFilteredChartData.forEach(function (d) {
        csvArray.push(d.YearLabel + "," + d.GeoLabel + "," + d.Value);
      });
    }

    csvArray.push(csvFooter);

    // 26Jul2020 csvArray = csvArray.join("\\n");
    csvArray = csvArray.join("\r\n"); // 26Jul2020
    downloadFileName = "DiabetesAtlasData.csv";

    // 26Jul2020
    csvFileDownload = new CSVFileDownload();
    csvConfig = {
      CSVContent: csvArray,
      Filename: downloadFileName
    };
    csvFileDownload.downloadCSV(csvConfig);
  }; */

  /*  // 02Mar2022
  publicAPI.downloadPPT = function (token) {
    var canvasdata;
    var canvas;
    var context;
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
    var scrubbedSVGElem;
    var customHeading;
    var pptFileName = "LineChart";
    var callType = "PowerPoint";
    var str;
    var chartType = "AllStatesLineChart"; // 22Jul2020
    var pptPostSubmitForm; // 22Jul2020
    var formConfig; // 22Jul2020

    canvas = document.getElementById("canvasImageCreation"); // 11Nov2020
    context = canvas.getContext("2d");

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

    svgDiv = $("#" + mConfig.LineChartDivID + " svg");
    svgDiv.prepend("\n<style type='text/css'></style>");
    svgDiv.find("style").html("\n<![CDATA[" + style + "]]>\n");

    svgElem = d3
      .select("#" + mConfig.LineChartDivID)
      .select("svg")
      .attr("version", 1.1)
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .node().parentNode.innerHTML;

    context.clearRect(0, 0, canvas.width, canvas.height);
    scrubbedSVGElem = scrubSVG(svgElem);
    canvg(canvas, scrubbedSVGElem, {
      
    });
    canvasdata = canvas.toDataURL("image/png");
    canvasdata = canvasdata.replace("/^data:image/png|jpg;base64", "/", "");

    currentIndicatorName = mConfig.DataParameters.getIndicatorName();
    currentAgeClassificationType =
      mConfig.DataParameters.getAgeClassificationType();
    currentDataTypeLabel = mConfig.DataParameters.getDataTypeLabel();
    currentDatasetLabel = mConfig.DataParameters.getDatasetLabel();
    currentMeasureName = mConfig.DataParameters.getMeasureName();
    currentSubmeasureLabel = mConfig.DataParameters.getSubmeasureLabel();
    currentDataType = mConfig.DataParameters.getDataType();

    // 12Feb2019
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
          ", U.S. States";
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
          ", U.S. States";
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
        ", U.S. States";
    } else {
      if (currentDataType === "NumberValue") {
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
          ", U.S. States";
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
          ", U.S. States";
      }
    }

    // 22Jul2020
    pptPostSubmitForm = new PPTPostSubmitForm();
    formConfig = {
      CallType: callType,
      ChartType: chartType,
      ChartTitle: customHeading,
      LegendTitle: null,
      IndicatorName: currentIndicatorName,
      Canvasdata: canvasdata,
      LegendCanvasData: null,
      PPTFileName: pptFileName,
      Token: token
    };
    pptPostSubmitForm.submit(formConfig);
  }; */

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
      ", U.S. States";

    const headingTotalNumberValue =
      currentIndicatorName +
      ", " +
      currentMeasureName +
      ", " +
      currentDatasetLabel +
      ", " +
      currentDataTypeLabel +
      ", U.S. States";

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
      ", U.S. States";

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
      ", U.S. States";

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
    const style = getStyle();

    const svgDiv = $("#" + mConfig.LineChartID + " svg");
    svgDiv.prepend("\n<style type='text/css'></style>");
    svgDiv.find("style").html("\n<![CDATA[" + style + "]]>\n");

    const svgElem = d3
      .select("#" + mConfig.LineChartID)
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

    const pptFileName = "DiabetesAtlas_AllStatesLineChart";
    const callType = "PowerPoint";
    const currentIndicatorName = mConfig.DataParameters.getIndicatorName();
    const chartType = "AllStatesLineChart";
    const pptPostSubmitForm = new PPTPostSubmitForm();
    const formConfig = {
      CallType: callType,
      ChartType: chartType,
      ChartTitle: pptHeading,
      LegendTitle: null,
      IndicatorName: currentIndicatorName,
      Canvasdata: canvasdata,
      LegendCanvasData: null,
      PPTFileName: pptFileName,
      Token: token
    };
    pptPostSubmitForm.submit(formConfig);
  }

  function removeEventListeners() {
    window.removeEventListener("resize", createChart);
    publicAPI["on" + mConfig.ChangeEventTypesList.Viz2ContainerResizedEvent] =
      function () {
        // empty function
      };
  }

  function addEventListeners() {
    window.addEventListener("resize", createChart);
    publicAPI["on" + mConfig.ChangeEventTypesList.Viz2ContainerResizedEvent] =
      function () {
        createChart();
      };
  }

  publicAPI.downloadCSV = function () {
    downloadCSV();
  };

  publicAPI.downloadPPT = function (token) {
    downloadPPT(token);
  };

  publicAPI.dispose = function () {
    removeEventListeners();
  };

  publicAPI.onClearAllSelections = function (updatedSelectedItemsList) {
    mSelectedStatesList = updatedSelectedItemsList;
    setData();
    renderChart();
  };

  /*  // 01Mar2022
  // 11Dec2019
  publicAPI.onLineChartYAxisTgBtn100ToInActive = function () {
    mYScale.domain([0, mMaxVal]);
    renderChart();
  };

  // 11Dec2019
  publicAPI.onLineChartYAxisTgBtn100ToActive = function () {
    mYScale.domain([0, 100]);
    renderChart();
  };

  // 8Jan2020
  publicAPI.onLineChartYAxisTgBtn100ToInActive = function () {
    mIsYAxisTg100BtnActive = false; // 9Jan2020
    renderChart();
  };

  // 8Jan2020
  publicAPI.onLineChartYAxisTgBtn100ToActive = function () {
    mIsYAxisTg100BtnActive = true; // 9Jan2020
    renderChart();
  }; */

  publicAPI.update = function (updateConfig) {
    mSelectedStatesList = updateConfig.SelectedStatesList;
    mConfig.DataParameters = updateConfig.DataParameters;
    mConfig.BusinessData = updateConfig.BusinessData;
    mConfig.SubmeasuresColorsList = updateConfig.SubmeasuresColorsList;
    mIsYAxisTg100BtnActive = false; // 9Jan2020

    setData();
    defineAxes();
    setLineDefinition();
    createVoronoiLayerDefinition();
    if (mChartSVGGroup.select(".x.axis").empty()) {
      renderAxes();
    } else {
      // 9Jan2020
      // 4Mar2021 loadYAxisToggleBtn();
    }
    renderChart();
  };

  publicAPI.init = function (config) {
    mConfig = config;
    mFormatThousands = d3.format(".2s");
    mSelectedStatesList = config.SelectedStatesList;
    mFormatYear = d3.timeParse("%Y");
    mHelperUtil = new HelperUtil();
    createChart();
    addEventListeners();
  };
  return publicAPI;
}
export default AllStatesLineChart;
