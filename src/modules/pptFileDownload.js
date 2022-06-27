/* define(["jquery"], function($) { */
  import $ from "jquery";
  
  function PPTDownload() {
    var publicAPI = {};

    publicAPI.downloadPPT = function(config) {
      var paramData;
      var request;

      paramData = {
        Filename: config.Filename,
        CustomHeading: config.CustomHeading,
        ChartType: config.ChartType,
        LegendTitle: config.LegendTitle,
        IndicatorName: config.IndicatorName,
        MapImageBase64: config.MapImageBase64,
        LegendImageBase64: config.LegendImageBase64,
        FileRequestToken: config.FileRequestToken
      };

      request = $.ajax({
        url: "./api/diabetes/GetPowerPointFile",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(paramData),
        cache: false,
        contentType: "application/json; charset=utf-8"
      })
        .done(function(responseData) {
          return responseData;
        })
        .fail(function(err) {
          throw new Error("Error in creating PPT file. " + err);
        });

      return request;
    };

    return publicAPI;
  }
export default PPTDownload;
