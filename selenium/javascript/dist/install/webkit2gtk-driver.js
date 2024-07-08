/**
 * This script is a dummy script for the WebKitGTK driver for Selenium.
 */
import * as fs from "node:fs";
/**
 * Default path to the WebKitGTK2 driver.
 */
let WEBKITGTK2_DRIVER_PATH = '/usr/bin/WebKitWebDriver';
/**
 * Because the WebKitGTK2 driver has to be installed manually,
 * this function just returns the path to the driver.
 * If it doesn't exist, an error is thrown.
 * @param version {string} - The version of the WebKitGTK2 driver.
 * @param toPath {string} - The path to the WebKitGTK2 driver.
 * @throws {Error} - If the WebKitGTK2 driver is not found.
 * @returns {Promise<string>} - The path to the WebKitGTK2 driver.
 */
async function installWebKitGtk2Driver(version, toPath) {
    return new Promise((resolve, reject) => {
        // handle default path
        toPath = toPath || WEBKITGTK2_DRIVER_PATH;
        // if file doesn't exist, throw error
        if (!fs.existsSync(toPath)) {
            return reject(new Error(`WebKitGTK driver not found at ${toPath} try installing it manually with 'sudo apt-get install webkit2gtk-driver'`));
        }
        return resolve(toPath);
    });
}
export { installWebKitGtk2Driver };
//# sourceMappingURL=webkit2gtk-driver.js.map