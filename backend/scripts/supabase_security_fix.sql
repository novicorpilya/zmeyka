-- Supabase Security Migration: Enable Row Level Security (RLS)
-- This script fixes the 'RLS Disabled' and 'Sensitive Columns Exposed' errors.
-- Idempotent version: can be run multiple times.

-- 1. Enable RLS for all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserActivity" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Course" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Lesson" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Module" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Question" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Homework" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Comment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserStats" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserProgress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Quiz" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CodeExecutionLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TeacherProfile" ENABLE ROW LEVEL SECURITY;

-- 2. Define READ policies for the Public/Frontend

-- COURSE: Consolidated SELECT policy for performance
DROP POLICY IF EXISTS "Allow public read-only access to published courses" ON "Course";
DROP POLICY IF EXISTS "Teachers can manage their own courses" ON "Course";
DROP POLICY IF EXISTS "Course_access" ON "Course";
DROP POLICY IF EXISTS "Course_delete_policy" ON "Course";
DROP POLICY IF EXISTS "Course_write_policy" ON "Course";
DROP POLICY IF EXISTS "Course_update_policy" ON "Course";
DROP POLICY IF EXISTS "Course_select_policy" ON "Course";
DROP POLICY IF EXISTS "Course_insert_policy" ON "Course";

CREATE POLICY "Course_select_policy" 
ON "Course" FOR SELECT 
USING ("isPublished" = true OR (SELECT auth.uid())::text = "teacherId");

CREATE POLICY "Course_insert_policy" 
ON "Course" FOR INSERT 
WITH CHECK ((SELECT auth.uid())::text = "teacherId");

CREATE POLICY "Course_update_policy" 
ON "Course" FOR UPDATE 
USING ((SELECT auth.uid())::text = "teacherId")
WITH CHECK ((SELECT auth.uid())::text = "teacherId");

CREATE POLICY "Course_delete_policy" 
ON "Course" FOR DELETE 
USING ((SELECT auth.uid())::text = "teacherId");

-- USER: Consolidate access
DROP POLICY IF EXISTS "Users can see their own profile" ON "User";
DROP POLICY IF EXISTS "User_access" ON "User";
CREATE POLICY "Users can see their own profile" 
ON "User" FOR SELECT 
USING ((SELECT auth.uid())::text = id);

-- 3. Additional policies for Students to see their own data

DROP POLICY IF EXISTS "Students can see their own stats" ON "UserStats";
DROP POLICY IF EXISTS "UserStats_access" ON "UserStats";
CREATE POLICY "Students can see their own stats" 
ON "UserStats" FOR SELECT 
USING ((SELECT auth.uid())::text = "userId");

DROP POLICY IF EXISTS "Students can see their own progress" ON "UserProgress";
DROP POLICY IF EXISTS "UserProgress_access" ON "UserProgress";
CREATE POLICY "Students can see their own progress" 
ON "UserProgress" FOR SELECT 
USING ((SELECT auth.uid())::text = "userId");

-- 4. HOMEWORK: Consolidated SELECT policy
DROP POLICY IF EXISTS "Students can see their own homework" ON "Homework";
DROP POLICY IF EXISTS "Teachers can see homework for their courses" ON "Homework";
DROP POLICY IF EXISTS "Homework_access" ON "Homework";
DROP POLICY IF EXISTS "Homework_select_policy" ON "Homework";

CREATE POLICY "Homework_select_policy" 
ON "Homework" FOR SELECT 
USING (
  (SELECT auth.uid())::text = "studentId"
  OR 
  EXISTS (
    SELECT 1 FROM "Course"
    WHERE "Course".id = "Homework"."courseId"
    AND "Course"."teacherId" = (SELECT auth.uid())::text
  )
);

-- 5. Additional Security Fixes for missing tables (Linter-0013 + Performance fixes)

-- CodeExecutionLog: Users can see their own logs
DROP POLICY IF EXISTS "Users can see their own execution logs" ON "CodeExecutionLog";
CREATE POLICY "Users can see their own execution logs"
ON "CodeExecutionLog" FOR SELECT
USING ((SELECT auth.uid())::text = "userId");

-- Notification: Users can see and update their own notifications
DROP POLICY IF EXISTS "Users can see their own notifications" ON "Notification";
DROP POLICY IF EXISTS "Users can update their own notifications" ON "Notification";
CREATE POLICY "Users can see their own notifications"
ON "Notification" FOR SELECT
USING ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can update their own notifications"
ON "Notification" FOR UPDATE
USING ((SELECT auth.uid())::text = "userId");

-- Payment: Users can see their own payments
DROP POLICY IF EXISTS "Users can see their own payments" ON "Payment";
CREATE POLICY "Users can see their own payments"
ON "Payment" FOR SELECT
USING ((SELECT auth.uid())::text = "userId");

-- TeacherProfile: Consolidated SELECT policy
DROP POLICY IF EXISTS "Teacher profiles are publicly readable" ON "TeacherProfile";
DROP POLICY IF EXISTS "Teachers can update their own profile" ON "TeacherProfile";
DROP POLICY IF EXISTS "TeacherProfile_select_policy" ON "TeacherProfile";
DROP POLICY IF EXISTS "TeacherProfile_insert_policy" ON "TeacherProfile";
DROP POLICY IF EXISTS "TeacherProfile_update_policy" ON "TeacherProfile";
DROP POLICY IF EXISTS "TeacherProfile_delete_policy" ON "TeacherProfile";

CREATE POLICY "TeacherProfile_select_policy"
ON "TeacherProfile" FOR SELECT
USING (true);

CREATE POLICY "TeacherProfile_insert_policy"
ON "TeacherProfile" FOR INSERT
WITH CHECK ((SELECT auth.uid())::text = "userId");

CREATE POLICY "TeacherProfile_update_policy"
ON "TeacherProfile" FOR UPDATE
USING ((SELECT auth.uid())::text = "userId")
WITH CHECK ((SELECT auth.uid())::text = "userId");

CREATE POLICY "TeacherProfile_delete_policy"
ON "TeacherProfile" FOR DELETE
USING ((SELECT auth.uid())::text = "userId");

-- 6. Infrastructure & Extension Security (Linter 0011, 0014)

-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move vector extension to extensions schema (Linter 0014)
-- This keeps the public schema clean and secure
DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'vector') THEN
    ALTER EXTENSION "vector" SET SCHEMA extensions;
  END IF;
END $$;

-- Fix Function Search Path (Security Linter 0011)
-- Setting an explicit search_path prevents "search_path hijacking" attacks.
-- We use public and extensions to ensure it can still find the vector type.
-- Note: If you have different arguments, adjust the signature accordingly.
DO $$
BEGIN
  -- Common signature for match_documents
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'match_documents') THEN
    EXECUTE 'ALTER FUNCTION public.match_documents(vector, float, int) SET search_path = public, extensions';
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- Fallback if signature differs (log it or handle gracefully)
  RAISE NOTICE 'Could not set search_path for match_documents: %', SQLERRM;
END $$;
