import * as tslib_1 from "tslib";
import { customAttribute, autoinject } from "aurelia-framework";
import { bindable } from "aurelia-typed-observable-plugin";
var MdTooltip = /** @class */ (function () {
    function MdTooltip(element) {
        this.element = element;
        this.position = "bottom";
        this.delay = 50;
        this.text = "";
    }
    MdTooltip.prototype.textChanged = function () {
        this.initTooltip();
    };
    MdTooltip.prototype.attached = function () {
        this.initTooltip();
    };
    MdTooltip.prototype.detached = function () {
        this.instance.destroy();
    };
    MdTooltip.prototype.initTooltip = function () {
        this.instance = new M.Tooltip(this.element, { exitDelay: this.delay, html: this.text, position: this.position });
    };
    tslib_1.__decorate([
        bindable,
        tslib_1.__metadata("design:type", String)
    ], MdTooltip.prototype, "position", void 0);
    tslib_1.__decorate([
        bindable,
        tslib_1.__metadata("design:type", Number)
    ], MdTooltip.prototype, "delay", void 0);
    tslib_1.__decorate([
        bindable,
        tslib_1.__metadata("design:type", String)
    ], MdTooltip.prototype, "text", void 0);
    MdTooltip = tslib_1.__decorate([
        customAttribute("md-tooltip"),
        autoinject,
        tslib_1.__metadata("design:paramtypes", [Element])
    ], MdTooltip);
    return MdTooltip;
}());
export { MdTooltip };
//# sourceMappingURL=tooltip.js.map