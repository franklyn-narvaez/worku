/*
  Warnings:

  - Made the column `studentId` on table `Education` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Education" DROP CONSTRAINT "Education_studentId_fkey";

-- AlterTable
ALTER TABLE "public"."Education" ALTER COLUMN "studentId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Education" ADD CONSTRAINT "Education_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."StudentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
