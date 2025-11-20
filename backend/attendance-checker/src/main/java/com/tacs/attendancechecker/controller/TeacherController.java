package com.tacs.attendancechecker.controller;

import com.tacs.attendancechecker.dto.TeacherRegistrationRequest;
import com.tacs.attendancechecker.entity.Teacher;
import com.tacs.attendancechecker.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    @PostMapping
    public Teacher addTeacher(@RequestBody TeacherRegistrationRequest request) {
        return teacherService.addTeacher(
                request.getFname(),
                request.getLname(),
                request.getEmail(),
                request.getPassword(),
                request.getSpecialization()
        );
    }
}