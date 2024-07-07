import React, { createContext, useEffect, useState } from "react";
import {
  getAllEjercicios,
  getEjercicioById,
  insertEjercicio,
  updateEjercicio,
} from "../services/ejercicio-services";
import { EditOutlined, DragOutlined } from "@ant-design/icons";
const EjercicioContext = createContext();
export const EjercicioProvider = ({ children }) => {
  const [db, setDb] = useState([]);
  const [dbSearch, setDbSearch] = useState([])
  const [idEjercicio, setIdEjercicio] = useState(0);
  const [ejercicioSelected, setEjercicioSelected] = useState({});

  const [showVentEmergenteEditEjercicio, setShowVentEmergenteEditEjercicio] =
    useState(false);
    const [showVentEmergenteAddEjercicio, setShowVentEmergenteAddEjercicio] =
    useState(false);
  const [ejercicioToInsert, setEjercicioToInsert] = useState({});
  const [bandInsert, setBandInsert] = useState(false);

  const [showVentEmergenteConfEjercicio, setShowVentEmergenteConfEjercicio] = useState(false);

  const [bandLoader, setBandLoader] = useState(false)

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

    console.log(errors)

    return errors;
  };

  const handleSearch=(busq)=>{
    console.log(busq)
    console.log(db)
    let coincidencias=[]
    for(let pac of db){
      for(let x of Object.values(pac) ){
        if(x.toString().toLowerCase().includes(busq.toLowerCase())){
          console.log(x)
          coincidencias.push(pac)
          break;
        }
      }
    }

    setDbSearch(coincidencias)
    console.log("coincidencias: ",coincidencias)
  }


  const handleCloseVentEmergenteEditEjercicio = () => {
    setShowVentEmergenteEditEjercicio(false);
    setIdEjercicio(0)
  };

  const handleCloseVentEmergenteAddEjercicio = () => {
    setShowVentEmergenteAddEjercicio(false);
    setEjercicioToInsert({})

  };

  const handleCloseVentEmergenteConfEjercicio = () => {
    setShowVentEmergenteConfEjercicio(false);
  };

  const handleCloseConfInsert=async()=>{
    //se confirmo que se agregara el Ejercicio
    setBandLoader(true)
    await handleInsert()
   
    setEjercicioToInsert({})
    setBandInsert(false)
    setBandLoader(false)
    //de alguna manera actualizar la tabla para que se pueda ver al nuevo Ejercicio
  
  }

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

  const handleUpdate=async(ejercicio)=>{
      
    const actualizarEjercicio=async(ejercicio)=>{
      console.log("se esta por actualizar este ejercicio: ",ejercicio)
      const update=await updateEjercicio(ejercicio)
      console.log("update: ",update)
    }
    
      //activar loader
      setBandLoader(true);
      let resupdate=await  actualizarEjercicio(ejercicio)
      getallEjercicios();

      console.log(resupdate)
      setBandLoader(false);
    

  }

  const handleSeePacient = (ejercicio) => {
    console.log("viendo: ", ejercicio);
  };

  useEffect(() => {
    const getEjerciciobyId = async () => {
      let ejercicio = await getEjercicioById(idEjercicio);
      setEjercicioSelected(ejercicio);
    };
    if (idEjercicio > 0) {
      getEjerciciobyId();
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
        </div>
      ),
    },
  ];

  const handleInsert = async() => {
    if (bandInsert) {
      //validar para insert
      console.log(" se esta por insertar el ejercicio: ", ejercicioToInsert)
      await addEjercicio(ejercicioToInsert);
      handleCloseVentEmergenteConfEjercicio()
      handleCloseVentEmergenteAddEjercicio()
    }
  };
  const addEjercicio = async (ejercicio) => {
    let insert = await insertEjercicio(ejercicio);
    console.log(insert);
      //esto es solo de prueba para que se visualize momentaneamente el ejercicio agregado
      setDb([insert/* ejercicio */,...db])

    return insert;
  };

  let getallEjercicios = async () => {
    console.log("getallEjercicios")
    
    let ejercicios = await getAllEjercicios();
    console.log(ejercicios);
    setDb(ejercicios);
  };
  useEffect(() => {
    
    console.log("getallEjercicios")

    getallEjercicios();
  }, []);

  useEffect(() => {
    console.log(ejercicioToInsert)
    let errores = validationsForm(ejercicioToInsert);
    console.log(errores);
    console.log(Object.keys(errores).length);
    if (Object.keys(errores).length == 0) {
      setBandInsert(true);
    }else{
      setBandInsert(false);
    }
    //setBandInsert()
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
    handleCloseVentEmergenteEditEjercicio: handleCloseVentEmergenteEditEjercicio,
    handleChangeInput,
    addEjercicio,
    handleInsert,
    handleUpdate
  };
  return (
    <EjercicioContext.Provider value={data}>
      {" "}
      {children}{" "}
    </EjercicioContext.Provider>
  );
};
export default EjercicioContext;