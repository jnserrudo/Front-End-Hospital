import React, { useContext, useEffect, useState } from "react";
import { Select, Space } from "antd";
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  IconButton,
} from "@chakra-ui/react";
import { CheckOutlined } from "@ant-design/icons";
import { VentEmergenteRecetaSee } from "../Components/VentEmergRecetaSee";
import RecetaContext from "../Contexts/RecetaContext";
import { getAllPatologias } from "../services/patologia-services";
import { getRecetaByPatologia } from "../services/recetas-services";
export const Recetas = () => {
  const [showVentEmergRecetaSee, setShowVentEmergRecetaSee] = useState(false);

  const [recetaSee, setRecetaSee] = useState({});

  const {db}=useContext(RecetaContext)
  console.log(db)

  const [recetasPatologias, setRecetasPatologias] = useState([])

  /* let db = [
    {
      id: 1,
      nombre: "Ensalada César",
      urlFoto: "https://placehold.co/400x300/png",
      porciones: 2,
      calorias: 250,
      tiempo: "15 minutos",
      ingredientes: "Lechuga, Pollo, Queso Parmesano, Aderezo César",
      preparacion: "Mezclar todos los ingredientes y servir frío.",
    },
    {
      id: 2,
      nombre: "Sopa de Tomate",
      urlFoto: "https://via.placeholder.com/150",
      porciones: 4,
      calorias: 150,
      tiempo: "30 minutos",
      ingredientes: "Tomates, Cebolla, Ajo, Caldo de Pollo",
      preparacion:
        "Cocinar todos los ingredientes y licuar hasta obtener una mezcla homogénea.",
    },
    {
      id: 3,
      nombre: "Pasta Carbonara",
      urlFoto: "https://via.placeholder.com/150",
      porciones: 3,
      calorias: 450,
      tiempo: "20 minutos",
      ingredientes: "Pasta, Huevo, Panceta, Queso Parmesano",
      preparacion: "Cocinar la pasta y mezclar con los demás ingredientes.",
    },
    {
      id: 4,
      nombre: "Tacos de Pescado",
      urlFoto: "https://via.placeholder.com/150",
      porciones: 5,
      calorias: 300,
      tiempo: "25 minutos",
      ingredientes: "Tortillas, Pescado, Repollo, Salsa de Yogur",
      preparacion:
        "Freír el pescado y servir en tortillas con los demás ingredientes.",
    },
  ]; */
  const [options, setOptions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [clickCount, setClickCount] = useState(0);

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

    const getPatologias=async()=>{
      const patologias=await getAllPatologias()
      if(patologias.length>0){
        setOptions(patologias.map(p=>({label:p.nombre,value:p.id})))

      }
    }
    getPatologias()
  }, []);

  useEffect(() => {
    if (recetaSee?.nombre) {
      //validamos que se habra la ventana emergente solo cuando se seleccione una receta ok
      setShowVentEmergRecetaSee(true);
    }
  }, [recetaSee]);

  const handleChange =async (value) => {
    console.log(value);
    //aca debo filtrar las recetas
    //si value es length=0 muestro todas, si es mayor a cero muestro filtrado
    let recetas=[]
    if(value.length>0){
      for (let idPatologia of value){
        let recetasByPatologia = await getRecetaByPatologia(idPatologia);
        console.log(recetasByPatologia)
            for (let receta of recetasByPatologia) {
                // Verifica si el ID de la receta ya está en el array
                if (!recetas.some(r => r.id === receta.id)) {
                    recetas.push(receta); // Si no está, agrega la receta al array
                }
            }

      }
      setRecetasPatologias(recetas)
    }
  };
  return (
    <div>
      <nav className="nav_recetas">
        <img src="/recetas.svg" alt="" />
        <div className="cont_sel_recetas">
          <b>Recetas Saludables</b>
          {/* <p>Elige Patología</p>
          <Select
            className="select_recetas select_patologias"
            mode="multiple"
            allowClear
            style={{
              width: "100%",
            }}
            placeholder="Seleccione una Patologia"
            onChange={handleChange}
            options={options}
            color
          /> */}
        </div>
      </nav>
      <div className="cont_recetas">
        <List spacing={3}>
          { recetasPatologias.length==0 ?(db.map((receta, index) => {
            return (
              <>
                <ListItem
                  style={{
                    backgroundColor:
                      selectedItem === index ? "greenyellow" : "inherit",
                    color: selectedItem === index ? "white" : "inherit",
                  }}
                  onClick={() => {
                    handleClick(index);
                    setTimeout(() => setSelectedItem(null), 300); // Reiniciar contador después de 300 ms
                    setRecetaSee(receta);
                    //setShowVentEmergRecetaSee(true) esta en el useEffect
                  }}
                >
                  <CheckOutlined /> {receta.nombre}
                </ListItem>
              </>
            );
          })):(recetasPatologias.map((receta, index) => {
            return (
              <>
                <ListItem
                  style={{
                    backgroundColor:
                      selectedItem === index ? "greenyellow" : "inherit",
                    color: selectedItem === index ? "white" : "inherit",
                  }}
                  onClick={() => {
                    handleClick(index);
                    setTimeout(() => setSelectedItem(null), 300); // Reiniciar contador después de 300 ms
                    setRecetaSee(receta);
                    //setShowVentEmergRecetaSee(true) esta en el useEffect
                  }}
                >
                  <CheckOutlined /> {receta.nombre}
                </ListItem>
              </>
            );
          })) }
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
