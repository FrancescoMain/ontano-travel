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
import {
  FormViaggioComponent,
  ViaggioDiAndataForm,
  ViaggoiDiRitornoForm,
} from "../FormViaggioComponent";
import {
  FormViaggioComponentResultAndata,
  FormViaggioComponentResultRitorno,
  FormViaggioComponentResultDetail,
} from "../FormViaggioComponentResult";
import { animateScroll as scroll } from "react-scroll";
import { Spinner } from "../Spinner/Spinner";
import {
  setBigliettoAndata,
  setBigliettoRitorno,
} from "../../features/viaggio/viaggioFormSlice";
import { toast } from "react-toastify";
import { upsertResult } from "../../features/viaggio/resultTratta";

export const ResultComponent = () => {
  const {
    trattaAndata,
    trattaRitorno,
    dataAndata,
    dataRitorno,
    adulti,
    bambini,
    etaBambini,
    animali,
    bagagli,
    bigliettoAndata,
    bigliettoRitorno,
  } = useSelector((state) => state.viaggioForm);

  const { tratte, date, dettagli, multitratta } = useSelector(
    (state) => state.tratte
  );

  const { results } = useSelector((state) => state.resultsTratta);
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
  const fetchData = async (id) => {
    try {
      const dataChecK = dataRitorno ? dataRitorno : "";
      const formattedDate = dayjs(date[id].dateFormatted).format("YYYY-MM-DD");
      const formattedDataReturn = dataRitorno
        ? dayjs(dataRitorno).format("YYYY-MM-DD")
        : "";
      const encodedDate = encodeURIComponent(formattedDataReturn);
      const response = await fetch(
        `https://bookingferries-5cc3853ba728.herokuapp.com/api/booking/route/search?departure_route_id=${
          tratte[id].tratta.route_id
        }&departure_data=${encodeURIComponent(formattedDate)}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      dispatch(upsertResult({ id, data: data }));
      dispatch(stopLoading());
    } catch (error) {
      console.error("Fetch error:", error);
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
    if (!tratte[0]) {
      navigate("/");
      return;
    }
    dispatch(startLoading());

    if (!multitratta) {
      fetchData(0);
      fetchData(1);
    } else {
      fetchData(0);
    }
    dispatch(stopLoading());
  }, [trattaAndata, dataAndata, navigate, trattaRitorno, dataRitorno]);

  const handleResultClick = (result, biglietto) => {
    setSelectedResult(result);
    const element = document.getElementById("result-ritorno");

    if (element) {
      // Aggiungi un timeout per ritardare l'esecuzione dello scroll
      setTimeout(() => {
        scroll.scrollTo(element.offsetTop, {
          duration: 500,
          smooth: true,
        });
      }, 500); // Ritarda di 500 millisecondi (puoi regolare questo valore)
    }
    setAndata(biglietto);
  };

  const handleResultClickRitorno = (result, biglietto) => {
    setSelectedResultRitorno(result);
    setRitorno(biglietto);
  };
  const handleSubmit = () => {
    if (
      dayjs(bigliettoRitorno?.departure).isBefore(
        dayjs(bigliettoAndata?.departure)
      )
    ) {
      toast.error(
        "Viaggio di ritorno deve essere successivo a quello di andata",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
      return;
    }
    const viaggioData = {
      adulti,
      etaBambini,
      animali,
      bagagli,
      bigliettoAndata,
      bigliettoRitorno,
      dataAndata,
      dataRitorno,
    };
    localStorage.setItem("viaggioData", JSON.stringify(viaggioData));

    navigate("/checkout");
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
    <div className="row justify-content-center">
      <div className="col col-lg-7">
        <div className="row">
          <div className="col col-lg-12">
            <ViaggioDiAndataForm resultMode={true} id={0} />
          </div>
        </div>
        {results && (
          <div className="row">
            {results[0]?.data?.timetableGoing[0] ? (
              <ResultComponentCards
                id={0}
                handleClick={handleResultClick}
                selected={selectedResult}
              />
            ) : (
              <div>Non ci sono risultati, prova a cambiare rotta o data</div>
            )}
          </div>
        )}
        {!multitratta && (
          <div id="result-ritorno" className="row">
            <div className="col col-lg-12">
              <ViaggoiDiRitornoForm id={1} resultMode={true} />
            </div>
          </div>
        )}
        {!multitratta && (
          <div className="row">
            {results[1]?.data?.timetableGoing[0] ? (
              <ResultComponentCards
                id={1}
                handleClick={handleResultClickRitorno}
                selected={selectedResultRitorno}
              />
            ) : (
              <div>Non ci sono risultati, prova a cambiare rotta o data</div>
            )}
          </div>
        )}
      </div>

      {/* <FormViaggioComponentResultAndata
        reset={setSelectedResult}
        viewReset={selectedResult}
      /> */}

      {/* {!searchResults && <Spinner active={true} />} */}
      <div className="marginDiv "></div>
      {ritorno || andata ? (
        <div className="to-checkout">
          <div className="to-checkout-cont">
            <div className="to-checkout-cont__left">
              <div>
                TOTALE BIGLIETTI:
                {" " + totalPrice?.toFixed(2) || ""}€
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

export const ResultComponentCards = ({ id, handleClick, selected }) => {
  const { results } = useSelector((state) => state.resultsTratta);
  return (
    <div className="mt-4">
      {results[id].data?.timetableGoing.map((going, index) => (
        <ResultCard
          andata={true}
          key={going.result_id}
          data={going}
          onClick={() => handleClick(index, going)}
          selected={selected === index}
          hidden={selected !== -1 && selected !== index}
        />
      ))}
    </div>
  );
};
