package com.tacs.attendancechecker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "enrollment",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"studentId", "courseId"})
    }
)
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer enrollmentId;

    @ManyToOne
    @JoinColumn(name = "studentId", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "courseId", nullable = false)
    private Course course;

    private String status;
    private LocalDate dateEnrolled;
    private String academicYear;
}
