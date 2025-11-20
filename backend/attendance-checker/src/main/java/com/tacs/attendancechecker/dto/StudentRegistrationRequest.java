package com.tacs.attendancechecker.dto;

public class StudentRegistrationRequest {
    private String fname;
    private String lname;
    private String email;
    private String password;
    private Integer yearLevel;
    private String section;

    public StudentRegistrationRequest() {}

    public String getFname() { return fname; }
    public void setFname(String fname) { this.fname = fname; }

    public String getLname() { return lname; }
    public void setLname(String lname) { this.lname = lname; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Integer getYearLevel() { return yearLevel; }
    public void setYearLevel(Integer yearLevel) { this.yearLevel = yearLevel; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
}