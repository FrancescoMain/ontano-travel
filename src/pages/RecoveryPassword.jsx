import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from "react-i18next";

export const RecoveryPassword = () => {
  const { t } = useTranslation();

  return (
    <div className="container mt-5">
      {/* ...existing code... */}
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header" style={{ backgroundColor: "#F0F8FF" }}>
              <h3 className="text-primary">{t("Recovery Password")}</h3>
            </div>
            <div className="card-body">
              <form>
                <div className="form-group mb-2">
                  <input
                    placeholder={t("Email")}
                    type="email"
                    className="form-control"
                    id="email"
                    required
                  />
                  <div className="invalid-feedback">
                    {t("Please enter your email.")}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                  {t("Recover Password")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* ...existing code... */}
    </div>
  );
};
