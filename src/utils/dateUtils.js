export const formatDate = (date, language) => {
  if (language === "it") {
    return date.format("DD MMM YYYY", { locale: "it" });
  }
  return date.format("DD MMM YYYY");
};

export const formatTime = (date) => date.format("HH:mm");

export const calculateDuration = (departureDate, arrivalDate) => {
  const diffInMilliseconds = arrivalDate.diff(departureDate);
  const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  return { hours, minutes };
};
