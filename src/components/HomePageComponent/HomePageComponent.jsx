import React from "react";

// the hoc
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import { Header } from "../Header/Header";

export const HomePageComponent = () => {
  const { t } = useTranslation();
  return (
    <>
      <Header />
      <h1>{t("Welcome to React")}</h1>
      <button onClick={() => i18n.changeLanguage("fr")}>
        {t("Change language")}
      </button>
    </>
  );
};
