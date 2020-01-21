import * as env from "env-var";

export class StorageConfig {
    public static readonly DIRECTORY: string = env.get("STORAGE_DIRECTORY", "file-storage").asString();
}
