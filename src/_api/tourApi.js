import i18n from "../i18n";
import { getAuthHeader, handleLogout } from "../utils/auth"; // Import handleLogout
import { config } from "../config/config"; // Import config

export const fetchPorts = async () => {
  try {
    const response = await fetch(`${config.basePath}/api/booking/tour/port`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleLogout();
      window.location.href = "/login"; // Redirect to login
    }
    console.error("Error fetching ports:", error);
    throw error;
  }
};

export const fetchTours = async () => {
  const language = i18n.language || "it";

  try {
    const response = await fetch(
      `${config.basePath}/api/booking/tour?language=${language}`,
      {
        headers: getAuthHeader(), // Add authorization header
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleLogout();
      window.location.href = "/login"; // Redirect to login
    }
    console.error("Error fetching tours:", error);
    throw error;
  }
};

export const postTourQuote = async (quoteData) => {
  const language = i18n.language || "it";

  try {
    const response = await fetch(
      `${config.basePath}/api/booking/tour/quote?language=${language}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(), // Add authorization header
        },
        body: JSON.stringify(quoteData),
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleLogout();
      window.location.href = "/login"; // Redirect to login
    }
    console.error("Error posting tour quote:", error);
    throw error;
  }
};
