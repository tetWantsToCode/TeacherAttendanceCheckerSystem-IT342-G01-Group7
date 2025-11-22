package com.tacs.attendancechecker.service;

import com.tacs.attendancechecker.dto.TeacherRegistrationRequest;
import com.tacs.attendancechecker.entity.Teacher;
import com.tacs.attendancechecker.entity.User;
import com.tacs.attendancechecker.repository.TeacherRepository;
import com.tacs.attendancechecker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class TeacherService {
    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Teacher addTeacher(String fname, String lname, String email, String password, String specialization) {
        // Prevent duplicate users by email
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("A user with that email already exists.");
        }
        // Create user
        User user = new User();
        user.setUserId(UUID.randomUUID().toString());
        user.setFname(fname);
        user.setLname(lname);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(User.Role.TEACHER);
        userRepository.save(user);

        // Create teacher and link user
        Teacher teacher = new Teacher();
        teacher.setTeacherId(UUID.randomUUID().toString());
        teacher.setUser(user);
        teacher.setSpecialization(specialization);

        return teacherRepository.save(teacher);
    }
}