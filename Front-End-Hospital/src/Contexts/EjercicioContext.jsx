import { RowActions } from "../Components/RowActions";
import React, { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { notify } from "../ui/notify";
import {
  getAllEjercicios,
  getAllEjerciciosFiltro,
  getCategoriaToEjercicioAdd,
  getCategoriaToEjercicioEdit,
  getEjercicioById,
  getPatologiaToEjercicioAdd,
  getPatologiaToEjercicioEdit,
  insertEjercicio,
  updateEjercicio,
} from "../services/ejercicio-services";
import { EditOutlined, DragOutlined, DeleteOutlined, StopOutlined } from "@ant-design/icons";
const EjercicioContext = createContext();
export const EjercicioProvider = ({ children }) => {
  const [db, setDb] = useState([]);
  const [dbSearch, setDbSearch] = useState([]);
  const [idEjercicio, setIdEjercicio] = useState(0);
  const [ejercicioSelected, setEjercicioSelected] = useState({});

  const [showVentEmergenteDelete, setShowVentEmergenteDelete] = useState(false);
  const [showVentEmergenteEditEjercicio, setShowVentEmergenteEditEjercicio] =
    useState(false);
  const [showVentEmergenteAddEjercicio, setShowVentEmergenteAddEjercicio] =
    useState(false);
  const [ejercicioToInsert, setEjercicioToInsert] = useState({});
  const [bandInsert, setBandInsert] = useState(false);

  const [showVentEmergenteConfEjercicio, setShowVentEmergenteConfEjercicio] =
    useState(false);

  const [bandLoader, setBandLoader] = useState(false);

  // Estados de loading
  const [loading, setLoading] = useState(true); // true: evita mostrar «vacío» antes de cargar
  const [loadingAction, setLoadingAction] = useState(false);

  const [patologiasxEjercicioAdd, setPatologiasxEjercicioAdd] = useState([]);
  const [patologiasxEjercicioEdit, setPatologiasxEjercicioEdit] = useState([]);

  const [categoriasxEjercicioAdd, setCategoriasxEjercicioAdd] = useState([]);
  const [categoriasxEjercicioEdit, setCategoriasxEjercicioEdit] = useState([]);



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
  const handleCloseVentEmergenteEditEjercicio = () => {
    setShowVentEmergenteEditEjercicio(false);
    setIdEjercicio(0);
  };

  const handleCloseVentEmergenteAddEjercicio = () => {
    setShowVentEmergenteAddEjercicio(false);
    //setEjercicioToInsert({})
  };

  const handleCloseVentEmergenteConfEjercicio = () => {
    setShowVentEmergenteConfEjercicio(false);
  };

  const handleCloseConfInsert = async () => {
    //se confirmo que se agregara el Ejercicio
    setBandLoader(true);
    const resultInsert = await handleInsert();
    if (resultInsert.err) {
      throw new Error(resultInsert.err.message);
    }
    //setEjercicioToInsert({})
    setBandInsert(false);
    setBandLoader(false);
    //de alguna manera actualizar la tabla para que se pueda ver al nuevo Ejercicio
  };

  const handleChangeInputInsert = (e) => {
    console.log("name: ", e.target.name, " value: ", e.target.value);

    let newValue = {
      ...ejercicioToInsert,
      [e.target.name]: e.target.value,
    };
    console.log(newValue);
    setEjercicioToInsert(newValue);
  };

  const handleChangeInput = (e) => {
    console.log("name: ", e.target.name, " value: ", e.target.value);

    let newValue = {
      ...ejercicioSelected,
      [e.target.name]: e.target.value,
    };
    console.log(newValue);
    setEjercicioSelected(newValue);
  };

  /* const columns=[
    { field: "nomEjercicio", headerName: "DNI", width: 150 },
    { field: "nombre", headerName: "Nombre", width: 180 },
    { field: "apellido", headerName: "Apellido", width: 350 },
  ];
 */

  const handleEditEjercicio = (ejercicio) => {
    console.log("editando: ", ejercicio);
    setIdEjercicio(ejercicio.id);
    setShowVentEmergenteEditEjercicio(true);
  };

  const handleChangeSelectInsert = (e) => {
    let newValue = {
      ...ejercicioToInsert,
      idsPatologias: e,
    };
    console.log(newValue);
    setEjercicioToInsert(newValue);
  };


  const handleChangeSelectEjercicioFiltrar = (e) => {
    //aca aplicamos la logica para poder actualizar la db y poder
    //mostrar esto en la seccion de ejercicio
    let idsPatologias = e;
    setIdsPatologiasFiltro(idsPatologias);
  };

  const handleChangeSelect = (e) => {
    let newValue = {
      ...ejercicioSelected,
      idsPatologias: e,
    };

    console.log(newValue);
    setEjercicioSelected(newValue);
  };

  const handleChangeSelectCategoriasInsert = (e) => {
    let newValue = {
      ...ejercicioToInsert,
      idsCategorias: e,
    };
    console.log(newValue);
    setEjercicioToInsert(newValue);
  };

  const handleChangeSelectCategoriasFiltrar = (e) => {
    //aca aplicamos la logica para poder actualizar la db y poder
    //mostrar esto en la seccion de informacion
    let idsCategorias = e;
    setIdsCategoriasFiltro(idsCategorias);
  };

  const handleChangeSelectCategorias = (e) => {
    let newValue = {
      ...ejercicioSelected,
      idsCategorias: e,
    };
    console.log(newValue);
    setEjercicioSelected(newValue);
  };

  const handleDelete = async (record) => {
    console.log(record.id);
    setIdEjercicio(record.id);
    setShowVentEmergenteDelete(true);
  };

  const handleUpdate = async (ejercicio) => {
    setLoadingAction(true);
    try {
      console.log("se esta por actualizar este ejercicio: ", ejercicio);
      const update = await updateEjercicio(ejercicio);
      console.log("update: ", update);
      notify.success(`Ejercicio «${ejercicio?.nombre || ""}» actualizado. Los pacientes ya ven los cambios.`);
      await getallEjercicios();
      handleCloseVentEmergenteEditEjercicio();
    } catch (error) {
      console.error("Error al actualizar ejercicio:", error);
      throw error;
    } finally {
      setLoadingAction(false);
    }
  };

  const handleSeePacient = (ejercicio) => {
    console.log("viendo: ", ejercicio);
  };


  useEffect(() => {
    const getejerfiltro = async (idsPatologiasFiltro, idsCategoriasFiltro) => {
      const ejercicios = await getAllEjerciciosFiltro({
        idsPatologias:idsPatologiasFiltro,
        idsCategorias:idsCategoriasFiltro,
      });
      console.log(ejercicios);
      setDb(ejercicios);
    };

    console.log(
      "idsPatologiasFiltro, idsCategoriasFiltro",
      idsPatologiasFiltro,
      idsCategoriasFiltro
    );
    if (idsPatologiasFiltro.length > 0 || idsCategoriasFiltro.length > 0) {
      getejerfiltro(idsPatologiasFiltro, idsCategoriasFiltro);
    } else {
      getallEjercicios();
    }
  }, [idsPatologiasFiltro, idsCategoriasFiltro]);

  useEffect(() => {
    //este useEffect lo que hara es que traera las recetas luego de una posible eliminacion
    //posible porque cuando sea falso, se habra cerrado la ventana de confirmacion del delete y traera las recetas
    if (!showVentEmergenteDelete) {
      getallEjercicios();
    }
  }, [showVentEmergenteDelete]);

  useEffect(() => {
    const getEjerciciobyId = async () => {
      let ejercicio = await getEjercicioById(idEjercicio);
      setEjercicioSelected(ejercicio);
    };
    if (idEjercicio > 0) {
      getEjerciciobyId();
    }
  }, [idEjercicio]);

  useEffect(() => {
    const getpatologiatoejercicioadd = async () => {
      const patologias = await getPatologiaToEjercicioAdd();
      console.log("trae patologias para ejercicio", patologias);
      if (patologias.length > 0) {
        let alToSelect = patologias.map((pat) => {
          return {
            label: pat.nombre,
            value: pat.id,
          };
        });
        setPatologiasxEjercicioAdd(alToSelect);
      }
    };

    const getcategoriatoejercicioadd = async () => {
      const categorias = await getCategoriaToEjercicioAdd();
      console.log("trae categorias para info", categorias);
      if (categorias.length > 0) {
        let alToSelect = categorias.map((pat) => {
          return {
            label: pat.nombre,
            value: pat.id,
          };
        });
        setCategoriasxEjercicioAdd(alToSelect);
      }
    };

    getpatologiatoejercicioadd();
    getcategoriatoejercicioadd();
  }, [db]);

  useEffect(() => {
    const getpatologiatoejercicioedit = async () => {
      const patologias = await getPatologiaToEjercicioEdit(idEjercicio);
      console.log(
        "trae patologias para ejercicio edit",
        idEjercicio,
        patologias
      );

      if (Object.values(patologias).length > 0) {
        console.log(patologias);
        setPatologiasxEjercicioEdit(patologias);
        /* let alToSelect = patologias.map((pat) => {
          return {
            label: pat.nombre,
            value: pat.id,
          };
        });
        console.log(alToSelect)
        setPatologiasxEjercicioEdit(alToSelect) */
      }
    };

    const getcategoriatoejercicioedit = async () => {
      const categorias = await getCategoriaToEjercicioEdit(idEjercicio);
      console.log(
        "trae categorias para ejercicios edit",
        idEjercicio,
        categorias
      );

      if (Object.values(categorias).length > 0) {
        console.log(categorias);
        setCategoriasxEjercicioEdit(categorias);
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

    if (idEjercicio > 0) {
      getpatologiatoejercicioedit();
      getcategoriatoejercicioedit();
    }
  }, [idEjercicio]);

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
      title: "Descripción",
      dataIndex: "descripcion",
      align: "start",
    },

    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      render: (_, record) => (
        <RowActions
          actions={[
            { key: "edit", label: "Ver detalle y editar", icon: <EditOutlined />, onClick: () => handleEditEjercicio(record) },
            { key: "off", label: "Deshabilitar", icon: <StopOutlined />, danger: true, onClick: () => handleDelete(record) },
          ]}
        />
      ),
    },
  ];

  const handleInsert = async (customEjercicio = null) => {
    const dataToInsert = customEjercicio || ejercicioToInsert;
    if (bandInsert || customEjercicio) {
      setLoadingAction(true);
      try {
        console.log(" se esta por insertar el ejercicio: ", dataToInsert);
        await addEjercicio(dataToInsert);
        notify.success(`Ejercicio «${dataToInsert?.nombre || ""}» creado. Ya aparece en la sección Ejercicios.`);
        await getallEjercicios();
        handleCloseVentEmergenteConfEjercicio();
        handleCloseVentEmergenteAddEjercicio();
      } catch (error) {
        console.error("Error al crear ejercicio:", error);
        throw error;
      } finally {
        setLoadingAction(false);
      }
    } else {
      throw new Error("Faltan datos obligatorios: completá los campos marcados y volvé a intentar.");
    }
  };
  const addEjercicio = async (ejercicio) => {
    let insert = await insertEjercicio(ejercicio);
    console.log(insert);
    //esto es solo de prueba para que se visualize momentaneamente el ejercicio agregado
    setDb([insert /* ejercicio */, ...db]);
    if (!!insert && Object.values(insert).length > 0) {
      setEjercicioToInsert({});
    }

    return insert;
  };

  let getallEjercicios = async () => {
    setLoading(true);
    try {
      console.log("getallEjercicios");
      let ejercicios = await getAllEjercicios();
      console.log(ejercicios);
      setDb(ejercicios);
    } catch (error) {
      console.error("Error al cargar ejercicios:", error);
      notify.error(error, "No pudimos cargar ejercicios");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("getallEjercicios");

    getallEjercicios();
  }, []);

  useEffect(() => {
    console.log(ejercicioToInsert);
    let errores = validationsForm(ejercicioToInsert);
    console.log(errores);
    console.log(Object.keys(errores).length);
    if (Object.keys(errores).length == 0) {
      setBandInsert(true);
    } else {
      setBandInsert(false);
    }
  }, [ejercicioToInsert]);

  let data = {
    recargar: getallEjercicios,
    db: db,
    columns: columns,
    ejercicioSelected: ejercicioSelected,
    showVentEmergenteEditEjercicio: showVentEmergenteEditEjercicio,
    setShowVentEmergenteEditEjercicio: showVentEmergenteEditEjercicio,
    ejercicioToInsert,
    bandInsert,
    showVentEmergenteAddEjercicio,
    showVentEmergenteConfEjercicio,
    bandLoader,
    dbSearch,
    idEjercicio,
    showVentEmergenteDelete,
    loading,
    loadingAction,
    patologiasxEjercicioAdd,
    patologiasxEjercicioEdit,
    categoriasxEjercicioAdd,
    categoriasxEjercicioEdit,
    handleChangeSelectEjercicioFiltrar,
    handleChangeSelectCategoriasFiltrar,
    handleChangeSelectCategoriasInsert,
    handleChangeSelectCategorias,
    handleChangeSelectInsert,
    handleChangeSelect,
    setShowVentEmergenteDelete,
    handleSearch,
    handleCloseConfInsert,
    setShowVentEmergenteConfEjercicio,
    handleCloseVentEmergenteConfEjercicio,
    handleCloseVentEmergenteAddEjercicio,
    setShowVentEmergenteAddEjercicio,
    validationsForm,
    setBandInsert,
    handleChangeInputInsert,
    handleEditEjercicio: handleEditEjercicio,
    handleSeePacient: handleSeePacient,
    handleCloseVentEmergenteEditEjercicio:
      handleCloseVentEmergenteEditEjercicio,
    handleChangeInput,
    addEjercicio,
    handleInsert,
    handleUpdate,
  };
  return (
    <EjercicioContext.Provider value={data}>
      {" "}
      {children}{" "}
    </EjercicioContext.Provider>
  );
};
export default EjercicioContext;
