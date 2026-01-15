-- AlterTable
ALTER TABLE `brandMaster`
    ADD COLUMN `idBrandTheme` INTEGER NULL,
    ADD COLUMN `isStripeActive` BOOLEAN NULL DEFAULT false;
