import {MigrationInterface, QueryRunner} from "typeorm";

export class initialDatabaseStructure1601409243520 implements MigrationInterface {
    name = 'initialDatabaseStructure1601409243520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `credential` (`id` int NOT NULL AUTO_INCREMENT, `accountId` int NOT NULL, `projectId` varchar(255) NOT NULL, `privateKey` json NOT NULL, `clientEmail` varchar(255) NOT NULL, `databaseUrl` varchar(255) NOT NULL, `apiKey` json NOT NULL, `authDomain` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deletedAt` datetime(6) NULL DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `secret` varchar(255) NOT NULL, `additionalInfo` json NULL DEFAULT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deletedAt` datetime(6) NULL DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `user`");
        await queryRunner.query("DROP TABLE `credential`");
    }

}
