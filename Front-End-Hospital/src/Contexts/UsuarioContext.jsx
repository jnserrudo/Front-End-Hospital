import React, { createContext, useEffect, useState } from "react";
import {
  getAllPacientes,
  getPacienteByNdocu,
  insertPaciente,
  updatePaciente,
} from "../services/pacientes-services";
import { EditOutlined, DragOutlined } from "@ant-design/icons";
const UsuarioContext = createContext();
export const UsuarioProvider = ({ children }) => {
  const [db, setDb] = useState([]);
  const [dbSearch, setDbSearch] = useState([])
  const [nomUsuario, setNomUsuario] = useState(0);
  const [usuarioSelected, setUsuarioSelected] = useState({});

  const [showVentEmergenteEditUsuario, setShowVentEmergenteEditUsuario] =
    useState(false);
    const [showVentEmergenteAddUsuario, setShowVentEmergenteAddUsuario] =
    useState(false);
  const [usuarioToInsert, setUsuarioToInsert] = useState({});
  const [bandInsert, setBandInsert] = useState(false);

  const [showVentEmergenteConfUsuario, setShowVentEmergenteConfUsuario] = useState(false);

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


  const handleCloseVentEmergenteEditUsuario = () => {
    setShowVentEmergenteEditUsuario(false);
  };

  const handleCloseVentEmergenteAddUsuario = () => {
    setShowVentEmergenteAddUsuario(false);
  };

  const handleCloseVentEmergenteConfUsuario = () => {
    setShowVentEmergenteConfUsuario(false);
  };

  const handleCloseConfInsert=async()=>{
    //se confirmo que se agregara el Usuario
    setBandLoader(true)
    await handleInsert()
   
    setUsuarioToInsert({})
    setBandInsert(false)
    setBandLoader(false)
    //de alguna manera actualizar la tabla para que se pueda ver al nuevo Usuario
  
  }

  const handleChangeInputInsert = (e) => {
    console.log("name: ", e.target.name, " value: ", e.target.value);

    let newValue = {
      ...usuarioToInsert,
      [e.target.name]: e.target.value,
    };
    console.log(newValue);
    setUsuarioToInsert(newValue);
  };

  const handleChangeInput = (e) => {
    console.log("name: ", e.target.name, " value: ", e.target.value);

    let newValue = {
      ...usuarioSelected,
      [e.target.name]: e.target.value,
    };
    console.log(newValue);
    setUsuarioSelected(newValue);
  };

  /* const columns=[
    { field: "nomUsuario", headerName: "DNI", width: 150 },
    { field: "nombre", headerName: "Nombre", width: 180 },
    { field: "apellido", headerName: "Apellido", width: 350 },
  ];
 */

  const handleEditPacient = (usuario) => {
    console.log("editando: ", usuario);
    setnomUsuarioUsuario(usuario.dni);
    setShowVentEmergenteEditUsuario(true);
  };

  const handleUpdate=async(usuario)=>{
      
    const actualizarUsuario=async(usuario)=>{
      console.log("se esta por actualizar este usuario: ",usuario)
      const update=await updateUsuario(usuario)
      console.log("update: ",update)
    }
    
      //activar loader
      setBandLoader(true);
      let resupdate=await  actualizarUsuario(usuario)
      getallUsuarios();

      console.log(resupdate)
      setBandLoader(false);
    

  }

  const handleSeePacient = (usuario) => {
    console.log("viendo: ", usuario);
  };

  useEffect(() => {
    const getUsuariobynomUsuario = async () => {
      let usuario = await getUsuarioBynomUsuario(nomUsuarioUsuario);
      setUsuarioSelected(usuario);
    };
    if (nomUsuarioUsuario > 0) {
      getUsuariobynomUsuario();
    }
  }, [nomUsuarioUsuario]);

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
      console.log(" se esta por insertar el usuario: ", usuarioToInsert)
      await addUsuario(usuarioToInsert);
      handleCloseVentEmergenteConfUsuario()
      handleCloseVentEmergenteAddUsuario()
    }
  };
  const addUsuario = async (usuario) => {
    let insert = await insertUsuario(
      usuario.dni,
      usuario.obraSocial,
      usuario.plan,
      usuario.domicilio,
      usuario.nroAfiliado,
      usuario.telefono,
      usuario.vacunas,
      usuario.afp,
      usuario.app,
      usuario.alergias
    );
    console.log(insert);
      //esto es solo de prueba para que se visualize momentaneamente el usuario agregado
      setDb([usuario,...db])

    return insert;
  };

  let getallUsuarios = async () => {
    let usuarios = await getAllUsuarios();
    console.log(usuarios);
    setDb(usuarios);
  };
  useEffect(() => {
    

    getallUsuarios();
  }, []);

  useEffect(() => {
    let errores = validationsForm(usuarioToInsert);
    console.log(errores);
    console.log(Object.keys(errores).length);
    if (Object.keys(errores).length == 0) {
      setBandInsert(true);
    }
    //setBandInsert()
  }, [usuarioToInsert]);

  let data = {
    db: db,
    columns: columns,
    usuarioSelected: usuarioSelected,
    showVentEmergenteEditUsuario: showVentEmergenteEditUsuario,
    setShowVentEmergenteEditUsuario: showVentEmergenteEditUsuario,
    usuarioToInsert,
    bandInsert,
    showVentEmergenteAddUsuario, 
    showVentEmergenteConfUsuario, 
    bandLoader,
    dbSearch,
    handleSearch,
    handleCloseConfInsert,
    setShowVentEmergenteConfUsuario,
    handleCloseVentEmergenteConfUsuario,
    handleCloseVentEmergenteAddUsuario,
    setShowVentEmergenteAddUsuario,
    validationsForm,
    setBandInsert,
    handleChangeInputInsert,
    handleEditPacient: handleEditPacient,
    handleSeePacient: handleSeePacient,
    handleCloseVentEmergenteEditUsuario: handleCloseVentEmergenteEditUsuario,
    handleChangeInput,
    addUsuario,
    handleInsert,
    handleUpdate
  };
  return (
    <UsuarioContext.Provider value={data}>
      {" "}
      {children}{" "}
    </UsuarioContext.Provider>
  );
};
export default PacientesContext;
