import { Tabs, Tab, TabList, TabPanel, TabPanels } from "@chakra-ui/react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Select, Tag } from "antd";

import React, { useState } from "react";
import ReactPlayer from "react-player";
import { MedicineBoxOutlined } from "@ant-design/icons"; // Icono opcional para destacar las patologías

export const ListVideos = ({ videos }) => {
  //esta lista servira para los videos de informacion y ejercicios
  console.log(videos);

  const colors = ["gold", "lime", "green", "cyan", "blue", "red"];

  const [categorias, setCategorias] = useState([]);

  const options = [
    {
      value: "gold",
      label: "GOLD",
    },
    {
      value: "lime",
      label: "LIME",
    },
    {
      value: "green",
      label: "GREEN",
    },
    {
      value: "cyan",
      label: "CYAN",
    },
  ];
  const colorPalette = ["gold", "lime", "green", "cyan", "blue", "red"]; // Paleta de colores

  // Función para asignar un color a cada categoría
  const assignColorToCategorias = (categorias) => {
    return categorias.map((cat, index) => ({
      ...cat, // Mantén el valor y label originales
      color: colorPalette[index % colorPalette.length], // Asigna un color cíclico de la paleta
    }));
  };
  const tagRender = (props, categoriasConColor) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    // Busca la opción correspondiente en las categorías con color
    const option = categoriasConColor?.find(
      (categoria) => categoria.id === value
    );
    console.log("option", option);

    return (
      <Tag
        color={option?.color || "red"} // Usa el color de la opción o un color por defecto
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{
          marginInlineEnd: 4,
        }}
      >
        {label}
      </Tag>
    );
  };

  return (
    <div className="cont_videos">
      {videos.map((v, index) => {
        // Asigna colores a las categorías asociadas de este video
        let categoriasConColor;
        if (v?.categoriasAsociadas) {
          categoriasConColor = assignColorToCategorias(v.categoriasAsociadas);
          console.log(categoriasConColor);
        }

        return (
          <>
            <Tabs className="tabs_videos" key={index}>
              <TabList>
                <Tab style={{ lineHeight: "14px" }}>{v.nombre}</Tab>
                <Tab style={{ width: "100px" }}>
                  <PlusCircleOutlined style={{ fontSize: "x-large" }} />
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <div className="cont_video">
                    <ReactPlayer
                      width="100%"
                      height="100%"
                      url={v.url}
                      controls
                    />
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="tabpanel_descripcion">
                    {categoriasConColor && categoriasConColor.length > 0 && (
                      <>
                        <div className="categorias-header">
                          <MedicineBoxOutlined style={{ marginRight: 5 }} />
                          <span>Categorías:</span>
                        </div>
                        {categoriasConColor.map((cat) => (
                          <Tag color="gold" key={cat.id}>
                            {cat.nombre}{" "}
                            {/* Asegúrate de que uses el campo correcto */}
                          </Tag>
                        ))}
                      </>
                    )}

                    {/* Sección para mostrar las patologías */}
                    {v.patologia?.length > 0 && (
                      <>
                        <div className="patologias-header">
                          <MedicineBoxOutlined style={{ marginRight: 5 }} />
                          <span>Patologías:</span>
                        </div>
                        {v.patologia.map((pat) => (
                          <Tag color="blue" key={pat.patologia.id}>
                            {pat.patologia.nombre}
                          </Tag>
                        ))}
                      </>
                    )}
                    {/* Sección para mostrar la descripcion */}
                    {v.descripcion}
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </>
        );
      })}
    </div>
  );
};
