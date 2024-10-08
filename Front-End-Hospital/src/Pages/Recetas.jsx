import React, { useContext, useEffect, useState } from "react";
import { Select, Space } from "antd";
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  IconButton,
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { CheckOutlined, SearchOutlined } from "@ant-design/icons";
import { VentEmergenteRecetaSee } from "../Components/VentEmergRecetaSee";
import RecetaContext from "../Contexts/RecetaContext";
import { getAllPatologias } from "../services/patologia-services";
import { getRecetaByPatologia } from "../services/recetas-services";
import "../style.css"; // Importamos el archivo de estilos correcto
import { Tag } from "antd"; // Asegúrate de importar Tag de Ant Design
import { MedicineBoxOutlined } from "@ant-design/icons"; // Icono opcional para destacar las patologías

export const Recetas = () => {
  const [showVentEmergRecetaSee, setShowVentEmergRecetaSee] = useState(false);

  const [recetaSee, setRecetaSee] = useState({});

  const {
    db,
    dbSearch,
    handleSearch,
    handleChangeSelectRecetasFiltrar,
    handleChangeSelectCategoriasFiltrar,
    patologiasxRecetasAdd,
    categoriasxRecetasAdd,
  } = useContext(RecetaContext);
  console.log(db);

  const [recetasPatologias, setRecetasPatologias] = useState([]);

  const [options, setOptions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const [recetaSearch, setRecetaSearch] = useState("");

  const sharedProps = {
    mode: "multiple",
    style: {
      width: "100%",
    },
    options: patologiasxRecetasAdd,
    placeholder: "Seleccione una Patología",
    maxTagCount: "responsive",
  };

  const sharedPropsCategorias = {
    mode: "multiple",
    style: {
      width: "100%",
    },
    options: categoriasxRecetasAdd,
    placeholder: "Seleccione una Categoría",
    maxTagCount: "responsive",
  };

  const handleClick = (value) => {
    // Si se hace doble clic en el mismo elemento
    if (selectedItem === value && clickCount === 1) {
      console.log("Se ha hecho doble clic en el mismo elemento");
      // Realizar cualquier acción adicional aquí
      // Por ejemplo, abrir un modal o ejecutar una función
    } else {
      // Si se hace clic en un elemento diferente o es el primer clic en este elemento
      setSelectedItem(value);
      setClickCount(1);
    }
  };

  // Generar opciones de patologías aleatorias
  const generateRandomPatologias = () => {
    const patologias = [];
    const patologiasCount = 20; // Número de patologías a generar

    for (let i = 1; i <= patologiasCount; i++) {
      patologias.push({
        label: `Patología ${i}`,
        value: i,
      });
    }

    setOptions(patologias);
  };
  useEffect(() => {
    //generateRandomPatologias();
    //traer las patologias

    const getPatologias = async () => {
      const patologias = await getAllPatologias();
      if (patologias.length > 0) {
        setOptions(patologias.map((p) => ({ label: p.nombre, value: p.id })));
      }
    };
    getPatologias();
  }, []);

  useEffect(() => {
    if (recetaSee?.nombre) {
      //validamos que se habra la ventana emergente solo cuando se seleccione una receta ok
      setShowVentEmergRecetaSee(true);
    }
  }, [recetaSee]);

  const handleChange = async (value) => {
    console.log(value);
    //aca debo filtrar las recetas
    //si value es length=0 muestro todas, si es mayor a cero muestro filtrado
    let recetas = [];
    if (value.length > 0) {
      for (let idPatologia of value) {
        let recetasByPatologia = await getRecetaByPatologia(idPatologia);
        console.log(recetasByPatologia);
        for (let receta of recetasByPatologia) {
          // Verifica si el ID de la receta ya está en el array
          if (!recetas.some((r) => r.id === receta.id)) {
            recetas.push(receta); // Si no está, agrega la receta al array
          }
        }
      }
      setRecetasPatologias(recetas);
    }
  };
  return (
    <div>
      <nav className="nav_recetas">
        <img src="/recetas.svg" className="icon_imagen" alt="" />
        <div className="cont_sel_recetas">
          <p className="titulo_see">Recetas Saludables</p>

          {/* Buscador */}

          <FormControl className="" variant="floating" id="recetaSearch">
            <InputGroup>
              <Input
                placeholder=""
                name="recetaSearch"
                type="text"
                value={recetaSearch}
                onChange={(e) => {
                  setRecetaSearch(e.target.value);
                  handleSearch(
                    e.target.value,
                    recetasPatologias.length == 0 ? db : recetasPatologias
                  );
                }}
              />
              <InputRightElement
                width="4.5rem"
                style={{ color: "#046ba3", fontSize: "20px" }}
              >
                <SearchOutlined />
              </InputRightElement>
            </InputGroup>

            <FormLabel></FormLabel>
          </FormControl>

          {/* SELECT DE LAS PATOLOGIAS */}
          {/* <Select
            className="select_recetas input_edit"
            name="idPatologias"
            {...sharedProps}
            onChange={handleChangeSelectRecetasFiltrar}
          /> */}

          {/* SELECT DE LAS CATEGORIAS */}
          <Select
            className="select_recetas input_edit"
            name="idCategorias"
            {...sharedPropsCategorias}
            /* value={alumnos} */
            onChange={handleChangeSelectCategoriasFiltrar}
          />
        </div>
      </nav>
      <div className="cont_recetas">
        <List spacing={0}>
          {recetaSearch.length > 0
            ? dbSearch.map((receta, index) => {
                return (
                  <ListItem
                    key={receta.id}
                    className="list-item-receta" // Clase nueva para aplicar los estilos
                    style={{
                      backgroundColor: index % 2 === 0 ? "#E0F2F1" : "#B2DFDB",
                      color: "black",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setRecetaSee(receta);
                    }}
                  >
                    <div
                      className="receta-content"
                      style={{ width: "100%", cursor: "pointer" }}
                    >
                      <p className="txt_nombre_receta">{receta.nombre}</p>
                      <div className="receta-patologias">
                        <div className="patologias-header">
                          <MedicineBoxOutlined style={{ marginRight: 5 }} />
                          <span>Patologías:</span>
                        </div>
                        {receta.patologia?.map((pat) => (
                          <Tag color="blue" key={pat.patologia.id}>
                            {" "}
                            {/* Tag de Ant Design para visualizar las patologías */}
                            {pat.patologia.nombre}{" "}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </ListItem>
                );
              })
            : recetasPatologias.length === 0
            ? db.map((receta, index) => {
                return (
                  <ListItem
                    key={receta.id}
                    className="list-item-receta" // Clase nueva para aplicar los estilos
                    style={{
                      backgroundColor: index % 2 === 0 ? "#E0F2F1" : "#B2DFDB",
                      color: "black",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setRecetaSee(receta);
                    }}
                  >
                    <div
                      className="receta-content"
                      style={{ width: "100%", cursor: "pointer" }}
                    >
                      <p className="txt_nombre_receta">{receta.nombre}</p>
                      <div className="receta-patologias">
                        <div className="patologias-header">
                          <MedicineBoxOutlined style={{ marginRight: 5 }} />
                          <span>Patologías:</span>
                        </div>
                        {receta.patologia?.map((pat) => (
                          <Tag color="blue" key={pat.patologia.id}>
                            {" "}
                            {/* Tag de Ant Design para visualizar las patologías */}
                            {pat.patologia.nombre}{" "}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </ListItem>
                );
              })
            : recetasPatologias.map((receta, index) => {
                return (
                  <ListItem
                    key={receta.id}
                    className="list-item-receta" // Clase nueva para aplicar los estilos
                    style={{
                      backgroundColor: index % 2 === 0 ? "#E0F2F1" : "#B2DFDB",
                      color: "black",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setRecetaSee(receta);
                    }}
                  >
                    <div
                      className="receta-content"
                      style={{ width: "100%", cursor: "pointer" }}
                    >
                      <p className="txt_nombre_receta">{receta.nombre}</p>
                      <div className="receta-patologias">
                        <div className="patologias-header">
                          <MedicineBoxOutlined style={{ marginRight: 5 }} />
                          <span>Patologías:</span>
                        </div>
                        {receta.patologia?.map((pat) => (
                          <Tag color="blue" key={pat.patologia.id}>
                            {" "}
                            {/* Tag de Ant Design para visualizar las patologías */}
                            {pat.patologia.nombre}{" "}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </ListItem>
                );
              })}
        </List>

        <VentEmergenteRecetaSee
          isOpen={showVentEmergRecetaSee}
          onClose={() => setShowVentEmergRecetaSee(false)}
          recetaSelected={recetaSee}
        />
      </div>
    </div>
  );
};
