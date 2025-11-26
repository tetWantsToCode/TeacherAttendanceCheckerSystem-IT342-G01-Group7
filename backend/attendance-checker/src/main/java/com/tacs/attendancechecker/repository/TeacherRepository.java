package com.tacs.attendancechecker.repository;

import com.tacs.attendancechecker.entity.Teacher;
import com.tacs.attendancechecker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, String> {
    Optional<Teacher> findByUser(User user);
}
