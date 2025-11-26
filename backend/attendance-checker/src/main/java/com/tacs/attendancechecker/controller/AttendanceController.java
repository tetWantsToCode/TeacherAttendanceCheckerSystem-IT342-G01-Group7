package com.tacs.attendancechecker.controller;

import com.tacs.attendancechecker.dto.*;
import com.tacs.attendancechecker.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    // Get all courses for a teacher
    @GetMapping("/teacher/{teacherId}/courses")
    public ResponseEntity<List<CourseResponse>> getTeacherCourses(@PathVariable String teacherId) {
        try {
            List<CourseResponse> courses = attendanceService.getTeacherCourses(teacherId);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get enrolled students for a course
    @GetMapping("/course/{courseId}/students")
    public ResponseEntity<List<EnrolledStudentResponse>> getEnrolledStudents(@PathVariable Integer courseId) {
        try {
            List<EnrolledStudentResponse> students = attendanceService.getEnrolledStudents(courseId);
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Mark attendance
    @PostMapping("/mark")
    public ResponseEntity<?> markAttendance(@RequestBody AttendanceRequest request) {
        try {
            AttendanceResponse response = attendanceService.markAttendance(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error marking attendance: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // Get attendance for a course on a specific date
    @GetMapping("/course/{courseId}/date/{date}")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceByDate(
            @PathVariable Integer courseId,
            @PathVariable String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            List<AttendanceResponse> attendances = attendanceService.getAttendanceByDate(courseId, localDate);
            return ResponseEntity.ok(attendances);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Get all attendance records for a course
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<AttendanceResponse>> getCourseAttendance(@PathVariable Integer courseId) {
        try {
            List<AttendanceResponse> attendances = attendanceService.getCourseAttendance(courseId);
            return ResponseEntity.ok(attendances);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get student's attendance for a specific course
    @GetMapping("/student/{studentId}/course/{courseId}")
    public ResponseEntity<List<AttendanceResponse>> getStudentAttendance(
            @PathVariable Integer studentId,
            @PathVariable Integer courseId) {
        try {
            List<AttendanceResponse> attendances = attendanceService.getStudentAttendance(studentId, courseId);
            return ResponseEntity.ok(attendances);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
