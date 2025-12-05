package com.tacs.attendancechecker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "attendance")
public class Attendance {

    @Id
    private String attendanceId;

    @ManyToOne
    @JoinColumn(name = "studentId", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "courseId", nullable = false)
    private Course course;

    @ManyToOne
    @JoinColumn(name = "sessionId")
    private AttendanceSession session;

    private LocalDate date;
    private LocalTime timeIn;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String remarks;
    private String recordedBy; // Teacher ID who recorded it

    public enum Status {
        PRESENT, LATE, ABSENT, EXCUSED
    }
}
