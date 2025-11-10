package com.tacs.attendancechecker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

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

    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String remarks;

    public enum Status {
        PRESENT, LATE, ABSENT, EXCUSED
    }
}
