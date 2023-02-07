/* ***************************************************************************************************************************************************************************
	Author: Lincoln Bollschweiler
	Email: rlv1@cdc.org
	Date: Oct 2022

	WARNING: This is used on multiple tabs. For a new implementation of the genDropdown, changes are required in the clickHandlerLookup
	object (ONLY). If you need to make other changes, or have any questions, please reach out to Lincoln via Teams or at the email
	address provided above to liaise/consult.

	REQUIRED html:
		<div id="[your containerId]" class="genDropdown"></div>

	OPTIONAL html (includes a label above the dropdown):
		<div id="[your containerId]" class="genDropdown">
			<label id="[your containerId]-label" for=[your containerId]-select">[Some Label]</label>
		</div>
		NOTE: <label> can be placed outside of dropdown container as well. As long as it has the id="" and for="",
		as described above, it will get the correct aria-label read back by screen-reader software.
		

	CREATING A NEW DROPDOWN INSTANCE:
		this.myDropdown = new GenDropdown({
			containerId: [REQUIRED][your containerId, as described above, in your html],
			chartContainerId: [OPTIONAL][id of a chart that has a date slider tied to dropdown changes],
			ariaLabel: [REQUIRED][text describing what the dropdown changes],
			options: [REQUIRED][array of objects with properties describing the text and value of dropdown options],
			text: [OPTIONAL][property that describes the text of the dropdown options ... leave blank if property is "text"],
			value: [OPTIONAL][property that describes the value of the dropdown options ... leave blank if property is "value"],
			selectedValue: [OPTIONAL][the value of default selection ... leaving blanks assigns 'selected' to the first option],
			firstOptObj: [OPTIONAL object][if used, the first option has a lighter font, indicating a selection has not yet been made; or was later deselected]
			{
				text: [REQUIRED][what to display in first option when no selection has yet been made],
				returnValue: [REQUIRED][value of the first option],
				returnText: [OPTIONAL][text that the dropdown option changes to after it has been selected ... if omitted, text does not change]
			}
		});
		this.myDropdown.render();

		If you don't need to use any public methods (as described below) you can simply instantiate like this: new GenDropdown({params}).render();

	EVENT HANDLER [REQUIRED] ... ADD IT TO THE clickHandlerLookup{} OBJECT:
		Your ACTIVE_TAB needs a function or function-pass-through describing what to do when a dropdown option is changed.
		Add a handle from genDropdown.js to your ACTIVE_TAB like this:
		[your containerId]: (value) => appState.ACTIVE_TAB.[function name found on your ACTIVE_TAB](value),


	PUBLIC METHODS:
		this.myDropdown.render(); wipes out any existing dropdown and creates a new one with provided props passed into the constructor
		
		this.myDropdown.value(); returns currently selected value
		this.myDropdown.value([some-value]); dropdown is updated to [some-value] and triggers change event
		this.myDropdown.value([some-value], false); dropdown is updated to [some-value] but does NOT trigger change event

		this.myDropdown.text(); return text of currently selected value
		
		this.myDropdown.disableDropdown(); disables events from dropdown and shows currently selected value in lighter font
		
		this.myDropdown.enableDropdown(); enables events for dropdown and shows currently selected normal font

		this.myDropdown.disableValues([array of values]); disables values; shows each value in the dropdown with lighter font, unselectable
		
		this.myDropdown.enableValues([array of values]); enables values; shows each value in the dropdown with normal font, selectable
		this.myDropdown.enableValues("all"); enables all values

 *************************************************************************************************************************************************************************** */
import { getCurrentSliderDomain } from "./genTrendsSlider";
import { Utils } from "../../utils/utils";

