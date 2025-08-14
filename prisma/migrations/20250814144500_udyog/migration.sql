-- CreateTable
CREATE TABLE "public"."Registration" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aadhaarNumber" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "orgType" TEXT NOT NULL,
    "panNumber" TEXT NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Registration_aadhaarNumber_key" ON "public"."Registration"("aadhaarNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_panNumber_key" ON "public"."Registration"("panNumber");
