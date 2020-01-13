import { Controller, Post, HttpCode, HttpStatus, UseInterceptors, UploadedFile, Body, Get, Query, Response as nResponse } from "@nestjs/common";
import { ApiConsumes, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { StorageSaveFileDateDto } from "./storage.dto";
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

}
