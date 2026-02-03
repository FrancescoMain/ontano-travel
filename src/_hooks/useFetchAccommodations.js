import { useEffect, useRef } from "react";
import i18n from "../i18n";
import { getAccommodations } from "../_api/accommodations/getAccommodations";

const DEBOUNCE_DELAY = 300;

/**
 * Hook to fetch accommodations for Grimaldi routes
 * @param {Object} params
 * @param {string} params.searchResultId - The search result ID
 * @param {boolean} params.isGrimaldi - Whether this is a Grimaldi route
 * @param {Function} params.setLoading - Loading state setter
 * @param {Function} params.setAccommodations - Accommodations state setter
 */
export const useFetchAccommodations = ({
  searchResultId,
  isGrimaldi,
  setLoading,
  setAccommodations,
}) => {
  const debounceTimerRef = useRef(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    // Only fetch for Grimaldi routes
    if (!isGrimaldi || !searchResultId) {
      setAccommodations([]);
      setLoading(false);
      return;
    }

    // Prevent duplicate fetches for the same searchResultId
    if (fetchedRef.current) {
      return;
    }

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setLoading(true);

    const fetchAccommodations = async () => {
      const language = i18n.language || "it";

      try {
        const result = await getAccommodations(searchResultId, language);
        setAccommodations(result || []);
        fetchedRef.current = true;
      } catch (error) {
        console.error("Error fetching accommodations:", error);
        setAccommodations([]);
      } finally {
        setLoading(false);
      }
    };

    debounceTimerRef.current = setTimeout(() => {
      fetchAccommodations();
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchResultId, isGrimaldi, setLoading, setAccommodations]);

  // Reset fetchedRef when searchResultId changes
  useEffect(() => {
    fetchedRef.current = false;
  }, [searchResultId]);
};
