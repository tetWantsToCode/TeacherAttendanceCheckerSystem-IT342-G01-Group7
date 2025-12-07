# Teacher Attendance System - Implementation Plan

## Current Status Assessment

### ✅ Already Implemented

1. **Basic Authentication** - Login/Register with JWT
2. **User Management** - Admin can add/remove students, teachers
3. **Course Management** - Create courses, assign teachers
4. **Class Schedules** - Schedule management system
5. **Attendance Sessions** - Session-based attendance tracking
6. **My Classes** - Teacher view of enrolled students
7. **Enrollment System** - Enroll students in courses
8. **Basic CRUD Operations** - For all entities

### ❌ Missing Features (To Implement)

## ADMIN SIDE Requirements

### 1. Real-Time Monitoring Dashboard ❌

**What's Needed:**

- Dashboard showing total students present/absent per day
- Class attendance summaries
- Teacher activity logs
- Late and absent trends
- Visual charts and graphs

**Files to Create/Modify:**

- `/web/tacs-app/src/pages/AdminDashboard.jsx` - Add analytics section
- `/backend/.../controller/AnalyticsController.java` - NEW
- `/backend/.../service/AnalyticsService.java` - NEW

### 2. Automated Reports ❌

**What's Needed:**

- Daily attendance summary
- Monthly attendance report
- Per-student attendance history
- Per-class attendance report
- Export to PDF, Excel, CSV

**Files to Create:**

- `/backend/.../controller/ReportController.java` - NEW
- `/backend/.../service/ReportService.java` - NEW
- `/web/tacs-app/src/pages/Reports.jsx` - NEW
- Add dependencies: Apache POI (Excel), iText (PDF)

### 3. Notification & Alerts System ❌

**What's Needed:**

- SMS/Email/In-app notifications
- Alert for frequently absent students
- Alert for missed teacher submissions
- Notification preferences

**Files to Create:**

- `/backend/.../controller/NotificationController.java` - NEW
- `/backend/.../service/NotificationService.java` - NEW
- `/backend/.../service/EmailService.java` - NEW
- `/backend/.../entity/Notification.java` - NEW
- `/web/tacs-app/src/components/NotificationBell.jsx` - NEW

### 4. Audit Logs ❌

**What's Needed:**

- Track who edited what
- Timestamp all changes
- View audit history

**Files to Create:**

- `/backend/.../entity/AuditLog.java` - NEW
- `/backend/.../repository/AuditLogRepository.java` - NEW
- `/backend/.../service/AuditService.java` - NEW
- `/backend/.../aspect/AuditAspect.java` - NEW (using AOP)

### 5. Backup & Restore ❌

**Files to Create:**

- `/backend/.../controller/BackupController.java` - NEW
- `/backend/.../service/BackupService.java` - NEW

## TEACHER SIDE Requirements

### 6. Quick Attendance Features ❌

**What's Needed:**

- "Mark All Present" button
- Offline mode (cache + sync)
- Quick status toggles

**Files to Modify:**

- `/web/tacs-app/src/pages/TeacherAttendanceSession.jsx` - Add quick actions

### 7. Student Profile View ❌

**What's Needed:**

- Previous absences
- Notes
- Guardian information

**Files to Create:**

- `/web/tacs-app/src/components/StudentProfileModal.jsx` - NEW

### 8. Upload Evidence ❌

**What's Needed:**

- Photo upload for attendance
- Document attachments

**Files to Create:**

- `/backend/.../controller/FileUploadController.java` - NEW
- `/backend/.../service/FileStorageService.java` - NEW
- Add dependency: MultipartFile handling

### 9. Teacher Analytics ❌

**What's Needed:**

- Class attendance trends
- Frequently absent students list
- Charts and graphs

**Files to Create:**

- `/web/tacs-app/src/pages/TeacherAnalytics.jsx` - NEW

## STUDENT SIDE Requirements

### 10. Clear Attendance History ✅ (Partially Done)

**What Exists:**

- Basic attendance view
  **What's Missing:**
- Heatmap visualization
- Percentage breakdowns
- Goals tracking

**Files to Modify:**

