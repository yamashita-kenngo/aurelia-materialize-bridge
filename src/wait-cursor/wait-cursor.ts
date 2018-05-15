﻿import * as au from "../aurelia";

@au.customAttribute("md-wait-cursor")
@au.autoinject
export class MdWaitCursorCustomAttribute {
	constructor(private element: Element, private templatingEngine: au.TemplatingEngine) { }

	progress: HTMLElement;

	value: boolean;
	valueChanged(newVal: boolean) {
		if (newVal && this.trResizeDelegate) {
			this.trResizeDelegate();
		}
	}
	trResizeDelegate: () => any;

	attached() {
		switch (this.element.tagName) {
			case "MD-INPUT": this.attachedMdInput(); break;
			case "BUTTON": this.attachedButton(); break;
			case "LI": this.attachedLi(); break;
			case "TR": this.attachedTr(); break;
		}
	}

	attachedMdInput() {
		const inputField = this.element.querySelector(".input-field");
		if (!inputField) {
			return;
		}

		this.progress = document.createElement("div");
		this.progress.innerHTML = "<md-progress type='circular' size='small' show.bind='value' style='position: absolute; left: 100%; transform: translateX(-100%);'></md-progress>";
		this.progress = this.progress.firstElementChild as HTMLElement;

		inputField.insertAdjacentElement("afterbegin", this.progress);
		const view = this.templatingEngine.enhance(this.progress);
		view.bind(this);
		view.attached();
	}

	attachedButton() {
		this.progress = document.createElement("div");
		this.progress.innerHTML =
			"<div show.bind='value' style='position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.7; background: white; z-index: 98;'></div>" +
			"<md-progress type='circular' size='small' show.bind='value' style='position: absolute; left: 50%; top: 50%; height: 36px; transform: translateX(-50%) translateY(-50%); z-index: 99;'></md-progress>";
		this.progress.style.position = "relative";
		this.progress.style.display = "inline-block";
		this.progress.classList.add("button-wait-cursor-wrapper");
		this.element.insertAdjacentElement("beforebegin", this.progress);
		const view = this.templatingEngine.enhance(this.progress);
		view.bind(this);
		view.attached();
		this.progress.appendChild(this.element);
	}

	attachedLi() {
		this.progress = document.createElement("div");
		this.progress.innerHTML =
			"<div show.bind='value' style='position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.7; background: white; z-index: 98; overflow: hidden;'>" +
			"<md-progress type='circular' size='small' show.bind='value' style='position: absolute; left: 50%; top: 50%; height: 36px; transform: translateX(-50%) translateY(-50%); z-index: 99;'></md-progress>" +
			"</div>";
		this.progress = this.progress.firstElementChild as HTMLElement;
		let view = this.templatingEngine.enhance(this.progress);
		view.bind(this);
		view.attached();
		this.element.appendChild(this.progress);
	}

	attachedTr() {
		let tr = this.element as HTMLTableRowElement;
		let firstTd = this.element.firstElementChild;
		this.progress = document.createElement("div");
		this.progress.innerHTML =
			"<div show.bind='value'>" +
			"<div style='opacity: 0.7; background: white; width: 100%; height: 100%;'></div>" +
			"<md-progress type='circular' size='small' style='position: absolute; left: 50%; top: 50%; height: 36px; transform: translateX(-50%) translateY(-50%);'></md-progress>" +
			"</div>";
		this.progress = this.progress.firstChild as HTMLDivElement;
		this.trResizeDelegate = () => {
			if (!this.value) {
				return;
			}
			this.progress.style.position = "absolute";
			this.progress.style.top = `${tr.offsetTop}px`;
			this.progress.style.left = `${tr.offsetLeft + tr.parentElement.scrollLeft}px`;
			this.progress.style.width = `${tr.offsetWidth}px`;
			this.progress.style.height = `${tr.offsetHeight}px`;
		};
		let view = this.templatingEngine.enhance(this.progress);
		view.bind(this);
		view.attached();
		this.trResizeDelegate();
		window.addEventListener("resize", this.trResizeDelegate);
		this.progress.onclick = (ev) => { ev.cancelBubble = true; };
		firstTd.appendChild(this.progress);
	}

	detached() {
		if (this.progress) {
			this.progress.remove();
		}
		if (this.trResizeDelegate) {
			window.removeEventListener("resize", this.trResizeDelegate);
			this.trResizeDelegate = null;
		}
	}
}