/* *************************************************************************************
  Author: Lincoln Bollschweiler
  Email: rlv1@cdc.org
  Date: Oct 2022

  This component requires the following html to be in place in your template

   <div id="[your choice of id, passed in with constructor as 'containerId']"></div>

   DESCRIPTION FOR PROVIDED
	props {
		tabName: "you will have to add it to the tabSelectionHandlerLookup", REQUIRED
		chartContainerId: "this is used to handle slider domain change registration", NOT REQUIRED
		containerId "matching div in you html config where the dropdown gets rendered", REQUIRED
		options: [ REQUIRED
			{
				text: "what is displayed", REQUIRED
				value: text or number which is applied "<option value='HERE' />",REQUIRED				
			}
		],
		selectedValue: "the 'value' of default selection",
		firstOptObj, // what to show in dropdown before a selection is made which disappears after selecting a dropdown item UNLESS it has a returnValue
   }

   WARNING: This is used on multiple tabs. If you need to make changes and have any questions, please reach out to Lincoln
   via Teams or at the email address provided above to liaise/consult.

 ************************************************************************************* */
import { getCurrentSliderDomain } from "./genTrendsSlider";

const populate = (props) => {
	const optionList = [];
	let selected = props.options.find((o) => o[props.value] === props.selectedValue);
	if (!selected) {
		if (props.firstOptObj) {
			selected = { [props.text]: props.firstOptObj.text, [props.value]: props.selectedValue };
			props.options.unshift(selected);
		} else {
			selected = props.options[0];
		}
	}

	const selectedHtml = selected[props.text];
	props.options.forEach((o) =>
		optionList.push(`
			<div class="genDropdownOption ${o[props.value] === selected[props.value] ? "genOptionSelected" : ""}"
				data-val="${o[props.value]}"
				role="option"				
				aria-label="${o[props.text].trim()}"
				tabindex="0"
			>
				<a>${o[props.text].trim()}</a>
			</div>
		`)
	);

	return `
	<div
		id="${props.containerId}-select"
		class="genDropdownSelected"
		tabindex="0"
		role="listbox"		
		aria-labelledby="${props.containerId}-label"
	>
		<a>${selectedHtml}</a>
		<div class="genDropdownOptions">${optionList.join("")}</div>
	</div>
	`;
};

const clickHandlerLookup = {
	topicDropdown: (value) => appState.ACTIVE_TAB.topicDropdownChange(value),
	classificationDropdown: (value) => appState.ACTIVE_TAB.updateSubtopic(value),
	groupDropdown: (value) => appState.ACTIVE_TAB.updateCharacteristic(value),
	startYearContainer: (value) => appState.ACTIVE_TAB.updateStartPeriod(value),
	endYearContainer: (value) => appState.ACTIVE_TAB.updateEndPeriod(value),
};

export class GenDropdown {
	constructor(providedProps) {
		this.props = providedProps;
		this.props.text = providedProps.text ?? "text";
		this.props.value = providedProps.value ?? "value";
		this.selectionMadeAction = clickHandlerLookup[providedProps.containerId];
		this.updateSliderDomain = () =>
			appState.ACTIVE_TAB.setCurrentSliderDomain(getCurrentSliderDomain(`#${providedProps.chartContainerId}`));
		this.searchText = "";
		this.selectedEl = null;
		this.selectedOptionEl = null;
		this.dropdownSection = `#${providedProps.containerId} .genDropdownOptions`;
		this.listItems = `#${providedProps.containerId} .genDropdownOption`;
		this.selectedOption = `#${providedProps.containerId} .genOptionSelected`;
		this.disabled = false;
	}

	// ///////////////////////////////////////////// //
	// 				PUBLIC METHODS					 //
	// ///////////////////////////////////////////// //

	// Either (a) GET with .value()
	//        (b) SET current selection
	//			 (1) trigger the change event(default, just pass .value([some value]) or
	//			 (2) only update what is shown in the dropdown, pass .value([some value], false)
	value = (value, triggerChange = true) => {
		if (!value && value !== "") return $(this.selectedOption).data("val");
		$(this.selectedOption).removeClass("genOptionSelected");
		const newSelection = $(`${this.listItems}[data-val="${value}"]`);
		$(newSelection).addClass("genOptionSelected");
		if (triggerChange) this.#handleSelectionMade(false);
		else {
			const newText = $(newSelection).html()?.trim();
			$(`#${this.props.containerId} .genDropdownSelected`).html(newText);
		}
	};

	// get the text for the dropdown option currently selected
	text = () => $(`${this.selectedOption} > a`).html();

