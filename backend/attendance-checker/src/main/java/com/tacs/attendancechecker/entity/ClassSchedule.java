package com.tacs.attendancechecker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "class_schedule")
public class ClassSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer scheduleId;

    @ManyToOne
    @JoinColumn(name = "offered_course_id", nullable = false)
    private OfferedCourse offeredCourse;

    @Column(nullable = false)
    private String dayOfWeek; // MONDAY, TUESDAY, etc.

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @ManyToOne
    @JoinColumn(name = "classroom_id", nullable = false)
    private Classroom classroom;

    private Boolean isActive = true;
}
