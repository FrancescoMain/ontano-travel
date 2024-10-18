import React, { useEffect, useState } from "react";
import ButtonStepper from "./Stepper";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import {
  setAdulti,
  setAnimali,
  setBagagli,
  setBambini,
  setDataAndata,
  setDataRitorno,
  setEtaBambini,
  setTrattaAndata,
  setTrattaRitorno,
  setBigliettoAndata,
  setBigliettoRitorno,
} from "../../features/viaggio/viaggioFormSlice";
import { toast } from "react-toastify";

export const ResultComponentExternal = () => {
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
  const location = useLocation();

  const getQueryParams = (query) => {
    return new URLSearchParams(query);
  };

  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    const queryParams = getQueryParams(location.search);
    const departure_route_id = queryParams.get("departure_route_id");
    const departure_data = queryParams.get("departure_data");
    const return_route_id = queryParams.get("return_route_id");
    const return_data = queryParams.get("return_data");
    const adulti = queryParams.get("adulti");
    const bambini = queryParams.get("bambini");
    const etaBambini = queryParams.get("etaBambini");
    const animali = queryParams.get("animali");
    const bagagli = queryParams.get("bagagli");

    console.log("return_route_id", return_route_id);
    console.log("return_data", return_data);

    if (departure_route_id && departure_data) {
      dispatch(
        setTrattaAndata({
          route_id: departure_route_id,
        })
      );
      dispatch(setDataAndata(departure_data));
    }
    if (return_route_id && return_data) {
      dispatch(
        setTrattaRitorno({
          route_id: return_route_id,
        })
      );
      dispatch(setDataRitorno(return_data));
    }
    if (adulti) {
      dispatch(setAdulti(adulti));
    }
    if (bambini) {
      dispatch(setBambini(bambini));
    }
    if (etaBambini) {
      try {
        const parsedEtaBambini = JSON.parse(etaBambini);
        dispatch(setEtaBambini(parsedEtaBambini));
      } catch (error) {
        console.error("Failed to parse etaBambini:", error);
      }
    }
    if (animali) {
      dispatch(setAnimali(animali));
    }
    if (bagagli) {
      dispatch(setBagagli(bagagli));
    }
  }, []);

  useEffect(() => {
    dispatch(startLoading());
    const fetchData = async () => {
      try {
        const dataChecK = dataRitorno ? dataRitorno : "";
        const formattedDate = dayjs(dataAndata).format("YYYY-MM-DD");
        const formattedDataReturn =
          dataRitorno && dayjs(dataRitorno).format("YYYY-MM-DD");
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
  const handleSubmit = () => {
    console.log(bigliettoAndata, bigliettoRitorno);
    // Se la partenza di biglietto di andata è minore rispetto a biglietto di ritorno
    if (
      dayjs(bigliettoRitorno?.departure).isBefore(
        dayjs(bigliettoAndata?.departure)
      )
    ) {
      toast.error("Seleziona un biglietto di ritorno valido", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
    // navigate("/checkout");
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
    if (!bigliettoAndata) {
      setTotalPrice(0);
    } else if (!bigliettoRitorno) {
      setTotalPrice(bigliettoAndata?.priceData?.price);
    }
  }, [bigliettoAndata, bigliettoRitorno]);
  useEffect(() => {
    dispatch(setBigliettoAndata(null));
    dispatch(setBigliettoRitorno(null));
    setSelectedResult(-1);
    setSelectedResultRitorno(-1);
  }, [trattaAndata, trattaRitorno, dataAndata, dataRitorno]);

  return (
    <div>
      <ButtonStepper />
      <FormViaggioComponentResultDetail />
      <FormViaggioComponentResultAndata reset={setSelectedResult} />

      {!searchResults && <Spinner active={true} />}
      {searchResults && (
        <div className="results-container">
          {/* Renderizza i risultati della ricerca qui */}
          {searchResults?.timetableGoing[0] && (
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
          )}
          {searchResults?.timetableGoing[0] && (
            <>
              <div className="result-card-container marginPage">
                <FormViaggioComponentResultRitorno
                  reset={setSelectedResultRitorno}
                />

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
          )}
        </div>
      )}
      {ritorno || andata ? (
        <div className="to-checkout">
          <div className="to-checkout-cont">
            <div className="to-checkout-cont__left">
              <div>
                TOTALE BIGLIETTI:
                {" " + totalPrice.toFixed(2)}€
              </div>
            </div>
            <div className="to-checkout-cont__center">
              <Button
                onClick={() => handleSubmit()}
                size="lg"
                color="warning"
                variant="solid"
              >
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
