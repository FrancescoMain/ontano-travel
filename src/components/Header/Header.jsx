import React, { useState } from "react";
import "./Header.css";
import { Dropdown, Link, Menu, MenuButton, MenuItem } from "@mui/joy";
import { useTranslation } from "react-i18next";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import SearchIcon from "@mui/icons-material/Search";
import it from "../../assets/flags/it.svg";
import us from "../../assets/flags/us.svg";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Spinner } from "../Spinner/Spinner";
import { changeLanguage } from "../../utils/language";
import { handleLogout } from "../../utils/auth";
import { useAuth } from "../../_hooks/useAuth";
import i18n from "../../i18n";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserCircle } from "react-icons/fa";

// Component for authenticated user links
const AuthenticatedLinks = ({
  t,
  handleLogout,
  isWebUser,
  navigate,
  handleOffcanvasClose,
  email,
}) => {
  const location = useLocation();
  const accountData = useSelector((state) => state.account.data);
  const isAdmin = accountData?.authorities?.includes("ROLE_WEB_ADMIN");
  const isAgency = accountData?.authorities?.includes("ROLE_AGENCY_USER");
  return (
    <>
      <li>
        <Link
          className={`Link ${
            location.pathname === "/prenotazioni" ? "active" : ""
          }`}
          color="primary"
          disabled={false}
          level="body-md"
          underline="none"
          variant="plain"
          onClick={() => {
            navigate("/prenotazioni");
            handleOffcanvasClose();
          }}
        >
          {t("Prenotazioni")}
        </Link>
      </li>
      {isAgency && (
        <>
          <li>
            <Link
              className={`Link ${
                location.pathname === "/dashboard-agenzia" ? "active" : ""
              }`}
              color="primary"
              disabled={false}
              level="body-md"
              underline="none"
              variant="plain"
              onClick={() => {
                navigate("/dashboard-agenzia");
                handleOffcanvasClose();
              }}
            >
              {t("Dashboard")}
            </Link>
          </li>
          <li>
            <Link
              className={`Link ${
                location.pathname === "/agenzia/:id" ? "active" : ""
              }`}
              color="primary"
              disabled={false}
              level="body-md"
              underline="none"
              variant="plain"
              onClick={() => {
                navigate("/agenzia/:id");
                handleOffcanvasClose();
              }}
            >
              {t("Dati Agenzia")}
            </Link>
          </li>
        </>
      )}
      {isAdmin && (
        <>
          <li>
            <Link
              className={`Link ${
                location.pathname === "/dashboard" ? "active" : ""
              }`}
              color="primary"
              disabled={false}
              level="body-md"
              underline="none"
              variant="plain"
              onClick={() => {
                navigate("/dashboard");
                handleOffcanvasClose();
              }}
            >
              {t("Dashboard")}
            </Link>
          </li>
          <li>
            <Link
              className={`Link ${
                location.pathname === "/ricerca-agenzia" ? "active" : ""
              }`}
              color="primary"
              disabled={false}
              level="body-md"
              underline="none"
              variant="plain"
              onClick={() => {
                navigate("/ricerca-agenzia");
                handleOffcanvasClose();
              }}
            >
              {t("Ricerca Agenzia")}
            </Link>
          </li>
          <li>
            <Link
              className={`Link ${
                location.pathname === "/admin-estratto-conto" ? "active" : ""
              }`}
              color="primary"
              disabled={false}
              level="body-md"
              underline="none"
              variant="plain"
              onClick={() => {
                navigate("/admin-estratto-conto");
                handleOffcanvasClose();
              }}
            >
              {t("Visualizza Estratto Conto")}
            </Link>
          </li>
          <li>
            <Link
              className={`Link ${
                location.pathname === "/rendicontazione" ? "active" : ""
              }`}
              color="primary"
              disabled={false}
              level="body-md"
              underline="none"
              variant="plain"
              onClick={() => {
                navigate("/rendicontazione");
                handleOffcanvasClose();
              }}
            >
              {t("Rendicontazione")}
            </Link>
          </li>
        </>
      )}

      {isAgency && (
        <li>
          <Link
            className={`Link ${
              location.pathname === "/agency-estratto-conto" ? "active" : ""
            }`}
            color="primary"
            disabled={false}
            level="body-md"
            underline="none"
            variant="plain"
            onClick={() => {
              navigate("/agency-estratto-conto");
              handleOffcanvasClose();
            }}
          >
            {t("Estratti Conto")}
          </Link>
        </li>
      )}
      {!isWebUser && (
        <li className="d-none d-md-block">
          <Dropdown>
            <MenuButton
              color="primary"
              size="sm"
              sx={{ padding: 0, border: 0, zIndex: 1050 }}
            >
              <FaUserCircle size={24} />
            </MenuButton>
            <Menu
              variant="plain"
              color="primary"
              size="sm"
              sx={{ zIndex: 1050 }}
            >
              <MenuItem
                disabled
                className="profile-item text-center justify-content-center flex-column"
                sx={{ justifyContent: "center" }}
              >
                {isAdmin && (
                  <div className="label-admin text-secondary">{t("Admin")}</div>
                )}
                {isAgency && (
                  <div className="label-agency text-secondary">
                    {t("Agency")}
                  </div>
                )}
                {email}
              </MenuItem>
              <MenuItem
                disabled
                className="profile-item"
                sx={{ justifyContent: "center" }}
              >
                <FaUserCircle size={24} />
              </MenuItem>
              <MenuItem
                className={`profile-item text-primary ${
                  location.pathname === "/pannello" ? "active" : ""
                }`}
                onClick={() => {
                  window.location.href = "https://dev-bookingferries.com/";
                  handleOffcanvasClose();
                }}
                sx={{ justifyContent: "center" }}
              >
                {t("Pannello di controllo")}
              </MenuItem>
              <MenuItem
                className={`profile-item text-primary ${
                  location.pathname === "/set-password" ? "active" : ""
                }`}
                onClick={() => {
                  navigate("/set-password");
                  handleOffcanvasClose();
                }}
                sx={{ justifyContent: "center" }}
              >
                {t("Set Password")}
              </MenuItem>
              <MenuItem
                className="profile-item text-primary"
                onClick={() => {
                  handleLogout();
                  handleOffcanvasClose();
                }}
                sx={{ justifyContent: "center" }}
              >
                {t("Logout")}
              </MenuItem>
            </Menu>
          </Dropdown>
        </li>
      )}
    </>
  );
};

