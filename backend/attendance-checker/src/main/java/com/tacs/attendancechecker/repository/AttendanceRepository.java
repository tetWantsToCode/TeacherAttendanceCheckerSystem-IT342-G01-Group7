package com.tacs.attendancechecker.repository;

import com.tacs.attendancechecker.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, String> {
    List<Attendance> findByStudentStudentId(Integer studentId);
    List<Attendance> findByCourseCourseId(Integer courseId);
    List<Attendance> findByCourseCourseIdAndDate(Integer courseId, LocalDate date);
    Optional<Attendance> findByStudentStudentIdAndCourseCourseIdAndDate(Integer studentId, Integer courseId, LocalDate date);
}
