package com.tacs.attendancechecker.dto;

public class TeacherRegistrationRequest {
    private String fname;
    private String lname;
    private String email;
    private String password;
    private Integer departmentId;

    public TeacherRegistrationRequest() {}

    // Getters and setters for all fields
    public String getFname() { return fname; }
    public void setFname(String fname) { this.fname = fname; }

    public String getLname() { return lname; }
    public void setLname(String lname) { this.lname = lname; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Integer getDepartmentId() { return departmentId; }
    public void setDepartmentId(Integer departmentId) { this.departmentId = departmentId; }
}