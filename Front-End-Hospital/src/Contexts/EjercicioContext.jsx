import React, { createContext, useEffect, useState } from "react";
import {
  getAllEjercicios,
  getEjercicioById,
  getPatologiaToEjercicioAdd,
  getPatologiaToEjercicioEdit,
  insertEjercicio,
  updateEjercicio,
} from "../services/ejercicio-services";
import { EditOutlined, DragOutlined, DeleteOutlined } from "@ant-design/icons";
const EjercicioContext = createContext();
export const EjercicioProvider = ({ children }) => {
  const [db, setDb] = useState([]);
  const [dbSearch, setDbSearch] = useState([]);
  const [idEjercicio, setIdEjercicio] = useState(0);
  const [ejercicioSelected, setEjercicioSelected] = useState({});

  const [showVentEmergenteDelete, setShowVentEmergenteDelete] = useState(false);
  const [
    showVentEmergenteEditEjercicio,
    setShowVentEmergenteEditEjercicio,
  ] = useState(false);
  const [showVentEmergenteAddEjercicio, setShowVentEmergenteAddEjercicio] =
    useState(false);
  const [ejercicioToInsert, setEjercicioToInsert] = useState({});
  const [bandInsert, setBandInsert] = useState(false);

  const [
    showVentEmergenteConfEjercicio,
    setShowVentEmergenteConfEjercicio,
  ] = useState(false);

  const [bandLoader, setBandLoader] = useState(false);

  const [patologiasxEjercicioAdd, setPatologiasxEjercicioAdd] = useState(
    []
  );
  const [patologiasxEjercicioEdit, setPatologiasxEjercicioEdit] = useState(
    []
  );

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

  const handleSearch=(busq,dataToSearch)=>{
    console.log(busq)
    console.log(dataToSearch)

    let coincidencias=[]
    for(let pac of dataToSearch){
      if(pac.nombre.toLowerCase().includes(busq.toLowerCase())){
        console.log(pac)
        coincidencias.push(pac)
        
      }
    }

    setDbSearch(coincidencias)
    console.log("coincidencias: ",coincidencias)
  }
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
    await handleInsert();

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

  const handleChangeSelect = (e) => {
    let newValue = {
      ...ejercicioSelected,
      idsPatologias: e,
    };

    console.log(newValue);
    setEjercicioSelected(newValue);
  };

  const handleDelete = async (record) => {
    console.log(record.id)
    setIdEjercicio(record.id);
    setShowVentEmergenteDelete(true);
  };

  const handleUpdate = async (ejercicio) => {
    const actualizarEjercicio = async (ejercicio) => {
      console.log("se esta por actualizar este ejercicio: ", ejercicio);
      const update = await updateEjercicio(ejercicio);
      console.log("update: ", update);
    };

    //activar loader
    setBandLoader(true);
    let resupdate = await actualizarEjercicio(ejercicio);
    getallEjercicios();

    console.log(resupdate);
    setBandLoader(false);
  };

  const handleSeePacient = (ejercicio) => {
    console.log("viendo: ", ejercicio);
  };

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
      console.log("trae patologias para ejercicio",patologias)
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
    getpatologiatoejercicioadd();
  }, []);

  useEffect(() => {
    const getpatologiatopatologiaedit = async () => {
      const patologias = await getPatologiaToEjercicioEdit(idEjercicio);
      console.log("trae patologias para ejercicio edit",idEjercicio ,patologias)

      if (Object.values(patologias).length > 0) {
        console.log(patologias)
        setPatologiasxEjercicioEdit(patologias)
        /* let alToSelect = patologias.map((pat) => {
          return {
            label: pat.nombre,
            value: pat.id,
          };
        });
        console.log(alToSelect)
        setPatologiasxEjercicioEdit(alToSelect) */;
      }
    };

    getpatologiatopatologiaedit();
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
            onClick={(e) => handleEditEjercicio(record)}
          /> */}
          <DragOutlined
            className="icon_accion"
            onClick={(e) => handleEditEjercicio(record)}
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
        " se esta por insertar el ejercicio: ",
        ejercicioToInsert
      );
      await addEjercicio(ejercicioToInsert);
      handleCloseVentEmergenteConfEjercicio();
      handleCloseVentEmergenteAddEjercicio();
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
    console.log("getallEjercicios");
    let ejercicios = await getAllEjercicios();
    console.log(ejercicios);
    setDb(ejercicios);
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
    //setBandInsert()
    if (ejercicioToInsert?.urlVideo?.length > 0) {
      console.log("Ejecutando handleInsert");
      handleInsert();
    }
  }, [ejercicioToInsert]);

  let data = {
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
    patologiasxEjercicioAdd,
    patologiasxEjercicioEdit,
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
