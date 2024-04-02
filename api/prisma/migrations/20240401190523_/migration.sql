/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `footageId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `chatId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `footageId` on the `VideoData` table. All the data in the column will be lost.
  - You are about to drop the column `plateNumber` on the `VideoData` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleType` on the `VideoData` table. All the data in the column will be lost.
  - Added the required column `chat_id` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_name` to the `VideoData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `footage_id` to the `VideoData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text_data` to the `VideoData` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_footageId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatId_fkey";

-- DropForeignKey
ALTER TABLE "VideoData" DROP CONSTRAINT "VideoData_footageId_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "createdAt",
DROP COLUMN "footageId",
ADD COLUMN     "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "footage_id" TEXT;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "chatId",
DROP COLUMN "createdAt",
ADD COLUMN     "chat_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "VideoData" DROP COLUMN "footageId",
DROP COLUMN "plateNumber",
DROP COLUMN "vehicleType",
ADD COLUMN     "class_name" TEXT NOT NULL,
ADD COLUMN     "footage_id" TEXT NOT NULL,
ADD COLUMN     "text_data" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_footage_id_fkey" FOREIGN KEY ("footage_id") REFERENCES "Footage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoData" ADD CONSTRAINT "VideoData_footage_id_fkey" FOREIGN KEY ("footage_id") REFERENCES "Footage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
