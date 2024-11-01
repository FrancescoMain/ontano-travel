import React from "react";
import {
  CheckoutPasseggero,
  CheckoutPrimoPasseggero,
} from "../components/Checkouts/CheckoutPassegero";
import { useReservations } from "../_hooks/useReservations";
import { IoMdPeople } from "react-icons/io";
import { MdLuggage } from "react-icons/md";
import { FaChild } from "react-icons/fa";
import { FaDog } from "react-icons/fa";
import dayjs from "dayjs";
import { reserve } from "../_api/reservations/reserve";
import { lightboxReserve } from "../_api/reservations/lightboxReserve";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "../features/spinner/spinnerSlice";
import { getStore } from "../_api/reservations/getStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaBaby } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

export const Checkout = () => {
  const { passeggeri, prenotazione, paymentsMethod, quote } = useReservations();
  const [store, setStore] = React.useState();
  const dispatch = useDispatch();
  const [nomi, setNomi] = React.useState([
    [{ value: "" }],
    [{ value: "" }],
    [{ value: "" }],
    [{ value: "" }],
    [{ value: "" }],
    [{ value: "" }],
    [{ value: "" }],
    [{ value: "" }],
    [{ value: "" }],
    [{ value: "" }],
  ]); // Inizializzato come array
  const [cognomi, setCognomi] = React.useState([
    [{ value: "" }],
    [{ value: "" }],
    [{ value: "" }],
    [{ value: "" }],
    [{ value: "" }],
    [{ value: "" }],
    [{ value: "" }],
    [{ value: "" }],
    [{ value: "" }],
    [{ value: "" }],
  ]);
  const accountData = JSON.parse(
    localStorage.getItem("account_data") ||
      sessionStorage.getItem("account_data") ||
      "{}"
  );
  const [dto, setDto] = React.useState({
    nome: "",
    cognome: "",
    cellulare: "",
    email: accountData.email || "",
  });
  console.log("prenotazione", prenotazione);
  console.log("passeggeri", passeggeri); // Add this line to inspect passeggeri data
  const navigate = useNavigate();
  const loadAxerveScript = () => {
    return new Promise((resolve, reject) => {
      if (document.getElementById("axerve-script")) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.id = "axerve-script";
      script.src = "https://sandbox.gestpay.net/pagam/javascript/axerve.js";
      script.onload = () => {
        resolve();
      };
      script.onerror = () => {
        reject("Errore nel caricamento dello script Axerve");
      };
      document.body.appendChild(script);
    });
  };

  React.useEffect(() => {
    // Carica lo script di Axerve al montaggio del componente
    const fetchStore = async () => {
      const storeF = await getStore();
      setStore(storeF);
    };

    fetchStore();
    // loadAxerveScript()
    //   .then(() => {})
    //   .catch((err) => {
    //     console.error(err);
    //   });
  }, []);
  const [paymentMethodCheck, setPyamentMethodCheck] =
    React.useState("CREDIT_CARD");
  const handleNomiChange = (numeroCampo, n, newValue) => {
    setNomi((prevNomi) => {
      // Copia il vecchio array `prevNomi` per creare `updatedNomi`
      const updatedNomi = [...prevNomi];

      // Itera dalla tratta corrente fino all'ultima
      for (
        let i = numeroCampo;
        i < updatedNomi.length || i < numeroCampo + 1;
        i++
      ) {
        // Inizializza `updatedNomi[i]` come array vuoto se non esiste
        if (!updatedNomi[i]) updatedNomi[i] = [];

        // Inizializza `updatedNomi[i][n]` come oggetto vuoto se non esiste
        updatedNomi[i][n] = { ...updatedNomi[i][n], value: newValue };
      }
      return updatedNomi;
    });
  };
  const handleCognomiChange = (numeroCampo, n, newValue, eta) => {
    setCognomi((prevNomi) => {
      // Copia il vecchio array `prevNomi` per creare `updatedNomi`
      const updatedNomi = [...prevNomi];

      // Itera dalla tratta corrente fino all'ultima
      for (
        let i = numeroCampo;
        i < updatedNomi.length || i < numeroCampo + 1;
        i++
      ) {
        // Inizializza `updatedNomi[i]` come array vuoto se non esiste
        if (!updatedNomi[i]) updatedNomi[i] = [];

        // Inizializza `updatedNomi[i][n]` come oggetto vuoto se non esiste
        updatedNomi[i][n] = { ...updatedNomi[i][n], value: newValue, eta: eta };
      }
      return updatedNomi;
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(startLoading());

    // Aspetta il completamento di 'reserve' e ottieni il risultato
    const resultReserve = await reserve(
      nomi,
      cognomi,
      dto,
      paymentMethodCheck,
      passeggeri.length,
      quote
    );
    console.log("reserve", resultReserve);
    if (resultReserve) {
      if (paymentMethodCheck === "CREDIT_CARD") {
        // Aspetta il completamento di 'lightboxReserve' e ottieni il risultato
        const reserveLightbox = await lightboxReserve(quote);

        if (
          reserveLightbox &&
          reserveLightbox.PaymentToken &&
          reserveLightbox.PaymentID
        ) {
          // Inizializza lo
          window.axerve.lightBox.shop = store.shoplogin; // Sostituisci con il tuo shopLogin

          // Apri la Lightbox
          window.axerve.lightBox.open(
            reserveLightbox.PaymentID,
            reserveLightbox.PaymentToken,
            function callback(response) {
              console.log(response);
              if (response.status === "OK") {
                toast.success("Pagamento completato con successo");
                navigate("/success");
              } else {
                // Gestione dell'errore
                // Mostra un messaggio di errore all'utente
                toast.error("Errore durante il pagamento");
              }
            }
          );
        } else {
          console.error("Errore: PaymentToken o PaymentID mancanti");
        }
      } else {
        // Gestisci altri metodi di pagamento se necessario
      }
    }

    dispatch(stopLoading());
  };
  console.log("eta", passeggeri);
  return (
    <div className="conatiner">
      <form
        className="row d-flex justify-content-center needs-validation "
        noValidate
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="col-lg-9 col-11">
          <div className="row justify-content-between flex-lg-row flex-column  align-items-start">
            <div className="col-lg-7 col  rounded  mb-3">
              <div className="col-lg-12 col bg-passeggeri rounded mt-3 mb-3 p-4">
                <div className="row">
                  <div className="col ">
                    <h2 className="text-primary">Dati Passeggeri</h2>
                    {passeggeri.map((tratta, trattaIndex) => (
                      <>
                        <div className="d-flex flex-column">
                          <div
                            className="text-primary fs-4"
                            data-bs-toggle="collapse"
                            href={"#collapseExample" + trattaIndex}
                            role="button"
                            aria-expanded={trattaIndex === 0 ? "true" : "false"}
                            aria-controls={"collapseExample" + trattaIndex}
                          >
                            {prenotazione?.reservationRoutes[trattaIndex]?.from}{" "}
                            - {prenotazione?.reservationRoutes[trattaIndex]?.to}
                          </div>
                          <div className="text-secondary small fst-italic">
                            {dayjs(
                              prenotazione?.reservationRoutes[trattaIndex]
                                ?.departure
                            ).format("DD/MMM/YYYY HH:mm")}
                          </div>
                        </div>
                        <div
                          className={
                            trattaIndex !== 0 ? "collapse" : "collapse show"
                          }
                          id={"collapseExample" + trattaIndex}
                        >
                          {Array.from({ length: tratta.adulti }).map(
                            (_, index) => (
                              <CheckoutPasseggero
                                onChangeNomi={handleNomiChange} // Passa la funzione per gestire il cambio nome
                                n={index + 1}
                                key={`adulto-${trattaIndex}-${index}`}
                                lenght={tratta.adulti}
                                numeroCampo={trattaIndex}
                                nomi={nomi}
                                cognomi={cognomi}
                                onChangeCognomi={handleCognomiChange}
                              />
                            )
                          )}
                          {tratta.etaBambini.map((eta, index) => (
                            <CheckoutPasseggero
                              onChangeNomi={handleNomiChange} // Passa la funzione per gestire il cambio nome
                              n={tratta.adulti + index + 1}
                              key={`bambino-${trattaIndex}-${index}`}
                              eta={eta}
                              nomi={nomi}
                              cognomi={cognomi}
                              onChangeCognomi={handleCognomiChange}
                              lenght={tratta.adulti}
                              numeroCampo={trattaIndex}
                            />
                          ))}
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              </div>
              <Condizioni value={dto} onChange={setDto} />
              <Pagamento
                methods={paymentsMethod}
                checked={paymentMethodCheck}
              />
            </div>

            <div className="col-lg-4 col bg-aliceblue mte-3 rounded mb-3 sticky-lg-top d-flex flex-column flex-basis-0 flex-grow-0 mt-3">
              <div>
                <h3 className="text-primary text-center">Il tuo viaggio</h3>
              </div>
              {prenotazione?.reservationRoutes.map((route, index) => (
                <CheckoutTratta route={route} key={index} />
              ))}
              <div class="card-footer bg-ice-white py-lg-3  rounded-bottom-left-4x rounded-bottom-right-4x border-top border-primary">
                <div
                  id="div_DonazioneRiepilogo"
                  class="d-flex justify-content-between align-items-center mb-2 d-none"
                >
                  <span>Donazione</span>
                  <span>0,00</span>
                </div>
                <div
                  id="div_AssicurazioneRiepilogo"
                  class="d-flex justify-content-between align-items-center mb-2 d-none"
                >
                  <span>Garanzia di rimborso</span>
                  <span>0,00</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <span>Diritti di prenotazione</span>
                  <span>{prenotazione?.taxPreview.priceFormatted}</span>
                </div>
                <div class="spacer my-3 sconto d-none"></div>
                <div
                  id="div_Listino"
                  class="d-flex justify-content-between align-items-center sconto d-none"
                >
                  <span class="h5">Prezzo listino</span>
                  <span
                    class="h5 text-decoration-line-through listino"
                    data-regular-price-in-cents="11150"
                  ></span>
                </div>
                <div class="d-flex justify-content-between align-items-center sconto d-none">
                  <span>Sconto</span>
                  <span id="span_ImportoSonto">- 0,00</span>
                </div>
                <div class="spacer my-3"></div>
                <div
                  id="total"
                  class="d-flex justify-content-between align-items-center"
                >
                  <span class="h4">Totale</span>
                  <span
                    class="h4 total-price"
                    data-total-price-in-cents="11150"
                  >
                    {prenotazione?.priceToPay.priceFormatted}
                  </span>
                </div>
                <div class="mt-3  ">
                  <button
                    type="submit"
                    class="btn btn-success btn btn-lg w-100 text-white bg-green border-0 ms-auto fw-bold py-3"
                  >
                    CONFERMA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export const CheckoutTratta = ({ route }) => {
  const formattedDeparture = dayjs(route.departure).format("DD/MMM/YYYY HH:mm");
  const formattedArrival = dayjs(route.arrive).format("DD/MMM/YYYY HH:mm");

  // Process tariffs
  let processedTariffs = [];

  if (route.company === "Snav") {
    // Group ADU, CHD, INF into 'Passeggeri'
    let passengerTariffs = route.tariffs.filter((t) =>
      ["ADU", "CHD", "INF"].includes(t.category_code)
    );
    let otherTariffs = route.tariffs.filter(
      (t) => !["ADU", "CHD", "INF"].includes(t.category_code)
    );

    // Count total passengers and breakdown
    let totalPassengers = 0;
    let adultCount = 0;
    let childCount = 0;
    let infantCount = 0;

    passengerTariffs.forEach((t) => {
      totalPassengers += t.qty;
      if (t.category_code === "ADU") {
        adultCount += t.qty;
      } else if (t.category_code === "CHD") {
        childCount += t.qty;
      } else if (t.category_code === "INF") {
        infantCount += t.qty;
      }
    });

    // Create the description string
    let passengerDescription = `${totalPassengers} Passeggeri (`;
    let descriptions = [];
    if (adultCount > 0)
      descriptions.push(`${adultCount} Adult${adultCount > 1 ? "i" : "o"}`);
    if (childCount > 0)
      descriptions.push(`${childCount} Bambin${childCount > 1 ? "i" : "o"}`);
    if (infantCount > 0)
      descriptions.push(`${infantCount} Infant${infantCount > 1 ? "i" : "e"}`);
    passengerDescription += descriptions.join(", ") + ")";

    // Calculate price for passengers
    let totalRoutePrice = route.priceFinal.price;
    let otherTariffsTotalPrice = otherTariffs.reduce(
      (sum, t) => sum + t.price.price,
      0
    );
    let passengerPrice = totalRoutePrice - otherTariffsTotalPrice;

    let passengerTariff = {
      category_code: "PSG",
      qty: totalPassengers,
      description: passengerDescription,
      price: {
        priceFormatted: passengerPrice.toLocaleString("it-IT", {
          style: "currency",
          currency: "EUR",
        }),
        price: passengerPrice,
      },
    };

    processedTariffs = [passengerTariff, ...otherTariffs];
  } else {
    // For other companies, keep tariffs as is
    processedTariffs = route.tariffs;
  }

  return (
    <div>
      <div class="bg-aliceblue row g-0 pb-2 pt-3">
        <div class="text-start col-6">
          <p class="h5 fw-bold mb-0">{route.from}</p>
        </div>
        <div class="text-end col-6">
          <p class="h5 fw-bold mb-0">{route.to}</p>
        </div>
        <div class="text-start col-4">
          <p class="mb-0 text-capitalize">{formattedDeparture}</p>
        </div>
        <div class="text-center col-4"></div>
        <div class="text-end col-4">
          <p class="mb-0 text-capitalize">{formattedArrival}</p>
        </div>
      </div>
      <div class="list-group list-group-flush bg-aliceblue">
        {processedTariffs.map((tariffa, index) => (
          <CheckoutTariffe
            tariffa={tariffa}
            company={route.company}
            key={index}
          />
        ))}

        <div class="bg-aliceblue d-flex justify-content-between align-items-center subtotal mb-3 ">
          <span class="h5"> Totale tratta </span>
          <span class="fw-bold">{route.priceFinal.priceFormatted}</span>
        </div>
      </div>
    </div>
  );
};

export const CheckoutTariffe = ({ tariffa, company }) => {
  if (tariffa.category_code === "PSG") {
    // Display the grouped passengers
    return (
      <div>
        <div className="row bg-aliceblue d-flex justify-content-between align-items-center border-top border-bottom">
          <div className="col-8 d-flex align-items-center gap-2">
            <span>
              {" "}
              <IoMdPeople />
            </span>
            <span>{tariffa.description}</span>
          </div>
          <span className="col-4 text-end">{tariffa.price.priceFormatted}</span>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="row bg-aliceblue d-flex justify-content-between align-items-center border-top border-bottom">
          <div className="col-8 d-flex align-items-center gap-2">
            <span>
              {tariffa.category_code === "ADU" && <IoMdPeople />}
              {tariffa.category_code === "CHD" && <FaChild />}
              {tariffa.category_code === "ANI" && <FaDog />}
              {tariffa.category_code === "LUG" && <MdLuggage />}
              {tariffa.category_code === "INF" && <FaBaby />}
            </span>
            <span>
              {tariffa.qty} {tariffa.category_code === "ADU" && "Adulti"}
              {tariffa.category_code === "CHD" && "Bambini"}
              {tariffa.category_code === "ANI" && "Animali"}
              {tariffa.category_code === "LUG" && "Bagagli"}
              {tariffa.category_code === "INF" && "Neonati"}
            </span>
          </div>
          <span className="col-4 text-end">{tariffa.price.priceFormatted}</span>
        </div>
      </div>
    );
  }
};

export const Condizioni = ({ value, onChange }) => {
  const { t } = useTranslation();
  return (
    <div className="col-lg-12  col bg-passeggeri rounded mt-3 mb-3 p-4">
      <h2 className="text-primary">{t("Condizioni e Contatti")}</h2>
      <CheckoutPrimoPasseggero value={value} onChange={onChange} />

      <div className="col">
        <div className="form-check">
          <input
            required
            className="form-check-input"
            type="checkbox"
            value=""
            id="flexCheckDefault"
          />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            {t("Ho letto e accettato i")}{" "}
            <a
              href="https://www.quickferries.com/it/condizioni-generali-di-prenotazioni/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("termini e condizioni")}
            </a>
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="flexCheckDefault2"
            required
          />
          <label className="form-check-label" htmlFor="flexCheckDefault2">
            {t("Accetto")}{" "}
            <a
              href="https://www.quickferries.com/it/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("Informatica sulla privacy")}
            </a>
          </label>
        </div>
      </div>
    </div>
  );
};

export const Pagamento = ({ methods, checked }) => {
  return (
    <div className="col-lg-12  col bg-passeggeri rounded mt-3 mb-3 p-4">
      <h2 className="text-primary">Metodo di pagamento</h2>

      {methods.map((method) => (
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault1"
            checked={checked === "CREDIT_CARD"}
          />
          <label class="form-check-label" for="flexRadioDefault1">
            {method === "CREDIT_CARD" && "Carta di Credito"}
            {method !== "CREDIT_CARD" && method}
          </label>
        </div>
      ))}
    </div>
  );
};
