import { faqCategoriaLabel } from "../utils/faqCategorias";
import { RowActions } from "../Components/RowActions";
import React, { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { notify } from "../ui/notify";
import {
  getAllFAQs,
  getFAQById,
  insertFAQ,
  updateFAQ,
  disableFAQ,
} from "../services/faq-services";
import { EditOutlined, DeleteOutlined, StopOutlined } from "@ant-design/icons";

const FAQContext = createContext();

export { FAQContext };

export const FAQProvider = ({ children }) => {
  const [db, setDb] = useState([]);
  const [dbSearch, setDbSearch] = useState([]);
  const [idFAQ, setIdFAQ] = useState(0);
  const [faqSelected, setFaqSelected] = useState({});
  const [showVentEmergenteDelete, setShowVentEmergenteDelete] = useState(false);
  const [showVentEmergenteEditFAQ, setShowVentEmergenteEditFAQ] = useState(false);
  const [showVentEmergenteAddFAQ, setShowVentEmergenteAddFAQ] = useState(false);
  const [faqToInsert, setFaqToInsert] = useState({});
  const [bandInsert, setBandInsert] = useState(false);
  const [showVentEmergenteConfFAQ, setShowVentEmergenteConfFAQ] = useState(false);
  const [bandLoader, setBandLoader] = useState(false);
  const [loading, setLoading] = useState(true); // true: evita mostrar «vacío» antes de cargar
  const [loadingAction, setLoadingAction] = useState(false);

  const validationsForm = (form) => {
    let errors = {};
    if (!form?.pregunta || form?.pregunta?.length == 0) {
      errors.pregunta = "La pregunta es requerida";
    }
    if (!form?.respuesta || form?.respuesta?.length == 0) {
      errors.respuesta = "La respuesta es requerida";
    }
    if (!form?.categoria || form?.categoria?.length == 0) {
      errors.categoria = "La categoría es requerida";
    }
    return errors;
  };

  const handleSearch = (busq) => {
    let coincidencias = [];
    for (let faq of db) {
      for (let x of Object.values(faq)) {
        if (x && x.toString().toLowerCase().includes(busq.toLowerCase())) {
          coincidencias.push(faq);
          break;
        }
      }
    }
    setDbSearch(coincidencias);
  };

  const handleCloseVentEmergenteEditFAQ = () => {
    setShowVentEmergenteEditFAQ(false);
    setIdFAQ(0);
  };

  const handleCloseVentEmergenteAddFAQ = () => {
    setShowVentEmergenteAddFAQ(false);
    setFaqToInsert({});
    setBandInsert(false);
  };

  const handleCloseVentEmergenteConfFAQ = () => {
    setShowVentEmergenteConfFAQ(false);
  };

  const handleCloseConfInsert = async () => {
    setBandLoader(true);
    await handleInsert();
    setFaqToInsert({});
    setBandInsert(false);
    setBandLoader(false);
  };

  const handleChangeInputInsert = (e) => {
    let newValue = { ...faqToInsert, [e.target.name]: e.target.value };
    setFaqToInsert(newValue);
  };

  const handleChangeInput = (e) => {
    let newValue = { ...faqSelected, [e.target.name]: e.target.value };
    setFaqSelected(newValue);
  };

  const handleChangeSelectCategoriaInsert = (e) => {
    let newValue = { ...faqToInsert, categoria: e };
    setFaqToInsert(newValue);
  };

  const handleChangeSelectCategoria = (e) => {
    let newValue = { ...faqSelected, categoria: e };
    setFaqSelected(newValue);
  };

  const handleEditFAQ = (faq) => {
    setIdFAQ(faq.id);
    setShowVentEmergenteEditFAQ(true);
  };

  const handleDelete = (record) => {
    setIdFAQ(record.id);
    setShowVentEmergenteDelete(true);
  };

  const handleUpdate = async (faq) => {
    setLoadingAction(true);
    try {
      const result = await updateFAQ(faq.id, faq);
      console.log("Resultado de updateFAQ:", result);
      
      // Si handleResponse no lanzó error, la operación fue exitosa
      notify.success(`Pregunta «${faq?.pregunta || ""}» actualizada. Ya se ve con los cambios.`);
      
      // Recargar datos para mostrar los cambios
      await getallFAQs();
      handleCloseVentEmergenteEditFAQ();
    } catch (error) {
      console.error("Error al actualizar pregunta:", error);
      throw error;
    } finally {
      setLoadingAction(false);
    }
  };

  const handleInsert = async () => {
    try {
      const result = await insertFAQ(faqToInsert);
      console.log("Resultado de insertFAQ:", result);
      
      // Si handleResponse no lanzó error, la operación fue exitosa
      notify.success(`Pregunta «${faqToInsert?.pregunta || ""}» publicada. Ya aparece en Preguntas frecuentes.`);
      
      // Recargar datos para mostrar la nueva pregunta
      await getallFAQs();
      handleCloseVentEmergenteAddFAQ();
    } catch (error) {
      console.error("Error al agregar pregunta:", error);
      throw error;
    }
  };

  const inhabilitarFAQ = async (id) => {
    try {
      const result = await disableFAQ(id);
      console.log("Resultado de disableFAQ:", result);
      
      // Si handleResponse no lanzó error, la operación fue exitosa
      
      // Recargar datos para actualizar la lista
      await getallFAQs();
    } catch (error) {
      console.error("Error al eliminar pregunta:", error);
      throw error;
    }
  };

  const getallFAQs = async () => {
    setLoading(true);
    try {
      const data = await getAllFAQs();
      setDb(Array.isArray(data) ? data : []);
    } catch (error) {
      notify.error(error, "No pudimos cargar la lista");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showVentEmergenteDelete) {
      getallFAQs();
    }
  }, [showVentEmergenteDelete]);

  useEffect(() => {
    const getFAQbyId = async () => {
      let faq = await getFAQById(idFAQ);
      setFaqSelected(faq);
    };
    if (idFAQ > 0) {
      getFAQbyId();
    }
  }, [idFAQ]);

  useEffect(() => {
    let errores = validationsForm(faqToInsert);
    if (Object.keys(errores).length == 0) {
      setBandInsert(true);
    } else {
      setBandInsert(false);
    }
  }, [faqToInsert]);

  useEffect(() => {
    getallFAQs();
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Pregunta", dataIndex: "pregunta", key: "pregunta" },
    { title: "Categoría", dataIndex: "categoria", key: "categoria", render: (c) => faqCategoriaLabel(c) },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      render: (_, record) => (
        <RowActions
          actions={[
            { key: "edit", label: "Editar", icon: <EditOutlined />, onClick: () => handleEditFAQ(record) },
            { key: "off", label: "Deshabilitar", icon: <StopOutlined />, danger: true, onClick: () => handleDelete(record) },
          ]}
        />
      ),
    },
  ];

  const data = {
    recargar: getallFAQs,
    db,
    dbSearch,
    faqSelected,
    showVentEmergenteEditFAQ,
    showVentEmergenteAddFAQ,
    showVentEmergenteConfFAQ,
    bandLoader,
    loading,
    loadingAction,
    faqToInsert,
    bandInsert,
    idFAQ,
    showVentEmergenteDelete,
    setShowVentEmergenteDelete,
    setShowVentEmergenteEditFAQ,
    setShowVentEmergenteAddFAQ,
    setShowVentEmergenteConfFAQ,
    handleCloseVentEmergenteConfFAQ,
    handleCloseVentEmergenteAddFAQ,
    validationsForm,
    setBandInsert,
    handleChangeInputInsert,
    handleChangeInput,
    handleCloseVentEmergenteEditFAQ,
    handleChangeSelectCategoriaInsert,
    handleChangeSelectCategoria,
    handleEditFAQ,
    handleDelete,
    handleUpdate,
    handleInsert,
    handleSearch,
    inhabilitarFAQ,
    columns,
    getallFAQs,
  };

  return <FAQContext.Provider value={data}>{children}</FAQContext.Provider>;
};

export default FAQContext;
