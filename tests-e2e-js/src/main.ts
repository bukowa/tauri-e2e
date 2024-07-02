import assert from "node:assert";
import {ChildProcess} from "node:child_process";
import {afterEach, beforeEach, describe, test} from "node:test";
import {until, WebDriver} from "selenium-webdriver";
import * as e2e from "@tauri-e2e/selenium";
import {default as log4js} from "log4js";

let logger = log4js.getLogger();
logger.level = "debug";

process.env.TAURI_WEBDRIVER_LOGLEVEL = "debug"
process.env.TAURI_WEBDRIVER_BINARY = await e2e.install.PlatformDriver();
process.env.TAURI_SELENIUM_BINARY = "../target/release/tauri-app.exe"
process.env.SELENIUM_REMOTE_URL = "http://127.0.0.1:6655"

//@ts-ignore fuck you javascript
e2e.setLogger(logger)

describe("Tauri E2E tests", async () => {

    let driver: WebDriver;
    let webDriver: ChildProcess;

    beforeEach(async () => {
        // Spawn WebDriver process.
        webDriver = await e2e.launch.spawnWebDriver()
        // Create driver session.
        driver = new e2e.selenium.Builder().build();
        // Wait for the body element to be present
        await driver.wait(until.elementLocated({css: 'body'}));
    });

    afterEach(async () => {
        await e2e.selenium.cleanupSession(driver)
        e2e.launch.killWebDriver(webDriver)
    });

    let test_ = async() => {
        return test("Send hello world to input", async()=>{
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
        })
    }

    for (let i = 0; i < 10; i++) {
        await test_()
    }

});
