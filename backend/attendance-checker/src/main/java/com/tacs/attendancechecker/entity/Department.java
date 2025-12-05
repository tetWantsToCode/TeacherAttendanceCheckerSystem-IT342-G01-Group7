package com.tacs.attendancechecker.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "department")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer departmentId;

    @Column(unique = true, nullable = false)
    private String departmentCode;

    @Column(nullable = false)
    private String departmentName;
}