const populate = (props, mobile) => {
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
		contenteditable=${mobile ? "false" : "true"}
	>
		<a>${selectedHtml}</a>
		<div class="genDropdownOptions">${optionList.join("")}</div>
	</div>
	`;
};

const clickHandlerLookup = {
	topicDropdown: (value) => appState.ACTIVE_TAB.topicDropdownChange(value),
	classificationDropdown: (value) => appState.ACTIVE_TAB.updateClassification(value),
	groupDropdown: (value) => appState.ACTIVE_TAB.updateGroup(value),
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
		this.selectedOptionEl = null;
		this.dropdownSection = `#${providedProps.containerId} .genDropdownOptions`;
		this.listItems = `#${providedProps.containerId} .genDropdownOption`;
		this.selectedOption = `#${providedProps.containerId} .genOptionSelected`;
		this.disabled = false;
		this.isMobile = Utils.isMobile();
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
		$(`#${this.props.containerId}`).append(populate(this.props, this.isMobile));
		this.selectedOptionEl = $(this.selectedOption);
		this.#updateAriaLabel($(`${this.selectedOption} > a`).html());

		if (this.props.firstOptObj) {
			if (this.props.selectedValue === this.props.firstOptObj.returnValue) {
				this.#hideFirst();
			} else this.#showFirst();
		}

		// EVENT HANDLERS
		$(document)
			.off("click", `#${this.props.containerId}-select`)
			.off("click", `#${this.props.containerId}-select > a`)
			.off("keypress keydown", `#${this.props.containerId}`)
			.on("click", `#${this.props.containerId}-select > a`, () => $(`#${this.props.containerId}-select`).focus())
			.on("click", `#${this.props.containerId}-select`, (e) => {
				if (this.disabled) return;
				e.stopPropagation();
				$(`.genDropdownOpened:not('#${this.props.containerId} .genDropdownOpened')`).each((i, el) =>
					this.#closeOtherOpenDropdown(el)
				);
				this.#toggleOpenClose();
			})
			.on("keypress", `#${this.props.containerId}`, (e) => {
				if (this.disabled) return;
				const { key } = e;
				const open = $(this.dropdownSection).hasClass("genDropdownOpened");
				if (key === "Enter" || (key === " " && !open)) {
					e.preventDefault();
					if (open) this.#handleSelectionMade();
					else {
						$(`.genDropdownOpened:not('#${this.props.containerId} .genDropdownOpened')`).each((i, el) =>
							this.#closeOtherOpenDropdown(el)
						);
						this.#toggleOpenClose();
					}
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
	#closeOtherOpenDropdown = (target) => {
		if (!target) return; // this should never happen but just in case
		$(target).find(".genOptionSelected").removeClass("genOptionSelected"); // a hover-over may have selected an option so we need to remove that
		const previouslySelectedText = $(target).parent().find("a").html().trim();
		const children = $(target).find("a");
		children.each((i, el) => {
			if ($(el).html().trim() === previouslySelectedText) {
				$(el).parent().addClass("genOptionSelected"); // reassign the previously selected (before hover-over) option
				return false; // exit the loop
			}
		});
		$(target).removeClass("genDropdownOpened"); // close the dropdown
	};

	// used in conjunction with the contenteditable tag, the setCaret method moves the cursor to the front of the currently selected text
	// seems this only works with native javascript selector syntax
	#setCaret = () => {
		const el = document.querySelector(`#${this.props.containerId} .genDropdownSelected`);
		const range = document.createRange();
		const sel = window.getSelection();

		range.setStart(el.childNodes[0], 0);
		range.collapse(true);

		sel.removeAllRanges();
		sel.addRange(range);
	};

	#scrollIntoView = () => {
		const selectHeight = $(`#${this.props.containerId}-select`)[0].getBoundingClientRect().height;
		const dropdownDims = $(this.dropdownSection)[0].getBoundingClientRect();
		let dropdownHeight = dropdownDims.height;
		let dropdownBottom = dropdownDims.bottom;
		const windowHeight = $(window).height();
		const requiredHeight = dropdownHeight + selectHeight + 50; // 50 is for a label above, which may not exist or follow intended label class
		if (requiredHeight > windowHeight) {
			const newHeight = windowHeight - selectHeight - 50;
			$(this.dropdownSection).css("height", newHeight);
			dropdownBottom = $(this.dropdownSection)[0].getBoundingClientRect().bottom;
		}
		const scrollTop = $(window).scrollTop();
		const scrollDifference = windowHeight - scrollTop;
		if (dropdownBottom > windowHeight) $(window).scrollTop(dropdownBottom - scrollDifference + 20);
	};

	#toggleOpenClose = () => {
		$(this.dropdownSection).toggleClass("genDropdownOpened");
		if (!this.isMobile) this.#setCaret();
		this.#scrollIntoView();
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
		$(`#${this.props.containerId}-select`).focus();
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
