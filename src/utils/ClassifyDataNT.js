// import '../../node_modules/core-js/es6/set';
// import '../../node_modules/core-js/es6/array';

export const ClassifyData = function (sourceData, classifyField, ntile, method) {
    let instanceData;
    let suppressedDataObjArray;

    if (method === undefined) method = 1;

    // Call functions to create class breaks and legend
    setup();

    // Check if all the data is suppressed.  If so, create return object
    if (instanceData.length == 0) {
        return createReturnObject();
    } else {
        if (method === 1) {
            quantiles();
            return createReturnObject();
        }
        else if (method === 2) {
            quantiles();
            naturalbreaks();
            return createReturnObject();
        }
        else if (method === 3) {
            return equalIntervals();
        }
    }
    

    function setup() {
        // Make a deep clone of the sourceData so it remains unchanged
        instanceData = deepClone();

        // Sort the data by classifyField
        instanceData.sort(function (a, b) { return a[classifyField] - b[classifyField]; });

        //=====================================================================
        // Remove any suppressed data and put in suppressedDataObjArray
        // ***** You may need to alter if statement here with your suppression rules *****
        suppressedDataObjArray = [];
        for (let s = (instanceData.length - 1); s >= 0; s--) {
            if (instanceData[s][classifyField] < 0 || instanceData[s][classifyField] == null) {
                suppressedDataObjArray.push(instanceData.splice(s, 1)[0]);
            }
        }
        //=====================================================================
    }


//     _____  __                     __                  __     ____                      __        
//    / ___/ / /_ ____ _ ____   ____/ /____ _ _____ ____/ /    / __ ) _____ ___   ____ _ / /__ _____
//    \__ \ / __// __ `// __ \ / __  // __ `// ___// __  /    / __  |/ ___// _ \ / __ `// //_// ___/
//   ___/ // /_ / /_/ // / / // /_/ // /_/ // /   / /_/ /    / /_/ // /   /  __// /_/ // ,<  (__  ) 
//  /____/ \__/ \__,_//_/ /_/ \__,_/ \__,_//_/    \__,_/    /_____//_/    \___/ \__,_//_/|_|/____/  
//                                                                                                

    function addDenseRank(val, newField) {
        let valArray = [];

        for (let f = 0; f < instanceData.length; f++) {
            if (valArray.indexOf(instanceData[f][val]) == -1) {
                valArray.push(instanceData[f][val]);
            }

            instanceData[f][newField] = valArray.indexOf(instanceData[f][val]) + 1;
        }
    }

    function addNtile() {
        let bgs = Math.floor(instanceData.length / ntile),
            mod = instanceData.length % ntile,
            currentGroup = 1,
            linecount = 0;
        
        if (mod == 0) {
            // Mod is 0 so groups are evenly spread. Need to make "ntile" groups of "baseGroupSize" over the "dataArrayLength"
            for (let s = 0; s < ntile; s++) {
                for (let t = 0; t < bgs; t++) {
                    instanceData[linecount]["ntile"] = currentGroup;
                    linecount++
                }
                currentGroup++;
            }
        } else {
            // Mod is != 0 so need to make "mod" groups of (baseGroupSize + 1) AND (ntile - mod) groups of "baseGroupSize"
            // Handle extra mod groups first
            for (let i = 0; i < mod; i++) {
                for (let k = 0; k < (bgs + 1) ; k++) {
                    instanceData[linecount]["ntile"] = currentGroup;
                    linecount++;
                }
                currentGroup++;
            }

            // Now handle standard group size
            for (let m = 0; m < (ntile - mod) ; m++) {
                for (let n = 0; n < bgs; n++) {
                    instanceData[linecount]["ntile"] = currentGroup;
                    linecount++;
                }
                currentGroup++;
            }
        }
    }

    function addClass() {
        var drArray = [],
         //   drMax,
            tempMin,
            minValue,
            maxNtileIdx = 0,
            tempNtile = 1,
            tempRank;

            let drSet = new Set(instanceData.map(function (m) { return m.dense_rank; }));
            drArray = Array.from(drSet);

            //using +1 for 0 base
            if ((instanceData.length + 1) < ntile) {
                // Assign dense_rank to class
                for (let c = 0; c < instanceData.length; c++) {
                    instanceData[c]["class"] = instanceData[c].dense_rank;
                }

                postMessage(createReturnObject());
            }

            function getMaxIndexOfField(darr, field1, field2) {
                return darr.reduce(function (iMax, val, idx, arr) {
                    return val[field1] == field2 ? idx : iMax;
                }, 0);
            }


            while (maxNtileIdx < instanceData.length) {
                tempNtile = instanceData[maxNtileIdx].ntile;

                maxNtileIdx = getMaxIndexOfField(instanceData, "ntile", tempNtile);

                tempRank = instanceData[maxNtileIdx].dense_rank;

                maxNtileIdx = getMaxIndexOfField(instanceData, "dense_rank", tempRank);

                for (let e = 0; e <= maxNtileIdx; e++) {
                    if (instanceData[e].bin == undefined)
                        instanceData[e].bin = tempNtile;
                }

                maxNtileIdx++;
            }

            // Create the class \\
            addDenseRank("bin", "class");
    }

    function deepClone() { 
        return JSON.parse(JSON.stringify(sourceData));
    }

    function createLegendArray(data, classKey, valKey) {
        let tempObj = {},
            tempArray = [];

        for (let i = 0; i < data.length; i++) {
            // If classKey doesnt exist add it
            if (!data[i][classKey]) data[i][classKey] = 0;

            // Add property to tempObj if its not there
            if (!tempObj.hasOwnProperty(data[i][classKey])) {
                tempObj[data[i][classKey]] = {
                    "c": data[i][classKey],
                    "min": data[i][valKey],
                    "max": data[i][valKey],
                    "active": 1,
                };
            } else {
                if (data[i][valKey] < tempObj[data[i][classKey]]["min"]) tempObj[data[i][classKey]]["min"] = data[i][valKey];
                if (data[i][valKey] > tempObj[data[i][classKey]]["max"]) tempObj[data[i][classKey]]["max"] = data[i][valKey];
            }
        }

        
        // // CREATE SMOOTH NUMBER TRANSITION ON LEGEND \\
        // let newMinNum;
        // for (let m in tempObj) { 
        //     if (tempObj[m]["c"] === 0) {
        //         // Suppressed class
        //         // console.log("suppressed class");
        //     } else if (tempObj[m]["c"] === 1) {
        //         // First class break. Set min to 0
        //         tempObj[m]["min"] = 0;
        //         newMinNum = (tempObj[m]["max"] + .1).toFixed(1);
        //     } else {
        //         tempObj[m]["min"] = newMinNum;
        //         newMinNum = (tempObj[m]["max"] + .1).toFixed(1);
        //     }
        // }

        for (let h in tempObj) { tempArray.push(tempObj[h]); };
        return tempArray;
    }

    function createReturnObject() {
        let combinedDataArray = suppressedDataObjArray.concat(instanceData);
        let legendArray = createLegendArray(combinedDataArray, "class", classifyField);

        let rtnObj = {
            "classifiedData": combinedDataArray,
            "legend": legendArray
        };

        return rtnObj;
    }

    function quantiles() {
        addDenseRank(classifyField, "dense_rank");
        addNtile();
        addClass();
    }



//    _  __        __                      __        ___                     __       
//   / |/ / ___ _ / /_ __ __  ____ ___ _  / /       / _ )  ____ ___  ___ _  / /__  ___
//  /    / / _ `// __// // / / __// _ `/ / /       / _  | / __// -_)/ _ `/ /  '_/ (_-<
// /_/|_/  \_,_/ \__/ \_,_/ /_/   \_,_/ /_/       /____/ /_/   \__/ \_,_/ /_/\_\ /___/
//

    function naturalbreaks() {
        let classesSet = new Set(instanceData.map(function (m) { return m["class"]; }));
        let classes = Array.from(classesSet);

        function getSum(array) {
            return array.reduce(function (total, value) {
                return total + value;
            }, 0)
        }

        function getMean(array) {
            return array.reduce(function (total, value, index) {
                total += value;
                if (index === array.length - 1) {
                    return total / array.length;
                } else {
                    return total;
                }
            });
        }

        function getVariance(array) {

            let num = 0;

            num = array.length;

            if (num === 0) throw new Error('Cannot calculate variance of an empty array');

            let sum = getSum(array);

            let mean = sum / num;

            // calculate the variance
            sum = 0;

            sum = array.reduce(function (accumulator, currentValue) {
                let diff = currentValue - mean;
                return accumulator + (diff * diff);
            }, 0);


            return (num == 1) ? 0 : sum / (num - 1);
        }

        function getBreaks(data, classKey, id) {
            let dataByClass, breaks = [];

            for (let t = 0; t < classes.length; t++) {
                dataByClass = [];
                for (let s = 0; s < data.length; s++) {
                    if (data[s].class == classes[t]) {
                        dataByClass.push(data[s][classifyField]);
                    }

                }
                breaks.push({ id: id, "class": classes[t], "min": dataByClass[0], "max": dataByClass[dataByClass.length - 1], "avg": getMean(dataByClass), "variance": getVariance(dataByClass) });
            }


            return breaks;
        }

        
        let breaks = getBreaks(instanceData, 'class', 1);
        

        // Should be able to use classes.max(...arrayVar) here
        let nbreaks = breaks.map(function (d) { return d.class })
                            .reduce(function (a, b) {
                                return Math.max(a, b);
                            });

        //let nbreaks = classes.max(...classes);

        

        let varianceArr = breaks.map(function (d) { return d.variance });
        //console.log("breaks", breaks);
        //console.log("varianceArr", varianceArr);

        
        let sumvar = getSum(varianceArr);
        let psumvar = sumvar + 1;

        //console.log(sumvar, psumvar);

        let iteration = 1, valArr;

        while (psumvar > sumvar) {


            for (let q = 0; q < breaks.length; q++) {
                valArr = [];
                for (let s = 0; s < instanceData.length; s++) {
                    if (instanceData[s].class == breaks[q].class) {
                        instanceData[s].avg = breaks[q].avg;

                        if (breaks[q].class == 1)
                            instanceData[s].pavg = breaks[q].avg;
                        else if (breaks[q].class > 1)
                            instanceData[s].pavg = breaks[q - 1].avg;

                        if (breaks[q].class < nbreaks)
                            instanceData[s].navg = breaks[q + 1].avg;
                        else 
                            instanceData[s].navg = breaks[breaks.length - 1].avg;
                    }

                }

            }

            for (let a = 0; a < instanceData.length; a++) {
                if (Math.abs(instanceData[a][classifyField] - instanceData[a].navg) < Math.abs(instanceData[a][classifyField] - instanceData[a].avg)) {
                    instanceData[a].class += 1;
                }
                if (Math.abs(instanceData[a][classifyField] - instanceData[a].pavg) < Math.abs(instanceData[a][classifyField] - instanceData[a].avg)) {
                    instanceData[a].class -= 1;
                }

            }


            iteration += 1;
            breaks = getBreaks(instanceData, 'class', iteration);

            varianceArr = breaks.map(function (d) { return d.variance })
            sumvar = getSum(varianceArr);
            if (iteration > 3) psumvar = sumvar
            if (iteration > 20) break;

        }
    }


//    ____                     __        ____        __                           __     
//   / __/ ___ _ __ __ ___ _  / /       /  _/  ___  / /_ ___   ____ _  __ ___ _  / /  ___
//  / _/  / _ `// // // _ `/ / /       _/ /   / _ \/ __// -_) / __/| |/ // _ `/ / /  (_-<
// /___/  \_, / \_,_/ \_,_/ /_/       /___/  /_//_/\__/ \__/ /_/   |___/ \_,_/ /_/  /___/
//         /_/                                                                           

    function equalIntervals() {
        var maxIdx = 0, tempNtile = 0;
        var minValue = instanceData.map(function (d) { return d[classifyField] })
            .reduce(function (a, b) {
                return Math.min(a, b);
            });

        var maxValue = instanceData.map(function (d) { return d[classifyField] })
         .reduce(function (a, b) {
             return Math.max(a, b);
         });

        var commonDifference = (maxValue - minValue) / ntile;
        var classRangeArray = [], currentMax = minValue + commonDifference;

        function getMaxIndexOfFieldLT(darr, value) {
            return darr.reduce(function (iMax, val, idx, arr) {
                return (val.class == undefined) && val[classifyField] < value ? idx : iMax;
            }, 0);
        }

        function addEIClass(startIndex, endIndex) {
            for (var e = startIndex; e <= endIndex; e++) {
                if (instanceData[e].class == undefined)
                    instanceData[e].class = tempNtile + 1;
            }
        }

        function createEILegend(classArray, minval) {
            let legendArray = [];

            // (TTT) We dont have any suppressed data right now
            // - disabling the push of the suppressed record
            if (suppressedDataObjArray.length > 0)
                legendArray.push({ 'c': 0, 'min': null, 'max': null });

                for (let b = 0; b < classArray.length; b++) {
                    if (b == 0) {
                        legendArray.push({
                            "c": b + 1,
                            "min": minval,
                            "max": classArray[b],
                            "active": 1,  // (TT) for legend with checks add "active" flag
                        });
                    }
                    else {
                        legendArray.push({
                            "c": b + 1,
                            "min": classArray[b - 1],
                            "max": classArray[b],
                            "active": 1, // (TT) for legend with checks add "active" flag
                        });
                    }
                }
                return legendArray;
        } // end createEILegend

        for (let q = 0; q < ntile; q++) {
            classRangeArray.push(+currentMax.toFixed(1));
            currentMax += commonDifference;
        }
      
        let tempMaxId, startIdx = 0;
        while (maxIdx < instanceData.length) {
            tempMaxId = getMaxIndexOfFieldLT(instanceData, classRangeArray[tempNtile]);
            if (tempMaxId > 0) {
                maxIdx = tempMaxId;

                addEIClass(startIdx, maxIdx);
            }
            startIdx = maxIdx;
            maxIdx++;
            if (tempNtile < ntile)
                tempNtile++;
            else
                break;
        }
        tempMaxId = getMaxIndexOfFieldLT(instanceData, classRangeArray[classRangeArray.length - 1]);
        addEIClass(tempMaxId, instanceData.length - 1);

        let combinedDataArray = suppressedDataObjArray.concat(instanceData);


        let rtnObj = {
            "classifiedData": combinedDataArray,
            "legend": createEILegend(classRangeArray, minValue)
        };

        return rtnObj;
    }
};
