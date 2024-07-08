/*
---
title: 2. Quickstart Guide
group: Documents
category: README
---
*/
import {launch} from "@tauri-e2e/selenium";
import assert from "node:assert";
import {until} from "selenium-webdriver";
import * as e2e from "@tauri-e2e/selenium"

// This setup simplifies managing `WebDriver` binary locations and platform-specific details.
// The following `optional` environment variables can be set to quickly get started.
// Under the hood all modules recognize them and adjust their behavior accordingly.
// Note!: This is optional and opinionated, you can manage the WebDriver process yourself.

// Path to the Tauri app binary.
// (if .exe is detected it will be stripped on non-Windows platforms)
process.env.TAURI_SELENIUM_BINARY = '../../../target/release/tauri-app.exe';

// Path to the WebDriver binary (optional as it will be looked up in the system's PATH).
// In this example we use `install` module to install the WebDriver binary based on the platform.
// On `Windows` we will automatically download the WebDriver binary while utilizing cache.
// On `Linux` if the WebDriver binary is not found in the PATH, we will throw an error as
// WebDriver has to be installed using native package manager like `apt-get` or `yum`.
// Note: For running Windows tests inside GitHub Actions see:
// https://github.com/actions/runner-images/issues/9538
process.env.TAURI_WEBDRIVER_BINARY = await e2e.install.PlatformDriver();

// Define URL of the remote Selenium server.
// That's how we connect these two modules together:
// - If spawning WebDriver using `launch.SpawnWebDriver` module - host and port
// arguments passed to the WebDriver binary will be extracted from this URL.
// - If using `Builder` then host and port will be passed
// to `usingServer` method of `selenium-webdriver`. This aligns with the
// `selenium-webdriver` API and allows to use custom remote servers.
process.env.SELENIUM_REMOTE_URL = 'http://127.0.0.1:4674';

// Loge level for WebDriver process.
process.env.TAURI_WEBDRIVER_LOGLEVEL = 'debug';

// Setup optional logging in case of failures.
e2e.setLogger(console);

// Launch WebDriver process.
// Handles cleanup on process exit under the hood (SIGINT, SIGTERM, etc).
// Because each WebDriver has its own way of spawning and managing the process,
// we abstract this complexity into a single module while trying to keep the API simple.
let webdriver = await e2e.launch.spawnWebDriver({setupExitHandlers: true})

// Create a new WebDriver session.
let driver = new e2e.selenium.Builder().build();

// Wait until the body is loaded.
await driver.wait(until.elementLocated({css: 'body'}));

// Get the title.
let title = await driver.getTitle();
assert.equal(title, 'Tauri App');

// Properly cleanup WebDriver session.
// This will close the Tauri window and the WebDriver session.
// Note: on Linux need this PR to be merged:
// - https://github.com/tauri-apps/wry/pull/1311/files
await e2e.selenium.cleanupSession(driver);

// Close underlying WebDriver process.
// Otherwise, we will hang indefinitely.
// Note: When using node runner you can pass `--test-force-exit` flag.
e2e.launch.killWebDriver(webdriver)
