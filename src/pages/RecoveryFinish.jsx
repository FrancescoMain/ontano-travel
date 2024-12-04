import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { config } from "../config/config"; // Import config
import { useTranslation } from "react-i18next"; // Import useTranslation

const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/; // Update password regex

export const RecoveryFinish = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const key = params.get("key");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage(t("Passwords do not match"));
      return;
    }
    if (!passwordRegex.test(password)) {
      setMessage(t("Password must be at least 8 characters long and contain at least one number, one lowercase letter, one uppercase letter, and one special character"));
      return;
    }

    try {
      const response = await axios.post(`${config.basePath}/api/booking/account/reset-password/finish`, {
        key: key,
        newpassword: password,
      });
      if (response.status === 200) {
        setMessage(t("Password changed successfully"));
      } else {
        setMessage(t("Failed to change password"));
      }
    } catch (error) {
      setMessage(t("An error occurred. Please try again."));
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header" style={{ backgroundColor: "#F0F8FF" }}>
              <h3 className="text-primary">{t("Recovery")}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="password">{t("New Password")}</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">{t("Confirm Password")}</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                  {t("Change Password")}
                </button>
              </form>
              {message && <p className="mt-3">{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

