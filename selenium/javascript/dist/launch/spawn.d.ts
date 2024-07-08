import { SpawnOptions } from 'node:child_process';
import { ChildProcess } from 'node:child_process';
/**
 * Spawn the WebDriver process providing sane defaults and manages the cleanup if needed.
 * It shall be used before each test suite to ensure the WebDriver process is running.
 * Note: this is optional and opinionated, you can manage the WebDriver process yourself.
 *
 * #### Environment Variables:
 * To override spawning configuration, allowing quick runtime changes:
 *
 * ````
 * TAURI_WEBDRIVER_BINARY: path to the WebDriver binary.
 * SELENIUM_REMOTE_URL: remote selenium server address. Host and port args passed to the WebDriver binary will be extracted from the URL.
 * ````
 *
 * @param opts Options for launching the WebDriver process.
 * @param opts.path Path to the WebDriver binary.
 * @param opts.args Arguments to pass to the WebDriver binary.
 * @param opts.spawnOpts Spawn options for the WebDriver process.
 * @param opts.killOnExit Kill the WebDriver process on exit.
 * @param opts.pathSearchFn Function to search for the WebDriver binary if not provided.
 * @param opts.setupExitHandlers Setup exit handlers to kill the WebDriver process on exit.
 * @return {ChildProcess} - instance of the WebDriver process.
 */
declare function spawnWebDriver(opts?: {
    path?: string;
    args?: string[];
    spawnOpts?: SpawnOptions;
    pathSearchFn?: () => string;
    setupExitHandlers?: boolean;
}): Promise<ChildProcess>;
/**
 * Kill the WebDriver process based on the platform.
 * @param child WebDriver process to kill.
 */
declare function killWebDriver(child: ChildProcess): void;
export { killWebDriver, spawnWebDriver, };
//# sourceMappingURL=spawn.d.ts.map