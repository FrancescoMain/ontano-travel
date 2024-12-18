/***********************************
 *  Tramite un form dinamico di massimo 10 campi detti tratte creare dei div con un insieme di nomi e cognomi
 *  che rappresentano i passeggeri di un volo.
 *  Ci sarà una flag affianco ad ogni tratta oltre alla prima che sarà sempre attiva e che autocompilerà i campi
 *  con i dati della prima tratta.
 *  Se si deflagga la flag si potranno compilare i campi manualmente.
 ***********************************/
// USE CASE 1:
// creare i campi in modo dinamico
// nascondere tramite dropdown tutte le tratte tranne la prima
// dopo compilazione della prima tratta, autocompilare le altre tratte

// USE CASE 2:
// creare i campi in modo dinamico
// nascondere tramite dropdown tutte le tratte tranne la prima
// compilare manualmente i campi della prima tratta
// deflaggare la flag per compilare manualmente le altre tratte

// USE CASE 3:
// creare i campi in modo dinamico
// nascondere tramite dropdown tutte le tratte tranne la prima
// compilare manualmente i campi della prima tratta
// deflaggare la flag per compilare manualmente le altre tratte
// flaggare la flag per autocompilare le altre tratte

import React, { useState } from "react";

export const CheckoutFormModule = () => {
  return (
    <div>
      <h1>Checkout Form</h1>
    </div>
  );
};
