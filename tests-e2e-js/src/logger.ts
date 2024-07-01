import * as log4js from "log4js";
import * as webdriver from "./webdriver";
import {E2E_LOG_LEVEL} from "./setup";

// @formatter:off
const logger                = log4js.getLogger("tests-e2e");
const driverStdoutLogger    = log4js.getLogger("driver-stdout");
const driverStderrLogger    = log4js.getLogger("driver-stderr");
const webdriverConfigLogger = log4js.getLogger("webdriver");

logger.level                = E2E_LOG_LEVEL;
driverStderrLogger.level    = E2E_LOG_LEVEL;
driverStdoutLogger.level    = E2E_LOG_LEVEL;
webdriverConfigLogger.level = E2E_LOG_LEVEL;
// @formatter:on

webdriver.setConfigLogger(logger)
webdriver.setDriverLogger({
    stdout: driverStdoutLogger.info.bind(driverStdoutLogger),
    stderr: driverStderrLogger.debug.bind(driverStderrLogger)
})

export {
    logger
}
