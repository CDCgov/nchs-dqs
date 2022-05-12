export class VaccinationsFilters {
	template = () => {
		return `
    <div class="main-ctn">
    <div class="sub-ctn radio-selection-container" id="cases-and-deaths-selection-options">
       <div tabindex="0" id="view-selection" class="visualization-radio-container">
          <div class="radio-title">View:</div>
          <form id="view-select-radios">
             <div tabindex="0">
                <input type="radio" name="view-radio" id="SVI" value="SVI" checked>
                <label for="SVI">Social Vulnerability Index (SVI)</label>
             </div>
             <div tabindex="0">
                <input type="radio" name="view-radio" id="metroNonMetro" value="Metro">
                <label for="metroNonMetro">Metro/Non-Metro</label>
             </div>
             <div tabindex="0">
                <input type="radio" name="view-radio" id="urbanRural" value="urbanRuralChart">
                <label for="urbanRural">Urbanicity Charts</label>
             </div>
          </form>
       </div>
       <div id="vaccination-selection" class="visualization-radio-container">
          <div tabindex="0" class="radio-title">Metric:</div>
          <form id="vaccination-select-radios">
             <div tabindex="0">
                <input type="radio" name="vaccination-radio" id="fully-vaccinated-radio" value="fullyVaccinated" checked>
                <label for="fully-vaccinated-radio">Fully Vaccinated</label>
             </div>
             <div tabindex="0">
                <input type="radio" name="vaccination-radio" id="booster-dose-radio" value="boosterDose">
                <label for="booster-dose-radio">First Booster Dose</label>
             </div>
          </form>
       </div>
       <div id="population-selection" class="visualization-radio-container">
          <div tabindex="0" class="radio-title" id="population-radio-title">Population:</div>
          <form id="population-select-radios">
             <div tabindex="0">
                <input type="radio" name="population-radio" id="population-radio-total" value="Total_Population" checked>
                <label for="population-radio-total">Total Population</label>
             </div>
             <div tabindex="0" id="div-radio-population-5-17">
                <input type="radio" name="population-radio" id="population-radio-population-5-17" value="Population_5_17">
                <label for="population-radio-population-5-17">Population 5-17 Years of Age</label>
             </div>
             <div tabindex="0" id="div-radio-population-over-5">
                <input type="radio" name="population-radio" id="population-radio-population-over-5" value="Population_5">
                <label for="population-radio-population-over-5">Population &#8805; 5 Years of Age</label>
             </div>
             <div tabindex="0">
                <input type="radio" name="population-radio" id="population-radio-population-over-12" value="Population_Over_12">
                <labl for="population-radio-population-over-12">
                Population &#8805; 12 Years of Age</label>
             </div>
             <div tabindex="0">
                <input type="radio" name="population-radio" id="population-radio-population-over-18" value="Population_Over_18">
                <label for="population-radio-population-over-18">Population &#8805; 18 Years of Age</label>
             </div>
             <div tabindex="0">
                <input type="radio" name="population-radio" id="population-radio-population-over-65" value="Population_65_plus">
                <label for="population-radio-population-over-65">Population &#8805; 65 Years of Age</label>
             </div>
          </form>
       </div>
       <div id="view-selection-2" class="visualization-radio-container" style="display:none;">
          <div tabindex="0" id="location-label" class="radio-title">
             Select US or State:
          </div>
          <div id="location-select" 
            class="ui search selection dropdown" 
            style="width:90%;"
            tabindex="0" 
            aria-label="Select US, Region, or State. Currently selected United States."
            >
             <input type="hidden" name="currentLocation">
             <div class="text"></div>
             <i class="dropdown icon"></i>
          </div>
       </div>


       <div id="view-selection-3" class="visualization-radio-container" style="display:none;">
          <div tabindex="0" id="location-label" class="radio-title">
            Select Classification:
          </div>
          <div id="classification-select"
            class="ui search selection dropdown"
            style="width:90%;"
            tabindex="0"
            aria-label="Select Classification:">
             <input type="hidden" name="currentClassification">
             <div class="text"></div>
             <i class="dropdown icon"></i>
          </div>
       </div>



       </br>
       </br>
       </br>
       <div id="comparison-chart-selectors" style="display: flex; justify-content: space-around; align-items: center; flex-wrap:wrap; width:90%; margin-top:15px;">
          <div id="category-select" class="ui fluid multiple selection dropdown" style="display:none;">
             <input id="category-select-input" type="hidden" name="categories">
             <i class="dropdown icon"></i>
             <div tabindex="0" class="default text">Select Categories</div>
             <div tabindex="0" id="category-select-list" class="menu"></div>
          </div>
       </div>
       <div tabindex="0" id="metric_callout_box"></div>
       <div id="viz-chart-map-toggle" style="width: 100%; margin-top:15px; " data-html2canvas-ignore>
          <div tabindex="0" id="toggle-viz-type-container" style="float:left;" class="ui buttons chart-toggle-btn-group">
             <button id="map-toggle-btn" class="ui attached basic button buttonDataViewTogg btn-cyan active" aria-label="View Map">
             <i id="viz-map-select" data-tabname="" class="fas fa-globe-americas"></i> Map
             </button>
             <button id="chart-toggle-btn" class="ui attached basic button buttonDataViewTogg btn-cyan" aria-label="View Table">
             <i id="viz-chart-select" class="fa fa-table" data-tabname=""></i> Table
             </button>
          </div>
       </div>
    </div>
 </div>`;
	};

	render() {
		$("#vaccinations-filter-wrapper").empty().append(this.template());
	}
}
