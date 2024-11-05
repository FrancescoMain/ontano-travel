import i18n from "../i18n";
import { getAuthHeader } from "../utils/auth"; // Import getAuthHeader

export const fetchPorts = async () => {
  try {
    const response = await fetch(
      "http://ec2-13-51-37-99.eu-north-1.compute.amazonaws.com/api/booking/tour/port"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching ports:", error);
    throw error;
  }
};

export const fetchTours = async () => {
  const language = i18n.language || "it";

  try {
    const response = await fetch(
      `http://ec2-13-51-37-99.eu-north-1.compute.amazonaws.com/api/booking/tour?language=${language}`,
      {
        headers: getAuthHeader(), // Add authorization header
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching tours:", error);
    throw error;
  }
};

export const postTourQuote = async (quoteData) => {
  const language = i18n.language || "it";

  try {
    const response = await fetch(
      `http://ec2-13-51-37-99.eu-north-1.compute.amazonaws.com/api/booking/tour/quote?language=${language}`,
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
    console.error("Error posting tour quote:", error);
    throw error;
  }
};
