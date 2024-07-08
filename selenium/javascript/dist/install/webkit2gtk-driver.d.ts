/**
 * Because the WebKitGTK2 driver has to be installed manually,
 * this function just returns the path to the driver.
 * If it doesn't exist, an error is thrown.
 * @param version {string} - The version of the WebKitGTK2 driver.
 * @param toPath {string} - The path to the WebKitGTK2 driver.
 * @throws {Error} - If the WebKitGTK2 driver is not found.
 * @returns {Promise<string>} - The path to the WebKitGTK2 driver.
 */
declare function installWebKitGtk2Driver(version?: string, toPath?: string): Promise<string>;
export { installWebKitGtk2Driver };
//# sourceMappingURL=webkit2gtk-driver.d.ts.map