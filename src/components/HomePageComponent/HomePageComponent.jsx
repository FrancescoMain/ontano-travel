import {
  Card,
  Option,
  Select,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
} from "@mui/joy";
import React, { useState } from "react";
import "./HomePageComponent.css";
import { useTranslation } from "react-i18next";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

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
          sx={{ width: 600 }}
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
          <Typography color="primary" level="h4" noWrap={false} variant="plain">
            {t("Viaggio di andata")}
            <div className="row-cont">
              <Select
                sx={{ height: 55 }}
                color="primary"
                placeholder={t("Destinazione")}
                variant="soft"
              >
                <Option>...</Option>
              </Select>
              <Select
                sx={{ height: 55 }}
                color="primary"
                placeholder={t("Tratta di andata")}
                variant="soft"
              >
                <Option>...</Option>
              </Select>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker sx={{ height: 70 }} className="date-picker" />
              </LocalizationProvider>
            </div>
          </Typography>
          <Typography color="primary" level="h4" noWrap={false} variant="plain">
            {t("Viaggio di ritorno")}
            <div className="row-cont">
              <Select
                sx={{ height: 55 }}
                color="primary"
                placeholder={t("Porto di ritorno")}
                variant="soft"
              >
                <Option>...</Option>
              </Select>
              <Select
                sx={{ height: 55 }}
                color="primary"
                placeholder={t("Tratta di ritorno")}
                variant="soft"
              >
                <Option>...</Option>
              </Select>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker sx={{ height: 70 }} className="date-picker" />
              </LocalizationProvider>
            </div>
          </Typography>
          <Typography color="primary" level="h4" noWrap={false} variant="plain">
            {t("Dettagli viaggio")}
          </Typography>
        </Card>
      </div>
    </div>
  );
};
