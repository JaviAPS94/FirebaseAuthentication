import {MigrationInterface, QueryRunner} from "typeorm";

export class initialDatabaseStructure1598571330407 implements MigrationInterface {
    name = 'initialDatabaseStructure1598571330407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `family_plan` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `externalId` varchar(255) NOT NULL, `additionalInfo` json NOT NULL, `accountId` int NOT NULL, `active` tinyint NOT NULL, `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `updateAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `deleteAt` timestamp NULL, UNIQUE INDEX `IDX_3c9ddd67f1aa8d1c45c4df3acc` (`externalId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `plan` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `description` text NOT NULL, `familyPlanId` int NOT NULL, `externalId` varchar(255) NOT NULL, `additionalInfo` json NOT NULL, `active` tinyint NOT NULL, `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `updateAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `deleteAt` timestamp NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `subscription_user` (`id` int NOT NULL AUTO_INCREMENT, `uid` text NOT NULL, `type` enum ('HOLDER', 'PAYER', 'NORMAL') NOT NULL, `subscriptionId` int NOT NULL, `externalId` text NULL, `additionalInfo` json NULL, `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `subscription` (`id` int NOT NULL AUTO_INCREMENT, `orderInfo` json NULL, `currentPeriodStart` int NOT NULL, `currentPeriodEnd` int NOT NULL, `status` enum ('TRIALING', 'ACTIVE', 'CANCELED', 'UNPAID') NOT NULL, `trialStart` int NULL, `trialEnd` int NULL, `cancelAtPeriodEnd` tinyint NOT NULL, `cancelAt` timestamp NULL, `canceledAt` timestamp NULL, `stayUntil` int NULL, `additionalInfo` json NULL, `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `familyPlanId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `subscription_item` (`id` int NOT NULL AUTO_INCREMENT, `billingRuleId` int NOT NULL, `subscriptionId` int NOT NULL, `planInfo` json NULL, `billingRuleInfo` json NULL, `productInfo` json NULL, `amount` int NOT NULL, `status` enum ('ACTIVE', 'INACTIVE') NOT NULL, `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `recurring_billing_rule` (`id` int NOT NULL AUTO_INCREMENT, `usageType` enum ('METERED', 'LICENSED') NOT NULL, `interval` enum ('DAY', 'WEEK', 'MONTH', 'YEAR') NOT NULL, `intervalCount` int NOT NULL, `billingRuleId` int NULL, UNIQUE INDEX `REL_1232b97d87f478bc5fdd7f9360` (`billingRuleId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `billing_rule` (`id` int NOT NULL AUTO_INCREMENT, `description` text NOT NULL, `productId` int NOT NULL, `type` enum ('ONE_TIME', 'RECURRING') NOT NULL, `tag` varchar(255) NULL, `trialPeriodDays` int NULL, `externalId` int NULL, `additionalInfo` json NULL, `active` tinyint NOT NULL, `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `updateAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `deleteAt` timestamp NULL, `planId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `plan` ADD CONSTRAINT `FK_bd60844ed7b2f7da3b046a7efe3` FOREIGN KEY (`familyPlanId`) REFERENCES `family_plan`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `subscription_user` ADD CONSTRAINT `FK_cdf67f6c499d7a4c7b4d1524850` FOREIGN KEY (`subscriptionId`) REFERENCES `subscription`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `subscription` ADD CONSTRAINT `FK_8a489c1b4b853bea53e68de2202` FOREIGN KEY (`familyPlanId`) REFERENCES `family_plan`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `subscription_item` ADD CONSTRAINT `FK_7d0f92aa6efe9cd1b66ae739ca1` FOREIGN KEY (`subscriptionId`) REFERENCES `subscription`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `subscription_item` ADD CONSTRAINT `FK_ef148a2f61294427c8a85fd2576` FOREIGN KEY (`billingRuleId`) REFERENCES `billing_rule`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `recurring_billing_rule` ADD CONSTRAINT `FK_1232b97d87f478bc5fdd7f9360c` FOREIGN KEY (`billingRuleId`) REFERENCES `billing_rule`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `billing_rule` ADD CONSTRAINT `FK_08b203c3352d89004d6038629cc` FOREIGN KEY (`planId`) REFERENCES `plan`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `billing_rule` DROP FOREIGN KEY `FK_08b203c3352d89004d6038629cc`");
        await queryRunner.query("ALTER TABLE `recurring_billing_rule` DROP FOREIGN KEY `FK_1232b97d87f478bc5fdd7f9360c`");
        await queryRunner.query("ALTER TABLE `subscription_item` DROP FOREIGN KEY `FK_ef148a2f61294427c8a85fd2576`");
        await queryRunner.query("ALTER TABLE `subscription_item` DROP FOREIGN KEY `FK_7d0f92aa6efe9cd1b66ae739ca1`");
        await queryRunner.query("ALTER TABLE `subscription` DROP FOREIGN KEY `FK_8a489c1b4b853bea53e68de2202`");
        await queryRunner.query("ALTER TABLE `subscription_user` DROP FOREIGN KEY `FK_cdf67f6c499d7a4c7b4d1524850`");
        await queryRunner.query("ALTER TABLE `plan` DROP FOREIGN KEY `FK_bd60844ed7b2f7da3b046a7efe3`");
        await queryRunner.query("DROP TABLE `billing_rule`");
        await queryRunner.query("DROP INDEX `REL_1232b97d87f478bc5fdd7f9360` ON `recurring_billing_rule`");
        await queryRunner.query("DROP TABLE `recurring_billing_rule`");
        await queryRunner.query("DROP TABLE `subscription_item`");
        await queryRunner.query("DROP TABLE `subscription`");
        await queryRunner.query("DROP TABLE `subscription_user`");
        await queryRunner.query("DROP TABLE `plan`");
        await queryRunner.query("DROP INDEX `IDX_3c9ddd67f1aa8d1c45c4df3acc` ON `family_plan`");
        await queryRunner.query("DROP TABLE `family_plan`");
    }

}
