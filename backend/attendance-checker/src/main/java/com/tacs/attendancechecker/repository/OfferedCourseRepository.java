package com.tacs.attendancechecker.repository;

import com.tacs.attendancechecker.entity.OfferedCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OfferedCourseRepository extends JpaRepository<OfferedCourse, Integer> {
    List<OfferedCourse> findByTeacherTeacherId(String teacherId);
    List<OfferedCourse> findByCourseCourseId(Integer courseId);
}
