import $ from "jquery";
import * as d3 from "../lib/d3_v4-min"; // 04Mar2021

function UtilHelpers() {
  var publicAPI = {};

  publicAPI.arrReduce = function (arr, idx) {
    var resultNum = arr.reduce(function (acc, d, i) {
      if (i === idx) {
        acc = d;
      }
      return acc;
    }, 0);

    return resultNum;
  };

  // 16Dec2020
  publicAPI.delay = function (n) {
    n = n || 2000;
    return new Promise((done) => {
      setTimeout(() => {
        done();
      }, n);
    });
  };

  publicAPI.getDistinctValuesAtIndex = function (_arr, _idx) {
    var arrValuesAtIndex = _arr.map(function (d, i) {
      return publicAPI.arrReduce(d, _idx);
    });

    var uniqueVal = arrValuesAtIndex.filter(function (item, i, ar) {
      return ar.indexOf(item) === i;
    });

    return uniqueVal;
  };

  publicAPI.getDistinctPropertyValues = function (arr, propName) {
    return arr
      .map(function (e) {
        return e[propName];
      })
      .filter(function (e, i, a) {
        return i === a.indexOf(e);
      });
  };

  publicAPI.getObjectsByDistinctPropertyValues = function (arr, propName) {
    return arr.filter(function (item, pos, array) {
      return (
        array
          .map(function (mapItem) {
            return mapItem[propName];
          })
          .indexOf(item[propName]) === pos
      );
    });
  };

  publicAPI.setObjToNull = function (obj) {
    Object.keys(obj).forEach(function (key) {
      obj[key] = null;
    });

    return null;
  };

  publicAPI.createDataParametersObj = function () {
    var dataParametersObj;
    var currentUserID;
    var callType;
    var geoID;
    var indicatorID;
    var indicatorName;
    var indicatorTopic;
    var dataClassificationID;
    var dataClassificationType;
    var ageClassificationType;
    var ageClassificationTypeID;
    var measureName;
    var measureID;
    var subMeasureID;
    var subMeasureLabel;
    var noDataColorHexVal;
    var suppressedDataColorHexVal;
    var year;
    var datasetID;
    var datasetLabel;
    var dataTypeLabel;
    var dataType;
    var dataTypeID;
    var yearLabel;
    var currentMode; // 26July2019
    var stratificationCatA; // 2Sept2019
    var stratificationCatB; // 2Sept2019
    var stratificationCatAItemID;
    var stratificationCatAItemLabel;
    var miscTypeID; // 8Nov2019
    var miscTypeLabel; // 8Nov2019

    function getMiscTypeID() {
      return miscTypeID;
    }

    function setMiscTypeID(m) {
      miscTypeID = m;
    }

    function getMiscTypeLabel() {
      return miscTypeLabel;
    }

    function setMiscTypeLabel(m) {
      miscTypeLabel = m;
    }

    function getStratificationCatAItemID() {
      return stratificationCatAItemID;
    }

    function setStratificationCatAItemID(m) {
      stratificationCatAItemID = m;
    }

    function getStratificationCatAItemLabel() {
      return stratificationCatAItemLabel;
    }

    function setStratificationCatAItemLabel(m) {
      stratificationCatAItemLabel = m;
    }

    function getStratificationCatA() {
      return stratificationCatA;
    }

    function setStratificationCatA(m) {
      stratificationCatA = m;
    }

    function getStratificationCatB() {
      return stratificationCatB;
    }

    function setStratificationCatB(m) {
      stratificationCatB = m;
    }

    function getCurrentMode() {
      return currentMode;
    }

    function setCurrentMode(m) {
      currentMode = m;
    }

    function getCurrentUserID() {
      return currentUserID;
    }

    function setCurrentUserID(m) {
      currentUserID = m;
    }

    function getCallType() {
      return callType;
    }

    function setCallType(m) {
      callType = m;
    }

    function getGeoID() {
      return geoID;
    }

    function setGeoID(m) {
      geoID = m;
    }

    function getIndicatorID() {
      return indicatorID;
    }

    function setIndicatorID(m) {
      indicatorID = m;
    }

    function getIndicatorName() {
      return indicatorName;
    }

    function setIndicatorName(m) {
      indicatorName = m;
    }

    function getIndicatorTopic() {
      return indicatorTopic;
    }

    function setIndicatorTopic(m) {
      indicatorTopic = m;
    }

    function getDataClassificationID() {
      return dataClassificationID;
    }

    function setDataClassificationID(m) {
      dataClassificationID = m;
    }

    function getDataClassificationType() {
      return dataClassificationType;
    }

    function setDataClassificationType(m) {
      dataClassificationType = m;
    }

    function getAgeClassificationType() {
      return ageClassificationType;
    }

    function setAgeClassificationType(m) {
      ageClassificationType = m;
    }

    function getAgeClassificationTypeID() {
      return ageClassificationTypeID;
    }

    function setAgeClassificationTypeID(m) {
      ageClassificationTypeID = m;
    }

    function getMeasureName() {
      return measureName;
    }

    function setMeasureName(m) {
      measureName = m;
    }

    function getSubmeasureID() {
      return subMeasureID;
    }

    function getMeasureID() {
      return measureID;
    }

    function setMeasureID(m) {
      measureID = m;
    }

    function setSubmeasureID(m) {
      subMeasureID = m;
    }
    function getNoDataColorHexVal() {
      return noDataColorHexVal;
    }

    function getSubmeasureLabel() {
      return subMeasureLabel;
    }

    function setSubmeasureLabel(m) {
      subMeasureLabel = m;
    }

    function setNoDataColorHexVal(m) {
      noDataColorHexVal = m;
    }

    function getSuppressedDataColorHexVal() {
      return suppressedDataColorHexVal;
    }

    function setSuppressedDataColorHexVal(m) {
      suppressedDataColorHexVal = m;
    }

    function getYear() {
      return year;
    }

    function setYear(m) {
      year = m;
    }

    function getYearLabel() {
      return yearLabel;
    }

    function setYearLabel(m) {
      yearLabel = m;
    }

    function getDatasetID() {
      return datasetID;
    }

    function setDatasetID(m) {
      datasetID = m;
    }

    function getDatasetLabel() {
      return datasetLabel;
    }

    function setDatasetLabel(m) {
      datasetLabel = m;
    }

    function getDataTypeLabel() {
      return dataTypeLabel;
    }

    function setDataTypeLabel(m) {
      dataTypeLabel = m;
    }

    function getDataType() {
      return dataType;
    }

    function setDataType(m) {
      dataType = m;
    }

    function getDataTypeID() {
      return dataTypeID;
    }

    function setDataTypeID(m) {
      dataTypeID = m;
    }

    dataParametersObj = {
      getCurrentUserID: getCurrentUserID,
      setCurrentUserID: setCurrentUserID,
      getCallType: getCallType,
      setCallType: setCallType,
      getGeoID: getGeoID,
      setGeoID: setGeoID,
      getIndicatorID: getIndicatorID,
      setIndicatorID: setIndicatorID,
      getIndicatorName: getIndicatorName,
      setIndicatorName: setIndicatorName,
      getIndicatorTopic: getIndicatorTopic,
      setIndicatorTopic: setIndicatorTopic,
      getDataClassificationID: getDataClassificationID,
      setDataClassificationID: setDataClassificationID,
      getDataClassificationType: getDataClassificationType,
      setDataClassificationType: setDataClassificationType,
      getAgeClassificationType: getAgeClassificationType,
      setAgeClassificationType: setAgeClassificationType,
      getAgeClassificationTypeID: getAgeClassificationTypeID,
      setAgeClassificationTypeID: setAgeClassificationTypeID,
      getMeasureName: getMeasureName,
      setMeasureName: setMeasureName,
      getMeasureID: getMeasureID,
      setMeasureID: setMeasureID,
      getSubmeasureID: getSubmeasureID,
      setSubmeasureID: setSubmeasureID,
      getSubmeasureLabel: getSubmeasureLabel,
      setSubmeasureLabel: setSubmeasureLabel,
      getNoDataColorHexVal: getNoDataColorHexVal,
      setNoDataColorHexVal: setNoDataColorHexVal,
      getSuppressedDataColorHexVal: getSuppressedDataColorHexVal,
      setSuppressedDataColorHexVal: setSuppressedDataColorHexVal,
      getYear: getYear,
      setYear: setYear,
      getDatasetID: getDatasetID,
      setDatasetID: setDatasetID,
      getDatasetLabel: getDatasetLabel,
      setDatasetLabel: setDatasetLabel,
      getDataTypeLabel: getDataTypeLabel,
      setDataTypeLabel: setDataTypeLabel,
      getDataType: getDataType,
      setDataType: setDataType,
      getDataTypeID: getDataTypeID,
      setDataTypeID: setDataTypeID,
      getYearLabel: getYearLabel,
      setYearLabel: setYearLabel,
      getCurrentMode: getCurrentMode,
      setCurrentMode: setCurrentMode,
      getStratificationCatA: getStratificationCatA,
      setStratificationCatA: setStratificationCatA,
      getStratificationCatB: getStratificationCatB,
      setStratificationCatB: setStratificationCatB,
      getStratificationCatAItemID: getStratificationCatAItemID,
      setStratificationCatAItemID: setStratificationCatAItemID,
      getStratificationCatAItemLabel: getStratificationCatAItemLabel,
      setStratificationCatAItemLabel: setStratificationCatAItemLabel,
      getMiscTypeID: getMiscTypeID,
      setMiscTypeID: setMiscTypeID,
      getMiscTypeLabel: getMiscTypeLabel,
      setMiscTypeLabel: setMiscTypeLabel
    };

    return dataParametersObj;
  };

  publicAPI.getDeepCopyOfDataParametersObj = function (dataParametersobj) {
    var dataParametersObjCopy = publicAPI.createDataParametersObj();

    dataParametersObjCopy.setCurrentUserID(
      dataParametersobj.getCurrentUserID()
    );
    dataParametersObjCopy.setCallType(dataParametersobj.getCallType());
    dataParametersObjCopy.setGeoID(dataParametersobj.getGeoID());
    dataParametersObjCopy.setIndicatorID(dataParametersobj.getIndicatorID());
    dataParametersObjCopy.setIndicatorName(
      dataParametersobj.getIndicatorName()
    );
    dataParametersObjCopy.setIndicatorTopic(
      dataParametersobj.getIndicatorTopic()
    );
    dataParametersObjCopy.setDataClassificationID(
      dataParametersobj.getDataClassificationID()
    );
    dataParametersObjCopy.setDataClassificationType(
      dataParametersobj.getDataClassificationType()
    );
    dataParametersObjCopy.setAgeClassificationType(
      dataParametersobj.getAgeClassificationType()
    );
    dataParametersObjCopy.setAgeClassificationTypeID(
      dataParametersobj.getAgeClassificationTypeID()
    );
    dataParametersObjCopy.setMeasureName(dataParametersobj.getMeasureName());
    dataParametersObjCopy.setMeasureID(dataParametersobj.getMeasureID());
    dataParametersObjCopy.setSubmeasureID(dataParametersobj.getSubmeasureID());
    dataParametersObjCopy.setSubmeasureLabel(
      dataParametersobj.getSubmeasureLabel()
    );
    dataParametersObjCopy.setNoDataColorHexVal(
      dataParametersobj.getNoDataColorHexVal()
    );
    dataParametersObjCopy.setSuppressedDataColorHexVal(
      dataParametersobj.getSuppressedDataColorHexVal()
    );
    dataParametersObjCopy.setYear(dataParametersobj.getYear());
    dataParametersObjCopy.setDatasetID(dataParametersobj.getDatasetID());
    dataParametersObjCopy.setDatasetLabel(dataParametersobj.getDatasetLabel());
    dataParametersObjCopy.setDataTypeLabel(
      dataParametersobj.getDataTypeLabel()
    );
    dataParametersObjCopy.setDataType(dataParametersobj.getDataType());
    dataParametersObjCopy.setDataTypeID(dataParametersobj.getDataTypeID());

    return dataParametersObjCopy;
  };

  publicAPI.createDataCollectionObj = function () {
    var dataObj;
    var measuresList;
    var submeasuresList;
    var indicatorSourceDesc;
    var indicatorSourceRef;
    var businessDataSetColl;
    var currentBusinessDataset;
    var dataTypesList;
    var datasetList;
    var yearsList;
    var indicatorsList;
    var statesList;
    var dataClassificationList;
    var ageClassificationList;
    var allStatesGeometry;
    var colorsList;
    var ageIDSortOrderList;
    var allCountiesGeometry;
    var countyStatesList;
    var allCountiesList;

    function getAllCountiesList() {
      return allCountiesList;
    }

    function setAllCountiesList(m) {
      allCountiesList = m;
    }

    function getCountyStatesList() {
      return countyStatesList;
    }

    function setCountyStatesList(m) {
      countyStatesList = m;
    }

    function getAllStatesGeometry() {
      return allStatesGeometry;
    }

    function setAllStatesGeometry(m) {
      allStatesGeometry = m;
    }

    function getAllCountiesGeometry() {
      return allCountiesGeometry;
    }

    function setAllCountiesGeometry(m) {
      allCountiesGeometry = m;
    }

    function getAgeClassificationList() {
      return ageClassificationList;
    }

    function setAgeClassificationList(m) {
      ageClassificationList = m;
    }

    function getDataClassificationList() {
      return dataClassificationList;
    }

    function setDataClassificationList(m) {
      dataClassificationList = m;
    }

    function getStatesList() {
      return statesList;
    }

    function setStatesList(m) {
      statesList = m;
    }

    function getIndicatorsList() {
      return indicatorsList;
    }

    function setIndicatorsList(m) {
      indicatorsList = m;
    }

    function getMeasuresList() {
      return measuresList;
    }

    function setMeasuresList(m) {
      measuresList = m;
    }

    function getIndicatorSourceDesc() {
      return indicatorSourceDesc;
    }

    function setIndicatorSourceDesc(m) {
      indicatorSourceDesc = m;
    }

    function getIndicatorSourceRef() {
      return indicatorSourceRef;
    }

    function setIndicatorSourceRef(m) {
      indicatorSourceRef = m;
    }

    function getBusinessDatasetColl() {
      return businessDataSetColl;
    }

    function setBusinessDatasetColl(m) {
      businessDataSetColl = m;
    }

    function getCurrentBusinessDataset() {
      return currentBusinessDataset;
    }

    function setCurrentBusinessDataset(m) {
      currentBusinessDataset = m;
    }

    function getDataTypesList() {
      return dataTypesList;
    }

    function setDataTypesList(m) {
      dataTypesList = m;
    }

    function getDatasetList() {
      return datasetList;
    }

    function setDatasetList(m) {
      datasetList = m;
    }

    function getSubmeasuresList() {
      return submeasuresList;
    }

    function setSubmeasuresList(m) {
      submeasuresList = m;
    }

    function setYearsList(m) {
      yearsList = m;
    }

    function getYearsList() {
      return yearsList;
    }

    function setColorsList(m) {
      colorsList = m;
    }

    function getColorsList() {
      return colorsList;
    }

    function getAgeIDSortOrderList() {
      return ageIDSortOrderList;
    }

    function setAgeIDSortOrderList(m) {
      ageIDSortOrderList = m;
    }

    dataObj = {
      getMeasuresList: getMeasuresList,
      setMeasuresList: setMeasuresList,
      getIndicatorSourceDesc: getIndicatorSourceDesc,
      setIndicatorSourceDesc: setIndicatorSourceDesc,
      getIndicatorSourceRef: getIndicatorSourceRef,
      setIndicatorSourceRef: setIndicatorSourceRef,
      getBusinessDatasetColl: getBusinessDatasetColl,
      setBusinessDatasetColl: setBusinessDatasetColl,
      getIndicatorsList: getIndicatorsList,
      setIndicatorsList: setIndicatorsList,
      getCurrentBusinessDataset: getCurrentBusinessDataset,
      setCurrentBusinessDataset: setCurrentBusinessDataset,
      getDataTypesList: getDataTypesList,
      setDataTypesList: setDataTypesList,
      getDatasetList: getDatasetList,
      setDatasetList: setDatasetList,
      getSubmeasuresList: getSubmeasuresList,
      setSubmeasuresList: setSubmeasuresList,
      getYearsList: getYearsList,
      setYearsList: setYearsList,
      getAllStatesGeometry: getAllStatesGeometry,
      setAllStatesGeometry: setAllStatesGeometry,
      getStatesList: getStatesList,
      setStatesList: setStatesList,
      getDataClassificationList: getDataClassificationList,
      setDataClassificationList: setDataClassificationList,
      getAgeClassificationList: getAgeClassificationList,
      setAgeClassificationList: setAgeClassificationList,
      setColorsList: setColorsList,
      getColorsList: getColorsList,
      getAgeIDSortOrderList: getAgeIDSortOrderList,
      setAgeIDSortOrderList: setAgeIDSortOrderList,
      getAllCountiesGeometry: getAllCountiesGeometry,
      setAllCountiesGeometry: setAllCountiesGeometry,
      setCountyStatesList: setCountyStatesList,
      getCountyStatesList: getCountyStatesList,
      getAllCountiesList: getAllCountiesList,
      setAllCountiesList: setAllCountiesList
    };

    return dataObj;
  };

  publicAPI.roundNumericStrings = function (str, numOfDecPlacesRequired) {
    // 29Jan2022  var roundFactor = Math.pow(10, numOfDecPlacesRequired);
    var roundFactor = 10 ** numOfDecPlacesRequired; // 29Jan2022
    return (Math.round(parseFloat(str) * roundFactor) / roundFactor).toFixed(
      numOfDecPlacesRequired
    );
  };

  publicAPI.moveItemInArray = function (arr, fromIndex, toIndex) {
    var elem;

    elem = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, elem);

    return arr;
  };

  publicAPI.getTodaysDate = function () {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var locale = "en-us";
    var month = currentDate
      .toLocaleString(locale, { month: "long" })
      .replace(
        /[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g,
        ""
      ); // This Regex is required to remove RTL character inserted by IE
    var year = currentDate.getFullYear();
    var todaysDate = day + "-" + month + "-" + year;

    return todaysDate;
  };

  // 18Apr2022
  publicAPI.getDateTimeMMDDYYYYHHMMSS = function () {
    // var date2 = new Date().toISOString().substr(0, 19).replace("T", " "); */

    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (month.toString().length === 1) {
      month = "0" + month;
    }
    if (day.toString().length === 1) {
      day = "0" + day;
    }
    if (hour.toString().length === 1) {
      hour = "0" + hour;
    }
    if (minute.toString().length === 1) {
      minute = "0" + minute;
    }
    if (second.toString().length === 1) {
      second = "0" + second;
    }
    var dateTime =
      month + day + year + " " + hour + ":" + minute + ":" + second;
    return dateTime;
  };

  publicAPI.getDeepCopyOfArray = function (arr) {
    var arrCopy = $.extend(true, [], arr);
    return arrCopy;
  };

  publicAPI.getJsonFile = function (fname) {
    return new Promise(function (resolve, reject) {
      d3.json(
        fname,
        function (data) {
          return resolve(data);
        },
        function () {
          // return reject("there was a problem loading the file.", err);
          return reject(new Error("there was a problem loading the file."));
        }
      );
    });
  };

  publicAPI.getSVGFile = function (fname) {
    return new Promise(function (resolve, reject) {
      d3.xml(
        fname,
        function (data) {
          return resolve(data.documentElement);
        },
        function () {
          return reject(new Error("there was a problem loading the file."));
        }
      );
    });
  };

  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line no-bitwise
  }

  function generateGUID() {
    var guid;

    guid = (
      S4() +
      S4() +
      "-" +
      S4() +
      "-4" +
      S4().substr(0, 3) +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    ).toLowerCase();

    return guid;
  }

  publicAPI.getAppUserID = function () {
    // ? This GUID is used as a unique App User ID
    var guid;
    if (localStorage.getItem("diabetesatlasguid")) {
      guid = localStorage.getItem("diabetesatlasguid");
    } else {
      guid = generateGUID();
      localStorage.setItem("diabetesatlasguid", guid);
    }
    return guid;
  };

  function createCSSLink(cssFilePathWithName) {
    var link;
    link = document.createElement("link");
    link.href = "css/" + cssFilePathWithName;
    link.type = "text/css";
    link.rel = "stylesheet";
    link.media = "all";

    return link;
  }

  publicAPI.loadCSSFiles = function (fileNames) {
    var link;

    fileNames.forEach(function (fileName) {
      link = createCSSLink(fileName);
      document.getElementsByTagName("head")[0].appendChild(link);
    });
  };

  return publicAPI;
}
export default UtilHelpers;
