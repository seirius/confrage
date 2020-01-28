import { ApiProperty } from "@nestjs/swagger";
import { FileData } from "./entities/file-data.entity";

export interface IStorageSaveFileDataArgs {
    data: any;
    envName: string;
    path?: string;
    type?: string;
}

export class StorageSaveFileDateDto {
    @ApiProperty({
        type: "string",
        format: "binary",
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

// tslint:disable-next-line: max-classes-per-file
export class EnvDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;
}

// tslint:disable-next-line: max-classes-per-file
export class FileDataDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    env?: EnvDto;

    @ApiProperty()
    path?: string;

    @ApiProperty()
    type?: string;

    @ApiProperty()
    filename: string;
}

// tslint:disable-next-line: max-classes-per-file
export class EnvList {
    @ApiProperty({type: [EnvDto]})
    items: EnvDto[];
}

// tslint:disable-next-line: max-classes-per-file
export class FileDataList {
    @ApiProperty({
        type: [FileDataDto],
    })
    items: FileDataDto[];
}

// tslint:disable-next-line: max-classes-per-file
export class DeleteEnvDto {
    @ApiProperty()
    deleted: number;
}

// tslint:disable-next-line: max-classes-per-file
export class DeleteFileDataDto {
    @ApiProperty()
    deleted: number;
}
