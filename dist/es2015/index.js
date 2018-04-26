// the following two imports are needed for consumer TS projects
// without them types will not be found
import "./augmentation/element";
import "./augmentation/materialize";
import { ConfigBuilder } from "./config-builder";
import { ScrollfirePatch } from "./scrollfire/scrollfire-patch";
import { polyfillElementClosest } from "./common/polyfills";
import { usePropertyTypeForBindable, usePropertyTypeForObservable } from "aurelia-typed-observable-plugin";
function applyPolyfills() {
    polyfillElementClosest();
}
export function configure(frameworkConfiguration, configCallback) {
    applyPolyfills();
    var builder = frameworkConfiguration.container.get(ConfigBuilder);
    if (configCallback !== undefined && typeof (configCallback) === "function") {
        configCallback(builder);
    }
    if (builder.useGlobalResources) {
        frameworkConfiguration.globalResources(builder.globalResources);
    }
    if (builder.useScrollfirePatch) {
        new ScrollfirePatch().patch();
    }
    usePropertyTypeForBindable(true);
    usePropertyTypeForObservable(true);
}
// build-index-remove start
export * from "./exports";
// build-index-remove end
//# sourceMappingURL=index.js.map