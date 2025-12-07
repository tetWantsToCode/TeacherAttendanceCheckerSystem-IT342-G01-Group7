package com.tacs.attendancechecker.controller;

import com.tacs.attendancechecker.dto.TeacherRegistrationRequest;
import com.tacs.attendancechecker.entity.Teacher;
import com.tacs.attendancechecker.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/teachers")
@CrossOrigin
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    @GetMapping
    public ResponseEntity<?> getAllTeachers() {
        try {
            return ResponseEntity.ok(teacherService.getAllTeachers());
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching teachers: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping
    public ResponseEntity<?> addTeacher(@RequestBody TeacherRegistrationRequest request) {
        try {
            Teacher teacher = teacherService.addTeacher(
                    request.getFname(),
                    request.getLname(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getDepartmentId());
            return ResponseEntity.ok(teacher);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error adding teacher: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/{teacherId}")
    public ResponseEntity<?> deleteTeacher(@PathVariable String teacherId) {
        try {
            teacherService.deleteTeacher(teacherId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Teacher deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}