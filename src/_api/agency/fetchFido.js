import { getAuthHeader, handleLogout } from "../../utils/auth";
import { config } from "../../config/config";

export const fetchFido = async () => {
  try {
    const response = await fetch(
      `${config.basePath}${config.fetchFido.route}`,
      {
        method: config.fetchFido.method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        handleLogout();
        window.location.href = "/login";
      }
      throw new Error("Network response was not ok");
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data?.price ?? data;
    } else {
      const text = await response.text();
      return text ? parseFloat(text) : null;
    }
  } catch (error) {
    console.error("Error fetching fido:", error);
    return null;
  }
};
