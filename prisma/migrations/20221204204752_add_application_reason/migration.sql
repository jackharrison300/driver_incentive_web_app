/*
  Warnings:

  - Added the required column `applicationReason` to the `DriverApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CashValue` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `DriverApplication` ADD COLUMN `applicationReason` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Purchase` ADD COLUMN `CashValue` DECIMAL(65, 30) NOT NULL;

-- CreateTable
CREATE TABLE `CatalogFilter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `term` VARCHAR(191) NOT NULL,
    `vendorId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CatalogFilter` ADD CONSTRAINT `CatalogFilter_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
