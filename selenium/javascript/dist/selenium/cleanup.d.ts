/**
 * Module for cleaning up the Selenium environment.
 */
import * as selenium from 'selenium-webdriver';
/**
 * Cleans up the Selenium environment based on the platform.
 * @param driver The WebDriver instance to clean up.
 */
declare function cleanupSession(driver: selenium.WebDriver): Promise<void>;
export { cleanupSession };
//# sourceMappingURL=cleanup.d.ts.map