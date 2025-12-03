package com.tacs.attendancechecker.service;

import com.tacs.attendancechecker.entity.Notification;
import com.tacs.attendancechecker.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Notification getNotificationById(Integer notificationId) {
        return notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
    }

    public List<Notification> getNotificationsByUser(String userId) {
        return notificationRepository.findByUserUserId(userId);
    }

    public List<Notification> getUnreadNotificationsByUser(String userId) {
        return notificationRepository.findByUserUserIdAndIsRead(userId, false);
    }

    public Notification markAsRead(Integer notificationId) {
        Notification notification = getNotificationById(notificationId);
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }

    public void deleteNotification(Integer notificationId) {
        notificationRepository.deleteById(notificationId);
    }
}
