import React, { useState } from "react";
import "../css/Register.css";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "../utils/auth-utils";

export default function Register() {
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    function gotoDashboard(role) {
        if (role === "ADMIN") navigate("/admin");
        else if (role === "TEACHER") navigate("/teacher");
        else if (role === "STUDENT") navigate("/student");
        else navigate("/");
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fname, lname, email, password, role: "TEACHER" })
            });
            if (response.ok) {
                const authData = await response.json();
                setCurrentUser(authData);
                gotoDashboard(authData.role);
            } else {
                const msg = await response.text();
                setError(msg || "Registration failed");
            }
        } catch (err) {
            setError("Registration error. Check your network or backend.");
            console.error(err);
        }
    }

    return (
        <div className="register-page">
            <div className="register-card" role="main" aria-labelledby="register-title">
                <div className="form-side">
                    <div className="brand">
                        <div className="logo" aria-hidden>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="24" height="24" rx="6" fill="var(--accent)" />
                                <path d="M7 13c1.5-2 3-3 5-3s3.5 1 5 3" stroke="var(--accent-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="9" r="1.5" fill="#fff" />
                            </svg>
                        </div>
                        <div className="brand-text">
                            <h1 id="register-title">Create an account</h1>
                            <p className="muted">Register to start managing attendance</p>
                        </div>
                    </div>

                    <form className="register-form" onSubmit={handleSubmit} noValidate>
                        {error && <div className="error-message">{error}</div>}
                        <label className="form-label" htmlFor="fname">First name</label>
                        <div className="form-group">
                            <input
                                id="fname"
                                className="input"
                                type="text"
                                placeholder="Enter your first name"
                                value={fname}
                                onChange={(e) => setFname(e.target.value)}
                                required
                                aria-required="true"
                            />
                        </div>

                        <label className="form-label" htmlFor="lname">Last name</label>
                        <div className="form-group">
                            <input
                                id="lname"
                                className="input"
                                type="text"
                                placeholder="Enter your last name"
                                value={lname}
                                onChange={(e) => setLname(e.target.value)}
                                required
                                aria-required="true"
                            />
                        </div>

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
                                placeholder="Create a password"
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

                        <label className="form-label" htmlFor="confirm-password">Confirm password</label>
                        <div className="form-group password-group">
                            <input
                                id="confirm-password"
                                className="input"
                                type={showPassword ? "text" : "password"}
                                placeholder="Repeat your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                aria-required="true"
                            />
                        </div>

                        <button className="btn-primary" type="submit">Create account</button>

                        <div className="divider">or</div>

                        <div className="alt-actions">
                            <GoogleLogin
                                text="signup_with"
                                onSuccess={async credentialResponse => {
                                    try {
                                        const res = await fetch("http://localhost:8080/api/auth/google", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ credential: credentialResponse.credential })
                                        });
                                        if (res.ok) {
                                            const authData = await res.json();
                                            setCurrentUser(authData);
                                            gotoDashboard(authData.role);
                                        } else {
                                            const msg = await res.text();
                                            alert(msg || "Google registration failed (server-side)");
                                        }
                                    } catch (err) {
                                        alert("Google registration failed (network/backend error)");
                                        console.error(err);
                                    }
                                }}
                                onError={() => {
                                    alert("Google Sign Up Failed (client-side).");
                                }}
                            />
                            <p className="signup-text">
                                Already have an account?{" "}
                                <a
                                    href="#"
                                    onClick={e => {
                                        e.preventDefault();
                                        navigate("/login");
                                    }}
                                >
                                    Sign in
                                </a>
                            </p>
                        </div>
                    </form>
                </div>

                <div className="image-side" aria-hidden>
                    <div className="image-content">
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
                        <p className="image-caption">Join and start tracking attendance with ease.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}