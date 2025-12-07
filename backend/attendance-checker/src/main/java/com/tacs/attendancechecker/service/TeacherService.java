package com.tacs.attendancechecker.service;

import com.tacs.attendancechecker.dto.TeacherRegistrationRequest;
import com.tacs.attendancechecker.entity.Department;
import com.tacs.attendancechecker.entity.Teacher;
import com.tacs.attendancechecker.entity.User;
import com.tacs.attendancechecker.repository.DepartmentRepository;
import com.tacs.attendancechecker.repository.TeacherRepository;
import com.tacs.attendancechecker.repository.UserRepository;
import com.tacs.attendancechecker.repository.CourseRepository;
import com.tacs.attendancechecker.repository.OfferedCourseRepository;
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
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private OfferedCourseRepository offeredCourseRepository;

    public java.util.List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    public Teacher addTeacher(String fname, String lname, String email, String password, Integer departmentId) {
        // Prevent duplicate users by email
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("A user with that email already exists.");
        }

        // Find department if provided
        Department department = null;
        if (departmentId != null) {
            department = departmentRepository.findById(departmentId)
                    .orElseThrow(() -> new IllegalArgumentException("Department not found"));
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
        teacher.setDepartment(department);

        return teacherRepository.save(teacher);
    }

    public void deleteTeacher(String teacherId) {
        // Check if teacher exists
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + teacherId));

        // Check if teacher has courses
        long courseCount = courseRepository.findAll().stream()
                .filter(course -> course.getTeacher() != null &&
                        course.getTeacher().getTeacherId().equals(teacherId))
                .count();
        if (courseCount > 0) {
            throw new RuntimeException("Cannot delete teacher: " + courseCount
                    + " course(s) are assigned to this teacher. Please reassign or delete the courses first.");
        }

        // Check if teacher has offered courses
        long offeredCourseCount = offeredCourseRepository.findByTeacherTeacherId(teacherId).size();
        if (offeredCourseCount > 0) {
            throw new RuntimeException("Cannot delete teacher: " + offeredCourseCount
                    + " offered course(s) are assigned to this teacher. Please delete the offered courses first.");
        }

        // Get the associated user before deleting teacher
        User user = teacher.getUser();

        // Delete teacher first (removes foreign key relationship)
        teacherRepository.deleteById(teacherId);

        // Then delete the associated user
        if (user != null) {
            userRepository.deleteById(user.getUserId());
        }
    }
}