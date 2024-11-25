import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import { config } from "../config/config"; // Import config

export const Recovery = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleRecovery = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.basePath}/api/booking/account/reset-password/init`, { email });
      if (response.status === 200) {
        setMessage(t("Recovery email sent successfully."));
      } else {
        setMessage(t("An error occurred. Please try again."));
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
              <h3 className="text-primary">{t("Password Recovery")}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleRecovery}>
                <div className="form-group">
                  <label htmlFor="email">{t("Email")}</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                  {t("Send Recovery Email")}
                </button>
              </form>
              {message && <p className="mt-3">{message}</p>}
              <p className="mt-3">
                <a href="#" onClick={() => navigate("/login")}>
                  {t("Back to Login")}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
