package com.tacs.attendancechecker.service;

import com.tacs.attendancechecker.dto.*;
import com.tacs.attendancechecker.entity.Student;
import com.tacs.attendancechecker.entity.Teacher;
import com.tacs.attendancechecker.entity.User;
import com.tacs.attendancechecker.repository.StudentRepository;
import com.tacs.attendancechecker.repository.TeacherRepository;
import com.tacs.attendancechecker.repository.UserRepository;
import com.tacs.attendancechecker.util.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final TeacherRepository teacherRepo;
    private final StudentRepository studentRepo;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository repo, TeacherRepository teacherRepo,
                       StudentRepository studentRepo, PasswordEncoder encoder,
                       AuthenticationManager authManager, JwtUtil jwtUtil) {
        this.userRepo = repo;
        this.teacherRepo = teacherRepo;
        this.studentRepo = studentRepo;
        this.encoder = encoder;
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
    }

    public void register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        User u = new User();
        u.setUserId(UUID.randomUUID().toString());
        u.setFname(req.getFname());
        u.setLname(req.getLname());
        u.setEmail(req.getEmail());
        u.setPassword(encoder.encode(req.getPassword()));
        u.setRole(User.Role.STUDENT);
        userRepo.save(u);
    }

    public AuthResponse login(LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        User user = userRepo.findByEmail(req.getEmail()).orElseThrow();
        String token = jwtUtil.generateToken(user.getEmail());
        
        String teacherId = null;
        Integer studentId = null;
        
        if (user.getRole() == User.Role.TEACHER) {
            Optional<Teacher> teacher = teacherRepo.findByUser(user);
            if (teacher.isPresent()) {
                teacherId = teacher.get().getTeacherId();
            }
        } else if (user.getRole() == User.Role.STUDENT) {
            Optional<Student> student = studentRepo.findByUser(user);
            if (student.isPresent()) {
                studentId = student.get().getStudentId();
            }
        }
        
        return new AuthResponse(token, user.getEmail(), user.getFname(), user.getLname(), 
                               user.getRole().name(), teacherId, studentId);
    }

    // Find user by email, or return null if not found
    public User findByEmail(String email) {
        Optional<User> userOpt = userRepo.findByEmail(email);
        return userOpt.orElse(null);
    }

    // Used for Google-authenticated registration only (no password)
    public User registerFromGoogle(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            // (Real world: Just return the user)
            return userRepo.findByEmail(req.getEmail()).get();
        }
        User u = new User();
        u.setUserId(UUID.randomUUID().toString());
        u.setFname(req.getFname());
        u.setLname(req.getLname());
        u.setEmail(req.getEmail());
        u.setPassword(""); //
        u.setRole(User.Role.STUDENT);
        userRepo.save(u);
        return u;
    }

    // Used to generate "login" response for Google users
    public AuthResponse loginWithGoogle(User user) {
        String token = jwtUtil.generateToken(user.getEmail());
        
        String teacherId = null;
        Integer studentId = null;
        
        if (user.getRole() == User.Role.TEACHER) {
            Optional<Teacher> teacher = teacherRepo.findByUser(user);
            if (teacher.isPresent()) {
                teacherId = teacher.get().getTeacherId();
            }
        } else if (user.getRole() == User.Role.STUDENT) {
            Optional<Student> student = studentRepo.findByUser(user);
            if (student.isPresent()) {
                studentId = student.get().getStudentId();
            }
        }
        
        return new AuthResponse(token, user.getEmail(), user.getFname(), user.getLname(), 
                               user.getRole().name(), teacherId, studentId);
    }

    public Map<String, Object> verifyGoogleToken(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList("1032045816890-72lk7isilq0n6gd11m23gfd01u4kb7gm.apps.googleusercontent.com"))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                Payload payload = idToken.getPayload();
                Map<String, Object> userData = new HashMap<>();
                userData.put("id", payload.getSubject());
                userData.put("email", payload.getEmail());
                userData.put("emailVerified", Boolean.valueOf(payload.getEmailVerified()));
                userData.put("name", (String) payload.get("name"));
                userData.put("picture", (String) payload.get("picture"));
                userData.put("locale", (String) payload.get("locale"));
                userData.put("familyName", (String) payload.get("family_name"));
                userData.put("givenName", (String) payload.get("given_name"));
                return userData;
            } else {
                throw new RuntimeException("Invalid Google ID token");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to verify Google ID token", e);
        }
    }
}