package com.tacs.attendancechecker.dto;

public class EnrolledStudentResponse {
    private Integer studentId;
    private String studentName;
    private String email;
    private Integer yearLevel;
    private String section;
    private String enrollmentStatus;

    public EnrolledStudentResponse() {}

    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Integer getYearLevel() { return yearLevel; }
    public void setYearLevel(Integer yearLevel) { this.yearLevel = yearLevel; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public String getEnrollmentStatus() { return enrollmentStatus; }
    public void setEnrollmentStatus(String enrollmentStatus) { this.enrollmentStatus = enrollmentStatus; }
}
