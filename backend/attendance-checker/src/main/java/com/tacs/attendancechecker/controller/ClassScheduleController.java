package com.tacs.attendancechecker.controller;

import com.tacs.attendancechecker.entity.ClassSchedule;
import com.tacs.attendancechecker.service.ClassScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin(origins = "*")
public class ClassScheduleController {

    @Autowired
    private ClassScheduleService classScheduleService;

    @PostMapping
    public ResponseEntity<?> createSchedule(@RequestBody ClassSchedule schedule) {
        try {
            ClassSchedule created = classScheduleService.createSchedule(schedule);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.CONFLICT);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", "Internal server error"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<ClassSchedule>> getAllSchedules(@RequestParam(required = false) Boolean active) {
        try {
            List<ClassSchedule> schedules;
            if (active != null && active) {
                schedules = classScheduleService.getActiveSchedules();
            } else {
                schedules = classScheduleService.getAllSchedules();
            }
            return new ResponseEntity<>(schedules, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassSchedule> getScheduleById(@PathVariable("id") Integer scheduleId) {
        return classScheduleService.getScheduleById(scheduleId)
            .map(schedule -> new ResponseEntity<>(schedule, HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/day/{dayOfWeek}")
    public ResponseEntity<List<ClassSchedule>> getSchedulesByDay(@PathVariable("dayOfWeek") String dayOfWeek) {
        try {
            List<ClassSchedule> schedules = classScheduleService.getSchedulesByDayOfWeek(dayOfWeek);
            return new ResponseEntity<>(schedules, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<ClassSchedule>> getSchedulesByCourse(@PathVariable("courseId") Integer courseId) {
        try {
            List<ClassSchedule> schedules = classScheduleService.getSchedulesByCourse(courseId);
            return new ResponseEntity<>(schedules, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/check-conflicts")
    public ResponseEntity<List<ClassSchedule>> checkConflicts(@RequestBody Map<String, Object> request) {
        try {
            Integer classroomId = (Integer) request.get("classroomId");
            String dayOfWeek = (String) request.get("dayOfWeek");
            LocalTime startTime = LocalTime.parse((String) request.get("startTime"));
            LocalTime endTime = LocalTime.parse((String) request.get("endTime"));
            
            List<ClassSchedule> conflicts = classScheduleService.checkScheduleConflicts(
                classroomId, dayOfWeek, startTime, endTime
            );
            return new ResponseEntity<>(conflicts, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSchedule(
            @PathVariable("id") Integer scheduleId,
            @RequestBody ClassSchedule schedule) {
        try {
            ClassSchedule updated = classScheduleService.updateSchedule(scheduleId, schedule);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("conflict")) {
                return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.CONFLICT);
            }
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", "Internal server error"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteSchedule(@PathVariable("id") Integer scheduleId) {
        try {
            classScheduleService.deleteSchedule(scheduleId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<HttpStatus> deactivateSchedule(@PathVariable("id") Integer scheduleId) {
        try {
            classScheduleService.deactivateSchedule(scheduleId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete-all")
    public ResponseEntity<?> deleteAllSchedules() {
        try {
            classScheduleService.deleteAllSchedules();
            return ResponseEntity.ok(Map.of("message", "All schedules deleted successfully"));
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", "Error deleting all schedules: " + e.getMessage()), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
