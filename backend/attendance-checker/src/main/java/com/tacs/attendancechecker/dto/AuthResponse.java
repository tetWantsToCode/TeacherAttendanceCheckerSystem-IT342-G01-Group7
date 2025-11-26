package com.tacs.attendancechecker.dto;

public class AuthResponse {
    private String token;
    private String email;
    private String fname;
    private String lname;
    private String role;
    private String teacherId;
    private Integer studentId;

    public AuthResponse(String token) {
        this.token = token;
    }

    public AuthResponse(String token, String email, String fname, String lname, String role) {
        this.token = token;
        this.email = email;
        this.fname = fname;
        this.lname = lname;
        this.role = role;
    }

    public AuthResponse(String token, String email, String fname, String lname, String role, String teacherId, Integer studentId) {
        this.token = token;
        this.email = email;
        this.fname = fname;
        this.lname = lname;
        this.role = role;
        this.teacherId = teacherId;
        this.studentId = studentId;
    }

    public String getToken() {
        return token;
    }
    public String getEmail() {
        return email;
    }
    public String getFname() {
        return fname;
    }
    public String getLname() {
        return lname;
    }
    public String getRole() {
        return role;
    }
    public String getTeacherId() {
        return teacherId;
    }
    public Integer getStudentId() {
        return studentId;
    }

    public void setToken(String token) {
        this.token = token;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public void setFname(String fname) {
        this.fname = fname;
    }
    public void setLname(String lname) {
        this.lname = lname;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }
    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }
}