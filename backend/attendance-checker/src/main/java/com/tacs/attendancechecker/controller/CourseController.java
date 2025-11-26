package com.tacs.attendancechecker.controller;

import com.tacs.attendancechecker.dto.CourseRequest;
import com.tacs.attendancechecker.dto.CourseResponse;
import com.tacs.attendancechecker.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody CourseRequest request) {
        try {
            System.out.println("Creating course with teacherId: " + request.getTeacherId());
            CourseResponse response = courseService.createCourse(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error creating course: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<CourseResponse>> getAllCourses() {
        List<CourseResponse> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<?> getCourseById(@PathVariable Integer courseId) {
        try {
            CourseResponse course = courseService.getCourseById(courseId);
            return ResponseEntity.ok(course);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Course not found: " + e.getMessage());
        }
    }

    @PutMapping("/{courseId}")
    public ResponseEntity<?> updateCourse(@PathVariable Integer courseId, 
                                         @RequestBody CourseRequest request) {
        try {
            CourseResponse response = courseService.updateCourse(courseId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error updating course: " + e.getMessage());
        }
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<?> deleteCourse(@PathVariable Integer courseId) {
        try {
            courseService.deleteCourse(courseId);
            return ResponseEntity.ok("Course deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error deleting course: " + e.getMessage());
        }
    }
}
