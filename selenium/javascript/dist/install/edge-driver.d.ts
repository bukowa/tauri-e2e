/**
 * This script downloads the Edge driver for Selenium.
 * It handles the download, extraction, and caching of the Edge driver.
 * @packageDocumentation
 */
/**
 * Download the Edge driver.
 * @param version {string} - The version of the Edge driver.
 * @param toPath {string} - The path to download the Edge driver to.
 * @returns {Promise<string>} - The path to the Edge driver executable.
 */
declare function installEdgeDriver(version?: string, toPath?: string): Promise<string>;
/**
 * Get the version of the Edge driver.
 * @returns {string} - The version of the Edge driver.
 */
declare function getEdgeVersion(): string;
export { getEdgeVersion, installEdgeDriver };
//# sourceMappingURL=edge-driver.d.ts.map