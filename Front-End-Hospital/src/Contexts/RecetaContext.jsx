import React, { createContext, useEffect, useState } from "react";

import { EditOutlined, DragOutlined } from "@ant-design/icons";
import { getAllRecetas, getPatologiaToRecetaAdd, getPatologiaToRecetaEdit, getRecetaById, insertReceta } from "../services/recetas-services";
const RecetaContext = createContext();
export const RecetaProvider = ({ children }) => {
  const [db, setDb] = useState([]);
  const [dbSearch, setDbSearch] = useState([])
  const [idReceta, setIdReceta] = useState(0);
  const [recetaSelected, setRecetaSelected] = useState({});
  const [patologiasxRecetasAdd, setPatologiasxRecetasAdd] = useState([])
  const [patologiasxRecetasEdit, setPatologiasxRecetasEdit] = useState([])
  

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

    if (!form?.nombre || form?.nombre?.length == 0) {
      errors.nombre = "El nombre es requerido";
    }

    if (!form?.porciones || form?.porciones?.length == 0) {
      errors.porciones = "Las  porciones es requerido";
    }

    if (!form?.calorias || form?.calorias?.length == 0) {
      errors.calorias = "Las calorias es requerida";
    }

    if (!form?.tiempo || form?.tiempo?.length == 0) {
      errors.tiempo = "El tiempo es requerido";
    }

    if (!form?.urlFoto || form?.urlFoto?.length == 0) {
      errors.urlFoto = "La urlFoto es requerido";
    }
    if (!form?.ingredientes || form?.ingredientes?.length == 0) {
      errors.ingredientes = "Los ingredientes son requeridos";
    }
    if (!form?.preparacion || form?.preparacion?.length == 0) {
      errors.preparacion = "La preparacion es requerida";
    }
   /*  if (!form?.idsPatologias || !form?.idsPatologias?.length == 0) {
      errors.idsPatologias = "Las idsPatologias es requerida";
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

  const handleChangeSelectInsert=(e)=>{

    let newValue = {
      ...recetaToInsert,
      idsPatologias: e,
    };
    console.log(newValue);
    setRecetaToInsert(newValue);
  }
  
  const handleChangeSelect=(e)=>{

    let newValue = {
      ...recetaSelected,
      idsPatologias: e
    };
    
    console.log(newValue);
    setRecetaSelected(newValue);

  }
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
    { field: "idReceta", headerName: "DNI", width: 150 },
    { field: "nombre", headerName: "Nombre", width: 180 },
    { field: "apellido", headerName: "Apellido", width: 350 },
  ];
 */

  const handleEditReceta = (receta) => {
    console.log("editando: ", receta);
    setIdReceta(receta.id);
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
    const getRecetabyidReceta = async () => {
      let receta = await getRecetaById(idReceta);
      setRecetaSelected(receta);
    };
    if (idReceta > 0) {
      getRecetabyidReceta();
    }
  }, [idReceta]);

  useEffect(()=>{
    const getpatologiatorecetaadd=async()=>{
      const patologias= await getPatologiaToRecetaAdd()
      if(patologias.length>0){
        let alToSelect = patologias.map((pat) => {
          return {
            label: pat.nombre ,
            value: pat.id,
          };
        });
      setPatologiasxRecetasAdd(alToSelect)
      }
    }
    getpatologiatorecetaadd()
    
  },[])
  
  useEffect(()=>{
    const getpatologiatorecetaedit=async()=>{
      const patologias= await getPatologiaToRecetaEdit()
      if(patologias.length>0){
        let alToSelect = patologias.map((pat) => {
          return {
            label: pat.nombre ,
            value: pat.id,
          };
        });
        setPatologiasxRecetasEdit(alToSelect)
      }
      
    }
    
  getpatologiatorecetaedit()
  },[])

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
      align: "center",
    },
    {
      title: "Porciones",
      dataIndex: "porciones",
      align: "center",
    },
    {
      title: "Calorias",
      dataIndex: "calorias",
      align: "center",
    },
    {
      title: "Tiempo",
      dataIndex: "tiempo",
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
            onClick={(e) => handleEditReceta(record)}
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
      receta
    );
    console.log(insert);
      //esto es solo de prueba para que se visualize momentaneamente el receta agregado
      setDb([insert/* receta */,...db])

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
    }else{
      setBandInsert(false);
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
    patologiasxRecetasAdd,
    patologiasxRecetasEdit,
    handleChangeSelectInsert,
    handleChangeSelect, 
    setPatologiasxRecetasAdd,
    setPatologiasxRecetasEdit,
    handleSearch,
    handleCloseConfInsert,
    setShowVentEmergenteConfReceta,
    handleCloseVentEmergenteConfReceta,
    handleCloseVentEmergenteAddReceta,
    setShowVentEmergenteAddReceta,
    validationsForm,
    setBandInsert,
    handleChangeInputInsert,
    handleEditReceta,
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
export default RecetaContext;
