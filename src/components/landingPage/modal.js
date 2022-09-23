export const modal = `
	<div id="filtersModal" class="ui modal">
		<div class="header" style="text-align: center">
			Advanced Filter for Topic
	        <div class="actions" style="float: right">
				<div class="ui cancel" aria-label="Close" aria-hidden="true"><i class="fa fa-times"></i></div>
			</div>
	    </div>
	    <div class="description padding-descrp">
			<div class="row">
				<div class="col-md-4 nowrap">
					<input type="checkbox" class="filterCheckbox" id="filterAdults" />
					<label for="filterAdults">Adults</label>
				</div>
				<div class="col-md-4 nowrap">
					<input type="checkbox" class="filterCheckbox" id="filterFuncLimitStatus" />
					<label for="filterFuncLimitStatus">Functional limitation Status</label>
				</div>
				<div class="col-md-4 nowrap">
					<input type="checkbox" class="filterCheckbox" id="filterHawaiian" />
					<label for="filterHawaiian">Native Hawaiian or Other Pacific Islander</label>
				</div>
				<div class="col-md-4 nowrap">
					<input type="checkbox" class="filterCheckbox" id="filterIndian" />
					<label for="filterIndian">American Indian or Alaska Native</label>
				</div>
				<div class="col-md-4 nowrap">
					<input type="checkbox" class="filterCheckbox" id="filterInsuranceStatus" />
					<label for="filterInsuranceStatus">Health Insurance Status</label>
				</div>
				<div class="col-md-4 nowrap">
					<input type="checkbox" class="filterCheckbox" id="filterOlder" />
					<label for="filterOlder">Older Adults</label>
				</div>
				<div class="col-md-4 nowrap">
					<input type="checkbox" class="filterCheckbox" id="filterAsian" />
					<label for="filterAsian">Asian</label>
				</div>
				<div class="col-md-4 nowrap">
					<input type="checkbox" class="filterCheckbox" id="filterHispanic" />
					<label for="filterHispanic">Hispanic or Latino</label>
				</div>
				<div class="col-md-4 nowrap">
					<input type="checkbox" class="filterCheckbox" id="filterPoverty" />
					<label for="filterPoverty">Poverty Status</label>
				</div>
				<div class="col-md-4 nowrap">
					<input type="checkbox" class="filterCheckbox" id="filterAsianPacific" />
					<label for="filterAsianPacific">Asian or Pacific Islander</label>
				</div>
				<div class="col-md-4 nowrap">
					<input type="checkbox" class="filterCheckbox" id="filterInfants" />
					<label for="filterInfants">Infants</label>
				</div>
				<div class="col-md-4 nowrap">
					<input type="checkbox" class="filterCheckbox" id="filterRegion" />
					<label for="filterRegion">Region</label>
				</div>
				<div class="col-md-4 nowrap">
					<input type="checkbox" class="filterCheckbox" id="filterBlack" />
					<label for="filterBlack">Black or African American</label>
				</div>
				<div class="col-md-4 nowrap">
					<input type="checkbox" class="filterCheckbox" id="filterMale" />
					<label for="filterMale">Male</label>
				</div>
				<div class="col-md-4 nowrap">
					<input type="checkbox" class="filterCheckbox" id="filterWhite" />
					<label for="filterWhite">White</label>
				</div>
				<div class="col-md-4 nowrap">
					<input type="checkbox" class="filterCheckbox" id="filterChildren" />
					<label for="filterChildren">Children and Adolescents</label>
				</div>
				<div class="col-md-4 nowrap">
					<input type="checkbox" class="filterCheckbox" id="filterMarital" />
					<label for="filterMarital">Marital Status</label>
				</div>
				<div class="col-md-4 nowrap"></div>
				<div class="col-md-4 nowrap">
					<input type="checkbox" class="filterCheckbox" id="filterEducation" />
					<label for="filterEducation">Education</label>
				</div>
				<div class="col-md-4 nowrap">
					<input type="checkbox" class="filterCheckbox" id="filterMetropolitan" />
					<label for="filterMetropolitan">Metropolitan and nonmetropolitan</label>
				</div>
				<div class="col-md-4 nowrap"></div>
				<div class="col-md-4 nowrap">
					<input type="checkbox" class="filterCheckbox" id="filterFemale" />
					<label for="filterFemale">Female</label>
				</div>
				<div class="col-md-4 nowrap">
					<input type="checkbox" class="filterCheckbox" id="filterMultipleRace" />
					<label for="filterMultipleRace">Multiple Race</label>
				</div>
				<div class="col-md-4 nowrap"></div>
			</div>
	    </div>
		<div id="filterModalFooter">
			<button id="clearCurrentFilters" class="btn-sm btn-danger">Clear Selections</button>
			<button id="submitFilters" class="btn-sm btn-primary">Submit Filters</button>
		</div>
	</div>
`;
