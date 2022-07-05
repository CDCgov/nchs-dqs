import $ from "jquery";
import popper from "popper.js";
import bootstrap from "bootstrap";
import Handlebars from "Handlebars";
import GSAP from "gsap";
import CSSRulePlugin from "cssruleplugin";
import Cookies from "../lib/js.cookie";
import * as d3 from "../lib/d3_v4-min";
import HelperUtil from "../modules/helperutils";
import SiteCatalystLog from "../modules/sitecatalystlog";
import AllStatesData from "../modules/allstatesdata";
import DatasetTemplateHTML from "../HtmlTemplates/Dataset.html";
import DataTypeTemplateHTML from "../HtmlTemplates/Datatype.html";
import DataClassificationTemplateHTML from "../HtmlTemplates/DataClassification.html";
import AgeClassificationTemplateHTML from "../HtmlTemplates/AgeClassification.html";
import MeasuresToolbarTemplateHTML from "../HtmlTemplates/MeasuresToolbar.html";
import MeasuresDDLTemplateHTML from "../HtmlTemplates/MeasuresDDL.html";
import RadioListTemplateHTML from "../HtmlTemplates/RadioList.html";
import AllStatesMap from "../modules/allstatesmap";
import ColumnChart from "../modules/columnchart";
import AllStatesDataTable from "../modules/allstatesdatatable";
import AllStatesHeatMap from "../modules/dataheatmapsquares";
import AllStatesLineChart from "../modules/allstateslinechart";

