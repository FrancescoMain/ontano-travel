import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/it"; // Import Italian locale
import "dayjs/locale/en"; // Import English locale
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (date, language) => {
  return dayjs(date).tz("Europe/Rome").format("DD MMM YYYY");
};

export const formatTime = (date) => {
  return dayjs(date).tz("Europe/Rome").format("HH:mm");
};

export const calculateDuration = (departureDate, arrivalDate) => {
  const diffInMilliseconds = arrivalDate.diff(departureDate);
  const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  return { hours, minutes };
};

export const formatDateTime = (date, language) => {
  const formattedDate = dayjs(date).tz("Europe/Rome").format("DD MMM YYYY");
  const formattedTime = dayjs(date).tz("Europe/Rome").format("HH:mm");
  return { date: formattedDate, time: formattedTime };
};
