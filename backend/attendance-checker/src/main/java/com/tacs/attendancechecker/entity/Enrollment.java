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
        @UniqueConstraint(columnNames = {"studentId", "offeredCourseId"})
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
    @JoinColumn(name = "offeredCourseId", nullable = false)
    private OfferedCourse offeredCourse;

    private LocalDate dateEnrolled;
    private String status; // ACTIVE, DROPPED, COMPLETED
}
