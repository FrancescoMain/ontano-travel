import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  postAgency,
  resetState,
} from "../features/registraAgenzia/registraAgenziaSlice";
import { toast } from "react-toastify";

const useRegistraAgenzia = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    ragSoc: "",
    parIva: "",
    address: "",
    city: "",
    cap: "",
    prov: "",
    nationality: "",
    referente: "",
    telephone: "",
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({});
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector(
    (state) => state.registraAgenzia
  );

  useEffect(() => {
    if (error) {
      let message = "";
      switch (error.detail) {
        case "name_duplicate":
          message = t("An agency with this name already exists.");
          break;
        case "ragsoc_duplicate":
          message = t("An agency with this Ragione Sociale already exists.");
          break;
        case "piva_duplicate":
          message = t("An agency with this Partita IVA already exists.");
          break;
        case "mail_duplicate":
          message = t("An agency with this email already exists.");
          break;
        default:
          message = error.title;
      }
      toast.error(message, {
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

    if (success) {
      setFormData({
        name: "",
        ragSoc: "",
        parIva: "",
        address: "",
        city: "",
        cap: "",
        prov: "",
        nationality: "",
        referente: "",
        telephone: "",
        email: "",
        password: "",
      });
      setTouched({});
      toast.success(t("Agency registered successfully!"), {
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
  }, [error, success, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  const passwordRegex =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/;
  const capRegex = /^[0-9]{5}$/;
  const partitaIvaRegex = /^[0-9]{11}$/;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      ragSoc: true,
      parIva: true,
      address: true,
      city: true,
      cap: true,
      prov: true,
      nationality: true,
      referente: true,
      telephone: true,
      email: true,
      password: true,
    });

    if (!passwordRegex.test(formData.password)) {
      toast.error(
        t(
          "Password must be at least 8 characters long and include a number, an uppercase letter, a lowercase letter, and a special character."
        ),
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

    if (!capRegex.test(formData.cap)) {
      toast.error(t("CAP must be exactly 5 digits."), {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    if (!partitaIvaRegex.test(formData.parIva)) {
      toast.error(t("Partita IVA must be exactly 11 digits."), {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    dispatch(postAgency(formData));
  };

  const getInputClass = (name) => {
    return touched[name] && !formData[name]
      ? "form-control is-invalid"
      : "form-control";
  };

  return {
    formData,
    touched,
    loading,
    success,
    handleChange,
    handleBlur,
    handleSubmit,
    getInputClass,
    t,
  };
};

export default useRegistraAgenzia;
