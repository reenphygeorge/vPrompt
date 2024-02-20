/*
  Warnings:

  - You are about to drop the column `fileName` on the `Footage` table. All the data in the column will be lost.
  - Added the required column `filename` to the `Footage` table without a default value. This is not possible if the table is not empty.
  - Made the column `response` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Footage" DROP COLUMN "fileName",
ADD COLUMN     "filename" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "response" SET NOT NULL;
