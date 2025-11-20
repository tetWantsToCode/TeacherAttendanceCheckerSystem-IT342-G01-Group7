package com.tacs.teacherattendance.data.models

data class LoginRequest(
    val email: String,
    val password: String
)

data class RegisterRequest(
    val email: String,
    val password: String,
    val fullName: String
)

data class AuthResponse(
    val token: String
)

data class UserDto(
    val id: Long,
    val email: String,
    val fullName: String,
    val role: String
)

data class ApiError(
    val timestamp: String,
    val status: Int,
    val error: String,
    val message: String,
    val path: String
)
