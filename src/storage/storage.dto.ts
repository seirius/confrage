import { ApiProperty } from "@nestjs/swagger";

export interface IStorageSaveFileDataArgs {
    data: any;
    envName: string;
    path?: string;
    type?: string;
}

export class StorageSaveFileDateDto {
    @ApiProperty({
        type: "string",
        format: "binary"
    })
    data: any;
    @ApiProperty()
    envName: string;
    @ApiProperty({required: false})
    path?: string;
    @ApiProperty({required: false})
    type?: string;
}

export interface IGetFileDataArgs {
    envName: string;
    path?: string;
    filename: string;
}

export interface IWriteFileDataArgs {
    envName: string;
    path: string;
    filename: string;
    data: any;
}

export interface IReadFileDataArgs {
    envName: string;
    path: string;
    filename: string;
}