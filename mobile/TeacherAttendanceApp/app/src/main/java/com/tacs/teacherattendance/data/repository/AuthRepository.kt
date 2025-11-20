package com.tacs.teacherattendance.data.repository

import com.tacs.teacherattendance.data.api.AuthApiService
import com.tacs.teacherattendance.data.models.AuthResponse
import com.tacs.teacherattendance.data.models.LoginRequest
import com.tacs.teacherattendance.data.models.RegisterRequest
import com.tacs.teacherattendance.util.TokenManager

class AuthRepository(
    private val authApiService: AuthApiService,
    private val tokenManager: TokenManager
) {

    suspend fun login(email: String, password: String): Result<String> {
        return try {
            val loginRequest = LoginRequest(email, password)
            val response = authApiService.login(loginRequest)
            tokenManager.saveToken(response.token)
            Result.success(response.token)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun register(email: String, password: String, fullName: String): Result<String> {
        return try {
            val registerRequest = RegisterRequest(email, password, fullName)
            val response = authApiService.register(registerRequest)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun logout() {
        tokenManager.clearToken()
    }

    fun hasToken(): Boolean {
        return tokenManager.hasToken()
    }

    fun getToken(): String? {
        return tokenManager.getToken()
    }
}
