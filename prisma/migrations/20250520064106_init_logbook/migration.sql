-- CreateTable
CREATE TABLE `Logbook` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `nik` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `remarks` VARCHAR(191) NULL,
    `photoUrl` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
