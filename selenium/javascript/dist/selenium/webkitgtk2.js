/**
 * `Linux` platform using `WebKitWebDriver`.
 * @packageDocumentation
 * @module webkitgtk2
 */
import { Capabilities } from "selenium-webdriver";
/**
 * The name of the browser.
 */
const WEBKITGTK2_BROWSER_NAME = 'wry';
/**
 * The key for the capability.
 */
const WEBKITGTK2_CAPABILITY_KEY = 'webkitgtk:browserOptions';
/**
 * Capabilities for `webkitgtk2`.
 */
class Options extends Capabilities {
    /**
     * Mimics the `selenium-webdriver` way of constructing the object
     * but defines these properties on the class for TypeScript type checking? (help me out here)
     * These properties are properly redefined later on the {@link Options} prototype.
     */
    BROWSER_NAME = WEBKITGTK2_BROWSER_NAME;
    CAPABILITY_KEY = WEBKITGTK2_CAPABILITY_KEY;
    /**
     * Mimic `selenium-webdriver` way of constructing the object.
     */
    options_;
    /**
     * Mimic `selenium-webdriver` way of constructing the object.
     */
    constructor(other) {
        super(other);
        this.options_ = this.get(this.CAPABILITY_KEY) || {
            args: ["--automation"],
            "useOverlayScrollbars": true,
        };
        this.setBrowserName(WEBKITGTK2_BROWSER_NAME);
        this.set(this.CAPABILITY_KEY, this.options_);
    }
    /**
     * Set the binary path.
     * This is not defined on the {@link Capabilities} class.
     * @param path The path to the application binary.
     */
    setBinaryPath(path) {
        this.options_.binary = path;
        return this;
    }
}
Options.prototype.BROWSER_NAME = WEBKITGTK2_BROWSER_NAME;
Options.prototype.CAPABILITY_KEY = WEBKITGTK2_CAPABILITY_KEY;
export { Options, };
//# sourceMappingURL=webkitgtk2.js.map