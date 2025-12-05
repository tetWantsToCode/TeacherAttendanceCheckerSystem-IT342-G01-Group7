package com.tacs.attendancechecker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseRequest {
    private String teacherId;
    private String courseCode;
    private String courseName;
    private String description;
    private Integer units;
    private String courseType;
    private String semester;
    private String schoolYear;
    private Boolean isActive;
}
