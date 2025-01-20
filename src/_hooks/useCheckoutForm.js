import React from "react";
import { useSelector } from "react-redux";

export const useCheckoutForm = () => {
  const { data: accountData } = useSelector((state) => state.account);
  const [nomi, setNomi] = React.useState(
    Array.from({ length: 10 }, () => [{ value: "" }])
  );

  const [dateDiNascita, setdateDiNascita] = React.useState(
    Array.from({ length: 10 }, () => [{ value: "" }])
  );
  const [generi, setGeneri] = React.useState(
    Array.from({ length: 10 }, () => [{ value: "" }])
  );
  const [luoghiDiNascita, setLuoghiDiNascita] = React.useState(
    Array.from({ length: 10 }, () => [{ value: "" }])
  );

  const [nazionalità, setNazionalità] = React.useState(
    Array.from({ length: 10 }, () => [{ value: "" }])
  );

  const [tipiDiDocumento, setTipiDiDocumento] = React.useState(
    Array.from({ length: 10 }, () => [{ value: "" }])
  );
  const [numeriDiDocumento, setNumeriDiDocumento] = React.useState(
    Array.from({ length: 10 }, () => [{ value: "" }])
  );
  const [disabilità, setDisabilità] = React.useState(
    Array.from({ length: 10 }, () => [{ value: "" }])
  );

  const [cognomi, setCognomi] = React.useState(
    Array.from({ length: 10 }, () => [{ value: "" }])
  );
  const [dto, setDto] = React.useState({
    nome: "",
    cognome: "",
    cellulare: "",
    email: accountData?.email || "",
  });
  const [payByLinkEmail, setPayByLinkEmail] = React.useState("");
  const [fattura, setFattura] = React.useState(false);
  const [invoiceDTO, setInvoiceDTO] = React.useState({
    intestazione: "",
    pIvaCodiceFiscale: "",
    indirizzo: "",
    cap: "",
    citta: "",
    provincia: "",
    nazione: "",
    codiceUnivoco: "",
    emailPec: "",
  });

  const handleNomiChange = (numeroCampo, n, newValue) => {
    setNomi((prevNomi) => {
      const updatedNomi = [...prevNomi];
      // se il numero campo è maggiore di zero cambia solo il campo selezionato
      if (numeroCampo > 0) {
        updatedNomi[numeroCampo][n] = {
          ...updatedNomi[numeroCampo][n],
          value: newValue,
        };
        return updatedNomi;
      }
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

  const handleDataDiNascitaChange = (numeroCampo, n, newValue) => {
    setdateDiNascita((prevNomi) => {
      const updatedNomi = [...prevNomi];
      // se il numero campo è maggiore di zero cambia solo il campo selezionato
      if (numeroCampo > 0) {
        updatedNomi[numeroCampo][n] = {
          ...updatedNomi[numeroCampo][n],
          value: newValue,
        };
        return updatedNomi;
      }
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
  const handleLuoghiDiNascita = (numeroCampo, n, newValue) => {
    setLuoghiDiNascita((prevNomi) => {
      const updatedNomi = [...prevNomi];
      // se il numero campo è maggiore di zero cambia solo il campo selezionato
      if (numeroCampo > 0) {
        updatedNomi[numeroCampo][n] = {
          ...updatedNomi[numeroCampo][n],
          value: newValue,
        };
        return updatedNomi;
      }
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
  const handleGeneri = (numeroCampo, n, newValue) => {
    setGeneri((prevNomi) => {
      const updatedNomi = [...prevNomi];
      // se il numero campo è maggiore di zero cambia solo il campo selezionato
      if (numeroCampo > 0) {
        updatedNomi[numeroCampo][n] = {
          ...updatedNomi[numeroCampo][n],
          value: newValue,
        };
        return updatedNomi;
      }
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

  const handleNazionalità = (numeroCampo, n, newValue) => {
    setNazionalità((prevNomi) => {
      const updatedNomi = [...prevNomi];
      // se il numero campo è maggiore di zero cambia solo il campo selezionato
      if (numeroCampo > 0) {
        updatedNomi[numeroCampo][n] = {
          ...updatedNomi[numeroCampo][n],
          value: newValue,
        };
        return updatedNomi;
      }
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

  const handleTipiDiDocumento = (numeroCampo, n, newValue) => {
    setTipiDiDocumento((prevNomi) => {
      const updatedNomi = [...prevNomi];
      // se il numero campo è maggiore di zero cambia solo il campo selezionato
      if (numeroCampo > 0) {
        updatedNomi[numeroCampo][n] = {
          ...updatedNomi[numeroCampo][n],
          value: newValue,
        };
        return updatedNomi;
      }
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

  const handleNumeriDiDocumento = (numeroCampo, n, newValue) => {
    setNumeriDiDocumento((prevNomi) => {
      const updatedNomi = [...prevNomi];
      // se il numero campo è maggiore di zero cambia solo il campo selezionato
      if (numeroCampo > 0) {
        updatedNomi[numeroCampo][n] = {
          ...updatedNomi[numeroCampo][n],
          value: newValue,
        };
        return updatedNomi;
      }
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

  const handleDisabilità = (numeroCampo, n, newValue) => {
    setDisabilità((prevNomi) => {
      const updatedNomi = [...prevNomi];
      // se il numero campo è maggiore di zero cambia solo il campo selezionato
      if (numeroCampo > 0) {
        updatedNomi[numeroCampo][n] = {
          ...updatedNomi[numeroCampo][n],
          value: newValue,
        };
        return updatedNomi;
      }
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

  const handleFatturaChange = (checked) => {
    setFattura(checked);
  };

  const handleInvoiceDTOChange = (newInvoiceDTO) => {
    setInvoiceDTO(newInvoiceDTO);
  };

  return {
    nomi,
    cognomi,
    dto,
    payByLinkEmail,
    fattura,
    invoiceDTO,
    dateDiNascita,
    generi,
    luoghiDiNascita,
    nazionalità,
    tipiDiDocumento,
    numeriDiDocumento,
    disabilità,
    handleNomiChange,
    handleCognomiChange,
    handleDtoChange,
    handlePayByLinkEmailChange,
    handleFatturaChange,
    handleInvoiceDTOChange,
    handleDataDiNascitaChange,
    handleGeneri,
    handleLuoghiDiNascita,
    handleNazionalità,
    handleTipiDiDocumento,
    handleNumeriDiDocumento,
    handleDisabilità,
  };
};
