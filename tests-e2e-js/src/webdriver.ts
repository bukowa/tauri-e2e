import * as os from "node:os";
import {ChildProcess, spawn} from "node:child_process";
import {SpawnOptionsWithStdioTuple} from "child_process";
import {Capabilities, WebDriver} from "selenium-webdriver";


//**
// * Type representing the logger methods.
// */
type ConfigLogger = {
    info: (message: string, ...args: any[]) => void;
    debug: (message: string, ...args: any[]) => void;
    error: (message: string, ...args: any[]) => void;
    warn: (message: string, ...args: any[]) => void;
    level?: string | any;
}

/**
 * Logger for application configuration.
 * Users can override these methods.
 */
let configLogger: ConfigLogger = {
    info: (message: string, ...args: any[]) => {
    },
    debug: (message: string, ...args: any[]) => {
    },
    error: (message: string, ...args: any[]) => {
    },
    warn: (message: string, ...args: any[]) => {
    },
    level: 'info',
};

// **
// * Set the logger for the configuration.
// */
function setConfigLogger(logger: ConfigLogger) {
    configLogger = logger
}

//**
// * Type representing the logger methods.
// */
type DriverLogger = {
    stdout: (message: string, ...args: any[]) => void;
    stderr: (message: string, ...args: any[]) => void;
}

/**
 * Logger for the WebDriver process output.
 * Users can override these methods.
 */
let driverLogger: DriverLogger = {
    stdout: (message: string, ...args: any[]) => {
    },
    stderr: (message: string, ...args: any[]) => {
    },
};

// **
// * Set the logger for the WebDriver process output.
// */
function setDriverLogger(logger: DriverLogger) {
    driverLogger = logger
}

/**
 * Constant representing the default driver type based on the operating system.
 */
const SYSTEM_DEFAULT_DRIVER: DriverType =
    os.platform() === 'win32' ? 'msedgedriver' : 'WebKitWebDriver';

/**
 * Type representing the possible driver types.
 */
type DriverType = 'WebKitWebDriver' | 'msedgedriver';

/**
 * Spawn options used when starting the WebDriver process.
 */
type SpawnOptions = SpawnOptionsWithStdioTuple<null, 'pipe', 'pipe'>;

/**
 * Function allowing to configure the spawn options.
 */
type SpawnOptionsConfigurator = (driverType: DriverType, options: SpawnOptions) => SpawnOptions;

/**
 * Configure the spawn options based on the operating system.
 * Provides sane defaults for the spawn options while
 * allowing to extend them with additional configurators.
 * On Linux we can utilise the `detached` option to
 * later properly kill the WebDriver process using its
 * process group.
 */
function configureSpawnOptions(driverType: DriverType, configurators?: SpawnOptionsConfigurator[]): SpawnOptions {
    let options: SpawnOptions;

    switch (os.platform()) {
        case 'win32':
            options = {
                stdio: [null, 'pipe', 'pipe'],
                detached: false,
            };
            break;
        default:
            options = {
                stdio: [null, 'pipe', 'pipe'],
                detached: true,
            };
            break;
    }

    for (const configurator of configurators ?? []) {
        options = configurator(driverType, options);
    }

    return options;
}

// **
// * Serialize the WebDriver capabilities for logging purposes.
// */
function serializeCapabilities(capabilities: Capabilities): Record<string, string> {
    let caps: Record<string, string> = {};
    for (let key of capabilities.keys()) {
        caps[key] = capabilities.get(key);
    }
    return caps;
}

/**
 * Function allowing to configure
 * additional capabilities for the WebDriver.
 */
type CapabilitiesConfigurator = (driverType: DriverType, capabilities: Capabilities) => Capabilities;

// **
// * Configure the WebDriver capabilities based on the driver type.
// * Provide sane defaults for the WebDriver capabilities while
// * allowing to extend them with additional configurators.
// */
function configureCapabilities(opts: {
    binary: string,
    driverType?: DriverType,
    configurators?: CapabilitiesConfigurator[]
}): Capabilities {

    opts.driverType = opts.driverType ?? SYSTEM_DEFAULT_DRIVER;

    let capabilities = new Capabilities();

    switch (opts.driverType) {
        case 'WebKitWebDriver':
            capabilities.setBrowserName('wry');
            capabilities.set('webkitgtk:browserOptions', {
                binary: opts.binary,
                args: ['--automation'],
            });
            break;
        case 'msedgedriver':
            capabilities.setBrowserName('webview2');
            capabilities.set('ms:edgeOptions', {
                binary: opts.binary,
                webviewOptions: {},
                args: [],
            });
            break;
    }

    for (const configurator of opts.configurators ?? []) {
        capabilities = configurator(opts.driverType, capabilities);
    }

    return capabilities;
}

// **
// * Function allowing to configure
// * arguments for spawning the WebDriver process.
// */
type SpawnArgsConfigurator = (driverType: DriverType, args: string[]) => string[];

