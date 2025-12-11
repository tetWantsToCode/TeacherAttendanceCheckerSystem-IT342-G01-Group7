package com.tacs.attendancechecker.repository;

import com.tacs.attendancechecker.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {
    List<Enrollment> findByStudentStudentId(Integer studentId);
    List<Enrollment> findByOfferedCourseCourseCourseId(Integer courseId);
    List<Enrollment> findByOfferedCourseOfferedCourseId(Integer offeredCourseId);
    boolean existsByStudentStudentIdAndOfferedCourseOfferedCourseId(Integer studentId, Integer offeredCourseId);
}
