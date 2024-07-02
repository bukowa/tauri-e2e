/**
 * Logger for the library.
 */

/**
 * Logger for the library.
 */
interface Logger {
    info: (data: string, ...args: any) => void;
    warn: (data: string, ...args: any) => void;
    error: (data: string, ...args: any) => void;
    debug: (data: string, ...args: any) => void;
}

/**
 * Set the logger for the library.
 * @param newLogger The new logger.
 */
function setLogger(newLogger: Logger) {
    logger = newLogger
}

let noop = () => {}

/**
 * @internal
 */
export let logger: Logger = {
    info: noop,
    warn: noop,
    error: noop,
    debug: noop,
}

export {
    Logger,
    setLogger,
}
