import React from "react";
import "./Header.css";
import {
  Dropdown,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  Option,
  Select,
} from "@mui/joy";
import i18n from "../../i18n";
import { useTranslation } from "react-i18next";
import MenuIcon from "@mui/icons-material/Menu";

export const Header = () => {
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
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
              Home
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
                href="/login"
              >
                Login
              </Link>
            </li>
            <li>
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
            </li>
            <li>
              <Select
                color="primary"
                placeholder="Italiano"
                size="md"
                variant="plain"
              >
                <Option onClick={() => handleLanguageChange("it")} value="it">
                  Italiano
                </Option>
                <Option onClick={() => handleLanguageChange("en")} value="en">
                  English
                </Option>
              </Select>
            </li>
          </div>

          <div className="header-mobile">
            <Select color="primary" placeholder="Ita" size="md" variant="plain">
              <Option onClick={() => handleLanguageChange("it")} value="it">
                Ita
              </Option>
              <Option onClick={() => handleLanguageChange("en")} value="en">
                Eng
              </Option>
            </Select>

            <Dropdown>
              <MenuButton color="primary" size="sm">
                <MenuIcon />
              </MenuButton>
              <Menu variant="plain" color="primary" size="sm">
                <MenuItem>
                  {" "}
                  <Link
                    color="primary"
                    disabled={false}
                    level="body-md"
                    underline="none"
                    variant="plain"
                    href="/"
                  >
                    Home
                  </Link>
                </MenuItem>
                <MenuItem>
                  {" "}
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
          </div>
        </ul>
      </nav>
    </div>
  );
};
