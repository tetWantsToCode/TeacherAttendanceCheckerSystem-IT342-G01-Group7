package com.tacs.attendancechecker.dto;

import java.time.LocalDate;

public class AttendanceRequest {
    private Integer studentId;
    private Integer courseId;
    private LocalDate date;
    private String status; // PRESENT, LATE, ABSENT, EXCUSED
    private String remarks;

    public AttendanceRequest() {}

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }

    public Integer getCourseId() { return courseId; }
    public void setCourseId(Integer courseId) { this.courseId = courseId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
