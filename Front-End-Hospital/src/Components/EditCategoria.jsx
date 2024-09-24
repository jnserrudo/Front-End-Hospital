import {
  Button,
  ButtonGroup,
  Textarea,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { Space } from "antd";
import React, { useContext, useEffect, useState } from "react";
import "../style.css";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";

import CategoriasContext from "../Contexts/CategoriaContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@chakra-ui/react";
import { Select } from "antd";

export const EditCategoria = ({ categoria, onCloseEdit }) => {
  console.log("edit categoria: ", categoria);

  const navigate = useNavigate();
  const handleShowConsulta = (ndocu) => {
    navigate("/categoria/" + ndocu);
  };

  const [bandEdit, setBandEdit] = useState(false);
  const [bandUpdated, setBandUpdated] = useState(false);
  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
    useState(false);

  const { handleChangeInput, handleChangeSelectTipos, handleUpdate } =
    useContext(CategoriasContext);
  if (!categoria) {
    return null;
  }

  const optionsTipos = [
    {
      value: 1,
      label: "Ejercicio",
    },
    {
      value: 2,
      label: "Información",
    },
    {
      value: 3,
      label: "Recetas",
    },
  ];
  const sharedPropsCategorias = {
    style: {
      width: "100%",
    },
    /* 
      en este caso ya que no hay una tabla de tipos,
      se buscara en este componente cual es el tipo 
      de categoria q no tiene asociada
      options: [
        {
          value:1,
          label:"Ejercicio"
        },{
          value:2,
          label:"Información"
        }
        ,{
          value:3,
          label:"Recetas"
        }
      ], */
    value: optionsTipos.find((c) => c.value == categoria.tipo),
    placeholder: "Seleccione una Tipo",
    maxTagCount: "responsive",
  };

  console.log("viendo al categoria: ", categoria);
  useEffect(() => {
    setBandUpdated(bandEdit);
  }, [bandEdit]);

  return (
    <div className="form_edit_categoria">
      {/* <h2>
          {categoria.nombre} {categoria.apellido}{" "}
        </h2>
   */}
      <div className="cont_form_input">
        <FormControl
          className="cont_input_edit"
          variant="floating"
          id="nombre"
          isRequired
        >
          <Input
            className={`input_edit ${!bandEdit ? "input_disabled" : ""}`}
            label="Nombre"
            name="nombre"
            variant="outlined"
            type="text"
            disabled={!bandEdit}
            value={categoria.nombre ? categoria.nombre : ""}
            onChange={(e) => handleChangeInput(e)}
          />
          <FormLabel>Nombre</FormLabel>
        </FormControl>
        <FormControl
          className="cont_input_edit"
          variant="floating"
          id="descripcion"
          isRequired
        >
          <Textarea
            className={`input_edit ${!bandEdit ? "input_disabled" : ""}`}
            label="Descripcion"
            name="descripcion"
            size="sm"
            variant="outlined"
            type="text"
            disabled={!bandEdit}
            value={categoria.descripcion ? categoria.descripcion : ""}
            onChange={(e) => handleChangeInput(e)}
          />
          <FormLabel>Descripción</FormLabel>
        </FormControl>
        <Select
          disabled={!bandEdit}
          className="select_recetas input_edit"
          name="idTipos"
          {...sharedPropsCategorias}
          options={optionsTipos.filter((c) => c.value != categoria.tipo)}
          /* value={alumnos} */
          onChange={handleChangeSelectTipos}
        />
      </div>

      <div className="cont_btns_acciones_categoria">
        {!bandEdit ? (
          <Button
            className="btn_accion_edit_categoria"
            /* variant="outlined" */
            colorScheme="blue"
            onClick={() => setBandEdit(true)}
          >
            Editar
          </Button>
        ) : (
          <Button
            className="btn_accion_edit_categoria"
            /* variant="contained" */
            color="info"
            onClick={() => setBandEdit(false)}
          >
            Cancelar
          </Button>
        )}

        {bandUpdated ? (
          <Button
            className="btn_accion_edit_categoria"
            colorScheme="green"
            /* variant="contained"
            style={{ margin: "1rem auto 0" }} */
            onClick={() => setShowVentEmergenteConfirmacion(true)}
          >
            Actualizar
          </Button>
        ) : null}
      </div>

      <VentEmergConfirmacion
        onClosePadre={onCloseEdit}
        onClose={() => setShowVentEmergenteConfirmacion(false)}
        mje={
          "Esta seguro de actualizar los datos del categoria " +
          /*  categoria?.nombre?.toUpperCase() +
            ", " +
            categoria?.apellido?.toUpperCase() + */
          " ?"
        }
        handleSi={() => handleUpdate(categoria)}
        isOpen={showVentEmergenteConfirmacion}
      />
    </div>
  );
};

/* 
  <TextField
                  className="input_carga plan_anioc_edicion_input"
                  id="outlined-basic"
                  label="Año de Cursado"
                  variant="outlined"
                  name="añoc"
                  type="number"
                  onChange={(e) => {
                    handleChange(e);
                    setCurso({
                      ...curso,
                      añoc: e.target.value,
                    });
                  }}
                  onBlur={() => handleBlurElementosForm("añoc")}
                  value={curso.añoc ? curso.añoc : ""}
                />
  */
