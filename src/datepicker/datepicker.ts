import * as au from "../aurelia";

@au.autoinject
@au.customElement("md-datepicker")
export class MdDatePicker {
	constructor(private element: Element) { }

	static id = 0;
	controlId: string = `md-datepicker-${MdDatePicker.id++}`;
	input: HTMLInputElement;
	labelElement: HTMLLabelElement;

	@au.ato.bindable.stringMd
	label: string = "";

	@au.ato.bindable.booleanMd
	inline: boolean;

	@au.ato.bindable.stringMd
	placeholder: string = "";

	@au.ato.bindable.booleanMd({ defaultBindingMode: au.bindingMode.oneTime })
	autoClose: boolean;

	@au.ato.bindable.stringMd({ defaultBindingMode: au.bindingMode.oneTime })
	format: string;

	@au.bindable({ defaultBindingMode: au.bindingMode.oneTime })
	parse: (value: string, format: string) => Date;

	@au.bindable({ defaultBindingMode: au.bindingMode.oneTime })
	defaultDate: Date;

	@au.ato.bindable.booleanMd({ defaultBindingMode: au.bindingMode.oneTime })
	setDefaultDate: boolean;

	@au.ato.bindable.booleanMd({ defaultBindingMode: au.bindingMode.oneTime })
	disableWeekends: boolean;

	@au.bindable({ defaultBindingMode: au.bindingMode.oneTime })
	disableDayFn: (day: Date) => boolean;

	@au.ato.bindable.numberMd({ defaultBindingMode: au.bindingMode.oneTime })
	firstDay: number;

	@au.bindable({ defaultBindingMode: au.bindingMode.oneTime })
	minDate: Date;

	@au.bindable({ defaultBindingMode: au.bindingMode.oneTime })
	maxDate: Date;

	@au.bindable({ defaultBindingMode: au.bindingMode.oneTime })
	yearRange: number | number[];

	@au.ato.bindable.booleanMd({ defaultBindingMode: au.bindingMode.oneTime })
	isRtl: boolean;

	@au.ato.bindable.booleanMd({ defaultBindingMode: au.bindingMode.oneTime })
	showMonthAfterYear: boolean;

	@au.ato.bindable.booleanMd({ defaultBindingMode: au.bindingMode.oneTime })
	showDaysInNextAndPreviousMonths: boolean;

	@au.bindable({ defaultBindingMode: au.bindingMode.oneTime })
	container: Element | string;

	@au.ato.bindable.booleanMd({ defaultBindingMode: au.bindingMode.oneTime })
	showClearBtn: boolean;

	@au.bindable({ defaultBindingMode: au.bindingMode.oneTime })
	i18n: Partial<M.InternationalizationOptions>;

	@au.bindable({ defaultBindingMode: au.bindingMode.oneTime })
	events: string[];

	@au.ato.bindable.booleanMd
	showErrortext: boolean = true;

	@au.ato.bindable.booleanMd
	disabled: boolean = false;

	instance: M.Datepicker;
	validateResults: au.ValidateResult[] = [];
	validationClass: string;

	@au.bindable({ defaultBindingMode: au.bindingMode.twoWay })
	value: Date;
	valueChangedSuppress: boolean;
	valueChanged() {
		if (this.valueChangedSuppress) {
			this.valueChangedSuppress = false;
			au.updateLabel(this.input, this.labelElement);
			return;
		}
		if (!this.instance) {
			return;
		}
		this.instance.setDate(this.value);
		// suppress done handler because setInputValue will trigger it, change value and possibly cause an infinite loop when a date has time components
		this.suppressDone = true;
		this.instance.setInputValue();
		au.updateLabel(this.input, this.labelElement);
	}
	setValue(newValue: Date) {
		if (this.value !== newValue) {
			this.valueChangedSuppress = true;
			this.value = newValue;
		}
	}

	calendarIcon = null;

	attached() {
		if (this.placeholder) {
			this.input.setAttribute("placeholder", this.placeholder);
		}
		let container = typeof this.container === "string" ? document.querySelector(this.container) : this.container;
		let options: Partial<M.DatepickerOptions> = {
			autoClose: this.autoClose,
			format: this.format,
			parse: this.parse,
			defaultDate: this.defaultDate,
			setDefaultDate: this.setDefaultDate,
			disableWeekends: this.disableWeekends,
			disableDayFn: this.disableDayFn,
			firstDay: this.firstDay,
			minDate: this.minDate,
			maxDate: this.maxDate,
			yearRange: this.yearRange,
			isRTL: this.isRtl,
			showMonthAfterYear: this.showMonthAfterYear,
			showDaysInNextAndPreviousMonths: this.showDaysInNextAndPreviousMonths,
			container,
			showClearBtn: this.showClearBtn,
			i18n: this.i18n,
			events: this.events,
			onSelect: selectedDate => au.fireMaterializeEvent(this.element, "select", { selectedDate }),
			onOpen: () => au.fireMaterializeEvent(this.element, "open"),
			onClose: () => au.fireMaterializeEvent(this.element, "close"),
			onDraw: () => au.fireMaterializeEvent(this.element, "draw")
		};
		au.cleanOptions(options);
		this.instance = new M.Datepicker(this.input, options);
		this.instance.el.addEventListener("change", this.done);
		this.element.mdUnrenderValidateResults = this.mdUnrenderValidateResults;
		this.element.mdRenderValidateResults = this.mdRenderValidateResults;
		this.valueChanged();
	}

	suppressDone: boolean;
	done = (e: Event) => {
		// we're only interested in events generated by the widget
		if ((e as any).firedBy !== this.instance) {
			return;
		}
		// stop propagation for widget triggered change to retrigger it later on an the element
		e.stopPropagation();
		if (this.suppressDone) {
			this.suppressDone = false;
			return;
		}
		this.setValue(this.instance.date);
		au.fireEvent(this.element, "blur");
		au.fireEvent(this.element, "change");
	}

	bind() {
		//
	}

	detached() {
		this.instance.destroy();
		this.validateResults = [];
		this.validationClass = undefined;
		this.element.mdUnrenderValidateResults = undefined;
		this.element.mdRenderValidateResults = undefined;
	}

	open() {
		this.instance.open();
	}

	close() {
		this.instance.close();
	}

	mdUnrenderValidateResults = (results: au.ValidateResult[], renderer: au.MaterializeFormValidationRenderer) => {
		this.validateResults = this.validateResults.filter(x => !results.find(y => y.id === x.id));
		this.validationClass = undefined;
	}

	mdRenderValidateResults = (results: au.ValidateResult[], renderer: au.MaterializeFormValidationRenderer) => {
		if (this.showErrortext) {
			this.validateResults.push(...results.filter(x => !x.valid));
		}
		this.validationClass = results.find(x => !x.valid) ? "invalid" : "valid";
	}
}
