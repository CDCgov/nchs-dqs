
function CSVFileDownload() {
  var publicAPI = {};

  publicAPI.downloadCSV = function (config) {
    var encodedJSONDataStr;
    var a;
    var file;
    var isIE;
    var isEdge;
    var type;
    var fileName;
    var csvText;

    type = "application/json";
    fileName = config.Filename;
    csvText = config.CSVContent;

    encodedJSONDataStr =
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvText);

    file = new Blob([csvText], { type: type });
    isIE = /* @cc_on!@ */ false || !!document.documentMode;
    isEdge = window.navigator.userAgent.indexOf("Edge") > -1;

    if (isIE) {
      window.navigator.msSaveOrOpenBlob(file, fileName);
    } else if (isEdge) {
      a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.style.display = "none";
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove(); // 10Nov2020
    } else {
      a = document.createElement("a");
      a.setAttribute("href", encodedJSONDataStr);
      a.setAttribute("download", fileName);
      document.body.appendChild(a); // required for firefox
      a.click();
      a.remove();
    }
  };
  return publicAPI;
}
export default CSVFileDownload;
