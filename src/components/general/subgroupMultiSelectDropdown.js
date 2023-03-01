/* *************************************************************************************
  Author: Lincoln Bollschweiler
  Email: rlv1@cdc.org
  Date: Oct 2022

  This component requires the following html to be in place in your template

   <div id="[your choice of id, passed in with constructor as 'containerId']"></div>

   DESCRIPTION FOR
   providedProps {
		tabName: "you will have to add it to the tabEventHandlerLookup", REQUIRED
		chartContainerId: "this is used to handle slider domain change registration", NOT REQUIRED
		containerId "matching div in you html config where the dropdown gets rendered", REQUIRED
		options: [ REQUIRED
			{
				text: "what is displayed", REQUIRED
				value: text or number which is applied "<option value='HERE' />",REQUIRED
				selected: true/false, NOT REQUIRED
				maxSelections: integer limiting how many can go in the list as selected, others go in dropdown below, NOT REQUIRED
			}
		],
   }

   WARNING: This is used on multiple tabs. If you need to make changes and have any questions, please reach out to Lincoln
   via Teams or at the email address provided above to liaise/consult.

 ************************************************************************************* */
import { getCurrentSliderDomain } from "./genTrendsSlider";

const populate = (selected, unselected, hasMaxSelections, leaveOpen = false) => {
	const selectedHtmlList = [];
	selected.forEach((o) =>
		selectedHtmlList.push(`
			<div class="genMsdOption" style="display: flex; flex-direction: row; flex-wrap: wrap;" role="option">
				${o.text}<i data-val="${o.value}" class="genMsdDeleteIcon genMsdDelete fas fa-times" type="button" aria-label="Click to Delete ${o.text}" tabindex="0"></i>
			</div>
			`)
	);

	const unselectedHtmlList = [];
	unselected.forEach((o) =>
		unselectedHtmlList.push(
			`<li class="genMsdAdd" data-val="${o.value}" tabindex="0" role="button" aria-label="${o.text}, press enter to add to selected, escape to exit dropdown">${o.text}</li>`
		)
	);

	return `
		<div class="genMsdSelected ${leaveOpen ? "genMsdOpened" : ""}">
			${selectedHtmlList.join("")}
			<input type="text" class="genMsdSearch" placeholder="Search" aria-label="search input for items in multiselect dropdown" />
			<i id="genMsdOpenIcon" class="fas fa-sort-down" tabindex="0"></i>
			<div class="genMsdUnselected ${leaveOpen ? "genMsdOpened" : ""}">
				<ul id="genMsdSelections">
					${hasMaxSelections ? "<li></li>" : `<li role="button" class="genMsdClearAll" tabindex="0">Clear Selections</li>`}
					${unselectedHtmlList.join("")}
				</ul>
			</div>
		</div>
	`;
};

const resetToDefaultSelections = {
	compareTrends: () => appState.ACTIVE_TAB.resetToDefaultSelections(),
};

const tabEventHandlerLookup = new Map([
	[
		"popFactors",
		{
			add: (value) => appState.ACTIVE_TAB.addCategory(value),
			remove: (value) => appState.ACTIVE_TAB.removeCategory(value),
		},
	],
]);

export class SubgroupMultiSelectDropdown {
	constructor(providedProps) {
		this.props = providedProps;
		this.searchText = "";
		this.ariaPre = "Click or press enter to ";
		this.ariaPost = " this dropdown list";
		this.tabAddRemove = tabEventHandlerLookup.get(providedProps.tabName);
		this.resetToDefaultSelections = resetToDefaultSelections[providedProps.tabName];
		this.updateSliderDomain = () =>
			appState.ACTIVE_TAB.setCurrentSliderDomain(getCurrentSliderDomain(`#${providedProps.chartContainerId}`));
	}

	setOptions(options) {
		this.props.options = options;
	}

	getSelectedOptionValues() {
		return this.props.options.filter((o) => o.selected).map((o) => o.value);
	}

