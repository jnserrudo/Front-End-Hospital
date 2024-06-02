import React, { createContext, useEffect, useState } from "react";
import {
  getAllPacientes,
  getPacienteByNdocu,
  insertPaciente,
  updatePaciente,
} from "../services/pacientes-services";
import { EditOutlined, DragOutlined } from "@ant-design/icons";
const RecetaContext = createContext();
export const RecetaProvider = ({ children }) => {
  const [db, setDb] = useState([]);
  const [dbSearch, setDbSearch] = useState([])
  const [nomReceta, setNomReceta] = useState(0);
  const [recetaSelected, setRecetaSelected] = useState({});

  const [showVentEmergenteEditReceta, setShowVentEmergenteEditReceta] =
    useState(false);
    const [showVentEmergenteAddReceta, setShowVentEmergenteAddReceta] =
    useState(false);
  const [recetaToInsert, setRecetaToInsert] = useState({});
  const [bandInsert, setBandInsert] = useState(false);

  const [showVentEmergenteConfReceta, setShowVentEmergenteConfReceta] = useState(false);

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


  const handleCloseVentEmergenteEditReceta = () => {
    setShowVentEmergenteEditReceta(false);
  };

  const handleCloseVentEmergenteAddReceta = () => {
    setShowVentEmergenteAddReceta(false);
  };

  const handleCloseVentEmergenteConfReceta = () => {
    setShowVentEmergenteConfReceta(false);
  };

  const handleCloseConfInsert=async()=>{
    //se confirmo que se agregara el Receta
    setBandLoader(true)
    await handleInsert()
   
    setRecetaToInsert({})
    setBandInsert(false)
    setBandLoader(false)
    //de alguna manera actualizar la tabla para que se pueda ver al nuevo Receta
  
  }

  const handleChangeInputInsert = (e) => {
    console.log("name: ", e.target.name, " value: ", e.target.value);

    let newValue = {
      ...recetaToInsert,
      [e.target.name]: e.target.value,
    };
    console.log(newValue);
    setRecetaToInsert(newValue);
  };

  const handleChangeInput = (e) => {
    console.log("name: ", e.target.name, " value: ", e.target.value);

    let newValue = {
      ...recetaSelected,
      [e.target.name]: e.target.value,
    };
    console.log(newValue);
    setRecetaSelected(newValue);
  };

  /* const columns=[
    { field: "nomReceta", headerName: "DNI", width: 150 },
    { field: "nombre", headerName: "Nombre", width: 180 },
    { field: "apellido", headerName: "Apellido", width: 350 },
  ];
 */

  const handleEditPacient = (receta) => {
    console.log("editando: ", receta);
    setnomRecetaReceta(receta.dni);
    setShowVentEmergenteEditReceta(true);
  };

  const handleUpdate=async(receta)=>{
      
    const actualizarReceta=async(receta)=>{
      console.log("se esta por actualizar este receta: ",receta)
      const update=await updateReceta(receta)
      console.log("update: ",update)
    }
    
      //activar loader
      setBandLoader(true);
      let resupdate=await  actualizarReceta(receta)
      getallRecetas();

      console.log(resupdate)
      setBandLoader(false);
    

  }

  const handleSeePacient = (receta) => {
    console.log("viendo: ", receta);
  };

  useEffect(() => {
    const getRecetabynomReceta = async () => {
      let receta = await getRecetaBynomReceta(nomRecetaReceta);
      setRecetaSelected(receta);
    };
    if (nomRecetaReceta > 0) {
      getRecetabynomReceta();
    }
  }, [nomRecetaReceta]);

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
      console.log(" se esta por insertar el receta: ", recetaToInsert)
      await addReceta(recetaToInsert);
      handleCloseVentEmergenteConfReceta()
      handleCloseVentEmergenteAddReceta()
    }
  };
  const addReceta = async (receta) => {
    let insert = await insertReceta(
      receta.dni,
      receta.obraSocial,
      receta.plan,
      receta.domicilio,
      receta.nroAfiliado,
      receta.telefono,
      receta.vacunas,
      receta.afp,
      receta.app,
      receta.alergias
    );
    console.log(insert);
      //esto es solo de prueba para que se visualize momentaneamente el receta agregado
      setDb([receta,...db])

    return insert;
  };

  let getallRecetas = async () => {
    let recetas = await getAllRecetas();
    console.log(recetas);
    setDb(recetas);
  };
  useEffect(() => {
    

    getallRecetas();
  }, []);

  useEffect(() => {
    let errores = validationsForm(recetaToInsert);
    console.log(errores);
    console.log(Object.keys(errores).length);
    if (Object.keys(errores).length == 0) {
      setBandInsert(true);
    }
    //setBandInsert()
  }, [recetaToInsert]);

  let data = {
    db: db,
    columns: columns,
    recetaSelected: recetaSelected,
    showVentEmergenteEditReceta: showVentEmergenteEditReceta,
    setShowVentEmergenteEditReceta: showVentEmergenteEditReceta,
    recetaToInsert,
    bandInsert,
    showVentEmergenteAddReceta, 
    showVentEmergenteConfReceta, 
    bandLoader,
    dbSearch,
    handleSearch,
    handleCloseConfInsert,
    setShowVentEmergenteConfReceta,
    handleCloseVentEmergenteConfReceta,
    handleCloseVentEmergenteAddReceta,
    setShowVentEmergenteAddReceta,
    validationsForm,
    setBandInsert,
    handleChangeInputInsert,
    handleEditPacient: handleEditPacient,
    handleSeePacient: handleSeePacient,
    handleCloseVentEmergenteEditReceta: handleCloseVentEmergenteEditReceta,
    handleChangeInput,
    addReceta,
    handleInsert,
    handleUpdate
  };
  return (
    <RecetaContext.Provider value={data}>
      {" "}
      {children}{" "}
    </RecetaContext.Provider>
  );
};
export default PacientesContext;
