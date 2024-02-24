/*
  Warnings:

  - A unique constraint covering the columns `[timestamp,plateNumber]` on the table `VideoData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "VideoData_timestamp_plateNumber_key" ON "VideoData"("timestamp", "plateNumber");
