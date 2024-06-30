const E2E_LOG_LEVEL = process.env.E2E_LOG_LEVEL?.toLowerCase() || "info"
const TESTS_TIMEOUT = parseInt(process.env.TESTS_TIMEOUT as string) || 45000

const SELENIUM_WEBDRIVER_HOST = process.env.SELENIUM_WEBDRIVER_HOST?.toUpperCase() || "127.0.0.1"
const SELENIUM_WEBDRIVER_PORT = process.env.SELENIUM_WEBDRIVER_PORT?.toUpperCase() || "5699"

const SELENIUM_WEBDRIVER_LOG_LEVEL = process.env.SELENIUM_WEBDRIVER_LOG_LEVEL?.toUpperCase() || "DEBUG"

const PATH_WEBDRIVER_BINARY = process.env.PATH_WEBDRIVER_BINARY as string
const PATH_TEST_BINARY = process.env.PATH_TEST_BINARY as string

if (!PATH_TEST_BINARY) {
    throw new Error("PATH_RELEASE_BINARY is not set")
}

if (!PATH_WEBDRIVER_BINARY) {
    throw new Error("PATH_WEBDRIVER_BINARY is not set")
}

export {
    PATH_TEST_BINARY,
    PATH_WEBDRIVER_BINARY,
    SELENIUM_WEBDRIVER_HOST,
    SELENIUM_WEBDRIVER_PORT,
    SELENIUM_WEBDRIVER_LOG_LEVEL,
    E2E_LOG_LEVEL,
    TESTS_TIMEOUT
}