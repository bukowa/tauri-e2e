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
declare function setLogger(newLogger: Logger): void;
export { Logger, setLogger, };
//# sourceMappingURL=logger.d.ts.map