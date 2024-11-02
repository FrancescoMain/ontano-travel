import { getAuthHeader } from "../../utils/auth";
import i18n from "../../i18n";
export const payByLinkReserve = async (quoteId, email) => {
  try {
    let url = `http://ec2-13-51-37-99.eu-north-1.compute.amazonaws.com/api/booking/payment/${quoteId}/paybylink?language=${i18n.language}`;
    if (email) {
      url += `&send_to_mail=${email}`;
    }

    const response = await fetch(url, {
      method: "GET",
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
