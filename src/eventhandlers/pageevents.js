export const PageEvents = {
	tableToggle() {
		const toggleTable = (e) => {
			e.preventDefault();
			// don't add space bar 32 here for 508 compliance bc that is used for scrolling the page (TT)
			if (!e.keyCode || e.keyCode === 13) {
				$(e.currentTarget).children(".table-toggle-icon").children("i").toggleClass("fa-minus fa-plus");
				$(e.currentTarget).toggleClass("closed");
				$(e.currentTarget).next(".data-table").toggleClass("closed");
				const isClosed = $(e.currentTarget).hasClass("closed");
				$("#pageFooter").attr("aria-hidden", isClosed);
				$(e.currentTarget).attr("aria-expanded", !isClosed);

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
			// removes hovered over state so it's not "selected" when you go back
			$(".genDropdownOpened").find(".genDropdownOption.genOptionSelected").removeClass("genOptionSelected");

			// checks what the previous state was in case you hovered over and didn't click
			// restores value if found
			const isTopicDropdown = $(".genDropdownOpened").attr("id") === "genDropdownSearch";
			const targetElem = isTopicDropdown
				? $(".genDropdownOpened.genDropdownSelected")
				: $(".genDropdownOpened")?.parent();
			const previouslySelectedText = targetElem?.find("a")?.html()?.trim();
			if (previouslySelectedText) {
				const children = $(".genDropdownOptions.genDropdownOpened").find("a");
				children.each((i, el) => {
					const searchText = $(el)?.parent().hasClass("genDropdownSubtopicOption")
						? `${$(el).parent().attr("data-parent-topic")}: ${$(el)?.html()?.trim()}`
						: $(el)?.html()?.trim();

					if (searchText === previouslySelectedText) {
						$(el).parent().addClass("genOptionSelected");
						return false;
					}
				});
			}

			$(".genDropdownOpened").removeClass("genDropdownOpened");
		});
	},

	// check for screen width change
	screenWidthChange() {
		let currentWidth = window.innerWidth;
		const refreshBreakIndices = [
			[0, 499],
			[500, 767],
			[768, 999],
			[1000, 1199],
			[1200, 1399],
			[1400, 1599],
			[1600, 1799],
			[1800, 99999999999999],
		];
		let loadedBreak = refreshBreakIndices.findIndex((el) => el[0] < currentWidth && el[1] >= currentWidth);

		setTimeout(() => {
			$(window).on("resize", () => {
				if (currentWidth < 1200) {
					$(".mainDropdown").removeClass("col");
				} else {
					$(".mainDropdown").addClass("col");
				}
				if (currentWidth < 768) {
					$(".fa-arrow-circle-right").addClass("fa-rotate-90");
				} else {
					$(".fa-arrow-circle-right").removeClass("fa-rotate-90");
				}
				currentWidth = window.innerWidth;
				const currentBreak = refreshBreakIndices.findIndex(
					(el) => el[0] < currentWidth && el[1] >= currentWidth
				);
				if (currentBreak !== loadedBreak) {
					loadedBreak = currentBreak;
					setTimeout(() => {
						appState.ACTIVE_TAB.renderDataVisualizations();
					}, 300);
				}
			});
		}, 1000);
	},
};
