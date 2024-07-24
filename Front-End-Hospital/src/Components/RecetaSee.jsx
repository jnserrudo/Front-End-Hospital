import React, { useEffect, useState } from "react";
import { entorno } from "../services/config";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";

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

  return (
    <div>
      <div className="receta_foto_ingredientes">
        <div className="receta_foto box_shadow">
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

        <div className="receta_ingredientes box_shadow">
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
            <p>{receta.ingredientes}</p>
          </div>
        </div>
      </div>
      <div className="receta_preparacion box_shadow">
        <p className="titulo_receta">Preparación</p>
        <p>{receta.preparacion}</p>
      </div>
      <div className="cont_tips_composicion box_shadow">
        {receta?.tipsSaludables.length>0 ? (
          <div className="receta_tipsSaludables">
            <p className="titulo_receta">Tips Saludables</p>
            <p>{receta.tipsSaludables}</p>
          </div>
        ) : null}
        {receta?.composicionNutricional.length>0 ? (
          <div className="receta_composicion">
          <p className="titulo_receta">Composición Nutricional</p>
          <p>{receta.composicionNutricional}</p>
        </div>
        ) : null}
        
      </div>
    </div>
  );
};
