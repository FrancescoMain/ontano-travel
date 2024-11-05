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

export const Checkout = () => {
  const { passeggeri, prenotazione, paymentsMethod, quote } = useReservations();
  const {
    nomi,
    cognomi,
    dto,
    payByLinkEmail,
    handleNomiChange,
    handleCognomiChange,
    handleDtoChange,
    handlePayByLinkEmailChange,
    isTour,
  } = useCheckoutForm();
  const [store, setStore] = React.useState();
  const dispatch = useDispatch();
  const { data: accountData } = useSelector((state) => state.account);
  const navigate = useNavigate();
  const [paymentMethodCheck, setPyamentMethodCheck] =
    React.useState("CREDIT_CARD");

  React.useEffect(() => {
    const fetchStore = async () => {
      const storeF = await getStore();
      setStore(storeF);
    };

    fetchStore();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(startLoading());

    const resultReserve = await reserve(
      nomi,
      cognomi,
      dto,
      paymentMethodCheck,
      passeggeri.length,
      quote
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
              if (response.status === "OK") {
                toast.success("Pagamento completato con successo");
                dispatch(resetSelected({ id: 0 }));
                dispatch(resetResults());
                localStorage.removeItem("viaggioData");
                navigate("/success");
              } else {
                toast.error("Errore durante il pagamento");
              }
            }
          );
        } else {
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
          toast.success("Link inviato con successo");
          dispatch(resetSelected({ id: 0 }));
          dispatch(resetResults());
          localStorage.removeItem("viaggioData");
          navigate("/pay-by-link-success");
        } catch (error) {
          console.error("Error:", error);
          toast.error("Errore durante il pagamento tramite PaybyLink");
        }
      } else if (paymentMethodCheck === "EXTERNAL_PAYMENT") {
        try {
          const response = await submitExternalPayment(quote);
          if (response.ok) {
            toast.success(
              "Pagamento tramite Estratto Conto completato con successo"
            );
            dispatch(resetSelected({ id: 0 }));
            dispatch(resetResults());
            localStorage.removeItem("viaggioData");
            navigate("/success");
          } else {
            toast.error("Errore durante il pagamento tramite Estratto Conto");
          }
        } catch (error) {
          console.error("Error:", error);
          toast.error("Errore durante il pagamento tramite Estratto Conto");
        }
      }
    }

    dispatch(stopLoading());
  };

  return (
    <div className="conatiner">
      <form
        className="row d-flex justify-content-center needs-validation"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="col-lg-9 col-11">
          <div className="row justify-content-between flex-lg-row flex-column align-items-start">
            <div className="col-lg-7 col rounded mb-3">
              <div className="col-lg-12 col bg-passeggeri rounded mt-3 mb-3 p-4">
                <div className="row">
                  <div className="col">
                    <h2 className="text-primary">Dati Passeggeri</h2>
                    {passeggeri.map((tratta, trattaIndex) => (
                      <>
                        <div className="d-flex flex-column">
                          {!isTour ? (
                            <div
                              className="text-primary fs-4"
                              data-bs-toggle="collapse"
                              href={"#collapseExample" + trattaIndex}
                              role="button"
                              aria-expanded={
                                trattaIndex === 0 ? "true" : "false"
                              }
                              aria-controls={"collapseExample" + trattaIndex}
                            >
                              Tour
                            </div>
                          ) : (
                            <>
                              <div
                                className="text-primary fs-4"
                                data-bs-toggle="collapse"
                                href={"#collapseExample" + trattaIndex}
                                role="button"
                                aria-expanded={
                                  trattaIndex === 0 ? "true" : "false"
                                }
                                aria-controls={"collapseExample" + trattaIndex}
                              >
                                {
                                  prenotazione?.reservationRoutes[trattaIndex]
                                    ?.from
                                }{" "}
                                -{" "}
                                {
                                  prenotazione?.reservationRoutes[trattaIndex]
                                    ?.to
                                }
                              </div>
                              <div className="text-secondary small fst-italic">
                                {dayjs(
                                  prenotazione?.reservationRoutes[trattaIndex]
                                    ?.departure
                                ).format("DD/MMM/YYYY HH:mm")}
                              </div>
                            </>
                          )}
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
                                onChangeNomi={handleNomiChange}
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
                              onChangeNomi={handleNomiChange}
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
              <Condizioni value={dto} onChange={handleDtoChange} />
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
                <h3 className="text-primary text-center">Il tuo viaggio</h3>
              </div>
              {prenotazione?.reservationRoutes.map((route, index) => (
                <CheckoutTratta route={route} key={index} />
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
                <div className="mt-3">
                  <button
                    type="submit"
                    className="btn btn-success btn btn-lg w-100 text-white bg-green border-0 ms-auto fw-bold py-3"
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
