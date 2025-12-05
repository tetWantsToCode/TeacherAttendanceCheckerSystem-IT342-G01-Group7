package com.tacs.attendancechecker.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "course")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer courseId;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @Column(unique = true)
    private String courseCode; // IT101, MATH201, etc.
    
    private String courseName;
    private String description;
    private Integer units; // Academic units/credits
    private String courseType; // LECTURE, LABORATORY, LECTURE_LAB
    private String semester; // FIRST_SEM, SECOND_SEM, SUMMER
    private String schoolYear; // 2024-2025, 2025-2026
    private Boolean isActive = true;
}
