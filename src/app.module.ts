import { Module } from '@nestjs/common';
import { DefaultModule } from './default/default.module';
import { StorageModule } from './storage/storage.module';

@Module({
    imports: [DefaultModule, StorageModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
