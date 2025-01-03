import React from "react";
import useRegistraAgenzia from "../_hooks/useRegistraAgenzia";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const RegistraAgenzia = () => {
  const {
    formData,
    touched,
    loading,
    success,
    handleChange,
    handleBlur,
    handleSubmit,
    getInputClass,
    t,
  } = useRegistraAgenzia();

  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="row justify-content-center align-items-center g-2">
        <form onSubmit={handleSubmit} className="col-lg-6">
          <h2>{t("Registrazione Agenzia")}</h2>
          {loading && <p>{t("Loading...")}</p>}
          {success && (
            <p className="text-success">
              {t("Agency registered successfully!")}
            </p>
          )}
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="name" className="form-label">
                {t("Agency Name")} *
              </label>
              <input
                type="text"
                className={getInputClass("name")}
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="ragSoc" className="form-label">
                {t("Ragione Sociale")} *
              </label>
              <input
                type="text"
                className={getInputClass("ragSoc")}
                id="ragSoc"
                name="ragSoc"
                value={formData.ragSoc}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="parIva" className="form-label">
                {t("Partita IVA")} *
              </label>
              <input
                type="text"
                className={getInputClass("parIva")}
                id="parIva"
                name="parIva"
                value={formData.parIva}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              {t("Address")} *
            </label>
            <input
              type="text"
              className={getInputClass("address")}
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
          </div>
          <div className="row">
            <div className="col-md-3 mb-3">
              <label htmlFor="city" className="form-label">
                {t("City")} *
              </label>
              <input
                type="text"
                className={getInputClass("city")}
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
            <div className="col-md-3 mb-3">
              <label htmlFor="cap" className="form-label">
                {t("CAP")} *
              </label>
              <input
                type="text"
                className={getInputClass("cap")}
                id="cap"
                name="cap"
                value={formData.cap}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
            <div className="col-md-3 mb-3">
              <label htmlFor="prov" className="form-label">
                {t("Province")} *
              </label>
              <input
                type="text"
                className={getInputClass("prov")}
                id="prov"
                name="prov"
                value={formData.prov}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
            <div className="col-md-3 mb-3">
              <label htmlFor="nationality" className="form-label">
                {t("Nationality")} *
              </label>
              <input
                type="text"
                className={getInputClass("nationality")}
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="telephone" className="form-label">
                {t("Telephone")} *
              </label>
              <input
                type="text"
                className={getInputClass("telephone")}
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
          </div>

          <h3>{t("Dati per l'accesso")}</h3>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="email" className="form-label">
                {t("Email")} *
              </label>
              <input
                type="email"
                className={getInputClass("email")}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="password" className="form-label">
                {t("Password")} *
              </label>
              <input
                type="password"
                className={getInputClass("password")}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                {t("Confirm Password")} *
              </label>
              <input
                type="password"
                className={getInputClass("confirmPassword")}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
            </div>
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="termsAccepted"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            <label className="form-check-label" htmlFor="termsAccepted">
              {t("Ho letto e accettato i")}{" "}
              <a
                href="https://www.quickferries.com/it/condizioni-generali-di-prenotazioni/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("termini e condizioni")}
              </a>
              {" / "}
              <a
                href="https://www.quickferries.com/it/privacy-policy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("Informativa sulla privacy")}
              </a>
            </label>
          </div>
          <button type="submit" className="btn btn-primary fs-6">
            {t("Submit")}
          </button>
          <p className="mt-3">* {t("Campi obbligatori")}</p>
        </form>
      </div>
    </div>
  );
};

export default RegistraAgenzia;
