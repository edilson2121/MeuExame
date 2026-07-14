-- Plans requested by the product: daily, weekly, monthly.
ALTER TYPE "SubscriptionPlan" RENAME TO "SubscriptionPlan_old";
CREATE TYPE "SubscriptionPlan" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');
ALTER TABLE "subscriptions" ALTER COLUMN "plan" DROP DEFAULT;
ALTER TABLE "subscriptions"
  ALTER COLUMN "plan" TYPE "SubscriptionPlan"
  USING (
    CASE "plan"::text
      WHEN 'BASIC' THEN 'DAILY'
      WHEN 'PREMIUM' THEN 'WEEKLY'
      WHEN 'ENTERPRISE' THEN 'MONTHLY'
      ELSE 'MONTHLY'
    END
  )::"SubscriptionPlan";
ALTER TABLE "subscriptions" ALTER COLUMN "plan" SET DEFAULT 'DAILY';
DROP TYPE "SubscriptionPlan_old";

-- Restore institution/course/subject relationships without forcing existing rows.
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "institutionId" TEXT;

ALTER TABLE "subjects" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "subjects" ADD COLUMN IF NOT EXISTS "institutionId" TEXT;
ALTER TABLE "subjects" ALTER COLUMN "courseId" DROP NOT NULL;

ALTER TABLE "contents" ADD COLUMN IF NOT EXISTS "subjectId" TEXT;
ALTER TABLE "exercises" ADD COLUMN IF NOT EXISTS "subjectId" TEXT;

-- Exam publishing, institution ownership, images and explanations.
ALTER TABLE "exams" ALTER COLUMN "body" DROP NOT NULL;
ALTER TABLE "exams" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "exams" ADD COLUMN IF NOT EXISTS "instructions" TEXT;
ALTER TABLE "exams" ADD COLUMN IF NOT EXISTS "durationMinutes" INTEGER;
ALTER TABLE "exams" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE "exams" ADD COLUMN IF NOT EXISTS "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT';
ALTER TABLE "exams" ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3);
ALTER TABLE "exams" ADD COLUMN IF NOT EXISTS "isPaidRequired" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "exams" ADD COLUMN IF NOT EXISTS "institutionId" TEXT;
ALTER TABLE "exams" ADD COLUMN IF NOT EXISTS "subjectId" TEXT;

ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "options" JSONB;
ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "correctAnswer" TEXT;
ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "explanation" TEXT;

ALTER TABLE "results" ADD COLUMN IF NOT EXISTS "totalQuestions" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "results" ADD COLUMN IF NOT EXISTS "correctAnswers" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "results" ADD COLUMN IF NOT EXISTS "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "results" ADD COLUMN IF NOT EXISTS "answers" JSONB;
ALTER TABLE "results" ADD COLUMN IF NOT EXISTS "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE "exam_questions" (
  "id" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "imageUrl" TEXT,
  "points" DOUBLE PRECISION NOT NULL DEFAULT 1,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "examId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "exam_questions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "exam_options" (
  "id" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "imageUrl" TEXT,
  "isCorrect" BOOLEAN NOT NULL DEFAULT false,
  "explanation" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "questionId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "exam_options_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "courses"
  ADD CONSTRAINT "courses_institutionId_fkey"
  FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "subjects"
  ADD CONSTRAINT "subjects_institutionId_fkey"
  FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "contents"
  ADD CONSTRAINT "contents_subjectId_fkey"
  FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "exercises"
  ADD CONSTRAINT "exercises_subjectId_fkey"
  FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "exams"
  ADD CONSTRAINT "exams_institutionId_fkey"
  FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "exams"
  ADD CONSTRAINT "exams_subjectId_fkey"
  FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "exam_questions"
  ADD CONSTRAINT "exam_questions_examId_fkey"
  FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "exam_options"
  ADD CONSTRAINT "exam_options_questionId_fkey"
  FOREIGN KEY ("questionId") REFERENCES "exam_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "exams_institutionId_idx" ON "exams"("institutionId");
CREATE INDEX "exams_subjectId_idx" ON "exams"("subjectId");
CREATE INDEX "exam_questions_examId_idx" ON "exam_questions"("examId");
CREATE INDEX "exam_options_questionId_idx" ON "exam_options"("questionId");
