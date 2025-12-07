package com.tacs.attendancechecker.repository;

import com.tacs.attendancechecker.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, String> {
    List<Attendance> findByStudentStudentId(Integer studentId);

    List<Attendance> findByCourseCourseId(Integer courseId);

    List<Attendance> findByCourseCourseIdAndDate(Integer courseId, LocalDate date);

    Optional<Attendance> findByStudentStudentIdAndCourseCourseIdAndDate(Integer studentId, Integer courseId,
            LocalDate date);

    Optional<Attendance> findByStudentStudentIdAndSessionSessionId(Integer studentId, Integer sessionId);

    List<Attendance> findBySessionSessionId(Integer sessionId);

    // Report-specific queries
    List<Attendance> findByDate(LocalDate date);

    List<Attendance> findByDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT a FROM Attendance a WHERE a.course.courseId = :courseId")
    List<Attendance> findByCourseId(@Param("courseId") Integer courseId);

    @Query("SELECT a FROM Attendance a WHERE a.student.studentId = :studentId")
    List<Attendance> findByStudentId(@Param("studentId") Integer studentId);
}
