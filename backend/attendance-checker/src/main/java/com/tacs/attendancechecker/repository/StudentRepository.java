package com.tacs.attendancechecker.repository;

import com.tacs.attendancechecker.entity.Student;
import com.tacs.attendancechecker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Integer> {
    Optional<Student> findByUser(User user);
}
