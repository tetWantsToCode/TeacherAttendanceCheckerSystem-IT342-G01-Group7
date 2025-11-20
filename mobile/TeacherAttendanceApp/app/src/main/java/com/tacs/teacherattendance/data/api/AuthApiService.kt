package com.tacs.teacherattendance.data.api

import com.tacs.teacherattendance.data.models.AuthResponse
import com.tacs.teacherattendance.data.models.LoginRequest
import com.tacs.teacherattendance.data.models.RegisterRequest
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApiService {

    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): AuthResponse

    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): String
}
