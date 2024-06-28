import * as log4js from "log4js";
import { TESTS_LOG_LEVEL} from "./setup";

const logger = log4js.getLogger();

logger.level = TESTS_LOG_LEVEL;
export {
    logger
}