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

    @Autowired
    private AttendanceSessionRepository attendanceSessionRepository;

    @Autowired
    private OfferedCourseRepository offeredCourseRepository;

    // Get all courses for a teacher
    public List<CourseResponse> getTeacherCourses(String teacherId) {
        // Course no longer has teacher - get courses through OfferedCourse
        List<OfferedCourse> offeredCourses = offeredCourseRepository.findByTeacherTeacherId(teacherId);
        return offeredCourses.stream()
                .map(oc -> mapToCourseResponse(oc.getCourse()))
                .distinct()
                .collect(Collectors.toList());
    }

    // Get enrolled students for a course
    public List<EnrolledStudentResponse> getEnrolledStudents(Integer courseId) {
        List<Enrollment> enrollments = enrollmentRepository.findByCourseCourseId(courseId);
        return enrollments.stream()
                .filter(e -> "ACTIVE".equalsIgnoreCase(e.getStatus()))
                .map(this::mapToEnrolledStudentResponse)
                .collect(Collectors.toList());
    }

    // Mark attendance for a student
    public AttendanceResponse markAttendance(AttendanceRequest request) {
        // Check if attendance already exists for this student, course, date, and
        // session
        var existing = request.getSessionId() != null
                ? attendanceRepository.findByStudentStudentIdAndSessionSessionId(
                        request.getStudentId(), request.getSessionId())
                : attendanceRepository.findByStudentStudentIdAndCourseCourseIdAndDate(
                        request.getStudentId(), request.getCourseId(), request.getDate());

        Attendance attendance;
        if (existing.isPresent()) {
            // Update existing attendance
            attendance = existing.get();
            attendance.setStatus(Attendance.Status.valueOf(request.getStatus().toUpperCase()));
            attendance.setRemarks(request.getRemarks());
            if (request.getTimeIn() != null) {
                attendance.setTimeIn(request.getTimeIn());
            }
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

            if (request.getTimeIn() != null) {
                attendance.setTimeIn(request.getTimeIn());
            }

            // Link to session - either use provided or find/create one for this date
            AttendanceSession session;
            if (request.getSessionId() != null) {
                session = attendanceSessionRepository.findById(request.getSessionId())
                        .orElseThrow(() -> new RuntimeException("Session not found"));
            } else {
                // Try to find existing session for this course and date
                var sessions = attendanceSessionRepository.findByCourseCourseIdAndDate(
                        request.getCourseId(), request.getDate());

                if (!sessions.isEmpty()) {
                    // Use the first (or most recent) session
                    session = sessions.get(0);
                } else {
                    // Course no longer has teacher - cannot auto-create session
                    // Sessions must be created through proper workflow with OfferedCourse
                    throw new RuntimeException("No attendance session found for course " + course.getCourseId() 
                        + " on date " + request.getDate() + ". Please create a session first.");
                }
            }
            attendance.setSession(session);
        }

        Attendance saved = attendanceRepository.save(attendance);
        return mapToAttendanceResponse(saved);
    }

    // Get attendance records for a course on a specific date
    public List<AttendanceResponse> getAttendanceByDate(Integer courseId, LocalDate date) {
        List<Attendance> attendances = attendanceRepository.findByCourseCourseIdAndDate(courseId, date);
        return attendances.stream().map(this::mapToAttendanceResponse).collect(Collectors.toList());
    }

    // Get attendance records for a specific session
    public List<AttendanceResponse> getAttendanceBySession(Integer sessionId) {
        List<Attendance> attendances = attendanceRepository.findBySessionSessionId(sessionId);
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
        // Course no longer has teacher - teacher info is in OfferedCourse
        // This method is used by getTeacherCourses which gets courses via OfferedCourse
        // Teacher info should be set by caller if needed
        
        return response;
    }

    private EnrolledStudentResponse mapToEnrolledStudentResponse(Enrollment enrollment) {
        EnrolledStudentResponse response = new EnrolledStudentResponse();
        Student student = enrollment.getStudent();
        User user = student.getUser();

        response.setStudentId(student.getStudentId());
        response.setStudentNumber(student.getStudentNumber());
        response.setStudentName(user.getFname() + " " + user.getLname());
        response.setEmail(user.getEmail());
        response.setProgram(student.getProgram());
        response.setYearLevel(student.getYearLevel());
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
        response.setTimeIn(attendance.getTimeIn());
        response.setStatus(attendance.getStatus().toString());
        response.setRemarks(attendance.getRemarks());

        // Include session ID if attendance is linked to a session
        if (attendance.getSession() != null) {
            response.setSessionId(attendance.getSession().getSessionId());
        }

        return response;
    }
}
