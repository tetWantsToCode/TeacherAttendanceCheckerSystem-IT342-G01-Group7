package com.tacs.attendancechecker.repository;

import com.tacs.attendancechecker.entity.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassroomRepository extends JpaRepository<Classroom, Integer> {
}
