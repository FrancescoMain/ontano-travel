import React, { useEffect, useState } from "react";
import ButtonStepper from "./Stepper";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import Typography from "@mui/joy/Typography";
import { ResultCard } from "../ResultCard/ResultCard"; // Assicurati di importare il componente ResultCard
import { useTranslation } from "react-i18next";
import { startLoading, stopLoading } from "../../features/spinner/spinnerSlice";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import { Button, Modal, ModalClose, ModalDialog } from "@mui/joy";
import { FormViaggioComponent } from "../FormViaggioComponent";
import {
  FormViaggioComponentResultAndata,
  FormViaggioComponentResultRitorno,
  FormViaggioComponentResultDetail,
} from "../FormViaggioComponentResult";
import { animateScroll as scroll } from "react-scroll";
import { Spinner } from "../Spinner/Spinner";

export const ResultComponent = () => {
  const {
    trattaAndata,
    trattaRitorno,
    dataAndata,
    dataRitorno,
    adulti,
    bambini,
    etaBamibi,
    animali,
    bagagli,
    bigliettoAndata,
    bigliettoRitorno,
  } = useSelector((state) => state.viaggioForm);
  const [searchResults, setSearchResults] = useState(null);
  const [selectedResult, setSelectedResult] = useState(-1); // Stato per la ResultCard selezionata
  const [selectedResultRitorno, setSelectedResultRitorno] = useState(-1); // Stato per la ResultCard selezionata
  const [andata, setAndata] = useState();
  const [ritorno, setRitorno] = useState();
  const [totalPrice, setTotalPrice] = useState(0);
  const { departure_route_id, departure_data, return_route_id, return_data } =
    useParams();

  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!trattaAndata) {
      navigate("/");
      return;
    }
    dispatch(startLoading());
    const fetchData = async () => {
      try {
        const dataChecK = dataRitorno ? dataRitorno : "";
        const formattedDate = dayjs(dataAndata).format("YYYY-MM-DD");
        const formattedDataReturn = dataRitorno
          ? dayjs(dataRitorno).format("YYYY-MM-DD")
          : "";
        const encodedDate = encodeURIComponent(formattedDataReturn);

        const response = await fetch(
          `https://bookingferries-5cc3853ba728.herokuapp.com/api/booking/route/search?departure_route_id=${
            trattaAndata.route_id
          }&departure_data=${encodeURIComponent(
            formattedDate
          )}&return_route_id=${
            trattaRitorno?.route_id || ""
          }&return_data=${formattedDataReturn}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSearchResults(data);
        dispatch(stopLoading());
      } catch (error) {
        console.error("Fetch error:", error);
        dispatch(stopLoading());
      }
    };

    fetchData();
  }, [trattaAndata, dataAndata, navigate, trattaRitorno, dataRitorno]);

  const handleResultClick = (result, biglietto) => {
    setSelectedResult(result);
    scroll.scrollTo(document.getElementById("result-ritorno").offsetTop, {
      duration: 500,
      smooth: true,
    });
    setAndata(biglietto);
  };

  const handleResultClickRitorno = (result, biglietto) => {
    setSelectedResultRitorno(result);
    setRitorno(biglietto);
  };

  useEffect(() => {
    if (bigliettoAndata?.priceData?.price) {
      setTotalPrice(bigliettoAndata?.priceData?.price);
      if (bigliettoRitorno?.priceData?.price) {
        setTotalPrice(
          bigliettoAndata?.priceData?.price + bigliettoRitorno?.priceData?.price
        );
      }
    }
  }, [bigliettoAndata, bigliettoRitorno]);

  return (
    <div>
      <ButtonStepper />
      <FormViaggioComponentResultDetail />

      <FormViaggioComponentResultAndata reset={setSelectedResult} />

      {!searchResults && <Spinner active={true} />}
      {searchResults && (
        <div className="results-container">
          {/* Renderizza i risultati della ricerca qui */}
          {searchResults?.timetableGoing[0] ? (
            <div className="result-card-container">
              {searchResults.timetableGoing.map((going, index) => (
                <ResultCard
                  andata={true}
                  key={going.result_id}
                  data={going}
                  onClick={() => handleResultClick(index, going)}
                  selected={selectedResult === index}
                  hidden={selectedResult !== -1 && selectedResult !== index}
                />
              ))}
            </div>
          ) : (
            <div>Non ci sono risultati, prova a cambiare rotta o data</div>
          )}
          <Typography
            sx={{ marginBottom: 2 }}
            color="primary"
            level="h4"
            noWrap={false}
            variant="plain"
          >
            {t("RITORNO")}
          </Typography>
          <FormViaggioComponentResultRitorno reset={setSelectedResultRitorno} />
          {searchResults?.timetableGoing[0] ? (
            <>
              <div className="result-card-container">
                {searchResults.timetableReturn.map((going, index) => (
                  <>
                    <ResultCard
                      ritorno={true}
                      key={going.result_id}
                      data={going}
                      onClick={() => handleResultClickRitorno(index, going)}
                      selected={selectedResultRitorno === index}
                      hidden={
                        selectedResultRitorno !== -1 &&
                        selectedResultRitorno !== index
                      }
                    />
                  </>
                ))}
              </div>
            </>
          ) : (
            <div>Non ci sono risultati, prova a cambiare rotta o data</div>
          )}
        </div>
      )}
      {ritorno || andata ? (
        <div className="to-checkout">
          <div className="to-checkout-cont">
            <div className="to-checkout-cont__left">
              <div>
                TOTALE VIAGGIO:
                {" " + totalPrice.toFixed(2)}€
              </div>
            </div>
            <div className="to-checkout-cont__center">
              <Button size="lg" color="warning" variant="solid">
                Avanti
              </Button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};