package com.tacs.attendancechecker.service;

import com.tacs.attendancechecker.dto.*;
import com.tacs.attendancechecker.entity.*;
import com.tacs.attendancechecker.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    // Get all courses for a teacher
    public List<CourseResponse> getTeacherCourses(String teacherId) {
        List<Course> courses = courseRepository.findByTeacherTeacherId(teacherId);
        return courses.stream().map(this::mapToCourseResponse).collect(Collectors.toList());
    }

    // Get enrolled students for a course
    public List<EnrolledStudentResponse> getEnrolledStudents(Integer courseId) {
        List<Enrollment> enrollments = enrollmentRepository.findByCourseCourseId(courseId);
        return enrollments.stream()
                .filter(e -> "ENROLLED".equalsIgnoreCase(e.getStatus()))
                .map(this::mapToEnrolledStudentResponse)
                .collect(Collectors.toList());
    }

    // Mark attendance for a student
    public AttendanceResponse markAttendance(AttendanceRequest request) {
        // Check if attendance already exists for this student, course, and date
        var existing = attendanceRepository.findByStudentStudentIdAndCourseCourseIdAndDate(
                request.getStudentId(), request.getCourseId(), request.getDate());

        Attendance attendance;
        if (existing.isPresent()) {
            // Update existing attendance
            attendance = existing.get();
            attendance.setStatus(Attendance.Status.valueOf(request.getStatus().toUpperCase()));
            attendance.setRemarks(request.getRemarks());
        } else {
            // Create new attendance
            attendance = new Attendance();
            attendance.setAttendanceId(UUID.randomUUID().toString());
            
            Student student = studentRepository.findById(request.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            Course course = courseRepository.findById(request.getCourseId())
                    .orElseThrow(() -> new RuntimeException("Course not found"));
            
            attendance.setStudent(student);
            attendance.setCourse(course);
            attendance.setDate(request.getDate());
            attendance.setStatus(Attendance.Status.valueOf(request.getStatus().toUpperCase()));
            attendance.setRemarks(request.getRemarks());
        }

        Attendance saved = attendanceRepository.save(attendance);
        return mapToAttendanceResponse(saved);
    }

    // Get attendance records for a course on a specific date
    public List<AttendanceResponse> getAttendanceByDate(Integer courseId, LocalDate date) {
        List<Attendance> attendances = attendanceRepository.findByCourseCourseIdAndDate(courseId, date);
        return attendances.stream().map(this::mapToAttendanceResponse).collect(Collectors.toList());
    }

    // Get all attendance for a course
    public List<AttendanceResponse> getCourseAttendance(Integer courseId) {
        List<Attendance> attendances = attendanceRepository.findByCourseCourseId(courseId);
        return attendances.stream().map(this::mapToAttendanceResponse).collect(Collectors.toList());
    }

    // Get student's attendance for a specific course
    public List<AttendanceResponse> getStudentAttendance(Integer studentId, Integer courseId) {
        List<Attendance> attendances = attendanceRepository.findByCourseCourseId(courseId).stream()
                .filter(a -> a.getStudent().getStudentId().equals(studentId))
                .collect(Collectors.toList());
        return attendances.stream().map(this::mapToAttendanceResponse).collect(Collectors.toList());
    }

    // Helper methods
    private CourseResponse mapToCourseResponse(Course course) {
        CourseResponse response = new CourseResponse();
        response.setCourseId(course.getCourseId());
        response.setCourseName(course.getCourseName());
        response.setDescription(course.getDescription());
        response.setTeacherId(course.getTeacher().getTeacherId());
        
        User teacherUser = course.getTeacher().getUser();
        response.setTeacherName(teacherUser.getFname() + " " + teacherUser.getLname());
        
        return response;
    }

    private EnrolledStudentResponse mapToEnrolledStudentResponse(Enrollment enrollment) {
        EnrolledStudentResponse response = new EnrolledStudentResponse();
        Student student = enrollment.getStudent();
        User user = student.getUser();
        
        response.setStudentId(student.getStudentId());
        response.setStudentName(user.getFname() + " " + user.getLname());
        response.setEmail(user.getEmail());
        response.setYearLevel(student.getYearLevel());
        response.setSection(student.getSection());
        response.setEnrollmentStatus(enrollment.getStatus());
        
        return response;
    }

    private AttendanceResponse mapToAttendanceResponse(Attendance attendance) {
        AttendanceResponse response = new AttendanceResponse();
        response.setAttendanceId(attendance.getAttendanceId());
        response.setStudentId(attendance.getStudent().getStudentId());
        
        User studentUser = attendance.getStudent().getUser();
        response.setStudentName(studentUser.getFname() + " " + studentUser.getLname());
        
        response.setCourseId(attendance.getCourse().getCourseId());
        response.setCourseName(attendance.getCourse().getCourseName());
        response.setDate(attendance.getDate());
        response.setStatus(attendance.getStatus().toString());
        response.setRemarks(attendance.getRemarks());
        
        return response;
    }
}
