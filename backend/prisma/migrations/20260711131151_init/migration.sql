/*
  Warnings:

  - The values [SUPER_ADMIN] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `authorId` on the `contents` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `contents` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `contents` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `contents` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `contents` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `contents` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `contents` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `institutionId` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `correctAnswer` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `explanation` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `options` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `results` table. All the data in the column will be lost.
  - You are about to drop the column `percentage` on the `results` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `results` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `subjects` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `institutions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `body` to the `contents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `contents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `body` to the `exams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `exams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `body` to the `exercises` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentId` to the `exercises` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `exercises` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('BASIC', 'PREMIUM', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('INACTIVE', 'ACTIVE', 'SUSPENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('MOBILE_MONEY', 'BANK_TRANSFER', 'CASH', 'CREDIT_CARD', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('USER', 'ADMIN', 'TEACHER');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "contents" DROP CONSTRAINT "contents_authorId_fkey";

-- DropForeignKey
ALTER TABLE "contents" DROP CONSTRAINT "contents_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_institutionId_fkey";

-- DropForeignKey
ALTER TABLE "exams" DROP CONSTRAINT "exams_authorId_fkey";

-- DropForeignKey
ALTER TABLE "exams" DROP CONSTRAINT "exams_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "exercises" DROP CONSTRAINT "exercises_authorId_fkey";

-- DropForeignKey
ALTER TABLE "exercises" DROP CONSTRAINT "exercises_subjectId_fkey";

-- AlterTable
ALTER TABLE "contents" DROP COLUMN "authorId",
DROP COLUMN "content",
DROP COLUMN "description",
DROP COLUMN "likes",
DROP COLUMN "subjectId",
DROP COLUMN "type",
DROP COLUMN "views",
ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "description",
DROP COLUMN "institutionId";

-- AlterTable
ALTER TABLE "exams" DROP COLUMN "authorId",
DROP COLUMN "description",
DROP COLUMN "duration",
DROP COLUMN "endDate",
DROP COLUMN "startDate",
DROP COLUMN "subjectId",
ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "exercises" DROP COLUMN "authorId",
DROP COLUMN "description",
DROP COLUMN "difficulty",
DROP COLUMN "subjectId",
ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "contentId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "institutions" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT DEFAULT 'Moçambique',
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paidAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "correctAnswer",
DROP COLUMN "explanation",
DROP COLUMN "options",
DROP COLUMN "type";

-- AlterTable
ALTER TABLE "results" DROP COLUMN "completedAt",
DROP COLUMN "percentage",
DROP COLUMN "total";

-- AlterTable
ALTER TABLE "subjects" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phone" TEXT;

-- DropEnum
DROP TYPE "ContentType";

-- DropEnum
DROP TYPE "Difficulty";

-- DropEnum
DROP TYPE "QuestionType";

-- CreateTable
CREATE TABLE "pages" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "description" TEXT,
    "keywords" TEXT,
    "template" TEXT DEFAULT 'default',
    "showInMenu" BOOLEAN NOT NULL DEFAULT false,
    "menuOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_sections" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "settings" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "pageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "layout_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "html" TEXT NOT NULL,
    "css" TEXT,
    "thumbnail" TEXT,
    "config" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "layout_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institution_pages" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "layoutId" TEXT NOT NULL,
    "settings" JSONB,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "showInMenu" BOOLEAN NOT NULL DEFAULT false,
    "menuOrder" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoKeywords" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institution_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'BASIC',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'INACTIVE',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MZN',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MZN',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "method" "PaymentMethod" NOT NULL,
    "reference" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pages_slug_key" ON "pages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "layout_templates_name_key" ON "layout_templates"("name");

-- CreateIndex
CREATE UNIQUE INDEX "institution_pages_institutionId_slug_key" ON "institution_pages"("institutionId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_userId_key" ON "subscriptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "institutions_name_key" ON "institutions"("name");

-- AddForeignKey
ALTER TABLE "contents" ADD CONSTRAINT "contents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_pages" ADD CONSTRAINT "institution_pages_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_pages" ADD CONSTRAINT "institution_pages_layoutId_fkey" FOREIGN KEY ("layoutId") REFERENCES "layout_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
