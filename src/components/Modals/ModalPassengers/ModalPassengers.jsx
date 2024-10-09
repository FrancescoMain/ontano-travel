import {
  Box,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
  Button,
} from "@mui/joy";
import { useTranslation } from "react-i18next";
import "../Modal.css";
import IconButton from "@mui/joy/IconButton";
import { useEffect, useState } from "react";
import { Add, Remove } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  setAdulti,
  setBambini,
  setEtaBambini,
} from "../../../features/viaggio/viaggioFormSlice";

export const ModalPassengers = ({ open, setOpen }) => {
  const { t } = useTranslation();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const dispatch = useDispatch();
  const { adulti, bambini, etaBambini } = useSelector(
    (state) => state.viaggioForm
  );

  const handleClickConfirm = () => {
    setOpen(false);
  };

  const etaBambinoString = t("Inserire età bambino");

  useEffect(() => {
    // Controlla se tutti i campi di età dei bambini sono compilati
    const allAgesFilled =
      etaBambini.length === bambini && etaBambini.every((age) => age !== "");
    setButtonDisabled(!allAgesFilled);
  }, [etaBambini, bambini]);

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog
        sx={{ width: 600 }}
        color="primary"
        size="lg"
        variant="plain"
      >
        <ModalClose disabled={buttonDisabled} />
        <Typography color="primary" level="h4" noWrap={false} variant="plain">
          {t("Seleziona i passeggeri")}
        </Typography>
        <div className="modal-passengers">
          <div className="modal-passengers__counter">
            <Typography
              color="primary"
              level="body-md"
              noWrap={false}
              variant="plain"
            >
              {t("Adulti oltre i 12 anni")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                pt: 4,
                mb: 2,
                borderTop: "1px solid",
                borderColor: "background.level1",
              }}
            >
              <IconButton
                size="sm"
                variant="outlined"
                onClick={() => dispatch(setAdulti(adulti > 0 ? adulti - 1 : 0))}
              >
                <Remove />
              </IconButton>
              <Typography textColor="text.secondary" sx={{ fontWeight: "md" }}>
                {adulti}
              </Typography>
              <IconButton
                size="sm"
                variant="outlined"
                onClick={() => dispatch(setAdulti(adulti + 1))}
              >
                <Add />
              </IconButton>
            </Box>
          </div>
          <div className="modal-passengers__counter">
            <Typography
              color="primary"
              level="body-md"
              noWrap={false}
              variant="plain"
            >
              {t("Bambini fino agli 11 anni")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                pt: 4,
                mb: 2,
                borderTop: "1px solid",
                borderColor: "background.level1",
              }}
            >
              <IconButton
                size="sm"
                variant="outlined"
                onClick={() => {
                  dispatch(setBambini(bambini > 0 ? bambini - 1 : 0));
                  dispatch(setEtaBambini(etaBambini.slice(0, -1)));
                }}
              >
                <Remove />
              </IconButton>
              <Typography textColor="text.secondary" sx={{ fontWeight: "md" }}>
                {bambini}
              </Typography>
              <IconButton
                size="sm"
                variant="outlined"
                onClick={() => dispatch(setBambini(bambini + 1))}
              >
                <Add />
              </IconButton>
            </Box>
          </div>
        </div>
        {bambini > 0 && (
          <Typography
            color="primary"
            level="body-md"
            noWrap={false}
            variant="plain"
          >
            Inserire età bambini
          </Typography>
        )}
        {Array.from({ length: bambini }).map((_, index) => (
          <Input
            onChange={(e) => {
              if (e.target.value > 11) {
                e.target.value = 11;
              }
              if (e.target.value < 0) {
                e.target.value = 0;
              }
              const newChildrenAge = [...etaBambini];
              newChildrenAge[index] = e.target.value;
              dispatch(setEtaBambini(newChildrenAge));
            }}
            value={etaBambini[index] || ""}
            type="number"
            key={index}
            color="neutral"
            placeholder={`${etaBambinoString} ${index + 1}`}
            variant="outlined"
          />
        ))}

        <Button
          variant="soft"
          color="neutral"
          size="lg"
          onClick={handleClickConfirm}
          disabled={buttonDisabled}
        >
          {t("Conferma")}
        </Button>
      </ModalDialog>
    </Modal>
  );
};
