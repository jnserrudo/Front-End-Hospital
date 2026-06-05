import React from "react";
import "../style.css";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  InstagramOutlined,
  FacebookOutlined,
} from "@ant-design/icons";

export const FooterHospital = ({ setSelectedKey }) => {
  return (
    <div className="footer">
      <div className="footer-brand">
        <img
          className="logo_hospital_footer"
          onClick={() => setSelectedKey("1")}
          src="/logoOñativia.png"
          alt="Logo Hospital Oñativia"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.style.display = 'flex';
            e.target.parentElement.innerHTML = '<span class="logo-placeholder">Hospital Oñativia</span>';
          }}
        />
        <p className="footer-name">Hospital Oñativia</p>
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
        Hospital Oñativia © {new Date().getFullYear()} · Desarrollado por JNSIX
      </div>
    </div>
  );
};
