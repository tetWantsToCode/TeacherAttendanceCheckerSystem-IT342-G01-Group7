package com.tacs.attendancechecker.repository;

import com.tacs.attendancechecker.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Integer> {
    Optional<Department> findByDepartmentCode(String departmentCode);
    List<Department> findByDepartmentNameContainingIgnoreCase(String departmentName);
}
