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

const populate = (selected, unselected, searchText, disabled, leaveOpen = false) => {
	const selectedHtmlList = [];
	selected.forEach((o, i) =>
		selectedHtmlList.push(`
			<div class="genMsdOption" style="display: flex; flex-direction: row; flex-grow: 1; min-width: calc(50% - 4px); justify-content: space-between;" role="option">
				<div class="genMsdIgnoreClick" style="white-space: initial">${o.text}</div>
				<i id="genMsdDelete${i}" data-val="${o.value}" class="genMsdDeleteIcon genMsdDelete fas fa-times" type="button" aria-label="click, press enter, or shift enter, to remove ${o.text} from the list" tabindex="0"></i>
			</div>
			`)
	);

	const unselectedHtmlList = [];
	unselected.forEach((o, i) =>
		unselectedHtmlList.push(
			`<div id="genMsdUnselected${i}" class="genMsdAdd" data-val="${o.value}" aria-label="${
				o.text
			}, press enter to add to selected, escape to exit dropdown">
				<input
					id="genMsdUnselectedInput${i}"
					for="genMsdUnselected${i}"
					class="genMsdUnselectedInput"
					type="checkbox"
					style="pointer-events: none; margin-right: 5px;"
					${o.selected ? "checked" : ""}
					data-val="${o.value}"/><label for="genMsdUnselectedInput${i}" style="pointer-events: none; display: inline;">${
				o.text
			}</label>
			</div>`
		)
	);

	return `		
		<div style="display: flex; justify-content: center"><label id="maxAllowedLabel" style="color: transparent" for="groupDropdown-select">The maximum allowed is 7.</label></div>
		<div class="genMsdSelected ${leaveOpen ? "genDropdownOpened " : ""} ${disabled ? "disabled" : ""}">
			<div id="genMsdTitle" class="${
				disabled ? "disabled" : ""
			}" style="width: 100%" tabindex="0" aria-label="filter by subgroup dropdown">${
		disabled ? "N/A" : "Select Subgroups"
	}</div>
			<input 	type="text"
					class="genMsdSearch ${leaveOpen ? "genDropdownOpened" : ""}"
					placeholder="Search Subgroup List"
					aria-label="search input for items in multiselect dropdown"
					value="${searchText}" />
			<div class="genMsdUnselected ${leaveOpen ? "genDropdownOpened" : ""}">
				<div id="filteredGroup" style="display: flex; flex-direction: row; justify-content: space-between">
					<div id="filteredText" style="padding: 0 5px;">Filtered by:</div>
					<div style="padding: 0 5px; cursor: pointer;"><a class="genMsdClearAll" tabindex="0">Clear all</a></div>
				</div>
				<div style="display: flex; flex-wrap: wrap; justify-content: center;" id="subgroupsSelected">${selectedHtmlList.join(
					""
				)}</div>
				<hr style="margin: 2px;" />
				<div id="subgroupsNotFound" style="text-align: center; padding: 10px; color: #bdbdbd; display: none;">No matching results found </div>
				<div id="genMsdSelections">					
					${unselectedHtmlList.join("")}
				</div>
			</div>
		</div>
	`;
};

