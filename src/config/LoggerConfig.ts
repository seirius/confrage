import * as env from "env-var";
import { config as envConfig } from "dotenv";
import { ServerConfig } from "./ServerConfig";
envConfig({path: ServerConfig.ENV_PATH});

export class LoggerConfig {
    public static readonly LEVEL: string[] = env.get("LOGGER_LEVEL", "log,error").asArray();
}
