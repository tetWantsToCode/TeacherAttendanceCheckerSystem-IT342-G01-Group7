package com.tacs.attendancechecker.service;

import com.tacs.attendancechecker.dto.EnrollmentRequest;
import com.tacs.attendancechecker.entity.Course;
import com.tacs.attendancechecker.entity.Enrollment;
import com.tacs.attendancechecker.entity.Student;
import com.tacs.attendancechecker.repository.CourseRepository;
import com.tacs.attendancechecker.repository.EnrollmentRepository;
import com.tacs.attendancechecker.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    public Enrollment createEnrollment(EnrollmentRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Check if student is already enrolled in this course
        if (enrollmentRepository.existsByStudentStudentIdAndCourseCourseId(
                request.getStudentId(), request.getCourseId())) {
            throw new RuntimeException("Student is already enrolled in this course");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setDateEnrolled(LocalDate.now());

        return enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    public List<Enrollment> getEnrollmentsByStudent(Integer studentId) {
        return enrollmentRepository.findByStudentStudentId(studentId);
    }

    public List<Enrollment> getEnrollmentsByCourse(Integer courseId) {
        return enrollmentRepository.findByCourseCourseId(courseId);
    }

    public void deleteEnrollment(Integer enrollmentId) {
        enrollmentRepository.deleteById(enrollmentId);
    }
}
