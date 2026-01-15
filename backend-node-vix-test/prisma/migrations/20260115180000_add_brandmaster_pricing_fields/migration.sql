-- AlterTable
ALTER TABLE `brandMaster`
    ADD COLUMN `discountRate` DOUBLE NULL DEFAULT 1,
    ADD COLUMN `minConsumption` DOUBLE NULL DEFAULT 0,
    ADD COLUMN `hasSelfRegister` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `hasPrepaid` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `retailPercentageDefault` DOUBLE NULL DEFAULT 1;

