/* define([
  "jquery",
  "d3",
  "jsutil",
  "datatables.net",
  "lib/naturalsort",
  "modules/slider",
  "raw-loader!HtmlTemplates/sliderplayer.html",
  "Handlebars",
  "modules/debounceResize",
  "modules/csvFileDownload"
], function(
  $,
  d3,
  JSUtil,
  datatables,
  NaturalSort,
  Slider,
  sliderplayerTemplateHTML,
  Handlebars,
  DebounceResize,
  CSVFileDownload
) { */

import $ from "jquery";
import * as d3 from "../lib/d3_v4-min";
import JSUtil from "../modules/jsutil";
import datatables from "datatables.net";
import NaturalSort from "../lib/naturalsort";
import Handlebars from "Handlebars";
import DebounceResize from "../modules/debounceResize";
import CSVFileDownload from "../modules/csvFileDownload";
import Slider from "../modules/slider";
import sliderplayerTemplateHTML from "../HtmlTemplates/sliderplayer.html";

function DataTable() {
  var publicAPI = {};
  var mConfig;
  var mMediator;
  var mCurrentYearData;
  var mSelectedItemsList = [];
  var mActiveLegendItems = [];
  var mChartGroupedData;
  var mShowUpperLimit;
  var mShowLowerLimit;
  var mJSUtil;
  var mDataTableElemID = "tableAllStates";
  var mTableData;
  var mAllYearsData;
  var mCurrentYearAllStatesMedianData;
  var mSuppressedFlagID = -2;
  var mNoDataFlagID = -1;
  var mLegendData;
  var mSelectedStatesList = [];
  var mSliderMod;
  var m$TableContainer;

  publicAPI.setMediator = function(m) {
    mMediator = m;
  };

  publicAPI.getMediator = function() {
    return mMediator;
  };

  function checkLowerLimit(data) {
    var distinctVal = [];
    distinctVal = mJSUtil.getDistinctPropertyValues(data, "LowerLimit");
    if (distinctVal.length === 1 && distinctVal[0] === "No Data") {
      return false;
    }
    return true;
  }

  function checkUpperLimit(data) {
    var distinctVal = [];
    distinctVal = mJSUtil.getDistinctPropertyValues(data, "UpperLimit");
    if (distinctVal.length === 1 && distinctVal[0] === "No Data") {
      return false;
    }
    return true;
  }

  function getAllYearsData() {
    var currentMeasureID;
    var currentSubmeasureID;
    var currentAgeClassificationType;
    var ageClassificationTypeData;
    var currentDataClassificationType;
    var dataClassificationTypeData;
    var ageMeasureID = 41;
    var totalMeasureID = 40;
    var currentMeasureData;
    var currentSubmeasureData;
    var allYearsData = [];

    currentMeasureData = mConfig.BusinessData.MeasureData;
    currentMeasureID = mConfig.DataParameters.getMeasureID();
    currentSubmeasureID = mConfig.DataParameters.getSubmeasureID();

    currentAgeClassificationType = mConfig.DataParameters.getAgeClassificationType();
    currentDataClassificationType = mConfig.DataParameters.getDataClassificationType();

    if (currentMeasureID === totalMeasureID) {
      ageClassificationTypeData =
        currentAgeClassificationType === "Age-Adjusted"
          ? currentMeasureData.Data.AgeAdjustedData
          : currentMeasureData.Data.CrudeData;

      dataClassificationTypeData =
        currentDataClassificationType === "Natural Breaks"
          ? ageClassificationTypeData.NaturalBreaksData
          : ageClassificationTypeData.QuartilesData;
      allYearsData = dataClassificationTypeData;
    } else if (currentMeasureID === ageMeasureID) {
      currentSubmeasureData = currentMeasureData.Data.filter(function(a) {
        return a.SubmeasureID === currentSubmeasureID;
      })[0];

      dataClassificationTypeData =
        currentDataClassificationType === "Natural Breaks"
          ? currentSubmeasureData.NaturalBreaksData
          : currentSubmeasureData.QuartilesData;

      allYearsData = dataClassificationTypeData;
    } else {
      ageClassificationTypeData =
        currentAgeClassificationType === "Age-Adjusted"
          ? currentMeasureData.Data.AgeAdjustedData
          : currentMeasureData.Data.CrudeData;

      currentSubmeasureData = ageClassificationTypeData.filter(function(a) {
        return a.SubmeasureID === currentSubmeasureID;
      })[0];

      dataClassificationTypeData =
        currentDataClassificationType === "Natural Breaks"
          ? currentSubmeasureData.NaturalBreaksData
          : currentSubmeasureData.QuartilesData;

      allYearsData = dataClassificationTypeData;
    }

    return allYearsData;
  }

  function getCurrentYearData() {
    var currentYear;
    var currentYearData;

    currentYear = mConfig.DataParameters.getYear();
    mAllYearsData = getAllYearsData();
    currentYearData = mAllYearsData.Data.filter(function(d) {
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
    currentYearAllStatesMedianData = dataCopy.filter(function(d) {
      return d.YearID === currentYear;
    })[0];
    if (
      !currentYearAllStatesMedianData.IsSuppressed &&
      !currentYearAllStatesMedianData.IsNoData
    ) {
      currentYearAllStatesMedianData.Value = mJSUtil.roundNumericStrings(
        currentYearAllStatesMedianData.Value,
        1
      );
      currentYearAllStatesMedianData.UpperLimit = mJSUtil.roundNumericStrings(
        currentYearAllStatesMedianData.UpperLimit,
        1
      );
      currentYearAllStatesMedianData.LowerLimit = mJSUtil.roundNumericStrings(
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

  function setLegendData() {
    mLegendData = mCurrentYearData.LegendData;
    if (!mActiveLegendItems.length) {
      mActiveLegendItems = getDefaultActiveLegendItems();
      mMediator.broadcast("ActiveLegendItemsResetEvent", [mActiveLegendItems]);
    }
  }

  function getSuppressedDataObj() {
    var dataObj;
    dataObj = {
      Val: mSuppressedFlagID,
      DisplayVal: "Suppressed",
      LowerLimit: "Suppressed",
      UpperLimit: "Suppressed"
    };

    return dataObj;
  }

  function getNoDataDataObj() {
    var dataObj;
    dataObj = {
      Val: "No Data",
      DisplayVal: "No Data",
      LowerLimit: "No Data",
      UpperLimit: "No Data"
    };
    return dataObj;
  }

  function formatDisplayVal(val) {
    var dataType;
    var displayVal;

    dataType = mConfig.DataParameters.getDataType();

    if (dataType === "EstimateValue") {
      displayVal = mJSUtil.roundNumericStrings(val, 1);
    } else {
      displayVal = Math.round(parseFloat(val)); // "NumberValue"
    }

    return displayVal;
  }

  function getDataObj(d) {
    var dataObj;
    dataObj = {
      Val: d.Value,
      DisplayVal: formatDisplayVal(d.Value),
      LowerLimit: d.LowerLimit ? formatDisplayVal(d.LowerLimit) : "No Data",
      UpperLimit: d.UpperLimit ? formatDisplayVal(d.UpperLimit) : "No Data"
    };
    return dataObj;
  }

  function isValueInActiveLegend(val) {
    // suppressedFlagID = "-2"; noDataFlagID = "-1";
    var minVal;
    var maxVal;
    var splitVal;
    var i;
    if (val === "No Data") {
      val = String(mNoDataFlagID);
    } else if (val === "Suppressed") {
      val = String(mSuppressedFlagID);
    }

    for (i = 0; i < mActiveLegendItems.length; i += 1) {
      if (
        (mActiveLegendItems[i] === String(mNoDataFlagID) ||
          mActiveLegendItems[i] === String(mSuppressedFlagID)) &&
        String(val) === mActiveLegendItems[i]
      ) {
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
    var tableDataObj;
    var valObj;

    mTableData = [];
    mCurrentYearData = getCurrentYearData();

    // 09Feb2021 if (mAllYearsData.AllStatesMedianData.Data) {
    if (
      mAllYearsData.AllStatesMedianData.Data &&
      mAllYearsData.AllStatesMedianData.Data.length
    ) {
      mCurrentYearAllStatesMedianData = getCurrentYearAllStatesMedianData();
    }
    setLegendData();

    mCurrentYearData.Data.forEach(function(d) {
      tableDataObj = $.extend(true, {}, d);

      if (d.IsSuppressed) {
        valObj = getSuppressedDataObj();
      } else if (d.IsNoData) {
        valObj = getNoDataDataObj();
      } else {
        valObj = getDataObj(d);
      } // 13Feb2018
      if (isValueInActiveLegend(valObj.Val)) {
        tableDataObj.Value = valObj.Val;
        tableDataObj.DisplayVal = valObj.DisplayVal;
        tableDataObj.LowerLimit = valObj.LowerLimit;
        tableDataObj.UpperLimit = valObj.UpperLimit;

        mTableData.push(tableDataObj);
      }
    });
    mTableData.sort(function(a, b) {
      return a.GeoID - b.GeoID;
    });
  }

  function addDataTableDiv() {
    if (!$("#divDataTable").length) {
      m$TableContainer.append('<div id="divDataTable" ></div>');
    }
    //   $("#" + mConfig.ContainerID).append('<div id="divDataTable"></div>');
  }

  function createTableElement() {
    var table;
    var summaryTxt;

    table = document.createElement("TABLE");
    table.setAttribute("id", mDataTableElemID);
    // table.setAttribute("class", "display dataTable table-responsive");
    table.setAttribute("class", "display dataTable");
    table.setAttribute("style", "width:100%");

    // TODO: headingTxt = $('#mapPanelTitle').text();
    // TODO: summaryTxt = 'This table displays data for ' + headingTxt + ' for each state';
    // table.setAttribute("summary", summaryTxt);

    return table;
  }

  function createLowerLimitColumn(text) {
    var td;
    var displayText;

    if (text === "No Data") {
      displayText = "*";
    } else if (text === "Suppressed") {
      displayText = "**";
    } else {
      displayText = text;
    }
    td = document.createElement("TD");
    td.setAttribute("headers", "LowerLimit"); // 3Feb2016
    td.innerHTML = displayText;
    return td;
  }

  function createUpperLimitColumn(text) {
    var td;
    var displayText;

    if (text === "No Data") {
      displayText = "*";
    } else if (text === "Suppressed") {
      displayText = "**";
    } else {
      displayText = text;
    }
    td = document.createElement("TD");
    td.setAttribute("headers", "UpperLimit");
    td.innerHTML = displayText;

    return td;
  }

  function createStateColumnHeader(stateName) {
    var tdState;

    tdState = document.createElement("TD");
    tdState.innerHTML = stateName;
    tdState.setAttribute("headers", "State");

    return tdState;
  }

  function createValueColumnHeader(displayVal) {
    var text;
    var tdValue;

    text = displayVal;
    if (text === "No Data") {
      text = "*";
    } else if (text === "Suppressed") {
      text = "**";
    }
    tdValue = document.createElement("TD");
    tdValue.innerHTML = text;
    tdValue.setAttribute("headers", "DataTypeLabel");

    return tdValue;
  }

  function addTableRows(tableBody) {
    var dataType;
    var row;
    var trRow;
    var tdState;
    var tdValue;
    var tdLowerLimit;
    var tdUpperLimit;

    dataType = mConfig.DataParameters.getDataType();

    for (let i = 0; i < mTableData.length; i += 1) {
      row = mTableData[i];
      trRow = document.createElement("TR");

      tdState = createStateColumnHeader(row.GeoLabel);
      trRow.appendChild(tdState);

      tdValue = createValueColumnHeader(row.DisplayVal);
      trRow.appendChild(tdValue);

      if (dataType !== "NumberValue") {
        tdLowerLimit = createLowerLimitColumn(row.LowerLimit);
        trRow.appendChild(tdLowerLimit);

        tdUpperLimit = createUpperLimitColumn(row.UpperLimit);
        trRow.appendChild(tdUpperLimit);
      }

      tableBody.appendChild(trRow);
    }

    return tableBody;
  }

  function createStateHeader() {
    var thState;

    thState = document.createElement("TH");
    thState.setAttribute("rowspan", 1);
    thState.setAttribute("id", "State");
    thState.innerHTML = "State";

    return thState;
  }

  function createValHeader() {
    var thVal;
    var dataTypeLabel;

    dataTypeLabel = mConfig.DataParameters.getDataTypeLabel();

    thVal = document.createElement("TH");
    thVal.setAttribute("rowspan", 1);
    thVal.setAttribute("id", "DataTypeLabel");
    thVal.setAttribute("class", "colAlignRight");
    thVal.innerHTML = dataTypeLabel;

    return thVal;
  }

  function createLowerLimitHeader() {
    var thLowerLimit;

    thLowerLimit = document.createElement("TH");
    thLowerLimit.setAttribute("rowspan", 1);
    thLowerLimit.setAttribute("id", "LowerLimit");
    thLowerLimit.setAttribute("class", "colAlignRight");
    thLowerLimit.innerHTML = "Lower Limit";

    return thLowerLimit;
  }

  function createUpperLimitHeader() {
    var thUpperLimit;

    thUpperLimit = document.createElement("TH");
    thUpperLimit.setAttribute("rowspan", 1);
    thUpperLimit.setAttribute("id", "UpperLimit");
    thUpperLimit.setAttribute("class", "colAlignRight");
    thUpperLimit.innerHTML = "Upper Limit";

    return thUpperLimit;
  }

  function createMedianRow() {
    var medianTR;
    var medianStateNameTD;
    var medianValTD;
    var medianUpperLimitTD;
    var medianLowerLimitTD;
    var NoDataSuppressedSymbols;

    NoDataSuppressedSymbols = {
      "No Data": "*",
      Suppressed: "**"
    };

    medianTR = document.createElement("TR");
    medianStateNameTD = document.createElement("TH");
    medianStateNameTD.innerHTML =
      mAllYearsData.AllStatesMedianData.DataTypeLabel;
    medianTR.appendChild(medianStateNameTD);

    // Value
    medianValTD = document.createElement("TH");

    medianValTD.innerHTML =
      NoDataSuppressedSymbols[mCurrentYearAllStatesMedianData.Value] ||
      mCurrentYearAllStatesMedianData.Value;
    medianTR.appendChild(medianValTD);

    medianLowerLimitTD = document.createElement("TH");

    medianLowerLimitTD.innerHTML =
      NoDataSuppressedSymbols[mCurrentYearAllStatesMedianData.LowerLimit] ||
      mCurrentYearAllStatesMedianData.LowerLimit;
    medianTR.appendChild(medianLowerLimitTD);

    medianUpperLimitTD = document.createElement("TH");

    medianUpperLimitTD.innerHTML =
      NoDataSuppressedSymbols[mCurrentYearAllStatesMedianData.UpperLimit] ||
      mCurrentYearAllStatesMedianData.UpperLimit;
    medianTR.appendChild(medianUpperLimitTD);

    return medianTR;
  }

  function isStateSelected(geoLabel) {
    var geoID;
    var result;

    result = mTableData.filter(function(d) {
      return d.GeoLabel === geoLabel;
    });
    geoID = result[0].GeoID;

    return mSelectedStatesList.indexOf(geoID) > -1;
  }

  publicAPI.reload = function() {
    m$TableContainer.empty();
    addDataTableDiv();
    createTable();
    loadSlider();
  };

  function createTable() {
    var table;
    var tableFragment;
    var tableHead;
    var tableBody;
    var trHeader1;
    var trHeader2;
    var thVal;
    var trHeader;
    var thState;
    var dataType;
    var thLowerLimit;
    var thUpperLimit;
    var trMedian;
    var $DataTableContainer;

    $("#divDataTable").empty();

    // 20Oct2020  $DataTableContainer = $("#" + mConfig.DataTableDivID);
    // 20Oct2020 $DataTableContainer.empty();

    table = createTableElement();
    $("#divDataTable").append(table);

    dataType = mConfig.DataParameters.getDataType();

    tableFragment = document.createDocumentFragment();
    tableHead = document.createElement("THEAD");
    tableBody = document.createElement("TBODY");
    trHeader = document.createElement("TR");

    thState = createStateHeader();
    trHeader.appendChild(thState);

    thVal = createValHeader();
    trHeader.appendChild(thVal);

    if (dataType !== "NumberValue") {
      thLowerLimit = createLowerLimitHeader();
      trHeader.appendChild(thLowerLimit);

      thUpperLimit = createUpperLimitHeader();
      trHeader.appendChild(thUpperLimit);
    }

    tableHead.appendChild(trHeader);

    if (dataType !== "NumberValue") {
      trMedian = createMedianRow();
      tableHead.appendChild(trMedian);
    }

    tableBody = addTableRows(tableBody);

    tableFragment.appendChild(tableHead);
    tableFragment.appendChild(tableBody);
    table.appendChild(tableFragment);

    $("#" + mDataTableElemID).DataTable({
      bFilter: false,
      bLengthChange: false,
      bSortable: true,
      bSort: true,
      columnDefs: [
        { type: "string", targets: 0 },
        // 23Feb2021  { type: "num", targets: "_all" },
        { type: "natural", targets: "_all" },
        { className: "colAlignLeft", targets: [0] }, // 1Aug2017
        { className: "colAlignRight", targets: "_all" } // 1Aug2017
      ],
      orderClasses: false,
      responsive: true,
      fnRowCallback: function(nRow, aData) {
        if (isStateSelected(aData[0])) {
          $(nRow).css("background-color", "#FFFF00");
        }
      }
    });
  }

  function getCSVHeader() {
    var csvHeader;
    var regexComma;
    var commaStrippedCurrentIndicatorName;
    var commaStrippedCurrentDataTypeLabel;
    var commaStrippedCurrentDataSetLabel;
    var commaStrippedCurrentMeasureName;
    var commaStrippedCurrentSubMeasureLabel;
    var currentIndicatorName = mConfig.DataParameters.getIndicatorName();
    var currentDataType = mConfig.DataParameters.getDataType();
    var currentDataTypeLabel = mConfig.DataParameters.getDataTypeLabel();
    var currentDatasetLabel = mConfig.DataParameters.getDatasetLabel();
    var currentMeasureName = mConfig.DataParameters.getMeasureName();
    var currentSubmeasureLabel = mConfig.DataParameters.getSubmeasureLabel();
    var currentAgeClassificationType = mConfig.DataParameters.getAgeClassificationType();
    var currentYear = mConfig.DataParameters.getYear();
    var currentYearLabel = mAllYearsData.YearsList.filter(function(a) {
      return a.YearID === currentYear;
    })[0].YearLabel;
    var dataTypeReducer;
    var measureTypeReducer;
    var totalMeasureTypeReducer;

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
    dataTypeReducer = {
      EstimateValue:
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
        "; U.S. States; " +
        currentYearLabel,
      NumberValue:
        commaStrippedCurrentIndicatorName +
        "; " +
        commaStrippedCurrentSubMeasureLabel +
        " (" +
        commaStrippedCurrentMeasureName +
        "); " +
        commaStrippedCurrentDataSetLabel +
        "; " +
        commaStrippedCurrentDataTypeLabel +
        "; U.S. States; " +
        currentYearLabel
    };

    totalMeasureTypeReducer = {
      EstimateValue:
        commaStrippedCurrentIndicatorName +
        "; " +
        commaStrippedCurrentMeasureName +
        "; " +
        commaStrippedCurrentDataSetLabel +
        "; " +
        currentAgeClassificationType +
        " " +
        commaStrippedCurrentDataTypeLabel +
        "; U.S. States; " +
        currentYearLabel,
      NumberValue:
        commaStrippedCurrentIndicatorName +
        "; " +
        commaStrippedCurrentDataTypeLabel +
        "; " +
        commaStrippedCurrentDataSetLabel +
        "; U.S. States; " +
        currentYearLabel
    };

    measureTypeReducer = {
      Age:
        commaStrippedCurrentIndicatorName +
        "; " +
        commaStrippedCurrentSubMeasureLabel +
        " (" +
        commaStrippedCurrentMeasureName +
        "); " +
        commaStrippedCurrentDataSetLabel +
        "; " +
        commaStrippedCurrentDataTypeLabel +
        "; U.S. States; " +
        currentYearLabel,
      Total: totalMeasureTypeReducer[currentDataType],
      Gender: dataTypeReducer[currentDataType],
      "Race-Ethnicity": dataTypeReducer[currentDataType],
      Education: dataTypeReducer[currentDataType]
    };

    csvHeader = measureTypeReducer[currentMeasureName];

    return csvHeader;
  }

  function addMedianRow(csvArray) {
    var currentDataType;
    currentDataType = mConfig.DataParameters.getDataType();

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

  publicAPI.downloadCSV = function() {
    // var filteredTableData;
    var csvArray = [];
    var csvHeader;
    var regexComma;
    var commaStrippedCurrentDataTypeLabel;
    var csvDataHeader;
    var downloadFileName;
    var csvDate;
    var csvFooter =
      "US Diabetes Surveillance System; www.cdc.gov/diabetes/data; Division of Diabetes Translation - Centers for Disease Control and Prevention.";
    var currentDataTypeLabel = mConfig.DataParameters.getDataTypeLabel();
    var currentDataType = mConfig.DataParameters.getDataType();
    var csvFileDownload; // 26Jul2020
    var csvConfig; // 26Jul2020

    regexComma = new RegExp(",", "g");
    commaStrippedCurrentDataTypeLabel = currentDataTypeLabel.replace(
      regexComma,
      ""
    );

    csvHeader = getCSVHeader();
    csvArray.push(csvHeader);

    csvDate = "Data downloaded on " + mJSUtil.getTodaysDate();
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

    addMedianRow(csvArray);

    mTableData.forEach(function(d) {
      if (currentDataType === "NumberValue") {
        csvArray.push(d.GeoLabel + "," + d.DisplayVal);
      } else {
        csvArray.push(
          d.GeoLabel +
            "," +
            d.DisplayVal +
            "," +
            d.LowerLimit +
            "," +
            d.UpperLimit
        );
      }
    }); // 13Feb2018

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
  };

  function loadSlider() {
    var config;
    var currentYear;
    var yearsList;
    var deviceType;
    var sliderplayerConfig;
    var $DataTableDiv;
    var sliderplayerCompiledTemplateHTML;
    var sliderplayerGeneratedHTML;
    var parentContainerWidth;

    $(document).off("click", "body, #btnPlayDataTable"); // 19Aug2019

    config = {
      PlayBtnDivID: "divBtnPlayDataTable",
      PlayBtnID: "btnPlayDataTable",
      SliderDivID: "divYearSliderDataTable"
    };

    sliderplayerCompiledTemplateHTML = Handlebars.compile(
      sliderplayerTemplateHTML
    );
    sliderplayerGeneratedHTML = sliderplayerCompiledTemplateHTML(config);
    m$TableContainer.append(sliderplayerGeneratedHTML);

    currentYear = mConfig.DataParameters.getYear();
    yearsList = mAllYearsData.YearsList;
    deviceType = mConfig.DeviceType;
    parentContainerWidth = 0.95 * m$TableContainer.width(); // 19Mar2019

    sliderplayerConfig = {
      ContainerID: config.SliderDivID,
      SliderPlayBtnID: config.PlayBtnID,
      CurrentYear: currentYear,
      YearsList: yearsList,
      ParentContainerWidth: parentContainerWidth,
      SliderPlayBtnWidth: 50,
      Mediator: mMediator,
      DeviceType: deviceType,
      SliderChangeEventName: "DataTableSliderChangeEvent",
      RecordSliderPlayBtnEventName: "AllStatesTableSliderPlayBtnClickEvent", // 19Aug2019
      IntervalTime: 1000
    };
    mSliderMod = new Slider();
    mMediator.registerComponent("DataTableSlider", mSliderMod);
    mSliderMod.init(sliderplayerConfig);
  }

  publicAPI.expand = function() {
    createTable();
  };

  publicAPI.reset = function() {
    createTable();
  };

  /* publicAPI.update = function(updateConfig) {
      mConfig = updateConfig;
      mSelectedItemsList = updateConfig.SelectedItemsList;
      setData();
      createTable();
    }; */

  publicAPI.onDataTableSliderChangeEvent = function(newYearObj) {
    mConfig.DataParameters.setYear(newYearObj.YearID);
    setData();
    createTable();
    mSliderMod.moveSliderHandleToYearID(newYearObj.YearID); // 29Mar2019
  };

  publicAPI.init = function(config) {
    var debounceResize;
    mConfig = config;
    mMediator = config.Mediator;
    m$TableContainer = $("#" + mConfig.ContainerID);
    mActiveLegendItems = mConfig.ActiveLegendItems;
    mSelectedItemsList = config.SelectedItemsList;
    mSelectedStatesList = mConfig.SelectedStatesList;
    mJSUtil = new JSUtil();
    /*  // 14Nov2020 TODO: Implement
      debounceResize = new DebounceResize();
      debounceResize.onResize(createTable); */
    setData();
    addDataTableDiv();
    createTable();
    loadSlider();
  };

  return publicAPI;
}

export default DataTable;