	render() {
		const closeKeys = [27, 8, 46]; // keys for ESC, Backspace, and Delete
		$(`#${this.props.containerId} #genMsdOpenIcon`).attr("aria-label", `${this.ariaPre}open${this.ariaPost}`);

		this.#updateDropdown();

		// EVENT HANDLERS
		// Open/Close
		$(document)
			.off("click", `#${this.props.containerId} > .genMsdSelected`)
			.off("keydown", `#${this.props.containerId} #genMsdOpenIcon`)
			.on("click", `#${this.props.containerId} > .genMsdSelected`, (e) => handleOpenOrClose(e))
			.on("keydown", `#${this.props.containerId} #genMsdOpenIcon`, (e) => {
				if (e.key === "Enter" || e.key === " ") handleOpenOrClose(e);
			});

		const handleOpenOrClose = (e) => {
			$(".genDropdownOpened").removeClass("genDropdownOpened");
			e.stopPropagation();
			e.preventDefault();
			if ($(".genMsdOpened").length) {
				$(".genMsdOpened").removeClass("genMsdOpened");
				$(`#${this.props.containerId} #genMsdOpenIcon`).attr(
					"aria-label",
					`${this.ariaPre}open${this.ariaPost}`
				);
			} else {
				$(".genMsdSearch").focus();
				$(`#${this.props.containerId} #genMsdOpenIcon`).attr(
					"aria-label",
					`${this.ariaPre}close${this.ariaPost}`
				);
			}
		};

		const updateMaxSelections = () => {
			const countOfCurrentSelections = this.props.options.filter((p) => p.selected).length;
			if (this.props.maxSelections && this.props.maxSelections === countOfCurrentSelections) {
				$(`#${this.props.containerId} #maxSelectionsInfo`).show();
				$(`#${this.props.containerId} #genMsdSelections`).hide();
				return;
			}
			if (this.props.maxSelections) {
				$(`#${this.props.containerId} #maxSelectionsInfo`).show();
				$(`#${this.props.containerId} #genMsdSelections`).show();
				return;
			}
			$(`#${this.props.containerId} #maxSelectionsInfo`).hide();
			$(`#${this.props.containerId} #genMsdSelections`).show();
		};

		// Remove from selected list
		$(document)
			.off("click keydown", `#${this.props.containerId} .genMsdDeleteIcon`)
			.on("click", `#${this.props.containerId} .genMsdDeleteIcon`, (e) => {
				this.removeFromSelections($(e.target).data("val"));
			})
			.on("keydown", `#${this.props.containerId} .genMsdDeleteIcon`, (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					const countOfCurrentSelections = this.props.options.filter((p) => p.selected).length;
					if (countOfCurrentSelections === 1) return;
					this.removeFromSelections($(e.target).data("val"));
				}
			});

		// Clear all selections
		$(document)
			.off("click keydown", `#${this.props.containerId} .genMsdClearAll`)
			.on("click keydown", `#${this.props.containerId} .genMsdClearAll`, (e) => {
				e.stopPropagation();
				if (e.type === "click" || (e.type === "keydown" && e.key === "Enter")) this.#clearAllSelections();
			});

		// Select top N
		$(document)
			.off("click keydown", `#${this.props.containerId} .genMsdSelectTopN`)
			.on("click keydown", `#${this.props.containerId} .genMsdSelectTopN`, (e) => {
				if (e.type === "click" || (e.type === "keydown" && e.key === "Enter")) {
					this.updateSliderDomain();
					setTimeout(() => this.resetToDefaultSelections(), 50);
				}
			});

