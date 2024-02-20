/*
  Warnings:

  - You are about to drop the column `createTime` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "createTime",
ADD COLUMN     "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;
