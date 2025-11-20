import React, { useState } from "react";
import "../css/Login.css";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [remember, setRemember] = useState(false);

	function handleSubmit(e) {
		e.preventDefault();
		// UI-only: just log values. Replace with real auth call later.
		console.log({ email, password, remember });
	}

	return (
		<div className="login-page">
			<div className="login-card" role="main" aria-labelledby="login-title">
				<div className="form-side">
					<div className="brand">
					<div className="logo" aria-hidden>
						<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect width="24" height="24" rx="6" fill="#2B6CB0" />
							<path d="M7 13c1.5-2 3-3 5-3s3.5 1 5 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
							<circle cx="12" cy="9" r="1.5" fill="#fff" />
						</svg>
					</div>
					<div className="brand-text">
						<h1 id="login-title">Teacher Attendance</h1>
						<p className="muted">Sign in to manage classes and attendance</p>
					</div>
					</div>

					<form className="login-form" onSubmit={handleSubmit} noValidate>
					<label className="form-label" htmlFor="email">Email</label>
					<div className="form-group">
						<input
							id="email"
							className="input"
							type="email"
							placeholder="you@school.edu"
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
						<button type="button" className="btn-outline">Sign in with Google</button>
						<p className="signup-text">Don't have an account? <a href="#">Register</a></p>
					</div>
					</form>
				</div>

				<div className="image-side" aria-hidden>
					<div className="image-content">
						{/* Illustration: attendance clipboard with checkmarks */}
						<svg width="320" height="220" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Attendance illustration">
							<rect x="8" y="8" width="304" height="204" rx="16" fill="#E8F4FF" />
							<rect x="36" y="26" width="112" height="28" rx="6" fill="#2B6CB0" />
							<rect x="36" y="64" width="220" height="12" rx="6" fill="#fff" />
							<rect x="36" y="84" width="220" height="12" rx="6" fill="#fff" />
							<rect x="36" y="104" width="220" height="12" rx="6" fill="#fff" />
							<g transform="translate(180,60)">
								<circle cx="36" cy="12" r="10" fill="#10B981" />
								<path d="M30 12l3 3 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								<circle cx="36" cy="44" r="10" fill="#F59E0B" />
								<path d="M30 44l3 3 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							</g>
						</svg>
						<p className="image-caption">Simplify attendance — quick check-ins, clear reports.</p>
					</div>
				</div>
			</div>
		</div>
	);
}