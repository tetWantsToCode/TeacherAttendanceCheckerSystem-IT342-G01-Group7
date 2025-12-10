package com.tacs.attendancechecker.service;

import com.tacs.attendancechecker.entity.OfferedCourse;
import com.tacs.attendancechecker.repository.OfferedCourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OfferedCourseService {

    @Autowired
    private OfferedCourseRepository offeredCourseRepository;

    public OfferedCourse createOfferedCourse(OfferedCourse offeredCourse) {
        return offeredCourseRepository.save(offeredCourse);
    }

    public List<OfferedCourse> getAllOfferedCourses() {
        return offeredCourseRepository.findAll();
    }

    public OfferedCourse getOfferedCourseById(Integer offeredCourseId) {
        return offeredCourseRepository.findById(offeredCourseId)
                .orElseThrow(() -> new RuntimeException("Offered course not found"));
    }

    public List<OfferedCourse> getOfferedCoursesByTeacher(String teacherId) {
        return offeredCourseRepository.findByTeacherTeacherId(teacherId);
    }

    public List<OfferedCourse> getOfferedCoursesByCourseId(Integer courseId) {
        return offeredCourseRepository.findByCourseCourseId(courseId);
    }

    public OfferedCourse updateOfferedCourse(Integer offeredCourseId, OfferedCourse offeredCourse) {
        OfferedCourse existingOfferedCourse = getOfferedCourseById(offeredCourseId);
        existingOfferedCourse.setTeacher(offeredCourse.getTeacher());
        existingOfferedCourse.setClassroom(offeredCourse.getClassroom());
        existingOfferedCourse.setCourse(offeredCourse.getCourse());
        existingOfferedCourse.setSchedule(offeredCourse.getSchedule());
        existingOfferedCourse.setSemester(offeredCourse.getSemester());
        existingOfferedCourse.setUnits(offeredCourse.getUnits());
        existingOfferedCourse.setStartTime(offeredCourse.getStartTime());
        existingOfferedCourse.setEndTime(offeredCourse.getEndTime());
        existingOfferedCourse.setDayOfWeek(offeredCourse.getDayOfWeek());
        return offeredCourseRepository.save(existingOfferedCourse);
    }

    public void deleteOfferedCourse(Integer offeredCourseId) {
        offeredCourseRepository.deleteById(offeredCourseId);
    }

    public void deleteAllOfferedCourses() {
        offeredCourseRepository.deleteAll();
    }
}
