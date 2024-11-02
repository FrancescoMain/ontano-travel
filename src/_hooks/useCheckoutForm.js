import React from "react";
import { useSelector } from "react-redux";

export const useCheckoutForm = () => {
  const { data: accountData } = useSelector((state) => state.account);
  const [nomi, setNomi] = React.useState(Array(10).fill([{ value: "" }]));
  const [cognomi, setCognomi] = React.useState(Array(10).fill([{ value: "" }]));
  const [dto, setDto] = React.useState({
    nome: "",
    cognome: "",
    cellulare: "",
    email: accountData?.email || "",
  });
  const [payByLinkEmail, setPayByLinkEmail] = React.useState("");

  const handleNomiChange = (numeroCampo, n, newValue) => {
    setNomi((prevNomi) => {
      const updatedNomi = [...prevNomi];
      for (
        let i = numeroCampo;
        i < updatedNomi.length || i < numeroCampo + 1;
        i++
      ) {
        if (!updatedNomi[i]) updatedNomi[i] = [];
        updatedNomi[i][n] = { ...updatedNomi[i][n], value: newValue };
      }
      return updatedNomi;
    });
  };

  const handleCognomiChange = (numeroCampo, n, newValue, eta) => {
    setCognomi((prevNomi) => {
      const updatedNomi = [...prevNomi];
      for (
        let i = numeroCampo;
        i < updatedNomi.length || i < numeroCampo + 1;
        i++
      ) {
        if (!updatedNomi[i]) updatedNomi[i] = [];
        updatedNomi[i][n] = { ...updatedNomi[i][n], value: newValue, eta: eta };
      }
      return updatedNomi;
    });
  };

  const handleDtoChange = (newDto) => {
    setDto(newDto);
  };

  const handlePayByLinkEmailChange = (email) => {
    setPayByLinkEmail(email);
  };

  return {
    nomi,
    cognomi,
    dto,
    payByLinkEmail,
    handleNomiChange,
    handleCognomiChange,
    handleDtoChange,
    handlePayByLinkEmailChange,
  };
};
