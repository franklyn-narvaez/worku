/*
  Warnings:

  - Added the required column `Grades` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Photo` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."StudentProfile" ADD COLUMN     "Grades" TEXT NOT NULL,
ADD COLUMN     "Photo" TEXT NOT NULL;
