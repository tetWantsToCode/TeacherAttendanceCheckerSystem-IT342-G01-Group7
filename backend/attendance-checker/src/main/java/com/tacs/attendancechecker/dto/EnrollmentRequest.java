package com.tacs.attendancechecker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentRequest {
    private Integer studentId;
    private Integer courseId;
    private String status; // ACTIVE, DROPPED, COMPLETED
}