		// Add to selected list
		$(document)
			.off("click keydown", `#${this.props.containerId} .genMsdUnselected li`)
			.on("click", `#${this.props.containerId} .genMsdUnselected li`, (e) => {
				const { classList } = e.target;
				if (classList.contains("genMsdClearAll") || classList.contains("genMsdSelectTopN")) return;
				e.stopPropagation();
				this.#addToSelections($(e.target).data("val"));
			})
			.on("keydown", `#${this.props.containerId} .genMsdUnselected li`, (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					const countOfCurrentSelections = this.props.options.filter((p) => p.selected).length;
					if (this.props.maxSelections && this.props.maxSelections === countOfCurrentSelections) return;
					this.#addToSelections($(e.target).data("val"));
					if ($`#${this.props.containerId} .genMsdOpened`.length) {
						// if (this.props.maxSelections)
						// 	$(`#${this.props.containerId} .genMsdSelectTopN li:visible:first`).focus();
						// else $(`#${this.props.containerId} #genMsdSelections li:visible:first`).focus();
						$(`#${this.props.containerId} .genMsdAdd:visible:first`).focus();
					}
				} else if (closeKeys.includes(e.which))
					$(`#${this.props.containerId} .genMsdOpened`).removeClass("genMsdOpened");
			});

		// Search
		$(document)
			.off("keyup focus click", `#${this.props.containerId} .genMsdSearch`)
			.on("keyup", `#${this.props.containerId} .genMsdSearch`, (e) => {
				this.searchText = $(e.target).val().toLowerCase();
				if (closeKeys.includes(e.which) && $(`#${this.props.containerId} .genMsdOpened`).length) {
					// close keys pressed and dropdown is open
					// console.log("closeKeys.includes(e.which)", closeKeys.includes(e.which));
					if (e.which === 27 && this.searchText.length) {
						// clear search text on ESC
						console.log("e.which === 27", e.which === 27);
						this.searchText = "";
						$(e.target).val(this.searchText);
					} else if (!this.searchText.length) {
						// close dropdown on ESC or Backspace or Delete when search text is empty
						$(`#${this.props.containerId} .genMsdOpened`).removeClass("genMsdOpened");
						$(`#${this.props.containerId} #genMsdOpenIcon`).attr(
							"aria-label",
							`${this.ariaPre}open${this.ariaPost}`
						);
					}
				} else {
					// if user is typing in search box, open dropdown
					$(`#${this.props.containerId} .genMsdUnselected`).addClass("genMsdOpened");
					$(`#${this.props.containerId} .genMsdSelected`).addClass("genMsdOpened");
					$(`#${this.props.containerId} #genMsdOpenIcon`).attr(
						"aria-label",
						`${this.ariaPre}close${this.ariaPost}`
					);
				}
				// show only the filtered list of options
				$(`#${this.props.containerId} .genMsdUnselected li`).each((i, el) => {
					if (el.innerText.toLowerCase().includes(this.searchText)) {
						$(el).show();
					} else {
						$(el).hide();
					}
				});
			})
			.on("click", `#${this.props.containerId} .genMsdSearch`, (e) => e.stopPropagation())
			.on("focus", `#${this.props.containerId} .genMsdSearch`, (e) => {
				e.stopPropagation();
				updateMaxSelections();
				$(`#${this.props.containerId} .genMsdUnselected`).addClass("genMsdOpened");
				$(`#${this.props.containerId} .genMsdSelected`).addClass("genMsdOpened");
				$(".genMsdSearch").val("");
			});
	}

	#clearAllSelections() {
		const currentlySelected = this.props.options.filter((s) => s.selected);
		currentlySelected.forEach((s) => {
			s.selected = false;
		});
		this.#updateDropdown();
		currentlySelected.forEach((s) => {
			this.tabAddRemove.remove(s.value);
		});
	}

	#updateDropdown() {
		this.updateSliderDomain();
		const selected = this.props.options.filter((s) => s.selected);
		const unselected = this.props.options.filter((s) => !s.selected);

		const atMax = selected.length === this.props.maxSelections || unselected.length === 0;
		const leaveOpen = !atMax && $(".genMsdOpened").length > 0;
		const hasMaxSelections = this.props.maxSelections && this.props.maxSelections > 0;
		$(`#${this.props.containerId}`).html(populate(selected, unselected, hasMaxSelections, leaveOpen));

		if (hasMaxSelections) {
			$(`#${this.props.containerId} .genMsdUnselected`).prepend(
				`<ul id="maxSelectionsInfo">
					<li class="placeholder">Max ${this.props.maxSelections} selections</li>					
					<li role="button" class="genMsdSelectTopN" tabindex="0">Select top ${this.props.maxSelections}</li>
					<li role="button" class="genMsdClearAll" tabindex="0">Clear Selections</li>
				</ul>`
			);
		}

		this.updateDropdownPosition();
	}

	#addToSelections(value) {
		this.props.options.find((o) => o.value === value).selected = true;
		this.#updateDropdown();
		this.tabAddRemove.add(value);
	}

	removeFromSelections(value) {
		this.props.options.find((o) => o.value === value).selected = false;
		this.#updateDropdown();
		this.tabAddRemove.remove(value);
	}

	updateDropdownPosition() {
		const selectedHeight = $(`#${this.props.containerId} .genMsdSelected`).height();
		$(".genMsdUnselected").css("top", selectedHeight + 4);
	}
}
