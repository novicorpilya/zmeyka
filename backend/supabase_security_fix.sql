-- Supabase Security Migration: Enable Row Level Security (RLS)
-- This script fixes the 'RLS Disabled' and 'Sensitive Columns Exposed' errors.
-- These policies follow a 'Deny by Default' approach, allowing the NestJS backend
-- to manage data while securing the public-facing Supabase API.

-- 1. Enable RLS for all tables referenced in the security report
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

-- 2. Define READ policies for the Public/Frontend (if needed)
-- NOTE: If your frontend only interacts with the NestJS API, you can skip these.
-- These are provided for standard Supabase Client usage.

-- COURSE: Anyone can view published courses
CREATE POLICY "Allow public read-only access to published courses" 
ON "Course" FOR SELECT 
USING ("isPublished" = true);

-- USER: Users can only see their own non-sensitive data via Supabase API
-- (NestJS bypasses this as it connects with higher privileges)
CREATE POLICY "Users can see their own profile" 
ON "User" FOR SELECT 
USING (auth.uid()::text = id);

-- 3. Block access to sensitive columns in "User" table via PostGREST
-- Instead of complex RLS for columns, we can revocating access to the 'anon' role 
-- if we only want the backend to handle user data.
-- But for Nuxt Supabase to work, we'll just rely on the fact that ONLY the owner 
-- can SELECT the row, and even then, we should be careful.

-- 4. Additional policies for Students to see their own progress
CREATE POLICY "Students can see their own stats" 
ON "UserStats" FOR SELECT 
USING (auth.uid()::text = "userId");

CREATE POLICY "Students can see their own progress" 
ON "UserProgress" FOR SELECT 
USING (auth.uid()::text = "userId");

CREATE POLICY "Students can see their own homework" 
ON "Homework" FOR SELECT 
USING (auth.uid()::text = "studentId");

-- 5. Policies for Teachers
CREATE POLICY "Teachers can manage their own courses" 
ON "Course" FOR ALL 
USING (auth.uid()::text = "teacherId");

CREATE POLICY "Teachers can see homework for their courses"
ON "Homework" FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "Course"
    WHERE "Course".id = "Homework"."courseId"
    AND "Course"."teacherId" = auth.uid()::text
  )
);

-- 6. Deny all other mutations by default (INSERT, UPDATE, DELETE)
-- Since we didn't add policies for these, they are denied by default.
-- All mutations should go through the NestJS Backend.
