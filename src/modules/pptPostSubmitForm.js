/* define(["jquery"], function($) { */
import $ from "jquery";

function PPTPostSubmitForm() {
  var publicAPI = {};

  publicAPI.submit = function(config) {
    $("<form>", {
      action: "DiabetesAtlasD3Handler.ashx",
      method: "post",
      target: "_self",
      autocomplete: "off"
    })
      .append(
        $("<input>", {
          name: "callType",
          value: config.CallType,
          type: "hidden"
        }),
        $("<input>", {
          name: "chartType",
          value: config.ChartType,
          type: "hidden"
        }),
        $("<input>", {
          name: "customHeading",
          value: config.ChartTitle,
          type: "hidden"
        }),
        $("<input>", {
          name: "legendTitle",
          value: config.LegendTitle,
          type: "hidden"
        }),
        $("<input>", {
          name: "indicatorName",
          value: config.IndicatorName,
          type: "hidden"
        }),
        $("<input>", {
          name: "mapImage_base64",
          value: config.Canvasdata,
          type: "hidden"
        }),
        $("<input>", {
          name: "legendImage_base64",
          value: config.LegendCanvasData,
          type: "hidden"
        }),
        $("<input>", {
          name: "fileName",
          value: config.PPTFileName,
          type: "hidden"
        }),
        $("<input>", {
          name: "fileRequestToken",
          value: config.Token,
          type: "hidden"
        })
      )
      .appendTo("body")
      .submit();
  };
  return publicAPI;
}
export default PPTPostSubmitForm;
