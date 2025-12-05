package com.tacs.attendancechecker.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class AttendanceRequest {
    private Integer studentId;
    private Integer courseId;
    private Integer sessionId; // Link to specific session
    private LocalDate date;
    private LocalTime timeIn;
    private String status; // PRESENT, LATE, ABSENT, EXCUSED
    private String remarks;

    public AttendanceRequest() {}

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }

    public Integer getCourseId() { return courseId; }
    public void setCourseId(Integer courseId) { this.courseId = courseId; }

    public Integer getSessionId() { return sessionId; }
    public void setSessionId(Integer sessionId) { this.sessionId = sessionId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getTimeIn() { return timeIn; }
    public void setTimeIn(LocalTime timeIn) { this.timeIn = timeIn; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
