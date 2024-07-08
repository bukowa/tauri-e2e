/**
 * Logger for the library.
 */
/**
 * Set the logger for the library.
 * @param newLogger The new logger.
 */
function setLogger(newLogger) {
    logger = newLogger;
}
let noop = () => { };
/**
 * @internal
 */
export let logger = {
    info: noop,
    warn: noop,
    error: noop,
    debug: noop,
};
export { setLogger, };
//# sourceMappingURL=logger.js.map