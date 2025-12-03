package com.tacs.attendancechecker.controller;

import com.tacs.attendancechecker.entity.OfferedCourse;
import com.tacs.attendancechecker.service.OfferedCourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offered-courses")
@CrossOrigin(origins = "*")
public class OfferedCourseController {

    @Autowired
    private OfferedCourseService offeredCourseService;

    @PostMapping
    public ResponseEntity<?> createOfferedCourse(@RequestBody OfferedCourse offeredCourse) {
        try {
            OfferedCourse createdOfferedCourse = offeredCourseService.createOfferedCourse(offeredCourse);
            return ResponseEntity.ok(createdOfferedCourse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error creating offered course: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<OfferedCourse>> getAllOfferedCourses() {
        List<OfferedCourse> offeredCourses = offeredCourseService.getAllOfferedCourses();
        return ResponseEntity.ok(offeredCourses);
    }

    @GetMapping("/{offeredCourseId}")
    public ResponseEntity<?> getOfferedCourseById(@PathVariable Integer offeredCourseId) {
        try {
            OfferedCourse offeredCourse = offeredCourseService.getOfferedCourseById(offeredCourseId);
            return ResponseEntity.ok(offeredCourse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Offered course not found: " + e.getMessage());
        }
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<OfferedCourse>> getOfferedCoursesByTeacher(@PathVariable String teacherId) {
        List<OfferedCourse> offeredCourses = offeredCourseService.getOfferedCoursesByTeacher(teacherId);
        return ResponseEntity.ok(offeredCourses);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<OfferedCourse>> getOfferedCoursesByCourseId(@PathVariable Integer courseId) {
        List<OfferedCourse> offeredCourses = offeredCourseService.getOfferedCoursesByCourseId(courseId);
        return ResponseEntity.ok(offeredCourses);
    }

    @PutMapping("/{offeredCourseId}")
    public ResponseEntity<?> updateOfferedCourse(@PathVariable Integer offeredCourseId, @RequestBody OfferedCourse offeredCourse) {
        try {
            OfferedCourse updatedOfferedCourse = offeredCourseService.updateOfferedCourse(offeredCourseId, offeredCourse);
            return ResponseEntity.ok(updatedOfferedCourse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error updating offered course: " + e.getMessage());
        }
    }

    @DeleteMapping("/{offeredCourseId}")
    public ResponseEntity<?> deleteOfferedCourse(@PathVariable Integer offeredCourseId) {
        try {
            offeredCourseService.deleteOfferedCourse(offeredCourseId);
            return ResponseEntity.ok("Offered course deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error deleting offered course: " + e.getMessage());
        }
    }
}
