/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `Logbook` table. All the data in the column will be lost.
  - Added the required column `photo_url` to the `Logbook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Logbook` DROP COLUMN `photoUrl`,
    ADD COLUMN `photo_url` VARCHAR(191) NOT NULL,
    MODIFY `remarks` TEXT NULL;