- `/web/tacs-app/src/pages/StudentDashboard.jsx`
- `/web/tacs-app/src/pages/StudentAttendance.jsx`

### 11. Student Notifications ❌

**What's Needed:**

- Notification when marked absent
- Low attendance alerts
- Correction request status updates

**Files to Create:**

- `/web/tacs-app/src/components/StudentNotifications.jsx` - NEW

### 12. Correction Requests ❌

**What's Needed:**

- Request attendance adjustment
- Upload proof (medical cert)
- Teacher/Admin approval workflow

**Files to Create:**

- `/backend/.../entity/AttendanceCorrection.java` - NEW
- `/backend/.../controller/AttendanceCorrectionController.java` - NEW
- `/backend/.../service/AttendanceCorrectionService.java` - NEW
- `/web/tacs-app/src/pages/AttendanceCorrections.jsx` - NEW

### 13. Student Insights ❌

**What's Needed:**

- Attendance heatmap
- Goal setting/tracking
- Progress visualization

**Files to Create:**

- `/web/tacs-app/src/components/AttendanceHeatmap.jsx` - NEW
- `/web/tacs-app/src/components/AttendanceGoals.jsx` - NEW

## Priority Implementation Order

### Phase 1 - Critical (Fix Login & Core Features)

1. ✅ Fix login issue - Add test users to database
2. ✅ Verify all existing CRUD operations work
3. Add "Mark All Present" quick action
4. Add basic attendance statistics to dashboards

### Phase 2 - Admin Analytics

1. Create AnalyticsController & Service
2. Build Admin Dashboard analytics section
3. Implement basic reports (daily/monthly)
4. Add export to Excel/PDF

### Phase 3 - Notifications

1. Create Notification entity & system
2. Implement email service
3. Add notification bell component
4. Create notification preferences

### Phase 4 - Student Features

1. Attendance correction request system
2. Student notifications
3. Attendance heatmap
4. Goals tracking

### Phase 5 - Advanced Features

1. Audit logs
2. Backup/restore
3. File uploads
4. Offline mode

## Database Schema Additions Needed

```sql
-- Notifications table
CREATE TABLE notification (
    notification_id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES "user"(user_id),
    type VARCHAR(50),
    title VARCHAR(255),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance Corrections table
CREATE TABLE attendance_correction (
    correction_id SERIAL PRIMARY KEY,
    attendance_id INTEGER REFERENCES attendance(attendance_id),
    student_id INTEGER REFERENCES student(student_id),
    requested_status VARCHAR(20),
    reason TEXT,
    proof_file_path VARCHAR(500),
    status VARCHAR(20) DEFAULT 'PENDING',
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs table
CREATE TABLE audit_log (
    log_id SERIAL PRIMARY KEY,
    user_id VARCHAR(255),
    action VARCHAR(100),
    entity_type VARCHAR(100),
    entity_id VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- File Uploads table
CREATE TABLE file_upload (
    file_id SERIAL PRIMARY KEY,
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    file_type VARCHAR(50),
    uploaded_by VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    related_entity_type VARCHAR(100),
    related_entity_id INTEGER
);
```

## Dependencies to Add to pom.xml

```xml
<!-- Email Support -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>

<!-- Excel Export -->
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>5.2.3</version>
</dependency>

<!-- PDF Export -->
<dependency>
    <groupId>com.itextpdf</groupId>
    <artifactId>itext7-core</artifactId>
    <version>7.2.5</version>
    <type>pom</type>
</dependency>

<!-- File Upload -->
<dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
    <version>2.11.0</version>
</dependency>

<!-- Scheduling for automated reports -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-quartz</artifactId>
</dependency>
```

## Quick Wins to Implement First

1. **Add test user data** - So login works immediately
2. **"Mark All Present" button** - Simple UI addition
3. **Basic statistics cards** - Count present/absent for today
4. **Export to CSV** - Simpler than Excel/PDF to start
5. **In-app notifications** - Easier than email/SMS

## Notes

- The system has good foundation already implemented
- Main gaps are analytics, reporting, and notification features
- Student-facing features need the most work
- Backend is well-structured for additions
