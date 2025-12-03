package com.tacs.attendancechecker.service;

import com.tacs.attendancechecker.entity.Classroom;
import com.tacs.attendancechecker.repository.ClassroomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassroomService {

    @Autowired
    private ClassroomRepository classroomRepository;

    public Classroom createClassroom(Classroom classroom) {
        return classroomRepository.save(classroom);
    }

    public List<Classroom> getAllClassrooms() {
        return classroomRepository.findAll();
    }

    public Classroom getClassroomById(Integer classroomId) {
        return classroomRepository.findById(classroomId)
                .orElseThrow(() -> new RuntimeException("Classroom not found"));
    }

    public Classroom updateClassroom(Integer classroomId, Classroom classroom) {
        Classroom existingClassroom = getClassroomById(classroomId);
        existingClassroom.setRoomNumber(classroom.getRoomNumber());
        existingClassroom.setBuilding(classroom.getBuilding());
        existingClassroom.setCapacity(classroom.getCapacity());
        existingClassroom.setRoomType(classroom.getRoomType());
        return classroomRepository.save(existingClassroom);
    }

    public void deleteClassroom(Integer classroomId) {
        classroomRepository.deleteById(classroomId);
    }
}
