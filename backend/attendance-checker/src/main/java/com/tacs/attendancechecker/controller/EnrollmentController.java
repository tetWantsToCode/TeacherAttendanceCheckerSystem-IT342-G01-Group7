package com.tacs.attendancechecker.controller;

import com.tacs.attendancechecker.dto.EnrollmentRequest;
import com.tacs.attendancechecker.entity.Enrollment;
import com.tacs.attendancechecker.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "*")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @PostMapping
    public ResponseEntity<?> createEnrollment(@RequestBody EnrollmentRequest request) {
        try {
            Enrollment enrollment = enrollmentService.createEnrollment(request);
            return ResponseEntity.ok(enrollment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error creating enrollment: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Enrollment>> getAllEnrollments() {
        List<Enrollment> enrollments = enrollmentService.getAllEnrollments();
        return ResponseEntity.ok(enrollments);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByStudent(@PathVariable Integer studentId) {
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByStudent(studentId);
        return ResponseEntity.ok(enrollments);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByCourse(@PathVariable Integer courseId) {
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByCourse(courseId);
        return ResponseEntity.ok(enrollments);
    }

    @PutMapping("/{enrollmentId}")
    public ResponseEntity<?> updateEnrollment(@PathVariable Integer enrollmentId,
                                             @RequestParam String status) {
        try {
            Enrollment enrollment = enrollmentService.updateEnrollment(enrollmentId, status);
            return ResponseEntity.ok(enrollment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error updating enrollment: " + e.getMessage());
        }
    }

    @DeleteMapping("/{enrollmentId}")
    public ResponseEntity<?> deleteEnrollment(@PathVariable Integer enrollmentId) {
        try {
            enrollmentService.deleteEnrollment(enrollmentId);
            return ResponseEntity.ok("Enrollment deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error deleting enrollment: " + e.getMessage());
        }
    }
}
