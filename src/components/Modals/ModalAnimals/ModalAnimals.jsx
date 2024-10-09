import {
  Box,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
  Button,
} from "@mui/joy";
import { useTranslation } from "react-i18next";
import "../Modal.css";
import IconButton from "@mui/joy/IconButton";
import { Add, Remove } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setAnimali } from "../../../features/viaggio/viaggioFormSlice";

export const ModalAnimals = ({ open, setOpen }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { animali } = useSelector((state) => state.viaggioForm);

  const handleClickConfirm = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog
        sx={{ width: 600 }}
        color="primary"
        size="lg"
        variant="plain"
      >
        <ModalClose />
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
              {t("Animali")}
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
                onClick={() =>
                  dispatch(setAnimali(animali > 0 ? animali - 1 : 0))
                }
              >
                <Remove />
              </IconButton>
              <Typography textColor="text.secondary" sx={{ fontWeight: "md" }}>
                {animali}
              </Typography>
              <IconButton
                size="sm"
                variant="outlined"
                onClick={() => dispatch(setAnimali(animali + 1))}
              >
                <Add />
              </IconButton>
            </Box>
          </div>
        </div>

        <Button
          variant="soft"
          color="neutral"
          size="lg"
          onClick={handleClickConfirm}
        >
          {t("Conferma")}
        </Button>
      </ModalDialog>
    </Modal>
  );
};
