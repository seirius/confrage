import { Controller, Post, HttpCode, HttpStatus, UseInterceptors, UploadedFile, Body, Get, Query, Response as nResponse, Delete } from "@nestjs/common";
import { ApiConsumes, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { StorageSaveFileDateDto, FileDataList, EnvList, DeleteEnvDto, DeleteFileDataDto } from "./storage.dto";
import { StorageService } from "./storage.service";
import { Response } from "express";

@Controller("storage")
export class StorageController {

    constructor(
        private readonly storageService: StorageService,
    ) {}

    @Post("file-data")
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor("data"))
    @ApiConsumes("multipart/form-data")
    public async storeFileData(
        @UploadedFile() data: any,
        @Body() {envName, path, type}: StorageSaveFileDateDto,
    ): Promise<void> {
        await this.storageService.storeFileData({data, envName, path, type});
    }

    @Get("file-data")
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Stored file data",
        content: {
            "application/x-octet-stream": {
                schema: {
                    type: "string",
                    format: "binary",
                },
            },
        },
    })
    @ApiQuery({name: "path", required: false})
    public async retrieveFileData(
        @nResponse() response: Response,
        @Query("envName") envName: string,
        @Query("filename") filename: string,
        @Query("path") path?: string,
    ) {
        const data = await this.storageService.getFileData({envName, path, filename});
        if (data) {
            response.setHeader("Content-disposition", "attachment; filename=" + filename);
            response.setHeader("content-type", "application/octet-stream");
            response.end(data, "binary");
        } else {
            response.status(HttpStatus.NOT_FOUND).json({
                message: "No file data was found.",
            });
        }
    }

    @Get("env/ls")
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Env list",
        type: EnvList,
    })
    @ApiQuery({name: "name", required: false})
    public async envList(
        @Query("name") name: string,
    ): Promise<EnvList> {
        const envList = await this.storageService.listEnvs({name});
        return {items: envList};
    }

    @Get("file-data/ls")
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: "File data list",
        type: FileDataList,
    })
    @ApiQuery({name: "env", required: false})
    @ApiQuery({name: "filename", required: false})
    @ApiQuery({name: "path", required: false})
    public async fileDataList(
        @Query("env") env: string,
        @Query("filename") filename: string,
        @Query("path") path: string,
    ): Promise<FileDataList> {
        const fileDataList = await this.storageService.listFileData({env, path, filename});
        return {
            items: fileDataList,
        };
    }

    @Delete("env")
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Number of items deleted",
        type: DeleteEnvDto,
    })
    public async deleteEnv(@Query("env") name: string): Promise<DeleteEnvDto> {
        return this.storageService.deleteEnv({name});
    }

    @Delete("file-data")
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Number of items deleted",
        type: DeleteFileDataDto,
    })
    @ApiQuery({name: "path", required: false})
    public async deleteFileData(
        @Query("env") env: string,
        @Query("filename") filename: string,
        @Query("path") path: string = "",
    ): Promise<DeleteFileDataDto> {
        return this.storageService.deleteFileData({env, filename, path});
    }

}
