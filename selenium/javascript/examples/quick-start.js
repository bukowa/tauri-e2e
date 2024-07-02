/*
---
title: "2. Quickstart Guide"
group: Documents
category: README
---
*/
import assert from "node:assert";
import {until} from "selenium-webdriver";
import * as e2e from "@tauri-e2e/selenium"

// The following `optional` environment variables can be set to override default values.
// This setup simplifies managing WebDriver binary locations and platform-specific details.
// Note: this is optional and opinionated, you can manage the WebDriver process yourself.

// Path to the Tauri app binary.
// (if .exe is detected it will be stripped on non-Windows platforms)
process.env.TAURI_SELENIUM_BINARY = '../../../target/debug/tauri-app.exe';

// Path to the WebDriver binary (optional as it will be looked up in the system's PATH).
// Note 1: If .exe is detected on non-Windows platforms, fall backs to searching in PATH
// automatically - which on Linux defaults to `/usr/bin/WebKitWebDriver`
// Note 2: For running Windows tests inside GitHub Actions see:
// https://github.com/actions/runner-images/issues/9538
process.env.TAURI_WEBDRIVER_BINARY = '../../../.build/bin/msedgedriver.exe';

// Define URL of the remote Selenium server.
// Note: Host and port arguments passed to the WebDriver binary will be extracted from this URL.
process.env.SELENIUM_REMOTE_URL = 'http://127.0.0.1:4674';

// Setup optional logging in case of failures.
e2e.setLogger(console);

// Launch WebDriver process.
// Handles cleanup on process exit under the hood.
let webdriver = await e2e.spawnWebDriver({});

// Create a new WebDriver session.
// Handles connecting to the spawned WebDriver process under the hood.
let driver = new e2e.builderForBinary().build();

// Wait until the body is loaded.
await driver.wait(until.elementLocated({css: 'body'}));

// Get the title.
let title = await driver.getTitle();
assert.equal(title, 'Tauri App');

// Close and cleanup WebDriver session.
// Note: Calling `driver.close()` is required for `webkitgtk2` to properly close the session
// (need https://github.com/tauri-apps/wry/pull/1311/files to be merged)
await driver.close();
await driver.quit();

// Exit via `process.exit` to properly close the WebDriver process.
// Note: When using node runner you can pass `--test-force-exit` flag.
process.exit(0);