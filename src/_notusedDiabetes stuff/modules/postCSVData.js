/* define(["jquery"], function($) { */
  import $ from "jquery";
  
  function PostCSVData() {
    var publicAPI = {};

    publicAPI.post = function(config) {
      $("<form>", {
        action: "DiabetesAtlasD3Handler.ashx",
        method: "post",
        target: "_self"
      })
        .append(
          $("<input>", { name: "callType", value: "CSV", type: "hidden" }),
          $("<input>", {
            name: "fileName",
            value: config.DownloadFileName,
            type: "hidden"
          }),
          $("<input>", { name: "data", value: config.CSVData, type: "hidden" })
        )
        .appendTo("body")
        .submit();
    };
    return publicAPI;
  }
export default PostCSVData;
