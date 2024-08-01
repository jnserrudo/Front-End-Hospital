import React, { useEffect, useState } from "react";
import { entorno } from "../services/config";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";
export const RecetaSee = ({ receta }) => {
  console.log(receta);

  const [fileList, setFileList] = useState(
    receta.urlFoto
      ? [
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: entorno.slice(0, -4) + receta.urlFoto,
          },
        ]
      : []
  );

  useEffect(() => {
    setFileList(
      receta.urlFoto
        ? [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: entorno.slice(0, -4) + receta.urlFoto,
            },
          ]
        : []
    );
  }, [receta]);

  const renderOrderedList = (text, desordenada = false) => {
    if (text) {
      return (
        <>
          {desordenada ? (
            <UnorderedList
              styleType="'-'"
              margin="0 auto"
              textAlign={"center"}
              width="250px"
              height="200px"
              overflowY="auto"
              border="1px solid white"
              paddingLeft="20px"
              paddingTop={"2rem"}
            >
              {text.split("\n").map((line, index) => (
                <ListItem style={{ textAlign: "justify"  }} key={index}>
                  {line}
                </ListItem>
              ))}
            </UnorderedList>
          ) : (
            <OrderedList
              margin="0 "
              textAlign={"center"}
              width=""
              height="200px"
              overflowY="auto"
              border="1px solid white"
              paddingLeft="20px"
              paddingTop={"2rem"}
            >
              {text.split("\n").map((line, index) => (
                <ListItem style={{ textAlign: "justify",  width:'100%' }} key={index}>
                  {line}
                </ListItem>
              ))}
            </OrderedList>
          )}
        </>
      );
    }
    return null;
  };

  return (
    <div>
      <>
        <div className="receta_foto_ingredientes">
          <div className="receta_foto ">
            <p className="titulo_receta">{receta.nombre}</p>

            <img
              className="img_receta"
              src={
                receta?.urlFoto
                  ? entorno.slice(0, -4) + receta.urlFoto
                  : "/imagen_receta_default.png"
              }
              alt={receta.nombre}
            />

            {/*  <ImgCrop className="imgCropSeeReceta" rotationSlider>
            <Upload
              className="uploadSeeReceta"
              listType="picture-card"
              fileList={fileList}
            ></Upload>
          </ImgCrop> */}
          </div>

          <div className="receta_ingredientes ">
            <div className="receta_valores">
              <div className="receta_valor">
                <p>Porciones</p>
                <p>{receta.porciones}</p>
              </div>
              <div className="receta_valor">
                <p>Calorías</p>
                <p>{receta.calorias}</p>
              </div>
              <div className="receta_valor">
                <p>Tiempo</p>
                <p>{receta.tiempo}</p>
              </div>
            </div>
            <div className="ingredientes">
              <p className="titulo_receta">Ingredientes</p>
              {renderOrderedList(receta.ingredientes)}
            </div>
          </div>
        </div>
        <div className="receta_preparacion box_shadow">
          <p className="titulo_receta">Preparación</p>
          {renderOrderedList(receta.preparacion)}
        </div>
        <div
          className={`cont_tips_composicion ${
            receta?.composicionNutricional.length > 0 ||
            receta?.tipsSaludables.length > 0
              ? ""
              : ""
          }`}
        >
          {receta?.tipsSaludables.length > 0 ? (
            <div className="receta_tipsSaludables ">
              <p className="titulo_receta">Tips Saludables</p>
              {renderOrderedList(receta.tipsSaludables)}
            </div>
          ) : null}
          {receta?.composicionNutricional.length > 0 ? (
            <div className="receta_composicion ">
              <p className="titulo_receta">Composición Nutricional</p>
              {renderOrderedList(receta.composicionNutricional,true)}
            </div>
          ) : null}
        </div>
      </>
    </div>
  );
};
