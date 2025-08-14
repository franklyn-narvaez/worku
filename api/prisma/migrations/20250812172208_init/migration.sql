/*
  Warnings:

  - Made the column `name` on table `College` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Faculty` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."College" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Faculty" ALTER COLUMN "name" SET NOT NULL;
