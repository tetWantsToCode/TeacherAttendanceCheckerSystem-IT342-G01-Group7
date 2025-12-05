package com.tacs.attendancechecker.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "teacher")
public class Teacher {

    @Id
    private String teacherId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    public Teacher() {}

    public Teacher(String teacherId, User user, Department department) {
        this.teacherId = teacherId;
        this.user = user;
        this.department = department;
    }

    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String teacherId) { this.teacherId = teacherId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
}
