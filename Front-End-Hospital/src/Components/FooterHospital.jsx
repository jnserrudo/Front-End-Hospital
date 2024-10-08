import React from "react";
import "../style.css";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  InstagramOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export const FooterHospital = ({ setSelectedKey }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="footer">
        <img
          className="logo_hospital_footer"
          onClick={() => setSelectedKey("1")}
          src="/logoOñativia.png"
          alt=""
        />
        {/*         <p className="titulo">HOSPITAL OÑATIVIA</p>
         */}
        <img src="" alt="" />
        <p className="txt">
          <EnvironmentOutlined /> Paz Chaín 30 4400 Salta Salta · 03 km
        </p>
        <div className="cont_red_social">
          <InstagramOutlined /> HospitalOñativia
        </div>
        <div className="cont_red_social">
          <FacebookOutlined /> Hospital Oñativia
        </div>
        <h3 className="txt">
          <PhoneOutlined style={{ transform: 'rotate(90deg)' }} /> 0387 422-1605
        </h3>
      </div>
      {/* <div className="cont_opciones_footer">
        <p className="titulo titulo_footer" onClick={() => setSelectedKey("2")}>
          Recetas
        </p>
        <p className="titulo titulo_footer" onClick={() => setSelectedKey("3")}>
          Información
        </p>
        <p className="titulo titulo_footer" onClick={() => setSelectedKey("4")}>
          Ejercicio
        </p>
      </div> */}
      <p style={{textAlign:'center'}} >      Hospital Oñativia ©{new Date().getFullYear()} Created by JNSIX
      </p>

    </>
  );
};
