import React, { createContext, useEffect, useState } from "react";
import {
  getAllCategorias,
  getCategoriaById,
  insertCategoria,
  updateCategoria,
} from "../services/categoria-services";
import { EditOutlined, DragOutlined, DeleteOutlined } from "@ant-design/icons";
const CategoriaContext = createContext();
export const CategoriaProvider = ({ children }) => {
  const [db, setDb] = useState([]);
  const [dbSearch, setDbSearch] = useState([]);
  const [idCategoria, setIdCategoria] = useState(0);
  const [categoriaSelected, setCategoriaSelected] = useState({});
  const [showVentEmergenteDelete, setShowVentEmergenteDelete] = useState(false);
  const [showVentEmergenteEditCategoria, setShowVentEmergenteEditCategoria] =
    useState(false);
  const [showVentEmergenteAddCategoria, setShowVentEmergenteAddCategoria] =
    useState(false);
  const [categoriaToInsert, setCategoriaToInsert] = useState({});
  const [bandInsert, setBandInsert] = useState(false);

  const [showVentEmergenteConfCategoria, setShowVentEmergenteConfCategoria] =
    useState(false);

  const [bandLoader, setBandLoader] = useState(false);

  const validationsForm = (form) => {
    //lo ideal seria que el objeto error permanezca vacio
    let errors = {};

    let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
    let regexEmail = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/;
    let regexComments = /^.{1,255}$/;
    let regexNums = /^([0-9])*$/;

    // en esta validacion aparecen los 4 mensajes al mismo tiempo, se debera pensar la manera en la cual simplemente aparezca por el input que se esta viendo, tambien creo que la validacion se deberia hacer cuando se envie el formulario
    console.log(form);

    if (!form?.nombre || form?.nombre?.length == 0) {
      errors.nombre = "El nombre es requerido";
    }
    if (!form?.descripcion || form?.descripcion?.length == 0) {
      errors.descripcion = "La descripcion es requerida";
    }

    if (!form?.tipo ) {
      errors.tipo = "El tipo es requerido";
    }

    console.log(errors);

    return errors;
  };

  const handleSearch = (busq) => {
    console.log(busq);
    console.log(db);
    let coincidencias = [];
    for (let pac of db) {
      for (let x of Object.values(pac)) {
        if (x.toString().toLowerCase().includes(busq.toLowerCase())) {
          console.log(x);
          coincidencias.push(pac);
          break;
        }
      }
    }

    setDbSearch(coincidencias);
    console.log("coincidencias: ", coincidencias);
  };

  const handleCloseVentEmergenteEditCategoria = () => {
    setShowVentEmergenteEditCategoria(false);
    setIdCategoria(0);
  };

  const handleCloseVentEmergenteAddCategoria = () => {
    setShowVentEmergenteAddCategoria(false);
    setCategoriaToInsert({});
  };

  const handleCloseVentEmergenteConfCategoria = () => {
    setShowVentEmergenteConfCategoria(false);
  };

  const handleCloseConfInsert = async () => {
    //se confirmo que se agregara el Categoria
    setBandLoader(true);
    await handleInsert();

    setCategoriaToInsert({});
    setBandInsert(false);
    setBandLoader(false);
    //de alguna manera actualizar la tabla para que se pueda ver al nuevo Categoria
  };

  const handleChangeInputInsert = (e) => {
    console.log("name: ", e.target.name, " value: ", e.target.value);

    let newValue = {
      ...categoriaToInsert,
      [e.target.name]: e.target.value,
    };
    console.log(newValue);
    setCategoriaToInsert(newValue);
  };

  const handleChangeInput = (e) => {
    console.log("name: ", e.target.name, " value: ", e.target.value);

    let newValue = {
      ...categoriaSelected,
      [e.target.name]: e.target.value,
    };
    console.log(newValue);
    setCategoriaSelected(newValue);
  };

  /* const columns=[
    { field: "nomCategoria", headerName: "DNI", width: 150 },
    { field: "nombre", headerName: "Nombre", width: 180 },
    { field: "apellido", headerName: "Apellido", width: 350 },
  ];
 */

  const handleEditCategoria = (categoria) => {
    console.log("editando: ", categoria);
    setIdCategoria(categoria.id);
    setShowVentEmergenteEditCategoria(true);
  };

  const handleDelete = async (record) => {
    setIdCategoria(record.id);
    setShowVentEmergenteDelete(true);
  };

  const handleChangeSelectTiposInsert = (e) => {
    let newValue = {
      ...categoriaToInsert,
      tipo: e,
    };
    console.log(newValue);
    setCategoriaToInsert(newValue);
  };

  const handleChangeSelectTipos = (e) => {
    let newValue = {
      ...categoriaSelected,
      tipo: e,
    };

    console.log(newValue);
    setCategoriaSelected(newValue);
  };

  const handleUpdate = async (categoria) => {
    const actualizarCategoria = async (categoria) => {
      console.log("se esta por actualizar este categoria: ", categoria);
      const update = await updateCategoria(categoria);
      console.log("update: ", update);
    };

    //activar loader
    setBandLoader(true);
    let resupdate = await actualizarCategoria(categoria);
    getallCategorias();

    console.log(resupdate);
    setBandLoader(false);
  };

  const handleSeePacient = (categoria) => {
    console.log("viendo: ", categoria);
  };

  useEffect(() => {
    //este useEffect lo que hara es que traera las recetas luego de una posible eliminacion
    //posible porque cuando sea falso, se habra cerrado la ventana de confirmacion del delete y traera las recetas
    if (!showVentEmergenteDelete) {
      getallCategorias();
    }
  }, [showVentEmergenteDelete]);

  useEffect(() => {
    const getCategoriabyId = async () => {
      let categoria = await getCategoriaById(idCategoria);
      setCategoriaSelected(categoria);
    };
    if (idCategoria > 0) {
      getCategoriabyId();
    }
  }, [idCategoria]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text) => <a>{text}</a>,
      align: "center",
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      render: (text) => <a>{text}</a>,
      align: "center",
    },
    {
      title: "Descripcion",
      dataIndex: "descripcion",
      align: "center",
    },

    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      render: (_, record) => (
        <div className="cont_acciones">
          {/* <EditOutlined
            className="icon_accion"
            onClick={(e) => handleEditCategoria(record)}
          /> */}
          <DragOutlined
            className="icon_accion"
            onClick={(e) => handleEditCategoria(record)}
          />
          <DeleteOutlined
            className="icon_accion"
            onClick={(e) => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  const handleInsert = async () => {
    if (bandInsert) {
      //validar para insert
      console.log(" se esta por insertar el categoria: ", categoriaToInsert);
      await addCategoria(categoriaToInsert);
      handleCloseVentEmergenteConfCategoria();
      handleCloseVentEmergenteAddCategoria();
    }
  };
  const addCategoria = async (categoria) => {
    let insert = await insertCategoria(categoria);
    console.log(insert);
    //esto es solo de prueba para que se visualize momentaneamente el categoria agregado
    setDb([insert /* categoria */, ...db]);

    return insert;
  };

  let getallCategorias = async () => {
    let categorias = await getAllCategorias();
    console.log(categorias);
    setDb(categorias);
  };
  useEffect(() => {
    getallCategorias();
  }, []);

  useEffect(() => {
    console.log(categoriaToInsert);
    let errores = validationsForm(categoriaToInsert);
    console.log(errores);
    console.log(Object.keys(errores).length);
    if (Object.keys(errores).length == 0) {
      setBandInsert(true);
    } else {
      setBandInsert(false);
    }
    //setBandInsert()
  }, [categoriaToInsert]);

  let data = {
    db: db,
    columns: columns,
    categoriaSelected: categoriaSelected,
    showVentEmergenteEditCategoria: showVentEmergenteEditCategoria,
    setShowVentEmergenteEditCategoria: showVentEmergenteEditCategoria,
    categoriaToInsert,
    bandInsert,
    showVentEmergenteAddCategoria,
    showVentEmergenteConfCategoria,
    bandLoader,
    dbSearch,
    showVentEmergenteDelete,
    idCategoria,
    handleChangeSelectTiposInsert,
    handleChangeSelectTipos,
    setIdCategoria,
    setShowVentEmergenteDelete,
    handleSearch,
    handleCloseConfInsert,
    setShowVentEmergenteConfCategoria,
    handleCloseVentEmergenteConfCategoria,
    handleCloseVentEmergenteAddCategoria,
    setShowVentEmergenteAddCategoria,
    validationsForm,
    setBandInsert,
    handleChangeInputInsert,
    handleEditCategoria: handleEditCategoria,
    handleSeePacient: handleSeePacient,
    handleCloseVentEmergenteEditCategoria:
      handleCloseVentEmergenteEditCategoria,
    handleChangeInput,
    addCategoria,
    handleInsert,
    handleUpdate,
  };
  return (
    <CategoriaContext.Provider value={data}>
      {" "}
      {children}{" "}
    </CategoriaContext.Provider>
  );
};
export default CategoriaContext;
