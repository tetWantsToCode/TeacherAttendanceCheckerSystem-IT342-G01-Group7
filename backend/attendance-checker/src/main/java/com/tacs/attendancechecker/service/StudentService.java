package com.tacs.attendancechecker.service;

import com.tacs.attendancechecker.entity.Student;
import com.tacs.attendancechecker.entity.User;
import com.tacs.attendancechecker.repository.StudentRepository;
import com.tacs.attendancechecker.repository.UserRepository;
import com.tacs.attendancechecker.repository.EnrollmentRepository;
import com.tacs.attendancechecker.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    public Student addStudent(String fname, String lname, String email, String password,
            String studentNumber, String program, Integer yearLevel,
            String enrollmentStatus) {
        // Prevent duplicate users by email
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("A user with that email already exists.");
        }
        // Create and save User entity
        User user = new User();
        user.setUserId(java.util.UUID.randomUUID().toString());
        user.setFname(fname);
        user.setLname(lname);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setRole(User.Role.STUDENT);
        User savedUser = userRepository.save(user);

        // Create and save Student entity
        Student student = new Student();
        student.setUser(savedUser);
        student.setStudentNumber(studentNumber);
        student.setProgram(program);
        student.setYearLevel(yearLevel);
        student.setEnrollmentStatus(enrollmentStatus != null ? enrollmentStatus : "ACTIVE");

        return studentRepository.save(student);
    }

    public java.util.List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Integer studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));
    }

    public void deleteStudent(Integer studentId) {
        // Check if student exists
        Student student = getStudentById(studentId);

        // Check if student has enrollments
        long enrollmentCount = enrollmentRepository.findAll().stream()
                .filter(enrollment -> enrollment.getStudent() != null &&
                        enrollment.getStudent().getStudentId().equals(studentId))
                .count();
        if (enrollmentCount > 0) {
            throw new RuntimeException("Cannot delete student: " + enrollmentCount
                    + " enrollment(s) exist. Please remove enrollments first.");
        }

        // Check if student has attendance records
        long attendanceCount = attendanceRepository.findAll().stream()
                .filter(attendance -> attendance.getStudent() != null &&
                        attendance.getStudent().getStudentId().equals(studentId))
                .count();
        if (attendanceCount > 0) {
            throw new RuntimeException("Cannot delete student: " + attendanceCount
                    + " attendance record(s) exist. Please remove attendance records first.");
        }

        // Get the associated user before deleting student
        User user = student.getUser();

        // Delete student first (removes foreign key relationship)
        studentRepository.delete(student);

        // Then delete the associated user
        if (user != null) {
            userRepository.deleteById(user.getUserId());
        }
    }
}