// Component for unauthenticated user links
const UnauthenticatedLinks = ({ t, navigate, handleOffcanvasClose }) => {
  const location = useLocation();
  return (
    <>
      <li>
        <Link
          className={`Link ${location.pathname === "/login" ? "active" : ""}`}
          color="primary"
          disabled={false}
          level="body-md"
          underline="none"
          variant="plain"
          onClick={() => {
            navigate("/login");
            handleOffcanvasClose();
          }}
        >
          {t("Login")}
          <LoginIcon />
        </Link>
      </li>
      <li>
        <Link
          className={`Link ${
            location.pathname === "/cerca-prenotazione" ? "active" : ""
          }`}
          color="primary"
          disabled={false}
          level="body-md"
          underline="none"
          variant="plain"
          onClick={() => {
            navigate("/cerca-prenotazione");
            handleOffcanvasClose();
          }}
        >
          {t("Cerca prenotazione")}
          <SearchIcon />
        </Link>
      </li>
      <li>
        <Link
          className={`Link ${
            location.pathname === "/registra-agenzia" ? "active" : ""
          }`}
          color="primary"
          disabled={false}
          level="body-md"
          underline="none"
          variant="plain"
          onClick={() => {
            navigate("/registra-agenzia");
            handleOffcanvasClose();
          }}
        >
          {t("Registra Agenzia")}
        </Link>
      </li>
    </>
  );
};

