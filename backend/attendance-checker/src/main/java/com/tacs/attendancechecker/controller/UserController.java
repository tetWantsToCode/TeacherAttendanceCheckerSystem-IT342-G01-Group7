package com.tacs.attendancechecker.controller;

import com.tacs.attendancechecker.dto.UserDto;
import com.tacs.attendancechecker.entity.User;
import com.tacs.attendancechecker.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepo;

    public UserController(UserRepository repo) {
        this.userRepo = repo;
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
}
