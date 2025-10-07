-- CreateEnum
CREATE TYPE "public"."DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateTable
CREATE TABLE "public"."AvailabilityDay" (
    "id" TEXT NOT NULL,
    "day" "public"."DayOfWeek" NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "AvailabilityDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AvailabilityRange" (
    "id" TEXT NOT NULL,
    "availabilityDayId" TEXT NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvailabilityRange_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."AvailabilityDay" ADD CONSTRAINT "AvailabilityDay_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."StudentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AvailabilityRange" ADD CONSTRAINT "AvailabilityRange_availabilityDayId_fkey" FOREIGN KEY ("availabilityDayId") REFERENCES "public"."AvailabilityDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
