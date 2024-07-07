import React, { createContext, useEffect, useState } from "react";
import {
  blanquearUsuario,
  getAllRoles,
  getAllRolesToEdit,
  getAllUsuarios,
  getUsuarioById,
  insertUsuario,
  updateUsuario,
} from "../services/usuario-services";
import { EditOutlined, DragOutlined } from "@ant-design/icons";
import { getAllPatologias } from "../services/patologia-services";
const UsuarioContext = createContext();
export const UsuarioProvider = ({ children }) => {
  const [db, setDb] = useState([]);
  const [dbSearch, setDbSearch] = useState([]);
  const [idUsuario, setIdUsuario] = useState("");

  const [dniUsuario, setDniUsuario] = useState("");
  const [rolUsuario, setRolUsuario] = useState(0);

  const [allRolesAdd, setAllRolesAdd] = useState([]);

  const [allRolesEdit, setAllRolesEdit] = useState([]);

  const [usuarioSelected, setUsuarioSelected] = useState({});

  const [showVentEmergenteEditUsuario, setShowVentEmergenteEditUsuario] =
    useState(false);
  const [showVentEmergenteAddUsuario, setShowVentEmergenteAddUsuario] =
    useState(false);
  const [usuarioToInsert, setUsuarioToInsert] = useState({});
  const [bandInsert, setBandInsert] = useState(false);

  const [showVentEmergenteConfUsuario, setShowVentEmergenteConfUsuario] =
    useState(false);

  const [patologiasToUsuarioAdd, setPatologiasToUsuarioAdd] = useState([]);

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
    if (!form?.usuario || form?.usuario?.length == 0) {
      errors.usuario = "EL usuario es requerida";
    }

    if (!form?.password || form?.password?.length == 0) {
      errors.password = "El password es requerido";
    }
    if (!form?.idRol || form?.idRol?.length == 0) {
      errors.idRol = "El idRol es requerida";
    }

    if (!form?.idPatologias || form?.idPatologias?.length == 0) {
      errors.idPatologias = "El idPatologias es requerido";
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

  const handleCloseVentEmergenteEditUsuario = () => {
    setShowVentEmergenteEditUsuario(false);
    setIdUsuario(0);
  };

  const handleCloseVentEmergenteAddUsuario = () => {
    setShowVentEmergenteAddUsuario(false);
    setUsuarioToInsert({});
  };

  const handleCloseVentEmergenteConfUsuario = () => {
    setShowVentEmergenteConfUsuario(false);
  };

  const handleCloseConfInsert = async () => {
    //se confirmo que se agregara el Usuario
    setBandLoader(true);
    await handleInsert();

    setUsuarioToInsert({});
    setBandInsert(false);
    setBandLoader(false);
    //de alguna manera actualizar la tabla para que se pueda ver al nuevo Usuario
  };

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

  const handleChangeSelectRolInsert = (e) => {
    let newValue = {
      ...usuarioToInsert,
      idRol: e,
    };
    console.log(newValue);
    setUsuarioToInsert(newValue);
  };
  const handleChangeSelectInsert = (e) => {
    let newValue = {
      ...usuarioToInsert,
      idsPatologias: e,
    };
    console.log(newValue);
    setUsuarioToInsert(newValue);
  };

  const handleChangeSelectRolEdit = (e) => {
    let newValue = {
      ...usuarioSelected,
      idRol: e,
    };
    console.log(newValue);
    setUsuarioSelected(newValue);
  };
  const handleChangeSelectEdit = (e) => {
    let newValue = {
      ...usuarioSelected,
      idsPatologias: e,
    };
    console.log(newValue);
    setUsuarioSelected(newValue);
  };

  const handleEditUsuario = (usuario) => {
    console.log("editando: ", usuario);
    setIdUsuario(usuario.id);
    setShowVentEmergenteEditUsuario(true);
  };

  const handleUpdate = async (usuario) => {
    const actualizarUsuario = async (usuario) => {
      console.log("se esta por actualizar este usuario: ", usuario);
      const update = await updateUsuario(usuario);
      console.log("update: ", update);
    };

    //activar loader
    setBandLoader(true);
    let resupdate = await actualizarUsuario(usuario);
    getallUsuarios();

    console.log(resupdate);
    setBandLoader(false);
  };

  const handleSeeUsuario = (usuario) => {
    console.log("viendo: ", usuario);
  };

  useEffect(() => {
    const getUsuariobyidUsuario = async () => {
      let usuario = await getUsuarioById(idUsuario);
      setUsuarioSelected(usuario);
    };
    if (idUsuario > 0) {
      getUsuariobyidUsuario();
    }
  }, [idUsuario]);

  const columns = [
    {
      title: "DNI",
      dataIndex: "dni",
      render: (text) => <a>{text}</a>,
      align: "center",
    },
    {
      title: "Usuario",
      dataIndex: "usuario",
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
            onClick={(e) => handleEditUsuario(record)}
          />
        </div>
      ),
    },
  ];


  const handleBlanqueo=async(usuario)=>{
    console.log("se blanqueara al usuario: ",usuario)
    const blanqueo=await blanquearUsuario(usuario)
    console.log(blanqueo)
    return blanqueo

  }

  const handleInsert = async () => {
    if (bandInsert) {
      //validar para insert
      console.log(" se esta por insertar el usuario: ", usuarioToInsert);

      let usuarioToInsertBlanqueado={
        ...usuarioToInsert,
        blanqueado:0
      }
      await addUsuario(usuarioToInsertBlanqueado);
      handleCloseVentEmergenteConfUsuario();
      handleCloseVentEmergenteAddUsuario();
    }
  };
  const addUsuario = async (usuario) => {
    let insert = await insertUsuario(usuario);
    console.log(insert);
    //en el insert del insertUsuario me devuelve dos cosas en el caso que sea un usuario con el rol paciente, el
    //nuevo usuario creado y registro del paciente creado

    //esto es solo de prueba para que se visualize momentaneamente el usuario agregado
    setDb([insert.newUsuario, ...db]);

    return insert.newUsuario;
  };

  let getallUsuarios = async () => {
    let usuarios = await getAllUsuarios();

    setDb(usuarios);
  };
  useEffect(() => {
    getallUsuarios();
  }, []);

  useEffect(() => {
    let getallRoles = async () => {
      let roles = await getAllRoles();
      (roles = roles.map((p) => ({
        label: p.rol,
        value: p.id,
      }))),
        setAllRolesAdd(roles);
    };

    getallRoles();
  }, []);

  useEffect(() => {
    let getallRolestoedit = async () => {
      let roles = await getAllRolesToEdit(usuarioSelected.idRol);
      console.log(roles)
      roles = roles.map((p) => ({
        label: p.rol,
        value: p.id,
      })),
        setAllRolesEdit(roles);
    };
    if (usuarioSelected?.idRol > 0) {
      getallRolestoedit();
    }
  }, [usuarioSelected]);

  useEffect(() => {
    //para crear un usuario traemos todas las patologias,

    //en el caso de edicion de usuarios se deben mostrar las que no tiene
    const getpatologiatousuario = async () => {
      const patologias = await getAllPatologias();
      if (patologias.length > 0) {
        let alToSelect = patologias.map((pat) => {
          return {
            label: pat.nombre,
            value: pat.id,
          };
        });
        setPatologiasToUsuarioAdd(alToSelect);
      }
    };
    getpatologiatousuario();
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
    idUsuario,
    rolUsuario,
    patologiasToUsuarioAdd,
    allRolesAdd,
    allRolesEdit,
    dniUsuario,
    handleChangeSelectRolEdit,
    handleChangeSelectEdit,
    setDniUsuario,
    handleChangeSelectRolInsert,
    handleChangeSelectInsert,
    setAllRolesEdit,
    setAllRolesAdd,
    setPatologiasToUsuarioAdd,
    setRolUsuario,
    handleSearch,
    handleCloseConfInsert,
    setShowVentEmergenteConfUsuario,
    handleCloseVentEmergenteConfUsuario,
    handleCloseVentEmergenteAddUsuario,
    setShowVentEmergenteAddUsuario,
    validationsForm,
    setBandInsert,
    handleChangeInputInsert,
    handleEditUsuario: handleEditUsuario,
    handleSeeUsuario: handleSeeUsuario,
    handleCloseVentEmergenteEditUsuario: handleCloseVentEmergenteEditUsuario,
    handleChangeInput,
    addUsuario,
    handleInsert,
    handleUpdate,
    handleBlanqueo
  };
  return (
    <UsuarioContext.Provider value={data}> {children} </UsuarioContext.Provider>
  );
};
export default UsuarioContext;
