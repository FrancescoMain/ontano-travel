import { useEffect, useRef } from "react";
import i18n from "../i18n";
import { config } from "../config/config";

const DEBOUNCE_DELAY = 1500; // 1.5 seconds debounce for API calls

export const useFetchPriceData = ({
  data,
  adulti,
  etaBambini,
  etaAdulti,
  animali,
  bagagli,
  setLoading,
  setPriceData,
  skipFetch = false,
}) => {
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (skipFetch) {
      setLoading(false);
      setPriceData(null);
      return;
    }

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Show loading immediately
    setLoading(true);

    const fetchPriceData = async () => {
      const language = i18n.language || "it";

      // Use etaAdulti if available and matches adulti count, otherwise default to 18
      const adultAges =
        etaAdulti?.length === adulti
          ? etaAdulti
          : Array.from({ length: adulti }, () => 18);

      const passengersAgeParams = [...adultAges, ...etaBambini]
        .map((age) => `passengers_age=${age}`)
        .join("&");

      try {
        const response = await fetch(
          `${config.basePath}${config.fetchPriceSearchResult.route}?language=${language}&search_result_id=${data.result_id}&animals=${animali}&luggages=${bagagli}&${passengersAgeParams}`,
          { method: config.fetchPriceSearchResult.method }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setPriceData(result);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };

    // Debounce the API call
    debounceTimerRef.current = setTimeout(() => {
      fetchPriceData();
    }, DEBOUNCE_DELAY);

    // Cleanup on unmount or dependency change
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [data, adulti, etaBambini, etaAdulti, animali, bagagli, skipFetch]);
};
