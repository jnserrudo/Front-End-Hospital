import React, { createContext, useEffect, useState } from "react";
import {
  getAllPacientes,
  getPacienteById,
  getPacienteByNdocu,
  insertPaciente,
  updatePaciente,
} from "../services/paciente-services";
import { EditOutlined, DragOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { getAllPatologias } from "../services/patologia-services";
const PacienteContext = createContext();
export const PacienteProvider = ({ children }) => {
  const [db, setDb] = useState([]);
  const [dbSearch, setDbSearch] = useState([]);
  const [idPaciente, setIdPaciente] = useState("");

  const [dniPaciente, setDniPaciente] = useState("");
  const [rolPaciente, setRolPaciente] = useState(0);

  const [allRolesAdd, setAllRolesAdd] = useState([]);

  const [allRolesEdit, setAllRolesEdit] = useState([]);

  const [pacienteSelected, setPacienteSelected] = useState({});
  const [showVentEmergenteDelete, setShowVentEmergenteDelete] = useState(false);
  const [showVentEmergenteEditPaciente, setShowVentEmergenteEditPaciente] =
    useState(false);
  const [showVentEmergenteAddPaciente, setShowVentEmergenteAddPaciente] =
    useState(false);
  const [pacienteToInsert, setPacienteToInsert] = useState({});
  const [bandInsert, setBandInsert] = useState(false);

  const [showVentEmergenteConfPaciente, setShowVentEmergenteConfPaciente] =
    useState(false);

  const [patologiasToPacienteAdd, setPatologiasToPacienteAdd] = useState([]);

  const [patologiasToPacienteEdit, setPatologiasToPacienteEdit] = useState([]);

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

    if (!form?.dni || form?.dni?.length == 0) {
      errors.dni = "El dni es requerido";
    }
    if (!form?.nombre || form?.nombre?.length == 0) {
      errors.nombre = "La nombre es requerida";
    }

    if (!form?.apellido || form?.apellido?.length == 0) {
      errors.apellido = "El apellido es requerido";
    }
    if (!form?.paciente || form?.paciente?.length == 0) {
      errors.paciente = "EL paciente es requerida";
    }

    if (!form?.password || form?.password?.length == 0) {
      errors.password = "El password es requerido";
    }
    if (!form?.idRol || form?.idRol?.length == 0) {
      errors.idRol = "El idRol es requerida";
    }

    if (form?.idRol == 3) {
      if (!form?.idsPatologias || form?.idsPatologias?.length == 0) {
        errors.idsPatologias = "El idPatologias es requerido";
      }
    }

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

  const handleCloseVentEmergenteEditPaciente = () => {
    setShowVentEmergenteEditPaciente(false);
    setIdPaciente(0);
  };

  const handleCloseVentEmergenteAddPaciente = () => {
    setShowVentEmergenteAddPaciente(false);
    setPacienteToInsert({});
  };

  const handleCloseVentEmergenteConfPaciente = () => {
    setShowVentEmergenteConfPaciente(false);
  };

  const handleCloseConfInsert = async () => {
    //se confirmo que se agregara el Paciente
    setBandLoader(true);
    await handleInsert();

    setPacienteToInsert({});
    setBandInsert(false);
    setBandLoader(false);
    //de alguna manera actualizar la tabla para que se pueda ver al nuevo Paciente
  };

  const handleChangeInputInsert = (e) => {
    console.log("name: ", e.target.name, " value: ", e.target.value);

    let newValue = {
      ...pacienteToInsert,
      [e.target.name]: e.target.value,
    };
    console.log(newValue);
    setPacienteToInsert(newValue);
  };

  const handleChangeInput = (e) => {
    console.log("name: ", e.target.name, " value: ", e.target.value);

    let newValue = {
      ...pacienteSelected,
      [e.target.name]: e.target.value,
    };
    console.log(newValue);
    setPacienteSelected(newValue);
  };

  /* const columns=[
    { field: "nomPaciente", headerName: "DNI", width: 150 },
    { field: "nombre", headerName: "Nombre", width: 180 },
    { field: "apellido", headerName: "Apellido", width: 350 },
  ];
 */

  const handleChangeSelectRolInsert = (e) => {
    let newValue = {
      ...pacienteToInsert,
      idRol: e,
    };
    console.log(newValue);
    setPacienteToInsert(newValue);
  };
  const handleChangeSelectInsert = (e) => {
    let newValue = {
      ...pacienteToInsert,
      idsPatologias: e,
    };
    console.log(newValue);
    setPacienteToInsert(newValue);
  };

  const handleChangeSelectRolEdit = (e) => {
    let newValue = {
      ...pacienteSelected,
      idRol: e,
    };
    console.log(newValue);
    setPacienteSelected(newValue);
  };
  const handleChangeSelectEdit = (e) => {
    let newValue = {
      ...pacienteSelected,
      idsPatologias: e,
    };
    console.log(newValue);
    setPacienteSelected(newValue);
  };

  const handleEditPaciente = (paciente) => {
    console.log("editando: ", paciente);
    setIdPaciente(paciente.id);
    //setDniPaciente(paciente.dni);
    setShowVentEmergenteEditPaciente(true);
  };

  const handleHabilitacion = async (record) => {
    setIdPaciente(record.id);
    setShowVentEmergenteDelete(true);
  };

  const handleUpdate = async (paciente) => {
    const actualizarPaciente = async (paciente) => {
      console.log("se esta por actualizar este paciente: ", paciente);
      const update = await updatePaciente(paciente);
      console.log("update: ", update);
    };

    //activar loader
    setBandLoader(true);
    let resupdate = await actualizarPaciente(paciente);
    getallPacientes();

    console.log(resupdate);
    setBandLoader(false);
  };

  const handleSeePaciente = (paciente) => {
    console.log("viendo: ", paciente);
  };

  useEffect(() => {
    const getPacientebyidPaciente = async () => {
      let paciente = await getPacienteById(idPaciente);
      setPacienteSelected(paciente);
    };
    if (idPaciente > 0) {
      getPacientebyidPaciente();
    }
  }, [ idPaciente ]);


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
      align: "start",
    },
    {
      title: "Apellido",
      dataIndex: "apellido",
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
            onClick={(e) => handleEditPacient(record)}
          /> */}
          <DragOutlined
            className="icon_accion"
            onClick={(e) => handleEditPaciente(record)}
          />
         
          
        </div>
      ),
    },
  ];

  const handleBlanqueo = async (paciente) => {
    console.log("se blanqueara al paciente: ", paciente);
    const blanqueo = await blanquearPaciente(paciente);
    console.log(blanqueo);
    if (blanqueo.err) {
      throw new Error(blanqueo.err.message);
    }
    return blanqueo;
  };

  const handleInsert = async () => {
    if (bandInsert) {
      //validar para insert
      console.log(" se esta por insertar el paciente: ", pacienteToInsert);

      let pacienteToInsertBlanqueado = {
        ...pacienteToInsert,
        blanqueado: 0,
      };
      const resultInsert = await addPaciente(pacienteToInsertBlanqueado);
      if (resultInsert.err) {
        throw new Error(resultInsert.err.message);
      }
      handleCloseVentEmergenteConfPaciente();
      handleCloseVentEmergenteAddPaciente();
    }
  };
  const addPaciente = async (paciente) => {
    let insert = await insertPaciente({
      ...paciente,
      dni: +paciente.dni,
    });
    console.log(insert);
    //en el insert del insertPaciente me devuelve dos cosas en el caso que sea un paciente con el rol paciente, el
    //nuevo paciente creado y registro del paciente creado

    //esto es solo de prueba para que se visualize momentaneamente el paciente agregado
    setDb([insert.newPaciente, ...db]);

    return insert.newPaciente;
  };

  let getallPacientes = async () => {
    let pacientes = await getAllPacientes();
    console.log(pacientes);

    setDb(pacientes);
  };
  useEffect(() => {
    getallPacientes();
  }, []);



  useEffect(() => {
    let errores = validationsForm(pacienteToInsert);
    console.log(errores);
    console.log(Object.keys(errores).length);
    if (Object.keys(errores).length == 0) {
      setBandInsert(true);
    } else {
      setBandInsert(false);
    }
    //setBandInsert()
  }, [pacienteToInsert]);

  useEffect(() => {
    //este useEffect lo que hara es que traera las recetas luego de una posible eliminacion
    //posible porque cuando sea falso, se habra cerrado la ventana de confirmacion del delete y traera las recetas
    if (!showVentEmergenteDelete) {
      getallPacientes();
    }
  }, [showVentEmergenteDelete]);

  let data = {
    db: db,
    columns: columns,
    pacienteSelected: pacienteSelected,
    showVentEmergenteEditPaciente: showVentEmergenteEditPaciente,
    setShowVentEmergenteEditPaciente: showVentEmergenteEditPaciente,
    pacienteToInsert,
    bandInsert,
    showVentEmergenteAddPaciente,
    showVentEmergenteConfPaciente,
    bandLoader,
    dbSearch,
    idPaciente,
    rolPaciente,
    patologiasToPacienteAdd,
    allRolesAdd,
    allRolesEdit,
    dniPaciente,
    showVentEmergenteDelete,
    patologiasToPacienteEdit,
    getallPacientes,
    setPatologiasToPacienteEdit,
    setShowVentEmergenteDelete,
    handleChangeSelectRolEdit,
    handleChangeSelectEdit,
    setDniPaciente,
    handleChangeSelectRolInsert,
    handleChangeSelectInsert,
    setAllRolesEdit,
    setAllRolesAdd,
    setPatologiasToPacienteAdd,
    setRolPaciente,
    handleSearch,
    handleCloseConfInsert,
    setShowVentEmergenteConfPaciente,
    handleCloseVentEmergenteConfPaciente,
    handleCloseVentEmergenteAddPaciente,
    setShowVentEmergenteAddPaciente,
    validationsForm,
    setBandInsert,
    handleChangeInputInsert,
    handleEditPaciente: handleEditPaciente,
    handleSeePaciente: handleSeePaciente,
    handleCloseVentEmergenteEditPaciente: handleCloseVentEmergenteEditPaciente,
    handleChangeInput,
    addPaciente,
    handleInsert,
    handleUpdate,
    handleBlanqueo,
  };
  return (
    <PacienteContext.Provider value={data}>
      {" "}
      {children}{" "}
    </PacienteContext.Provider>
  );
};
export default PacienteContext;
