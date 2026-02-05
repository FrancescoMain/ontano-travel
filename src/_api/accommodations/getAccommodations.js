import { config } from "../../config/config";

/**
 * Fetches available accommodations for a Grimaldi search result
 * @param {string} searchResultId - The search result ID from the route search
 * @param {string} language - Language code (it/en)
 * @returns {Promise<Array>} Array of accommodation options
 */
export const getAccommodations = async (searchResultId, language = "it") => {
  const response = await fetch(
    `${config.basePath}${config.getAccommodations.route}?search_result_id=${searchResultId}&language=${language}`,
    { method: config.getAccommodations.method }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch accommodations");
  }

  return response.json();
};
