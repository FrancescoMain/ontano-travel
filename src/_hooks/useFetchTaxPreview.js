import { useEffect, useRef, useState } from "react";
import { config } from "../config/config";

const DEBOUNCE_DELAY = 1500;

export const useFetchTaxPreview = (totalPrice) => {
  const [taxData, setTaxData] = useState(null);
  const [taxLoading, setTaxLoading] = useState(false);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (!totalPrice || totalPrice <= 0) {
      setTaxData(null);
      setTaxLoading(false);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setTaxLoading(true);

    const fetchTaxPreview = async () => {
      const url = `${config.basePath}${config.getTaxPreview.route}?total_price=${totalPrice}`;

      try {
        const response = await fetch(url, {
          method: config.getTaxPreview.method,
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        console.log("Tax preview response:", result);
        setTaxData(result);
        setTaxLoading(false);
      } catch (error) {
        console.error("Tax preview fetch error:", error);
        setTaxData(null);
        setTaxLoading(false);
      }
    };

    debounceTimerRef.current = setTimeout(() => {
      fetchTaxPreview();
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [totalPrice]);

  return { taxData, taxLoading };
};
