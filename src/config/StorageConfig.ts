import * as env from "env-var";
import { config as envConfig } from "dotenv";
import { ServerConfig } from "./ServerConfig";
envConfig({path: ServerConfig.ENV_PATH});

export class StorageConfig {
    public static readonly DIRECTORY: string = env.get("STORAGE_DIRECTORY", "file-storage").asString();
}
