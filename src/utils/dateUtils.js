import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/it"; // Import Italian locale
import "dayjs/locale/en"; // Import English locale

dayjs.extend(customParseFormat);

export const formatDate = (date, language) => {
  if (language === "it") {
    return date.locale("it").format("DD MMM YYYY");
  }
  return date.locale("en").format("DD MMM YYYY");
};

export const formatTime = (date) => date.format("HH:mm");

export const calculateDuration = (departureDate, arrivalDate) => {
  const diffInMilliseconds = arrivalDate.diff(departureDate);
  const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  return { hours, minutes };
};

export const formatDateTime = (date, language) => {
  return {
    date: formatDate(date, language),
    time: formatTime(date),
  };
};
