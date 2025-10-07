/*
  Warnings:

  - Made the column `occupationalProfile` on table `StudentProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."LanguageSkill" DROP CONSTRAINT "LanguageSkill_studentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Training" DROP CONSTRAINT "Training_studentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WorkExperience" DROP CONSTRAINT "WorkExperience_studentId_fkey";

-- AlterTable
ALTER TABLE "public"."LanguageSkill" ALTER COLUMN "studentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."StudentProfile" ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "stratum" DROP NOT NULL,
ALTER COLUMN "neighborhood" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "department" DROP NOT NULL,
ALTER COLUMN "occupationalProfile" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Training" ALTER COLUMN "studentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."WorkExperience" ALTER COLUMN "studentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Training" ADD CONSTRAINT "Training_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."StudentProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LanguageSkill" ADD CONSTRAINT "LanguageSkill_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."StudentProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkExperience" ADD CONSTRAINT "WorkExperience_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."StudentProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
