import * as selenium from "selenium-webdriver";
declare const PLATFORM: {
    LINUX: string;
    WINDOWS: string;
};
declare const WEBVIEW: {
    WEBKITGTK2: string;
    WEBVIEW2: string;
};
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
declare function optionsForPlatform(platform?: string, webview?: string): selenium.Capabilities;
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
declare class Builder {
    /**
     * Selenium builder.
     */
    builder_: selenium.Builder;
    /**
     * Builds driver with current configuration.
     * @returns {@link selenium.WebDriver}.
     */
    build(): selenium.WebDriver;
    /**
     * Resolves the binary path.
     * Strip the `.exe` extension if the platform is not `win32`.
     * Can be extended to support more advanced logic.
     * @param binaryPath The path to the tauri binary.
     * @returns The resolved binary path.
     */
    resolveBinaryPath(binaryPath?: string): string | undefined;
    /**
     * Resolves the remote server address.
     * Can be extended to support more advanced logic.
     * @param remoteUrl The remote server address.
     * @returns The resolved remote server address.
     */
    resolveRemoteUrl(remoteUrl?: string): string | undefined;
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
    constructor();
    /**
     * Builder for the tauri binary.
     * @param binaryPath The path to the tauri binary.
     */
    forBinary(binaryPath?: string): Builder;
    /**
     * Set the binary path for the driver.
     * @param builder The selenium builder.
     * @param binaryPath The path to the tauri binary.
     */
    setBinaryPath(binaryPath?: string): void;
}
export { optionsForPlatform, Builder, PLATFORM, WEBVIEW, };
//# sourceMappingURL=wry.d.ts.map