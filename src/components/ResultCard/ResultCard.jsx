import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import "./ResultCard.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/it"; // Import Italian locale
import "dayjs/locale/en"; // Import English locale
import { useDispatch, useSelector } from "react-redux";
import { SpinnerOnly } from "../Spinner/SpinnerOnly";
import travelmar from "../../assets/travelmar.png";
import snav from "../../assets/snav.png";
import alilauro from "../../assets/Logo-AliLauro.png";
import alilauroGruson from "../../assets/Alilauro Gruson.png";
import Nlg from "../../assets/nlg.png";
import { upsertSelected } from "../../features/viaggio/resultTratta";
import { upsertDettagli } from "../../features/viaggio/findTratta";
import { animateScroll as scroll } from "react-scroll";
import { useFetchPriceData } from "../../_hooks/useFetchPriceData";
import {
  formatDate,
  formatTime,
  calculateDuration,
} from "../../utils/dateUtils";
import alicost from "../../assets/alicost.png";
import seremar from "../../assets/seremar.png";
import coastLines from "../../assets/coast-lines.png";
import grimaldi from "../../assets/Logo-Grimaldi-Lines.jpg";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
const gtag = window.gtag || function () {}; // Add this line

export const ResultCard = ({ data, selected, hidden, id, index }) => {
  const [loading, setLoading] = useState(false);
  const [priceData, setPriceData] = useState(null);
  const [localAdultAges, setLocalAdultAges] = useState([]);
  const [agesConfirmed, setAgesConfirmed] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const language = i18n.language;
  dayjs.locale(language); // Set dayjs locale based on i18n language

  const departureDate = dayjs(data.departure).tz("Europe/Rome"); // Modify this line
  console.log(departureDate);
  const dateDep = formatDate(departureDate, language);
  const timeDep = formatTime(departureDate);
  const arrivalDate = dayjs(data.arrive).tz("Europe/Rome"); // Modify this line
  const dateArr = formatDate(arrivalDate, language);
  const timeArr = formatTime(arrivalDate);
  const { hours, minutes } = calculateDuration(departureDate, arrivalDate);

  const { adulti, bambini, etaBambini, etaAdulti, animali, bagagli } =
    useSelector((state) => state.tratte.dettagli[id]);

  const selectedExt = useSelector((state) => state.resultsTratta.selected);

  // Detect if this is a Grimaldi route
  const isGrimaldi = data.company === "Grimaldi";

  // Initialize local adult ages when adulti changes
  const adultiNum = parseInt(adulti, 10) || 1;

  useEffect(() => {
    if (isGrimaldi && localAdultAges.length !== adultiNum) {
      setLocalAdultAges(Array.from({ length: adultiNum }, () => ""));
      setAgesConfirmed(false);
    }
  }, [adultiNum, isGrimaldi]);

  // Check if all ages are valid (positive numbers)
  const allAgesValid =
    localAdultAges.length === adultiNum &&
    localAdultAges.every((age) => age !== "" && parseInt(age, 10) > 0);

  // For Grimaldi, skip fetch until ages are confirmed
  const skipFetch = isGrimaldi && !agesConfirmed;

  const handleAgeChange = (idx, value) => {
    const newAges = [...localAdultAges];
    newAges[idx] = value;
    setLocalAdultAges(newAges);
  };

  const handleConfirmAges = (e) => {
    e.stopPropagation();
    if (allAgesValid) {
      const numericAges = localAdultAges.map((age) => parseInt(age, 10));
      dispatch(upsertDettagli({ id, etaAdulti: numericAges }));
      setAgesConfirmed(true);
    }
  };

  const onClick = () => {
    // For Grimaldi, don't allow selection until price is calculated
    if (isGrimaldi && !agesConfirmed) {
      return;
    }

    const dataToDispatch = {
      id: id,
      prezzo: priceData.price,
      idSelected: index,
      data: data,
      animali: animali,
      bagagli: bagagli,
      adulti: adulti,
      bambini: bambini,
      etaBambini: etaBambini,
      etaAdulti: computedEtaAdulti,
    };
    dispatch(upsertSelected(dataToDispatch));
    const element = document.getElementById("result-ritorno");

    gtag("event", "add_to_cart", {
      currency: "EUR",
      value: priceData.price,
      items: [
        {
          item_name: `${data.fromPort} - ${data.fromTo}`,
          item_id: `${data.fromPort}_${data.fromTo}`,
          price: priceData.price,
          quantity: 1,
        },
      ],
    });

    if (element) {
      setTimeout(() => {
        scroll.scrollTo(element.offsetTop, {
          duration: 500,
          smooth: true,
        });
      }, 500);
    }
  };

  // Memoize the computed adult ages to prevent infinite loops
  const computedEtaAdulti = useMemo(() => {
    if (agesConfirmed && localAdultAges.length > 0) {
      return localAdultAges.map((a) => parseInt(a, 10));
    }
    return etaAdulti || [];
  }, [agesConfirmed, localAdultAges, etaAdulti]);

  useFetchPriceData({
    data,
    adulti,
    etaBambini,
    etaAdulti: computedEtaAdulti,
    animali,
    bagagli,
    setLoading,
    setPriceData,
    skipFetch,
  });

  useEffect(() => {
    if (selectedExt[id]?.idSelected === index) {
      const existingData = selectedExt[id] || {};
      dispatch(
        upsertSelected({
          ...existingData,
          id,
          prezzo: priceData?.price,
          idSelected: index,
          data,
          etaAdulti: computedEtaAdulti,
        })
      );
    }
  }, [priceData]);

  return (
    <div
      className={` card-container ${selected ? "selected" : ""} ${
        !hidden ? "my-4 padding " : "hidden"
      } box-result bg-ice-white rounded-2x mt-md-0 collapsable`}
      onClick={onClick}
    >
      <div className="row align-items-center grid-result">
        <div className="col-lg-8">
          <div className="align-items-start gx-1 gx-lg-3 px-md-3 pt-2 pb-1 row row-cols-3">
            <div className="col text-start">
              <div className="giorno text-uppercase fw-light lh-sm small">
                {dateDep}
              </div>
              <div className="ora fs-2 fs-lg-1  lh-sm">{timeDep}</div>
              <div class="porto h5  lh-sm">{data.fromPort}</div>
            </div>
            <div className="col text-center px-0">
              <div className="linea-logo">
                {data.company === "Travelmar" && (
                  <img className="img-logo" src={travelmar} alt="Travelmar" />
                )}
                {data.company === "Snav" && (
                  <img className="img-logo" src={snav} alt="Snav" />
                )}
                {data.company === "Snav Gescab" && (
                  <img className="img-logo" src={snav} alt="Snav Gescab" />
                )}
                {data.company === "Alilauro" && (
                  <img className="img-logo" src={alilauro} alt="Alilauro" />
                )}
                {data.company === "Alicost" && (
                  <img className="img-logo" src={alicost} alt="Alicost" />
                )}
                {data.company === "Nlg" && (
                  <img className="img-logo" src={Nlg} alt="Nlg" />
                )}
                {data.company === "Seremar" && (
                  <img className="img-logo" src={seremar} alt="Seremar" />
                )}
                {data.company === "Coast Lines" && (
                  <img
                    className="img-logo coast-lines"
                    src={coastLines}
                    alt="Coast Lines"
                  />
                )}
                {data.company === "Alilauro Gruson" && (
                  <img
                    className="img-logo"
                    src={alilauroGruson}
                    alt="Alilauro Gruson"
                  />
                )}
                {data.company === "Grimaldi" && (
                  <img
                    className="img-logo"
                    src={grimaldi}
                    alt="Grimaldi"
                  />
                )}
              </div>
              <div className="divider-points">............</div>
              <div className="durata">
                {hours}h {minutes}m
              </div>
            </div>

            <div className="col text-end">
              <div className="giorno text-uppercase fw-light lh-sm small">
                {dateArr}
              </div>
              <div className="ora fs-2 fs-lg-1  lh-sm"> {timeArr}</div>
              <div className="porto h5  lh-sm"> {data.fromTo}</div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 no-pet-mode ">
          {isGrimaldi && !agesConfirmed ? (
            <div className="grimaldi-age-input p-3">
              <div className="grimaldi-age-message mb-2 text-center">
                <small className="text-muted">
                  {t("Per calcolare il prezzo, inserisci l'età degli adulti")}
                </small>
              </div>
              <div className="grimaldi-age-fields d-flex flex-wrap justify-content-center gap-2 mb-2">
                {localAdultAges.map((age, idx) => (
                  <div key={idx} className="grimaldi-age-field">
                    <label className="form-label small mb-1">
                      {t("Età adulto")} {idx + 1}
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm grimaldi-age-input-field"
                      min="1"
                      max="120"
                      value={age}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleAgeChange(idx, e.target.value)}
                      placeholder="18"
                    />
                  </div>
                ))}
              </div>
              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={!allAgesValid}
                  onClick={handleConfirmAges}
                >
                  {t("Calcola prezzo")}
                </button>
              </div>
            </div>
          ) : (
            <div className="prezzo text-center d-flex flex-column align-items-center row  p-2 gx-1 gx-lg-3  justify-content-center fs-1 fw-bold  ">
              <div className="col fs-2">
                {loading ? (
                  <SpinnerOnly active={loading} />
                ) : priceData?.priceFormatted ? (
                  priceData?.priceFormatted
                ) : (
                  "-"
                )}
              </div>
              <div className="fs-6 fw-light lh-sm">
                {parseInt(adulti, 10) + etaBambini.length + " Passeggeri"}
              </div>
              {animali > 0 && (
                <div className="fs-6 fw-light lh-sm">
                  {animali + " Animali"}
                </div>
              )}
              {bagagli > 0 && (
                <div className="fs-6 fw-light lh-sm">
                  {bagagli + " Bagagli"}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Se necessario, aggiungi una logica per mostrare un loader specifico nel ResultCard
