import { getAuthHeader } from "../../utils/auth";
import i18n from "../../i18n";
import { config } from "../../config/config";

export const payByLinkReserve = async (quoteId, email) => {
  try {
    let url = `${config.basePath}${config.payByLinkReserve.route}/${quoteId}/paybylink?language=${i18n.language}`;
    if (email) {
      url += `&send_to_mail=${email}`;
    }

    const response = await fetch(url, {
      method: config.payByLinkReserve.method,
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
