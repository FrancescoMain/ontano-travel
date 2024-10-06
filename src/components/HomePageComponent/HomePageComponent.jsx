import { Card, Tab, TabList, TabPanel, Tabs } from "@mui/joy";
import React, { useState } from "react";
import "./HomePageComponent.css";
import { useTranslation } from "react-i18next";

export const HomePageComponent = () => {
  const [soloAndata, setSoloAndata] = useState(false);
  const { t } = useTranslation();

  const handleClickTab = (e) => {
    const value = e.target.textContent;
    if (value === "Solo Andata") {
      setSoloAndata(true);
    } else {
      setSoloAndata(false);
    }
  };

  return (
    <div className="home-page">
      <div>
        <Card
          sx={{ width: 520 }}
          color="neutral"
          orientation="vertical"
          size="lg"
          variant="soft"
        >
          <Tabs
            defaultValue={"andata-ritorno"}
            orientation="horizontal"
            onChange={handleClickTab}
          >
            <TabList>
              <Tab
                sx={{ width: 320 }}
                variant="soft"
                color="primary"
                value={"andata-ritorno"}
              >
                {t("Andata e ritorno")}
              </Tab>
              <Tab
                sx={{ width: 320 }}
                variant="soft"
                color="primary"
                value={"solo-andata"}
              >
                {t("Solo andata")}
              </Tab>
            </TabList>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};
