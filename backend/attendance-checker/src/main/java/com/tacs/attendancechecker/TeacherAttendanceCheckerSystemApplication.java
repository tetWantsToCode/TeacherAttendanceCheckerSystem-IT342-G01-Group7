package com.tacs.attendancechecker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TeacherAttendanceCheckerSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(TeacherAttendanceCheckerSystemApplication.class, args);
		System.out.println("-------------------------------------------------------");
		System.out.println("Backend successfully started.");
		System.out.println("-------------------------------------------------------");
	}
}
