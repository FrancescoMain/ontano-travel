import React, { useEffect, useState } from "react";
import ButtonStepper from "./Stepper";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Typography from "@mui/joy/Typography";
import { ResultCard } from "../ResultCard/ResultCard"; // Assicurati di importare il componente ResultCard
import { useTranslation } from "react-i18next";
import { startLoading, stopLoading } from "../../features/spinner/spinnerSlice";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import { Modal, ModalClose, ModalDialog } from "@mui/joy";
import { FormViaggioComponent } from "../FormViaggioComponent";
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
  } = useSelector((state) => state.viaggioForm);
  const [searchResults, setSearchResults] = useState(null);
  const [selectedResult, setSelectedResult] = useState(0); // Stato per la ResultCard selezionata
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!trattaAndata) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        dispatch(startLoading());
        const formattedDate = dayjs(dataAndata).format("YYYY-MM-DD");
        const response = await fetch(
          `https://bookingferries-5cc3853ba728.herokuapp.com/api/booking/route/search?departure_route_id=${
            trattaAndata.route_id
          }&departure_data=${encodeURIComponent(formattedDate)}`
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
  }, [trattaAndata, dataAndata, navigate]);

  const handleResultClick = (result) => {
    setSelectedResult(result);
  };

  return (
    <div>
      <ButtonStepper />
      {searchResults && (
        <div className="results-container">
          {/* Renderizza i risultati della ricerca qui */}
          {searchResults?.timetableGoing[0] && (
            <div>
              <Typography
                color="primary"
                level="h2"
                noWrap={true}
                variant="plain"
                onClick={() => setOpen(true)}
              >
                {t("ANDATA")}
                <BorderColorRoundedIcon className="edit-icon" />
              </Typography>
              {searchResults.timetableGoing.map((going, index) => (
                <ResultCard
                  key={going.result_id}
                  data={going}
                  onClick={() => handleResultClick(index)}
                  selected={
                    selectedResult === index &&
                    !searchResults.timetableReturn[0]
                  }
                />
              ))}
            </div>
          )}

          {searchResults?.timetableReturn[0] && (
            <Typography
              color="primary"
              level="h2"
              noWrap={false}
              variant="plain"
            >
              {t("RITORNO")}
            </Typography>
          )}
        </div>
      )}
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <ModalClose />
          <FormViaggioComponent />
        </ModalDialog>
      </Modal>
    </div>
  );
};
