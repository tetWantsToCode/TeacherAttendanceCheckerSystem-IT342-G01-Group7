package com.tacs.attendancechecker.repository;

import com.tacs.attendancechecker.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Integer> {
}