function AllStatesUI() {
  var publicAPI = {};
  var mConfig;
  var mHelperUtil;
  var mSiteCatalystLog;
  var mMediator;
  var mFileDownloadCheckTimer;
  var mInitAppData;
  var mAllStatesDataMod;
  var mAllStatesData;
  var mQuartilesID = 1500;
  var mAgeMeasureID = 41;
  var mTotalMeasureID = 40;
  var mAllStatesGeoID = 5001;
  var mDefaultMeasureID = 40;
  var mDefaultMeasureName = "Total";
  var mTotalSubmeasureID = -99;
  var mAgeAdjustedID1 = 635;
  var mAgeAdjustedID2 = 637;
  var mTotalCrudeID1 = 634;
  var mTotalCrudeID2 = 636;
  var mClickEventHandlers;
  var mCurrentYear;
  var mIsSubmeasuresToolbarOpen = false;
  var mSelectedSubmeasuresList = [];
  var mActiveLegendItems = [];
  var mSelectedStatesList = [];
  var mMapChartTableConfig;
  var mHeatMapChartConfig;
  var mMap;
  var mAllStatesMapName = "allstatesmap";
  var mBarChart;
  var mBarChartName = "allstatesbarchart";
  var mDataTable;
  var mDataTableName = "allstatesdatatable";
  var mHeatMap;
  var mHeatMapName = "allstatesheatmap";
  var mLineChart;
  var mLineChartName = "allstateslinechart";
  var mVizTgBtnStatusList = {
    Map: "Map",
    Bar: "Bar",
    Table: "Table",
    HeatMap: "HeatMap",
    Line: "Line"
  };
  var mActiveViz1 = mVizTgBtnStatusList.Map;
  // 18Mar2022 var mActiveViz2 = mVizTgBtnStatusList.HeatMap;
  var mActiveViz2 = mVizTgBtnStatusList.Line; // 18Mar2022

  mClickEventHandlers = {
    "input[rel=js-ToolbarMeasure]": handleMeasureClickEvent,
    "button[rel=js-DDLMeasure]": handleMeasureClickEvent,
    "input[rel=js-SubmeasureItem]": handleSubmeasureClickEvent,
    "input[rel=js-DatasetFilter]": handleDatasetClickEvent,
    // 19Apr2022 "button[rel=js-DataTypeFilter]": handleDataTypeClickEvent,
    "input[rel=js-DataTypeFilter]": handleDataTypeClickEvent,
    "input[rel=js-DataClassificationFilter]":
      handleDataClassificationClickEvent,
    "input[rel=js-AgeClassificationFilter]": handleAgeClassificationClickEvent,
    "input[rel=js-Viz1Toggle]": handleMapBarTableToggleClickEvent,
    "input[rel=js-Viz2Toggle]": handleHeatMapLineToggleClickEvent,
    "#viz1_CSV": handleViz1DownloadCSVClickEvent,
    "#viz2_CSV": handleViz2DownloadCSVClickEvent,
    "#viz1_PPT": handleViz1DownloadPPTClickEvent,
    "#viz2_PPT": handleViz2DownloadPPTClickEvent,
    "#btnSurveillanceReadMore": handleReadMoreClickEvent
    // 19Apr2022 "#btnResetFilters": handleResetFiltersClickEvent
  };

  publicAPI.setMediator = function (m) {
    mMediator = m;
  };

  publicAPI.getMediator = function () {
    return mMediator;
  };

  /*  // 19Apr2022
   function handleResetFiltersClickEvent() {
    window.location.reload();
  } */

  function updateDataType(clickedDataTypeID) {
    var currentDatatypesList;
    var clickedDataTypeObj;

    currentDatatypesList = mAllStatesData.DataCollection.getDataTypesList();
    clickedDataTypeObj = currentDatatypesList.find(function (d) {
      return d.DataTypeID === clickedDataTypeID;
    });

    mAllStatesData.DataParameters.setDataTypeID(clickedDataTypeID);
    mAllStatesData.DataParameters.setDataTypeLabel(
      clickedDataTypeObj.DataTypeLabel
    );
    mAllStatesData.DataParameters.setDataType(clickedDataTypeObj.DataType);
    mAllStatesDataMod.updateDataParameters(mAllStatesData.DataParameters);
  }

  function handleAgeClassificationClickEvent(evt) {
    const clickedAgeClassificationTypeIDAttr = $(evt.target).attr("id");
    const splitIDAttr = clickedAgeClassificationTypeIDAttr.split("_");
    const clickedAgeClassificationTypeID = parseInt(splitIDAttr[1], 10);
    const currentAgeClassificationTypeID =
      mAllStatesData.DataParameters.getAgeClassificationTypeID();

    if (currentAgeClassificationTypeID === clickedAgeClassificationTypeID) {
      return;
    }

    $(document.body).addClass("loading");
    mConfig.ChangeEventType =
      mConfig.ChangeEventTypesList.AgeClassificationTypeChange;

    mActiveLegendItems = [];

    const ageClassificationTypeList =
      mAllStatesData.DataCollection.getAgeClassificationList();
    const ageClassificationObj = ageClassificationTypeList.filter(function (d) {
      return d.AgeClassificationTypeID === clickedAgeClassificationTypeID;
    })[0];
    const ageClassificationType =
      ageClassificationObj.AgeClassificationTypeLabel;
    mAllStatesData.DataParameters.setAgeClassificationType(
      ageClassificationType
    );
    mAllStatesData.DataParameters.setAgeClassificationTypeID(
      clickedAgeClassificationTypeID
    );
    mAllStatesDataMod.updateDataParameters(mAllStatesData.DataParameters);

    setIndicatorSubtitle();
    displayMapChartTable();
    displayHeatMapLineChart();
    highlightAgeClassification();
    $(document.body).removeClass("loading");
    sendInfoToSiteCatalayst();
  }

  function handleDataClassificationClickEvent(evt) {
    const clickedDataClassificationIDAttr = $(evt.target).attr("id");
    const splitIDAttr = clickedDataClassificationIDAttr.split("_");
    const clickedDataClassificationID = parseInt(splitIDAttr[1], 10);
    const currentDataClassificationID =
      mAllStatesData.DataParameters.getDataClassificationID();

    if (clickedDataClassificationID === currentDataClassificationID) {
      return;
    }

    mActiveLegendItems = [];

    const dataClassficationList =
      mAllStatesData.DataCollection.getDataClassificationList();
    const currentDataClassficationType = dataClassficationList.filter(function (
      d
    ) {
      return d.DataClassificationID === clickedDataClassificationID;
    })[0].DataClassificationName;

    mAllStatesData.DataParameters.setDataClassificationID(
      clickedDataClassificationID
    );
    mAllStatesData.DataParameters.setDataClassificationType(
      currentDataClassficationType
    );
    mAllStatesDataMod.updateDataParameters(mAllStatesData.DataParameters);

    setIndicatorSubtitle();
    displayMapChartTable();
    displayHeatMapLineChart();
    highlightDataClassification();
    $(document.body).removeClass("loading");
    sendInfoToSiteCatalayst();
  }

  function handleDataTypeClickEvent(evt) {
    var dataTypeDataObj;
    const clickedDatatypeIDAttr = $(evt.target).attr("id");
    const splitIDAttr = clickedDatatypeIDAttr.split("_");
    const clickedDatatypeID = parseInt(splitIDAttr[1], 10);
    const currentDatatypeID = mAllStatesData.DataParameters.getDataTypeID();

    if (clickedDatatypeID === currentDatatypeID) {
      return;
    }

    mActiveLegendItems = [];
    updateDataType(clickedDatatypeID);
    highlightDataType();

    /*  // 25Apr2022
    const businessDatasetColl =
      mAllStatesData.DataCollection.getBusinessDatasetColl();
    dataTypeDataObj = businessDatasetColl.find(function (d) {
      return d.DataTypeID === clickedDatatypeID;
    });
    mAllStatesData.DataCollection.setCurrentBusinessDataset(dataTypeDataObj); */
    setCurrentBusinessDataset(); // 25Apr2022

    // 22Apr2022
    if (mAllStatesData.DataParameters.getDataType() === "EstimateValue") {
      setAgeClassificationToAgeAdjusted();
    }

    generateAgeClassificationFilters(); // 25Apr2022
    setAgeClassificationFiltersDisplayStatus();
    setIndicatorSubtitle();

    displayMapChartTable();
    displayHeatMapLineChart();
    $(document.body).removeClass("loading");
    sendInfoToSiteCatalayst();
  }

  function handleDatasetClickEvent(evt) {
    const clickedDatasetIDAttr = $(evt.target).attr("id");
    const splitIDAttr = clickedDatasetIDAttr.split("_");
    const clickedDatasetID = parseInt(splitIDAttr[1], 10);
    const currentDatasetID = mAllStatesData.DataParameters.getDatasetID();

    if (clickedDatasetID === currentDatasetID) {
      return;
    }

    $(document.body).addClass("loading");

    mActiveLegendItems = [];
    const currentIndicatorID = mAllStatesData.DataParameters.getIndicatorID();
    const currentMeasureID = mAllStatesData.DataParameters.getMeasureID();

    const currentDatasetList = mAllStatesData.DataCollection.getDatasetList();
    const currentDatasetObj = currentDatasetList.find(function (d) {
      return d.DatasetID === clickedDatasetID;
    });

    mAllStatesData.DataParameters.setDatasetID(clickedDatasetID);
    mAllStatesData.DataParameters.setDatasetLabel(
      currentDatasetObj.DatasetLabel
    );

    mAllStatesDataMod.updateDataParameters(mAllStatesData.DataParameters);
    const dataCallConfig = {
      IndicatorID: currentIndicatorID,
      MeasureID: currentMeasureID,
      DatasetID: clickedDatasetID
    };
    try {
      mAllStatesDataMod.executeAllStatesIndicatorDataCall(dataCallConfig);
    } catch (ex) {
      throw new Error(
        "handleDatasetClickEvent(): Error in getting Indicator data " + ex
      );
    }
  }

  function handleSubmeasureClickEvent(evt) {
    const clickedSubmeasureIDAttr = $(evt.target).attr("id");
    const splitIDAttr = clickedSubmeasureIDAttr.split("_");
    const clickedSubmeasureID = parseInt(splitIDAttr[1], 10);
    const currentSubmeasureID = mAllStatesData.DataParameters.getSubmeasureID();
    if (currentSubmeasureID === clickedSubmeasureID) {
      return;
    }

    $(document.body).addClass("loading");
    mConfig.ChangeEventType = mConfig.ChangeEventTypesList.SubmeasureChange;
    mActiveLegendItems = [];

    const submeasuresList = mAllStatesData.DataCollection.getSubmeasuresList();
    const submeasureObj = submeasuresList.find(function (d) {
      return d.ID === clickedSubmeasureID;
    });
    const clickedSubmeasureLabel = submeasureObj.Name;
    mAllStatesData.DataParameters.setSubmeasureID(clickedSubmeasureID);
    mAllStatesData.DataParameters.setSubmeasureLabel(clickedSubmeasureLabel);
    mAllStatesDataMod.updateDataParameters(mAllStatesData.DataParameters);

    displayMapChartTable();
    displayHeatMapLineChart();
    setIndicatorSubtitle();
    highlightSubmeasure();
    $(document.body).removeClass("loading");
    sendInfoToSiteCatalayst();
  }

  function handleMeasureClickEvent(evt) {
    const clickedMeasureIDAttr = $(evt.target).attr("id");
    const splitIDAttr = clickedMeasureIDAttr.split("_");
    const clickedMeasureID = parseInt(splitIDAttr[1], 10);
    const currentMeasureID = mAllStatesData.DataParameters.getMeasureID();

    if (currentMeasureID === clickedMeasureID) {
      return;
    }
    $(document.body).addClass("loading");

    mConfig.ChangeEventType = mConfig.ChangeEventTypesList.MeasureChange;

    mActiveLegendItems = [];

    const measuresList = mAllStatesData.DataCollection.getMeasuresList();
    const clickedMeasureName = measuresList.find(function (d) {
      return parseInt(d.MeasureID, 10) === clickedMeasureID;
    }).MeasureName;
    const currentIndicatorID = mAllStatesData.DataParameters.getIndicatorID();
    const currentDatasetID = mAllStatesData.DataParameters.getDatasetID();

    mAllStatesData.DataParameters.setMeasureID(clickedMeasureID);
    mAllStatesData.DataParameters.setMeasureName(clickedMeasureName);
    mAllStatesDataMod.updateDataParameters(mAllStatesData.DataParameters);

    const dataCallConfig = {
      IndicatorID: currentIndicatorID,
      MeasureID: clickedMeasureID,
      DatasetID: currentDatasetID
    };
    try {
      mAllStatesDataMod.executeAllStatesIndicatorDataCall(dataCallConfig);
    } catch (ex) {
      throw new Error(
        "handleMeasureClickEvent(): Error in getting Indicator data " + ex
      );
    }
  }

  // 29Apr2022
  function handleMapTgBtnClickEvent() {
    displayMap();
    sendUIInfoToSiteCatalyst(
      mConfig.LogIdentifiersList.Current_Page +
        "," +
        mConfig.LogIdentifiersList.All_States_Map
    );
  }

  // 29Apr2022
  function handleBarChartTgBtnClickEvent() {
    displayBarChart();
    sendUIInfoToSiteCatalyst(
      mConfig.LogIdentifiersList.Current_Page +
        "," +
        mConfig.LogIdentifiersList.All_States_Bar_Chart
    );
  }

  // 29Apr2022
  function handleDataTableTgBtnClickEvent() {
    displayDataTable();
    sendUIInfoToSiteCatalyst(
      mConfig.LogIdentifiersList.Current_Page +
        "," +
        mConfig.LogIdentifiersList.All_States_Table
    );
  }

  // 29Apr2022
  function handleMapBarTableToggleClickEvent(evt) {
    const clickedIDAttr = $(evt.target).attr("id");
    /*  // 29Apr2022
     const tgOptions = {
      radBtnMap: displayMap,
      radBtnBar: displayBarChart,
      radBtnDataTable: displayDataTable
    }; */
    // 29Apr2022
    const tgOptions = {
      radBtnMap: handleMapTgBtnClickEvent,
      radBtnBar: handleBarChartTgBtnClickEvent,
      radBtnDataTable: handleDataTableTgBtnClickEvent
    };
    tgOptions[clickedIDAttr]();
  }

  function sendPPTCSVClickInfoToSiteCatalyst(dlType) {
    var interactionData;

    interactionData = getInteractionData();
    // 18Apr2022 interactionData = mConfig.AppGUID + "," + dlType + "," + interactionData;
    interactionData =
      mHelperUtil.getDateTimeMMDDYYYYHHMMSS() +
      "," +
      mConfig.AppGUID +
      "," +
      dlType +
      "," +
      interactionData; // 18Apr2022
    mSiteCatalystLog.sendInfo(interactionData);
  }

  function handleViz2DownloadCSVClickEvent() {
    const vizCSVFunctionsObj = {
      [mVizTgBtnStatusList.HeatMap]: function () {
        mHeatMap.downloadCSV();
        sendPPTCSVClickInfoToSiteCatalyst(
          mConfig.LogIdentifiersList.All_States_Heat_Map_CSV
        );
      },
      [mVizTgBtnStatusList.Line]: function () {
        mLineChart.downloadCSV();
        sendPPTCSVClickInfoToSiteCatalyst(
          mConfig.LogIdentifiersList.All_States_Line_Chart_CSV
        );
      }
    };
    vizCSVFunctionsObj[mActiveViz2]();
  }

  function finishPowerPointDownload() {
    window.clearInterval(mFileDownloadCheckTimer);
    $(document.body).removeClass("loading");
    Cookies.remove("downloadTokenValueID"); // clears this cookie value
  }

  function handleViz2DownloadPPTClickEvent() {
    // ? setTimeout is required to make sure the 'loading' icon is
    // ? displayed before it triggers the download
    $(document.body).addClass("loading");
    const token = new Date().getTime();

    const vizPPTFunctionsObj = {
      [mVizTgBtnStatusList.HeatMap]: function () {
        setTimeout(function () {
          mHeatMap.downloadPPT(token);
          sendPPTCSVClickInfoToSiteCatalyst(
            mConfig.LogIdentifiersList.All_States_Heat_Map_PPT
          );
        }, 300);
      },
      [mVizTgBtnStatusList.Line]: function () {
        setTimeout(function () {
          mLineChart.downloadPPT(token);
          sendPPTCSVClickInfoToSiteCatalyst(
            mConfig.LogIdentifiersList.All_States_Line_Chart_PPT
          );
        }, 300);
      }
    };
    vizPPTFunctionsObj[mActiveViz2]();
    mFileDownloadCheckTimer = window.setInterval(function () {
      const cookieValue = Cookies.get("downloadTokenValueID"); // this code depends on js.cookie.js library
      if (cookieValue === String(token)) {
        finishPowerPointDownload();
      }
    }, 300);
  }

  function handleViz1DownloadPPTClickEvent() {
    $(document.body).addClass("loading");
    const token = new Date().getTime();

    const vizPPTFunctionsObj = {
      [mVizTgBtnStatusList.Map]: function () {
        setTimeout(function () {
          mMap.downloadPPT(token);
          sendPPTCSVClickInfoToSiteCatalyst(
            mConfig.LogIdentifiersList.All_States_Map_PPT
          );
        }, 300);
      },
      [mVizTgBtnStatusList.Bar]: function () {
        setTimeout(function () {
          mBarChart.downloadPPT(token);
          sendPPTCSVClickInfoToSiteCatalyst(
            mConfig.LogIdentifiersList.All_States_Bar_Chart_PPT
          );
        }, 300);
      }
    };
    vizPPTFunctionsObj[mActiveViz1]();

    mFileDownloadCheckTimer = window.setInterval(function () {
      const cookieValue = Cookies.get("downloadTokenValueID"); // this code depends on js.cookie.js library
      if (cookieValue === String(token)) {
        finishPowerPointDownload();
      }
    }, 300);
  }

  function handleViz1DownloadCSVClickEvent() {
    const vizCSVFunctionsObj = {
      [mVizTgBtnStatusList.Map]: function () {
        mMap.downloadCSV();
        sendPPTCSVClickInfoToSiteCatalyst(
          mConfig.LogIdentifiersList.All_States_Map_CSV
        );
      },
      [mVizTgBtnStatusList.Bar]: function () {
        mBarChart.downloadCSV();
        sendPPTCSVClickInfoToSiteCatalyst(
          mConfig.LogIdentifiersList.All_States_Bar_Chart_CSV
        );
      },
      [mVizTgBtnStatusList.Table]: function () {
        mDataTable.downloadCSV();
        sendPPTCSVClickInfoToSiteCatalyst(
          mConfig.LogIdentifiersList.All_States_Table_CSV
        );
      }
    };
    vizCSVFunctionsObj[mActiveViz1]();
  }

  // 29Apr2022
  function handleHeatMapTgBtnClickEvent() {
    displayHeatMap();
    sendUIInfoToSiteCatalyst(
      mConfig.LogIdentifiersList.Current_Page +
        "," +
        mConfig.LogIdentifiersList.All_States_HeatMap
    );
  }

  // 29Apr2022
  function handleLineChartTgBtnClickEvent() {
    displayLineChart();
    sendUIInfoToSiteCatalyst(
      mConfig.LogIdentifiersList.Current_Page +
        "," +
        mConfig.LogIdentifiersList.All_States_Line_Chart
    );
  }

  function handleHeatMapLineToggleClickEvent(evt) {
    const clickedIDAttr = $(evt.target).attr("id");
    /*  // 29Apr2022
     const tgOptions = {
      radBtnHeatMap: displayHeatMap,
      radBtnLine: displayLineChart
    }; */
    const tgOptions = {
      radBtnHeatMap: handleHeatMapTgBtnClickEvent,
      radBtnLine: handleLineChartTgBtnClickEvent
    };
    tgOptions[clickedIDAttr]();
  }

  // 29Apr2022
  function handleReadMoreClickEvent() {
    sendUIInfoToSiteCatalyst(
      mConfig.LogIdentifiersList.Current_Page +
        "," +
        mConfig.LogIdentifiersList.Read_More
    );
  }

  function registerHandlebarsHelperMethods() {
    Handlebars.registerHelper(
      "setDataClassificationFilterItemID",
      function (dataClassificationID) {
        return "radDataClassification_" + dataClassificationID;
      }
    );

    Handlebars.registerHelper("setRadBtnID", function (suffix, radBtnID) {
      return "radBtn" + suffix + "_" + radBtnID;
    });

    Handlebars.registerHelper("setRadBtnRelID", function (relID) {
      return relID;
    });

    Handlebars.registerHelper("setRadBtnGroupName", function (suffix) {
      return "radBtnGrp" + suffix;
    });
  }

  function getInteractionData() {
    var interactionData;
    var indicatorID;
    var measureID;
    var submeasureID;
    var datasetID;
    var dataTypeID;
    var dataClassificationID;
    var ageClassificationTypeID;

    indicatorID = mAllStatesData.DataParameters.getIndicatorID();
    measureID = mAllStatesData.DataParameters.getMeasureID();
    submeasureID = mAllStatesData.DataParameters.getSubmeasureID();
    datasetID = mAllStatesData.DataParameters.getDatasetID();
    dataTypeID = mAllStatesData.DataParameters.getDataTypeID();
    dataClassificationID =
      mAllStatesData.DataParameters.getDataClassificationID();
    ageClassificationTypeID =
      mAllStatesData.DataParameters.getAgeClassificationTypeID();

    interactionData =
      mAllStatesGeoID +
      "," +
      indicatorID +
      "," +
      measureID +
      "," +
      submeasureID +
      "," +
      datasetID +
      "," +
      dataTypeID +
      "," +
      dataClassificationID +
      "," +
      ageClassificationTypeID;

    return interactionData;
  }

  function sendInfoToSiteCatalayst() {
    var interactionData;

    interactionData = getInteractionData();
    // 19Apr2022 interactionData = mConfig.AppGUID + "," + interactionData;
    interactionData =
      mHelperUtil.getDateTimeMMDDYYYYHHMMSS() +
      "," +
      mConfig.AppGUID +
      "," +
      interactionData; // 19Apr2022
    mSiteCatalystLog.sendInfo(interactionData);
  }

  // 28Apr2022
  function sendUIInfoToSiteCatalyst(uiInfo) {
    var interactionData;

    interactionData = getInteractionData();
    interactionData =
      mHelperUtil.getDateTimeMMDDYYYYHHMMSS() +
      "," +
      mConfig.AppGUID +
      "," +
      uiInfo +
      "," +
      interactionData; // 19Apr2022
    mSiteCatalystLog.sendInfo(interactionData);
  }

  function getDataForIndicatorID(indicatorID) {
    var matches = [];

    mAllStatesData.DataParameters.setIndicatorID(indicatorID);
    const indicatorsList = mInitAppData.indicators_list;
    indicatorsList.forEach(function (topic) {
      matches = matches.concat(
        topic.IndicatorsList.filter(function (indicatorObj) {
          return indicatorObj.IndicatorID === indicatorID;
        })
      );
    });
    const newIndicatorObj = matches[0];
    mAllStatesData.DataParameters.setIndicatorName(
      newIndicatorObj.IndicatorName
    );
    const datasetList = newIndicatorObj.DatasetList;
    mAllStatesData.DataCollection.setDatasetList(datasetList);
    const measuresList = newIndicatorObj.MeasuresList;
    mAllStatesData.DataCollection.setMeasuresList(measuresList);

    const firstDatasetObj = newIndicatorObj.DatasetList[0];
    mAllStatesData.DataParameters.setDatasetID(firstDatasetObj.DatasetID);
    mAllStatesData.DataParameters.setDatasetLabel(firstDatasetObj.DatasetLabel);
    mAllStatesData.DataParameters.setMeasureID(mDefaultMeasureID);
    mAllStatesData.DataParameters.setMeasureName(mDefaultMeasureName);

    mAllStatesDataMod.updateDataParameters(mAllStatesData.DataParameters);
    mAllStatesDataMod.updateDataCollection(mAllStatesData.DataCollection);

    const dataCallConfig = {
      IndicatorID: indicatorID,
      MeasureID: mDefaultMeasureID,
      DatasetID: firstDatasetObj.DatasetID
    };

    mAllStatesDataMod.executeAllStatesIndicatorDataCall(dataCallConfig);
  }

  function initAllStatesDataModule() {
    mAllStatesDataMod = AllStatesData();
    mAllStatesDataMod.init();
    mAllStatesData = mAllStatesDataMod.getData();
    mMediator.registerComponent("allstatesdata", mAllStatesDataMod);

    mAllStatesData = mAllStatesDataMod.processInitAppData(mInitAppData);

    if (mConfig.ShouldLoadInitIndicator) {
      mAllStatesDataMod.executeInitIndicatorDataCall();
    } else {
      getDataForIndicatorID(mConfig.CurrentIndicatorID);
    }
  }

  function generateDatasetFilters() {
    const $DatasetFiltersContainer = $("#datasetFiltersContainer");
    $DatasetFiltersContainer.empty();
    const config = {
      DatasetList: mAllStatesData.DataCollection.getDatasetList()
    };
    const datasetFiltersCompiledTemplateHTML =
      Handlebars.compile(DatasetTemplateHTML);
    const datasetFiltersGeneratedHTML =
      datasetFiltersCompiledTemplateHTML(config);
    $DatasetFiltersContainer.append(datasetFiltersGeneratedHTML);
  }

  function showDataClassificationFilterContainer() {
    $("#dataClassificationFiltersContainer").show(); // ? Data Classification does not apply to National
  }

  function generateDataTypeFilters() {
    const $DataTypeFiltersContainer = $("#dataTypeFiltersContainer");
    $DataTypeFiltersContainer.empty();
    const config = {
      DataTypeList: mAllStatesData.DataCollection.getDataTypesList()
    };
    const dataTypeFiltersCompiledTemplateHTML =
      Handlebars.compile(DataTypeTemplateHTML);
    const dataTypeFiltersGeneratedHTML =
      dataTypeFiltersCompiledTemplateHTML(config);
    $DataTypeFiltersContainer.append(dataTypeFiltersGeneratedHTML);
  }

  function generateDataClassificationFilters() {
    const $DataClassificationFiltersContainer = $(
      "#dataClassificationFiltersContainer"
    );

    $DataClassificationFiltersContainer.empty();
    const config = {
      DataClassificationList:
        mAllStatesData.DataCollection.getDataClassificationList()
    };
    const dataClassificationFiltersCompiledTemplateHTML = Handlebars.compile(
      DataClassificationTemplateHTML
    );
    const dataClassificationFiltersGeneratedHTML =
      dataClassificationFiltersCompiledTemplateHTML(config);

    $DataClassificationFiltersContainer.append(
      dataClassificationFiltersGeneratedHTML
    );
  }

  function generateAgeClassificationFilters() {
    const $AgeClassificationFiltersContainer = $(
      "#ageClassificationFiltersContainer"
    );
    $AgeClassificationFiltersContainer.empty();
    const config = {
      AgeClassificationList:
        mAllStatesData.DataCollection.getAgeClassificationList()
    };
    const ageClassificationFiltersCompiledTemplateHTML = Handlebars.compile(
      AgeClassificationTemplateHTML
    );
    const ageClassificationFiltersGeneratedHTML =
      ageClassificationFiltersCompiledTemplateHTML(config);
    $AgeClassificationFiltersContainer.append(
      ageClassificationFiltersGeneratedHTML
    );
  }

  function generateMeasureDDLFilters() {
    const $MeasureFiltersContainer = $("#measureFiltersDDLContainer");
    $MeasureFiltersContainer.empty();
    const config = {
      MeasuresList: mAllStatesData.DataCollection.getMeasuresList()
    };
    const measureFiltersCompiledTemplateHTML = Handlebars.compile(
      MeasuresDDLTemplateHTML
    );
    const measureFiltersGeneratedHTML =
      measureFiltersCompiledTemplateHTML(config);
    $MeasureFiltersContainer.append(measureFiltersGeneratedHTML);
  }

  function generateMeasureToolbarFilters() {
    const $MeasureFiltersContainer = $("#measureFiltersToolbarContainer");
    $MeasureFiltersContainer.empty();
    const config = {
      MeasuresList: mAllStatesData.DataCollection.getMeasuresList()
    };
    const measureFiltersCompiledTemplateHTML = Handlebars.compile(
      MeasuresToolbarTemplateHTML
    );
    const measureFiltersGeneratedHTML =
      measureFiltersCompiledTemplateHTML(config);
    $MeasureFiltersContainer.append(measureFiltersGeneratedHTML);
  }

  function generateMeasureFilters() {
    generateMeasureToolbarFilters();
    generateMeasureDDLFilters();
  }

  function addAllSubmeasuresToSelectedItemsList(submeasuresList) {
    mSelectedSubmeasuresList = submeasuresList.map(function (e) {
      return e.ID;
    });
  }

  function generateSubmeasureFilters() {
    var filteredSubmeasuresList;
    const submeasuresList = mAllStatesData.DataCollection.getSubmeasuresList();

    if (isMeasureTotal()) {
      addTotalSubmeasureToSelectedSubmeasuresList();
      $("#submeasuresToolbarContainer").empty();
      $("#btnToggleSubmeasuresToolbar").addClass("d-none");
      return;
    }
    $("#btnToggleSubmeasuresToolbar").removeClass("d-none");
    // exclude Age-Adjusted from submeasures list
    if (isMeasureAge()) {
      filteredSubmeasuresList = submeasuresList.filter(function (d) {
        return d.SubmeasureID !== mAgeAdjustedID1;
      });
    } else {
      filteredSubmeasuresList = submeasuresList;
    }

    addAllSubmeasuresToSelectedItemsList(filteredSubmeasuresList);

    const config = {
      GroupName: "Submeasure",
      RadioList: filteredSubmeasuresList,
      RelID: "js-SubmeasureItem"
    };
    const compiledTemplateHTML = Handlebars.compile(RadioListTemplateHTML);
    const generatedHTML = compiledTemplateHTML(config);
    $("#submeasuresToolbarContainer").empty();
    $("#submeasuresToolbarContainer").append(generatedHTML);
    setSubmeasuresToggleBtnText(); // 05Mar2022
    highlightSubmeasure();
  }

  function highlightDataset() {
    const datasetID = mAllStatesData.DataParameters.getDatasetID();
    $("#radDataset_" + datasetID).prop("checked", true);
  }

  /*  // 19Apr2022
  function highlightDataType() {
    var attrDataTypeID;
    var dataTypeID;
    var elemSelector;

    const currentDataTypeID = mAllStatesData.DataParameters.getDataTypeID();
    const currentDataTypeLabel =
      mAllStatesData.DataParameters.getDataTypeLabel();

    elemSelector = "button[rel=js-DataTypeFilter]";

    $(elemSelector).each(function () {
      attrDataTypeID = $(this).attr("id");
      dataTypeID = Number(attrDataTypeID.split("_")[1]);
      if (dataTypeID === currentDataTypeID) {
        $(this).find("i").removeClass("d-none");
      } else {
        $(this).find("i").addClass("d-none");
      }
    });

    $("#btnDataTypeFilters").text(currentDataTypeLabel);
  } */

  // 19Apr2022
  function highlightDataType() {
    const dataTypeID = mAllStatesData.DataParameters.getDataTypeID();
    $("#dataType_" + dataTypeID).prop("checked", true);
  }

  function highlightDataClassification() {
    const dataClassificationTypeID =
      mAllStatesData.DataParameters.getDataClassificationID();
    $("#radDataClassification_" + dataClassificationTypeID).prop(
      "checked",
      true
    );
  }

  function highlightAgeClassification() {
    const ageClassificationID =
      mAllStatesData.DataParameters.getAgeClassificationTypeID();
    $("#radAgeClassification_" + ageClassificationID).prop("checked", true);
  }

  // 25Apr2022
  function hideAgeClassificationAgeAdjustedType() {
    $("#radAgeClassification_635").parent().hide();
  }
  // 25Apr2022
  function showAgeClassificationAgeAdjustedType() {
    $("#radAgeClassification_635").parent().show();
  }

  function highlightToolbarMeasure() {
    const measureID = mAllStatesData.DataParameters.getMeasureID();
    $("#radMeasure_" + measureID).prop("checked", true);
  }

  function highlightDDLMeasure() {
    var attrDataTypeID;
    var measureID;
    var elemSelector;

    const currentMeasureID = mAllStatesData.DataParameters.getMeasureID();
    const currentMeasureName = mAllStatesData.DataParameters.getMeasureName();

    elemSelector = "button[rel=js-DDLMeasure]";

    $(elemSelector).each(function () {
      attrDataTypeID = $(this).attr("id");
      measureID = Number(attrDataTypeID.split("_")[1]);
      if (measureID === currentMeasureID) {
        $(this).find("i").removeClass("d-none");
      } else {
        $(this).find("i").addClass("d-none");
      }
    });

    $("#btnMeasuresDDL").text(currentMeasureName);
  }

  /*  // 05Mar2022
   function setSubmeasuresToggleBtnText() {
    const currentMeasureName = mAllStatesData.DataParameters.getMeasureName();
    const txt = "Show " + currentMeasureName + " Types";
    $("#btnToggleSubmeasuresToolbar").text(txt);
  } */

  function setSubmeasuresToggleBtnText() {
    const currentMeasureName = mAllStatesData.DataParameters.getMeasureName();
    const showTxt = "Show " + currentMeasureName + " Types";
    const hideTxt = "Hide " + currentMeasureName + " Types";

    if (mIsSubmeasuresToolbarOpen === false) {
      $(".da-submeasures-toggle-btn").html(showTxt);
    } else {
      $(".da-submeasures-toggle-btn").html(hideTxt);
    }
  }

  function highlightSubmeasure() {
    const submeasureID = mAllStatesData.DataParameters.getSubmeasureID();
    $("#radBtnSubmeasure_" + submeasureID).prop("checked", true);
  }

  function highlightMeasure() {
    highlightToolbarMeasure();
    highlightDDLMeasure();
    // 05Mar2022  setSubmeasuresToggleBtnText();
  }

  function addTotalSubmeasureToSelectedSubmeasuresList() {
    if (
      mSelectedSubmeasuresList.indexOf(mTotalSubmeasureID) === -1 ||
      mSelectedSubmeasuresList.length === 0
    ) {
      mSelectedSubmeasuresList.push(mTotalSubmeasureID);
    }
  }

  function isMeasureTotal() {
    var measureName = mAllStatesData.DataParameters.getMeasureName();
    if (measureName === "Total") {
      return true;
    }
    return false;
  }

  function isMeasureAge() {
    var measureID;

    measureID = mAllStatesData.DataParameters.getMeasureID();
    if (measureID === mAgeMeasureID) {
      return true;
    }
    return false;
  }

  function isDataTypeNumberValue() {
    if (mAllStatesData.DataParameters.getDataType() === "NumberValue") {
      return true;
    }
    return false;
  }

  function setAgeClassficationToCrude() {
    var currentAgeClassificationList;
    var totalCrudeAgeClassificationObj;

    currentAgeClassificationList =
      mAllStatesData.DataCollection.getAgeClassificationList();
    totalCrudeAgeClassificationObj = currentAgeClassificationList.find(
      function (d) {
        return d.AgeClassificationTypeLabel === "Crude";
      }
    );
    mAllStatesData.DataParameters.setAgeClassificationType(
      totalCrudeAgeClassificationObj.AgeClassificationTypeLabel
    );
    mAllStatesData.DataParameters.setAgeClassificationTypeID(
      totalCrudeAgeClassificationObj.AgeClassificationTypeID
    );
    mAllStatesDataMod.updateDataParameters(mAllStatesData.DataParameters);
  }

  // 22Apr2022
  function setAgeClassificationToAgeAdjusted() {
    var ageAdjustedAgeClassificationList;
    var ageAdjustedAgeClassificationObj;

    ageAdjustedAgeClassificationList =
      mAllStatesData.DataCollection.getAgeClassificationList();
    ageAdjustedAgeClassificationObj = ageAdjustedAgeClassificationList.find(
      function (d) {
        return d.AgeClassificationTypeLabel === "Age-Adjusted";
      }
    );
    mAllStatesData.DataParameters.setAgeClassificationType(
      ageAdjustedAgeClassificationObj.AgeClassificationTypeLabel
    );
    mAllStatesData.DataParameters.setAgeClassificationTypeID(
      ageAdjustedAgeClassificationObj.AgeClassificationTypeID
    );
    mAllStatesDataMod.updateDataParameters(mAllStatesData.DataParameters);
  }

  function setAgeClassificationFiltersDisplayStatus() {
    // TODO: Test this condition
    /*  // 25Apr2022
    if (isDataTypeNumberValue() || isMeasureAge()) {
      $("#ageClassificationFiltersContainer").hide();
      setAgeClassficationToCrude();
    } else {
      $("#ageClassificationFiltersContainer").show();
      highlightAgeClassification();
    } */
    /*  // 04May2022
    // 25Apr2022
    if (isMeasureAge()) {
      setAgeClassficationToCrude();
       $("#ageClassificationFiltersContainer").hide();
    } else if (isDataTypeNumberValue()) {
      setAgeClassficationToCrude();
      $("#ageClassificationFiltersContainer").show();
      hideAgeClassificationAgeAdjustedType(); // 25Apr2022
        highlightAgeClassification(); // 25Apr2022
    } else {
      showAgeClassificationAgeAdjustedType(); // 25Apr2022
       $("#ageClassificationFiltersContainer").show();
      highlightAgeClassification();
    } */
    // 04May2022
    if (isMeasureAge() || isDataTypeNumberValue()) {
      setAgeClassficationToCrude();
      hideAgeClassificationAgeAdjustedType(); // 25Apr2022
    } else {
      setAgeClassificationToAgeAdjusted();
      showAgeClassificationAgeAdjustedType(); // 25Apr2022
    }
    highlightAgeClassification(); // 04May2022
  }

  function setIndicatorSubtitle() {
    var titleText = "";
    var currentDataTypeLabel;
    var currentMeasureName;
    var currentDatasetLabel;
    var currentAgeClassificationType;
    var totalConditionReducer;
    var currentDataClassificationType;
    var measureConditionReducer;
    var genderRaceEducationConditionReducer;
    var currentSubmeasureLabel;
    var currentDataType;

    currentMeasureName = mAllStatesData.DataParameters.getMeasureName();
    currentDatasetLabel = mAllStatesData.DataParameters.getDatasetLabel();
    currentSubmeasureLabel = mAllStatesData.DataParameters.getSubmeasureLabel();
    currentAgeClassificationType =
      mAllStatesData.DataParameters.getAgeClassificationType();
    currentDataTypeLabel = mAllStatesData.DataParameters.getDataTypeLabel();
    currentDataType = mAllStatesData.DataParameters.getDataType();
    currentDataClassificationType =
      mAllStatesData.DataParameters.getDataClassificationType();

    totalConditionReducer = {
      NumberValue: function () {
        titleText =
          currentMeasureName +
          ", " +
          currentDatasetLabel +
          ", " +
          currentDataTypeLabel +
          ", " +
          currentDataClassificationType +
          ", All States";

        return titleText;
      },
      EstimateValue: function () {
        titleText =
          currentMeasureName +
          ", " +
          currentDatasetLabel +
          ", " +
          currentAgeClassificationType +
          " " +
          currentDataTypeLabel +
          ", " +
          currentDataClassificationType +
          ", All States";

        return titleText;
      }
    };

    // 10Feb2021 genderEducationConditionReducer = {
    genderRaceEducationConditionReducer = {
      NumberValue: function () {
        titleText =
          currentSubmeasureLabel +
          " (" +
          currentMeasureName +
          "), " +
          currentDatasetLabel +
          ", " +
          currentDataTypeLabel +
          ", " +
          currentDataClassificationType +
          ", All States";
        return titleText;
      },
      EstimateValue: function () {
        titleText =
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
          ", All States";

        return titleText;
      }
    };

    measureConditionReducer = {
      Age: (function () {
        titleText =
          currentSubmeasureLabel +
          " (" +
          currentMeasureName +
          "), " +
          currentDatasetLabel +
          ", " +
          currentDataTypeLabel +
          ", " +
          currentDataClassificationType +
          ", All States";

        return titleText;
      })(),
      Total: totalConditionReducer[currentDataType](),

      Gender: genderRaceEducationConditionReducer[currentDataType](),

      Education: genderRaceEducationConditionReducer[currentDataType](),

      "Race-Ethnicity": genderRaceEducationConditionReducer[currentDataType]() // 10Feb2021
    };

    const subTitleText = measureConditionReducer[currentMeasureName];

    $("#indicatorSubtitle").text(subTitleText);
  }

  function getSanitizedHTML(htmlText) {
    var sanitizedHTML;
    var regexDblQuotes = new RegExp("&#34;", "g");
    var regexSingleQuotes = new RegExp("&#39;", "g");

    sanitizedHTML = htmlText.replace(regexDblQuotes, '"');
    sanitizedHTML = sanitizedHTML.replace(regexSingleQuotes, "'");

    return sanitizedHTML;
  }

  function setIndicatorReadMoreContent() {
    const readMoreContentHTML =
      mAllStatesData.DataCollection.getIndicatorSourceDesc();
    const sanitizedHTML = getSanitizedHTML(readMoreContentHTML);
    $("#readMoreContent").empty();
    $("#readMoreContent").append(sanitizedHTML);
  }

  function unregisterMap() {
    if (mMap) {
      mMediator.unregisterComponent(mAllStatesMapName);
      mMap.dispose();
      mMap = mHelperUtil.setObjToNull(mMap);
    }
  }

  function unregisterBarChart() {
    if (mBarChart) {
      mMediator.unregisterComponent(mBarChartName);
      mBarChart.dispose();
      mBarChart = mHelperUtil.setObjToNull(mBarChart);
    }
  }

  function unregisterDataTable() {
    if (mDataTable) {
      mMediator.unregisterComponent(mDataTableName);
      mDataTable.dispose();
      mDataTable = mHelperUtil.setObjToNull(mDataTable);
    }
  }

  function unregisterHeatMap() {
    if (mHeatMap) {
      mMediator.unregisterComponent(mHeatMapName);
      mHeatMap.dispose();
      mHeatMap = mHelperUtil.setObjToNull(mHeatMap);
    }
  }

  function unregisterLineChart() {
    if (mLineChart) {
      mMediator.unregisterComponent(mLineChartName);
      mLineChart.dispose();
      mLineChart = mHelperUtil.setObjToNull(mLineChart);
    }
  }

  function unregisterAllVizComponents() {
    unregisterMap();
    unregisterBarChart();
    unregisterDataTable();
    unregisterHeatMap();
    unregisterLineChart();
  }

  function getMapChartTableConfig() {
    var config;

    const dataParametersCopy = mHelperUtil.getDeepCopyOfDataParametersObj(
      mAllStatesData.DataParameters
    );

    const datasetCopy = $.extend(
      "true",
      [],
      mAllStatesData.DataCollection.getCurrentBusinessDataset()
    );

    config = {
      ParentID: "viz1Visual", // 17Feb2022,
      MapID: mAllStatesMapName,
      BarChartID: mBarChartName,
      DataTableID: mDataTableName,
      DataParameters: dataParametersCopy,
      BusinessData: datasetCopy,
      ActiveLegendItems: mActiveLegendItems,
      SelectedStatesList: mSelectedStatesList,
      ChangeEventTypesList: mConfig.ChangeEventTypesList,
      // 17Mar2022 Mediator: mMediator,
      FileHashID: mConfig.FileHashID,
      HasFooter: true
    };

    return config;
  }

  function getHeatMapLineChartConfig() {
    var config;

    const dataParametersCopy = mHelperUtil.getDeepCopyOfDataParametersObj(
      mAllStatesData.DataParameters
    );

    const datasetCopy = $.extend(
      "true",
      [],
      mAllStatesData.DataCollection.getCurrentBusinessDataset()
    );

    config = {
      ParentID: "viz2Visual", // 17Feb2022,
      HeatMapID: mHeatMapName,
      LineChartID: mLineChartName,
      StatesList: mInitAppData.states_list,
      DataKeyID: "GeoID",
      LineLabelField: "GeoABBR",
      DataParameters: dataParametersCopy,
      BusinessData: datasetCopy,
      ActiveLegendItems: mActiveLegendItems,
      SelectedStatesList: mSelectedStatesList,
      SubmeasuresColorsList: $.extend(true, [], mInitAppData.colors_list),
      //  Mediator: mMediator,
      ChangeEventTypesList: mConfig.ChangeEventTypesList,
      FileHashID: mConfig.FileHashID,
      DrawLineLabel: true,
      HasFooter: true
    };

    return config;
  }

  function displayMap() {
    unregisterBarChart();
    unregisterDataTable();
    if (!mMap) {
      mMap = new AllStatesMap();
      mMediator.registerComponent(mAllStatesMapName, mMap);
      mMap.init(mMapChartTableConfig);
      mActiveViz1 = mVizTgBtnStatusList.Map;
    } else {
      mMap.update(mMapChartTableConfig);
    }
  }

  function displayBarChart() {
    unregisterMap();
    unregisterDataTable();
    mBarChart = new ColumnChart();
    mMediator.registerComponent(mBarChartName, mBarChart);
    mBarChart.init(mMapChartTableConfig);
    mActiveViz1 = mVizTgBtnStatusList.Bar;
  }

  function displayDataTable() {
    unregisterMap();
    unregisterBarChart();
    mDataTable = new AllStatesDataTable();
    mMediator.registerComponent(mDataTableName, mDataTable);
    mDataTable.init(mMapChartTableConfig);
    mActiveViz1 = mVizTgBtnStatusList.Table;
  }

  function displayHeatMap() {
    unregisterLineChart();
    mHeatMap = new AllStatesHeatMap();
    mMediator.registerComponent(mHeatMapName, mHeatMap);
    mHeatMap.init(mHeatMapChartConfig);
    mActiveViz2 = mVizTgBtnStatusList.HeatMap;
  }

  function displayLineChart() {
    unregisterHeatMap();
    mLineChart = new AllStatesLineChart();
    mMediator.registerComponent(mLineChartName, mLineChart);
    mLineChart.init(mHeatMapChartConfig);
    mActiveViz2 = mVizTgBtnStatusList.Line;
  }

  function displayMapChartTable() {
    mMapChartTableConfig = getMapChartTableConfig();
    const vizTypes = {
      [mVizTgBtnStatusList.Map]: displayMap,
      [mVizTgBtnStatusList.Bar]: displayBarChart,
      [mVizTgBtnStatusList.Table]: displayDataTable
    };
    vizTypes[mActiveViz1]();
  }

  function disableHeatMapToggleBtn() {
    $("#radBtnHeatMap").prop("checked", false);
    $("#radBtnHeatMap").prop("disabled", true);
  }

  function enableHeatMapToggleBtn() {
    $("#radBtnHeatMap").prop("disabled", false);
  }

  function displayHeatMapLineChart() {
    mHeatMapChartConfig = getHeatMapLineChartConfig();
    const vizTypes = {
      [mVizTgBtnStatusList.HeatMap]: displayHeatMap,
      [mVizTgBtnStatusList.Line]: displayLineChart
    };

    const currentDataClassificationID =
      mAllStatesData.DataParameters.getDataClassificationID();

    if (currentDataClassificationID === mQuartilesID) {
      disableHeatMapToggleBtn(); // ? For Quartiles, the data classification is done separately for each year and hence each year will have different bucket groups and hence different legend. Since the data
      // ? heatmap shows data for all years, showing quartiles data is not possible.
      $("#radBtnLine").prop("checked", true);
      displayLineChart();
    } else {
      enableHeatMapToggleBtn();
      vizTypes[mActiveViz2]();
    }
  }

  function initViz() {
    unregisterAllVizComponents();

    displayMapChartTable();
    displayHeatMapLineChart();
  }

  function initDataFilters() {
    showDataClassificationFilterContainer();

    // DATASET
    generateDatasetFilters();
    highlightDataset();

    // DATATYPE
    generateDataTypeFilters();
    highlightDataType();

    // DATA CLASSIFICATION
    generateDataClassificationFilters();
    highlightDataClassification();

    // AGE CLASSIFICATION
    generateAgeClassificationFilters();
    setAgeClassificationFiltersDisplayStatus();

    // MEASURES
    generateMeasureFilters();
    highlightMeasure();

    // SUBMEASURES
    generateSubmeasureFilters();

    setIndicatorSubtitle();
    setIndicatorReadMoreContent();
  }

  // 21Apr2022
  function getIndicatorInfoByIndicatorID(indicatorID) {
    var matches = [];
    var indicatorObj;

    const indicatorsList = mInitAppData.indicators_list;

    indicatorsList.forEach(function (topic) {
      matches = matches.concat(
        topic.IndicatorsList.filter(function (d) {
          return d.IndicatorID === indicatorID;
        })
      );
    });

    indicatorObj = matches[0];
    return indicatorObj;
  }

  // 21Apr2022
  function setDataset(newIndicatorObj) {
    const currentDatasetID = mAllStatesData.DataParameters.getDatasetID();
    const idx = newIndicatorObj.DatasetList.findIndex(function (d) {
      return d.DatasetID === currentDatasetID;
    });

    if (idx !== -1) {
      return; // ? keep the current dataset
    }

    // ? set to first dataset
    const firstDatasetObj = newIndicatorObj.DatasetList[0];
    mAllStatesData.DataParameters.setDatasetID(firstDatasetObj.DatasetID);
    mAllStatesData.DataParameters.setDatasetLabel(firstDatasetObj.DatasetLabel);
    mAllStatesDataMod.updateDataParameters(mAllStatesData.DataParameters);
  }

  // 21Apr2022
  function setMeasure(newIndicatorObj) {
    const currentMeasureID = mAllStatesData.DataParameters.getMeasureID();
    const idx = newIndicatorObj.MeasuresList.findIndex(function (d) {
      return d.MeasureID === currentMeasureID;
    });

    if (idx !== -1) {
      return; // ? keep the current measure
    }

    mAllStatesData.DataParameters.setMeasureID(mDefaultMeasureID);
    mAllStatesData.DataParameters.setMeasureName(mDefaultMeasureName);
    mAllStatesDataMod.updateDataParameters(mAllStatesData.DataParameters);
  }

  function handleIndicatorChangeEvent(changeConfig) {
    var newIndicatorObj;
    var firstDatasetObj;
    var newIndicatorID;
    var indicatorsList;
    var matches = [];
    var datasetList;
    var measuresList;

    mConfig.ChangeEventType = changeConfig.ChangeEventType;
    newIndicatorID = changeConfig.NewIndicatorID;

    mActiveLegendItems = [];

    /*  // 21Apr2022
     indicatorsList = mInitAppData.indicators_list;
    indicatorsList.forEach(function (topic) {
      matches = matches.concat(
        topic.IndicatorsList.filter(function (indicatorObj) {
          return indicatorObj.IndicatorID === newIndicatorID;
        })
      );
    });
    newIndicatorObj = matches[0]; */

    // INDICATOR INFO
    newIndicatorObj = getIndicatorInfoByIndicatorID(newIndicatorID); // 21Apr2022
    mAllStatesData.DataParameters.setIndicatorName(
      newIndicatorObj.IndicatorName
    );
    mAllStatesData.DataParameters.setIndicatorID(newIndicatorID);

    // DATASET LIST
    datasetList = newIndicatorObj.DatasetList;
    // 09Apr2021 DIAB-18
    datasetList.sort(function (a, b) {
      return a.DatasetID - b.DatasetID;
    });
    mAllStatesData.DataCollection.setDatasetList(datasetList);

    // MEASURES LIST
    measuresList = newIndicatorObj.MeasuresList;
    mAllStatesData.DataCollection.setMeasuresList(measuresList);

    /*  // 21Apr2022
     firstDatasetObj = newIndicatorObj.DatasetList[0];
    mAllStatesData.DataParameters.setDatasetID(firstDatasetObj.DatasetID);
    mAllStatesData.DataParameters.setDatasetLabel(firstDatasetObj.DatasetLabel);
    mAllStatesData.DataParameters.setMeasureID(mDefaultMeasureID);
    mAllStatesData.DataParameters.setMeasureName(mDefaultMeasureName); */

    mAllStatesDataMod.updateDataParameters(mAllStatesData.DataParameters);
    mAllStatesDataMod.updateDataCollection(mAllStatesData.DataCollection);

    setDataset(newIndicatorObj); // 21Apr2022
    setMeasure(newIndicatorObj); // 21Apr2022

    // 21Apr2022
    const dataCallConfig = {
      IndicatorID: newIndicatorID,
      MeasureID: mAllStatesData.DataParameters.getMeasureID(),
      DatasetID: mAllStatesData.DataParameters.getDatasetID()
    };

    mAllStatesDataMod.executeAllStatesIndicatorDataCall(dataCallConfig);
  }

  // 21Apr2022
  function getDataTypesList() {
    const businessDatasetColl =
      mAllStatesData.DataCollection.getBusinessDatasetColl();
    const dataTypesList = businessDatasetColl.map(function (d) {
      return {
        DataTypeID: d.DataTypeID,
        DataTypeLabel: d.DataTypeLabel,
        DataType: d.DataType
      };
    });

    for (let i = 0; i < dataTypesList.length; i += 1) {
      if (dataTypesList[i].DataType === "EstimateValue")
        mHelperUtil.moveItemInArray(dataTypesList, i, 0);
    }

    return dataTypesList;
  }

  // 21Apr2022
  function setDataType(dataTypesList) {
    const currentDataTypeID = mAllStatesData.DataParameters.getDataTypeID();
    const idx = dataTypesList.findIndex(function (d) {
      return d.DataTypeID === currentDataTypeID;
    });

    if (idx !== -1) {
      return; // ? keep current datatype
    }

    const firstDataTypeID = dataTypesList[0].DataTypeID;
    const firstDataTypeLabel = dataTypesList[0].DataTypeLabel;
    const firstDatatypeType = dataTypesList[0].DataType;

    mAllStatesData.DataParameters.setDataTypeID(firstDataTypeID);
    mAllStatesData.DataParameters.setDataTypeLabel(firstDataTypeLabel);
    mAllStatesData.DataParameters.setDataType(firstDatatypeType);

    mAllStatesDataMod.updateDataParameters(mAllStatesData.DataParameters);
  }

  // 21Apr2022
  function setCurrentBusinessDataset() {
    var currentDataTypeID;
    var currentDataTypeIDData;
    var businessDatasetColl;

    currentDataTypeID = mAllStatesData.DataParameters.getDataTypeID();
    businessDatasetColl =
      mAllStatesData.DataCollection.getBusinessDatasetColl();
    currentDataTypeIDData = businessDatasetColl.find(function (d) {
      return d.DataTypeID === currentDataTypeID;
    });

    mAllStatesData.DataCollection.setSubmeasuresList(
      currentDataTypeIDData.MeasureData.SubmeasuresList
    );
    mAllStatesData.DataCollection.setAgeClassificationList(
      currentDataTypeIDData.AgeClassificationTypeList
    ); // 20Apr2022
    mAllStatesData.DataCollection.setCurrentBusinessDataset(
      currentDataTypeIDData
    );
    mAllStatesDataMod.updateDataCollection(mAllStatesData.DataCollection);
  }

  // 21Apr2022
  function setAgeClassificationType() {
    const ageClassificationTypeList =
      mAllStatesData.DataCollection.getAgeClassificationList();
    const currentAgeClassificationTypeID =
      mAllStatesData.DataParameters.getAgeClassificationTypeID();
    const idx = ageClassificationTypeList.findIndex(function (d) {
      return d.AgeClassificationTypeID === currentAgeClassificationTypeID;
    });
    if (idx !== -1) {
      return; // keep current age-classification
    }

    const firstAgeClassificationTypeObj = ageClassificationTypeList[0];
    mAllStatesData.DataParameters.setAgeClassificationTypeID(
      firstAgeClassificationTypeObj.AgeClassificationTypeID
    );
    mAllStatesData.DataParameters.setAgeClassificationType(
      firstAgeClassificationTypeObj.AgeClassificationTypeLabel
    );

    mAllStatesDataMod.updateDataParameters(mAllStatesData.DataParameters);
  }

  // 21Apr2022
  function setDataClassificationType() {
    const dataClassificationList =
      mAllStatesData.DataCollection.getDataClassificationList();
    const currentDataClassificationID =
      mAllStatesData.DataParameters.getDataClassificationID();
    const idx = dataClassificationList.findIndex(function (d) {
      return d.DataClassificationID === currentDataClassificationID;
    });

    if (idx !== -1) {
      return; // keep current data-classification
    }

    const naturalBreaksDataClassificationObj = dataClassificationList.find(
      function (d) {
        return d.DataClassificationName === "Natural Breaks";
      }
    );
    mAllStatesData.DataParameters.setDataClassificationID(
      naturalBreaksDataClassificationObj.DataClassificationID
    );
    mAllStatesData.DataParameters.setDataClassificationType(
      naturalBreaksDataClassificationObj.DataClassificationName
    );

    mAllStatesDataMod.updateDataParameters(mAllStatesData.DataParameters);
  }

  // 21Apr2022
  function setYear() {
    var yearsList;
    var submeasureObj;
    const currentMeasureID = mAllStatesData.DataParameters.getMeasureID();
    const currentBusinessDataset =
      mAllStatesData.DataCollection.getCurrentBusinessDataset(); // 21Apr2022
    const currentMeasureData = currentBusinessDataset.MeasureData;
    const currentSubmeasureID = mAllStatesData.DataParameters.getSubmeasureID();
    const currentAgeClassificationType =
      mAllStatesData.DataParameters.getAgeClassificationType();
    const currentDataClassificationType =
      mAllStatesData.DataParameters.getDataClassificationType();
    const currentYear = mAllStatesData.DataParameters.getYear();
    const currentYearID = currentYear ? currentYear.YearID : 0;

    if (currentMeasureID === mTotalMeasureID) {
      const ageClassificationTypeData =
        currentAgeClassificationType === "Age-Adjusted"
          ? currentMeasureData.Data.AgeAdjustedData
          : currentMeasureData.Data.CrudeData;

      const dataClassificationTypeData =
        currentDataClassificationType === "Natural Breaks"
          ? ageClassificationTypeData.NaturalBreaksData
          : ageClassificationTypeData.QuartilesData;
      yearsList = dataClassificationTypeData.YearsList;
    } else if (currentMeasureID === mAgeMeasureID) {
      submeasureObj = currentMeasureData.Data.find(function (a) {
        return a.SubmeasureID === currentSubmeasureID;
      });
      const submeasureData =
        currentDataClassificationType === "Natural Breaks"
          ? submeasureObj.NaturalBreaksData
          : submeasureObj.QuartilesData;
      yearsList = submeasureData.YearsList;
    } else {
      const submeasureAgeClassificationData =
        currentAgeClassificationType === "Age-Adjusted"
          ? currentMeasureData.Data.AgeAdjustedData
          : currentMeasureData.Data.CrudeData;

      submeasureObj = submeasureAgeClassificationData.find(function (a) {
        return a.SubmeasureID === currentSubmeasureID;
      });

      const submeasureDataClassificationData =
        currentDataClassificationType === "Natural Breaks"
          ? submeasureObj.NaturalBreaksData
          : submeasureObj.QuartilesData;

      yearsList = submeasureDataClassificationData.YearsList;
    }

    const idx = yearsList.findIndex(function (d) {
      return d.YearID === currentYearID;
    });

    if (idx !== -1) {
      return; // keep current year
    }

    const latestYear = yearsList[yearsList.length - 1].YearID;
    const latestYearLabel = yearsList[yearsList.length - 1].YearLabel;
    mAllStatesData.DataParameters.setYear(latestYear);
    mAllStatesData.DataParameters.setYearLabel(latestYearLabel); // 13Mar2019
    mCurrentYear = {
      YearID: latestYear,
      YearLabel: latestYearLabel
    };

    mAllStatesDataMod.updateDataParameters(mAllStatesData.DataParameters);
  }

  function handleReceivedAllStatesIndicatorDataEvent(data) {
    var yearsList;
    var firstSubmeasureDataObj;

    mAllStatesData = data;
    // 21Apr2022 const currentMeasureID = mAllStatesData.DataParameters.getMeasureID();
    /*  // 21Apr2022
     const businessDatasetColl =
      mAllStatesData.DataCollection.getBusinessDatasetColl();
    const dataTypesList = businessDatasetColl.map(function (d) {
      return {
        DataTypeID: d.DataTypeID,
        DataTypeLabel: d.DataTypeLabel,
        DataType: d.DataType
      };
    });

    for (let i = 0; i < dataTypesList.length; i += 1) {
      if (dataTypesList[i].DataType === "EstimateValue")
        mHelperUtil.moveItemInArray(dataTypesList, i, 0);
    } */
    // DATATYPE INFO
    const dataTypesList = getDataTypesList(); // 21Apr2022
    mAllStatesData.DataCollection.setDataTypesList(dataTypesList); // 21Apr2022
    mAllStatesDataMod.updateDataCollection(mAllStatesData.DataCollection); // 21Apr2022
    setDataType(dataTypesList); // 21Apr2022

    /*  // 21Apr2022
     const estimateDataTypeObj = dataTypesList.filter(function (d) {
      return d.DataType === "EstimateValue";
    })[0];
    const estimateDataTypeDataObj = businessDatasetColl.filter(function (d) {
      return d.DataTypeID === estimateDataTypeObj.DataTypeID;
    })[0];
    mAllStatesData.DataCollection.setCurrentBusinessDataset(
      estimateDataTypeDataObj
    ); */
    // BUSINESS DATASET
    setCurrentBusinessDataset(); // 21Apr2022

    // MEASURE
    const currentBusinessDataset =
      mAllStatesData.DataCollection.getCurrentBusinessDataset(); // 21Apr2022
    const measureData = currentBusinessDataset.MeasureData;

    // SUB-MEASURE
    const submeasuresList = measureData.SubmeasuresList;
    mAllStatesData.DataCollection.setSubmeasuresList(submeasuresList);
    const firstSubmeasureObj = submeasuresList[0];
    mAllStatesData.DataParameters.setSubmeasureID(firstSubmeasureObj.ID);
    mAllStatesData.DataParameters.setSubmeasureLabel(firstSubmeasureObj.Name);
    mAllStatesDataMod.updateDataCollection(mAllStatesData.DataCollection);
    mAllStatesDataMod.updateDataParameters(mAllStatesData.DataParameters);

    // AGE CLASSIFICATION
    const ageClassificationTypeList =
      currentBusinessDataset.AgeClassificationTypeList;
    mAllStatesData.DataCollection.setAgeClassificationList(
      ageClassificationTypeList
    );
    mAllStatesDataMod.updateDataCollection(mAllStatesData.DataCollection);
    /*  // 21Apr2022
     const ageAdjustedAgeClassificationTypeObj =
      ageClassificationTypeList.filter(function (d) {
        return d.AgeClassificationTypeLabel === "Age-Adjusted";
      })[0];
    mAllStatesData.DataParameters.setAgeClassificationTypeID(
      ageAdjustedAgeClassificationTypeObj.AgeClassificationTypeID
    );
    mAllStatesData.DataParameters.setAgeClassificationType(
      ageAdjustedAgeClassificationTypeObj.AgeClassificationTypeLabel
    ); */
    setAgeClassificationType(); // 21Apr2022

    // DATA CLASSIFICATION
    const dataClassificationList =
      currentBusinessDataset.DataClassificationList;
    mAllStatesData.DataCollection.setDataClassificationList(
      dataClassificationList
    );
    mAllStatesDataMod.updateDataCollection(mAllStatesData.DataCollection); // 21Apr2022

    /* const naturalBreaksDataClassificationObj = dataClassificationList.filter(
      function (d) {
        return d.DataClassificationName === "Natural Breaks";
      }
    )[0];
    mAllStatesData.DataParameters.setDataClassificationID(
      naturalBreaksDataClassificationObj.DataClassificationID
    );
    mAllStatesData.DataParameters.setDataClassificationType(
      naturalBreaksDataClassificationObj.DataClassificationName
    ); */
    setDataClassificationType();

    /*  // 21Apr2022
    mAllStatesData.DataParameters.setDataTypeID(estimateDataTypeObj.DataTypeID);
    mAllStatesData.DataParameters.setDataTypeLabel(
      estimateDataTypeObj.DataTypeLabel
    );

    mAllStatesData.DataParameters.setDataType(estimateDataTypeObj.DataType);
    mAllStatesData.DataCollection.setDataTypesList(dataTypesList); */

    /*  // 21Apr2022
     if (currentMeasureID === mTotalMeasureID) {
      yearsList = measureData.Data.AgeAdjustedData.NaturalBreaksData.YearsList;
    } else if (currentMeasureID === mAgeMeasureID) {
      firstSubmeasureDataObj = measureData.Data.filter(function (a) {
        return a.SubmeasureID === firstSubmeasureObj.ID;
      })[0];
      yearsList = firstSubmeasureDataObj.NaturalBreaksData.YearsList;
    } else {
      firstSubmeasureDataObj = measureData.Data.AgeAdjustedData.filter(
        function (a) {
          return a.SubmeasureID === firstSubmeasureObj.ID;
        }
      )[0];
      yearsList = firstSubmeasureDataObj.NaturalBreaksData.YearsList;
    }

    const latestYear = yearsList[yearsList.length - 1].YearID;
    const latestYearLabel = yearsList[yearsList.length - 1].YearLabel;
    mAllStatesData.DataParameters.setYear(latestYear);
    mAllStatesData.DataParameters.setYearLabel(latestYearLabel); // 13Mar2019
    mCurrentYear = {
      YearID: latestYear,
      YearLabel: latestYearLabel
    }; */
    setYear(); // 21Apr2022

    mAllStatesDataMod.updateDataCollection(mAllStatesData.DataCollection);
    mAllStatesDataMod.updateDataParameters(mAllStatesData.DataParameters);

    initDataFilters();
    initViz();

    $(document.body).removeClass("loading");
    sendInfoToSiteCatalayst();
  }

  function addEventListeners() {
    $.each(mClickEventHandlers, function (k, v) {
      $(document).on("click", k, v);
    });

    publicAPI[
      "on" + mConfig.ChangeEventTypesList.ReceivedAllStatesIndicatorDataEvent
    ] = function (data) {
      handleReceivedAllStatesIndicatorDataEvent(data);
    };

    publicAPI["on" + mConfig.ChangeEventTypesList.IndicatorChange] = function (
      changeConfig
    ) {
      handleIndicatorChangeEvent(changeConfig);
    };

    // 02May2022
    publicAPI["on" + mConfig.ChangeEventTypesList.Viz1ContainerResizedEvent] =
      function () {
        sendUIInfoToSiteCatalyst(mConfig.LogIdentifiersList.Maximize_Viz1);
      };

    // 02May2022
    publicAPI["on" + mConfig.ChangeEventTypesList.Viz2ContainerResizedEvent] =
      function () {
        sendUIInfoToSiteCatalyst(mConfig.LogIdentifiersList.Maximize_Viz2);
      };

    $(document).on("click", ".da-submeasures-toggle-btn", function () {
      /*  // 05Mar2022
      const currentMeasureName =
        mSingleStateData.DataParameters.getMeasureName();
      const showTxt = "Show " + currentMeasureName + " Types";
      const hideTxt = "Hide " + currentMeasureName + " Types";

      if (mIsSubmeasuresToolbarOpen === true) {
        $(".da-submeasures-toggle-btn").html(showTxt);
        mIsSubmeasuresToolbarOpen = false;
      } else {
        $(".da-submeasures-toggle-btn").html(hideTxt);
        mIsSubmeasuresToolbarOpen = true;
      } */
      mIsSubmeasuresToolbarOpen = !mIsSubmeasuresToolbarOpen;
      setSubmeasuresToggleBtnText(); // 05Mar2022
    });
  }

  function removeEventListeners() {
    $.each(mClickEventHandlers, function (k) {
      $(document).off("click", k);
    });

    $(document).off("click", ".da-submeasures-toggle-btn", function () {
      // empty function
    });

    publicAPI["on" + mConfig.ChangeEventTypesList.IndicatorChange] =
      function () {
        // empty function
      };

    publicAPI[
      "off" + mConfig.ChangeEventTypesList.ReceivedAllStatesIndicatorDataEvent
    ] = function () {
      // empty function
    };

    // 02May2022
    publicAPI["on" + mConfig.ChangeEventTypesList.Viz1ContainerResizedEvent] =
      function () {
        // empty function
      };

    // 02May2022
    publicAPI["on" + mConfig.ChangeEventTypesList.Viz2ContainerResizedEvent] =
      function () {
        // empty function
      };
  }

  function updateYear(newYearObj) {
    mCurrentYear = {
      YearID: newYearObj.YearID,
      YearLabel: newYearObj.YearLabel
    };
    mAllStatesData.DataParameters.setYear(newYearObj.YearID);
    mAllStatesData.DataParameters.setYearLabel(newYearObj.YearLabel); // 13Mar2019
    mAllStatesDataMod.updateDataParameters(mAllStatesData.DataParameters);
  }

  publicAPI.dispose = function () {
    removeEventListeners();
    unregisterAllVizComponents();
  };

  publicAPI.onStateSelected = function (selectedStateData) {
    mSelectedStatesList = selectedStateData.SelectedStatesList;
    displayHeatMapLineChart();
  };

  publicAPI.onStateUnSelected = function (selectedStateData) {
    mSelectedStatesList = selectedStateData.SelectedStatesList;
    displayHeatMapLineChart();
  };

  publicAPI.onDataTableSliderChangeEvent = function (newYearObj) {
    updateYear(newYearObj);
  };

  // 28Apr2022
  publicAPI.onAllStatesTableSliderPlayBtnClickEvent = function () {
    sendUIInfoToSiteCatalyst(
      mConfig.LogIdentifiersList.All_States_Table_Play_Button
    );
  };

  publicAPI.onMapSliderChangeEvent = function (newYearObj) {
    updateYear(newYearObj);
  };

  // 28Apr2022
  publicAPI.onMapSliderPlayBtnClickEvent = function () {
    sendUIInfoToSiteCatalyst(
      mConfig.LogIdentifiersList.All_States_Map_Play_Button
    );
  };

  publicAPI.onColumnChartSliderChangeEvent = function (newYearObj) {
    updateYear(newYearObj);
  };

  // 28Apr2022
  publicAPI.onAllStatesColumnChartSliderPlayBtnClickEvent = function () {
    sendUIInfoToSiteCatalyst(
      mConfig.LogIdentifiersList.All_States_Bar_Chart_Play_Button
    );
  };

  function setViz1Visual() {
    $("#viz1Container")
      .removeClass("da-vizcontainer-fullwidth ")
      .addClass("da-vizcontainer-multiple-width");
    $("#btnMaximizeViz1").show();
    $("#tgBtnMapBarTable").removeClass("d-none");
    $("#viz1Visual").empty();
    $("#viz1Container").show();
  }

  function setViz2Visual() {
    $("#viz2Container")
      .removeClass("da-vizcontainer-fullwidth ")
      .addClass("da-vizcontainer-multiple-width");
    $("#btnMaximizeViz2").show();
    $("#tgBtnHeatMapLine").removeClass("d-none");
    $("#viz2Visual").empty();
    $("#viz2_PPT").show();
    $("#viz2Container").show();
  }

  function setVizLayout() {
    $("#btnToggleStratificationsContainer").addClass("d-none");
    $("#stratificationsContainer").addClass("d-none");
    setViz1Visual();
    setViz2Visual();
  }

  publicAPI.init = function (config) {
    mConfig = config;
    GSAP.registerPlugin(CSSRulePlugin);
    mSiteCatalystLog = new SiteCatalystLog();
    mHelperUtil = new HelperUtil();
    mInitAppData = config.InitAppData;
    setVizLayout();
    initAllStatesDataModule();
    registerHandlebarsHelperMethods();
    addEventListeners();
  };

  return publicAPI;
}
export default AllStatesUI;
