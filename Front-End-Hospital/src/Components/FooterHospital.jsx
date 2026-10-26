import React from "react";
import "../style.css";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  InstagramOutlined,
  FacebookOutlined,
} from "@ant-design/icons";

export const FooterHospital = ({ setSelectedKey, isHome = false }) => {
  return (
    <div className={`footer ${isHome ? "footer--home" : ""}`}>
      <div className="footer-brand">
        <img
          className="logo_hospital_footer"
          onClick={() => setSelectedKey("1")}
          src="/logo-onativia.png"
          alt="Logo del Hospital Dr. Arturo Oñativia"
          onError={(e) => {
            // Solo ocultamos la imagen: el nombre del hospital queda visible al lado.
            e.currentTarget.style.display = "none";
          }}
        />
        <p className="footer-name">Hospital Dr. Arturo Oñativia</p>
      </div>

      <div className="footer-section">
        <span className="txt">
          <EnvironmentOutlined /> Paz Chaín 30, 4400 Salta
        </span>
        <span className="txt">
          <PhoneOutlined style={{ transform: "rotate(90deg)" }} /> 0387 422-1605
        </span>
      </div>

      <div className="footer-section">
        <span className="footer-social">
          <InstagramOutlined /> HospitalOñativia
        </span>
        <span className="footer-social">
          <FacebookOutlined /> Hospital Oñativia
        </span>
      </div>

      <div className="footer-copy">
        Hospital Dr. Arturo Oñativia © {new Date().getFullYear()} · Desarrollado por JNSIX
      </div>
    </div>
  );
};
