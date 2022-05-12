import { downloadVaccinationInUS } from "../../utils/downloadimg";

export class VaccinationsBanner {
	constructor(props) {
		this.data = props.data || {};
		this.totals = props.totals || {};
		this.totalsLTC = props.totalsLTC || {};
		this.panelNotes = "";
	}

	toggleDownloadMenu = () => {
		const downloadMenu = document.getElementById(`dwn-ctr-vaccinations-us`);
		const dropdownIcon = document.querySelector(`#demo-export-dwn-ctr-vaccinations-us > i`);
		if (downloadMenu.classList.contains("invisible")) {
			dropdownIcon.classList.remove("fa-chevron-down");
			dropdownIcon.classList.add("fa-chevron-up");
		} else {
			dropdownIcon.classList.remove("fa-chevron-up");
			dropdownIcon.classList.add("fa-chevron-down");
		}
		downloadMenu.classList.toggle("invisible");
	};

	toggleDownloadMenu2 = () => {
		const downloadMenu = document.getElementById(`dwn-ctr-vaccinations-us-2`);
		const dropdownIcon = document.querySelector(`#demo-export-dwn-ctr-vaccinations-us-2 > i`);
		if (downloadMenu.classList.contains("invisible")) {
			dropdownIcon.classList.remove("fa-chevron-down");
			dropdownIcon.classList.add("fa-chevron-up");
		} else {
			dropdownIcon.classList.remove("fa-chevron-up");
			dropdownIcon.classList.add("fa-chevron-down");
		}
		downloadMenu.classList.toggle("invisible");
	};

	toggleDownloadMenu3 = () => {
		const downloadMenu = document.getElementById(`dwn-ctr-vaccinations-us-3`);
		const dropdownIcon = document.querySelector(`#demo-export-dwn-ctr-vaccinations-us-3 > i`);
		if (downloadMenu.classList.contains("invisible")) {
			dropdownIcon.classList.remove("fa-chevron-down");
			dropdownIcon.classList.add("fa-chevron-up");
		} else {
			dropdownIcon.classList.remove("fa-chevron-up");
			dropdownIcon.classList.add("fa-chevron-down");
		}
		downloadMenu.classList.toggle("invisible");
	};

	download = (id) => {
		downloadVaccinationInUS(id);
	};

	template = () => {
		return `
        <!-- BAR CHART -->
        <div class="container container-fix-us-vaccinations" id="vaccinationsBarChart" >
        <div class="viz-cntrl-btns democardBtnContainer download-button-fixes-US" style="align-items: flex-end;">
        <button class="ui basic button buttonExportBtn" id="demo-export-dwn-ctr-vaccinations-us"  style="cursor: pointer;" aria-label="Export Data for vaccinations-us" ">
            Download <i class='fas fa-chevron-down' aria-hidden="true"></i>
        </button>
        <div class="download-container invisible" id="dwn-ctr-vaccinations-us">
            <button  id="dwn-img-vaccinations-us" data-download-id="vaccinationsBarChart" class="theme-cyan ui btn dwm-img-btn" data-vizid=-"vaccinations-us" style="margin: 5px 0">Chart (.png)</button>
            <button  id="vaccinationsBarChartCSV" data-download-id="vaccinationsBarChartCSV" class="theme-cyan ui btn dwm-img-btn" style="margin: 5px 0">CSV</button>

        </div>
    </div>
        </div>

        <!--End Bar Chart -->

        <!-- 2nd row -->
        <div class="container container-fix-us-vaccinations" id="vaccinationsBarChart2"> 
            <div class="viz-cntrl-btns democardBtnContainer download-button-fixes-US" style="align-items: flex-end; margin-bottom: 144px; height: 30px;">
            <button class="ui basic button buttonExportBtn" id="demo-export-dwn-ctr-vaccinations-us-2"  style="cursor: pointer;" aria-label="Export Data for Number of People with 2 Doses in Long-Term Care Facilities">
                Download <i class='fas fa-chevron-down' aria-hidden="true"></i>
            </button>
            <div class="download-container invisible" id="dwn-ctr-vaccinations-us-2">
                <button id="dwn-img-vaccinations-us-2" data-download-id="vaccinationsBarChart2"  class="theme-cyan ui btn dwm-img-btn" data-vizid=-"vaccinations-us" style="margin: 5px 0">Chart (.png)</button>
                <button  id="vaccinationsBarChartCSV2DosesAdministered"  class="theme-cyan ui btn dwm-img-btn" style="margin: 5px 0">CSV</button>
            </div>
            </div>
        </div>

        <!--END  2 nd row -->

        <!-- Third row -->
        <div class="container container-fix-us-vaccinations" id="vaccinationsBarChart3"> 
            <div class="viz-cntrl-btns democardBtnContainer download-button-fixes-US" style="align-items: flex-end; margin-bottom: 135px; height: 30px;">
            <button class="ui basic button buttonExportBtn" id="demo-export-dwn-ctr-vaccinations-us-3"  style="cursor: pointer;" aria-label="Export Data for Number of People with 2 Doses in Long-Term Care Facilities">
                Download <i class='fas fa-chevron-down' aria-hidden="true"></i>
            </button>
            <div class="download-container invisible" id="dwn-ctr-vaccinations-us-3">
                <button id="dwn-img-vaccinations-us-3" data-download-id="vaccinationsBarChart3"  class="theme-cyan ui btn dwm-img-btn" data-vizid=-"vaccinations-us" style="margin: 5px 0">Chart (.png)</button>
                <button  id="vaccinationsBarChartCSVSeriesComplete"  class="theme-cyan ui btn dwm-img-btn" style="margin: 5px 0">CSV</button>
            </div>
            </div>
        </div>
        `;
	};

	render() {
		$("#vaccinations-banner-wrapper2").empty().append(this.template());
		document.getElementById("demo-export-dwn-ctr-vaccinations-us").onclick = this.toggleDownloadMenu;
		document.getElementById("demo-export-dwn-ctr-vaccinations-us-2").onclick = this.toggleDownloadMenu2;
		document.getElementById("demo-export-dwn-ctr-vaccinations-us-3").onclick = this.toggleDownloadMenu3;

		document.getElementById("dwn-img-vaccinations-us").addEventListener("click", (d) => {
			let downloadId = d.target.getAttribute("data-download-id");
			this.download(downloadId);
		});
		document.getElementById("dwn-img-vaccinations-us-2").addEventListener("click", (d) => {
			let downloadId = d.target.getAttribute("data-download-id");
			this.download(downloadId);
		});
		document.getElementById("dwn-img-vaccinations-us-3").addEventListener("click", (d) => {
			let downloadId = d.target.getAttribute("data-download-id");
			this.download(downloadId);
		});
	}
}
