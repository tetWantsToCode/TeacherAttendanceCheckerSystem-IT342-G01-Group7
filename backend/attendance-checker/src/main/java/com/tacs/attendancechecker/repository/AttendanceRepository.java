package com.tacs.attendancechecker.repository;

import com.tacs.attendancechecker.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, String> {
    List<Attendance> findByStudentStudentId(Integer studentId);
    List<Attendance> findByCourseCourseId(Integer courseId);
}
