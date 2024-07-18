import React, { createContext, useEffect, useState } from "react";
import {
  getAllPatologias,
  getPatologiaById,
  insertPatologia,
  updatePatologia,
} from "../services/patologia-services";
import { EditOutlined, DragOutlined ,DeleteOutlined} from "@ant-design/icons";
const PatologiaContext = createContext();
export const PatologiaProvider = ({ children }) => {
  const [db, setDb] = useState([]);
  const [dbSearch, setDbSearch] = useState([])
  const [idPatologia, setIdPatologia] = useState(0);
  const [patologiaSelected, setPatologiaSelected] = useState({});
  const [showVentEmergenteDelete, setShowVentEmergenteDelete] =
  useState(false);
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


  const handleCloseVentEmergenteEditPatologia = () => {
    setShowVentEmergenteEditPatologia(false);
    setIdPatologia(0)
  };

  const handleCloseVentEmergenteAddPatologia = () => {
    setShowVentEmergenteAddPatologia(false);
    setPatologiaToInsert({})

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

  const handleEditPatologia = (patologia) => {
    console.log("editando: ", patologia);
    setIdPatologia(patologia.id);
    setShowVentEmergenteEditPatologia(true);
  };

  const handleDelete=async(record)=>{
    setIdPatologia(record.id)
    setShowVentEmergenteDelete(true)


  }

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
    //este useEffect lo que hara es que traera las recetas luego de una posible eliminacion
    //posible porque cuando sea falso, se habra cerrado la ventana de confirmacion del delete y traera las recetas
    if (!showVentEmergenteDelete) {
      getallPatologias()
    }
  }, [showVentEmergenteDelete]);

  useEffect(() => {
    const getPatologiabyId = async () => {
      let patologia = await getPatologiaById(idPatologia);
      setPatologiaSelected(patologia);
    };
    if (idPatologia > 0) {
      getPatologiabyId();
    }
  }, [idPatologia]);

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
            onClick={(e) => handleEditPatologia(record)}
          /> */}
          <DragOutlined
            className="icon_accion"
            onClick={(e) => handleEditPatologia(record)}
          />
          <DeleteOutlined
            className="icon_accion"
            onClick={(e) => handleDelete(record)} />
        
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
    let insert = await insertPatologia(patologia);
    console.log(insert);
      //esto es solo de prueba para que se visualize momentaneamente el patologia agregado
      setDb([insert/* patologia */,...db])

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
    console.log(patologiaToInsert)
    let errores = validationsForm(patologiaToInsert);
    console.log(errores);
    console.log(Object.keys(errores).length);
    if (Object.keys(errores).length == 0) {
      setBandInsert(true);
    }else{
      setBandInsert(false);
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
    showVentEmergenteDelete, 
    idPatologia, 
    setIdPatologia,
    setShowVentEmergenteDelete,
    handleSearch,
    handleCloseConfInsert,
    setShowVentEmergenteConfPatologia,
    handleCloseVentEmergenteConfPatologia,
    handleCloseVentEmergenteAddPatologia,
    setShowVentEmergenteAddPatologia,
    validationsForm,
    setBandInsert,
    handleChangeInputInsert,
    handleEditPatologia: handleEditPatologia,
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
export default PatologiaContext;
