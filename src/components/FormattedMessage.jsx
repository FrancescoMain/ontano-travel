import { t } from "i18next";
import React from "react";
import { useDispatch } from "react-redux";

export const FormattedMessage = (message) => {
  const dispatch = useDispatch();
  const messageFormatted = t(message);
  return messageFormatted;
};
