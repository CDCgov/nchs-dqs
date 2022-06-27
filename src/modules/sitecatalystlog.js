/* define(["jquery"], function($) {
  "use strict"; */

import $ from "jquery";
import * as d3 from "../lib/d3_v4-min";

function SiteCatalystLog() {
  var mMediator;
  var publicAPI = {};
  var omnitureInteractionsUrl =
    "https://cdc.112.2o7.net/b/ss/cdcgov/1/H.21--NS/0?cl=session&j=1.0&c41=NCCDPHP Diabetes JS Atlas&c40=[c40]&i=[i]";

  publicAPI.setMediator = function(m) {
    mMediator = m;
  };

  publicAPI.getMediator = function() {
    return mMediator;
  };

  // from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript#8809472
  function generateUUID() {
    var d = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
      c
    ) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x7) | 0x8).toString(16);
    });
    return uuid;
  }

  publicAPI.sendInfo = function(interactionData) {
    // replace the [c40] and [i] tags with the interactions data and guid, then url encode
    var url = encodeURI(
      omnitureInteractionsUrl
        .replace("[c40]", interactionData)
        .replace("[i]", generateUUID())
        .replace("islCategory=", "")
    );
    // create a dummy image
    var img = document.createElement("IMG");
    // set the src property to begin loading the image http://aboutcode.net/2013/01/09/load-images-with-jquery-deferred.html
    img.src = url;
  };

  return publicAPI;
}
export default SiteCatalystLog;
