import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export const LoginForm = ({ onLogin }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // Add rememberMe state

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onLogin(username, password, rememberMe);
    if (!result.success) {
      setError(t(result.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group mb-2">
        <label htmlFor="username">{t("Username")}</label>
        <input
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
        <label htmlFor="password">{t("Password")}</label>
        <input
          type="password"
          className="form-control"
          id="password"
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
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)} // Update rememberMe state
        />
        <label className="form-check-label" htmlFor="rememberMe">
          {t("Remember me")}
        </label>
      </div>
      <button type="submit" className="btn btn-primary mt-3 fs-6">
        {t("Login")}
      </button>
      {error && <p className="text-danger mt-3">{error}</p>}
    </form>
  );
};
