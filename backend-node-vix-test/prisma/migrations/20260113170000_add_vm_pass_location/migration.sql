-- AlterTable
ALTER TABLE `vM`
    ADD COLUMN `pass` VARCHAR(191) NULL,
    ADD COLUMN `location` ENUM('bre_barueri', 'usa_miami') NULL;