export const Header = () => {
  const { loading, token, isWebUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation(); // Add this line
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const accountData = useSelector((state) => state.account.data);
  const email = accountData?.email;
  const isAdmin = accountData?.authorities?.includes("ROLE_WEB_ADMIN");
  const isAgency = accountData?.authorities?.includes("ROLE_AGENCY_USER");

  const handleOffcanvasClose = () => setShowOffcanvas(false);
  const handleOffcanvasShow = () => setShowOffcanvas(true);

  return (
    <div className="header">
      <Spinner active={loading} />
      <nav>
        <ul className="mb-0">
          <li>
            <Link
              color="primary"
              disabled={false}
              level="body-md"
              underline="none"
              variant="plain"
              onClick={() => navigate("/")}
            >
              <img
                className="logo"
                src="https://www.quickferries.com/wp-content/uploads/2018/12/Logo-QuickFerries.png"
                alt=""
              />
            </Link>
          </li>
          <div className="header-side">
            <li>
              <Link
                color="primary"
                disabled={false}
                level="body-md"
                underline="none"
                variant="plain"
                onClick={() => navigate("/")}
              >
                {t("Home")}
              </Link>
            </li>
            {token ? (
              <AuthenticatedLinks
                t={t}
                handleLogout={handleLogout}
                isWebUser={isWebUser}
                navigate={navigate}
                handleOffcanvasClose={handleOffcanvasClose}
                email={email}
              />
            ) : (
              <UnauthenticatedLinks
                t={t}
                navigate={navigate}
                handleOffcanvasClose={handleOffcanvasClose}
              />
            )}
            <li className="lang">
              <Dropdown>
                <MenuButton
                  color="primary"
                  size="sm"
                  sx={{ padding: 0, border: 0, zIndex: 1050 }}
                >
                  <img
                    className="img-lang"
                    src={i18n.language === "it" ? it : us}
                    alt="language"
                  />
                  <ArrowDropDownIcon />
                </MenuButton>
                <Menu
                  variant="plain"
                  color="primary"
                  size="sm"
                  sx={{ zIndex: 1050 }}
                >
                  <MenuItem
                    className="lang-item"
                    onClick={() => changeLanguage("it")}
                  >
                    <img className="rounded-circle" src={it} alt="Italiano" />
                  </MenuItem>
                  <MenuItem onClick={() => changeLanguage("en")}>
                    <img className="rounded-circle" src={us} alt="English" />
                  </MenuItem>
                </Menu>
              </Dropdown>
            </li>
          </div>

          <div className="header-mobile">
            <button
              className="btn btn-text"
              type="button"
              onClick={handleOffcanvasShow}
            >
              <MenuIcon />
            </button>
            <div
              className={`offcanvas offcanvas-end ${
                showOffcanvas ? "show" : ""
              }`}
              tabIndex="-1"
              style={{
                visibility: showOffcanvas ? "visible" : "hidden",
                width: "250px",
              }}
            >
              <div className="offcanvas-header">
                <h5 className="offcanvas-title">{t("Menu")}</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleOffcanvasClose}
                ></button>
              </div>
              <div className="offcanvas-body">
                {token && (
                  <>
                    {isAdmin && (
                      <div style={{ textAlign: "center", margin: "10px 0" }}>
                        <span className="label-admin">{t("Admin")}</span>
                      </div>
                    )}
                    {isAgency && (
                      <div style={{ textAlign: "center", margin: "10px 0" }}>
                        <span className="label-agency">{t("Agency")}</span>
                      </div>
                    )}
                    <div
                      className="offcanvas-email"
                      style={{ fontSize: "0.775rem", textAlign: "center" }}
                    >
                      {email}
                    </div>
                    <div style={{ textAlign: "center", margin: "10px 0" }}>
                      <FaUserCircle size={24} />
                    </div>
                  </>
                )}
                <li>
                  <Link
                    color="primary"
                    disabled={false}
                    level="body-md"
                    underline="none"
                    variant="plain"
                    onClick={() => navigate("/")}
                  >
                    {t("Home")}
                  </Link>
                </li>
                {token ? (
                  <>
                    <AuthenticatedLinks
                      t={t}
                      handleLogout={handleLogout}
                      isWebUser={isWebUser}
                      navigate={navigate}
                      handleOffcanvasClose={handleOffcanvasClose}
                      email={email}
                    />
                    <li>
                      <Link
                        // className={`Link ${
                        //   location.pathname === "/pannell" ? "active" : ""
                        // }`}
                        color="primary"
                        disabled={false}
                        level="body-md"
                        underline="none"
                        variant="plain"
                        onClick={() => {
                          window.location.href =
                            "https://dev-bookingferries.com/";
                          handleOffcanvasClose();
                        }}
                      >
                        {t("Pannello di controllo")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`Link ${
                          location.pathname === "/set-password" ? "active" : ""
                        }`}
                        color="primary"
                        disabled={false}
                        level="body-md"
                        underline="none"
                        variant="plain"
                        onClick={() => {
                          navigate("/set-password");
                          handleOffcanvasClose();
                        }}
                      >
                        {t("Set Password")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="Link"
                        color="primary"
                        disabled={false}
                        level="body-md"
                        underline="none"
                        variant="plain"
                        onClick={() => {
                          handleLogout();
                          handleOffcanvasClose();
                        }}
                      >
                        {t("Logout")}
                      </Link>
                    </li>
                  </>
                ) : (
                  <UnauthenticatedLinks
                    t={t}
                    navigate={navigate}
                    handleOffcanvasClose={handleOffcanvasClose}
                  />
                )}
                <li className="lang">
                  <Dropdown>
                    <MenuButton
                      color="primary"
                      size="sm"
                      sx={{ padding: 0, border: 0, zIndex: 1050 }}
                    >
                      <img
                        className="img-lang"
                        src={i18n.language === "it" ? it : us}
                        alt="language"
                      />
                      <ArrowDropDownIcon />
                    </MenuButton>
                    <Menu
                      variant="plain"
                      color="primary"
                      size="sm"
                      sx={{ zIndex: 1050 }}
                    >
                      <MenuItem
                        className="lang-item"
                        onClick={() => changeLanguage("it")}
                      >
                        <img
                          className="rounded-circle"
                          src={it}
                          alt="Italiano"
                        />
                      </MenuItem>
                      <MenuItem onClick={() => changeLanguage("en")}>
                        <img
                          className="rounded-circle"
                          src={us}
                          alt="English"
                        />
                      </MenuItem>
                    </Menu>
                  </Dropdown>
                </li>
              </div>
            </div>
          </div>
        </ul>
      </nav>
    </div>
  );
};
