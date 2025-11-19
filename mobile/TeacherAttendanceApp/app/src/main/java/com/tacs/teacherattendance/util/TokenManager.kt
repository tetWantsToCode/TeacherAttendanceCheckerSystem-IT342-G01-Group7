package com.tacs.teacherattendance.util

import android.content.Context
import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey

class TokenManager(context: Context) {

    private val masterKey: MasterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

    private val encryptedSharedPreferences: SharedPreferences = EncryptedSharedPreferences.create(
        context,
        PREFS_NAME,
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    fun saveToken(token: String) {
        encryptedSharedPreferences.edit().putString(KEY_TOKEN, token).apply()
    }

    fun getToken(): String? {
        return encryptedSharedPreferences.getString(KEY_TOKEN, null)
    }

    fun clearToken() {
        encryptedSharedPreferences.edit().remove(KEY_TOKEN).apply()
    }

    fun hasToken(): Boolean {
        return encryptedSharedPreferences.contains(KEY_TOKEN)
    }

    companion object {
        private const val PREFS_NAME = "tacs_secure_prefs"
        private const val KEY_TOKEN = "jwt_token"
    }
}
