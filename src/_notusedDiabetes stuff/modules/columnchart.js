import $ from "jquery";
import canvg from "canvgModule";
import Handlebars from "Handlebars";
import * as d3 from "../lib/d3_v4-min";
import HelperUtil from "../modules/helperutils";
import CSVFileDownload from "../modules/csvFileDownload";
import PPTPostSubmitForm from "../modules/pptPostSubmitForm";
import Slider from "../modules/slider";
import sliderplayerTemplateHTML from "../HtmlTemplates/sliderplayer.html";
import RadioBtnListTemplateHTML from "../HtmlTemplates/RadioList.html";
import legendTemplateHTML from "../HtmlTemplates/legend.html";

function ColumnChart() {
  var publicAPI = {};
  var mSortMode;
  var mSortModeList;
  var mConfig;
  var mHelperUtil;
  var mMargin;
  var mChartSVGHeight;
  var mChartHeight;
  var mChartSVGWidth;
  var mChartWidth;
  var mMediator;
  var mChartSVG;
  var mChartSVGGroup;
  var mChartData;
  var mCurrentYearData;
  var mAllYearsData;
  var mCurrentYearAllStatesMedianData;
  var mSuppressedFlagID = -2;
  var mNoDataFlagID = -1;
  var mInActiveFlagID = -3;
  var mInActiveColor = "#FFFFFF";
  var mMaxVal;
  var mActiveLegendItems = [];
  var mLegendData;
  var mXScale;
  var mYScale;
  var mXAxis;
  var mYAxis;
  var mStates;
  var mSelectedStatesList = [];
  var mSliderMod;
  var mFormatThousands;

  function registerHandlebarsHelperMethods() {
    Handlebars.registerHelper("setRadBtnListID", function (suffix, radBtnID) {
      return "radBtnList" + suffix + "_" + radBtnID;
    });

    Handlebars.registerHelper("setRadBtnID", function (suffix, radBtnID) {
      return "radBtn" + suffix + "_" + radBtnID;
    });

    Handlebars.registerHelper("setRadBtnGroupName", function (suffix) {
      return "radBtnGrp" + suffix;
    });
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
    const currentYear = mConfig.DataParameters.getYear();
    const currentSubmeasureLabel = mConfig.DataParameters.getSubmeasureLabel();
    var currentYearLabel = mAllYearsData.YearsList.find(function (a) {
      return a.YearID === currentYear;
    }).YearLabel;

    const currentAgeClassificationType =
      mConfig.DataParameters.getAgeClassificationType();
    const currentDataType = mConfig.DataParameters.getDataType();

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

    const csvHeader1 =
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
      "U.S. States; " +
      currentYearLabel;

    const csvHeader2 =
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
      "U.S. States; " +
      currentYearLabel;

    const csvHeader3 =
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
      "U.S. States; " +
      currentYearLabel;

    if (currentMeasureName === "Age") {
      return csvHeader1;
    }
    if (currentMeasureName === "Total") {
      return csvHeader2;
    }
    return csvHeader3;
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
      return "State," + commaStrippedCurrentDataTypeLabel;
    }
    return (
      "State," + commaStrippedCurrentDataTypeLabel + ",Lower Limit, Upper Limit"
    );
  }

  function addAllStatesMedianData(csvArray) {
    const currentDataType = mConfig.DataParameters.getDataType();

    if (currentDataType !== "NumberValue" && mCurrentYearAllStatesMedianData) {
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

  function createCSVDataRows(csvArray) {
    var val;
    var displayVal;
    var lowerLimit;
    var upperLimit;
    const currentDataType = mConfig.DataParameters.getDataType();

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
        if (currentDataType === "NumberValue") {
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

  function downloadCSV() {
    var csvArray = [];
    var csvHeader;
    var csvDate;
    const csvFooter =
      "US Diabetes Surveillance System; www.cdc.gov/diabetes/data; Division of Diabetes Translation - Centers for Disease Control and Prevention.";
    var csvFileDownload;
    var csvConfig;
    const downloadFileName = "DiabetesAtlas_AllStatesBarChartData.csv";

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

  // 27Apr2022
  function setCanvasImageCreationToDefault() {
    d3.select("#canvasImageCreation")
      .attr("width", "960px")
      .attr("height", "700px")
      .attr("style", "display:none");
  }

  // 27Apr2022
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
      .attr("font-size", "10px") // 27Apr2022
      .attr("fill", "#000000")
      .text(suppressedDataLabel);

    // 27Apr2022  $("#svgLegendParentDiv").width(rectWidth + 75);
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

  // 27Apr2022
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

  // 27Apr2022
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

    const svgDiv = $("#" + mConfig.BarChartID + " svg");
    svgDiv.prepend("\n<style type='text/css'></style>");
    svgDiv.find("style").html("\n<![CDATA[" + style + "]]>\n");

    const svgElem = d3
      .select("#" + mConfig.BarChartID)
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
    const pptFileName = "DiabetesAtlas_AllStatesBarChart";
    const callType = "PowerPoint";
    const currentIndicatorName = mConfig.DataParameters.getIndicatorName();
    const chartType = "AllStatesBar";
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

  function setChartSize() {
    const heightFactor = 0.62;
    // 24Feb2022 $Container = $("#" + mConfig.ColumnChartDivID);
    const $Container = $("#" + mConfig.ParentID); // 17Feb2022
    mMargin = { top: 20, right: 20, bottom: 40, left: 53 };

    mChartSVGHeight = heightFactor * $Container.width();
    mChartSVGWidth = $Container.width() - 10;

    mChartWidth = mChartSVGWidth - mMargin.left - mMargin.right;
    mChartHeight = mChartSVGHeight - mMargin.top - mMargin.bottom;
  }

  function addSortButtons() {
    var compiledTemplateHTML;
    var generatedHTML;
    var groupName = "ColumnSort";
    var templateConfig;
    var radBtnList = [
      { ID: "Name", Name: "Sort by Name" },
      { ID: "Value", Name: "Sort by Value" }
    ];

    /*  // 24Feb2022
     $("#" + mConfig.ColumnChartDivID).append(
      '<div id="divSortBtnColumnChart" class="mt-2"></div>'
    ); */

    $("#" + mConfig.ParentID).append(
      '<div id="divSortBtnColumnChart" class="d-flex flex-row justify-content-center align-items-center gap-2 mt-2"></div>'
    );

    templateConfig = {
      GroupName: groupName,
      RadioList: radBtnList,
      RelID: "js-SortItem" // 02Mar2022
    };

    compiledTemplateHTML = Handlebars.compile(RadioBtnListTemplateHTML);
    generatedHTML = compiledTemplateHTML(templateConfig);

    $("#divSortBtnColumnChart").append(generatedHTML);

    if (mSortMode === mSortModeList.ByName) {
      $("#radBtnColumnSort_Name").prop("checked", true);
    } else {
      $("radBtnColumnSort_Value").prop("checked", true);
    }
  }

  function addSVG() {
    var $BarChartDiv;

    // 17Feb2022
    const $ParentDiv = $("#" + mConfig.ParentID);
    const barChartID = mConfig.BarChartID;

    $ParentDiv.append("<div id='" + barChartID + "' class='w-100'></div>");
    $BarChartDiv = $("#" + barChartID);
    $BarChartDiv.append("<div id='" + barChartID + "SVG' ></div>");
    mChartSVG = d3.select("#" + barChartID + "SVG").append("svg");
  }

  function setSVGSize() {
    mChartSVG.attr("viewBox", "0 0 " + mChartSVGWidth + " " + mChartSVGHeight);

    mChartSVGGroup = mChartSVG
      .append("g")
      .attr("transform", "translate(" + mMargin.left + "," + mMargin.top + ")");
  }

  // TODO: Add to EventListener function
  $(document).on("click", "#divSortBtnColumnChart input", function (evt) {
    var clickedElemID;

    clickedElemID = $(evt.target).attr("id");
    $(evt.target).prop("checked", true);

    if (clickedElemID === "radBtnColumnSort_Name") {
      mSortMode = mSortModeList.ByName;
      mChartData = sortData(mChartData);
    } else if (clickedElemID === "radBtnColumnSort_Value") {
      mSortMode = mSortModeList.ByValue;
      mChartData = sortData(mChartData);
    }
    renderChart();
  });

  function sortData(data) {
    if (mSortMode === mSortModeList.ByValue) {
      data.sort(function (a, b) {
        return a.Value - b.Value;
      });
    } else if (mSortMode === mSortModeList.ByName) {
      data.sort(function (a, b) {
        return d3.ascending(a.GeoABBR, b.GeoABBR);
      });
    }

    return data;
  }

  function getTotalMeasureAllYearsData() {
    var currentMeasureData;
    var ageClassificationConditionReducer;
    var currentAgeClassificationType;
    var dataClassificationConditionReducer;
    var currentDataClassificationType;
    var currentMeasureID;
    var totalMeasureID = 40;

    currentMeasureID = mConfig.DataParameters.getMeasureID();
    if (currentMeasureID !== totalMeasureID) {
      return null;
    }

    currentMeasureData = mConfig.BusinessData.MeasureData;
    currentAgeClassificationType =
      mConfig.DataParameters.getAgeClassificationType();
    currentDataClassificationType =
      mConfig.DataParameters.getDataClassificationType();

    ageClassificationConditionReducer = {
      "Age-Adjusted": currentMeasureData.Data.AgeAdjustedData,
      Crude: currentMeasureData.Data.CrudeData
    };

    dataClassificationConditionReducer = {
      "Natural Breaks":
        ageClassificationConditionReducer[currentAgeClassificationType]
          .NaturalBreaksData,
      Quartiles:
        ageClassificationConditionReducer[currentAgeClassificationType]
          .QuartilesData
    };

    return dataClassificationConditionReducer[currentDataClassificationType];
  }

  function getAgeMeasureAllYearsData() {
    var currentSubmeasureData;
    var currentMeasureData;
    var currentSubmeasureID;
    var dataClassificationConditionReducer;
    var currentDataClassificationType;
    var currentMeasureID;
    var ageMeasureID = 41;

    currentMeasureID = mConfig.DataParameters.getMeasureID();
    if (currentMeasureID !== ageMeasureID) {
      return null;
    }

    currentMeasureData = mConfig.BusinessData.MeasureData;
    currentSubmeasureID = mConfig.DataParameters.getSubmeasureID();
    currentDataClassificationType =
      mConfig.DataParameters.getDataClassificationType();

    currentSubmeasureData = currentMeasureData.Data.filter(function (a) {
      return a.SubmeasureID === currentSubmeasureID;
    })[0];

    dataClassificationConditionReducer = {
      "Natural Breaks": currentSubmeasureData.NaturalBreaksData,
      Quartiles: currentSubmeasureData.QuartilesData
    };

    return dataClassificationConditionReducer[currentDataClassificationType];
  }

  function getGenderRaceEducationMeasureAllYearsData() {
    var currentMeasureData;
    var ageClassificationConditionReducer;
    var currentDataClassificationType;
    var currentAgeClassificationType;
    var currentSubmeasureData;
    var currentSubmeasureID;
    var dataClassificationConditionReducer;
    var currentMeasureID;
    var genderMeasureID = 42;
    var educationMeasureID = 44;
    var raceMeasureID = 43; // 11Feb2021

    currentMeasureID = mConfig.DataParameters.getMeasureID();
    if (
      currentMeasureID !== genderMeasureID &&
      currentMeasureID !== educationMeasureID &&
      currentMeasureID !== raceMeasureID
    ) {
      return null;
    }
    currentMeasureData = mConfig.BusinessData.MeasureData;
    currentDataClassificationType =
      mConfig.DataParameters.getDataClassificationType();
    currentAgeClassificationType =
      mConfig.DataParameters.getAgeClassificationType();
    currentSubmeasureID = mConfig.DataParameters.getSubmeasureID();

    ageClassificationConditionReducer = {
      "Age-Adjusted": currentMeasureData.Data.AgeAdjustedData,
      Crude: currentMeasureData.Data.CrudeData
    };

    currentSubmeasureData = ageClassificationConditionReducer[
      currentAgeClassificationType
    ].filter(function (a) {
      return a.SubmeasureID === currentSubmeasureID;
    })[0];

    dataClassificationConditionReducer = {
      "Natural Breaks": currentSubmeasureData.NaturalBreaksData,
      Quartiles: currentSubmeasureData.QuartilesData
    };

    return dataClassificationConditionReducer[currentDataClassificationType];
  }

  function getAllYearsData() {
    var currentMeasureID;
    var measureConditionReducer;

    currentMeasureID = mConfig.DataParameters.getMeasureID();

    measureConditionReducer = {
      40: getTotalMeasureAllYearsData(),
      41: getAgeMeasureAllYearsData(),
      42: getGenderRaceEducationMeasureAllYearsData(),
      43: getGenderRaceEducationMeasureAllYearsData(), // 11Feb2021
      44: getGenderRaceEducationMeasureAllYearsData()
    };

    return measureConditionReducer[currentMeasureID];
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

  // 01Mar2022
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
  // 01Mar2022
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

  function setLegendData() {
    mLegendData = mCurrentYearData.LegendData;
    if (!mActiveLegendItems.length) {
      mActiveLegendItems = getDefaultActiveLegendItems();
      mMediator.broadcast("ActiveLegendItemsResetEvent", [mActiveLegendItems]);
    }
  }

  function setData() {
    var val;

    var displayVal;
    var lowerLimit;
    var upperLimit;

    var chartDataObj;
    mChartData = [];

    mCurrentYearData = getCurrentYearData();
    if (mAllYearsData.AllStatesMedianData.Data) {
      mCurrentYearAllStatesMedianData = getCurrentYearAllStatesMedianData();
    }
    setLegendData();

    mCurrentYearData.Data.forEach(function (d) {
      chartDataObj = $.extend(true, {}, d);
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
        chartDataObj.Value = val;
        chartDataObj.DisplayVal = displayVal;
        chartDataObj.LowerLimit = lowerLimit;
        chartDataObj.UpperLimit = upperLimit;
      } else {
        chartDataObj.Value = mInActiveFlagID;
        chartDataObj.Color_HexVal = mInActiveColor;
      }
      mChartData.push(chartDataObj);
    });

    mMaxVal = d3.max(mChartData, function (m) {
      return m.Value;
    });
    sortData(mChartData);
  }

  function defineScales() {
    mXScale = d3
      .scaleBand()
      .range([0, mChartWidth])
      .padding(0.1)
      .domain(
        mChartData.map(function (d) {
          return d.GeoABBR;
        })
      );

    mYScale = d3.scaleLinear().range([mChartHeight, 0]).domain([0, mMaxVal]);
  }

  function defineAxes() {
    mXAxis = d3.axisBottom(mXScale);
    mYAxis = d3.axisLeft(mYScale).tickFormat(function (d) {
      const dataType = mConfig.DataParameters.getDataType();
      if (dataType === "NumberValue") {
        return mFormatThousands(d);
      }
      return d;
    });
  }

  function renderAxes() {
    mChartSVGGroup
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + mChartHeight + ")")
      .call(mXAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("dx", "-0.45em")
      .attr("dy", "-0.55em");

    mChartSVGGroup.append("g").attr("class", "y axis ColumnChart").call(mYAxis);
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

    val = mChartData.filter(function (m) {
      return m.GeoABBR === d.GeoABBR;
    })[0].Value;
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

    h5Txt =
      '<div class="popup">' +
      h5Txt +
      "<span><label style='font-size:13px;font-weight:bold'>" +
      dataTypeLabel +
      "</label> : <label style='font-size:25px'>" +
      displayVal +
      "</label>";

    return h5Txt;
  }

  function getGeoID(geoABBR) {
    var geoID;
    var result;

    result = mChartData.filter(function (d) {
      return d.GeoABBR === geoABBR;
    });

    geoID = parseFloat(result[0].GeoID);
    return geoID;
  }

  function highlightSelectedStates() {
    var geoID;

    mChartSVGGroup.selectAll(".bar").style("stroke", function (k) {
      return mSelectedStatesList.indexOf(k.GeoID) > -1 ? "yellow" : "#ADADAD";
    });

    mChartSVGGroup
      .select(".x.axis")
      .selectAll(".tick")
      .each(function (m) {
        geoID = getGeoID(m);
        if (mSelectedStatesList.indexOf(geoID) > -1) {
          d3.select(this).selectAll("text").style("fill", "red");
        } else {
          d3.select(this).selectAll("text").style("fill", "#aaa");
        }
      });
  }

  function endAll(transition, callback) {
    var n;

    if (transition.empty()) {
      callback();
    } else {
      n = transition.size();
      transition.on("end", function () {
        n--;
        if (n === 0) {
          callback();
        }
      });
    }
  }

  function columnClickEventHandler(d) {
    var clickedGeoID;
    var geoIDIndex;
    var selectedStatesData;
    var eventBroadcastName;

    clickedGeoID = +d.GeoID;
    geoIDIndex = mSelectedStatesList.indexOf(clickedGeoID);
    if (geoIDIndex === -1) {
      mSelectedStatesList.push(clickedGeoID);
      eventBroadcastName = "StateSelected";
    } else {
      mSelectedStatesList.splice(geoIDIndex, 1);
      eventBroadcastName = "StateUnSelected";
    }

    selectedStatesData = {
      ClickedStateGeoID: clickedGeoID,
      SelectedStatesList: mSelectedStatesList
    };
    mMediator.broadcast(eventBroadcastName, [selectedStatesData]);
    highlightSelectedStates();
  }

  function getYAxisTitleText() {
    var yAxisTitle;
    var dataTypeLabel;

    dataTypeLabel = mConfig.DataParameters.getDataTypeLabel();
    yAxisTitle = dataTypeLabel;

    return yAxisTitle;
  }

  function updateYAxisTitle() {
    var isYAxisTitleElemEmpty;
    var containerElem = d3.select(".y.axis.ColumnChart");
    isYAxisTitleElemEmpty = d3.select(".yAxisTextColumnChart").empty();
    if (isYAxisTitleElemEmpty) {
      containerElem
        .append("text")
        .attr("class", "yAxisTextColumnChart")
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
      d3.select(".yAxisTextColumnChart").text(function () {
        return getYAxisTitleText();
      });
    }
  }

  function loadSlider() {
    var config;
    var currentYear;
    var yearsList;
    var deviceType;
    var sliderplayerConfig;
    // 25Feb2022  var $ColumnChartDiv;
    var sliderplayerCompiledTemplateHTML;
    var sliderplayerGeneratedHTML;
    // 25Feb2022 var parentContainerWidth;

    // 25Feb2022 $ColumnChartDiv = $("#" + mConfig.ColumnChartDivID);
    $(document).off("click", "body, #btnPlayColumnChart");

    config = {
      PlayBtnDivID: "divBtnPlayColumnChart",
      PlayBtnID: "btnPlayColumnChart",
      SliderDivID: "divYearSliderColumnChart"
    };

    sliderplayerCompiledTemplateHTML = Handlebars.compile(
      sliderplayerTemplateHTML
    );
    sliderplayerGeneratedHTML = sliderplayerCompiledTemplateHTML(config);
    // 25Feb2022  $ColumnChartDiv.append(sliderplayerGeneratedHTML);
    const $ChartContainer = $("#" + mConfig.ParentID); // 24Feb2022
    $ChartContainer.append(sliderplayerGeneratedHTML);
    currentYear = mConfig.DataParameters.getYear();
    yearsList = mAllYearsData.YearsList;
    deviceType = mConfig.DeviceType;
    // 25Feb2022 parentContainerWidth = 0.95 * $ColumnChartDiv.width();

    sliderplayerConfig = {
      ContainerID: config.SliderDivID,
      ParentID: mConfig.ParentID, // 24Feb2022
      SliderPlayBtnID: config.PlayBtnID,
      CurrentYear: currentYear,
      YearsList: yearsList,
      // 25Feb2022 ParentContainerWidth: parentContainerWidth,
      SliderPlayBtnWidth: 50,
      Mediator: mMediator,
      DeviceType: deviceType,
      SliderChangeEventName: "ColumnChartSliderChangeEvent", // TODO: Change it to ChangeEventsList
      RecordSliderPlayBtnEventName:
        "AllStatesColumnChartSliderPlayBtnClickEvent", // 19Aug2019  // TODO: Change it to ChangeEventsList
      IntervalTime: 1000
    };
    mSliderMod = new Slider();
    mMediator.registerComponent("columnChartSlider", mSliderMod);
    mSliderMod.init(sliderplayerConfig);
  }

  function renderChart() {
    var t;

    t = d3.transition().duration(350);

    mXScale.domain(
      mChartData.map(function (d) {
        return d.GeoABBR;
      })
    );
    mYScale.domain([0, mMaxVal]);

    mChartSVGGroup.select(".y.axis.ColumnChart").call(mYAxis);
    mChartSVGGroup
      .select(".x.axis")
      .call(mXAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("dx", function () {
        return mConfig.DeviceType === "mobile" ? "-1.25em" : "-0.45em";
      })
      .attr("dy", function () {
        return mConfig.DeviceType === "mobile" ? "-0.95em" : "-0.55em";
      })
      .attr("font-size", function () {
        return mConfig.DeviceType === "mobile" ? "6px" : "11px";
      });

    // JOIN new data with old elements.
    mStates = mChartSVGGroup
      .selectAll(".bar")
      .data(mChartData, function (d) {
        return d.GeoABBR;
      })
      .order();

    // TODO: add highlightselectedStates() function to  mStates.enter
    // ENTER new elements present in new data.
    mStates
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return mXScale(d.GeoABBR);
      })
      .attr("y", function (d) {
        return mYScale(d.Value);
      })
      .attr("height", function (d) {
        if (mChartHeight - mYScale(d.Value) < 0) {
          return 0;
        }
        return mChartHeight - mYScale(d.Value);
      })
      .attr("width", mXScale.bandwidth()) // 5Apr2018
      .attr("id", function (d) {
        return d.GeoABBR;
      })
      .style("fill", function (d) {
        return d.Color_HexVal;
      })
      .style("stroke", "#ADADAD")
      .style("stroke-width", "0.5")
      .style("fill-opacity", 1)
      .on("mouseover", function (d) {
        $(this).popover("dispose");
        d3.select(this).transition().duration(300).style("opacity", 0.8);
        d3.select(this).style("cursor", "pointer");

        $(this)
          .popover({
            container: "body",
            title: d.GeoLabel,
            placement: "right",
            sanitize: false,
            html: true,
            content: function () {
              return getTooltipText(d);
            }
          })
          .popover("show");
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(300).style("opacity", 1);
        $(this).popover("dispose");
        $(".popover").remove(); // brute force removal of any lingering popovers
      })
      .on("click", columnClickEventHandler);

    // UPDATE old elements present in new data.
    mStates
      .transition(t)
      .call(endAll, highlightSelectedStates)
      .attr("class", "bar")
      .attr("x", function (d) {
        return mXScale(d.GeoABBR);
      })
      .attr("y", function (d) {
        return mYScale(d.Value);
      })
      .attr("height", function (d) {
        if (mChartHeight - mYScale(d.Value) < 0) {
          return 0;
        }
        return mChartHeight - mYScale(d.Value);
      })
      .style("fill", function (d) {
        return d.Color_HexVal;
      })
      .style("stroke", "#ADADAD")
      .style("stroke-width", "0.5")
      .style("fill-opacity", 1);

    // EXIT old elements not present in new data.
    mStates
      .exit()
      .attr("class", "bar")
      .transition(t)
      .style("fill-opacity", 1e-6)
      .remove();

    updateYAxisTitle();
  }

  function legendClickHandler(evt) {
    var legendItemLabel;
    var index;
    var itemLabel;
    var $chkBxObj;
    var legendItemLabelObj;

    legendItemLabelObj = {
      "No Data": String(mNoDataFlagID),
      Suppressed: String(mSuppressedFlagID)
    };

    if (
      evt.target &&
      evt.target.nodeName.toLowerCase() === "input".toLowerCase()
    ) {
      itemLabel = $(evt.target).val();
      $chkBxObj = $(evt.target);
      // 25Feb2022  } else if (evt.target.className === "dataBox") {
    } else if ($(evt.target).hasClass("da-maplegend-box")) {
      itemLabel = $(evt.target).find("input").val();
      $chkBxObj = $(evt.target).find("input");
    }

    // 25Feb2022 legendItemLabel = legendItemLabelObj[itemLabel] || itemLabel;
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

    setData();
    renderChart();
  }

  function loadColumnChartLegend() {
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
    var $ColumnChartDiv;
    var legendItemVal; // 11Apr2019

    // 25Feb2022 $ColumnChartDiv = $("#" + mConfig.ColumnChartDivID);
    $("#divColumnChartLegend").remove();

    for (let i = 0; i < mLegendData.length; i += 1) {
      displayLabel = mLegendData[i].min + " - " + mLegendData[i].max;
      legendItemVal = mLegendData[i].min + " - " + mLegendData[i].max; // 11Apr2019
      colorHexVal = mLegendData[i].color_hexval;
      // 18Mar2022, DIAB-88  colorStyle = "color:black !important;background-color:" + colorHexVal;

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
      ItemValue: "No Data",
      IsChecked: mActiveLegendItems.indexOf(String(mNoDataFlagID)) > -1
    };
    legendItems.push(legendItemObj);

    // Suppressed Data
    suppressedDataColorHexVal =
      mConfig.DataParameters.getSuppressedDataColorHexVal();

    legendItemObj = {
      ColorStyle:
        "color:black !important; background-color:" + suppressedDataColorHexVal,
      DisplayLabel: "Suppressed",
      ItemValue: "Suppressed",
      IsChecked: mActiveLegendItems.indexOf(String(mSuppressedFlagID)) > -1
    };
    legendItems.push(legendItemObj);

    legendTemplateConfig = {
      LegendDivID: "divColumnChartLegend",
      LegendItems: legendItems
    };

    legendCompiledTemplateHTML = Handlebars.compile(legendTemplateHTML);
    legendGeneratedHTML = legendCompiledTemplateHTML(legendTemplateConfig);
    // 25Feb2022 $ColumnChartDiv.append(legendGeneratedHTML);
    const $ChartContainer = $("#" + mConfig.ParentID); // 25Feb2022
    $ChartContainer.append(legendGeneratedHTML);
  }

  function setFooter() {
    var methodChangeURL;
    var methodChangeDisplayText;
    var methodChangeInfo;
    var $FootnotesDiv;

    $FootnotesDiv = $("#" + mConfig.BarChartID + "Footer");
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
      $("#" + mConfig.BarChartID + "Footer").remove();
      $("#" + mConfig.ParentID).append(
        "<div id='" +
          mConfig.BarChartID +
          "Footer' class='w-100 p-2 small text-center'></div>"
      );
      setFooter();
    }
  }

  /*  // 24Feb2022
  publicAPI.reload = function () {
    $("#" + mConfig.ColumnChartDivID).empty();
    setChartSize(0.62);
    addSortButtons();
    addSVG();
    setSVGSize();
    defineScales();
    defineAxes();
    renderAxes();
    renderChart();
    loadSlider();
    loadColumnChartLegend();
  }; */

  function createChart() {
    const $ParentDiv = $("#" + mConfig.ParentID);
    $ParentDiv.empty();
    setChartSize();
    addSortButtons();
    addSVG();
    setSVGSize();
    setData();
    defineScales();
    defineAxes();
    renderAxes();
    renderChart();
    loadSlider();
    loadColumnChartLegend();
    addFooter();
  }

  function removeEventListeners() {
    $(document).off("click", "#divColumnChartLegend");
    window.removeEventListener("resize", createChart);
    publicAPI["on" + mConfig.ChangeEventTypesList.Viz1ContainerResizedEvent] =
      function () {
        // empty function
      };
  }

  function addEventListeners() {
    removeEventListeners();
    $(document).on("click", "#divColumnChartLegend", legendClickHandler);
    window.addEventListener("resize", createChart);
    publicAPI["on" + mConfig.ChangeEventTypesList.Viz1ContainerResizedEvent] =
      function () {
        createChart();
      };
  }

  publicAPI.setMediator = function (m) {
    mMediator = m;
  };

  publicAPI.getMediator = function () {
    return mMediator;
  };

  /*  // 01Mar2022
  publicAPI.downloadCSV = function () {
    var val;
    var displayVal;
    var lowerLimit;
    var upperLimit;
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
    var currentYear = mConfig.DataParameters.getYear();
    var currentYearLabel = mAllYearsData.YearsList.filter(function (a) {
      return a.YearID === currentYear;
    })[0].YearLabel;
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
        "U.S. States; " +
        currentYearLabel;
    } else if (currentMeasureName === "Total") {
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
        "U.S. States; " +
        currentYearLabel;
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
        "U.S. States; " +
        currentYearLabel;
    }

    csvArray.push(csvHeader);
    csvDate = "Data downloaded on " + mHelperUtil.getTodaysDate();
    csvArray.push(csvDate);

    if (currentDataType === "NumberValue") {
      csvDataHeader = "State," + commaStrippedCurrentDataTypeLabel;
    } else {
      csvDataHeader =
        "State," +
        commaStrippedCurrentDataTypeLabel +
        ",Lower Limit, Upper Limit";
    }
    csvArray.push(csvDataHeader);

    // AllStatesMedian
    if (currentDataType !== "NumberValue" && mCurrentYearAllStatesMedianData) {
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

    if (mCurrentYearData) {
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
          if (currentDataType === "NumberValue") {
            csvArray.push(d.GeoLabel + "," + displayVal);
          } else {
            csvArray.push(
              d.GeoLabel +
                "," +
                displayVal +
                "," +
                lowerLimit +
                "," +
                upperLimit
            );
          }
        }
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

  /* function getLegendSVGHTML() {
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
    var currentYear;
    var customHeading;
    var pptFileName = "BarChart";
    var callType = "PowerPoint";
    var legendTitle;
    var currentDataClassificationType;
    var str;
    var scrubbedSVGElem;
    var currentYearLabel;
    var chartType = "AllStatesColumnChart"; // 22Jul2020
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

    svgDiv = $("#" + mConfig.ColumnChartDivID + " svg");
    svgDiv.prepend("\n<style type='text/css'></style>");
    svgDiv.find("style").html("\n<![CDATA[" + style + "]]>\n");

    svgElem = d3
      .select("#" + mConfig.ColumnChartDivID)
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
    currentDataClassificationType =
      mConfig.DataParameters.getDataClassificationType();
    currentYear = mConfig.DataParameters.getYear();
    currentYearLabel = mAllYearsData.YearsList.filter(function (a) {
      return a.YearID === currentYear;
    })[0].YearLabel;
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
          ", " +
          currentDataClassificationType +
          " , U.S. States, " +
          currentYearLabel;
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
          " , U.S. States, " +
          currentYearLabel;
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
        ", U.S. States, " +
        currentYearLabel;
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
        " , U.S. States, " +
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
        ", " +
        currentDataClassificationType +
        " , U.S. States, " +
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

  publicAPI.downloadPPT = function (token) {
    downloadPPT(token);
  };

  publicAPI.downloadCSV = function () {
    downloadCSV();
  };

  publicAPI.dispose = function () {
    removeEventListeners();
  };

  publicAPI.onClearAllSelections = function (updatedSelectedStatesList) {
    mSelectedStatesList = updatedSelectedStatesList;
    setData();
    renderChart();
  };

  publicAPI.onColumnChartSliderChangeEvent = function (newYearObj) {
    mConfig.DataParameters.setYear(newYearObj.YearID);
    setData();
    renderChart();
    mSliderMod.moveSliderHandleToYearID(newYearObj.YearID); // 29Mar2019
  };

  publicAPI.init = function (config) {
    mConfig = config;
    mFormatThousands = d3.format(".2s");
    mActiveLegendItems = config.ActiveLegendItems;
    mSelectedStatesList = config.SelectedStatesList;
    // 17Mar2022 mMediator = config.Mediator;
    mSortModeList = { ByValue: "ByValue", ByName: "ByName" };
    mSortMode = mSortModeList.ByName;
    mHelperUtil = new HelperUtil();

    registerHandlebarsHelperMethods();
    createChart();
    addEventListeners();
  };
  return publicAPI;
}
export default ColumnChart;
