package com.tacs.attendancechecker.controller;

import com.tacs.attendancechecker.dto.AttendanceReportDTO;
import com.tacs.attendancechecker.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin
public class ReportController {

    @Autowired
    private ReportService reportService;

    /**
     * Get daily attendance report for a specific date
     * 
     * @param date The date in format yyyy-MM-dd
     * @return Report with summary and detailed records
     */
    @GetMapping("/daily/{date}")
    public ResponseEntity<?> getDailyReport(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            AttendanceReportDTO report = reportService.generateDailyReport(date);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to generate daily report: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get monthly attendance report
     * 
     * @param month The month in format yyyy-MM
     * @return Report with summary and aggregated data
     */
    @GetMapping("/monthly/{month}")
    public ResponseEntity<?> getMonthlyReport(
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM") YearMonth month) {
        try {
            AttendanceReportDTO report = reportService.generateMonthlyReport(month);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to generate monthly report: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get attendance report for a specific course
     * 
     * @param courseId The course ID
     * @return Report with all attendance records for the course
     */
    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getCourseReport(@PathVariable Integer courseId) {
        try {
            AttendanceReportDTO report = reportService.generateCourseReport(courseId);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to generate course report: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get attendance report for a specific student
     * 
     * @param studentId The student ID
     * @return Report with all attendance records for the student
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentReport(@PathVariable Integer studentId) {
        try {
            AttendanceReportDTO report = reportService.generateStudentReport(studentId);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to generate student report: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get dashboard statistics for admin overview
     * 
     * @return Real-time statistics
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            Map<String, Object> stats = reportService.getDashboardStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch dashboard statistics: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