	render = () => {
		$(`#${this.props.containerId}-select`).remove();
		$(`#${this.props.containerId}`).append(populate(this.props));
		this.selectedOptionEl = $(this.selectedOption);
		this.#updateAriaLabel($(`${this.selectedOption} > a`).html());
		const selectedHeight = $(`#${this.props.containerId} .genMsdSelected`).height();
		$(".genDropdownOptions").css("top", selectedHeight + 4);

		if (this.props.firstOptObj) {
			if (this.props.selectedValue === this.props.firstOptObj.returnValue) {
				this.#hideFirst();
			} else this.#showFirst();
		}

		// EVENT HANDLERS
		$(document)
			.off("click keypress keydown", `#${this.props.containerId}-select`)
			.off("click", `#${this.props.containerId} > a`)
			.on("click", `#${this.props.containerId}-select > a`, () => $(`#${this.props.containerId}-select`).focus())
			.on("click", `#${this.props.containerId}-select`, (e) => {
				if (this.disabled) return;
				e.stopPropagation();
				this.#toggleOpenClose();
			})
			.on("keypress", `#${this.props.containerId}`, (e) => {
				if (this.disabled) return;
				const { key } = e;
				const open = $(this.dropdownSection).hasClass("genDropdownOpened");
				if (key === "Enter" || (key === " " && !open)) {
					e.preventDefault();
					if (open) this.#handleSelectionMade();
					else this.#toggleOpenClose();
				} else if (key === " " && !this.searchText.length) {
					e.preventDefault();
					this.#toggleOpenClose();
				} else {
					if (!open) this.#toggleOpenClose();
					e.preventDefault();
					this.#search(key);
				}
			})
			.on("keydown", `#${this.props.containerId}`, (e) => {
				if (this.disabled) return;
				const { key } = e;
				const open = $(this.dropdownSection).hasClass("genDropdownOpened");
				if (key === "Backspace" && open) {
					this.searchText = this.searchText.slice(0, -1);
					if (!this.searchText.length) {
						this.#resetOptions();
						this.#toggleOpenClose();
					} else this.#search();
				} else if (key === "Delete" || key === "Escape") {
					if (this.searchText.length) {
						this.searchText = "";
						this.#resetOptions();
					} else if (open) this.#toggleOpenClose();
				} else if (key === "ArrowDown" || key === "ArrowUp") {
					e.preventDefault();
					const currentSelected = $(this.selectedOption);
					const selector = open ? ":visible" : "";
					const previous = $(currentSelected).prevAll(selector).not(".disabled").first();
					const next = $(currentSelected).nextAll(selector).not(".disabled").first();
					const dropdown = $(".genDropdownOptions");
					const dropdownDims = $(dropdown)[0].getBoundingClientRect();

					if (key === "ArrowUp" && previous.length) {
						$(currentSelected).removeClass("genOptionSelected");
						$(previous).addClass("genOptionSelected");
						if (!open) this.#handleSelectionMade(false);
						else {
							const { top } = $(previous)[0].getBoundingClientRect();
							const scrollTop = $(dropdown).scrollTop();
							if (top < dropdownDims.top)
								$(dropdown).scrollTop(scrollTop - dropdownDims.bottom + top + 40);
							$(previous).focus();
						}
					} else if (key === "ArrowDown" && next.length) {
						$(currentSelected).removeClass("genOptionSelected");
						$(next).addClass("genOptionSelected");
						if (!open) this.#handleSelectionMade(false);
						else {
							const { bottom } = $(next)[0].getBoundingClientRect();
							const scrollTop = $(dropdown).scrollTop();
							if (bottom > dropdownDims.bottom)
								$(dropdown).scrollTop(bottom - dropdownDims.top + scrollTop - 40);
							$(next).focus();
						}
					}
				}
			})
			.off("mouseenter focus", this.listItems)
			.on("mouseenter focus", this.listItems, (e) => {
				$(this.listItems).removeClass("genOptionSelected");
				$(e.currentTarget).addClass("genOptionSelected");
			});

		// Handle Selection Made
		$(document)
			.off("click keydown", `${this.dropdownSection} .genDropdownOption`)
			.on("click keydown", `${this.dropdownSection} .genDropdownOption`, (e) => {
				if (e.type === "click" || (e.type === "keydown" && (e.key === "Enter" || e.key === " "))) {
					e.stopPropagation();
					e.preventDefault();
					this.#handleSelectionMade();
				}
			});
	};

	disableDropdown = () => {
		this.disabled = true;
		$(`#${this.props.containerId} .genDropdownSelected`).addClass("disabled");
	};

	enableDropdown = () => {
		this.disabled = false;
		$(`#${this.props.containerId} .genDropdownSelected`).removeClass("disabled");
	};

