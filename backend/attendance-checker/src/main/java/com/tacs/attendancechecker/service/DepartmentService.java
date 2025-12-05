package com.tacs.attendancechecker.service;

import com.tacs.attendancechecker.entity.Department;
import com.tacs.attendancechecker.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    public Department createDepartment(Department department) {
        return departmentRepository.save(department);
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Optional<Department> getDepartmentById(Integer departmentId) {
        return departmentRepository.findById(departmentId);
    }

    public Optional<Department> getDepartmentByCode(String departmentCode) {
        return departmentRepository.findByDepartmentCode(departmentCode);
    }

    public List<Department> getActiveDepartments() {
        return departmentRepository.findAll();
    }

    public List<Department> searchDepartmentsByName(String departmentName) {
        return departmentRepository.findByDepartmentNameContainingIgnoreCase(departmentName);
    }

    public Department updateDepartment(Integer departmentId, Department updatedDepartment) {
        return departmentRepository.findById(departmentId)
            .map(department -> {
                department.setDepartmentCode(updatedDepartment.getDepartmentCode());
                department.setDepartmentName(updatedDepartment.getDepartmentName());
                return departmentRepository.save(department);
            })
            .orElseThrow(() -> new RuntimeException("Department not found with id: " + departmentId));
    }

    public void deleteDepartment(Integer departmentId) {
        departmentRepository.deleteById(departmentId);
    }
}
