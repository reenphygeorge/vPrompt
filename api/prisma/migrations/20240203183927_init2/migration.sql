/*
  Warnings:

  - You are about to drop the column `videoFileLink` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `plateNumber` on the `Footage` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Footage` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Message` table. All the data in the column will be lost.
  - Added the required column `footageId` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileName` to the `Footage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prompt` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Footage_plateNumber_key";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "videoFileLink",
ADD COLUMN     "createTime" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "footageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Footage" DROP COLUMN "plateNumber",
DROP COLUMN "timestamp",
ADD COLUMN     "fileName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "question",
DROP COLUMN "time",
ADD COLUMN     "createTime" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "prompt" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "VideoData" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "timestamp" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "footageId" TEXT NOT NULL,

    CONSTRAINT "VideoData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoData_id_key" ON "VideoData"("id");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_footageId_fkey" FOREIGN KEY ("footageId") REFERENCES "Footage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoData" ADD CONSTRAINT "VideoData_footageId_fkey" FOREIGN KEY ("footageId") REFERENCES "Footage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
