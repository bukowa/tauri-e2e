import {Builder, Capabilities, until, WebDriver} from "selenium-webdriver";
import {logger} from "./logger"
import {getWebDriverUrl, logProcessOutput, spawnEdgeDriver, spawnWebKitDriver} from "./process";
import {before, describe, test} from "node:test";
import * as os from "node:os";
import * as setup from "./setup"
import {ChildProcess} from "node:child_process";
import assert from "node:assert";

logger.debug(setup)


describe("Tauri E2E tests", async () => {
    let driver: WebDriver;
    let driverProcess: ChildProcess;

    test("should log hello world", async () => {
        logger.info("Hello world")
    })

    test("Send hello world to input", async () => {
        logger.info("Sending hello world to input")
        await driver.findElement({css: 'input[id="greet-input"]'}).sendKeys('Hello World');
        logger.info("Clicking submit button")
        await driver.findElement({css: 'button[type="Submit"]'}).click();
        // sleep for 2 seconds to allow the greet message to be displayed
        logger.info("Waiting 2sec to allow greet message to be displayed")
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const text = await driver.findElement({css: 'p[id="greet-msg"]'}).getText()
        logger.info("Text found", {text: text})
        assert(text === "Hello, Hello World! You've been greeted from Rust!")
    });

    before(async () => {
        const capabilities = new Capabilities();

        switch (os.platform()) {
            case 'win32':

                capabilities.setBrowserName('webview2');
                capabilities.set('ms:edgeOptions', {
                    binary: setup.PATH_TEST_BINARY,
                    webviewOptions: {},
                    args: []
                })
                logger.info("Starting Edge driver")
                driverProcess = spawnEdgeDriver()

                break;
            default:

                capabilities.setBrowserName('wry');
                capabilities.set('webkitgtk:browserOptions', {
                    binary: setup.PATH_TEST_BINARY,
                    args: [
                        '--automation'
                    ]
                })
                logger.info("Starting WebKit driver")
                driverProcess = spawnWebKitDriver()

                break;
        }

        logProcessOutput(driverProcess, 'driverProcess')
        driverProcess.on('exit', (code) => {
            logger.info(`WebDriver exited with code: ${code}`);
        });

        process.on('exit', (code) => {
            logger.info(`Exit: ${code}, killing webDriverProcess`)
            driverProcess.kill()
        })

        // todo use something better than a sleep
        // we can read stdout from msedge
        // sleep for 10 seconds to allow the driver to start
        await new Promise((resolve) => setTimeout(resolve, 10000));

        logger.info("Creating driver with", {capabilities: capabilities})
        driver = await new Builder()
            .withCapabilities(capabilities)
            .usingServer(getWebDriverUrl())
            .build()

        logger.info("Driver created", {driver: driver})

        process.on('exit', async (code) => {
            logger.info(`Exit: ${code}, killing driver`)
            await driver.quit()
        });

        logger.info("Waiting for body element")
        await driver.wait(until.elementLocated({css: 'body'}), setup.TESTS_TIMEOUT);
        logger.info("Body element found")
    });
});
