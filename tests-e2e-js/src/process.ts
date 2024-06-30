import {logger} from "./logger"
import * as setup from "./setup"
import {spawn} from "node:child_process";
import {SpawnOptionsWithStdioTuple} from "child_process";
import * as log4js from "log4js";

const processSpawnOptions: SpawnOptionsWithStdioTuple<null, 'pipe', 'pipe'> = {
    stdio: [null, 'pipe', 'pipe'],
    detached: false,
};

function getWebDriverUrl() {
    return `http://${setup.SELENIUM_WEBDRIVER_HOST}:${setup.SELENIUM_WEBDRIVER_PORT}`;
}

function spawnWebKitDriver() {
    // https://trac.webkit.org/wiki/WebKitGTK/Debugging#Loggingsupport
    if (setup.E2E_LOG_LEVEL === 'debug') {
        // `spawn` function default == process.env
        // https://nodejs.org/api/child_process.html#child_processspawncommand-args-options
        process.env.WEBKIT_DEBUG = "all"
    }
    const webDriverArgs = [
        `--host=${setup.SELENIUM_WEBDRIVER_HOST}`,
        `--port=${setup.SELENIUM_WEBDRIVER_PORT}`,
        setup.SELENIUM_WEBDRIVER_PORT
    ]
    logger.debug(
        setup.PATH_WEBDRIVER_BINARY,
        webDriverArgs,
        processSpawnOptions
    )
    return spawn(
        setup.PATH_WEBDRIVER_BINARY,
        webDriverArgs,
        processSpawnOptions
    );
}

function spawnEdgeDriver() {
    const webDriverArgs = [
        // msedgedriver.exe --help missing --host
        `--port=${setup.SELENIUM_WEBDRIVER_PORT}`,
        `--log-level=${setup.SELENIUM_WEBDRIVER_LOG_LEVEL}`
    ]
    logger.warn("Edge driver does not support --host option")
    logger.debug(
        setup.PATH_WEBDRIVER_BINARY,
        webDriverArgs,
        processSpawnOptions
    )
    return spawn(
        setup.PATH_WEBDRIVER_BINARY,
        webDriverArgs,
        processSpawnOptions
    );
}

function logProcessOutput(process: any, loggerCategory: string = 'process') {
    const _loggerStdout = log4js.getLogger(`${loggerCategory}.stdout`);
    const _loggerStderr = log4js.getLogger(`${loggerCategory}.stderr`);
    process.stdout.on('data', (data: any) => {
        _loggerStdout.info(data.toString());
    });
    process.stderr.on('data', (data: any) => {
        _loggerStderr.debug(data.toString());
    });
}

export {
    spawnWebKitDriver,
    spawnEdgeDriver,
    getWebDriverUrl,
    logProcessOutput
}