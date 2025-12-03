package com.tacs.attendancechecker.controller;

import com.tacs.attendancechecker.entity.Classroom;
import com.tacs.attendancechecker.service.ClassroomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classrooms")
@CrossOrigin(origins = "*")
public class ClassroomController {

    @Autowired
    private ClassroomService classroomService;

    @PostMapping
    public ResponseEntity<?> createClassroom(@RequestBody Classroom classroom) {
        try {
            Classroom createdClassroom = classroomService.createClassroom(classroom);
            return ResponseEntity.ok(createdClassroom);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error creating classroom: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Classroom>> getAllClassrooms() {
        List<Classroom> classrooms = classroomService.getAllClassrooms();
        return ResponseEntity.ok(classrooms);
    }

    @GetMapping("/{classroomId}")
    public ResponseEntity<?> getClassroomById(@PathVariable Integer classroomId) {
        try {
            Classroom classroom = classroomService.getClassroomById(classroomId);
            return ResponseEntity.ok(classroom);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Classroom not found: " + e.getMessage());
        }
    }

    @PutMapping("/{classroomId}")
    public ResponseEntity<?> updateClassroom(@PathVariable Integer classroomId, @RequestBody Classroom classroom) {
        try {
            Classroom updatedClassroom = classroomService.updateClassroom(classroomId, classroom);
            return ResponseEntity.ok(updatedClassroom);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error updating classroom: " + e.getMessage());
        }
    }

    @DeleteMapping("/{classroomId}")
    public ResponseEntity<?> deleteClassroom(@PathVariable Integer classroomId) {
        try {
            classroomService.deleteClassroom(classroomId);
            return ResponseEntity.ok("Classroom deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error deleting classroom: " + e.getMessage());
        }
    }
}
