const E2E_LOG_LEVEL = process.env.E2E_LOG_LEVEL?.toLowerCase() || "info"
const TESTS_TIMEOUT = parseInt(process.env.TESTS_TIMEOUT as string) || 45000

const E2E_WEBDRIVER_HOST = process.env.SELENIUM_WEBDRIVER_HOST?.toUpperCase() || "127.0.0.1"
const E2E_WEBDRIVER_PORT = process.env.SELENIUM_WEBDRIVER_PORT?.toUpperCase() || "5699"
const E2E_WEBDRIVER_URL = `http://${E2E_WEBDRIVER_HOST}:${E2E_WEBDRIVER_PORT}`

const E2E_WEBDRIVER_LOG_LEVEL = process.env.SELENIUM_WEBDRIVER_LOG_LEVEL?.toUpperCase() || "INFO"

const PATH_WEBDRIVER_BINARY = process.env.PATH_WEBDRIVER_BINARY as string
const PATH_TEST_BINARY = process.env.PATH_TEST_BINARY as string

if (!PATH_TEST_BINARY) {
    throw new Error("PATH_RELEASE_BINARY is not set")
}

if (!PATH_WEBDRIVER_BINARY) {
    throw new Error("PATH_WEBDRIVER_BINARY is not set")
}

if (E2E_LOG_LEVEL === 'debug') {
    process.env.WEBKIT_DEBUG = "all";
}
export {
    PATH_TEST_BINARY,
    PATH_WEBDRIVER_BINARY,
    E2E_WEBDRIVER_HOST,
    E2E_WEBDRIVER_PORT,
    E2E_WEBDRIVER_LOG_LEVEL,
    E2E_LOG_LEVEL,
    TESTS_TIMEOUT,
    E2E_WEBDRIVER_URL
}