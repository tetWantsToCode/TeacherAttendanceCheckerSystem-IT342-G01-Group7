import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { setCurrentUser } from "../utils/auth-utils";
import "../css/Login.css";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [remember, setRemember] = useState(false);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	function gotoDashboard(role) {
		if (role === "ADMIN") navigate("/admin");
		else if (role === "TEACHER") navigate("/teacher");
		else if (role === "STUDENT") navigate("/student");
		else navigate("/"); // fallback
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setError(null);

		try {
			const response = await fetch("http://localhost:8080/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			if (response.ok) {
				const authData = await response.json();
				setCurrentUser(authData);
				gotoDashboard(authData.role);
			} else {
				const msg = await response.text();
				setError(msg || "Login failed");
			}
		} catch (err) {
			setError("Login error. Check your network or backend.");
			console.error(err);
		}
	}

	return (
		<div className="login-page">
			<div className="login-card" role="main" aria-labelledby="login-title">
				<div className="form-side">
					<div className="brand">
						<div className="logo" aria-hidden>
							{/* your SVG logo code */}
						</div>
						<div className="brand-text">
							<h1 id="login-title">Teacher Attendance</h1>
							<p className="muted">Sign in to manage classes and attendance</p>
						</div>
					</div>

					<form className="login-form" onSubmit={handleSubmit} noValidate>
						{error && <div className="error-message">{error}</div>}
						<label className="form-label" htmlFor="email">Email</label>
						<div className="form-group">
							<input
								id="email"
								className="input"
								type="email"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								aria-required="true"
							/>
						</div>

						<label className="form-label" htmlFor="password">Password</label>
						<div className="form-group password-group">
							<input
								id="password"
								className="input"
								type={showPassword ? "text" : "password"}
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								aria-required="true"
							/>
							<button
								type="button"
								className="password-toggle"
								aria-label={showPassword ? "Hide password" : "Show password"}
								onClick={() => setShowPassword((s) => !s)}
							>
								{showPassword ? "Hide" : "Show"}
							</button>
						</div>

						<div className="form-row">
							<label className="remember">
								<input
									type="checkbox"
									checked={remember}
									onChange={(e) => setRemember(e.target.checked)}
								/>
								<span>Remember me</span>
							</label>
							<a className="forgot" href="#">Forgot?</a>
						</div>

						<button className="btn-primary" type="submit">Sign in</button>

						<div className="divider">or</div>

						<div className="alt-actions">
							<GoogleLogin
								onSuccess={async credentialResponse => {
									try {
										const res = await fetch("http://localhost:8080/api/auth/google", {
											method: "POST",
											headers: { "Content-Type": "application/json" },
											body: JSON.stringify({ credential: credentialResponse.credential }),
										});
										if (res.ok) {
											const authData = await res.json();
											setCurrentUser(authData);
											gotoDashboard(authData.role);
										} else {
											alert("Google login failed (server-side)");
										}
									} catch (err) {
										alert("Google login failed (network/backend error)");
										console.error(err);
									}
								}}
								onError={() => {
									alert('Google Login Failed (client-side).');
								}}
							/>
							<p className="signup-text">
								Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate("/register") }}>Register</a>
							</p>
						</div>
					</form>
				</div>
				<div className="image-side" aria-hidden>
					{/* Your image/content here */}
				</div>
			</div>
		</div>
	);
}