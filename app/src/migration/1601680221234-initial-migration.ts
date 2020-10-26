import {MigrationInterface, QueryRunner} from "typeorm";

export class initialMigration1601680221234 implements MigrationInterface {
    name = 'initialMigration1601680221234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `credential` (`id` int NOT NULL AUTO_INCREMENT, `projectId` varchar(255) NOT NULL, `privateKey` json NOT NULL, `clientEmail` varchar(255) NOT NULL, `databaseUrl` varchar(255) NOT NULL, `apiKey` json NOT NULL, `authDomain` varchar(255) NOT NULL, `accountId` int NOT NULL, `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `updateAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `deleteAt` timestamp NULL, UNIQUE INDEX `REL_de2a40b25b1107e1f8ea3bfe18` (`accountId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `account` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, `externalId` varchar(255) NOT NULL, `active` tinyint NOT NULL, `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `updateAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `deleteAt` timestamp NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `secret` varchar(255) NOT NULL, `additionalInfo` json NULL DEFAULT NULL, `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `updateAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `deleteAt` timestamp NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `credential` ADD CONSTRAINT `FK_de2a40b25b1107e1f8ea3bfe18d` FOREIGN KEY (`accountId`) REFERENCES `account`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `credential` DROP FOREIGN KEY `FK_de2a40b25b1107e1f8ea3bfe18d`");
        await queryRunner.query("DROP TABLE `user`");
        await queryRunner.query("DROP TABLE `account`");
        await queryRunner.query("DROP INDEX `REL_de2a40b25b1107e1f8ea3bfe18` ON `credential`");
        await queryRunner.query("DROP TABLE `credential`");
    }

}
