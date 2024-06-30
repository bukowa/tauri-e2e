import * as log4js from "log4js";
import { E2E_LOG_LEVEL} from "./setup";

const logger = log4js.getLogger();

logger.level = E2E_LOG_LEVEL;
export {
    logger
}