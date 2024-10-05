import React from "react";

// the hoc
import { withTranslation } from "react-i18next";
import i18n from "../i18n";

function MyComponent({ t }) {
  return (
    <>
      <h1>{t("Welcome to React")}</h1>
      <button onClick={() => i18n.changeLanguage("fr")}>
        {t("Change language")}
      </button>
    </>
  );
}

export default withTranslation()(MyComponent);
