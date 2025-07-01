-- CreateTable
CREATE TABLE `fines` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('non_compliance', 'late_payment') NOT NULL,
    `house_id` INTEGER NOT NULL,
    `issued_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `amount` DOUBLE NOT NULL,
    `currency` ENUM('eur', 'usd', 'cop') NOT NULL,
    `status` ENUM('pending', 'paid', 'appealed') NOT NULL DEFAULT 'pending',
    `reason` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `fines` ADD CONSTRAINT `fines_house_id_fkey` FOREIGN KEY (`house_id`) REFERENCES `houses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
