import React from "react";
import { useReservations } from "../_hooks/useReservations";
import { IoMdPeople } from "react-icons/io";
import { MdLuggage } from "react-icons/md";
import { FaChild, FaDog, FaBaby } from "react-icons/fa";
import dayjs from "dayjs";
import { reserve } from "../_api/reservations/reserve";
import { lightboxReserve } from "../_api/reservations/lightboxReserve";
import { payByLinkReserve } from "../_api/reservations/payByLinkReserve";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "../features/spinner/spinnerSlice";
import { getStore } from "../_api/reservations/getStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckoutTratta } from "../components/CheckoutTratta";
import { CheckoutTariffe } from "../components/CheckoutTariffe";
import { Condizioni } from "../components/Condizioni";
import { Pagamento } from "../components/Pagamento";
import { CheckoutPasseggero } from "../components/Checkouts/CheckoutPassegero";
import { setPayByLink } from "../features/payByLink/payByLinkSlice";
import { useCheckoutForm } from "../_hooks/useCheckoutForm"; // Import custom hook
import { submitExternalPayment } from "../_api/reservations/submitExternalPayment"; // Import the new API function
import { resetSelected, resetResults } from "../features/viaggio/resultTratta"; // Import reset actions
import { resetAll as resetViaggio } from "../features/viaggio/findTratta"; // Import resetAll action for viaggio
import { resetTourDetails } from "../features/tour/tourSlice"; // Import resetTourDetails action for tour
import { formatDateTime } from "../utils/dateUtils"; // Import formatDateTime function
import Cookies from "js-cookie"; // Import js-cookie
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import { Spinner } from "../components/Spinner/Spinner"; // Import Spinner component

const TransparentAccordion = styled(Accordion)({
  backgroundColor: "transparent",
  boxShadow: "none",
  border: "none",
});

