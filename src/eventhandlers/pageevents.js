export const PageEvents = {
	tableToggle() {
		const toggleTable = (e) => {
			e.preventDefault();
			// don't add space bar 32 here for 508 compliance bc that is used for scrolling the page (TT)
			if (!e.keyCode || e.keyCode === 13) {
				$(e.currentTarget).children(".table-toggle-icon").children("i").toggleClass("fa-minus fa-plus");
				$(e.currentTarget).toggleClass("closed");
				$(e.currentTarget).next(".data-table").toggleClass("closed");
				// const action = $(e.currentTarget).hasClass("closed") ? "closed." : "opened.";
				// const tableTitle = $(e.currentTarget).children(".table-title").text();
				// let interaction = `${appState.NAV_ITEM}: ${tableTitle} ${action}`;
				//Analytics.triggerOmnitureInteractions(interaction);
			}
		};

		$(document).on("click", ".table-toggle", toggleTable);
		$(document).on("keyup", ".table-toggle", toggleTable);
	},

	closeDropdowns() {
		$(document).on("click", (e) => {
			if ($(e.target).closest(".genDropdownOpened").length) return;
			if (e.target.id === "genDropdownSearch" || e.target.id === "genDdSearchAnchor") return;
			$(".genDropdownOpened").removeClass("genDropdownOpened");
		});
	},

	// check for screen width change
	screenWidthChange() {
		setTimeout(() => {
			$(window).on("resize", () => {
				if (window.innerWidth < 1200) {
					$(".mainDropdown").removeClass("col");
				} else {
					$(".mainDropdown").addClass("col");
				}
				if (window.innerWidth < 768) {
					$(".fa-arrow-circle-right").addClass("fa-rotate-90");
				} else {
					$(".fa-arrow-circle-right").removeClass("fa-rotate-90");
				}
			});
		}, 1000);
	},
};
