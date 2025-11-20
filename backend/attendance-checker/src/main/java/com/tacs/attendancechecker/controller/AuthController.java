package com.tacs.attendancechecker.controller;

import com.tacs.attendancechecker.dto.*;
import com.tacs.attendancechecker.entity.User;
import com.tacs.attendancechecker.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    public AuthController(AuthService s) { this.authService = s; }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        authService.register(req);
        return ResponseEntity.ok("Registered");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        AuthResponse resp = authService.login(req);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(@RequestBody Map<String, String> payload) {
        try {
            String credential = payload.get("credential");
            Map<String, Object> googleUser = authService.verifyGoogleToken(credential);

            String email = (String) googleUser.get("email");
            String name = (String) googleUser.get("name");

            User user = authService.findByEmail(email);

            if (user == null) {
                String fname = name != null ? name.split(" ")[0] : "";
                String lname = name != null && name.split(" ").length > 1 ? name.substring(name.indexOf(" ") + 1) : "";

                RegisterRequest req = new RegisterRequest();
                req.setEmail(email);
                req.setFname(fname);
                req.setLname(lname);
                req.setPassword(""); // No password for Google-registered user
                req.setRole("TEACHER"); // Or as appropriate

                user = authService.registerFromGoogle(req);
            }

            AuthResponse authResponse = authService.loginWithGoogle(user);

            return ResponseEntity.ok(authResponse);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Google registration/login failed: " + e.getMessage());
        }
    }
}
