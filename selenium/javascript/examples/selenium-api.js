/*
---
title: "3. Selenium API"
group: Documents
category: README
---
*/
import {Builder} from "selenium-webdriver";
import * as e2e from "@tauri-e2e/selenium"

// Using native selenium-webdriver API:

// Windows
let opts = new e2e.webview2.Options()
opts.setBinaryPath("/path/to/tauri-app.exe")
let driver = new Builder()
    .withCapabilities(opts)

// Linux
let opts = new e2e.webkitgtk2.Options()
opts.setBinaryPath("/path/to/tauri-app")
let driver = new Builder()
    .withCapabilities(opts)
