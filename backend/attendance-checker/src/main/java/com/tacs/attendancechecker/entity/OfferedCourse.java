package com.tacs.attendancechecker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

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
    @JoinColumn(name = "classroomId", nullable = false)
    private Classroom classroom;

    @ManyToOne
    @JoinColumn(name = "courseId", nullable = false)
    private Course course;

    private String schedule;
    private String semester;
    private String section;
    private Integer units;
    private LocalTime startTime;
    private LocalTime endTime;
    private String dayOfWeek;
}
