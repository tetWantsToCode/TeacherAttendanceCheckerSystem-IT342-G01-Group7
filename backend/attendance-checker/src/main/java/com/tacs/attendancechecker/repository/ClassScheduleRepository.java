package com.tacs.attendancechecker.repository;

import com.tacs.attendancechecker.entity.ClassSchedule;
import com.tacs.attendancechecker.entity.OfferedCourse;
import com.tacs.attendancechecker.entity.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface ClassScheduleRepository extends JpaRepository<ClassSchedule, Integer> {
    List<ClassSchedule> findByOfferedCourse(OfferedCourse offeredCourse);
    List<ClassSchedule> findByOfferedCourseCourseCourseId(Integer courseId);
    List<ClassSchedule> findByDayOfWeek(String dayOfWeek);
    List<ClassSchedule> findByClassroom(Classroom classroom);
    List<ClassSchedule> findByIsActive(Boolean isActive);
    
    // Check for schedule conflicts
    @Query("SELECT cs FROM ClassSchedule cs WHERE cs.classroom.classroomId = :classroomId " +
           "AND cs.dayOfWeek = :dayOfWeek " +
           "AND cs.isActive = true " +
           "AND ((cs.startTime < :endTime AND cs.endTime > :startTime))")
    List<ClassSchedule> findConflictingSchedules(
        @Param("classroomId") Integer classroomId,
        @Param("dayOfWeek") String dayOfWeek,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime
    );
}
