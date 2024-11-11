import React from "react";
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
import { useNavigate } from "react-router-dom";

// Component for authenticated user links
const AuthenticatedLinks = ({ t, handleLogout, isWebUser, navigate }) => (
  <>
    <li>
      <Link
        className="Link"
        color="primary"
        disabled={false}
        level="body-md"
        underline="none"
        variant="plain"
        onClick={() => navigate("/prenotazioni")}
      >
        {t("Prenotazioni")}
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
        onClick={() => navigate("/dashboard")}
      >
        {t("Dashboard")}
      </Link>
    </li>

    {!isWebUser && (
      <li>
        <Link
          className="Link"
          color="primary"
          disabled={false}
          level="body-md"
          underline="none"
          variant="plain"
          onClick={handleLogout}
        >
          {t("Logout")}
        </Link>
      </li>
    )}
  </>
);

// Component for unauthenticated user links
const UnauthenticatedLinks = ({ t, navigate }) => (
  <>
    <li>
      <Link
        className="Link"
        color="primary"
        disabled={false}
        level="body-md"
        underline="none"
        variant="plain"
        onClick={() => navigate("/login")}
      >
        {t("Login")}
        <LoginIcon />
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
        onClick={() => navigate("/cerca-prenotazione")}
      >
        {t("Cerca prenotazione")}
        <SearchIcon />
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
        onClick={() => navigate("/registra-agenzia")}
      >
        {t("Registra Agenzia")}
      </Link>
    </li>
  </>
);

export const Header = () => {
  const { loading, token, isWebUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

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
            {token ? (
              <AuthenticatedLinks
                t={t}
                handleLogout={handleLogout}
                isWebUser={isWebUser}
                navigate={navigate}
              />
            ) : (
              <UnauthenticatedLinks t={t} navigate={navigate} />
            )}
            <li className="lang">
              <Dropdown>
                <MenuButton
                  color="primary"
                  size="sm"
                  sx={{ padding: 0, border: 0 }}
                >
                  <img
                    className="img-lang"
                    src={i18n.language === "it" ? it : us}
                    alt="language"
                  />
                  <ArrowDropDownIcon />
                </MenuButton>
                <Menu variant="plain" color="primary" size="sm">
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
            <Dropdown>
              <MenuButton color="primary" size="sm">
                <MenuIcon />
              </MenuButton>
              <Menu variant="plain" color="primary" size="sm">
                {token ? (
                  <AuthenticatedLinks
                    t={t}
                    handleLogout={handleLogout}
                    isWebUser={isWebUser}
                    navigate={navigate}
                  />
                ) : (
                  <UnauthenticatedLinks t={t} navigate={navigate} />
                )}
              </Menu>
            </Dropdown>
            <li className="lang">
              <Dropdown>
                <MenuButton
                  color="primary"
                  size="sm"
                  sx={{ padding: 0, border: 0 }}
                >
                  <img
                    className="img-lang"
                    src={i18n.language === "it" ? it : us}
                    alt="language"
                  />
                </MenuButton>
                <Menu variant="plain" color="primary" size="sm">
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
        </ul>
      </nav>
    </div>
  );
};
