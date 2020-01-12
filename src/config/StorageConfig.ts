import * as env from "env-var";
import { config as envConfig } from "dotenv";
envConfig();

export class StorageConfig {
    public static readonly DIRECTORY: string = env.get("STORAGE_DIRECTORY", "file-storage").asString();
}