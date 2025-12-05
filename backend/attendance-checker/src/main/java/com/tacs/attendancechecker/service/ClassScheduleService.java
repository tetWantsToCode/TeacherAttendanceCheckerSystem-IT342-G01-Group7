package com.tacs.attendancechecker.service;

import com.tacs.attendancechecker.entity.ClassSchedule;
import com.tacs.attendancechecker.entity.OfferedCourse;
import com.tacs.attendancechecker.entity.Classroom;
import com.tacs.attendancechecker.repository.ClassScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class ClassScheduleService {

    @Autowired
    private ClassScheduleRepository classScheduleRepository;

    public ClassSchedule createSchedule(ClassSchedule schedule) {
        // Check for conflicts before creating
        List<ClassSchedule> conflicts = checkScheduleConflicts(
            schedule.getClassroom().getClassroomId(),
            schedule.getDayOfWeek(),
            schedule.getStartTime(),
            schedule.getEndTime()
        );
        
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Schedule conflict detected for this classroom and time slot");
        }
        
        return classScheduleRepository.save(schedule);
    }

    public List<ClassSchedule> getAllSchedules() {
        return classScheduleRepository.findAll();
    }

    public Optional<ClassSchedule> getScheduleById(Integer scheduleId) {
        return classScheduleRepository.findById(scheduleId);
    }

    public List<ClassSchedule> getSchedulesByOfferedCourse(OfferedCourse offeredCourse) {
        return classScheduleRepository.findByOfferedCourse(offeredCourse);
    }

    public List<ClassSchedule> getSchedulesByDayOfWeek(String dayOfWeek) {
        return classScheduleRepository.findByDayOfWeek(dayOfWeek);
    }

    public List<ClassSchedule> getSchedulesByCourse(Integer courseId) {
        return classScheduleRepository.findByOfferedCourseCourseCourseId(courseId);
    }

    public List<ClassSchedule> getSchedulesByClassroom(Classroom classroom) {
        return classScheduleRepository.findByClassroom(classroom);
    }

    public List<ClassSchedule> getActiveSchedules() {
        return classScheduleRepository.findByIsActive(true);
    }

    public List<ClassSchedule> checkScheduleConflicts(Integer classroomId, String dayOfWeek, 
                                                      LocalTime startTime, LocalTime endTime) {
        return classScheduleRepository.findConflictingSchedules(classroomId, dayOfWeek, startTime, endTime);
    }

    public ClassSchedule updateSchedule(Integer scheduleId, ClassSchedule updatedSchedule) {
        return classScheduleRepository.findById(scheduleId)
            .map(schedule -> {
                // Check for conflicts if changing time/classroom
                if (!schedule.getClassroom().equals(updatedSchedule.getClassroom()) ||
                    !schedule.getDayOfWeek().equals(updatedSchedule.getDayOfWeek()) ||
                    !schedule.getStartTime().equals(updatedSchedule.getStartTime()) ||
                    !schedule.getEndTime().equals(updatedSchedule.getEndTime())) {
                    
                    List<ClassSchedule> conflicts = classScheduleRepository.findConflictingSchedules(
                        updatedSchedule.getClassroom().getClassroomId(),
                        updatedSchedule.getDayOfWeek(),
                        updatedSchedule.getStartTime(),
                        updatedSchedule.getEndTime()
                    );
                    
                    // Remove current schedule from conflicts list
                    conflicts.removeIf(s -> s.getScheduleId().equals(scheduleId));
                    
                    if (!conflicts.isEmpty()) {
                        throw new RuntimeException("Schedule conflict detected for this classroom and time slot");
                    }
                }
                
                schedule.setOfferedCourse(updatedSchedule.getOfferedCourse());
                schedule.setDayOfWeek(updatedSchedule.getDayOfWeek());
                schedule.setStartTime(updatedSchedule.getStartTime());
                schedule.setEndTime(updatedSchedule.getEndTime());
                schedule.setClassroom(updatedSchedule.getClassroom());
                schedule.setIsActive(updatedSchedule.getIsActive());
                return classScheduleRepository.save(schedule);
            })
            .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + scheduleId));
    }

    public void deleteSchedule(Integer scheduleId) {
        classScheduleRepository.deleteById(scheduleId);
    }

    public void deactivateSchedule(Integer scheduleId) {
        classScheduleRepository.findById(scheduleId)
            .ifPresent(schedule -> {
                schedule.setIsActive(false);
                classScheduleRepository.save(schedule);
            });
    }
}
