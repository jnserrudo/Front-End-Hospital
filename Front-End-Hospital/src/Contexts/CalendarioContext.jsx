import React, { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getAllEventos,
  getEventoById,
  insertEvento,
  updateEvento,
  disableEvento,
} from "../services/calendario-services";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const CalendarioContext = createContext();

export { CalendarioContext };

export const CalendarioProvider = ({ children }) => {
  const [db, setDb] = useState([]);
  const [dbSearch, setDbSearch] = useState([]);
  const [idEvento, setIdEvento] = useState(0);
  const [eventoSelected, setEventoSelected] = useState({});
  const [showVentEmergenteDelete, setShowVentEmergenteDelete] = useState(false);
  const [showVentEmergenteEditEvento, setShowVentEmergenteEditEvento] = useState(false);
  const [showVentEmergenteAddEvento, setShowVentEmergenteAddEvento] = useState(false);
  const [eventoToInsert, setEventoToInsert] = useState({});
  const [bandInsert, setBandInsert] = useState(false);
  const [showVentEmergenteConfEvento, setShowVentEmergenteConfEvento] = useState(false);
  const [bandLoader, setBandLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const validationsForm = (form) => {
    let errors = {};
    if (!form?.titulo || form?.titulo?.length == 0) {
      errors.titulo = "El título es requerido";
    }
    if (!form?.fecha || form?.fecha?.length == 0) {
      errors.fecha = "La fecha es requerida";
    }
    if (!form?.tipo || form?.tipo?.length == 0) {
      errors.tipo = "El tipo es requerido";
    }
    return errors;
  };

  const handleSearch = (busq) => {
    let coincidencias = [];
    for (let ev of db) {
      for (let x of Object.values(ev)) {
        if (x && x.toString().toLowerCase().includes(busq.toLowerCase())) {
          coincidencias.push(ev);
          break;
        }
      }
    }
    setDbSearch(coincidencias);
  };

  const handleCloseVentEmergenteEditEvento = () => {
    setShowVentEmergenteEditEvento(false);
    setIdEvento(0);
  };

  const handleCloseVentEmergenteAddEvento = () => {
    setShowVentEmergenteAddEvento(false);
    setEventoToInsert({});
    setBandInsert(false);
  };

  const handleCloseVentEmergenteConfEvento = () => {
    setShowVentEmergenteConfEvento(false);
  };

  const handleCloseConfInsert = async () => {
    setBandLoader(true);
    await handleInsert();
    setEventoToInsert({});
    setBandInsert(false);
    setBandLoader(false);
  };

  const handleChangeInputInsert = (e) => {
    let newValue = { ...eventoToInsert, [e.target.name]: e.target.value };
    setEventoToInsert(newValue);
  };

  const handleChangeInput = (e) => {
    let newValue = { ...eventoSelected, [e.target.name]: e.target.value };
    setEventoSelected(newValue);
  };

  const handleChangeSelectTipoInsert = (e) => {
    let newValue = { ...eventoToInsert, tipo: e };
    setEventoToInsert(newValue);
  };

  const handleChangeSelectTipo = (e) => {
    let newValue = { ...eventoSelected, tipo: e };
    setEventoSelected(newValue);
  };

  const handleEditEvento = (evento) => {
    setIdEvento(evento.id);
    setShowVentEmergenteEditEvento(true);
  };

  const handleDelete = (record) => {
    setIdEvento(record.id);
    setShowVentEmergenteDelete(true);
  };

  const handleUpdate = async (evento) => {
    setLoadingAction(true);
    try {
      const result = await updateEvento(evento.id, evento);
      console.log("Resultado de updateEvento:", result);
      
      // Si handleResponse no lanzó error, la operación fue exitosa
      toast.success("Evento actualizado exitosamente");
      
      // Recargar datos para mostrar los cambios
      await getallEventos();
      handleCloseVentEmergenteEditEvento();
    } catch (error) {
      console.error("Error al actualizar evento:", error);
      toast.error(error.message || "Error al actualizar evento");
      throw error;
    } finally {
      setLoadingAction(false);
    }
  };

  const handleInsert = async () => {
    try {
      const result = await insertEvento(eventoToInsert);
      console.log("Resultado de insertEvento:", result);
      
      // Si handleResponse no lanzó error, la operación fue exitosa
      toast.success("Evento agregado exitosamente");
      
      // Recargar datos para mostrar el nuevo evento
      await getallEventos();
      handleCloseVentEmergenteAddEvento();
    } catch (error) {
      console.error("Error al agregar evento:", error);
      toast.error(error.message || "Error al agregar evento");
      throw error;
    }
  };

  const inhabilitarEvento = async (id) => {
    try {
      const result = await disableEvento(id);
      console.log("Resultado de disableEvento:", result);
      
      // Si handleResponse no lanzó error, la operación fue exitosa
      toast.success("Evento eliminado exitosamente");
      
      // Recargar datos para actualizar la lista
      await getallEventos();
    } catch (error) {
      console.error("Error al eliminar evento:", error);
      toast.error(error.message || "Error al eliminar evento");
      throw error;
    }
  };

  const getallEventos = async () => {
    setLoading(true);
    const data = await getAllEventos();
    setDb(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!showVentEmergenteDelete) {
      getallEventos();
    }
  }, [showVentEmergenteDelete]);

  useEffect(() => {
    const getEventobyId = async () => {
      let evento = await getEventoById(idEvento);
      setEventoSelected(evento);
    };
    if (idEvento > 0) {
      getEventobyId();
    }
  }, [idEvento]);

  useEffect(() => {
    let errores = validationsForm(eventoToInsert);
    if (Object.keys(errores).length == 0) {
      setBandInsert(true);
    } else {
      setBandInsert(false);
    }
  }, [eventoToInsert]);

  useEffect(() => {
    getallEventos();
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Título", dataIndex: "titulo", key: "titulo" },
    { 
      title: "Fecha", 
      dataIndex: "fecha", 
      key: "fecha",
      render: (fecha) => {
        if (!fecha) return "-";
        const date = new Date(fecha);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
    },
    { title: "Tipo", dataIndex: "tipo", key: "tipo" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <EditOutlined
            style={{ color: "var(--primary)", cursor: "pointer" }}
            onClick={() => handleEditEvento(record)}
          />
          <DeleteOutlined
            style={{ color: "var(--danger)", cursor: "pointer" }}
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  const data = {
    db,
    dbSearch,
    eventoSelected,
    showVentEmergenteEditEvento,
    showVentEmergenteAddEvento,
    showVentEmergenteConfEvento,
    bandLoader,
    loading,
    loadingAction,
    eventoToInsert,
    bandInsert,
    idEvento,
    showVentEmergenteDelete,
    setShowVentEmergenteDelete,
    setShowVentEmergenteEditEvento,
    setShowVentEmergenteAddEvento,
    setShowVentEmergenteConfEvento,
    handleCloseVentEmergenteConfEvento,
    handleCloseVentEmergenteAddEvento,
    validationsForm,
    setBandInsert,
    handleChangeInputInsert,
    handleChangeInput,
    handleCloseVentEmergenteEditEvento,
    handleChangeSelectTipoInsert,
    handleChangeSelectTipo,
    handleEditEvento,
    handleDelete,
    handleUpdate,
    handleInsert,
    handleSearch,
    inhabilitarEvento,
    columns,
    getallEventos,
  };

  return <CalendarioContext.Provider value={data}>{children}</CalendarioContext.Provider>;
};

export default CalendarioContext;
