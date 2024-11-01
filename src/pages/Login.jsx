import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { authenticateUser } from "../_api/auth/auth";
import { LoginForm } from "../components/Login/LoginForm";

export const Login = () => {
  const { t } = useTranslation(); // Initialize t
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async (username, password, rememberMe) => {
    try {
      const result = await authenticateUser(username, password, rememberMe);
      if (result.success) {
        navigate("/"); // Redirect to home page after successful login
      }
      return result;
    } catch (error) {
      return {
        success: false,
        message: "An error occurred. Please try again.",
      };
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
              <LoginForm onLogin={handleLogin} />
              <p className="mt-3">
                <a href="#" onClick={() => navigate("/recovery")}>
                  {t("Forgot Password?")}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
