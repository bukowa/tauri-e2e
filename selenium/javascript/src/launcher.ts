/**
 * Launcher manages the spawning and cleanup of the `WebDriver` process based on the platform.
 *
 * @module launcher
 * @packageDocumentation
 * @document ../examples/launcher.md
 */
import path from 'node:path';
import {readdirSync} from 'node:fs';
import {spawn, ChildProcess} from 'node:child_process';
import {SpawnOptions} from 'node:child_process';
import {logger} from "./logger.js";

/**
 * Configures spawn options based on the operating system.
 * On `Linux` we can utilise the `detached` option to
 * later properly kill the WebDriver process using its
 * process group. On `Windows` the proper way to kill the
 * WebDriver is to call selenium `driver.quit()`.
 */
function spawnOptionsForPlatform(): SpawnOptions {
    switch (process.platform) {
        case 'win32':
            return {
                stdio: [null, 'pipe', 'pipe'],
                detached: false,
            };
        case 'linux':
            return {
                stdio: [null, 'pipe', 'pipe'],
                detached: true,
            };
        default:
            throw new Error(`Unsupported platform: ${process.platform}`);
    }
}

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
async function spawnWebDriver(opts: {
    path?: string,
    args?: string[],
    spawnOpts?: SpawnOptions,
    pathSearchFn?: () => string
    setupExitHandlers?: boolean,
}): Promise<ChildProcess> {

    opts.args =
        opts.args || [];

    opts.spawnOpts =
        opts.spawnOpts || spawnOptionsForPlatform();

    opts.setupExitHandlers =
        opts.setupExitHandlers ?? true;

    let lookupFn = opts.pathSearchFn || (() => {
        /**
         * Search for the WebDriver binary based on the platform.
         */
        switch (process.platform) {

            case 'win32':
                process.env.PATH?.split(":").reverse().forEach((p) => {
                    logger.debug(`Searching for msedgedriver`, {
                        "path": p,
                    });

                    readdirSync(p).forEach((f) => {
                        if (f === 'msedgedriver.exe') {
                            let fullPath = path.resolve(p, f);
                            logger.debug(`Found msedgedriver`, {
                                "path": fullPath,
                            })

                            return fullPath;
                        }
                    });

                });
                return 'msedgedriver';

            case 'linux':
                return '/usr/bin/WebKitWebDriver'

            default:
                throw new Error(`Unsupported platform: ${process.platform}`);

        }
    });

    /**
     * Determine the WebDriver binary path.
     */
    const binaryPath = opts.path || process.env.Tauri_WEBDRIVER_BINARY || lookupFn();
    if (!binaryPath) {
        throw new Error('Could not find WebDriver binary');
    }

    /**
     * Environment variable has priority over the host and port.
     */
    if (process.env.SELENIUM_REMOTE_URL) {
        /**
         * Extract the host and port.
         */
        logger.debug(`Using remote WebDriver from env`, {
            "SELENIUM_REMOTE_URL": process.env.SELENIUM_REMOTE_URL,
        });

        const url = new URL(process.env.SELENIUM_REMOTE_URL);
        opts.args.push(`--host=${url.hostname}`);
        opts.args.push(`--port=${url.port}`);
    }

    logger.info(`Spawning WebDriver`, {
        "path": binaryPath,
        "args": opts.args,
        "spawnOpts": opts.spawnOpts,
    });

    // spawn the WebDriver process
    const child = spawn(binaryPath, opts.args, opts.spawnOpts);

    // make sure we only kill the process once
    let killed = false;

    child?.on('exit', (code, signal) => {
        killed = true;
        logger.info('WebDriver process exited', {
            "code": code,
            "signal": signal,
        })
    });

    child.stdout?.on('data', (data) => {
        logger.debug(data.toString());
    });

    child.stderr?.on('data', (data) => {
        logger.debug(data.toString());
    });

    let killProcess = () => {
        if (killed) {
            return;
        }

        if (!child.pid) {
            logger.info('WebDriver process has no PID')
            return;
        }

        if (child.exitCode !== null) {
            logger.info('WebDriver process already exited', {
                "exitCode": child.exitCode,
            })
            killed = true;
            return;
        }

        const signal = 'SIGTERM'
        logger.info('Killing WebDriver process', {
            "pid": child.pid,
            "signal": signal,
        })

        let result: boolean;
        switch (process.platform) {
            case 'win32':
                // https://github.com/nodejs/node/issues/51766
                result = process.kill(child.pid)
                break;
            case 'linux':
                switch (opts.spawnOpts?.detached) {
                    case true:
                        // kill process group
                        result = process.kill(-child.pid, signal)
                        break;
                    case false:
                        result = process.kill(child.pid, signal)
                        break;
                    default:
                        throw new Error(`Unsupported spawnOpts.detached: ${opts.spawnOpts?.detached}`);
                }
                break;
            default:
                throw new Error(`Unsupported platform: ${process.platform}`);
        }

        // result is probably always true
        console.log('Killed WebDriver process', {
            "result": result,
        })
        killed = result;
    }

    let logProcessEvent = (event: string) => {
        logger.info(`Process event received`, {
            "event": event,
        });
    }

    if (opts.setupExitHandlers) {
        logger.debug('Setting up exit handlers');

        process.on('exit', () => {
            logProcessEvent('exit')
            killProcess();
        });

        process.on('SIGINT', () => {
            logProcessEvent('SIGINT');
            killProcess();
        })

        process.on('SIGTERM', () => {
            logProcessEvent('SIGTERM');
            killProcess();
        })

        process.on('uncaughtExceptionMonitor', () => {
            logProcessEvent('uncaughtExceptionMonitor');
            killProcess();
        });

    }

    return child;
}

export {
    spawnWebDriver,
}
