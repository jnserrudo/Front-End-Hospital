import React, { createContext, useEffect, useState } from "react";
import {
  getAllInformacions,
  getAllInformacionsFiltro,
  getCategoriaToInformacionAdd,
  getCategoriaToInformacionEdit,
  getInformacionById,
  getPatologiaToInformacionAdd,
  getPatologiaToInformacionEdit,
  insertInformacion,
  updateInformacion,
} from "../services/informacion-services";
import toast from "react-hot-toast";

import { EditOutlined, DragOutlined, DeleteOutlined } from "@ant-design/icons";
const InformacionContext = createContext();
export const InformacionProvider = ({ children }) => {
  const [db, setDb] = useState([]);
  const [dbSearch, setDbSearch] = useState([]);
  const [idInformacion, setIdInformacion] = useState(0);
  const [informacionSelected, setInformacionSelected] = useState({});

  const [showVentEmergenteDelete, setShowVentEmergenteDelete] = useState(false);
  const [
    showVentEmergenteEditInformacion,
    setShowVentEmergenteEditInformacion,
  ] = useState(false);
  const [showVentEmergenteAddInformacion, setShowVentEmergenteAddInformacion] =
    useState(false);
  const [informacionToInsert, setInformacionToInsert] = useState({});
  const [bandInsert, setBandInsert] = useState(false);

  const [
    showVentEmergenteConfInformacion,
    setShowVentEmergenteConfInformacion,
  ] = useState(false);

  const [bandLoader, setBandLoader] = useState(false);

  const [patologiasxInformacionAdd, setPatologiasxInformacionAdd] = useState(
    []
  );
  const [patologiasxInformacionEdit, setPatologiasxInformacionEdit] = useState(
    []
  );

  const [categoriasxInformacionAdd, setCategoriasxInformacionAdd] = useState(
    []
  );
  const [categoriasxInformacionEdit, setCategoriasxInformacionEdit] = useState(
    []
  );

  const [idsPatologiasFiltro, setIdsPatologiasFiltro] = useState([]);

  const [idsCategoriasFiltro, setIdsCategoriasFiltro] = useState([]);

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
    /* if (!form?.urlVideo || form?.urlVideo?.length == 0) {
      errors.urlVideo = "La urlVideo es requerida";
    } */
    if (!form?.descripcion || form?.descripcion?.length == 0) {
      errors.descripcion = "La descripcion es requerida";
    }

    console.log(errors);

    return errors;
  };

  const handleSearch = (busq, dataToSearch) => {
    console.log(busq);
    console.log(dataToSearch);

    let coincidencias = [];
    for (let pac of dataToSearch) {
      if (pac.nombre.toLowerCase().includes(busq.toLowerCase())) {
        console.log(pac);
        coincidencias.push(pac);
      }
    }

    setDbSearch(coincidencias);
    console.log("coincidencias: ", coincidencias);
  };

  const handleCloseVentEmergenteEditInformacion = () => {
    setShowVentEmergenteEditInformacion(false);
    setIdInformacion(0);
  };

  const handleCloseVentEmergenteAddInformacion = () => {
    setShowVentEmergenteAddInformacion(false);
    //setInformacionToInsert({})
  };

  const handleCloseVentEmergenteConfInformacion = () => {
    setShowVentEmergenteConfInformacion(false);
  };

  const handleCloseConfInsert = async () => {
    //se confirmo que se agregara el Informacion
    setBandLoader(true);
    const resultInsert = await handleInsert();
    if (resultInsert.err) {
      throw new Error(resultInsert.err.message);
    }
    //setInformacionToInsert({})
    setBandInsert(false);
    setBandLoader(false);
    //de alguna manera actualizar la tabla para que se pueda ver al nuevo Informacion
  };

  const handleChangeInputInsert = (e) => {
    console.log("name: ", e.target.name, " value: ", e.target.value);

    let newValue = {
      ...informacionToInsert,
      [e.target.name]: e.target.value,
    };
    console.log(newValue);
    setInformacionToInsert(newValue);
  };

  const handleChangeInput = (e) => {
    console.log("name: ", e.target.name, " value: ", e.target.value);

    let newValue = {
      ...informacionSelected,
      [e.target.name]: e.target.value,
    };
    console.log(newValue);
    setInformacionSelected(newValue);
  };

  /* const columns=[
    { field: "nomInformacion", headerName: "DNI", width: 150 },
    { field: "nombre", headerName: "Nombre", width: 180 },
    { field: "apellido", headerName: "Apellido", width: 350 },
  ];
 */

  const handleEditInformacion = (informacion) => {
    console.log("editando: ", informacion);
    setIdInformacion(informacion.id);
    setShowVentEmergenteEditInformacion(true);
  };

  const handleChangeSelectInsert = (e) => {
    let newValue = {
      ...informacionToInsert,
      idsPatologias: e,
    };
    console.log(newValue);
    setInformacionToInsert(newValue);
  };

  const handleChangeSelectInformacionFiltrar = (e) => {
    //aca aplicamos la logica para poder actualizar la db y poder
    //mostrar esto en la seccion de informacion
    let idsPatologias = e;
    setIdsPatologiasFiltro(idsPatologias);
  };

  const handleChangeSelect = (e) => {
    console.log(e);
    let newValue = {
      ...informacionSelected,
      idsPatologias: e,
    };

    console.log(newValue);
    setInformacionSelected(newValue);
  };

  const handleChangeSelectCategoriasInsert = (e) => {
    let newValue = {
      ...informacionToInsert,
      idsCategorias: e,
    };
    console.log(newValue);
    setInformacionToInsert(newValue);
  };

  const handleChangeSelectCategoriasFiltrar = (e) => {
    //aca aplicamos la logica para poder actualizar la db y poder
    //mostrar esto en la seccion de informacion
    let idsCategorias = e;
    setIdsCategoriasFiltro(idsCategorias);
  };

  const handleChangeSelectCategorias = (e) => {
    let newValue = {
      ...informacionSelected,
      idsCategorias: e,
    };
    console.log(newValue);
    setInformacionSelected(newValue);
  };

  const handleDelete = async (record) => {
    console.log(record.id);
    setIdInformacion(record.id);
    setShowVentEmergenteDelete(true);
  };

  const handleUpdate = async (informacion) => {
    const actualizarInformacion = async (informacion) => {
      console.log("se esta por actualizar este informacion: ", informacion);
      const update = await updateInformacion(informacion);
      console.log("update: ", update);
    };

    //activar loader
    setBandLoader(true);
    let resupdate = await actualizarInformacion(informacion);
    getallInformacions();

    console.log(resupdate);
    setBandLoader(false);
  };

  const handleSeePacient = (informacion) => {
    console.log("viendo: ", informacion);
  };

  useEffect(() => {
    const getinfofiltro = async (idsPatologiasFiltro, idsCategoriasFiltro) => {
      const infos = await getAllInformacionsFiltro({
        idsPatologias:idsPatologiasFiltro,
        idsCategorias:idsCategoriasFiltro,
      });
      console.log(infos);
      setDb(infos);
    };

    console.log(
      "idsPatologiasFiltro, idsCategoriasFiltro",
      idsPatologiasFiltro,
      idsCategoriasFiltro
    );
    if (idsPatologiasFiltro.length > 0 || idsCategoriasFiltro.length > 0) {
      getinfofiltro(idsPatologiasFiltro, idsCategoriasFiltro);
    } else {
      getallInformacions();
    }
  }, [idsPatologiasFiltro, idsCategoriasFiltro]);

  useEffect(() => {
    //este useEffect lo que hara es que traera las recetas luego de una posible eliminacion
    //posible porque cuando sea falso, se habra cerrado la ventana de confirmacion del delete y traera las recetas
    if (!showVentEmergenteDelete) {
      getallInformacions();
    }
  }, [showVentEmergenteDelete]);

  useEffect(() => {
    const getInformacionbyId = async () => {
      let informacion = await getInformacionById(idInformacion);
      setInformacionSelected(informacion);
    };
    if (idInformacion > 0) {
      getInformacionbyId();
    }
  }, [idInformacion]);

  useEffect(() => {
    const getpatologiatoinformacionadd = async () => {
      const patologias = await getPatologiaToInformacionAdd();
      console.log("trae patologias para info", patologias);
      if (patologias.length > 0) {
        let alToSelect = patologias.map((pat) => {
          return {
            label: pat.nombre,
            value: pat.id,
          };
        });
        setPatologiasxInformacionAdd(alToSelect);
      }
    };

    const getcategoriatoinformacionadd = async () => {
      const categorias = await getCategoriaToInformacionAdd();
      console.log("trae categorias para info", categorias);
      if (categorias.length > 0) {
        let alToSelect = categorias.map((pat) => {
          return {
            label: pat.nombre,
            value: pat.id,
          };
        });
        setCategoriasxInformacionAdd(alToSelect);
      }
    };

    getpatologiatoinformacionadd();
    getcategoriatoinformacionadd();
  }, [db]);

  useEffect(() => {
    const getpatologiatoinformacionedit = async () => {
      const patologias = await getPatologiaToInformacionEdit(idInformacion);
      console.log("trae patologias para info edit", idInformacion, patologias);

      if (Object.values(patologias).length > 0) {
        console.log(patologias);
        setPatologiasxInformacionEdit(patologias);
        /* let alToSelect = patologias.map((pat) => {
          return {
            label: pat.nombre,
            value: pat.id,
          };
        });
        console.log(alToSelect)
        setPatologiasxInformacionEdit(alToSelect) */
      }
    };

    const getcategoriatoinformacionedit = async () => {
      const categorias = await getCategoriaToInformacionEdit(idInformacion);
      console.log("trae categorias para info edit", idInformacion, categorias);

      if (Object.values(categorias).length > 0) {
        console.log(categorias);
        setCategoriasxInformacionEdit(categorias);
        /* let alToSelect = patologias.map((pat) => {
          return {
            label: pat.nombre,
            value: pat.id,
          };
        });
        console.log(alToSelect)
        setPatologiasxInformacionEdit(alToSelect) */
      }
    };

    getpatologiatoinformacionedit();
    getcategoriatoinformacionedit();
  }, [idInformacion]);

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
      align: "start",
    },
    {
      title: "Descripcion",
      dataIndex: "descripcion",
      align: "start",
    },

    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      render: (_, record) => (
        <div className="cont_acciones">
          {/* <EditOutlined
            className="icon_accion"
            onClick={(e) => handleEditInformacion(record)}
          /> */}
          <DragOutlined
            className="icon_accion"
            onClick={(e) => handleEditInformacion(record)}
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
      console.log(
        " se esta por insertar el informacion: ",
        informacionToInsert
      );
      const resultInsert = await addInformacion(informacionToInsert);
      if (resultInsert.err) {
        throw new Error(resultInsert.err.message);
      }
      handleCloseVentEmergenteConfInformacion();
      handleCloseVentEmergenteAddInformacion();
    }
  };
  const addInformacion = async (informacion) => {
    let insert = await insertInformacion(informacion);
    console.log(insert);
    //esto es solo de prueba para que se visualize momentaneamente el informacion agregado
    setDb([insert /* informacion */, ...db]);
    if (!!insert && Object.values(insert).length > 0) {
      setInformacionToInsert({});
    }

    return insert;
  };

  let getallInformacions = async () => {
    console.log("getallInformacions");
    let informacions = await getAllInformacions();
    console.log(informacions);
    setDb(informacions);
  };
  useEffect(() => {
    console.log("getallInformacions");

    getallInformacions();
  }, []);

  useEffect(() => {
    console.log(informacionToInsert);
    let errores = validationsForm(informacionToInsert);
    console.log(errores);
    console.log(Object.keys(errores).length);
    if (Object.keys(errores).length == 0) {
      setBandInsert(true);
    } else {
      setBandInsert(false);
    }
    //setBandInsert()
    if (informacionToInsert?.urlVideo?.length > 0) {
      console.log("Ejecutando handleInsert");
      toast.promise(handleInsert(), {
        loading: "Cargando",
        success: <b>Se agrego la información!</b>,
        error: <b>No se pudo agregar la información.</b>,
      });
    }
  }, [informacionToInsert]);

  let data = {
    db: db,
    columns: columns,
    informacionSelected: informacionSelected,
    showVentEmergenteEditInformacion: showVentEmergenteEditInformacion,
    setShowVentEmergenteEditInformacion: showVentEmergenteEditInformacion,
    informacionToInsert,
    bandInsert,
    idInformacion,
    showVentEmergenteAddInformacion,
    showVentEmergenteConfInformacion,
    bandLoader,
    dbSearch,
    showVentEmergenteDelete,
    patologiasxInformacionAdd,
    patologiasxInformacionEdit,
    categoriasxInformacionAdd,
    categoriasxInformacionEdit,
    handleChangeSelectInformacionFiltrar,
    handleChangeSelectCategoriasFiltrar,
    handleChangeSelectCategoriasInsert,
    handleChangeSelectCategorias,
    handleChangeSelectInsert,
    handleChangeSelect,
    setShowVentEmergenteDelete,
    handleSearch,
    handleCloseConfInsert,
    setShowVentEmergenteConfInformacion,
    handleCloseVentEmergenteConfInformacion,
    handleCloseVentEmergenteAddInformacion,
    setShowVentEmergenteAddInformacion,
    validationsForm,
    setBandInsert,
    handleChangeInputInsert,
    handleEditInformacion: handleEditInformacion,
    handleSeePacient: handleSeePacient,
    handleCloseVentEmergenteEditInformacion:
      handleCloseVentEmergenteEditInformacion,
    handleChangeInput,
    addInformacion,
    handleInsert,
    handleUpdate,
  };
  return (
    <InformacionContext.Provider value={data}>
      {" "}
      {children}{" "}
    </InformacionContext.Provider>
  );
};
export default InformacionContext;
