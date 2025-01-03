import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { config } from "../config/config"; // Import config
import { getAuthHeader } from "../utils/auth"; // Import getAuthHeader
import { useTranslation } from "react-i18next"; // Import useTranslation

const passwordRegex =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/; // Update password regex

export const SetPassword = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(t("Passwords do not match"));
      return;
    }
    if (!passwordRegex.test(password)) {
      toast.error(
        t(
          "Password must be at least 8 characters long and contain at least one number, one lowercase letter, one uppercase letter, and one special character"
        )
      );
      return;
    }

    try {
      const response = await axios.post(
        `${config.basePath}/api/booking/account/change-password`,
        {
          currentpassword: oldPassword,
          newpassword: password,
        },
        {
          headers: getAuthHeader(), // Include the token in the headers
        }
      );

      if (response.status === 200) {
        toast.success(t("Password set successfully"));
        navigate("/");
      } else {
        toast.error(t("Failed to set password"));
      }
    } catch (error) {
      toast.error(t("An error occurred. Please try again."));
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header" style={{ backgroundColor: "#F0F8FF" }}>
              <h3 className="text-primary">{t("Set New Password")}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="oldPassword">{t("Old Password")}:</label>
                  <input
                    type="password"
                    className="form-control"
                    id="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">{t("New Password")}:</label>
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
                  <label htmlFor="confirmPassword">
                    {t("Confirm Password")}:
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary mt-3 fs-6">
                  {t("Set Password")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
