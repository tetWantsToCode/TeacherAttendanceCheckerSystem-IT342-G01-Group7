package com.tacs.attendancechecker.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "offered_course")
public class OfferedCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer offeredCourseId;

    @ManyToOne
    @JoinColumn(name = "teacherId", nullable = false)
    private Teacher teacher;

    @ManyToOne
    @JoinColumn(name = "courseId", nullable = false)
    private Course course;

    private String schedule; // Optional text description (e.g., "MW 8:00-10:00")
    private String semester; // FIRST_SEM, SECOND_SEM, SUMMER
    private String schoolYear; // 2024-2025, 2025-2026
    private String section;
    private Integer units;
}
