-- CreateEnum
CREATE TYPE "public"."MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'FREE_UNION', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."FamilyPosition" AS ENUM ('INDEPENDENT', 'HEAD_OF_FAMILY', 'CHILD', 'SPOUSE');

-- CreateEnum
CREATE TYPE "public"."EducationLevel" AS ENUM ('HIGH_SCHOOL', 'UNIVERSITY', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."LanguageLevel" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR');

-- CreateTable
CREATE TABLE "public"."StudentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "studentCode" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "secondLastName" TEXT,
    "fullName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "age" INTEGER NOT NULL,
    "birthPlace" TEXT NOT NULL,
    "idNumber" TEXT NOT NULL,
    "idIssuedPlace" TEXT NOT NULL,
    "maritalStatus" "public"."MaritalStatus" NOT NULL,
    "dependents" INTEGER NOT NULL,
    "familyPosition" "public"."FamilyPosition" NOT NULL,
    "address" TEXT NOT NULL,
    "stratum" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "phone" TEXT,
    "mobile" TEXT,
    "email" TEXT NOT NULL,
    "emergencyContact" TEXT,
    "emergencyPhone" TEXT,
    "occupationalProfile" TEXT,
    "planCode" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "campus" TEXT NOT NULL,
    "academicPeriod" TEXT NOT NULL,
    "jornada" TEXT NOT NULL,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Education" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "level" "public"."EducationLevel" NOT NULL,
    "degreeTitle" TEXT NOT NULL,
    "endYear" INTEGER NOT NULL,
    "institution" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "semesters" INTEGER,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Training" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Training_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LanguageSkill" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "speakLevel" "public"."LanguageLevel" NOT NULL,
    "writeLevel" "public"."LanguageLevel" NOT NULL,
    "readLevel" "public"."LanguageLevel" NOT NULL,

    CONSTRAINT "LanguageSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SystemSkill" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "programName" TEXT NOT NULL,

    CONSTRAINT "SystemSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkExperience" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "functions" TEXT NOT NULL,
    "achievements" TEXT,
    "bossName" TEXT NOT NULL,
    "bossRole" TEXT NOT NULL,
    "bossPhone" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkExperience_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "public"."StudentProfile"("userId");

-- AddForeignKey
ALTER TABLE "public"."StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Education" ADD CONSTRAINT "Education_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."StudentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Training" ADD CONSTRAINT "Training_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."StudentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LanguageSkill" ADD CONSTRAINT "LanguageSkill_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."StudentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SystemSkill" ADD CONSTRAINT "SystemSkill_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."StudentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkExperience" ADD CONSTRAINT "WorkExperience_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."StudentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
