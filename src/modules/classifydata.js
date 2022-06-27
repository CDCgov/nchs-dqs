/* define([], function() { */
function ClassifyData(config) {
  var publicAPI = {};
  var mMediator;
  var sourceData;
  var classifyField;
  var nTile;
  var mProcessedData;

  // Create instance variables
  var instanceData;
  var suppressedDataObjArray;

  publicAPI.setMediator = function(m) {
    mMediator = m;
  };

  publicAPI.getMediator = function() {
    return mMediator;
  };

  function setup() {
    // Make a deep clone of the sourceData so it remains unchanged
    instanceData = deepClone();

    // Sort the data by classifyField
    instanceData.sort(function(a, b) {
      return a[classifyField] - b[classifyField];
    });

    // Remove any suppressed data and put in suppressedDataObjArray
    // You may need to alter if statement here with your suppression rules
    suppressedDataObjArray = [];
    for (let s = instanceData.length - 1; s >= 0; s -= 1) {
      // 27Jan2021
      if (
        instanceData[s][classifyField] < 0 ||
        instanceData[s][classifyField] == null
      ) {
        suppressedDataObjArray.push(instanceData.splice(s, 1)[0]);
      }

      /*   // 27Jan2021 
       // KB,31July2019
        if (
          !instanceData[s][classifyField] ||
          instanceData[s][classifyField] == null
        ) {
          suppressedDataObjArray.push(instanceData.splice(s, 1)[0]);
        } */
    }

    // Check if all the data is suppressed.  If so, create return object
    if (instanceData.length == 0) {
      createReturnObject();
    }
  }

  function addDenseRank(val, newField) {
    const valArray = [];

    for (let f = 0; f < instanceData.length; f += 1) {
      if (valArray.indexOf(instanceData[f][val]) == -1) {
        valArray.push(instanceData[f][val]);
      }

      instanceData[f][newField] = valArray.indexOf(instanceData[f][val]) + 1;
    }
  }

  function addNtile() {
    var bgs = Math.floor(instanceData.length / nTile);
    var mod = instanceData.length % nTile;
    var currentGroup = 1;
    var linecount = 0;

    if (mod == 0) {
      // Mod is 0 so groups are evenly spread. Need to make "nTile" groups of "baseGroupSize" over the "dataArrayLength"
      for (let s = 0; s < nTile; s += 1) {
        for (let t = 0; t < bgs; t += 1) {
          instanceData[linecount].nTile = currentGroup;
          linecount += 1;
        }
        currentGroup += 1;
      }
    } else {
      // Mod is != 0 so need to make "mod" groups of (baseGroupSize + 1) AND (nTile - mod) groups of "baseGroupSize"
      // Handle extra mod groups first
      for (let i = 0; i < mod; i += 1) {
        for (let k = 0; k < bgs + 1; k += 1) {
          instanceData[linecount].nTile = currentGroup;
          linecount += 1;
        }
        currentGroup += 1;
      }

      // Now handle standard group size
      for (let m = 0; m < nTile - mod; m += 1) {
        for (let n = 0; n < bgs; n += 1) {
          instanceData[linecount].nTile = currentGroup;
          linecount += 1;
        }
        currentGroup += 1;
      }
    }
  }

  function addClass() {
    var drArray = [];
    var drMax;
    var tempMin;
    var minValue;
    var maxNtileIdx = 0;
    var tempNtile = 1;
    var tempRank;

    // Get unique dense_rank
    /* 14Aug2019  drArray = instanceData
        .map(function(m) {
          return m.dense_rank;
        })
        .filter(function(val, idx, arr) {
          return idx === arr.indexOf(val);
        }); */
    // 14Aug2019
    let drSet = new Set(
      instanceData.map(function(m) {
        return m.dense_rank;
      })
    );
    drArray = Array.from(drSet);

    // Check if max dense_rank is less than nTile
    // If true, assign dense_rank to class
    // drMax = drArray.reduce(function(a, b) {
    //   return Math.max(a, b);
    // });

    // using +1 for 0 base
    if (instanceData.length + 1 < nTile) {
      // Assign dense_rank to class
      for (let c = 0; c < instanceData.length; c += 1) {
        instanceData[c].class = instanceData[c].dense_rank;
      }

      createReturnObject();
    }

    function getMaxIndexOfField(darr, field1, field2) {
      return darr.reduce(function(iMax, val, idx, arr) {
        return val[field1] == field2 ? idx : iMax;
      }, 0);
    }

    while (maxNtileIdx < instanceData.length) {
      tempNtile = instanceData[maxNtileIdx].nTile;

      maxNtileIdx = getMaxIndexOfField(instanceData, "nTile", tempNtile);

      tempRank = instanceData[maxNtileIdx].dense_rank;

      maxNtileIdx = getMaxIndexOfField(instanceData, "dense_rank", tempRank);

      for (let e = 0; e <= maxNtileIdx; e += 1) {
        if (instanceData[e].bin == undefined) instanceData[e].bin = tempNtile;
      }

      maxNtileIdx += 1;

      addDenseRank("bin", "class");
    }
  }

  function deepClone() {
    return JSON.parse(JSON.stringify(sourceData));
  }

  function createLegendArray(data, classKey, valKey) {
    var tempObj = {};
    var tempArray = [];

    for (let i = 0; i < data.length; i += 1) {
      // If classKey doesnt exist add it
      if (!data[i][classKey]) {
        data[i][classKey] = 0;
      }

      // Add property to tempObj if its not there
      // KB,26Jun2019 if (!tempObj.hasOwnProperty(data[i][classKey])) {
      if (!Object.prototype.hasOwnProperty.call(tempObj, data[i][classKey])) {
        tempObj[data[i][classKey]] = {
          c: data[i][classKey],
          min: data[i][valKey],
          max: data[i][valKey]
        };
      } else {
        if (data[i][valKey] < tempObj[data[i][classKey]].min)
          tempObj[data[i][classKey]].min = data[i][valKey];
        if (data[i][valKey] > tempObj[data[i][classKey]].max)
          tempObj[data[i][classKey]].max = data[i][valKey];
      }
    }

    for (var h in tempObj) {
      tempArray.push(tempObj[h]);
    }
    return tempArray;
  }

  function createReturnObject() {
    var combinedDataArray = suppressedDataObjArray.concat(instanceData);
    // 8July2019 var legendArray = createLegendArray(combinedDataArray, "class", "value");
    // KB, 30July2019 var legendArray = createLegendArray(combinedDataArray, "bin", "v"); // KB, 8July2019
    // 14Dec2021 var legendArray = createLegendArray(combinedDataArray, "class", "v"); // 30July2019
    var legendArray = createLegendArray(
      combinedDataArray,
      "class",
      classifyField
    ); // KB, 14Dec2021

    /* KB, 10July2019 var rtnObj = {
        classifiedData: combinedDataArray,
        legend: legendArray
      }; */

    // KB, 10July2019 return rtnObj;

    mProcessedData = {
      ClassifiedData: combinedDataArray,
      Legend: legendArray
    };
  }

  function naturalbreaks() {
    var classesSet = new Set(
      instanceData.map(function(m) {
        return m["class"];
      })
    );
    var classes = Array.from(classesSet);

    function getSum(array) {
      return array.reduce(function(total, value) {
        return total + value;
      }, 0);
    }
    function getMean(array) {
      return array.reduce(function(total, value, index) {
        total += value;
        if (index === array.length - 1) {
          return total / array.length;
        }
        return total;
      });
    }
    function getVariance(array) {
      var num = 0;

      num = array.length;

      if (num === 0)
        throw new Error("Cannot calculate variance of an empty array");

      var sum = getSum(array);

      var mean = sum / num;

      // calculate the variance
      sum = 0;

      sum = array.reduce(function(accumulator, currentValue) {
        var diff = currentValue - mean;
        return accumulator + diff * diff;
      }, 0);

      return num == 1 ? 0 : sum / (num - 1);
    }

    function getBreaks(data, classKey, id) {
      var dataByClass;
      var breaks = [];
      /* 14Aug2019 var classes = data
          .map(function(m) {
            return m[classKey];
          })
          .filter(function(val, idx, arr) {
            return idx === arr.indexOf(val);
          }); */
      for (var t = 0; t < classes.length; t++) {
        dataByClass = [];
        for (s = 0; s < data.length; s++) {
          if (data[s].class == classes[t]) {
            dataByClass.push(data[s].v);
          }
          /* 30July2019 if (data[s].bin == classes[t]) {
              dataByClass.push(data[s].v);
            } */
        }
        breaks.push({
          id: id,
          class: classes[t],
          // 30July2019 c: classes[t],
          min: dataByClass[0],
          max: dataByClass[dataByClass.length - 1],
          avg: getMean(dataByClass),
          variance: getVariance(dataByClass)
        });
      }

      return breaks;
    }

    var breaks = getBreaks(instanceData, "class", 1);
    // 30July2019 var breaks = getBreaks(instanceData, "bin", 1); // KB,10July2019
    var nbreaks = breaks
      .map(function(d) {
        return d.class;
        // 30July2019 return d.c; // 10July2019
      })
      .reduce(function(a, b) {
        return Math.max(a, b);
      });

   let varianceArr = breaks.map(function(d) {
      return d.variance;
    });
    var sumvar = getSum(varianceArr);
    var psumvar = sumvar + 1;

    var iteration = 1;
    var valArr;
    while (psumvar > sumvar) {
      for (var q = 0; q < breaks.length; q++) {
        valArr = [];
        for (var s = 0; s < instanceData.length; s++) {
          if (instanceData[s].class == breaks[q].class) {
            // 30July2019  if (instanceData[s].bin == breaks[q].c) {
            instanceData[s].avg = breaks[q].avg;

            if (breaks[q].class == 1) {
              instanceData[s].pavg = breaks[q].avg;
            } else if (breaks[q].class > 1) {
              instanceData[s].pavg = breaks[q - 1].avg;
            }

            /* 30July2019 if (breaks[q].c == 1) instanceData[s].pavg = breaks[q].avg;
              else if (breaks[q].c > 1)
                instanceData[s].pavg = breaks[q - 1].avg; */

            if (breaks[q].class < nbreaks) {
              // 30July2019 if (breaks[q].c < nbreaks)
              instanceData[s].navg = breaks[q + 1].avg;
            } else {
              instanceData[s].navg = breaks[breaks.length - 1].avg;
            }
          }
        }
      }
      for (var a = 0; a < instanceData.length; a++) {
        if (
          Math.abs(instanceData[a].v - instanceData[a].navg) <
          Math.abs(instanceData[a].v - instanceData[a].avg)
        ) {
          instanceData[a].class += 1;
          // 30July2019 instanceData[a].bin += 1; // KB,10July2019
        }
        if (
          Math.abs(instanceData[a].v - instanceData[a].pavg) <
          Math.abs(instanceData[a].v - instanceData[a].avg)
        ) {
          instanceData[a].class -= 1;
          // 30July2019 instanceData[a].bin -= 1; // KB,10July2019
        }
      }

      iteration += 1;
      breaks = getBreaks(instanceData, "class", iteration);
      // 30July2019 breaks = getBreaks(instanceData, "bin", iteration); // KB,10July2019

      varianceArr = breaks.map(function(d) {
        return d.variance;
      });
      sumvar = getSum(varianceArr);
      if (iteration > 3) psumvar = sumvar;
      if (iteration > 20) break;
    }
  }

  function quantiles() {
    addDenseRank(classifyField, "dense_rank");
    addNtile();
    addClass();
  }

  publicAPI.getProcessedData = function() {
    return mProcessedData;
  };

  function init() {
    var dataClassificationType;

    sourceData = config.sourceData;
    classifyField = config.classifyField;
    nTile = config.nTile;
    dataClassificationType = config.dataClassificationType;

    // Call functions to create class breaks and legend
    setup();

    if (dataClassificationType === "NaturalBreaks") {
      quantiles();
      naturalbreaks();
    } else if (dataClassificationType === "Quartiles") {
      quantiles();
    }

    createReturnObject();
  }

  init();

  return publicAPI;
}
export default ClassifyData;
