package com.tacs.attendancechecker.controller;

import com.tacs.attendancechecker.entity.AttendanceSession;
import com.tacs.attendancechecker.service.AttendanceSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance-sessions")
@CrossOrigin(origins = "*")
public class AttendanceSessionController {

    @Autowired
    private AttendanceSessionService attendanceSessionService;

    @PostMapping
    public ResponseEntity<?> createAttendanceSession(@RequestBody AttendanceSession attendanceSession) {
        try {
            AttendanceSession createdSession = attendanceSessionService.createAttendanceSession(attendanceSession);
            return ResponseEntity.ok(createdSession);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error creating attendance session: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<AttendanceSession>> getAllAttendanceSessions() {
        List<AttendanceSession> sessions = attendanceSessionService.getAllAttendanceSessions();
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<?> getAttendanceSessionById(@PathVariable Integer sessionId) {
        try {
            AttendanceSession session = attendanceSessionService.getAttendanceSessionById(sessionId);
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Attendance session not found: " + e.getMessage());
        }
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<AttendanceSession>> getAttendanceSessionsByCourse(@PathVariable Integer courseId) {
        List<AttendanceSession> sessions = attendanceSessionService.getAttendanceSessionsByCourse(courseId);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<AttendanceSession>> getAttendanceSessionsByTeacher(@PathVariable String teacherId) {
        List<AttendanceSession> sessions = attendanceSessionService.getAttendanceSessionsByTeacher(teacherId);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/course/{courseId}/date/{date}")
    public ResponseEntity<List<AttendanceSession>> getAttendanceSessionsByCourseAndDate(
            @PathVariable Integer courseId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<AttendanceSession> sessions = attendanceSessionService.getAttendanceSessionsByCourseAndDate(courseId, date);
        return ResponseEntity.ok(sessions);
    }

    @PutMapping("/{sessionId}")
    public ResponseEntity<?> updateAttendanceSession(@PathVariable Integer sessionId, @RequestBody AttendanceSession attendanceSession) {
        try {
            AttendanceSession updatedSession = attendanceSessionService.updateAttendanceSession(sessionId, attendanceSession);
            return ResponseEntity.ok(updatedSession);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error updating attendance session: " + e.getMessage());
        }
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<?> deleteAttendanceSession(@PathVariable Integer sessionId) {
        try {
            attendanceSessionService.deleteAttendanceSession(sessionId);
            return ResponseEntity.ok("Attendance session deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error deleting attendance session: " + e.getMessage());
        }
    }
}
