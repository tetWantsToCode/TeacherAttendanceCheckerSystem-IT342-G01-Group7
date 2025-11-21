# Database Migration Guide: Student User ID Fix

## Overview
This migration fixes the improper user_id referencing in the student table. Previously, `student.user_id` stored the user's email, but it should store the user's UUID (the PK from `users.user_id`).

## Migration Steps

### Prerequisites
1. **IMPORTANT**: Back up your database before running this migration!
2. Stop the application server
3. Connect to your PostgreSQL database
4. **Check your column names** - The old foreign key column might be named `userid` (lowercase) or `"userId"` (camelCase with quotes)

### Determining Your Column Names

Before running the migration, check your actual column names:

```sql
SELECT column_name FROM information_schema.columns WHERE table_name = 'student';
```

### Running the Migration

**IMPORTANT**: Before running the migration script, you must edit it to use the correct column name for your database schema. The script provides two options (Option A for lowercase `userid` and Option B for `"userId"`). Choose the appropriate one based on your column names check above.

After editing the script with the correct column names, execute it:

```bash
psql -h localhost -U tacs_user -d attendance_checker -f migrate_student_user_id.sql
```

**Note**: The migration script contains commented alternatives. Uncomment the correct option for your schema.

### What the Migration Does

1. **Adds a temporary column** (`user_id_temp`) to the student table
2. **Populates the temporary column** by joining with the users table, matching email to UUID
3. **Verifies data integrity** - checks that all students are properly matched
4. **Drops the old user_id column** (which contained emails)
5. **Renames** the temporary column to `user_id`
6. **Updates the users table** to make `user_id` the primary key instead of `email`
7. **Adds a foreign key constraint** from `student.user_id` to `users.user_id`
8. **Creates an index** on `student.user_id` for performance

### After Migration

1. The `users.user_id` column is now the primary key (UUID)
2. The `users.email` column is now a unique constraint (not primary key)
3. The `student.user_id` column now properly references `users.user_id` (UUID)
4. All foreign key constraints are properly established

### Code Changes

The following entity classes have been updated:

- **User.java**: Changed `@Id` from `email` to `userId`
- **Student.java**: Updated `@JoinColumn` to reference `user_id` column properly

### Important Notes for Developers

After this migration:

1. **Admin and registration logic** must always use the user's UUID for the student table's FK, not the email
2. The `UserRepository` still provides `findByEmail()` and `existsByEmail()` methods for authentication
3. All new student records will automatically use UUID references
4. The primary key for User is now `userId` (UUID), not `email`

### Rollback (if needed)

If you need to rollback this migration:

1. Restore from your database backup
2. Revert the code changes to the User and Student entities

### Verification

After migration, verify the changes:

```sql
-- Check users table structure
\d users

-- Check student table structure
\d student

-- Verify foreign key constraints
SELECT conname, conrelid::regclass, confrelid::regclass
FROM pg_constraint
WHERE conname = 'fk_student_user';

-- Check sample data
SELECT s.student_id, s.user_id, u.user_id, u.email
FROM student s
JOIN users u ON s.user_id = u.user_id
LIMIT 5;
```

## Support

If you encounter any issues during migration, please:
1. Check the database logs for errors
2. Verify that all students have matching users
3. Ensure no duplicate UUIDs exist in the users table
