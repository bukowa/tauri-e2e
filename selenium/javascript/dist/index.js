/**
 * Entry point for the `@tauri-e2e/selenium` package.
 *
 * @packageDocumentation
 * @module @tauri-e2e/selenium
 */
import * as selenium from './selenium/index.js';
import * as install from './install/index.js';
import * as launch from './launch/index.js';
import * as logger from './logger/index.js';
// noinspection ES6PreferShortImport
import { setLogger } from './logger/index.js';
// required for WebKitWebDriver;
// otherwise throws "Failed to match Capabilities"
process.env.TAURI_WEBVIEW_AUTOMATION = 'true';
export { selenium, install, launch, logger, setLogger, };
//# sourceMappingURL=index.js.map