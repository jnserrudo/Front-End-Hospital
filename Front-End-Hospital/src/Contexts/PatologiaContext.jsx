import React, { createContext, useEffect, useState } from "react";
import {
  getAllPacientes,
  getPacienteByNdocu,
  insertPaciente,
  updatePaciente,
} from "../services/pacientes-services";
import { EditOutlined, DragOutlined } from "@ant-design/icons";
const PatologiaContext = createContext();
export const PatologiaProvider = ({ children }) => {
  const [db, setDb] = useState([]);
  const [dbSearch, setDbSearch] = useState([])
  const [nomPatologia, setNomPatologia] = useState(0);
  const [patologiaSelected, setPatologiaSelected] = useState({});

  const [showVentEmergenteEditPatologia, setShowVentEmergenteEditPatologia] =
    useState(false);
    const [showVentEmergenteAddPatologia, setShowVentEmergenteAddPatologia] =
    useState(false);
  const [patologiaToInsert, setPatologiaToInsert] = useState({});
  const [bandInsert, setBandInsert] = useState(false);

  const [showVentEmergenteConfPatologia, setShowVentEmergenteConfPatologia] = useState(false);

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

    if (!form?.dni && form?.dni <= 0) {
      errors.lugar = "El documento es requerido";
    }
    if (!form?.nombre && !form?.nombre?.length == 0) {
      errors.nombre = "El nombre es requerido";
    }

    if (!form?.apellido && !form?.apellido?.length == 0) {
      errors.apellido = "El apellido es requerido";
    }

    if (!form?.obraSocial && !form?.obraSocial?.length == 0) {
      errors.obraSocial = "La obra social es requerida";
    }

    if (!form?.plan && !form?.plan?.length == 0) {
      errors.plan = "El plan es requerido";
    }

    if (!form?.domicilio) {
      errors.domicilio = "El domicilio es requerido";
    }

    if (!form?.celular) {
      errors.celular = "El telefono es requerido";
    }
    if (!form?.nroAfiliado&&!form?.nroAfiliado<=0) {
      errors.celular = "El telefono es requerido";
    }
/* 
    if (!form?.vacunas) {
      errors.vacunas = "Las vacunas son requeridas";
    }

    if (!form?.afp) {
      errors.afp = "Las afp son requeridas";
    }

    if (!form?.app) {
      errors.app = "Las app son requeridas";
    } */
    /* if (!form?.alergias) {
      errors.alergias = "Las alergias son requeridas";
    } */

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


  const handleCloseVentEmergenteEditPatologia = () => {
    setShowVentEmergenteEditPatologia(false);
  };

  const handleCloseVentEmergenteAddPatologia = () => {
    setShowVentEmergenteAddPatologia(false);
  };

  const handleCloseVentEmergenteConfPatologia = () => {
    setShowVentEmergenteConfPatologia(false);
  };

  const handleCloseConfInsert=async()=>{
    //se confirmo que se agregara el Patologia
    setBandLoader(true)
    await handleInsert()
   
    setPatologiaToInsert({})
    setBandInsert(false)
    setBandLoader(false)
    //de alguna manera actualizar la tabla para que se pueda ver al nuevo Patologia
  
  }

  const handleChangeInputInsert = (e) => {
    console.log("name: ", e.target.name, " value: ", e.target.value);

    let newValue = {
      ...patologiaToInsert,
      [e.target.name]: e.target.value,
    };
    console.log(newValue);
    setPatologiaToInsert(newValue);
  };

  const handleChangeInput = (e) => {
    console.log("name: ", e.target.name, " value: ", e.target.value);

    let newValue = {
      ...patologiaSelected,
      [e.target.name]: e.target.value,
    };
    console.log(newValue);
    setPatologiaSelected(newValue);
  };

  /* const columns=[
    { field: "nomPatologia", headerName: "DNI", width: 150 },
    { field: "nombre", headerName: "Nombre", width: 180 },
    { field: "apellido", headerName: "Apellido", width: 350 },
  ];
 */

  const handleEditPacient = (patologia) => {
    console.log("editando: ", patologia);
    setnomPatologiaPatologia(patologia.dni);
    setShowVentEmergenteEditPatologia(true);
  };

  const handleUpdate=async(patologia)=>{
      
    const actualizarPatologia=async(patologia)=>{
      console.log("se esta por actualizar este patologia: ",patologia)
      const update=await updatePatologia(patologia)
      console.log("update: ",update)
    }
    
      //activar loader
      setBandLoader(true);
      let resupdate=await  actualizarPatologia(patologia)
      getallPatologias();

      console.log(resupdate)
      setBandLoader(false);
    

  }

  const handleSeePacient = (patologia) => {
    console.log("viendo: ", patologia);
  };

  useEffect(() => {
    const getPatologiabynomPatologia = async () => {
      let patologia = await getPatologiaBynomPatologia(nomPatologiaPatologia);
      setPatologiaSelected(patologia);
    };
    if (nomPatologiaPatologia > 0) {
      getPatologiabynomPatologia();
    }
  }, [nomPatologiaPatologia]);

  const columns = [
    {
      title: "DNI",
      dataIndex: "dni",
      render: (text) => <a>{text}</a>,
      align: "center",
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      align: "center",
    },
    {
      title: "Apellido",
      dataIndex: "apellido",
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
            onClick={(e) => handleEditPacient(record)}
          /> */}
          <DragOutlined
            className="icon_accion"
            onClick={(e) => handleEditPacient(record)}
          />
        </div>
      ),
    },
  ];

  const handleInsert = async() => {
    if (bandInsert) {
      //validar para insert
      console.log(" se esta por insertar el patologia: ", patologiaToInsert)
      await addPatologia(patologiaToInsert);
      handleCloseVentEmergenteConfPatologia()
      handleCloseVentEmergenteAddPatologia()
    }
  };
  const addPatologia = async (patologia) => {
    let insert = await insertPatologia(
      patologia.dni,
      patologia.obraSocial,
      patologia.plan,
      patologia.domicilio,
      patologia.nroAfiliado,
      patologia.telefono,
      patologia.vacunas,
      patologia.afp,
      patologia.app,
      patologia.alergias
    );
    console.log(insert);
      //esto es solo de prueba para que se visualize momentaneamente el patologia agregado
      setDb([patologia,...db])

    return insert;
  };

  let getallPatologias = async () => {
    let patologias = await getAllPatologias();
    console.log(patologias);
    setDb(patologias);
  };
  useEffect(() => {
    

    getallPatologias();
  }, []);

  useEffect(() => {
    let errores = validationsForm(patologiaToInsert);
    console.log(errores);
    console.log(Object.keys(errores).length);
    if (Object.keys(errores).length == 0) {
      setBandInsert(true);
    }
    //setBandInsert()
  }, [patologiaToInsert]);

  let data = {
    db: db,
    columns: columns,
    patologiaSelected: patologiaSelected,
    showVentEmergenteEditPatologia: showVentEmergenteEditPatologia,
    setShowVentEmergenteEditPatologia: showVentEmergenteEditPatologia,
    patologiaToInsert,
    bandInsert,
    showVentEmergenteAddPatologia, 
    showVentEmergenteConfPatologia, 
    bandLoader,
    dbSearch,
    handleSearch,
    handleCloseConfInsert,
    setShowVentEmergenteConfPatologia,
    handleCloseVentEmergenteConfPatologia,
    handleCloseVentEmergenteAddPatologia,
    setShowVentEmergenteAddPatologia,
    validationsForm,
    setBandInsert,
    handleChangeInputInsert,
    handleEditPacient: handleEditPacient,
    handleSeePacient: handleSeePacient,
    handleCloseVentEmergenteEditPatologia: handleCloseVentEmergenteEditPatologia,
    handleChangeInput,
    addPatologia,
    handleInsert,
    handleUpdate
  };
  return (
    <PatologiaContext.Provider value={data}>
      {" "}
      {children}{" "}
    </PatologiaContext.Provider>
  );
};
export default PacientesContext;
