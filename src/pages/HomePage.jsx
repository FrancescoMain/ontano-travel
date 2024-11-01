import React, { useEffect } from "react";
import { HomePageComponent } from "../components/HomePageComponent/HomePageComponent";
import axios from "axios";
import i18n from "../i18n"; // Import i18n

export const HomePage = () => {
  useEffect(() => {
    const token =
      localStorage.getItem("id_token") || sessionStorage.getItem("id_token");
    if (token) {
      const storage = localStorage.getItem("id_token")
        ? localStorage
        : sessionStorage;
      axios
        .get(
          `http://ec2-13-51-37-99.eu-north-1.compute.amazonaws.com/api/booking/account?language=${i18n.language}`, // Add language as query parameter
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log("Account data:", response.data);
          storage.setItem("account_data", JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error("Error fetching account data:", error);
        });
    }
  }, []);

  return <HomePageComponent />;
};
