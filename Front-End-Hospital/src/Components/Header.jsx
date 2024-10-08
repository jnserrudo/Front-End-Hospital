import React from "react";
import "../style.css";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  InstagramOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
export const Header = ({setSelectedKey}) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="header">
        <img
          className="logo_hospital"
          onClick={() => setSelectedKey("1")}
          src="/logoOñativia.png"
          alt=""
        />
        <p className="titulo">HOSPITAL OÑATIVIA</p>

        <img src="" alt="" />

        <p className="txt">
          <EnvironmentOutlined /> Paz Chaín 30 4400 Salta Salta · 03 km
        </p>
        <h3 className="txt">
          <PhoneOutlined  style={{ transform: 'rotate(90deg)' }} /> 0387 422-1605
        </h3>
      </div>
    </>
  );
};
