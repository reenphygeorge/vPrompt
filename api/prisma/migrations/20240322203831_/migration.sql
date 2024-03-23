-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_footageId_fkey";

-- DropForeignKey
ALTER TABLE "VideoData" DROP CONSTRAINT "VideoData_footageId_fkey";

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_footageId_fkey" FOREIGN KEY ("footageId") REFERENCES "Footage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoData" ADD CONSTRAINT "VideoData_footageId_fkey" FOREIGN KEY ("footageId") REFERENCES "Footage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
