package com.tacs.attendancechecker.service;

import com.tacs.attendancechecker.entity.AttendanceSession;
import com.tacs.attendancechecker.repository.AttendanceSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AttendanceSessionService {

    @Autowired
    private AttendanceSessionRepository attendanceSessionRepository;

    public AttendanceSession createAttendanceSession(AttendanceSession attendanceSession) {
        return attendanceSessionRepository.save(attendanceSession);
    }

    public List<AttendanceSession> getAllAttendanceSessions() {
        return attendanceSessionRepository.findAll();
    }

    public AttendanceSession getAttendanceSessionById(Integer sessionId) {
        return attendanceSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Attendance session not found"));
    }

    public List<AttendanceSession> getAttendanceSessionsByCourse(Integer courseId) {
        return attendanceSessionRepository.findByCourseCourseId(courseId);
    }

    public List<AttendanceSession> getAttendanceSessionsByTeacher(String teacherId) {
        return attendanceSessionRepository.findByTeacherTeacherId(teacherId);
    }

    public List<AttendanceSession> getAttendanceSessionsByCourseAndDate(Integer courseId, LocalDate date) {
        return attendanceSessionRepository.findByCourseCourseIdAndDate(courseId, date);
    }

    public AttendanceSession updateAttendanceSession(Integer sessionId, AttendanceSession attendanceSession) {
        AttendanceSession existingSession = getAttendanceSessionById(sessionId);
        existingSession.setCourse(attendanceSession.getCourse());
        existingSession.setTeacher(attendanceSession.getTeacher());
        existingSession.setDate(attendanceSession.getDate());
        existingSession.setStartTime(attendanceSession.getStartTime());
        existingSession.setEndTime(attendanceSession.getEndTime());
        existingSession.setSessionType(attendanceSession.getSessionType());
        existingSession.setIsFinalized(attendanceSession.getIsFinalized());
        existingSession.setRemarks(attendanceSession.getRemarks());
        return attendanceSessionRepository.save(existingSession);
    }

    public void deleteAttendanceSession(Integer sessionId) {
        attendanceSessionRepository.deleteById(sessionId);
    }
}
