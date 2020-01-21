import * as env from "env-var";

export class LoggerConfig {
    public static readonly LEVEL: string[] = env.get("LOGGER_LEVEL", "log,error").asArray();
}
