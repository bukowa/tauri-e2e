/**
 * `Linux` platform using `WebKitWebDriver`.
 * @packageDocumentation
 * @module webkitgtk2
 */
import { Capabilities } from "selenium-webdriver";
/**
 * Capabilities for `webkitgtk2`.
 */
declare class Options extends Capabilities {
    /**
     * Mimics the `selenium-webdriver` way of constructing the object
     * but defines these properties on the class for TypeScript type checking? (help me out here)
     * These properties are properly redefined later on the {@link Options} prototype.
     */
    BROWSER_NAME: string;
    CAPABILITY_KEY: string;
    /**
     * Mimic `selenium-webdriver` way of constructing the object.
     */
    private readonly options_;
    /**
     * Mimic `selenium-webdriver` way of constructing the object.
     */
    constructor(other?: Capabilities | Map<string, any> | {});
    /**
     * Set the binary path.
     * This is not defined on the {@link Capabilities} class.
     * @param path The path to the application binary.
     */
    setBinaryPath(path: string): this;
}
export { Options, };
//# sourceMappingURL=webkitgtk2.d.ts.map