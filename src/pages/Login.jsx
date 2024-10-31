import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // Initialize navigate
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://ec2-13-51-37-99.eu-north-1.compute.amazonaws.com/api/authenticate",
        {
          method: "POST",
          headers: {
            accept: "/",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Handle successful login, e.g., save token, redirect, etc.
        navigate("/dashboard"); // Example redirection after successful login
      } else {
        setError(t("Invalid username or password."));
      }
    } catch (error) {
      setError(t("An error occurred. Please try again."));
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header" style={{ backgroundColor: "#F0F8FF" }}>
              <h3 className="text-primary">{t("Login")}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleLogin}>
                <div className="form-group mb-2">
                  <input
                    placeholder={t("Username")}
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <div className="invalid-feedback">
                    {t("Please enter your username.")}
                  </div>
                </div>
                <div className="form-group mb-2">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder={t("Password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="invalid-feedback">
                    {t("Please enter your password.")}
                  </div>
                </div>
                <div className="form-group form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    {t("Remember me")}
                  </label>
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                  {t("Login")}
                </button>
                {error && <p className="text-danger mt-3">{error}</p>}
                <p className="mt-3">
                  <a href="#" onClick={() => navigate("/recovery")}>
                    {t("Forgot Password?")}
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
