import { useEffect } from "react";
import i18n from "../i18n";

export const useFetchPriceData = ({
  data,
  adulti,
  etaBambini,
  animali,
  bagagli,
  setLoading,
  setPriceData,
}) => {
  useEffect(() => {
    const fetchPriceData = async () => {
      setLoading(true);

      const language = i18n.language || "it";
      const passengersAgeParams = [
        ...Array.from({ length: adulti }, () => 18),
        ...etaBambini,
      ]
        .map((age) => `passengers_age=${age}`)
        .join("&");

      try {
        const response = await fetch(
          `http://ec2-13-51-37-99.eu-north-1.compute.amazonaws.com/api/booking/price/searchresult?language=${language}&search_result_id=${data.result_id}&animals=${animali}&luggages=${bagagli}&${passengersAgeParams}`
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

    fetchPriceData();
  }, [data, adulti, etaBambini, animali, bagagli]);
};
