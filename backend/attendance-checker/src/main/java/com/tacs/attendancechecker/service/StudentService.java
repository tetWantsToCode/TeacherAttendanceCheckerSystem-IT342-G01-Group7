package com.tacs.attendancechecker.service;

import com.tacs.attendancechecker.entity.Student;
import com.tacs.attendancechecker.entity.User;
import com.tacs.attendancechecker.repository.StudentRepository;
import com.tacs.attendancechecker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    public Student addStudent(String fname, String lname, String email, String password, Integer yearLevel, String section) {
        // Prevent duplicate users by email
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("A user with that email already exists.");
        }
        // Create and save User entity
        User user = new User();
        user.setUserId(java.util.UUID.randomUUID().toString());
        user.setFname(fname);
        user.setLname(lname);
        user.setPassword(password); // Hash password in real-world apps!
        user.setEmail(email);
        user.setRole(User.Role.STUDENT);
        User savedUser = userRepository.save(user);

        // Create and save Student entity
        Student student = new Student();
        student.setUser(savedUser);
        student.setYearLevel(yearLevel);
        student.setSection(section);

        return studentRepository.save(student);
    }
}