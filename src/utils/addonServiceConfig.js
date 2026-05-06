const ADDON_THEMES = {
  insurance: { icon: "🛡️", bgColor: "#e7f0ff", unit: "pers" },
  travel_insurance: { icon: "🛡️", bgColor: "#e7f0ff", unit: "pers" },
  transfer: { icon: "🚐", bgColor: "#fde4ec", unit: "pers" },
  shuttle: { icon: "🚐", bgColor: "#fde4ec", unit: "pers" },
  scooter: { icon: "🛵", bgColor: "#e2f5e6", unit: "day" },
  scooter_rental: { icon: "🛵", bgColor: "#e2f5e6", unit: "day" },
  priority: { icon: "⭐", bgColor: "#fff4cc", unit: "pers" },
  priority_boarding: { icon: "⭐", bgColor: "#fff4cc", unit: "pers" },
  parking: { icon: "🅿️", bgColor: "#eef2ff", unit: "day" },
  luggage: { icon: "🧳", bgColor: "#f0e8ff", unit: "pers" },
  extra_luggage: { icon: "🧳", bgColor: "#f0e8ff", unit: "pers" },
  meal: { icon: "🍽️", bgColor: "#fef1e6", unit: "pers" },
  wifi: { icon: "📶", bgColor: "#e6f7fc", unit: "pers" },
};

const DEFAULT_THEME = { icon: "🎁", bgColor: "#f1f3f5", unit: "pers" };

const normalize = (name) => (name || "").toString().toLowerCase().replace(/[-\s]/g, "_");

export const getAddonTheme = (name) => {
  const key = normalize(name);
  if (!key) return DEFAULT_THEME;
  if (ADDON_THEMES[key]) return ADDON_THEMES[key];
  const partialMatch = Object.keys(ADDON_THEMES).find(
    (k) => key.includes(k) || k.includes(key)
  );
  return partialMatch ? ADDON_THEMES[partialMatch] : DEFAULT_THEME;
};

export const MAX_ADDON_QTY = 10;