// **
// * Default configurator for logging.
// */
function configureLoggingArgs(logLevel: string): SpawnArgsConfigurator {

    logLevel = logLevel.toLowerCase();
    if (!['debug', 'info', 'warn', 'error'].includes(logLevel)) {
        throw new Error(`Invalid log level: ${logLevel}`);
    }

    return (driverType: DriverType, args: string[]) => {
        switch (driverType) {
            // https://trac.webkit.org/wiki/WebKitGTK/Debugging
            case 'WebKitWebDriver':
                if (logLevel === 'debug') {
                    process.env.WEBKIT_DEBUG = "all";
                }
                break;
            case 'msedgedriver':
                // requires uppercase log level
                args.push(`--log-level=${logLevel.toUpperCase()}`);
                break;
        }
        return args;
    }
}

// **
// * Default configurator for the host.
// */
function configureHostArgs(driverHost: string): SpawnArgsConfigurator {
    return (driverType: DriverType, args: string[]) => {
        switch (driverType) {
            case 'WebKitWebDriver':
                args.push(`--host=${driverHost}`);
                break;
            case 'msedgedriver':
                break;
        }
        return args;
    }
}

// **
// * Default configurator for the port.
// */
function configurePortArgs(driverPort: string): SpawnArgsConfigurator {
    return (driverType: DriverType, args: string[]) => {
        switch (driverType) {
            case 'WebKitWebDriver':
                args.push(`--port=${driverPort}`);
                break;
            case 'msedgedriver':
                args.push(`--port=${driverPort}`);
                break;
        }
        return args;
    }
}

/**
 * Starts the appropriate WebDriver process.
 * @param opts - Options for spawning the WebDriver process.
 * @param opts.driverPath - The path to the WebDriver binary.
 * @param opts.driverHost - The host that the WebDriver should listen on.
 * @param opts.driverPort - The port that the WebDriver should listen on.
 * @param opts.driverType - The type of the driver ('WebKitWebDriver' or 'msedgedriver').
 * @param opts.spawnOptions - (Optional) The spawn options to use when starting the WebDriver.
 * @param opts.configurators - (Optional) Additional configurators for the spawn options.
 * @returns The spawned WebDriver process.
 */
function spawnWebDriver(opts: {
    driverPath: string,
    driverType?: DriverType,
    spawnOptions?: SpawnOptions,
    spawnArgsConfigurators?: SpawnArgsConfigurator[],
}): ChildProcess {

    opts.driverType = opts.driverType ?? SYSTEM_DEFAULT_DRIVER;
    opts.spawnOptions = opts.spawnOptions ?? configureSpawnOptions(opts.driverType);

    let webDriver: ChildProcess;
    let spawnArgs: string[] = [];

    for (const configurator of opts.spawnArgsConfigurators ?? []) {
        spawnArgs = configurator(opts.driverType, spawnArgs);
    }

    configLogger.info(
        'Spawning WebDriver', {
            driverType: opts.driverType,
            driverPath: opts.driverPath,
            spawnArgs: spawnArgs,
            spawnOptions: opts.spawnOptions,
            spawnArgsConfigurators: opts.spawnArgsConfigurators,
        },
    )

    webDriver = spawn(
        opts.driverPath,
        spawnArgs,
        opts.spawnOptions
    );

    webDriver.stdout?.on('data', (data) => {
        // @ts-ignore
        driverLogger.stdout('', {data: data.toString()});
    });

    webDriver.stderr?.on('data', (data) => {
        driverLogger.stderr('', {data: data.toString()});
    });

    webDriver.on('close', (code) => {
        configLogger.info(`${opts.driverPath}`, {
            message: `WebDriver process exited`,
            exitCode: code,
        });
    });

    configLogger.info(
        `WebDriver spawned`,
        {
            webDriverPid: webDriver.pid,
            webDriverObj: (configLogger.level?.toString().toLowerCase() === 'debug' ? webDriver : undefined),
        }
    )
    return webDriver;
}

// **
// * Cleanup the WebDriver process.
// * Sane defaults for killing the WebDriver process
// * based on the operating system.
// */
async function cleanup(driver: WebDriver, webDriver: ChildProcess) {
    if (os.platform() === 'win32') {
        // msedgedriver likes it
        await driver.quit();
    } else {
        // webkitgtk likes it
        // @ts-ignore
        process.kill(-webDriver.pid);
    }
}

export {
    setConfigLogger,
    setDriverLogger,

    DriverType,
    SYSTEM_DEFAULT_DRIVER,

    SpawnOptions,
    SpawnOptionsConfigurator,
    configureSpawnOptions,

    serializeCapabilities,
    CapabilitiesConfigurator,
    configureCapabilities,

    SpawnArgsConfigurator,
    configureHostArgs,
    configurePortArgs,
    configureLoggingArgs,
    spawnWebDriver,
    cleanup,
}