-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_footageId_fkey";

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_footageId_fkey" FOREIGN KEY ("footageId") REFERENCES "Footage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
