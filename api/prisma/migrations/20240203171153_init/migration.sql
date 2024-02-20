-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "videoFileLink" TEXT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "question" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "time" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chatId" TEXT,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Footage" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "timestamp" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,

    CONSTRAINT "Footage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chat_id_key" ON "Chat"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Message_id_key" ON "Message"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Footage_id_key" ON "Footage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Footage_plateNumber_key" ON "Footage"("plateNumber");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
