import React from "react";
import ButtonStepper from "../components/ResultsComponent/Stepper";
import { Input } from "@mui/joy";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export const Checkout = () => {
  return (
    <div className="conatiner">
      <div className="row d-flex justify-content-center ">
        <ButtonStepper step={1} />
        <div className="col-9">
          <div className="row justify-content-between">
            <div className="col-7 bg-aliceblue rounded">
              <div className="row">
                <div className="col ">
                  <h2 className="text-primary">Dati Passeggeri</h2>
                  <h5 className="text-secondary">
                    1° Passeggero intestatario del biglietto
                  </h5>
                  <div class="row justify-content-center align-items-center g-2 mb-2">
                    <div class="col">
                      <Input placeholder="Nome*" />
                    </div>
                    <div class="col">
                      <Input placeholder="Cognome*" />
                    </div>
                  </div>
                  <div class="row justify-content-center align-items-center g-2 mb-2">
                    <div class="col">
                      <Input placeholder="Luogo di nascita*" />
                    </div>
                    <div class="col">
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="it"
                      >
                        <DatePicker
                          sx={{ height: 36 }}
                          label={"Data di nascita*"}
                          inputFormat="DD/MM/YYYY"
                          className="date-picker"
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-4 bg-aliceblue">Resoconto</div>
          </div>
        </div>
      </div>
    </div>
  );
};
