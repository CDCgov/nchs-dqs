export const vaccinationsTemplate = `
<div id="content-container" class="ui basic segment">
  <div id="vaccinations-wrapper" style="visibility:hidden;min-height: 550px;">
    <div id="vaccinations-banner-wrapper">
    </div>
    <!-- /#vaccinations-banner-wrapper -->
    <div id="vaccinations-graph-map-container">
      <div id="vaccinations-banner-wrapper2" style="flex-wrap: wrap;">
      </div>
      <div id="vaccinations-visual-wrapper">
        <div id="vaccinations-filter-wrapper" data-html2canvas-ignore>
        </div>
        <div tabindex="0" id="vaccinations-map-title" style="text-align: center; font-size: 1.2em; font-weight: bold; margin-top: 11px;">
        </div>
        <div id="vaccinations-map-wrapper">
        </div>
        <div id="vaccinations-map-selections-wrapper">
          <div id="vaccinations-territories">
          </div>
          <div id="heatMapWrapper">
          </div>
          <div id="vaccinations-federal">
          </div>
        </div>
        <!-- end #vaccinations-map-selections-wrapper -->
        <div id="viz_area_one" class="dwnl-img-container">
          <button class="theme-cyan ui btn" aria-label="map download" id="dwnload-img-vaccination-equity-maps" data-html2canvas-ignore style="display: block;">Download Map <span class="fas" aria-hidden="true"></span></button>
        </div>
      </div>
      <!-- /#vaccinations-visual-wrapper -->
    </div>
    <!-- /#vaccinations-wrapper -->
    <div id="urbanRuralChartEquity" class="general-chart">
    </div>
    <div tabindex="0" id="viz_area_one" class="dwnl-img-container">
      <button class="theme-cyan ui btn" aria-label="chart download" id="dwnload-img-RuralUrban-chart" data-html2canvas-ignore style="display: none;">
        Download Chart
        <span class="fas" aria-hidden="true"></span>
      </button>
    </div>
  </div>
  <div class="active ui inverted dimmer">
    <div class="ui text loader">Loading</div>
  </div>
</div>
`;