const tabEventHandlerLookup = new Map([
	[
		"landingPage",
		{
			add: () => appState.ACTIVE_TAB.renderDataVisualizations(),
			remove: () => appState.ACTIVE_TAB.renderDataVisualizations(),
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
		this.updateSliderDomain = () =>
			appState.ACTIVE_TAB.setCurrentSliderDomain(getCurrentSliderDomain(`#${providedProps.chartContainerId}`));
		this.firstRender = true;
	}

	disable(disabled) {
		const wasDisabled = this.props.disabled;
		this.props.disabled = disabled;
		const countOfCurrentSelections = this.props.options.filter((o) => o.selected).length;
		const title =
			this.firstRender || wasDisabled ? "Select Subgroups" : `Selected Subgroups: ${countOfCurrentSelections}`;
		$("#subgroupDropdown #genMsdTitle").html(disabled ? "N/A" : title);
		$("#subgroupDropdown .genMsdSelected, #subgroupDropdown #genMsdTitle").toggleClass("disabled", disabled);
		this.firstRender = false;
	}

	setMaxSelections(maxSelections) {
		this.props.maxSelections = maxSelections;
		this.#toggleMaxMessage();
	}

	setOptions(options) {
		this.firstRender = true;
		this.props.options = options;
	}

	getSelectedOptionValues() {
		return this.props.options.filter((o) => o.selected).map((o) => o.value);
	}

	render() {
		const closeKeys = [27, 46]; // keys for ESC, Backspace, and Delete
		$(`#${this.props.containerId} #genMsdOpenIcon`).attr("aria-label", `${this.ariaPre}open${this.ariaPost}`);

		this.#updateDropdown();

		const handleOpenOrClose = (e) => {
			e.stopPropagation();
			e.preventDefault();
			if ($(".genDropdownOpened").length) {
				$(".genDropdownOpened").removeClass("genDropdownOpened");
				$(`#${this.props.containerId} #genMsdOpenIcon`).attr(
					"aria-label",
					`${this.ariaPre}open${this.ariaPost}`
				);
			} else {
				$(
					`.genMsdSearch, #${this.props.containerId} .genMsdUnselected, #${this.props.containerId} .genMsdSelected`
				).addClass("genDropdownOpened");
				$(`#${this.props.containerId} #genMsdOpenIcon`).attr(
					"aria-label",
					`${this.ariaPre}close${this.ariaPost}`
				);
			}
		};

		// EVENT HANDLERS
		// Open/Close
		$(document)
			.off("click", `#${this.props.containerId} > .genMsdSelected`)
			.off("keydown", `#${this.props.containerId} #genMsdOpenIcon`)
			.on("click", `#${this.props.containerId} > .genMsdSelected`, (e) => {
				if (e.target.id === "filteredGroup" || e.target.id === "filteredText" || this.props.disabled) return;
				handleOpenOrClose(e);
			})
			.on("keydown", `#${this.props.containerId} #genMsdOpenIcon`, (e) => {
				if (this.props.disabled) return;
				if (e.key === "Enter" || e.key === " ") handleOpenOrClose(e);
			})
			.off("click", ".genMsdIgnoreClick")
			.on("click", ".genMsdIgnoreClick", (e) => e.stopPropagation())
			.off("keydown", `#${this.props.containerId} #genMsdTitle`)
			.on("keydown", `#${this.props.containerId} #genMsdTitle`, (e) => {
				if (this.props.disabled) return;
				if (e.key === "Enter" || e.key === " ") handleOpenOrClose(e);
			});

		// Clear all selections
		$(document)
			.off("click keydown", `#${this.props.containerId} .genMsdClearAll`)
			.on("click keydown", `#${this.props.containerId} .genMsdClearAll`, (e) => {
				e.stopPropagation();
				if (e.type === "click" || (e.type === "keydown" && e.key === "Enter")) this.#clearAllSelections();
			});

		// Remove from selected list via X button
		$(document)
			.off("click keydown", `#${this.props.containerId} .genMsdDeleteIcon`)
			.on("click", `#${this.props.containerId} .genMsdDeleteIcon`, (e) => {
				e.stopPropagation();
				this.#removeFromSelections(e.target);
				this.#toggleMaxMessage();
			})
			.on("keydown", `#${this.props.containerId} .genMsdDeleteIcon`, (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.stopPropagation();
					e.preventDefault();
					this.#removeFromSelections(e.target);
					this.#toggleMaxMessage();
				}
			});

		// Add/Remove to/from selected list
		$(document)
			.off("click", `#${this.props.containerId} .genMsdUnselected`)
			.off("keydown", `#${this.props.containerId} .genMsdUnselected input`)
			.on("click", `#${this.props.containerId} .genMsdUnselected`, (e) => {
				e.stopPropagation();
				const checked = $(e.target).find("input").is(":checked");
				if (checked) {
					this.#removeFromSelections(e.target);
					this.#toggleMaxMessage();
				} else {
					if (this.#toggleMaxMessage()) return;
					this.#addToSelections(e.target);
				}
			})
			.off("click", `#${this.props.containerId} .genMsdUnselectedInput`)
			.on("click", `#${this.props.containerId} .genMsdUnselectedInput`, (e) => {
				// this event only fires when a screen-reader turns a keydown event into a click event
				e.stopPropagation();
				e.preventDefault();
				const checked = $(e.target).is(":checked");
				if (!checked) {
					this.#removeFromSelections(e.target.closest(".genMsdAdd"));
					this.#toggleMaxMessage();
				} else {
					if (this.#toggleMaxMessage()) return;
					this.#addToSelections(e.target.closest(".genMsdAdd"));
				}
			})
			.on("keydown", `#${this.props.containerId} .genMsdUnselectedInput`, (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.stopPropagation();
					e.preventDefault();
					const checked = $(e.target).is(":checked");
					if (checked) {
						this.#removeFromSelections(e.target.closest(".genMsdAdd"));
						this.#toggleMaxMessage();
					} else {
						if (this.#toggleMaxMessage()) return;
						this.#addToSelections(e.target.closest(".genMsdAdd"));
					}
				} else if (closeKeys.includes(e.which))
					$(`#${this.props.containerId} .genDropdownOpened`).removeClass("genDropdownOpened");
			});

		// Search
		$(document)
			.off("keyup focus click", `#${this.props.containerId} .genMsdSearch`)
			.on("keyup", `#${this.props.containerId} .genMsdSearch`, (e) => {
				this.searchText = $(e.target).val().toLowerCase();
				if (closeKeys.includes(e.which) && $(`#${this.props.containerId} .genDropdownOpened`).length) {
					// close keys pressed and dropdown is open
					if (e.which === 27 && this.searchText.length) {
						// clear search text on ESC
						this.searchText = "";
						$(e.target).val(this.searchText);
					} else if (!this.searchText.length) {
						// close dropdown on ESC or Backspace or Delete when search text is empty
						$(`#${this.props.containerId} .genDropdownOpened`).removeClass("genDropdownOpened");
						$(`#${this.props.containerId} #genMsdOpenIcon`).attr(
							"aria-label",
							`${this.ariaPre}open${this.ariaPost}`
						);
					}
				} else
					$(`#${this.props.containerId} #genMsdOpenIcon`).attr(
						"aria-label",
						`${this.ariaPre}close${this.ariaPost}`
					);

				this.#search();
			})
			.on("click", `#${this.props.containerId} .genMsdSearch`, (e) => e.stopPropagation())
			.on("focus", `#${this.props.containerId} .genMsdSearch`, (e) => {
				e.stopPropagation();
				$(".genMsdSearch").val("");
				this.searchText = "";
				this.#search();
			});
	}

	#search() {
		// show only the filtered list of options
		$("#genMsdSelections").show();
		$("#subgroupsNotFound").hide();

		$(`#${this.props.containerId} .genMsdUnselected .genMsdUnselectedInput`).each((i, el) => {
			if ($(el).data("val").toLowerCase().includes(this.searchText)) $(el).closest(".genMsdAdd").show();
			else $(el).closest(".genMsdAdd").hide();

			if ($(`#${this.props.containerId} .genMsdUnselected .genMsdAdd:visible`).length === 0) {
				$("#genMsdSelections").hide();
				$("#subgroupsNotFound").show();
			}
		});
	}

	#toggleMaxMessage() {
		const countOfCurrentSelections = this.props.options.filter((p) => p.selected).length;
		const countOverMax = countOfCurrentSelections - this.props.maxSelections;
		if (this.props.maxSelections && countOverMax >= 0) {
			$("#maxAllowedLabel").css("color", "#b50909");
			$("#subgroupDropdown .genDropdownOpened").removeClass("genDropdownOpened");

			// remove the first checked item, this will loop by causing landing page to re-render chart until max is reached
			if (countOverMax > 0) {
				const el = $(`#${this.props.containerId} .genMsdUnselected .genMsdUnselectedInput:checked:first`);
				this.#removeFromSelections(el);
				$(`#${this.props.containerId} .genDropdownOpened`).removeClass("genDropdownOpened");
			}
			return true;
		}
		$("#maxAllowedLabel").css("color", "transparent");
		return false;
	}

	#clearAllSelections() {
		const currentlySelected = this.props.options.filter((s) => s.selected);
		currentlySelected.forEach((s) => {
			s.selected = false;
		});
		this.#updateDropdown(true);
		currentlySelected.forEach((s) => {
			this.tabAddRemove.remove(s.value);
		});
		$(".genMsdUnselectedInput:first").trigger("focus");
	}

	#updateDropdown(target) {
		const id = target?.id;
		let currentTop, movedTop;
		if (id) currentTop = $(`#${id}`).offset().top;

		const selected = this.props.options.filter((s) => s.selected);
		const unselected = this.props.options;
		$(`#${this.props.containerId}`).html(
			populate(selected, unselected, this.searchText, this.props.disabled, target)
		); // target is treated as a boolean here for leaveOpen
		this.#search();

		const selectedMaxWidth = $("#subgroupsSelected").width();
		$(".genMsdOption").each((i, el) => {
			if ($(el).width() > selectedMaxWidth * 0.49)
				$(el).attr(
					"style",
					"display: flex; flex-direction: row; min-width: calc(50% - 4px); justify-content: space-between; width: 100%"
				);
		});

		this.updateDropdownPosition();
		if (id) {
			let index;
			if (id.startsWith("genMsdDelete")) {
				index = Math.max(0, Number(id.replace("genMsdDelete", "") - 1));
				try {
					movedTop = $(`#genMsdDelete${index}`).offset().top;
					$(`#genMsdDelete${index}`).trigger("focus");
				} catch (e) {
					movedTop = currentTop;
				}
			} else {
				movedTop = $(`#${id}`).offset().top;
				$(`#${id}`).find("input").trigger("focus");
			}

			$("#subgroupDropdown .genMsdUnselected").scrollTop(movedTop - currentTop);
		}
	}

	#addToSelections(target) {
		const value = $(target).data("val");
		this.props.options.find((o) => o.value === value).selected = true;
		this.#updateDropdown(target);
		this.tabAddRemove.add();
	}

	#removeFromSelections(target) {
		const value = $(target).data("val");
		this.props.options.find((o) => o.value === value).selected = false;
		this.#updateDropdown(target);
		this.tabAddRemove.remove();
	}

	updateDropdownPosition() {
		const selectedHeight = $(`#${this.props.containerId} .genMsdSelected`).height();
		const searchHeight = $(`#${this.props.containerId} .genMsdSearch`).height();
		$(".genMsdUnselected").css("top", selectedHeight + searchHeight + 10);
	}
}
