-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_footageId_fkey";

-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "footageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_footageId_fkey" FOREIGN KEY ("footageId") REFERENCES "Footage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
