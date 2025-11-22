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

    private String specialization;

    public Teacher() {}

    public Teacher(String teacherId, User user, String specialization) {
        this.teacherId = teacherId;
        this.user = user;
        this.specialization = specialization;
    }

    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String teacherId) { this.teacherId = teacherId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
}
