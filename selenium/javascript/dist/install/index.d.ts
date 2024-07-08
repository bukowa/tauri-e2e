/**
 * Entry point for install module.
 * @packageDocumentation
 */
import { installWebKitGtk2Driver as WebKitGtk2Driver } from "./webkit2gtk-driver.js";
import { installEdgeDriver as EdgeDriver } from "./edge-driver.js";
/**
 * Installs the appropriate WebDriver for the current platform.
 * @constructor
 */
declare function PlatformDriver(): Promise<string>;
export { PlatformDriver, EdgeDriver, WebKitGtk2Driver };
//# sourceMappingURL=index.d.ts.map