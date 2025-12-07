package com.tacs.attendancechecker.service;

import com.tacs.attendancechecker.dto.AttendanceReportDTO;
import com.tacs.attendancechecker.dto.AttendanceReportDTO.AttendanceRecordDTO;
import com.tacs.attendancechecker.dto.AttendanceReportDTO.ReportSummary;
import com.tacs.attendancechecker.entity.*;
import com.tacs.attendancechecker.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private AttendanceSessionRepository attendanceSessionRepository;

    /**
     * Generate daily attendance report for a specific date
     */
    public AttendanceReportDTO generateDailyReport(LocalDate date) {
        List<Attendance> attendances = attendanceRepository.findByDate(date);

        List<AttendanceRecordDTO> records = attendances.stream()
                .map(this::mapToRecordDTO)
                .collect(Collectors.toList());

        ReportSummary summary = calculateSummary(attendances);

        return new AttendanceReportDTO("DAILY", date, date, summary, records);
    }

    /**
     * Generate monthly attendance report
     */
    public AttendanceReportDTO generateMonthlyReport(YearMonth yearMonth) {
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        List<Attendance> attendances = attendanceRepository.findByDateBetween(startDate, endDate);

        List<AttendanceRecordDTO> records = attendances.stream()
                .map(this::mapToRecordDTO)
                .collect(Collectors.toList());

        ReportSummary summary = calculateSummary(attendances);

        return new AttendanceReportDTO("MONTHLY", startDate, endDate, summary, records);
    }

    /**
     * Generate course-specific attendance report
     */
    public AttendanceReportDTO generateCourseReport(Integer courseId) {
        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (!courseOpt.isPresent()) {
            throw new RuntimeException("Course not found with ID: " + courseId);
        }

        List<Attendance> attendances = attendanceRepository.findByCourseId(courseId);

        List<AttendanceRecordDTO> records = attendances.stream()
                .map(this::mapToRecordDTO)
                .sorted(Comparator.comparing(AttendanceRecordDTO::getDate).reversed())
                .collect(Collectors.toList());

        ReportSummary summary = calculateSummary(attendances);

        LocalDate startDate = records.isEmpty() ? LocalDate.now()
                : records.stream().map(AttendanceRecordDTO::getDate).min(LocalDate::compareTo).orElse(LocalDate.now());
        LocalDate endDate = records.isEmpty() ? LocalDate.now()
                : records.stream().map(AttendanceRecordDTO::getDate).max(LocalDate::compareTo).orElse(LocalDate.now());

        return new AttendanceReportDTO("COURSE", startDate, endDate, summary, records);
    }

    /**
     * Generate student-specific attendance report
     */
    public AttendanceReportDTO generateStudentReport(Integer studentId) {
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (!studentOpt.isPresent()) {
            throw new RuntimeException("Student not found with ID: " + studentId);
        }

        List<Attendance> attendances = attendanceRepository.findByStudentId(studentId);

        List<AttendanceRecordDTO> records = attendances.stream()
                .map(this::mapToRecordDTO)
                .sorted(Comparator.comparing(AttendanceRecordDTO::getDate).reversed())
                .collect(Collectors.toList());

        ReportSummary summary = calculateSummary(attendances);

        LocalDate startDate = records.isEmpty() ? LocalDate.now()
                : records.stream().map(AttendanceRecordDTO::getDate).min(LocalDate::compareTo).orElse(LocalDate.now());
        LocalDate endDate = records.isEmpty() ? LocalDate.now()
                : records.stream().map(AttendanceRecordDTO::getDate).max(LocalDate::compareTo).orElse(LocalDate.now());

        return new AttendanceReportDTO("STUDENT", startDate, endDate, summary, records);
    }

    /**
     * Get dashboard statistics for admin overview
     */
    public Map<String, Object> getDashboardStatistics() {
        Map<String, Object> stats = new HashMap<>();

        LocalDate today = LocalDate.now();
        List<Attendance> todayAttendance = attendanceRepository.findByDate(today);

        long totalStudents = studentRepository.count();
        long totalTeachers = teacherRepository.count();
        long totalCourses = courseRepository.count();

        long todayPresent = todayAttendance.stream().filter(a -> "PRESENT".equals(a.getStatus())).count();
        long todayAbsent = todayAttendance.stream().filter(a -> "ABSENT".equals(a.getStatus())).count();
        long todayLate = todayAttendance.stream().filter(a -> "LATE".equals(a.getStatus())).count();

        double attendanceRate = totalStudents > 0 ? ((double) (todayPresent + todayLate) / totalStudents) * 100 : 0.0;

        stats.put("todayPresent", todayPresent);
        stats.put("todayAbsent", todayAbsent);
        stats.put("todayLate", todayLate);
        stats.put("totalStudents", totalStudents);
        stats.put("totalTeachers", totalTeachers);
        stats.put("totalCourses", totalCourses);
        stats.put("attendanceRate", Math.round(attendanceRate * 10) / 10.0);

        return stats;
    }

    /**
     * Map Attendance entity to AttendanceRecordDTO
     */
    private AttendanceRecordDTO mapToRecordDTO(Attendance attendance) {
        Student student = attendance.getStudent();
        Course course = attendance.getCourse();

        String studentName = student != null && student.getUser() != null
                ? student.getUser().getFname() + " " + student.getUser().getLname()
                : "Unknown";
        String courseCode = course != null ? course.getCourseCode() : "N/A";
        String courseName = course != null ? course.getCourseName() : "N/A";

        return new AttendanceRecordDTO(
                attendance.getDate(),
                attendance.getStudent() != null ? String.valueOf(attendance.getStudent().getStudentId()) : "N/A",
                studentName,
                courseCode,
                courseName,
                attendance.getStatus() != null ? attendance.getStatus().name() : "UNKNOWN",
                attendance.getRemarks());
    }

    /**
     * Calculate summary statistics from attendance list
     */
    private ReportSummary calculateSummary(List<Attendance> attendances) {
        int totalPresent = (int) attendances.stream().filter(a -> "PRESENT".equals(a.getStatus())).count();
        int totalAbsent = (int) attendances.stream().filter(a -> "ABSENT".equals(a.getStatus())).count();
        int totalLate = (int) attendances.stream().filter(a -> "LATE".equals(a.getStatus())).count();

        int total = attendances.size();
        double attendanceRate = total > 0 ? ((double) (totalPresent + totalLate) / total) * 100 : 0.0;

        return new ReportSummary(
                totalPresent,
                totalAbsent,
                totalLate,
                Math.round(attendanceRate * 10) / 10.0);
    }
}
