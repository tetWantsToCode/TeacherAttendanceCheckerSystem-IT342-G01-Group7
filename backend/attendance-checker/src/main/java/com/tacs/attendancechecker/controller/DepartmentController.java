package com.tacs.attendancechecker.controller;

import com.tacs.attendancechecker.entity.Department;
import com.tacs.attendancechecker.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @PostMapping
    public ResponseEntity<Department> createDepartment(@RequestBody Department department) {
        try {
            Department created = departmentService.createDepartment(department);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments(@RequestParam(required = false) Boolean active) {
        try {
            List<Department> departments;
            if (active != null && active) {
                departments = departmentService.getActiveDepartments();
            } else {
                departments = departmentService.getAllDepartments();
            }
            return new ResponseEntity<>(departments, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable("id") Integer departmentId) {
        return departmentService.getDepartmentById(departmentId)
            .map(department -> new ResponseEntity<>(department, HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<Department> getDepartmentByCode(@PathVariable("code") String departmentCode) {
        return departmentService.getDepartmentByCode(departmentCode)
            .map(department -> new ResponseEntity<>(department, HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Department>> searchDepartments(@RequestParam String name) {
        try {
            List<Department> departments = departmentService.searchDepartmentsByName(name);
            return new ResponseEntity<>(departments, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Department> updateDepartment(
            @PathVariable("id") Integer departmentId,
            @RequestBody Department department) {
        try {
            Department updated = departmentService.updateDepartment(departmentId, department);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteDepartment(@PathVariable("id") Integer departmentId) {
        try {
            departmentService.deleteDepartment(departmentId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
