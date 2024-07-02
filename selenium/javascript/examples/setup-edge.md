---
title: "4. Quickstart Guide 2"
group: Documents
category: README
---
````javascript
import assert from "node:assert";
import {until} from "selenium-webdriver";
import * as e2e from "@tauri-e2e/selenium"
import * as setupEdge from '@tauri-e2e/selenium/webdriversetup/edge'

e2e.setLogger(console);

process.env.TAURI_SELENIUM_BINARY = process.env.TAURI_SELENIUM_BINARY || '../../../target/debug/tauri-app.exe';
process.env.TAURI_WEBDRIVER_BINARY = process.env.TAURI_WEBDRIVER_BINARY || await setupEdge.download();
process.env.SELENIUM_REMOTE_URL = process.env.SELENIUM_REMOTE_URL || 'http://127.0.0.1:4674';

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
`````