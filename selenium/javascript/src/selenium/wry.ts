import * as selenium from "selenium-webdriver";

import * as webkitgtk2 from "./webkitgtk2.js";
import * as webview2 from "./webview2.js";
import {logger} from "../logger/logger.js";

const PLATFORM = {
    LINUX: "Linux",
    WINDOWS: "Windows",
}

const WEBVIEW = {
    WEBKITGTK2: "webkitgtk2",
    WEBVIEW2: "webview2",
}

/**
 * Returns the capabilities for the platform.
 * If the platform is not provided, it will be inferred from the current process.
 * If the webview is not provided, it will be inferred from the platform.

 * @example
 * ```typescript
 * // Get capabilities for the current platform
 * let capabilities = capabilitiesForPlatform();
 *
 * // Get capabilities for specific platform
 * let capabilities = capabilitiesForPlatform("Linux");
 * let capabilities = capabilitiesForPlatform("Windows");
 *
 * // Get capabilities for specific platform and webview
 * let capabilities = capabilitiesForPlatform("Linux", "webkitgtk2");
 * let capabilities = capabilitiesForPlatform("Windows", "webview2");
 * ```
 *
 * @param platform The platform to get capabilities for.
 * @param webview The webview to get capabilities for.
 * @throws Error if the platform or webview is not supported.
 */
function optionsForPlatform(platform?: string, webview?: string): selenium.Capabilities {

    if (platform === undefined) {
        switch (process.platform) {
            case "linux":
                platform = PLATFORM.LINUX;
                break;
            case "win32":
                platform = PLATFORM.WINDOWS;
                break;
        }
    }

    if (webview === undefined) {
        switch (platform) {
            case PLATFORM.LINUX:
                webview = WEBVIEW.WEBKITGTK2;
                break;
            case PLATFORM.WINDOWS:
                webview = WEBVIEW.WEBVIEW2;
                break;
        }
    }

    switch (platform) {
        case PLATFORM.LINUX:
            switch (webview) {
                case WEBVIEW.WEBKITGTK2:
                    return new webkitgtk2.Options();
            }
            break;
        case PLATFORM.WINDOWS:
            switch (webview) {
                case WEBVIEW.WEBVIEW2:
                    return new webview2.Options();
            }
            break;
    }

    throw new Error(`Unsupported platform/browser: ${platform}/${webview}`);
}


/**
 * Wrapper around {@link selenium.Builder} for creating {@link selenium.WebDriver}.
 * Exposes a fluent interface for setting the binary path and building the driver.
 *
 * #### Environment Variables:
 * To override builders' configuration, allowing quick runtime changes:
 *
 * ````
 *  TAURI_SELENIUM_BINARY: path to the tauri application binary.
 *  SELENIUM_REMOTE_URL: remote selenium server address.
 * ````
 *
 *   @example
 *  ```javascript
 *  process.env.TAURI_SELENIUM_BINARY = '../../../target/debug/tauri-app.exe';
 *  process.env.SELENIUM_REMOTE_URL = 'http://127.0.0.1:4674';
 *
 *  let builder = new Builder().build();
 *  ```
 */
class Builder {

    /**
     * Selenium builder.
     */
    builder_: selenium.Builder;

    /**
     * Builds driver with current configuration.
     * @returns {@link selenium.WebDriver}.
     */
    build(): selenium.WebDriver {
        return this.builder_.build();
    }

    /**
     * Resolves the binary path.
     * Strip the `.exe` extension if the platform is not `win32`.
     * Can be extended to support more advanced logic.
     * @param binaryPath The path to the tauri binary.
     * @returns The resolved binary path.
     */
    resolveBinaryPath(binaryPath?: string): string | undefined {

        // override if environment variable is set
        binaryPath = process.env.TAURI_SELENIUM_BINARY || binaryPath;

        // try to strip exe if we are not on windows
        if (process.platform !== "win32" && binaryPath?.endsWith(".exe")) {
            binaryPath = binaryPath.slice(0, -4);
        }

        return binaryPath;
    }

    /**
     * Resolves the remote server address.
     * Can be extended to support more advanced logic.
     * @param remoteUrl The remote server address.
     * @returns The resolved remote server address.
     */
    resolveRemoteUrl(remoteUrl?: string): string | undefined {
        return process.env.SELENIUM_REMOTE_URL || remoteUrl;
    }

    /**
     * Saved during construction.
     * @private
     */
    private readonly CAPABILITY_KEY;

    /**
     * Creates new {@link Builder} for the current platform.
     * Looks for `SELENIUM_REMOTE_URL` environment variable to override the server address.
     * Looks for `TAURI_SELENIUM_BINARY` environment variable to override the binary path.
     */
    constructor() {
        logger.debug('Creating new Builder.')

        // create new selenium builder
        this.builder_ = new selenium.Builder()

        // get capabilities for the current platform
        let capabilities = optionsForPlatform();

        // set capability key
        this.CAPABILITY_KEY = Object.getPrototypeOf(capabilities).CAPABILITY_KEY;

        // set capabilities
        this.builder_ = this.builder_
            .withCapabilities(capabilities);

        // resolve remote url
        let remoteUrl = this.resolveRemoteUrl();
        if (remoteUrl) {
            logger.debug('Using remote server address.', {
                url: remoteUrl
            });
            this.builder_ = this.builder_.usingServer(remoteUrl);
        }

        // resolve binary path
        let binaryPath = this.resolveBinaryPath();
        if (binaryPath) {
            logger.debug('Using binary path.', {
                binary: binaryPath
            });
            this.setBinaryPath(binaryPath)
        }

        logger.debug('Using capabilities.', {
            capabilities: this.builder_.getCapabilities()
        });
    }

    /**
     * Builder for the tauri binary.
     * @param binaryPath The path to the tauri binary.
     */
    forBinary(binaryPath?: string): Builder {
        this.setBinaryPath(this.resolveBinaryPath(binaryPath));
        return this;
    }

    /**
     * Set the binary path for the driver.
     * @param builder The selenium builder.
     * @param binaryPath The path to the tauri binary.
     */
    setBinaryPath(binaryPath?: string) {

        // get capabilities
        let capabilities = this.builder_.getCapabilities();

        // get the capability value
        let value = capabilities.get(this.CAPABILITY_KEY);

        if (value === undefined) {
            logger.error('Capability key not found', {
                key: this.CAPABILITY_KEY,
                capabilities: capabilities
            });
            throw new Error("Capabilities are undefined.");
        }

        value.binary = binaryPath;
        capabilities.set(this.CAPABILITY_KEY, value);

        this.builder_ = this.builder_.withCapabilities(capabilities);
    }
}

export {
    optionsForPlatform,
    Builder,
    PLATFORM,
    WEBVIEW,
}