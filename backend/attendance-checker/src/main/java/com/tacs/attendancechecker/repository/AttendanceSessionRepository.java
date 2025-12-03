package com.tacs.attendancechecker.repository;

import com.tacs.attendancechecker.entity.AttendanceSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface AttendanceSessionRepository extends JpaRepository<AttendanceSession, Integer> {
    List<AttendanceSession> findByCourseCourseId(Integer courseId);
    List<AttendanceSession> findByTeacherTeacherId(String teacherId);
    List<AttendanceSession> findByCourseCourseIdAndDate(Integer courseId, LocalDate date);
}
