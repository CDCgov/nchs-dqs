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

const populate = (selected, unselected, disabled, leaveOpen = false) => {
	const selectedHtmlList = [];
	selected.forEach((o) =>
		selectedHtmlList.push(`
			<div class="genMsdOption" style="display: flex; flex-direction: row; min-width: calc(50% - 4px); justify-content: space-between;" role="option">
				<div class="genMsdIgnoreClick" style="white-space: initial">${o.text}</div>
				<i data-val="${o.value}" class="genMsdDeleteIcon genMsdDelete fas fa-times" type="button" aria-label="Click to Remove ${o.text}" tabindex="0"></i>
			</div>
			`)
	);

	const unselectedHtmlList = [];
	unselected.forEach((o, i) =>
		unselectedHtmlList.push(
			`<li id="genMsdUnselected${i}" class="genMsdAdd" data-val="${o.value}" role="button" aria-label="${
				o.text
			}, press enter to add to selected, escape to exit dropdown">
				<input
					type="checkbox"
					style="pointer-events: none; margin-right: 5px;"
					${o.selected ? "checked" : ""}
					data-val="${o.value}"
					tabindex="0" />${o.text}
			</li>`
		)
	);

	return `		
		<div style="display: flex;"><label id="maxAllowedLabel" style="color: transparent; margin: auto;" for="groupDropdown-select">The maximum allowed is 7.</label></div>
		<div class="genMsdSelected ${leaveOpen ? "genMsdOpened " : ""} ${disabled ? "disabled" : ""}">
			<div id="genMsdTitle" class="${disabled ? "disabled" : ""}">${disabled ? "N/A" : "Select Subgroups"}</div>
			<input 	type="text"
					class="genMsdSearch ${leaveOpen ? "genMsdOpened" : ""}"
					placeholder="Search subgroup list"
					aria-label="search input for items in multiselect dropdown" />
			<div class="genMsdUnselected ${leaveOpen ? "genMsdOpened" : ""}">
				<div id="filteredGroup" style="display: flex; flex-direction: row; justify-content: space-between">
					<div id="filteredText" style="padding: 0 5px;">Filtered by:</div>
					<div style="padding: 0 5px; cursor: pointer;"><a class="genMsdClearAll" tabindex="0">Clear all</a></div>
				</div>
				<div style="display: flex; flex-wrap: wrap; justify-content: center;" id="subgroupsSelected">${selectedHtmlList.join(
					""
				)}</div>
				<hr style="margin: 2px;" />
				<div id="subgroupsNotFound" style="text-align: center; padding: 10px; color: #bdbdbd; display: none;">No matching results found </div>
				<ul id="genMsdSelections">					
					${unselectedHtmlList.join("")}
				</ul>
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
	}

	disable(disabled) {
		this.props.disabled = disabled;
		$("#subgroupDropdown #genMsdTitle").html(disabled ? "N/A" : "Select Subgroups");
		$("#subgroupDropdown .genMsdSelected, #subgroupDropdown #genMsdTitle").toggleClass("disabled", disabled);
	}

	setMaxSelections(maxSelections) {
		this.props.maxSelections = maxSelections;
		this.#toggleMaxMessage();
	}

	setOptions(options) {
		this.props.options = options;
	}

	getSelectedOptionValues() {
		return this.props.options.filter((o) => o.selected).map((o) => o.value);
	}

	render() {
		const closeKeys = [27, 46]; // keys for ESC, Backspace, and Delete
		$(`#${this.props.containerId} #genMsdOpenIcon`).attr("aria-label", `${this.ariaPre}open${this.ariaPost}`);

		this.#updateDropdown();

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
			.on("click", ".genMsdIgnoreClick", (e) => e.stopPropagation());

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
				$(
					`.genMsdSearch, #${this.props.containerId} .genMsdUnselected, #${this.props.containerId} .genMsdSelected`
				).addClass("genMsdOpened");
				$(`#${this.props.containerId} #genMsdOpenIcon`).attr(
					"aria-label",
					`${this.ariaPre}close${this.ariaPost}`
				);
			}
		};

		// Remove from selected list
		$(document)
			.off("click keydown", `#${this.props.containerId} .genMsdDeleteIcon`)
			.on("click", `#${this.props.containerId} .genMsdDeleteIcon`, (e) => {
				e.stopPropagation();
				this.#removeFromSelections(e.target);
				this.#toggleMaxMessage();
			})
			.on("keydown", `#${this.props.containerId} .genMsdDeleteIcon`, (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					e.stopPropagation();
					const countOfCurrentSelections = this.props.options.filter((p) => p.selected).length;
					if (countOfCurrentSelections === 1) return;
					this.#removeFromSelections($(e.target).data("val"));
					this.#toggleMaxMessage();
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
				const checked = $(e.currentTarget).find("input").is(":checked");
				if (checked) {
					this.#removeFromSelections(e.target);
					this.#toggleMaxMessage();
				} else {
					if (this.#toggleMaxMessage()) return;
					this.#addToSelections(e.target);
				}
			})
			.on("keydown", `#${this.props.containerId} .genMsdUnselected li`, (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					if (this.#toggleMaxMessage()) return;
					const checked = $(e.currentTarget).find("input").is(":checked");
					if (checked) this.#removeFromSelections($(e.target).data("val"));
					else this.#addToSelections($(e.target).data("val"));
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
					if (e.which === 27 && this.searchText.length) {
						// clear search text on ESC
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
				} else
					$(`#${this.props.containerId} #genMsdOpenIcon`).attr(
						"aria-label",
						`${this.ariaPre}close${this.ariaPost}`
					);

				// show only the filtered list of options
				$("#genMsdSelections").show();
				$("#subgroupsNotFound").hide();

				$(`#${this.props.containerId} .genMsdUnselected li`).each((i, el) => {
					if (el.innerText.toLowerCase().includes(this.searchText)) {
						$(el).show();
					} else {
						$(el).hide();
					}

					if ($(`#${this.props.containerId} .genMsdUnselected li:visible`).length === 0) {
						$("#genMsdSelections").hide();
						$("#subgroupsNotFound").show();
					}
				});
			})
			.on("click", `#${this.props.containerId} .genMsdSearch`, (e) => e.stopPropagation())
			.on("focus", `#${this.props.containerId} .genMsdSearch`, (e) => {
				e.stopPropagation();
				$(".genMsdSearch").val("");
			});
	}

	#toggleMaxMessage() {
		const countOfCurrentSelections = this.props.options.filter((p) => p.selected).length;
		const countOverMax = countOfCurrentSelections - this.props.maxSelections;
		if (this.props.maxSelections && countOverMax >= 0) {
			$("#maxAllowedLabel").css("color", "#b50909");
			$("#subgroupDropdown .genMsdOpened").removeClass("genMsdOpened");

			// remove the first checked item, this will loop by causing landing page to re-render chart until max is reached
			if (countOverMax > 0) {
				const el = $(`#${this.props.containerId} .genMsdUnselected li input:checked:first`);
				this.#removeFromSelections(el);
				$(`#${this.props.containerId} .genMsdOpened`).removeClass("genMsdOpened");
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
		this.#updateDropdown();
		currentlySelected.forEach((s) => {
			this.tabAddRemove.remove(s.value);
		});
	}

	#updateDropdown(target) {
		const id = target?.id;
		let currentTop, movedTop;
		if (id) currentTop = $(`#${id}`).offset().top;

		const selected = this.props.options.filter((s) => s.selected);
		const unselected = this.props.options;
		$(`#${this.props.containerId}`).html(populate(selected, unselected, this.props.disabled, target)); // target is treated as a boolean here for leaveOpen

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
			movedTop = $(`#${id}`).offset().top;
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
