/**
 * `Windows` platform using `Microsoft Edge WebDriver`.
 * @packageDocumentation
 * @module webview2
 */

import {Capabilities} from "selenium-webdriver";
import * as edge from "selenium-webdriver/edge.js"

/**
 * Capabilities for `webview2`.
 */
class Options extends edge.Options {
    /**
     * Mimics the `selenium-webdriver` way of constructing the object.
     */
    constructor(other?: Capabilities | Map<string, any> | object) {
        super(other);
        this.useWebView(true)
    }

}

export {
    Options,
}
