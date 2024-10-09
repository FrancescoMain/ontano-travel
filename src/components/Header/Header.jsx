import React from "react";
import "./Header.css";
import { Dropdown, Link, Menu, MenuButton, MenuItem } from "@mui/joy";
import i18n from "../../i18n";
import { useTranslation } from "react-i18next";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import SearchIcon from "@mui/icons-material/Search";
import it from "../../assets/flags/it.svg";
import us from "../../assets/flags/us.svg";

export const Header = () => {
  const handleLanguageChange = () => {
    if (i18n.language === "it") {
      i18n.changeLanguage("en");
    } else {
      i18n.changeLanguage("it");
    }
  };

  const { t } = useTranslation();

  return (
    <div className="header">
      <nav>
        <ul>
          <li>
            <Link
              color="primary"
              disabled={false}
              level="body-md"
              underline="none"
              variant="plain"
              href="/"
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
                className="Link"
                color="primary"
                disabled={false}
                level="body-md"
                underline="none"
                variant="plain"
                href="/login"
              >
                Login
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
                href="/cerca-prenotazione"
              >
                {t("Cerca prenotazione")}
                <SearchIcon />
              </Link>
            </li>
            <li className="lang">
              <img
                onClick={handleLanguageChange}
                src={i18n.language === "it" ? us : it}
                alt=""
              />
            </li>
          </div>

          <div className="header-mobile">
            <Dropdown>
              <MenuButton color="primary" size="sm">
                <MenuIcon />
              </MenuButton>
              <Menu variant="plain" color="primary" size="sm">
                <MenuItem>
                  <Link
                    color="primary"
                    disabled={false}
                    level="body-md"
                    underline="none"
                    variant="plain"
                    href="/login"
                  >
                    Login
                  </Link>
                </MenuItem>

                <MenuItem>
                  <Link
                    color="primary"
                    disabled={false}
                    level="body-md"
                    underline="none"
                    variant="plain"
                    href="/cerca-prenotazione"
                  >
                    {t("Cerca prenotazione")}
                  </Link>
                </MenuItem>
              </Menu>
            </Dropdown>
            <li className="lang">
              <img
                onClick={handleLanguageChange}
                src={i18n.language === "it" ? us : it}
                alt=""
              />
            </li>
          </div>
        </ul>
      </nav>
    </div>
  );
};