export const Checkout = () => {
  const { passeggeri, prenotazione, paymentsMethod, quote, isTour } =
    useReservations();
  const {
    nomi,
    cognomi,
    dateDiNascita,
    luoghiDiNascita,
    nazionalità,
    tipiDiDocumento,
    numeriDiDocumento,
    disabilità,
    generi,
    dto,
    payByLinkEmail,
    fattura,
    invoiceDTO,
    handleNomiChange,
    handleCognomiChange,
    handleDtoChange,
    handlePayByLinkEmailChange,
    handleFatturaChange,
    handleInvoiceDTOChange,
    handleDataDiNascitaChange,
    handleLuoghiDiNascita,
    handleGeneri,
    handleTipiDiDocumento,
    handleNumeriDiDocumento,
    handleDisabilità,
    handleNazionalità,
  } = useCheckoutForm();
  const [store, setStore] = React.useState();
  const dispatch = useDispatch();
  const { data: accountData } = useSelector((state) => state.account);
  const navigate = useNavigate();
  const [paymentMethodCheck, setPyamentMethodCheck] =
    React.useState("CREDIT_CARD");
  const [loading, setLoading] = React.useState(false); // Add loading state

  const { i18n } = useTranslation();
  const language = i18n.language;

  React.useEffect(() => {
    const fetchStore = async () => {
      const storeF = await getStore();
      setStore(storeF);
    };

    fetchStore();
  }, []);
  function gtagPurchase() {
    const items = prenotazione?.reservationRoutes.map((route) => ({
      item_name: `${route.from} - ${route.to}`,
      item_id: `${route.from}_${route.to}`,
      price: route.priceFinal.price,
      quantity: route.tariffs.reduce((acc, tariff) => acc + tariff.qty, 0),
    }));

    window.gtag("event", "purchase", {
      transaction_id: prenotazione?.code,

      currency: "EUR",
      value: prenotazione?.priceToPay.price,
      items: items,
    });
  }

  React.useEffect(() => {
    const items = prenotazione?.reservationRoutes.map((route) => ({
      item_name: `${route.from} - ${route.to}`,
      item_id: `${route.from}_${route.to}`,
      price: route.priceFinal.price,
      quantity: route.tariffs.reduce((acc, tariff) => acc + tariff.qty, 0),
    }));

    const label = prenotazione?.reservationRoutes.map(
      (route) => `${route.from} - ${route.to}`
    );
    window.gtag("event", "begin_checkout", {
      currency: "EUR",
      value: prenotazione?.priceToPay.price,
      items: items,
    });
  }, [prenotazione]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start spinner
    dispatch(startLoading());
    const extraFields = prenotazione?.requestExtraFields;
    const resultReserve = await reserve(
      nomi,
      cognomi,
      dto,
      paymentMethodCheck,
      prenotazione.reservationRoutes.length,
      quote,
      fattura ? invoiceDTO : null, // Pass invoiceDTO if fattura is checked
      extraFields ? generi : null,
      extraFields ? numeriDiDocumento : null,
      extraFields ? tipiDiDocumento : null,
      extraFields ? nazionalità : null,
      extraFields ? luoghiDiNascita : null,
      extraFields ? dateDiNascita : null,
      extraFields ? disabilità : null
    );
    if (resultReserve) {
      if (paymentMethodCheck === "CREDIT_CARD") {
        const reserveLightbox = await lightboxReserve(quote);
        if (
          reserveLightbox &&
          reserveLightbox.PaymentToken &&
          reserveLightbox.PaymentID
        ) {
          window.axerve.lightBox.shop = store.shoplogin;
          window.axerve.lightBox.open(
            reserveLightbox.PaymentID,
            reserveLightbox.PaymentToken,
            function callback(response) {
              setLoading(false); // Stop spinner
              if (response.status === "OK") {
                Cookies.remove("codice"); // Remove the codice cookie if payment is successful
                dispatch(resetSelected({ id: 0 }));
                dispatch(resetResults());
                dispatch(resetViaggio());
                dispatch(resetTourDetails());
                localStorage.removeItem("linkQuote");
                gtagPurchase();
                navigate("/success");
              } else {
                toast.error("Errore durante il pagamento");
              }
            }
          );
        } else {
          setLoading(false); // Stop spinner
          console.error("Errore: PaymentToken o PaymentID mancanti");
        }
      } else if (paymentMethodCheck === "PAY_BY_LINK") {
        try {
          const payByLinkResponse = await payByLinkReserve(
            quote,
            payByLinkEmail
          );
          dispatch(
            setPayByLink({
              link: payByLinkResponse.link,
              expiration: payByLinkResponse.expiration,
              reservationId: prenotazione.code,
            })
          );
          Cookies.remove("codice"); // Remove the codice cookie if payment is successful
          dispatch(resetSelected({ id: 0 }));
          dispatch(resetResults());
          dispatch(resetViaggio());
          dispatch(resetTourDetails());
          localStorage.removeItem("linkQuote");
          gtagPurchase();
          navigate("/pay-by-link-success");
        } catch (error) {
          setLoading(false); // Stop spinner
          console.error("Error:", error);
          toast.error("Errore durante il pagamento tramite PaybyLink");
        }
      } else if (paymentMethodCheck === "EXTERNAL_PAYMENT") {
        try {
          const response = await submitExternalPayment(quote);
          setLoading(false); // Stop spinner
          if (response.ok) {
            Cookies.remove("codice"); // Remove the codice cookie if payment is successful
            dispatch(resetSelected({ id: 0 }));
            dispatch(resetResults());
            dispatch(resetViaggio());
            dispatch(resetTourDetails());
            localStorage.removeItem("linkQuote");
            gtagPurchase();
            navigate("/success");
          } else {
            toast.error("Errore durante il pagamento tramite Estratto Conto");
          }
        } catch (error) {
          setLoading(false); // Stop spinner
          console.error("Error:", error);
        }
      }
    } else {
      setLoading(false); // Stop spinner
    }

    dispatch(stopLoading());
  };

  return (
    <div className="container">
      {loading && <Spinner active={loading} />} {/* Render Spinner */}
      <form
        className="row d-flex justify-content-center needs-validation"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="col-lg-9 col-11">
          <div className="row justify-content-between flex-lg-row flex-column align-items-start">
            <div className="col-lg-7 col rounded mb-3">
              <div className="col-lg-12 col bg-passeggeri rounded mt-3 mb-3">
                <div className="row">
                  <div className="col">
                    <h2 className="text-primary ms-3 mt-2">Dati Passeggeri</h2>
                    {passeggeri.map((tratta, trattaIndex) => (
                      <TransparentAccordion
                        key={trattaIndex}
                        defaultExpanded={trattaIndex === 0}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={"panel" + trattaIndex + "a-content"}
                          id={"panel" + trattaIndex + "a-header"}
                        >
                          <div className="d-flex flex-column">
                            {isTour ? (
                              ""
                            ) : (
                              <>
                                <span className="text-primary fs-4">
                                  {
                                    prenotazione?.reservationRoutes[trattaIndex]
                                      ?.from
                                  }{" "}
                                  -{" "}
                                  {
                                    prenotazione?.reservationRoutes[trattaIndex]
                                      ?.to
                                  }
                                </span>
                                <div className="text-secondary small fst-italic">
                                  {
                                    formatDateTime(
                                      dayjs(
                                        prenotazione?.reservationRoutes[
                                          trattaIndex
                                        ]?.departure
                                      ),
                                      language
                                    ).date
                                  }{" "}
                                  {
                                    formatDateTime(
                                      dayjs(
                                        prenotazione?.reservationRoutes[
                                          trattaIndex
                                        ]?.departure
                                      ),
                                      language
                                    ).time
                                  }
                                </div>
                              </>
                            )}
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          {Array.from({ length: tratta.adulti }).map(
                            (_, index) => (
                              <CheckoutPasseggero
                                extraFields={prenotazione?.requestExtraFields}
                                onChangeNomi={handleNomiChange}
                                n={index + 1}
                                key={`adulto-${trattaIndex}-${index}`}
                                lenght={tratta.adulti}
                                numeroCampo={trattaIndex}
                                nomi={nomi}
                                cognomi={cognomi}
                                dateDiNascita={dateDiNascita}
                                luoghiDiNascita={luoghiDiNascita}
                                nazionalità={nazionalità}
                                tipiDiDocumento={tipiDiDocumento}
                                numeriDiDocumento={numeriDiDocumento}
                                disabilità={disabilità}
                                generi={generi}
                                onChangeNazionalità={handleNazionalità}
                                onChangeLuoghiDiNascita={handleLuoghiDiNascita}
                                onChangeGeneri={handleGeneri}
                                onChangeTipiDiDocumento={handleTipiDiDocumento}
                                onChangeNumeriDiDocumento={
                                  handleNumeriDiDocumento
                                }
                                onChangeDisabilità={handleDisabilità}
                                onChangeDateDiNascita={
                                  handleDataDiNascitaChange
                                }
                                onChangeCognomi={handleCognomiChange}
                              />
                            )
                          )}
                          {tratta.etaBambini.map((eta, index) => (
                            <CheckoutPasseggero
                              extraFields={prenotazione?.requestExtraFields}
                              onChangeNomi={handleNomiChange}
                              n={tratta.adulti + index + 1}
                              key={`bambino-${trattaIndex}-${index}`}
                              eta={eta}
                              nomi={nomi}
                              cognomi={cognomi}
                              luoghiDiNascita={luoghiDiNascita}
                              nazionalità={nazionalità}
                              tipiDiDocumento={tipiDiDocumento}
                              numeriDiDocumento={numeriDiDocumento}
                              disabilità={disabilità}
                              generi={generi}
                              onChangeCognomi={handleCognomiChange}
                              lenght={tratta.adulti}
                              numeroCampo={trattaIndex}
                              dateDiNascita={dateDiNascita}
                              onChangeDateDiNascita={handleDataDiNascitaChange}
                              onChangeLuoghiDiNascita={handleLuoghiDiNascita}
                              onChangeNazionalità={handleNazionalità}
                              onChangeGeneri={handleGeneri}
                              onChangeTipiDiDocumento={handleTipiDiDocumento}
                              onChangeNumeriDiDocumento={
                                handleNumeriDiDocumento
                              }
                              onChangeDisabilità={handleDisabilità}
                            />
                          ))}
                        </AccordionDetails>
                      </TransparentAccordion>
                    ))}
                  </div>
                </div>
              </div>
              <Condizioni
                value={dto}
                onChange={handleDtoChange}
                fattura={fattura}
                onFatturaChange={handleFatturaChange}
                invoiceDTO={invoiceDTO}
                onInvoiceDTOChange={handleInvoiceDTOChange}
              />
              <Pagamento
                methods={paymentsMethod}
                checked={paymentMethodCheck}
                onChange={setPyamentMethodCheck}
                email={payByLinkEmail}
                setEmail={handlePayByLinkEmailChange}
              />
            </div>
            <div className="col-lg-4 col bg-aliceblue mte-3 rounded mb-3 sticky-lg-top d-flex flex-column flex-basis-0 flex-grow-0 mt-3">
              <div>
                {!isTour ? (
                  <h3 className="text-primary text-center">Il tuo viaggio</h3>
                ) : (
                  <h3 className="text-primary text-center">
                    {prenotazione?.tour}
                  </h3>
                )}
              </div>
              {prenotazione?.reservationRoutes.map((route, index) => (
                <div key={index}>
                  <CheckoutTratta route={route} />
                  {route.descriptionTour && (
                    <div className="col bg-aliceblue rounded mb-3 d-flex flex-column mt-3 p-3">
                      <h4 className="text-primary text-center">
                        Dettaglio Tour
                      </h4>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: route.descriptionTour,
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}

              <div className="card-footer bg-ice-white py-lg-3 rounded-bottom-left-4x rounded-bottom-right-4x border-top border-primary">
                <div
                  id="div_DonazioneRiepilogo"
                  className="d-flex justify-content-between align-items-center mb-2 d-none"
                >
                  <span>Donazione</span>
                  <span>0,00</span>
                </div>
                <div
                  id="div_AssicurazioneRiepilogo"
                  className="d-flex justify-content-between align-items-center mb-2 d-none"
                >
                  <span>Garanzia di rimborso</span>
                  <span>0,00</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span>Diritti di prenotazione</span>
                  <span>{prenotazione?.taxPreview.priceFormatted}</span>
                </div>
                <div className="spacer my-3 sconto d-none"></div>
                <div
                  id="div_Listino"
                  className="d-flex justify-content-between align-items-center sconto d-none"
                >
                  <span className="h5">Prezzo listino</span>
                  <span
                    className="h5 text-decoration-line-through listino"
                    data-regular-price-in-cents="11150"
                  ></span>
                </div>
                <div className="d-flex justify-content-between align-items-center sconto d-none">
                  <span>Sconto</span>
                  <span id="span_ImportoSonto">- 0,00</span>
                </div>
                <div className="spacer my-3"></div>
                <div
                  id="total"
                  className="d-flex justify-content-between align-items-center"
                >
                  <span className="h4">Totale</span>
                  <span
                    className="h4 total-price"
                    data-total-price-in-cents="11150"
                  >
                    {prenotazione?.priceToPay.priceFormatted}
                  </span>
                </div>
                <div className="mt-3 mb-3">
                  <button
                    type="submit"
                    className="btn btn-success btn btn-lg w-100 text-white bg-green border-0 ms-auto fw-bold py-3 fs-5"
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
