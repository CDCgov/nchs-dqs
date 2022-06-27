import $ from "jquery";
import * as d3 from "../lib/d3_v4-min";
import HelperUtil from "../modules/helperutils";
import Dataservice from "../modules/dataservice";

function AllStatesData() {
  var publicAPI = {};
  var mMediator;
  var mHelperUtil;
  var mDataservice;
  var mDataCollection;
  var mDataParameters;
  var mInitAppData;
  var mData;
  var mVariableArrays;
  var mSuppressedDataColorHexVal = "#a6a6a6";
  var mNoDataColorHexVal = "#cccccc";
  var mAllStatesGeoID = 5001;
  var mColorsData;
  var mAgeAdjustedID1 = 635; // 19Feb2021
  var mAgeAdjustedID2 = 637; // 19Feb2021
  var mTotalCrudeID1 = 634; // 19Feb2021
  var mTotalCrudeID2 = 636; // 19Feb2021
  var mBlueColorRamp = ["#B6FCFA", "#56E4E1", "#1DB3AF", "#00697A", "#003942"]; // 18Mar2022, DIAB-88

  publicAPI.setMediator = function (m) {
    mMediator = m;
  };

  publicAPI.getMediator = function () {
    return mMediator;
  };

  publicAPI.getData = function () {
    return mData;
  };

  publicAPI.updateDataParameters = function (m) {
    mDataParameters = m;
  };

  publicAPI.updateDataCollection = function (m) {
    mDataCollection = m;
  };

  function getAgeIDSortOrderList() {
    var ageIDWithIndexList;
    var ageTypeID = 7; // from 'variabletypes' array
    var indices = [];
    var idx;
    var ageSortOrderWithIndex;
    var sortedAgeIDWithSortIDList;

    idx = mVariableArrays.VariableTypeIDArray.indexOf(ageTypeID);
    while (idx !== -1) {
      indices.push(idx);
      idx = mVariableArrays.VariableTypeIDArray.indexOf(ageTypeID, idx + 1);
    }

    ageIDWithIndexList = mVariableArrays.VariableValueIDArray.filter(function (
      d,
      i
    ) {
      return indices.indexOf(i) > -1;
    }).map(function (d, i) {
      return { AgeID: d, Index: indices[i] };
    });

    ageSortOrderWithIndex = mVariableArrays.VariableValueSortOrderArray.filter(
      function (d, i) {
        return indices.indexOf(i) > -1;
      }
    ).map(function (d, i) {
      return { SortID: d, Index: indices[i] };
    });

    ageSortOrderWithIndex.sort(function (a, b) {
      return a.SortID - b.SortID;
    });

    sortedAgeIDWithSortIDList = ageSortOrderWithIndex
      .filter(function (d) {
        return ageIDWithIndexList.filter(function (b) {
          return b.Index === d.Index;
        });
      })
      .map(function (d) {
        return {
          AgeID: ageIDWithIndexList.filter(function (v) {
            return v.Index === d.Index;
          })[0].AgeID,
          SortID: d.SortID,
          Index: d.Index
        };
      });

    return sortedAgeIDWithSortIDList;
  }

  function getInitConfigInfo() {
    var indicatorsList;
    var firstTopic;
    var firstIndicator;
    var firstIndicatorID;
    var firstIndicatorName;
    var firstIndicatorDatasetList;
    var firstDataset;
    var firstDatasetLabel;
    var firstDatasetID;
    var initMeasureID;
    var initMeasureName;
    var firstTopicName;
    var firstTopicID;
    var configInfo;
    var firstIndicatorMeasuresList;

    indicatorsList = mDataCollection.getIndicatorsList();

    firstTopic = indicatorsList[0];
    firstTopicName = firstTopic.TopicName;
    firstTopicID = firstTopic.TopicID;

    firstIndicator = firstTopic.IndicatorsList[0];
    firstIndicatorID = firstIndicator.IndicatorID;
    firstIndicatorName = firstIndicator.IndicatorName;

    firstIndicatorDatasetList = firstIndicator.DatasetList;
    firstDataset = firstIndicatorDatasetList[0];
    firstDatasetID = firstDataset.DatasetID;
    firstDatasetLabel = firstDataset.DatasetLabel;

    firstIndicatorMeasuresList = firstIndicator.MeasuresList;

    initMeasureID = 40;
    initMeasureName = "Total";

    configInfo = {
      TopicID: firstTopicID,
      TopicName: firstTopicName,
      IndicatorID: firstIndicatorID,
      IndicatorName: firstIndicatorName,
      MeasureID: initMeasureID,
      MeasureName: initMeasureName,
      DatasetID: firstDatasetID,
      DatasetLabel: firstDatasetLabel,
      DatasetList: firstIndicatorDatasetList,
      MeasuresList: firstIndicatorMeasuresList,
      NoDataColorHexVal: mNoDataColorHexVal,
      SuppressedDataColorHexVal: mSuppressedDataColorHexVal,
      GeoID: mAllStatesGeoID
    };

    return configInfo;
  }

  function getStateInfo(databaseCode) {
    var stateInfo;
    var statesList;

    statesList = mInitAppData.states_list; // 30Sep2020
    stateInfo = statesList.filter(function (d) {
      return d.SDC === databaseCode; // 22Oct2018
    })[0];

    return stateInfo;
  }

  function getQuartilesData(inputData) {
    var dataClassificationPropertyName = "101"; // in map_combinations.maps array      var dataClassificationPropertyName = "101"; // in map_combinations.maps array, quartilesDataClassificationID = 1500
    var quartilesData = {};
    var mapsData;
    var yearsList;
    var rawYearDataRowsArr;
    var yearDataRowsArr = [];
    var blueColorRampColors = [];
    var yearData;
    var yearDataRow;
    var dataRowsArr = [];
    var stateInfo;
    var rawComboArrays;
    var valueObj;
    var rawQuartilesData;
    var rawLegendData;
    var allStatesMedianDataCopy;
    var allStatesMedianDataRowsArr;
    var allStatesMedianDataRow;
    var quartilesID = 1500;

    rawComboArrays = inputData.Data;
    mapsData = rawComboArrays.maps;
    yearsList = getSortedYearsList(mapsData);
    allStatesMedianDataCopy = $.extend(true, [], inputData.AllStatesMedianData);

    mapsData.forEach(function (d) {
      yearData = {};
      yearData.YearID = d["2"];
      yearData.LegendData = [];
      rawQuartilesData = d[dataClassificationPropertyName][0].find(function (
        a
      ) {
        return a[101] === quartilesID; // TODO:  Use this logic in all filter functions
      });
      if (!rawQuartilesData) {
        throw new Error(
          "AllStatesData: Could not find Quartiles data for YearID = " +
            yearData.YearID
        );
      }
      rawYearDataRowsArr = rawQuartilesData.map.data;
      yearDataRowsArr = [];

      if (rawQuartilesData.map.legend.length) {
        rawLegendData = rawQuartilesData.map.legend.filter(function (
          rawLegendObj
        ) {
          return rawLegendObj.c > 0;
        });

        /*  // 18Mar2022, DIAB-88
         blueColorRampColors = getBlueRampColors(rawLegendData.length);

        yearData.LegendData = rawLegendData.map(function (a) {
          return {
            c: a.c,
            min: a.min,
            max: a.max,
            color_hexval: blueColorRampColors.filter(function (e, i) {
              return i === a.c - 1 ? e[1] : null;
            })[0][1]
          };
        }); */
        // 18Mar2022, DIAB-88
        blueColorRampColors = getBlueRampColors(rawLegendData.length);
        yearData.LegendData = addColorsToRawLegendData(
          rawLegendData,
          blueColorRampColors
        ); // 18Mar2022, DIAB-88
      }

      rawYearDataRowsArr.forEach(function (rawYearDataRow) {
        yearDataRow = {};
        yearDataRow.DatabaseCode = rawYearDataRow["3"];
        stateInfo = getStateInfo(yearDataRow.DatabaseCode);
        yearDataRow.GeoID = stateInfo.SC; // SDC=StateCode
        yearDataRow.GeoLabel = stateInfo.SN; // SN=StateName
        yearDataRow.GeoABBR = stateInfo.SABBR; // SABBR=State ABBR

        yearDataRow.IsSuppressed = rawYearDataRow["4"] === 101;
        yearDataRow.IsNoData =
          rawYearDataRow["4"] === 100 && rawYearDataRow.c === 0;
        valueObj = inputData.ValueData[rawYearDataRow.rid];
        yearDataRow.UpperLimit = valueObj.uci;
        yearDataRow.LowerLimit = valueObj.lci;
        yearDataRow.Value = valueObj.v;
        if (yearDataRow.IsSuppressed) {
          yearDataRow.Color_HexVal = mSuppressedDataColorHexVal;
        } else if (yearDataRow.IsNoData) {
          yearDataRow.Color_HexVal = mNoDataColorHexVal;
        } else {
          /*  // 18Mar2022, DIAB-88
          yearDataRow.Color_HexVal =
            blueColorRampColors[rawYearDataRow.c - 1][1]; */
          yearDataRow.Color_HexVal = blueColorRampColors[rawYearDataRow.c - 1]; // 18Mar2022, DIAB-88
        }

        yearDataRowsArr.push(yearDataRow);
      });
      yearData.Data = yearDataRowsArr;
      dataRowsArr.push(yearData);
    });

    // AllStatesMedian Data
    if (allStatesMedianDataCopy.Data) {
      allStatesMedianDataRowsArr = [];
      allStatesMedianDataCopy.Data.forEach(function (dataRow) {
        allStatesMedianDataRow = {};
        allStatesMedianDataRow.YearID = dataRow[2];
        allStatesMedianDataRow.YearLabel = getVariableValueLabel(dataRow[2]);
        allStatesMedianDataRow.IsSuppressed = dataRow[4] === 101;
        allStatesMedianDataRow.IsNoData = dataRow[4] === 100 && !dataRow[13];
        allStatesMedianDataRow.Value = dataRow[13];
        allStatesMedianDataRow.LowerLimit = dataRow[14];
        allStatesMedianDataRow.UpperLimit = dataRow[15];
        allStatesMedianDataRowsArr.push(allStatesMedianDataRow);
      });

      // 29Mar2018
      allStatesMedianDataRowsArr.sort(function (a, b) {
        return a.YearID - b.YearID;
      });
    }

    allStatesMedianDataCopy.Data = allStatesMedianDataRowsArr;

    quartilesData.YearsList = yearsList;
    quartilesData.Data = dataRowsArr;
    quartilesData.AllStatesMedianData = allStatesMedianDataCopy;

    return quartilesData;
  }

  function getSortedYearsList(dataArray) {
    var yearsList = [];
    var yearObj;
    var yearPropertyName = "2";
    var uniqueYearArr = mHelperUtil.getDistinctPropertyValues(
      dataArray,
      yearPropertyName
    );
    uniqueYearArr.forEach(function (d) {
      yearObj = {};
      yearObj.YearID = parseInt(d, 10);
      yearObj.YearLabel = getVariableValueLabel(yearObj.YearID);
      yearsList.push(yearObj);
    });
    yearsList.sort(function (a, b) {
      return a.YearID - b.YearID;
    });

    return yearsList;
  }

  // 18Mar2022, DIAB-88
  function addColorsToRawLegendData(rawLegendData, blueColorRampColors) {
    return rawLegendData.map(function (a) {
      return {
        c: a.c,
        min: a.min,
        max: a.max,
        color_hexval: blueColorRampColors[a.c - 1]
      };
    });
  }

  function getNaturalBreaksData(inputData) {
    var dataClassificationPropertyName = "101"; // in map_combinations.maps array      var dataClassificationPropertyName = "101"; // in map_combinations.maps array, naturalBreaksDataClassificationID = 1501
    var naturalBreaksData = {};
    var mapsData;
    var yearsList;
    var rawYearDataRowsArr;
    var yearDataRowsArr = [];
    var blueColorRampColors = [];
    var yearData;
    var yearDataRow;
    var dataRowsArr = [];
    var stateInfo;
    var rawComboArrays;
    var valueObj;
    var rawNaturalBreaksData;
    var rawLegendData;
    var allStatesMedianDataCopy;
    var allStatesMedianDataRowsArr;
    var allStatesMedianDataRow;
    var naturalBreaksID = 1501;

    rawComboArrays = inputData.Data;
    mapsData = rawComboArrays.maps;
    yearsList = getSortedYearsList(mapsData);
    allStatesMedianDataCopy = $.extend(true, [], inputData.AllStatesMedianData);

    mapsData.forEach(function (d) {
      yearData = {};
      yearData.YearID = d["2"];
      yearData.LegendData = [];
      // 6Dec2018, CODE-SNIPPET
      rawNaturalBreaksData = d[dataClassificationPropertyName][0].find(
        function (a) {
          return a[101] === naturalBreaksID; // FIXME: Use this logic in all filter functions
        }
      );
      if (!rawNaturalBreaksData) {
        throw new Error(
          "AllStatesData: Could not find Natural Breaks data for YearID = " +
            yearData.YearID
        );
      }
      rawYearDataRowsArr = rawNaturalBreaksData.map.data;
      yearDataRowsArr = [];

      if (rawNaturalBreaksData.map.legend.length) {
        rawLegendData = rawNaturalBreaksData.map.legend.filter(function (
          rawLegendObj
        ) {
          return rawLegendObj.c > 0;
        });

        /*  // 18Mar2022, DIAB-88
        blueColorRampColors = getBlueRampColors(rawLegendData.length);

        yearData.LegendData = rawLegendData.map(function (a) {
          return {
            c: a.c,
            min: a.min,
            max: a.max,
            color_hexval: blueColorRampColors.filter(function (e, i) {
              return i === a.c - 1 ? e[1] : null;
            })[0][1]
          };
        }); */
        blueColorRampColors = getBlueRampColors(rawLegendData.length);
        yearData.LegendData = addColorsToRawLegendData(
          rawLegendData,
          blueColorRampColors
        ); // 18Mar2022, DIAB-88
      }

      rawYearDataRowsArr.forEach(function (rawYearDataRow) {
        yearDataRow = {};
        yearDataRow.DatabaseCode = rawYearDataRow["3"];
        stateInfo = getStateInfo(yearDataRow.DatabaseCode);
        yearDataRow.GeoID = stateInfo.SC; // SC=StateCode
        yearDataRow.GeoLabel = stateInfo.SN; // SN=StateName
        yearDataRow.GeoABBR = stateInfo.SABBR; // SABBR=State ABBR

        yearDataRow.IsSuppressed = rawYearDataRow["4"] === 101;
        yearDataRow.IsNoData =
          rawYearDataRow["4"] === 100 && rawYearDataRow.c === 0;
        valueObj = inputData.ValueData[rawYearDataRow.rid];
        yearDataRow.UpperLimit = valueObj.uci;
        yearDataRow.LowerLimit = valueObj.lci;
        yearDataRow.Value = valueObj.v;

        if (yearDataRow.IsSuppressed) {
          yearDataRow.Color_HexVal = mSuppressedDataColorHexVal;
        } else if (yearDataRow.IsNoData) {
          yearDataRow.Color_HexVal = mNoDataColorHexVal;
        } else {
          /*  // 18Mar2022, DIAB-88 
          yearDataRow.Color_HexVal =
            blueColorRampColors[rawYearDataRow.c - 1][1]; */
          yearDataRow.Color_HexVal = blueColorRampColors[rawYearDataRow.c - 1]; // 18Mar2022, DIAB-88
        }

        yearDataRowsArr.push(yearDataRow);
      });
      yearData.Data = yearDataRowsArr;
      dataRowsArr.push(yearData);
    });

    // AllStatesMedian Data
    if (allStatesMedianDataCopy.Data) {
      allStatesMedianDataRowsArr = [];
      allStatesMedianDataCopy.Data.forEach(function (dataRow) {
        allStatesMedianDataRow = {};
        allStatesMedianDataRow.YearID = dataRow[2];
        allStatesMedianDataRow.YearLabel = getVariableValueLabel(dataRow[2]);
        allStatesMedianDataRow.IsSuppressed = dataRow[4] === 101;
        allStatesMedianDataRow.IsNoData = dataRow[4] === 100 && !dataRow[13];
        allStatesMedianDataRow.Value = dataRow[13];
        allStatesMedianDataRow.LowerLimit = dataRow[14];
        allStatesMedianDataRow.UpperLimit = dataRow[15];
        allStatesMedianDataRowsArr.push(allStatesMedianDataRow);
      });
      // 29Mar2018
      allStatesMedianDataRowsArr.sort(function (a, b) {
        return a.YearID - b.YearID;
      });
    }

    allStatesMedianDataCopy.Data = allStatesMedianDataRowsArr;

    naturalBreaksData.YearsList = yearsList;
    naturalBreaksData.Data = dataRowsArr;
    naturalBreaksData.AllStatesMedianData = allStatesMedianDataCopy;

    return naturalBreaksData;
  }

  function getAgeAdjustedData(dataConfig) {
    var ageAdjustedData = [];
    var ageAdjustedID1 = 635;
    var ageAdjustedID2 = 637;
    var agePropertyName = "7"; // in "map_combinations"
    var ageAdjustedComboArrays = [];
    var dataByDataTypeID = dataConfig.RawData.DataByDataTypeID;
    var comboArraysBySubmeasureID;
    var rawSubmeasureData;
    var submeasureData;
    var filteredAllStatesMedianData;
    var allStatesMedianDataCopy;
    var filteredAllStatesMedianDataBySubmeasure;
    var submeasurePropertyName;
    var genderSubmeasurePropertyName = "6"; // in 'supplemental_data'
    var educationSubmeasurePropertyName = "10"; // in 'supplemental_data'
    var raceSubmeasurePropertyName = "5"; // in 'supplemental_data'  // 10Feb2021
    var currentMeasureID;
    var genderMeasureID = 42;
    var raceMeasureID = 43; // 10Feb2021
    var educationMeasureID = 44;

    if (dataConfig.RawData.AllStatesMedianData.Data) {
      allStatesMedianDataCopy = $.extend(
        true,
        [],
        dataConfig.RawData.AllStatesMedianData
      );

      filteredAllStatesMedianData = allStatesMedianDataCopy.Data.filter(
        function (d) {
          return (
            d[agePropertyName] === ageAdjustedID1 ||
            d[agePropertyName] === ageAdjustedID2
          );
        }
      );
    }

    ageAdjustedComboArrays = dataByDataTypeID.filter(function (d) {
      return (
        d[agePropertyName] === ageAdjustedID1 ||
        d[agePropertyName] === ageAdjustedID2
      );
    });

    dataConfig.SubmeasuresList.forEach(function (submeasureObj) {
      comboArraysBySubmeasureID = ageAdjustedComboArrays.filter(function (d) {
        return d[dataConfig.SubmeasurePropertyName] === submeasureObj.ID;
      })[0];

      // AllStatesMedian
      if (dataConfig.RawData.AllStatesMedianData.Data) {
        currentMeasureID = mDataParameters.getMeasureID();
        if (currentMeasureID === genderMeasureID) {
          submeasurePropertyName = genderSubmeasurePropertyName;
        } else if (currentMeasureID === educationMeasureID) {
          submeasurePropertyName = educationSubmeasurePropertyName;
        } else if (currentMeasureID === raceMeasureID) {
          // 10Feb2021
          submeasurePropertyName = raceSubmeasurePropertyName;
        }

        filteredAllStatesMedianDataBySubmeasure =
          filteredAllStatesMedianData.filter(function (d) {
            return d[submeasurePropertyName] === submeasureObj.ID;
          });
        allStatesMedianDataCopy.Data = filteredAllStatesMedianDataBySubmeasure;
      }

      rawSubmeasureData = {
        Data: comboArraysBySubmeasureID,
        ValueData: dataConfig.RawData.ValueData,
        AllStatesMedianData: allStatesMedianDataCopy
      };
      submeasureData = {};
      submeasureData.SubmeasureID = submeasureObj.ID;
      submeasureData.SubmeasureName = submeasureObj.Name;
      submeasureData.NaturalBreaksData =
        getNaturalBreaksData(rawSubmeasureData);
      submeasureData.QuartilesData = getQuartilesData(rawSubmeasureData);
      ageAdjustedData.push(submeasureData);
    });
    return ageAdjustedData;
  }

  function getCrudeData(dataConfig) {
    var crudeData = [];
    var crudeID1 = 634;
    var crudeID2 = 636;
    var agePropertyName = "7"; // in "map_combinations"
    var crudeComboArrays = [];
    var dataByDataTypeID = dataConfig.RawData.DataByDataTypeID;
    var comboArraysBySubmeasureID;
    var rawSubmeasureData;
    var submeasureData;
    var filteredAllStatesMedianData;
    var allStatesMedianDataCopy;
    var filteredAllStatesMedianDataBySubmeasure;
    var submeasurePropertyName;
    var genderSubmeasurePropertyName = "6"; // in 'supplemental_data'
    var educationSubmeasurePropertyName = "10"; // in 'supplemental_data'
    var raceSubmeasurePropertyName = "5"; // in 'supplemental_data'  // 10Feb2021
    var currentMeasureID;
    var genderMeasureID = 42;
    var raceMeasureID = 43; // 10Feb2021
    var educationMeasureID = 44;

    if (dataConfig.RawData.AllStatesMedianData.Data) {
      allStatesMedianDataCopy = $.extend(
        true,
        [],
        dataConfig.RawData.AllStatesMedianData
      );

      filteredAllStatesMedianData = allStatesMedianDataCopy.Data.filter(
        function (d) {
          return (
            d[agePropertyName] === crudeID1 || d[agePropertyName] === crudeID2
          );
        }
      );
    }

    crudeComboArrays = dataByDataTypeID.filter(function (d) {
      return d[agePropertyName] === crudeID1 || d[agePropertyName] === crudeID2;
    });

    dataConfig.SubmeasuresList.forEach(function (submeasureObj) {
      comboArraysBySubmeasureID = crudeComboArrays.filter(function (d) {
        return d[dataConfig.SubmeasurePropertyName] === submeasureObj.ID;
      })[0];

      // AllStatesMedian
      if (dataConfig.RawData.AllStatesMedianData.Data) {
        currentMeasureID = mDataParameters.getMeasureID();
        if (currentMeasureID === genderMeasureID) {
          submeasurePropertyName = genderSubmeasurePropertyName;
        } else if (currentMeasureID === educationMeasureID) {
          submeasurePropertyName = educationSubmeasurePropertyName;
        } else if (currentMeasureID === raceMeasureID) {
          // 10Feb2021
          submeasurePropertyName = raceSubmeasurePropertyName;
        }

        filteredAllStatesMedianDataBySubmeasure =
          filteredAllStatesMedianData.filter(function (d) {
            return d[submeasurePropertyName] === submeasureObj.ID;
          });
        allStatesMedianDataCopy.Data = filteredAllStatesMedianDataBySubmeasure;
      }

      rawSubmeasureData = {
        Data: comboArraysBySubmeasureID,
        ValueData: dataConfig.RawData.ValueData,
        AllStatesMedianData: allStatesMedianDataCopy
      };
      submeasureData = {};
      submeasureData.SubmeasureID = submeasureObj.ID;
      submeasureData.SubmeasureName = submeasureObj.Name;
      submeasureData.NaturalBreaksData =
        getNaturalBreaksData(rawSubmeasureData);
      submeasureData.QuartilesData = getQuartilesData(rawSubmeasureData);
      crudeData.push(submeasureData);
    });

    return crudeData;
  }

  function getTotalCrudeData(dataConfig) {
    var crudeData = {};
    var crudeID1 = 634;
    var crudeID2 = 636;
    var agePropertyName = "7"; // in "map_combinations"
    var rawComboArrays = [];
    var dataByDataTypeID = dataConfig.DataByDataTypeID;
    var rawCrudeData;
    var filteredAllStatesMedianData;
    var allStatesMedianDataCopy;

    if (dataConfig.AllStatesMedianData.Data) {
      allStatesMedianDataCopy = $.extend(
        true,
        [],
        dataConfig.AllStatesMedianData
      );

      filteredAllStatesMedianData = allStatesMedianDataCopy.Data.filter(
        function (d) {
          return (
            d[agePropertyName] === crudeID1 || d[agePropertyName] === crudeID2
          );
        }
      );
      allStatesMedianDataCopy.Data = filteredAllStatesMedianData;
    }

    rawComboArrays = dataByDataTypeID.filter(function (d) {
      return d[agePropertyName] === crudeID1 || d[agePropertyName] === crudeID2;
    })[0];

    rawCrudeData = {
      Data: rawComboArrays,
      ValueData: dataConfig.ValueData,
      AllStatesMedianData: allStatesMedianDataCopy
    };

    crudeData.NaturalBreaksData = getNaturalBreaksData(rawCrudeData);
    crudeData.QuartilesData = getQuartilesData(rawCrudeData);

    return crudeData;
  }

  function getTotalAgeAdjustedData(dataConfig) {
    var ageAdjustedData = {};
    var ageAdjustedID1 = 635;
    var ageAdjustedID2 = 637;
    var agePropertyName = "7"; // in "map_combinations" and "supplemental_data"
    var ageAdjustedComboArrays = [];
    var dataByDataTypeID = dataConfig.DataByDataTypeID;
    var rawAgeAdjustedData;
    var filteredAllStatesMedianData;
    var allStatesMedianDataCopy;

    if (dataConfig.AllStatesMedianData.Data) {
      allStatesMedianDataCopy = $.extend(
        true,
        [],
        dataConfig.AllStatesMedianData
      );

      filteredAllStatesMedianData = allStatesMedianDataCopy.Data.filter(
        function (d) {
          return (
            d[agePropertyName] === ageAdjustedID1 ||
            d[agePropertyName] === ageAdjustedID2
          );
        }
      );
      allStatesMedianDataCopy.Data = filteredAllStatesMedianData;
    }

    ageAdjustedComboArrays = dataByDataTypeID.filter(function (d) {
      return (
        d[agePropertyName] === ageAdjustedID1 ||
        d[agePropertyName] === ageAdjustedID2
      );
    })[0];

    rawAgeAdjustedData = {
      Data: ageAdjustedComboArrays,
      ValueData: dataConfig.ValueData,
      AllStatesMedianData: allStatesMedianDataCopy
    };

    ageAdjustedData.NaturalBreaksData =
      getNaturalBreaksData(rawAgeAdjustedData);
    ageAdjustedData.QuartilesData = getQuartilesData(rawAgeAdjustedData);

    return ageAdjustedData;
  }

  function getAgeClassificationTypeList(mapComboArraysByDataTypeID) {
    var ageClassificationTypeList = [];
    var ageAdjustedType;
    var ageAdjustedTypeIDObj;
    var ageAdjustedTypeID;
    var ageAdjustedTypeLabel;
    var crudeType;
    var crudeTypeIDObj;
    var crudeTypeID;
    var totalCrudeTypeLabel;
    var agePropertyName = 7;

    // AGE-ADJUSTED
    ageAdjustedTypeIDObj = mapComboArraysByDataTypeID.filter(function (d) {
      return d[agePropertyName] === 635 || d[agePropertyName] === 637;
    });
    if (ageAdjustedTypeIDObj.length) {
      ageAdjustedTypeID = ageAdjustedTypeIDObj[0][agePropertyName];
      ageAdjustedTypeLabel = getVariableValueLabel(ageAdjustedTypeID);
      ageAdjustedType = {
        AgeClassificationTypeID: ageAdjustedTypeID,
        AgeClassificationTypeLabel: ageAdjustedTypeLabel
      };
      ageClassificationTypeList.push(ageAdjustedType);
    }

    // TOTAL-CRUDE
    crudeTypeIDObj = mapComboArraysByDataTypeID.filter(function (d) {
      return d[agePropertyName] === 634 || d[agePropertyName] === 636;
    });
    if (crudeTypeIDObj.length) {
      crudeTypeID = crudeTypeIDObj[0][agePropertyName];
      totalCrudeTypeLabel = getVariableValueLabel(crudeTypeID);
      crudeType = {
        AgeClassificationTypeID: crudeTypeID,
        AgeClassificationTypeLabel: totalCrudeTypeLabel
      };
      ageClassificationTypeList.push(crudeType);
    }

    return ageClassificationTypeList;
  }

  function isAgeAdjustedDataAvailable(dataByDataTypeID) {
    var ageAdjustedID1 = 635;
    var ageAdjustedID2 = 637;
    var agePropertyName = "7"; // in "map_combinations" and "supplemental_data"
    var ageAdjustedComboArrays = [];

    ageAdjustedComboArrays = dataByDataTypeID.filter(function (d) {
      return (
        d[agePropertyName] === ageAdjustedID1 ||
        d[agePropertyName] === ageAdjustedID2
      );
    });

    if (ageAdjustedComboArrays.length > 0) {
      return true;
    }
    return false;
  }

  function isTotalCrudeDataAvailable(dataByDataTypeID) {
    var crudeID1 = 634;
    var crudeID2 = 636;
    var agePropertyName = "7"; // in "map_combinations"
    var crudeComboArrays = [];

    crudeComboArrays = dataByDataTypeID.filter(function (d) {
      return d[agePropertyName] === crudeID1 || d[agePropertyName] === crudeID2;
    });

    if (crudeComboArrays.length > 0) {
      return true;
    }
    return false;
  }

  function getGenderMeasureData(rawData, submeasuresList) {
    var measureData = {};
    var genderPropertyName = "6";
    var config = {
      RawData: rawData,
      SubmeasuresList: submeasuresList,
      SubmeasurePropertyName: genderPropertyName
    };

    if (isAgeAdjustedDataAvailable(rawData.DataByDataTypeID)) {
      measureData.AgeAdjustedData = getAgeAdjustedData(config);
    }

    if (isTotalCrudeDataAvailable(rawData.DataByDataTypeID)) {
      measureData.CrudeData = getCrudeData(config);
    }

    return measureData;
  }

  // 09Feb2021
  function getRaceMeasureData(rawData, submeasuresList) {
    var measureData = {};
    var racePropertyName = "5";
    var config = {
      RawData: rawData,
      SubmeasuresList: submeasuresList,
      SubmeasurePropertyName: racePropertyName
    };

    if (isAgeAdjustedDataAvailable(rawData.DataByDataTypeID)) {
      measureData.AgeAdjustedData = getAgeAdjustedData(config);
    }

    if (isTotalCrudeDataAvailable(rawData.DataByDataTypeID)) {
      measureData.CrudeData = getCrudeData(config);
    }

    return measureData;
  }

  function getEducationMeasureData(rawData, submeasuresList) {
    var measureData = {};
    var educationPropertyName = "10";
    var config = {
      RawData: rawData,
      SubmeasuresList: submeasuresList,
      SubmeasurePropertyName: educationPropertyName
    };

    if (isAgeAdjustedDataAvailable(rawData.DataByDataTypeID)) {
      measureData.AgeAdjustedData = getAgeAdjustedData(config);
    }

    if (isTotalCrudeDataAvailable(rawData.DataByDataTypeID)) {
      measureData.CrudeData = getCrudeData(config);
    }

    return measureData;
  }

  function getAgeMeasureData(dataConfig, submeasuresList) {
    var submeasureData = {};
    var agePropertyName = "7"; // in "map_combinations" and "supplemental_data"
    var ageData = [];
    var comboArraysBySubmeasureID = [];
    var rawSubmeasureData;
    var allStatesMedianDataCopy;
    var filteredAllStatesMedianDataBySubmeasure;

    if (dataConfig.AllStatesMedianData.Data) {
      allStatesMedianDataCopy = $.extend(
        true,
        [],
        dataConfig.AllStatesMedianData
      );
    }

    submeasuresList.forEach(function (submeasureObj) {
      submeasureData = {};
      comboArraysBySubmeasureID = dataConfig.DataByDataTypeID.filter(function (
        d
      ) {
        return d[agePropertyName] === submeasureObj.ID;
      })[0];

      // AllStatesMedian
      if (dataConfig.AllStatesMedianData.Data) {
        filteredAllStatesMedianDataBySubmeasure =
          dataConfig.AllStatesMedianData.Data.filter(function (d) {
            return d[agePropertyName] === submeasureObj.ID;
          });
        allStatesMedianDataCopy.Data = filteredAllStatesMedianDataBySubmeasure;
      }

      rawSubmeasureData = {
        Data: comboArraysBySubmeasureID,
        ValueData: dataConfig.ValueData,
        AllStatesMedianData: allStatesMedianDataCopy
      };
      submeasureData.SubmeasureID = submeasureObj.ID;
      submeasureData.SubmeasureName = submeasureObj.Name;
      submeasureData.NaturalBreaksData =
        getNaturalBreaksData(rawSubmeasureData);
      submeasureData.QuartilesData = getQuartilesData(rawSubmeasureData);
      ageData.push(submeasureData);
    });

    return ageData;
  }

  function sortAgeSubmeasuresList(submeasuresList) {
    var ageIDSortOrderList;
    ageIDSortOrderList = mDataCollection.getAgeIDSortOrderList();
    submeasuresList.forEach(function (submeasure) {
      submeasure.SortID = ageIDSortOrderList.filter(function (ageObj) {
        return submeasure.ID === ageObj.AgeID;
      })[0].SortID;
    });
    submeasuresList.sort(function (a, b) {
      return a.SortID - b.SortID;
    });
    return submeasuresList;
  }

  /*  // 19Feb2021
         function removeAgeAdjustedAgeGrp(submeasuresList) {
          var ageAdjustedID = 635;
          var itemIdx;
          itemIdx = submeasuresList
            .map(function(e) {
              return e.ID;
            })
            .indexOf(ageAdjustedID);
          // 28Jun2018  submeasuresList.splice(itemIdx, 1);
          if (itemIdx > -1) {
            // 28Jun2018
            submeasuresList.splice(itemIdx, 1);
          }
          return submeasuresList;
        } */

  // 19Feb2021
  function removeTotalCrudeGrp(submeasuresList) {
    var itemIdx;
    const ageAdjustedIDList = [mTotalCrudeID1, mTotalCrudeID2];
    ageAdjustedIDList.forEach(function (ageID) {
      itemIdx = submeasuresList
        .map(function (e) {
          return e.ID;
        })
        .indexOf(ageID);
      if (itemIdx > -1) {
        submeasuresList.splice(itemIdx, 1);
      }
    });

    return submeasuresList;
  }
  // 19Feb2021
  function removeAgeAdjustedGrp(submeasuresList) {
    var itemIdx;
    const ageAdjustedIDList = [mAgeAdjustedID1, mAgeAdjustedID2];
    ageAdjustedIDList.forEach(function (ageID) {
      itemIdx = submeasuresList
        .map(function (e) {
          return e.ID;
        })
        .indexOf(ageID);
      if (itemIdx > -1) {
        submeasuresList.splice(itemIdx, 1);
      }
    });

    return submeasuresList;
  }

  // 19Feb2021
  function removeAgeAdjustedAndCrude(submeasuresList) {
    var submeasuresListCopy;

    submeasuresListCopy = $.extend(true, [], submeasuresList);
    submeasuresListCopy = removeAgeAdjustedGrp(submeasuresListCopy);
    submeasuresListCopy = removeTotalCrudeGrp(submeasuresListCopy);

    return submeasuresListCopy;
  }

  function getSubmeasuresList(rawData, propertyName) {
    var submeasuresList = [];
    var submeasureIDList;
    var subMeasureLabel;
    var subMeasureObj;

    submeasureIDList = mHelperUtil.getDistinctPropertyValues(
      rawData.DataByDataTypeID,
      propertyName
    );

    submeasureIDList.forEach(function (submeasureID) {
      subMeasureLabel = getVariableValueLabel(submeasureID);
      subMeasureObj = {
        ID: submeasureID,
        Name: subMeasureLabel
      };
      submeasuresList.push(subMeasureObj);
    });

    return submeasuresList;
  }

  function getTotalMeasureData(dataConfig) {
    var measureData = {};

    if (isAgeAdjustedDataAvailable(dataConfig.DataByDataTypeID)) {
      measureData.AgeAdjustedData = getTotalAgeAdjustedData(dataConfig);
    }

    if (isTotalCrudeDataAvailable(dataConfig.DataByDataTypeID)) {
      measureData.CrudeData = getTotalCrudeData(dataConfig);
    }

    return measureData;
  }

  function getDataClassificationList() {
    var quartilesID = 1500;
    var naturalBreaksID = 1501;
    var quartilesLabel = "Quartiles";
    var naturalBreaksLabel = "Natural Breaks";
    var dataClassificationObj;
    var dataClassificationTypeList = [];

    dataClassificationObj = {
      DataClassificationID: naturalBreaksID,
      DataClassificationName: naturalBreaksLabel
    };
    dataClassificationTypeList.push(dataClassificationObj);
    dataClassificationObj = {
      DataClassificationID: quartilesID,
      DataClassificationName: quartilesLabel
    };
    dataClassificationTypeList.push(dataClassificationObj);
    return dataClassificationTypeList;
  }

  function getMethodChangeInfo(data) {
    var methodChangeInfo = {};
    var year;
    var yearList = [];
    if (data.methods_changes.length === 0) {
      methodChangeInfo.IsMethodChange = false;
    } else {
      methodChangeInfo.IsMethodChange = true;
      methodChangeInfo.MethodChangeURL = data.methods_changes[4];
      methodChangeInfo.HeadingText = data.methods_changes[2];
      methodChangeInfo.DetailText = data.methods_changes[3];
      year = {};
      year.YearID = data.methods_changes[1];
      year.YearLabel = getVariableValueLabel(year.YearID);
      yearList.push(year);
      methodChangeInfo.MethodChangeYearsList = yearList;
    }

    return methodChangeInfo;
  }

  function getVariableValueLabel(variableValueID) {
    var index;
    if (mVariableArrays) {
      index = mVariableArrays.VariableValueIDArray.indexOf(variableValueID);
      return mVariableArrays.VariableValueLabelArray[index];
    }
    throw new Error(
      "Error: VariableArray object is empty in function getVariableValueLabel: AllStatesData"
    );
  }

  function getIndicatorMethodsDescRef(data) {
    var processedMethodsDescRef = "";
    var methodsDesc;
    var strippedAllStatesMethodDesc;

    var methodsReferences;
    var strippedMethodsReferences;

    methodsDesc =
      data.methods_description.length > 0
        ? data.methods_description[0].html_text
        : "No Description is available";
    strippedAllStatesMethodDesc = methodsDesc.replace(/(?:\\r\n|\\r|\\n)/g, "");

    methodsReferences = mDataCollection.getIndicatorSourceRef();
    strippedMethodsReferences = methodsReferences.replace(
      /(?:\\r\\n|\\r|\\n)/g,
      ""
    );

    processedMethodsDescRef =
      strippedAllStatesMethodDesc + strippedMethodsReferences; // 09Apr2021 DIAB-15

    return processedMethodsDescRef;
  }

  function setIndicatorMethodsDescRefProp(methodsDescRef) {
    var currentIndicatorID;
    var indicatorsList;
    var topic;
    var indicator;
    currentIndicatorID = mDataParameters.getIndicatorID();
    indicatorsList = mDataCollection.getIndicatorsList();

    for (let i = 0; i < indicatorsList.length; i += 1) {
      topic = indicatorsList[i];
      for (let j = 0; j < topic.IndicatorsList.length; j += 1) {
        indicator = topic.IndicatorsList[j];
        if (indicator.IndicatorID === currentIndicatorID) {
          indicator.MethodsDescRef = methodsDescRef;
          break;
        }
      }
    }
  }

  function getMeasureData(dataConfig) {
    var currentMeasureID;
    var totalMeasureID = 40;
    var ageMeasureID = 41;
    var genderMeasureID = 42;
    var raceMeasureID = 43; // 09Feb2021
    var educationMeasureID = 44;
    var measureData;
    var data;
    var measureLabel;
    var submeasuresList = [];
    var agePropertyName = "7"; // in "map_combinations"
    var genderPropertyName = "6"; // in "map_combinations"
    var educationPropertyName = "10"; // in "map_combinations"
    var racePropertyName = "5"; // in "map_combinations"  // 09Feb2021
    var unsortedAgeSubmeasuresList;
    var sortedAgeSubmeasuresList;

    currentMeasureID = mDataParameters.getMeasureID();

    switch (currentMeasureID) {
      case totalMeasureID:
        measureLabel = "Total";
        submeasuresList = [{ ID: -99, Name: "Total" }];
        data = getTotalMeasureData(dataConfig);
        break;
      case ageMeasureID:
        measureLabel = "Age";
        unsortedAgeSubmeasuresList = getSubmeasuresList(
          dataConfig,
          agePropertyName
        );
        sortedAgeSubmeasuresList = sortAgeSubmeasuresList(
          unsortedAgeSubmeasuresList
        );
        // 19Feb2021 submeasuresList = removeAgeAdjustedAgeGrp(sortedAgeSubmeasuresList);
        submeasuresList = removeAgeAdjustedAndCrude(sortedAgeSubmeasuresList); // 19Feb2021

        data = getAgeMeasureData(dataConfig, submeasuresList);
        break;
      case genderMeasureID:
        measureLabel = "Gender";
        submeasuresList = getSubmeasuresList(dataConfig, genderPropertyName);
        submeasuresList.sort(function (a, b) {
          return a.ID - b.ID;
        });
        data = getGenderMeasureData(dataConfig, submeasuresList);
        break;
      case raceMeasureID:
        measureLabel = "Race-Ethnicity";
        submeasuresList = getSubmeasuresList(dataConfig, racePropertyName);
        submeasuresList.sort(function (a, b) {
          return a.ID - b.ID;
        });
        data = getRaceMeasureData(dataConfig, submeasuresList);
        break;
      case educationMeasureID:
        measureLabel = "Education";
        submeasuresList = getSubmeasuresList(dataConfig, educationPropertyName);
        submeasuresList.sort(function (a, b) {
          return a.ID - b.ID;
        });
        data = getEducationMeasureData(dataConfig, submeasuresList);
        break;
      default:
        throw new Error(
          "Error in getting Measure Data in function getMeasureData !"
        );
    }

    mDataParameters.setSubmeasureID(submeasuresList[0].ID);
    mDataParameters.setSubmeasureLabel(submeasuresList[0].Name);

    measureData = {
      MeasureID: currentMeasureID,
      MeasureLabel: measureLabel,
      SubmeasuresList: submeasuresList,
      Data: data
    };

    return measureData;
  }

  function getDataForDataTypeID(dataTypeID, rawData) {
    var processedDataTypeData;
    var dataTypeLabel;
    var dataType;
    var measureData;
    var mapComboArraysByDataTypeID;
    var dataTypePropertyName = "9"; // in "map_combinations"
    var dataConfig;
    var methodChangeInfo;
    var ageClassificationTypeList;
    var dataClassificationTypeList;
    var allStatesMedianDataTypeID;
    var allStatesMedianDataTypeLabel;
    var allStatesMedianDataTypeIDMatch;
    var allStatesMedianData;
    var currentDatasetID;

    currentDatasetID = mDataParameters.getDatasetID();

    dataTypeLabel = getVariableValueLabel(dataTypeID);
    dataType =
      dataTypeLabel.indexOf("Number") !== -1 ? "NumberValue" : "EstimateValue";

    mapComboArraysByDataTypeID = rawData.map_combinations.filter(function (d) {
      return d[dataTypePropertyName] === dataTypeID;
    });

    // TODO: Filter 'supplemental_data.data' by 9 and 12.
    allStatesMedianDataTypeIDMatch =
      rawData.comparison_estimates.comparisons.filter(function (d) {
        return d[2] === dataTypeID;
      });

    if (allStatesMedianDataTypeIDMatch.length) {
      allStatesMedianDataTypeID = allStatesMedianDataTypeIDMatch[0][3];
      allStatesMedianDataTypeLabel = getVariableValueLabel(
        allStatesMedianDataTypeID
      );
      allStatesMedianData = rawData.supplemental_data.data.filter(function (d) {
        return d[9] === allStatesMedianDataTypeID && d[12] === currentDatasetID;
      });
    }

    dataConfig = {
      DataByDataTypeID: mapComboArraysByDataTypeID,
      ValueData: rawData.map_data,
      AllStatesMedianData: {
        Data: allStatesMedianData,
        DataTypeID: allStatesMedianDataTypeID,
        DataTypeLabel: allStatesMedianDataTypeLabel
      }
    };

    measureData = getMeasureData(dataConfig);
    methodChangeInfo = getMethodChangeInfo(rawData);
    ageClassificationTypeList = getAgeClassificationTypeList(
      mapComboArraysByDataTypeID
    );
    dataClassificationTypeList = getDataClassificationList();

    processedDataTypeData = {
      DataTypeID: dataTypeID,
      DataTypeLabel: dataTypeLabel,
      DataType: dataType,
      MeasureData: measureData,
      MethodChangeInfo: methodChangeInfo,
      AgeClassificationTypeList: ageClassificationTypeList,
      DataClassificationList: dataClassificationTypeList
    };

    return processedDataTypeData;
  }

  function getProcessedDataCollForDatasetID(rawData) {
    var processedDataColl = [];
    var processedDataTypeData;
    var distinctDataTypeIDList;
    var dataTypePropertyName = "9"; // in "map_combinations"
    var indicatorMethodsDescRef;

    distinctDataTypeIDList = mHelperUtil.getDistinctPropertyValues(
      rawData.map_combinations,
      dataTypePropertyName
    );

    indicatorMethodsDescRef = getIndicatorMethodsDescRef(rawData);
    setIndicatorMethodsDescRefProp(indicatorMethodsDescRef);
    mDataCollection.setIndicatorSourceDesc(indicatorMethodsDescRef);

    distinctDataTypeIDList.forEach(function (dataTypeID) {
      processedDataTypeData = getDataForDataTypeID(dataTypeID, rawData);
      processedDataColl.push(processedDataTypeData);
    });

    return processedDataColl;
  }

  /*  // 18Mar2022, DIAB-88  
   function getBlueRampColors(numOfColors) {
    var blueColorRampColors;
    var origBlueColorRampArr;
    var origBlueColorRampColors;
    var origBlueColorRampColorsCopy;

    if (!mColorsData) {
      mColorsData = mDataCollection.getColorsList();
    }

    origBlueColorRampArr = mColorsData.color_ramps[0][3];

    origBlueColorRampColors = origBlueColorRampArr[numOfColors - 1][1];
    origBlueColorRampColorsCopy = $.extend(true, [], origBlueColorRampColors);
    blueColorRampColors = origBlueColorRampColorsCopy.reverse();

    return blueColorRampColors;
  } */

  // 18Mar2022, DIAB-88
  function getBlueRampColors(numOfColors) {
    const newBlueColorRampColorsCopy = $.extend(true, [], mBlueColorRamp);
    newBlueColorRampColorsCopy.length = numOfColors;
    return newBlueColorRampColorsCopy;
  }

  function handleAllStatesIndicatorData(data) {
    var processedDataForDatasetID;
    var emptyArray = [];
    var dataObj;

    dataObj = JSON.parse(data); // 25Jul2020

    if (
      Object.prototype.hasOwnProperty.call(dataObj, "map_combinations") === true
    ) {
      try {
        processedDataForDatasetID = getProcessedDataCollForDatasetID(dataObj);
      } catch (ex) {
        throw new Error(
          "handleAllStatesIndicatorData(): Error in getting AllStates data; " +
            ex
        );
      }
      mDataCollection.setBusinessDatasetColl(processedDataForDatasetID);

      mData = {
        DataParameters: mDataParameters,
        DataCollection: mDataCollection
      };
      mMediator.broadcast("ReceivedAllStatesIndicatorDataEvent", [mData]);
    } else {
      mDataCollection.setDataTypesList(emptyArray);
      mDataCollection.setAgeClassificationList(emptyArray);
      mDataCollection.setBusinessDatasetColl(emptyArray);
      mDataCollection.setCurrentBusinessDataset(emptyArray);

      mMediator.broadcast("ReceivedEmptyAllStatesIndicatorDataEvent", [mData]);
    }
  }

  function handleAllStatesIndicatorDataError(errorThrown) {
    var errorMsg =
      "Error in stored procedure for AllStatesData - function executeAllStatesIndicatorDataCall: " +
      errorThrown;
    throw new Error(errorMsg);
  }

  publicAPI.executeAllStatesIndicatorDataCall = function (config) {
    mDataservice
      .getAllStatesIndicatorData(
        config.IndicatorID,
        config.MeasureID,
        config.DatasetID
      )
      .done(handleAllStatesIndicatorData)
      .fail(handleAllStatesIndicatorDataError);
  };

  publicAPI.executeInitIndicatorDataCall = function () {
    var initIndicatorID;
    var initMeasureID;
    var initDatasetID;

    initIndicatorID = mDataParameters.getIndicatorID();
    initMeasureID = mDataParameters.getMeasureID();
    initDatasetID = mDataParameters.getDatasetID();

    mDataservice
      .getAllStatesIndicatorData(initIndicatorID, initMeasureID, initDatasetID)
      .done(handleAllStatesIndicatorData)
      .fail(handleAllStatesIndicatorDataError);
  };

  // 24Oct2020
  publicAPI.processInitAppData = function (initAppData) {
    var initConfigInfo;
    var indicatorSourceRef;
    var ageIDSortOrderList;

    mInitAppData = initAppData;
    mVariableArrays = {
      VariableValueIDArray: mInitAppData.variablevalues[0],
      VariableTypeIDArray: mInitAppData.variablevalues[1],
      VariableValueLabelArray: mInitAppData.variablevalues[2],
      VariableValueSortOrderArray: mInitAppData.variablevalues[3],
      VariableTypeLabelArray: mInitAppData.variabletypes
    };

    indicatorSourceRef = mInitAppData.methods_references[0].reference;
    mDataCollection.setIndicatorSourceRef(indicatorSourceRef);
    mDataCollection.setIndicatorsList(mInitAppData.indicators_list);
    mColorsData = mInitAppData.colors_list;
    ageIDSortOrderList = getAgeIDSortOrderList();
    mDataCollection.setAgeIDSortOrderList(ageIDSortOrderList);

    initConfigInfo = getInitConfigInfo();

    mDataParameters.setIndicatorName(initConfigInfo.IndicatorName);
    mDataParameters.setIndicatorID(initConfigInfo.IndicatorID);
    mDataParameters.setMeasureName(initConfigInfo.MeasureName);
    mDataParameters.setMeasureID(initConfigInfo.MeasureID);
    mDataParameters.setDatasetID(initConfigInfo.DatasetID);
    mDataParameters.setDatasetLabel(initConfigInfo.DatasetLabel);
    mDataParameters.setNoDataColorHexVal(initConfigInfo.NoDataColorHexVal);
    mDataParameters.setSuppressedDataColorHexVal(
      initConfigInfo.SuppressedDataColorHexVal
    );
    mDataParameters.setGeoID(initConfigInfo.GeoID);
    mDataCollection.setDatasetList(initConfigInfo.DatasetList);
    mDataCollection.setMeasuresList(initConfigInfo.MeasuresList);

    mData = {
      DataParameters: mDataParameters,
      DataCollection: mDataCollection
    };

    return mData;
  };

  publicAPI.init = function () {
    mHelperUtil = new HelperUtil(); // 28Mar2019
    mDataservice = new Dataservice();
    mDataCollection = mHelperUtil.createDataCollectionObj();
    mDataParameters = mHelperUtil.createDataParametersObj();
    mDataCollection = mHelperUtil.createDataCollectionObj();
    mDataParameters = mHelperUtil.createDataParametersObj();
    mData = {
      DataParameters: mDataParameters,
      DataCollection: mDataCollection
    };
  };
  return publicAPI;
}
export default AllStatesData;
