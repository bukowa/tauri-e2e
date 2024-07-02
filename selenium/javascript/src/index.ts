/**
 * Entry point for the `@tauri-e2e/selenium` package.
 *
 * @packageDocumentation
 * @module @tauri-e2e/selenium
 * @document ../installation.md
 * @document ../examples/quick-start.md
 * @document ../examples/selenium-api.md
 */

import * as logger from './logger.js';
import * as webview2 from './webview2.js';
import * as webkitgtk2 from './webkitgtk2.js';

import {setLogger} from "./logger.js";
import {spawnWebDriver} from "./launcher.js";
import {capabilitiesForPlatform, builderForBinary, PLATFORM, WEBVIEW} from "./wry.js";
import {VERSION, PACKAGE_NAME} from "./constants.js";

// required for WebKitWebDriver;
// otherwise throws "Failed to match Capabilities"
process.env.TAURI_WEBVIEW_AUTOMATION = 'true';

export {
    VERSION,
    PACKAGE_NAME,
    PLATFORM,
    WEBVIEW,
    capabilitiesForPlatform,
    spawnWebDriver,
    builderForBinary,
    setLogger,
    logger,
    webview2,
    webkitgtk2
}
