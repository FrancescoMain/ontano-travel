import { useTranslation } from "react-i18next";
import { config } from "../../config/config";

export const authenticateUser = async (username, password, rememberMe) => {
  const url = `${config.basePath}${config.authenticate.route}`;
  const response = await fetch(url, {
    method: config.authenticate.method,
    headers: {
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-GB,en;q=0.9,it-IT;q=0.8,it;q=0.7,en-US;q=0.6",
      Connection: "keep-alive",
      "Content-Type": "application/json",
      Origin: config.basePath,
      Referer: config.basePath + "/login",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
    },
    body: JSON.stringify({ username, password, rememberMe }),
  });

  if (response.ok) {
    const data = await response.json();
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("id_token", data.id_token);
    return { success: true };
  } else {
    return { success: false, message: "Invalid username or password." }; // Remove translation logic
  }
};
