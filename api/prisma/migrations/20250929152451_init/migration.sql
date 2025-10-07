/*
  Warnings:

  - You are about to drop the `AvailabilityDay` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AvailabilityRange` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."AvailabilityDay" DROP CONSTRAINT "AvailabilityDay_studentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AvailabilityRange" DROP CONSTRAINT "AvailabilityRange_availabilityDayId_fkey";

-- DropTable
DROP TABLE "public"."AvailabilityDay";

-- DropTable
DROP TABLE "public"."AvailabilityRange";

-- CreateTable
CREATE TABLE "public"."Availability" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "dayOfWeek" "public"."DayOfWeek" NOT NULL,
    "startTime1" TIMESTAMP(3),
    "endTime1" TIMESTAMP(3),
    "startTime2" TIMESTAMP(3),
    "endTime2" TIMESTAMP(3),
    "startTime3" TIMESTAMP(3),
    "endTime3" TIMESTAMP(3),

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Availability" ADD CONSTRAINT "Availability_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."StudentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
