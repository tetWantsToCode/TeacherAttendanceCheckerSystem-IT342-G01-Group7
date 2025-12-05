package com.tacs.attendancechecker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "attendance_session")
public class AttendanceSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer sessionId;

    @ManyToOne
    @JoinColumn(name = "courseId", nullable = false)
    private Course course;

    @ManyToOne
    @JoinColumn(name = "teacherId", nullable = false)
    private Teacher teacher;

    @ManyToOne
    @JoinColumn(name = "scheduleId")
    private ClassSchedule classSchedule; // Link to which class schedule this session is for

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String sessionType;
    private Boolean isFinalized = false;
    private String remarks;
}
