/**
 * Cleans up the Selenium environment based on the platform.
 * @param driver The WebDriver instance to clean up.
 */
async function cleanupSession(driver) {
    switch (process.platform) {
        case "win32":
            await driver.close();
            await driver.quit();
            break;
        case "linux":
            // - https://github.com/tauri-apps/wry/pull/1311/files
            await driver.close();
            break;
    }
}
export { cleanupSession };
//# sourceMappingURL=cleanup.js.map