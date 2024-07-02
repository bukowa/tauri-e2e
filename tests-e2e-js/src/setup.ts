const E2E_LOG_LEVEL = process.env.E2E_LOG_LEVEL?.toLowerCase() || "info"

const E2E_WEBDRIVER_HOST = process.env.SELENIUM_WEBDRIVER_HOST?.toUpperCase() || "127.0.0.1"
const E2E_WEBDRIVER_PORT = process.env.SELENIUM_WEBDRIVER_PORT?.toUpperCase() || "5699"
const E2E_WEBDRIVER_URL = `http://${E2E_WEBDRIVER_HOST}:${E2E_WEBDRIVER_PORT}`

const E2E_WEBDRIVER_LOG_LEVEL = process.env.SELENIUM_WEBDRIVER_LOG_LEVEL?.toUpperCase() || "INFO"

const E2E_WEBDRIVER_BINARY = process.env.E2E_WEBDRIVER_BINARY as string
const E2E_TAURI_BINARY = process.env.E2E_TAURI_BINARY as string

if (!E2E_TAURI_BINARY) {
    throw new Error("PATH_RELEASE_BINARY is not set")
}

if (!E2E_WEBDRIVER_BINARY) {
    throw new Error("E2E_WEBDRIVER_BINARY is not set")
}

if (E2E_LOG_LEVEL === 'debug') {
    process.env.WEBKIT_DEBUG = "all";
}
export {
    E2E_TAURI_BINARY,
    E2E_WEBDRIVER_BINARY,
    E2E_WEBDRIVER_HOST,
    E2E_WEBDRIVER_PORT,
    E2E_WEBDRIVER_LOG_LEVEL,
    E2E_LOG_LEVEL,
    E2E_WEBDRIVER_URL
}