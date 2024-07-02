/**
 * Cache directory for `WebDriver` executables.
 * @packageDocumentation
 */

import findCacheDirectory from "find-cache-dir";

import {logger} from "../logger/logger.js";
import * as metadata from "../metadata/index.js";

/**
 * Directory for the cache of WebDriver executables.
 */
const CACHE_DIR = findCacheDirectory({name: metadata.PACKAGE_NAME});

// Log a warning if the cache directory could not be determined
if (!CACHE_DIR) {
    logger.warn("Could not determine cache directory.");
}

export {
    CACHE_DIR
}
