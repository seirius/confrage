import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1580211376813 implements MigrationInterface {
    name = 'Init1580211376813'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `env` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, UNIQUE INDEX `IDX_c8bd5faebe5ff4475a17039802` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `file_data` (`id` int NOT NULL AUTO_INCREMENT, `path` varchar(255) NOT NULL, `type` varchar(255) NOT NULL, `filename` varchar(510) NOT NULL, `envId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `file_data` ADD CONSTRAINT `FK_305ec61534b8874eba23167ad7e` FOREIGN KEY (`envId`) REFERENCES `env`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `file_data` DROP FOREIGN KEY `FK_305ec61534b8874eba23167ad7e`", undefined);
        await queryRunner.query("DROP TABLE `file_data`", undefined);
        await queryRunner.query("DROP INDEX `IDX_c8bd5faebe5ff4475a17039802` ON `env`", undefined);
        await queryRunner.query("DROP TABLE `env`", undefined);
    }

}
