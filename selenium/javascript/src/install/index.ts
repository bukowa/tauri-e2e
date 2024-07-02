/**
 * Entry point for install module.
 * @packageDocumentation
 */
import {installWebKitGtk2Driver as WebKitGtk2Driver} from "./webkit2gtk-driver.js";
import {installEdgeDriver as EdgeDriver} from "./edge-driver.js";

/**
 * Installs the appropriate WebDriver for the current platform.
 * @constructor
 */
async function PlatformDriver(): Promise<string> {
    switch (process.platform) {
        case 'win32':
            return await EdgeDriver()
        case 'linux':
            return WebKitGtk2Driver()
        default:
            throw new Error(`Unsupported platform: ${process.platform}`);
    }
}

export {
    PlatformDriver,
    EdgeDriver,
    WebKitGtk2Driver
}
