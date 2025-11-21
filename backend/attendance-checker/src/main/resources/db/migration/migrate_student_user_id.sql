-- Migration script to fix student.user_id to reference users.user_id (UUID) instead of email
-- This script should be run BEFORE deploying the updated application code

-- IMPORTANT: Back up your database before running this migration!

-- Step 1: Add a temporary column to store the UUID
ALTER TABLE student ADD COLUMN user_id_temp VARCHAR(255);

-- Step 2: Populate the temporary column by joining with users table
-- This matches the current student.user_id (which contains email) to users.email
-- and fills in the UUID from users.user_id
UPDATE student s
SET user_id_temp = u.user_id
FROM users u
WHERE s."userId" = u.email;

-- Step 3: Verify that all students have been matched (optional but recommended)
-- This should return 0 rows if all students are properly matched
SELECT s.student_id, s."userId"
FROM student s
WHERE s.user_id_temp IS NULL;

-- Step 4: Drop the old user_id column (currently named "userId" in camelCase)
ALTER TABLE student DROP COLUMN "userId";

-- Step 5: Rename the temporary column to user_id
ALTER TABLE student RENAME COLUMN user_id_temp TO user_id;

-- Step 6: Make the column NOT NULL
ALTER TABLE student ALTER COLUMN user_id SET NOT NULL;

-- Step 7: Now we need to update the users table to make user_id the primary key
-- First, drop any existing foreign key constraints on student table
-- (This may vary depending on constraint names in your database)
-- ALTER TABLE student DROP CONSTRAINT IF EXISTS fk_student_user;

-- Drop the current primary key on users (email)
ALTER TABLE users DROP CONSTRAINT users_pkey;

-- Make email unique but not primary key
ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);

-- Set user_id as the new primary key
ALTER TABLE users ADD PRIMARY KEY (user_id);

-- Step 8: Add the foreign key constraint to student table
ALTER TABLE student ADD CONSTRAINT fk_student_user 
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

-- Step 9: Create an index on student.user_id for better query performance
CREATE INDEX IF NOT EXISTS idx_student_user_id ON student(user_id);

-- Migration complete!
-- The student table now properly references users by UUID instead of email
