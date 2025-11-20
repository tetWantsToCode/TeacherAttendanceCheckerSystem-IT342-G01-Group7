package com.tacs.attendancechecker.controller;

import com.tacs.attendancechecker.entity.Student;
import com.tacs.attendancechecker.service.StudentService;
import com.tacs.attendancechecker.dto.StudentRegistrationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@CrossOrigin
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping
    public Student addStudent(@RequestBody StudentRegistrationRequest request) {
        return studentService.addStudent(
                request.getFname(),
                request.getLname(),
                request.getEmail(),
                request.getPassword(),
                request.getYearLevel(),
                request.getSection()
        );
    }
}