package com.tacs.attendancechecker.repository;

import com.tacs.attendancechecker.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherRepository extends JpaRepository<Teacher, String> {
}
