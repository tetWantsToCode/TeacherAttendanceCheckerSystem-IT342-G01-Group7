package com.tacs.teacherattendance.ui.login

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.tacs.teacherattendance.R
import com.tacs.teacherattendance.data.api.AuthApiService
import com.tacs.teacherattendance.data.repository.AuthRepository
import com.tacs.teacherattendance.databinding.ActivityLoginBinding
import com.tacs.teacherattendance.util.ApiClient
import com.tacs.teacherattendance.util.TokenManager

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private lateinit var tokenManager: TokenManager
    private val viewModel: LoginViewModel by viewModels {
        val authApiService = ApiClient.getAuthApiService(tokenManager)
        val authRepository = AuthRepository(authApiService, tokenManager)
        LoginViewModelFactory(authRepository)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        tokenManager = TokenManager(this)

        // Check if user is already logged in
        if (tokenManager.hasToken()) {
            navigateToDashboard()
            return
        }

        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupUI()
        setupObservers()
    }

    private fun setupUI() {
        binding.loginButton.setOnClickListener {
            val email = binding.emailEditText.text.toString().trim()
            val password = binding.passwordEditText.text.toString()
            viewModel.login(email, password)
        }

        binding.registerTextView.setOnClickListener {
            // Navigate to registration screen (will be created later)
            Toast.makeText(this, "Registration coming soon", Toast.LENGTH_SHORT).show()
        }
    }

    private fun setupObservers() {
        viewModel.loginState.observe(this) { state ->
            when (state) {
                is LoginViewModel.LoginState.Loading -> {
                    binding.loginButton.isEnabled = false
                    binding.loginButton.text = "Logging in..."
                    binding.progressBar.visibility = android.view.View.VISIBLE
                }
                is LoginViewModel.LoginState.Success -> {
                    binding.loginButton.isEnabled = true
                    binding.loginButton.text = "Login"
                    binding.progressBar.visibility = android.view.View.GONE
                    Toast.makeText(this, "Login successful", Toast.LENGTH_SHORT).show()
                    navigateToDashboard()
                }
                is LoginViewModel.LoginState.Error -> {
                    binding.loginButton.isEnabled = true
                    binding.loginButton.text = "Login"
                    binding.progressBar.visibility = android.view.View.GONE
                    Toast.makeText(this, state.message, Toast.LENGTH_LONG).show()
                }
            }
        }

        viewModel.emailError.observe(this) { error ->
            binding.emailInputLayout.error = error
        }

        viewModel.passwordError.observe(this) { error ->
            binding.passwordInputLayout.error = error
        }
    }

    private fun navigateToDashboard() {
        // Create a placeholder activity for now
        // startActivity(Intent(this, DashboardActivity::class.java))
        // finish()
        Toast.makeText(this, "Dashboard activity not yet created", Toast.LENGTH_SHORT).show()
    }
}
