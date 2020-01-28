import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ServerConfig } from "./config/ServerConfig";
import { Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { LoggerConfig } from "./config/LoggerConfig";
import { createConnection } from "typeorm";
import commandLineArgs from "command-line-args";
import { join } from "path";

async function bootstrap() {
    const {env} = commandLineArgs([{
        name: "env",
        alias: "e",
        type: String,
        defaultValue: join(process.cwd(), ".env"),
    }]);
    ServerConfig.ENV_PATH = env;
    const app = await NestFactory.create(AppModule, {
        logger: LoggerConfig.LEVEL as any,
    });

    const options = new DocumentBuilder()
    .setTitle("Configuration storage - confrage")
    .setDescription("Configuration storage server")
    .setVersion("1.0")
    .addTag("confrage")
    .build();

    createConnection();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("api", app, document);

    await app.listen(ServerConfig.PORT);
    new Logger().log(`Server running on http://localhost:${ServerConfig.PORT}`);
}
bootstrap();
