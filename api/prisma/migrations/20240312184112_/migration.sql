/*
  Warnings:

  - You are about to drop the column `type` on the `VideoData` table. All the data in the column will be lost.
  - Added the required column `vehicleType` to the `VideoData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VideoData" DROP COLUMN "type",
ADD COLUMN     "vehicleType" TEXT NOT NULL;
