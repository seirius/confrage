import { Injectable, Logger, HttpException, HttpStatus } from "@nestjs/common";
import { IStorageSaveFileDataArgs, IWriteFileDataArgs, IReadFileDataArgs, IGetFileDataArgs, DeleteEnvDto, DeleteFileDataDto } from "./storage.dto";
import { promises } from "fs";
import { StorageConfig } from "./../config/StorageConfig";
import { join, extname } from "path";
import { Transaction, TransactionRepository, Repository, getRepository, Like, FindManyOptions, FindConditions, In } from "typeorm";
import { Env } from "./entities/env.entity";
import { FileData } from "./entities/file-data.entity";

@Injectable()
export class StorageService {

    private readonly logger = new Logger(StorageService.constructor.name);

    @Transaction()
    public async storeFileData(
        {data: {buffer, originalname}, envName, path, type}: IStorageSaveFileDataArgs,
        @TransactionRepository(Env) envRepository?: Repository<Env>,
        @TransactionRepository(FileData) fileDataRepository?: Repository<FileData>,
    ): Promise<void> {
        path = path === undefined ? "" : path;
        let env = await envRepository.findOne({where: {name: envName}});
        if (!env) {
            env = new Env();
            env.name = envName;
            env = await envRepository.save(env);
        }
        let fileData = await fileDataRepository.findOne({
            where: {
                env,
                path,
                filename: originalname,
            },
        });
        type = originalname.includes(".") ? extname(originalname).substring(1) : "text";
        if (!fileData) {
            fileData = new FileData();
            fileData.env = env;
            fileData.path = path;
            fileData.type = type;
            fileData.filename = originalname;
            fileData = await fileDataRepository.save(fileData);
        } else {
            await fileDataRepository.update({id: fileData.id}, {
                type, path,
            });
        }
        await this.writeFileData({envName, path, data: buffer, filename: originalname});
    }

    public async getFileData({envName, path, filename}: IGetFileDataArgs): Promise<any> {
        path = path === undefined ? "" : path;
        const env = await getRepository(Env).findOne({where: {name: envName}});
        if (!env) {
            return;
        }
        const fileData = await getRepository(FileData).findOne({
            env,
            path,
            filename,
        });
        if (fileData) {
            return this.readFileData({envName, path, filename});
        }
    }

    public async writeFileData({envName, path, filename, data}: IWriteFileDataArgs): Promise<void> {
        const envDirectory = join(StorageConfig.DIRECTORY, envName, path);
        await promises.mkdir(envDirectory, {recursive: true});
        await promises.writeFile(join(envDirectory, filename), data);
    }

    public async readFileData({envName, path, filename}: IReadFileDataArgs): Promise<any> {
        let data: any;
        try {
            path = path === undefined ? "" : path;
            const fullPath = join(join(StorageConfig.DIRECTORY, envName, path), filename);
            data = await promises.readFile(fullPath);
        } catch (error) {
            this.logger.log(error);
        }
        return data;
    }

    public async listEnvs({name}: {name: string}): Promise<Env[]> {
        const where: FindConditions<Env> = {};
        if (name) {
            where.name = Like(`%${name}%`);
        }
        return getRepository(Env).find({where});
    }

    public async listFileData({env, path, filename}: {
        env: string,
        path: string,
        filename: string,
    }): Promise<FileData[]> {
        const query = getRepository(FileData)
        .createQueryBuilder("fileData")
        .leftJoinAndSelect("fileData.env", "env");

        if (path) {
            query.where("fileData.path like :path", {path: `%${path}%`});
        }

        if (filename) {
            query.where("fileData.filename like :filename", {filename: `%${filename}%`});
        }

        if (env) {
            query.where("env.name like :env", {env: `%${env}%`});
        }

        return await query.getMany();
    }

    public async deleteEnv({name}: {name: string}): Promise<DeleteEnvDto> {
        const deleteResult = await getRepository(Env).delete({name});
        return {deleted: deleteResult.affected};
    }

    public async deleteFileData({env, filename, path}: {
        env: string;
        filename: string;
        path: string;
    }): Promise<DeleteFileDataDto> {
        const envEntity = await getRepository(Env).findOne({where: {name: env}});
        if (!envEntity) {
            throw new HttpException("No environment found with this name", HttpStatus.NOT_FOUND);
        }
        const deleteResult = await getRepository(FileData).delete({
            env: envEntity,
            filename, path,
        });
        return {deleted: deleteResult.affected};
    }

}