	// Takes an array of string containing dropdown values to add the class "disabled" to
	// If the currently selected value is in the list, the dropdown will select the first value in the list
	// Caveat - if the first value in the list is the one to be disabled this will break
	disableValues = (values) => {
		const currentSelected = $(this.selectedOption).data("val");
		if (values.includes(currentSelected)) {
			$(currentSelected).removeClass("genOptionSelected");
			$(`${this.listItems}:first`).addClass("genOptionSelected").trigger("click");
			this.#toggleOpenClose();
		}
		values.forEach((v) => $(`${this.listItems}[data-val="${v}"]`).addClass("disabled"));
	};

	// takes an array of string containing dropdown values to remove the class "disabled" from
	enableValues = (values) => {
		if (values === "all") $(this.listItems).removeClass("disabled");
		else values.forEach((v) => $(`${this.listItems}[data-val="${v}"]`).removeClass("disabled"));
	};

	// ///////////////////////////////////////////// //
	// 				PRIVATE METHODS					 //
	// ///////////////////////////////////////////// //

	#toggleOpenClose = () => {
		$(this.dropdownSection).toggleClass("genDropdownOpened");
		$(`#${this.props.containerId} .genMsdSelected`).toggleClass("genDropdownOpened");
	};

	#updateAriaLabel = (text) => {
		$(`#${this.props.containerId}-label`).attr(
			"aria-label",
			`${this.props.ariaLabel}, currently selected is ${text}`
		);
	};

	#handleSelectionMade = (toggle = true) => {
		this.searchText = "";
		this.selectedOptionEl = $(this.selectedOption);
		const text = $(`${this.selectedOption} > a`).html().trim();
		const value = $(this.selectedOptionEl).data("val").toString();
		$(`#${this.props.containerId}-select > a`).html(text);
		$(".genDropdownOption").attr("hidden", false);
		const firstOption = this.props.firstOptObj;
		if (firstOption)
			if (firstOption.returnValue === value) this.#hideFirst();
			else this.#showFirst();
		if (toggle) this.#toggleOpenClose();
		if (this.props.chartContainerId) this.updateSliderDomain();
		this.#updateAriaLabel(text);
		this.selectionMadeAction(value);
		$(`#${this.props.containerId}-select`).focus();
	};

	#resetOptions = () => {
		$(this.listItems).removeClass("genOptionSelected").attr("hidden", false);
		const html = $(this.selectedOptionEl).find("a").html();
		$(`#${this.props.containerId}-select > a`).html(html);
		$(this.selectedOptionEl).addClass("genOptionSelected");
	};

	#search = (c) => {
		this.searchText += c ?? "";
		const lowercaseSearch = this.searchText.toLowerCase();
		let matchIndex;
		if (this.searchText.length) {
			$(this.listItems).each((i, item) => {
				const html = $(item).find("a").html();
				if (
					html.toLowerCase().includes(lowercaseSearch) &&
					!$(item).hasClass("disabled") &&
					$(item).css("display") === "block"
				) {
					$(item).attr("hidden", false);
					matchIndex = html.toLowerCase().indexOf(lowercaseSearch);
					const matchingText = html.slice(matchIndex, matchIndex + this.searchText.length);
					const remaining = html.split(matchingText);
					$(`#${this.props.containerId}-select > a`).html(`
							<span>${remaining[0]}</span><span style="font-weight: bold;">${this.searchText}</span><span>${remaining[1]}</span>
						`);
				} else $(item).attr("hidden", true);

				const selected = $(this.selectedOption);
				if ($(selected).is(":hidden")) {
					$(selected).removeClass("genOptionSelected");
					$(`#${this.props.containerId}`)
						.find(".genDropdownOption:visible:first")
						.addClass("genOptionSelected")
						.focus();
				}
			});
		}
		if (matchIndex === undefined) {
			$(`#${this.props.containerId}-select > a`).html(
				`<span style="font-weight: bold;">${this.searchText}</span>`
			);
			$(`#${this.props.containerId}-select`).focus();
		}
	};

	#hideFirst = () => {
		const first = this.props.firstOptObj;
		const firstEl = $(`${this.listItems}:first`);
		$(`#${this.props.containerId}-select > a`).addClass("placeholder").html(first.text);
		$(firstEl).html(`<a>${first.text}</a>`).hide();
	};

	#showFirst = () => {
		const first = this.props.firstOptObj;
		const firstEl = $(`${this.listItems}:first`);
		$(`#${this.props.containerId}-select > a`).removeClass("placeholder");
		if (first.returnText) $(firstEl).html(`<a>${first.returnText}</a>`);
		$(firstEl).show();
	};
}
