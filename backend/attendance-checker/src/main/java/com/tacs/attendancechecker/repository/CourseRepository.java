package com.tacs.attendancechecker.repository;

import com.tacs.attendancechecker.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Integer> {
    List<Course> findByTeacherTeacherId(String teacherId);
}
