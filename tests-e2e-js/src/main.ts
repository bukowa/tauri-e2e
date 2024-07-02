import {Builder, Capabilities, until, WebDriver} from "selenium-webdriver";
import {afterEach, beforeEach, describe, it, test} from "node:test";
import {ChildProcess} from "node:child_process";
import assert from "node:assert";
import {logger} from "./logger"
import * as setup from "./setup"
import * as webdriver from "./webdriver"

logger.debug(setup)

describe("Tauri E2E tests", async () => {

    let driver: WebDriver;
    let webDriver: ChildProcess;
    let capabilities: Capabilities;

    beforeEach(async () => {

        // Start the WebDriver process
        webDriver = webdriver.spawnWebDriver({
            driverPath: setup.E2E_WEBDRIVER_BINARY,
            spawnArgsConfigurators: [
                webdriver.configureHostArgs(setup.E2E_WEBDRIVER_HOST),
                webdriver.configurePortArgs(setup.E2E_WEBDRIVER_PORT),
                webdriver.configureLoggingArgs(setup.E2E_WEBDRIVER_LOG_LEVEL)
            ]
        })

        // Configure the WebDriver capabilities
        capabilities = webdriver.configureCapabilities({
            binary: setup.E2E_TAURI_BINARY,
        })

        // Create the WebDriver session
        logger.info("Creating WebDriver session", {
            caps: webdriver.serializeCapabilities(capabilities)
        })

        driver = await new Builder()
            .usingServer(setup.E2E_WEBDRIVER_URL)
            .withCapabilities(capabilities)
            .build()

        driver.getCapabilities().then(caps => {
            logger.debug("WebDriver session created", {
                caps: webdriver.serializeCapabilities(caps)
            })
        });

        // Wait for the body element to be present
        await driver.wait(until.elementLocated({css: 'body'}));
    });

    afterEach(async () => {
        logger.info("Cleaning up WebDriver session")
        await webdriver.cleanup(driver, webDriver)
        logger.info("WebDriver session cleaned up")
    });



    test("Send hello world to input", async () => {
        let input = 'input[id="greet-input"]'
        let button = 'button[type="Submit"]'
        let text = 'p[id="greet-msg"]'

        await driver.wait(until.elementLocated({css: input}));
        await driver.findElement({css: input}).sendKeys('Hello World');

        await driver.wait(until.elementLocated({css: button}));
        await driver.findElement({css: button}).click();

        await driver.wait(until.elementLocated({css: text}));
        const helloWorldText = await driver.findElement({css: text}).getText()

        assert(helloWorldText === "Hello, Hello World! You've been greeted from Rust!")
    });
});
