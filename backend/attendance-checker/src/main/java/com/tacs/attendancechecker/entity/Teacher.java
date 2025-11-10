package com.tacs.attendancechecker.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "teacher")
public class Teacher {

    @Id
    private String teacherId;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    private String specialization;
}
