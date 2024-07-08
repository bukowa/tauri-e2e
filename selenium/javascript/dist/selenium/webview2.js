/**
 * `Windows` platform using `Microsoft Edge WebDriver`.
 * @packageDocumentation
 * @module webview2
 */
import * as edge from "selenium-webdriver/edge.js";
/**
 * Capabilities for `webview2`.
 */
class Options extends edge.Options {
    /**
     * Mimics the `selenium-webdriver` way of constructing the object.
     */
    constructor(other) {
        super(other);
        this.useWebView(true);
    }
}
export { Options, };
//# sourceMappingURL=webview2.js.map