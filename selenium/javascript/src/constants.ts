/**
 * Constants for the package.
 * @packageDocumentation
 * @module constants
 */
import findCacheDirectory from "find-cache-dir";
import {logger} from "./logger.js";

/**
 * Version of the package.
 */
const VERSION = "0.1.0-alpha.1"

/**
 * Name of the package.
 */
const PACKAGE_NAME = "@tauri-e2e/selenium"

/**
 * Directory for the cache of WebDriver executables.
 */
const CACHE_DIR = findCacheDirectory({name: PACKAGE_NAME});

// Log a warning if the cache directory could not be determined
if (!CACHE_DIR) {
    logger.warn("Could not determine cache directory.");
}

export {
    VERSION,
    PACKAGE_NAME,
    CACHE_DIR,
}
