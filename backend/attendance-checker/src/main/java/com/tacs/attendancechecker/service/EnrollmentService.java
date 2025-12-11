package com.tacs.attendancechecker.service;

import com.tacs.attendancechecker.dto.EnrollmentRequest;
import com.tacs.attendancechecker.entity.Enrollment;
import com.tacs.attendancechecker.entity.OfferedCourse;
import com.tacs.attendancechecker.entity.Student;
import com.tacs.attendancechecker.repository.EnrollmentRepository;
import com.tacs.attendancechecker.repository.OfferedCourseRepository;
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
    private OfferedCourseRepository offeredCourseRepository;

    public Enrollment createEnrollment(EnrollmentRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        OfferedCourse offeredCourse = offeredCourseRepository.findById(request.getOfferedCourseId())
                .orElseThrow(() -> new RuntimeException("Offered course not found"));

        // Check if student is already enrolled in this offered course
        if (enrollmentRepository.existsByStudentStudentIdAndOfferedCourseOfferedCourseId(
                request.getStudentId(), request.getOfferedCourseId())) {
            throw new RuntimeException("Student is already enrolled in this offered course");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setOfferedCourse(offeredCourse);
        enrollment.setDateEnrolled(LocalDate.now());
        enrollment.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");

        return enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    public List<Enrollment> getEnrollmentsByStudent(Integer studentId) {
        return enrollmentRepository.findByStudentStudentId(studentId);
    }

    public List<Enrollment> getEnrollmentsByCourse(Integer courseId) {
        return enrollmentRepository.findByOfferedCourseCourseCourseId(courseId);
    }

    public List<Enrollment> getEnrollmentsByOfferedCourse(Integer offeredCourseId) {
        return enrollmentRepository.findByOfferedCourseOfferedCourseId(offeredCourseId);
    }

    public Enrollment updateEnrollment(Integer enrollmentId, String status) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        enrollment.setStatus(status);
        return enrollmentRepository.save(enrollment);
    }

    public void deleteEnrollment(Integer enrollmentId) {
        enrollmentRepository.deleteById(enrollmentId);
    }
}
