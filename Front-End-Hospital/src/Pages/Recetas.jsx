import React, { useEffect, useState } from "react";
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
export const Recetas = () => {

  
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
    generateRandomPatologias();
  }, []);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  return (
    <div>
      <nav className="nav_recetas">
        <img src="/recetas.svg" alt="" />
        <div className="cont_sel_recetas">
          <p>Recetas Saludables</p>
          <b>Elige Patología</b>
          <Select
            className="select_recetas"
            mode="multiple"
            allowClear
            style={{
              width: "100%",
            }}
            placeholder="Please select"
            defaultValue={["a10", "c12"]}
            onChange={handleChange}
            options={options}
            color
          />
        </div>
      </nav>
      <div className="cont_recetas">
        <List spacing={3}>
          <ListItem
            style={{
              backgroundColor: selectedItem === 1 ? "greenyellow" : "inherit",
              color:selectedItem === 1 ? "white" : "inherit"
            }}
            onClick={() => {
              handleClick(1);
              setTimeout(() => setSelectedItem(null), 300); // Reiniciar contador después de 300 ms
            }}
          >
            <CheckOutlined /> Quidem, ipsam illum quis sed voluptatum quae eum
            fugit earum
          </ListItem>
          <ListItem
            style={{
              backgroundColor: selectedItem === 2 ? "greenyellow" : "inherit",
              color:selectedItem === 2 ? "white" : "inherit"
            }}
            onClick={() => {
              handleClick(2);
              setTimeout(() =>  setSelectedItem(null), 300); // Reiniciar contador después de 300 ms
            }}
          >
            <CheckOutlined /> Quidem, ipsam illum quis sed voluptatum quae eum
            fugit earum
          </ListItem>
          <ListItem
            style={{
              backgroundColor: selectedItem === 3 ? "greenyellow" : "inherit",
              color:selectedItem === 3 ? "white" : "inherit"
            }}
            onClick={() => {
              handleClick(3);
              setTimeout(() =>  setSelectedItem(null), 300); // Reiniciar contador después de 300 ms
            }}
          >
            <CheckOutlined /> Quidem, ipsam illum quis sed voluptatum quae eum
            fugit earum
          </ListItem>
          {/* You can also use custom icons from react-icons */}
          <ListItem
            style={{
              backgroundColor: selectedItem === 4 ? "greenyellow" : "inherit",
              color:selectedItem === 4 ? "white" : "inherit"
            }}
            onClick={() => {
              handleClick(4);
              setTimeout(() =>  setSelectedItem(null), 300); // Reiniciar contador después de 300 ms
            }}
          >
            <CheckOutlined /> Quidem, ipsam illum quis sed voluptatum quae eum
            fugit earum
          </ListItem>
        </List>
      </div>
    </div>
  );
};
