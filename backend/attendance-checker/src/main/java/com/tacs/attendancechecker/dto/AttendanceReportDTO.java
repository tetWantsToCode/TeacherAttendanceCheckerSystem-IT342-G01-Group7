package com.tacs.attendancechecker.dto;

import java.time.LocalDate;
import java.util.List;

public class AttendanceReportDTO {
    private String reportType;
    private LocalDate startDate;
    private LocalDate endDate;
    private ReportSummary summary;
    private List<AttendanceRecordDTO> records;

    // Constructors
    public AttendanceReportDTO() {
    }

    public AttendanceReportDTO(String reportType, LocalDate startDate, LocalDate endDate,
            ReportSummary summary, List<AttendanceRecordDTO> records) {
        this.reportType = reportType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.summary = summary;
        this.records = records;
    }

    // Getters and Setters
    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public ReportSummary getSummary() {
        return summary;
    }

    public void setSummary(ReportSummary summary) {
        this.summary = summary;
    }

    public List<AttendanceRecordDTO> getRecords() {
        return records;
    }

    public void setRecords(List<AttendanceRecordDTO> records) {
        this.records = records;
    }

    // Inner class for summary statistics
    public static class ReportSummary {
        private int totalPresent;
        private int totalAbsent;
        private int totalLate;
        private double attendanceRate;

        public ReportSummary() {
        }

        public ReportSummary(int totalPresent, int totalAbsent, int totalLate, double attendanceRate) {
            this.totalPresent = totalPresent;
            this.totalAbsent = totalAbsent;
            this.totalLate = totalLate;
            this.attendanceRate = attendanceRate;
        }

        public int getTotalPresent() {
            return totalPresent;
        }

        public void setTotalPresent(int totalPresent) {
            this.totalPresent = totalPresent;
        }

        public int getTotalAbsent() {
            return totalAbsent;
        }

        public void setTotalAbsent(int totalAbsent) {
            this.totalAbsent = totalAbsent;
        }

        public int getTotalLate() {
            return totalLate;
        }

        public void setTotalLate(int totalLate) {
            this.totalLate = totalLate;
        }

        public double getAttendanceRate() {
            return attendanceRate;
        }

        public void setAttendanceRate(double attendanceRate) {
            this.attendanceRate = attendanceRate;
        }
    }

    // Inner class for attendance record
    public static class AttendanceRecordDTO {
        private LocalDate date;
        private String studentId;
        private String studentName;
        private String courseCode;
        private String courseName;
        private String status;
        private String remarks;

        public AttendanceRecordDTO() {
        }

        public AttendanceRecordDTO(LocalDate date, String studentId, String studentName,
                String courseCode, String courseName, String status, String remarks) {
            this.date = date;
            this.studentId = studentId;
            this.studentName = studentName;
            this.courseCode = courseCode;
            this.courseName = courseName;
            this.status = status;
            this.remarks = remarks;
        }

        public LocalDate getDate() {
            return date;
        }

        public void setDate(LocalDate date) {
            this.date = date;
        }

        public String getStudentId() {
            return studentId;
        }

        public void setStudentId(String studentId) {
            this.studentId = studentId;
        }

        public String getStudentName() {
            return studentName;
        }

        public void setStudentName(String studentName) {
            this.studentName = studentName;
        }

        public String getCourseCode() {
            return courseCode;
        }

        public void setCourseCode(String courseCode) {
            this.courseCode = courseCode;
        }

        public String getCourseName() {
            return courseName;
        }

        public void setCourseName(String courseName) {
            this.courseName = courseName;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getRemarks() {
            return remarks;
        }

        public void setRemarks(String remarks) {
            this.remarks = remarks;
        }
    }
}
