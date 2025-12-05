package com.tacs.attendancechecker.service;

import com.tacs.attendancechecker.dto.CourseRequest;
import com.tacs.attendancechecker.dto.CourseResponse;
import com.tacs.attendancechecker.entity.Course;
import com.tacs.attendancechecker.entity.Teacher;
import com.tacs.attendancechecker.repository.CourseRepository;
import com.tacs.attendancechecker.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    public CourseResponse createCourse(CourseRequest request) {
        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        Course course = new Course();
        course.setTeacher(teacher);
        course.setCourseCode(request.getCourseCode());
        course.setCourseName(request.getCourseName());
        course.setDescription(request.getDescription());
        course.setUnits(request.getUnits());
        course.setCourseType(request.getCourseType());
        course.setSemester(request.getSemester());
        course.setSchoolYear(request.getSchoolYear());
        course.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

        Course savedCourse = courseRepository.save(course);
        return mapToCourseResponse(savedCourse);
    }

    public List<CourseResponse> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::mapToCourseResponse)
                .collect(Collectors.toList());
    }

    public CourseResponse getCourseById(Integer courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return mapToCourseResponse(course);
    }

    public CourseResponse updateCourse(Integer courseId, CourseRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (request.getTeacherId() != null && !request.getTeacherId().isEmpty()) {
            Teacher teacher = teacherRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new RuntimeException("Teacher not found"));
            course.setTeacher(teacher);
        }

        if (request.getCourseCode() != null) {
            course.setCourseCode(request.getCourseCode());
        }
        
        if (request.getCourseName() != null) {
            course.setCourseName(request.getCourseName());
        }

        if (request.getDescription() != null) {
            course.setDescription(request.getDescription());
        }
        
        if (request.getUnits() != null) {
            course.setUnits(request.getUnits());
        }
        
        if (request.getCourseType() != null) {
            course.setCourseType(request.getCourseType());
        }
        
        if (request.getSemester() != null) {
            course.setSemester(request.getSemester());
        }
        
        if (request.getSchoolYear() != null) {
            course.setSchoolYear(request.getSchoolYear());
        }
        
        if (request.getIsActive() != null) {
            course.setIsActive(request.getIsActive());
        }

        Course updatedCourse = courseRepository.save(course);
        return mapToCourseResponse(updatedCourse);
    }

    public void deleteCourse(Integer courseId) {
        courseRepository.deleteById(courseId);
    }

    private CourseResponse mapToCourseResponse(Course course) {
        CourseResponse response = new CourseResponse();
        response.setCourseId(course.getCourseId());
        response.setCourseCode(course.getCourseCode());
        response.setCourseName(course.getCourseName());
        response.setDescription(course.getDescription());
        response.setUnits(course.getUnits());
        response.setCourseType(course.getCourseType());
        response.setSemester(course.getSemester());
        response.setSchoolYear(course.getSchoolYear());
        response.setIsActive(course.getIsActive());
        response.setTeacherId(course.getTeacher().getTeacherId());
        response.setTeacherName(course.getTeacher().getUser().getFname() + " " + 
                               course.getTeacher().getUser().getLname());
        return response;
    }
}
