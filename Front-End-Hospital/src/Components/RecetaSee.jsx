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
  Textarea,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
} from "@chakra-ui/react";

import { Select, Tag } from "antd";
import { getAllCategorias } from "../services/categoria-services";
import { getCategoriaToRecetaEdit } from "../services/recetas-services";

export const RecetaSee = ({ receta }) => {
  const colors = ["gold", "lime", "green", "cyan", "blue", "red"]; // Colores cíclicos

  const [categorias, setCategorias] = useState([]);
  /* 
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
  ]; */
  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const option = categorias?.find((categoria) => categoria.value === value);
    console.log(option);
    return (
      <Tag
        color={option?.color || "default"} // Usa el color de la opción, o un color por defecto
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

    const categoriasasociadas = async () => {
      let categorias = await getCategoriaToRecetaEdit(receta.id);
      console.log(categorias);

      // Asignar colores cíclicos a las categorías asociadas
      const categoriasConColor = categorias.categoriasAsociadas.map(
        (cat, index) => ({
          ...cat,
          value: cat.id,
          label: cat.nombre,
          color: colors[index % colors.length], // Asignar color cíclico
        })
      );

      setCategorias(categoriasConColor);
    };
    categoriasasociadas();
  }, [receta]);

  useEffect(() => {
    const getallcategorias = async () => {
      const cate = await getAllCategorias();

      const categoriaToSelect = cate.map((cat, index) => {
        return {
          value: cat.id,
          label: cat.nombre,
          color: colors[index % colors.length], // Asignar colores de manera cíclica
        };
      });
      setCategorias(categoriaToSelect);
      return cate;
    };
  }, []);

  const renderOrderedList = (text, desordenada = false) => {
    if (text) {
      return (
        <>
          {desordenada ? (
            <UnorderedList
              styleType="'-'"
              margin="0 auto"
              textAlign={"center"}
              /* width="250px"
              height="200px" */
              /* overflowY="auto" */
              overflowY={text.split("\n").length > 5 ? "scroll" : "hidden"}
              border="1px solid white"
              paddingLeft="20px"
              paddingTop={"2rem"}
            >
              {text.split("\n").map((line, index) => (
                <ListItem style={{ textAlign: "justify" }} key={index}>
                  {line}
                </ListItem>
              ))}
            </UnorderedList>
          ) : (
            <OrderedList
              margin="0 "
              textAlign={"center"}
              /*  width=""
              height="200px" */
              /*overflowY="auto"*/
              overflowY={text.split("\n").length > 5 ? "scroll" : "hidden"}
              border="1px solid white"
              paddingLeft="20px"
              paddingTop={"2rem"}
            >
              {text.split("\n").map((line, index) => (
                <ListItem
                  style={{ textAlign: "justify", width: "100%" }}
                  key={index}
                >
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
    <div className="form">
      <>
        <Grid
          className="grid_chackra"
          templateColumns={{
            base: "1fr",
            md: "repeat(auto-fit, minmax(470px, 1fr))",
          }}
          gap={10}
        >
          {/* En esta seccion se mostraran las categorias de las recetas */}
          <GridItem colSpan={{ base: 1, md: 2 }}>
            {categorias.length > 0 ? (
              <>
                Categorias
                <Select
                  mode="multiple"
                  tagRender={(props) => tagRender(props, categorias)}
                  defaultValue={categorias.map((o) => o.value)}
                  style={{
                    width: "100%",
                    border: "0px solid white", // Estilo para eliminar el borde
                    boxShadow: "none", // Elimina la sombra que podría dar la apariencia de un borde
                    pointerEvents: "none", // Evita la interacción sin aplicar estilos visuales
                    cursor: "default", // Cambia el cursor para que no sea de edición
                  }}
                  options={categorias}
                  open={false}
                  suffixIcon={null} // Oculta la flecha hacia abajo
                  onMouseDown={(e) => e.preventDefault()} // Evita la interacción al hacer clic
                />
              </>
            ) : null}
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 1 }}>
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
            </div>
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 1 }}>
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
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 2 }} className="receta_preparacion">
            <p className="titulo_receta">Preparación</p>
            {renderOrderedList(receta.preparacion)}
          </GridItem>
          <GridItem
            colSpan={{ base: 1, md: 2 }}
            className={`cont_tips_composicion ${
              receta?.composicionNutricional.length > 0 ||
              receta?.tipsSaludables.length > 0
                ? ""
                : ""
            }`}
          >
            {receta?.tipsSaludables.length > 0 ? (
              <GridItem colSpan={{ base: 1, md: 1 }}>
                <p className="titulo_receta">Tips Saludables</p>
                {renderOrderedList(receta.tipsSaludables)}
              </GridItem>
            ) : null}
            {receta?.composicionNutricional.length > 0 ? (
              <GridItem colSpan={{ base: 1, md: 1 }}>
                <p className="titulo_receta">Composición Nutricional</p>
                {renderOrderedList(receta.composicionNutricional, true)}
              </GridItem>
            ) : null}
          </GridItem>
        </Grid>
      </>
    </div>
  );
};
