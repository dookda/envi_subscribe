-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "lineUserId" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "EquipmentItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "equipmentName" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EquipmentItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRecord" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serviceDate" DATE NOT NULL,
    "status" "ServiceStatus" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_lineUserId_key" ON "User"("lineUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "EquipmentItem_userId_idx" ON "EquipmentItem"("userId");

-- CreateIndex
CREATE INDEX "EquipmentItem_equipmentName_idx" ON "EquipmentItem"("equipmentName");

-- CreateIndex
CREATE INDEX "EquipmentItem_model_idx" ON "EquipmentItem"("model");

-- CreateIndex
CREATE INDEX "EquipmentItem_customerName_idx" ON "EquipmentItem"("customerName");

-- CreateIndex
CREATE INDEX "EquipmentItem_isArchived_idx" ON "EquipmentItem"("isArchived");

-- CreateIndex
CREATE INDEX "ServiceRecord_equipmentId_idx" ON "ServiceRecord"("equipmentId");

-- CreateIndex
CREATE INDEX "ServiceRecord_userId_idx" ON "ServiceRecord"("userId");

-- CreateIndex
CREATE INDEX "ServiceRecord_serviceDate_idx" ON "ServiceRecord"("serviceDate");

-- CreateIndex
CREATE INDEX "ServiceRecord_userId_serviceDate_idx" ON "ServiceRecord"("userId", "serviceDate");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentItem" ADD CONSTRAINT "EquipmentItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRecord" ADD CONSTRAINT "ServiceRecord_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "EquipmentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
