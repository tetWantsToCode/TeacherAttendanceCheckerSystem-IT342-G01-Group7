package com.tacs.attendancechecker.controller;

import com.tacs.attendancechecker.dto.ChangePasswordRequest;
import com.tacs.attendancechecker.dto.UserDto;
import com.tacs.attendancechecker.entity.User;
import com.tacs.attendancechecker.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository repo, PasswordEncoder passwordEncoder) {
        this.userRepo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getProfile(Authentication auth) {
        String email = auth.getName();
        User user = userRepo.findByEmail(email).orElseThrow();

        UserDto dto = new UserDto();
        dto.setUserId(user.getUserId());
        dto.setFname(user.getFname());
        dto.setLname(user.getLname());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());

        return ResponseEntity.ok(dto);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(@Valid @RequestBody UserDto payload, Authentication auth) {
        String email = auth.getName();
        User user = userRepo.findByEmail(email).orElseThrow();

        user.setFname(payload.getFname());
        user.setLname(payload.getLname());
        userRepo.save(user);

        payload.setEmail(user.getEmail());
        payload.setUserId(user.getUserId());
        payload.setRole(user.getRole().name());

        return ResponseEntity.ok(payload);
    }

    @DeleteMapping("/profile")
    public ResponseEntity<Void> deleteProfile(Authentication auth) {
        String email = auth.getName();
        userRepo.findByEmail(email).ifPresent(userRepo::delete);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request, Authentication auth) {
        try {
            String email = auth.getName();
            User user = userRepo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Verify current password
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Current password is incorrect");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            // Validate new password
            if (request.getNewPassword() == null || request.getNewPassword().length() < 8) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "New password must be at least 8 characters long");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            // Update password
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepo.save(user);

            Map<String, String> success = new HashMap<>();
            success.put("message", "Password changed successfully");
            return ResponseEntity.ok(success);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error changing password: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}

