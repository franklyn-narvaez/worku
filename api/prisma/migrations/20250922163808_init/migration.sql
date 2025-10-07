-- DropForeignKey
ALTER TABLE "public"."Education" DROP CONSTRAINT "Education_studentId_fkey";

-- AlterTable
ALTER TABLE "public"."Education" ALTER COLUMN "studentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Education" ADD CONSTRAINT "Education_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."StudentProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
