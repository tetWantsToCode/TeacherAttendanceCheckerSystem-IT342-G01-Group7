package com.tacs.attendancechecker.repository;

import com.tacs.attendancechecker.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByUserUserId(String userId);
    List<Notification> findByUserUserIdAndIsRead(String userId, Boolean isRead);
}
