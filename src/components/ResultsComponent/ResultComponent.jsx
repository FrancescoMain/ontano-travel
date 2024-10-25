import React from "react";
import {
  ViaggioDiAndataForm,
  ViaggoiDiRitornoForm,
} from "../FormViaggioComponent";
import { useResult } from "../../_hooks/useResult";
import { ResultCard } from "../ResultCard/ResultCard";
import { Button } from "@mui/joy";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export const ResultComponent = () => {
  const {
    results,
    loadingId,
    selected,
    totalPrice,
    multitratta,
    nTratte,
    setNTratte,
  } = useResult();
  const { t } = useTranslation();
  const isHidden = (groupIndex, index) => {
    if (selected.length === 0 || selected[groupIndex]?.data.length === 0)
      return false;
    if (selected[groupIndex]?.idSelected === undefined) return false;
    return selected[groupIndex]?.idSelected !== index;
  };
  const navigate = useNavigate(); // Se la partenza di biglietto di andata è minore rispetto a biglietto di ritorno

  const handleSubmit = () => {
    for (let i = 1; i < selected.length; i++) {
      if (
        dayjs(selected[i - 1]?.data.departure).isAfter(
          dayjs(selected[i]?.data.departure)
        )
      ) {
        toast.error(
          `Il viaggio ${i + 1} non può avvenire prima del viaggio ${i}`,
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
    }

    const viaggioData = {
      selected,
    };
    localStorage.setItem("viaggioData", JSON.stringify(viaggioData));
    navigate("/checkout");
  };
  return (
    <div className="row justify-content-center">
      <div className="col col-lg-6 p-4">
        <ViaggioDiAndataForm resultMode={true} id={0} />
        <div className="mb-3"></div>
        {loadingId === 0 ? (
          <div className="row d-flex justify-content-center">
            <div
              className="spinner-border text-primary align-items-center"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div>
            {!results[0]?.data[0] && <div> No results </div>}
            {results[0]?.data?.map((result, index) => (
              <ResultCard
                key={result.id}
                selected={selected[0]?.idSelected === index}
                data={result}
                id={0}
                index={index}
                hidden={isHidden(0, index)}
              />
            ))}
          </div>
        )}
        {!multitratta && <ViaggoiDiRitornoForm resultMode={true} id={1} />}
        <div className="mb-3"></div>
        {!multitratta && loadingId === 1 ? (
          <div className="row d-flex justify-content-center">
            <div
              className="spinner-border text-primary align-items-center"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div>
            {!results[1]?.data[0] && !multitratta && <div> No results </div>}

            {!multitratta &&
              results[1]?.data?.map((result, index) => (
                <ResultCard
                  key={result.id}
                  selected={selected[1]?.idSelected === index}
                  data={result}
                  id={1}
                  index={index}
                  hidden={isHidden(1, index)}
                />
              ))}
          </div>
        )}
        {multitratta && (
          <div>
            {Array.from(
              { length: nTratte + 1 },
              (_, id) =>
                id !== 0 && (
                  <div>
                    <ViaggioDiAndataForm
                      resultMode={true}
                      id={id}
                      nTratte={nTratte}
                      setNTratte={setNTratte}
                    />
                    <div className="mb-3"></div>
                    {loadingId === id ? (
                      <div className="row d-flex justify-content-center">
                        <div
                          className="spinner-border text-primary align-items-center"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {!results[id]?.data[0] && !multitratta && (
                          <div> No results </div>
                        )}

                        {results[id]?.data?.map((result, index) => (
                          <ResultCard
                            key={result.id}
                            selected={selected[id]?.idSelected === index}
                            data={result}
                            id={id}
                            index={index}
                            hidden={isHidden(id, index)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
            )}
            <button
              onClick={() => setNTratte(nTratte + 1)}
              type="button"
              class="ms-3 btn btn-primary"
            >
              {t("+ Aggiungi Rotta")}
            </button>
          </div>
        )}
      </div>

      <div className="marginDiv "></div>
      {selected[0].prezzo || selected[1].prezzo ? (
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
      ) : null}
    </div>
  );
};
