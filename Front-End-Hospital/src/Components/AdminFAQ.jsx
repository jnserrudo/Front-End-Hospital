import React, { useContext, useMemo, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import FAQContext from "../Contexts/FAQContext";
import { VentEmergenteAddFAQ } from "./VentEmergenteAddFAQ";
import { VentEmergenteEditFAQ } from "./VentEmergenteEditFAQ";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { AdminEntityList } from "./AdminEntityList";
import { filterBySearch } from "../utils/search";
import { notify } from "../ui/notify";

export const AdminFAQ = () => {
  const {
    db,
    dbSearch,
    columns,
    faqSelected,
    showVentEmergenteEditFAQ,
    handleCloseVentEmergenteEditFAQ,
    showVentEmergenteAddFAQ,
    setShowVentEmergenteAddFAQ,
    handleCloseVentEmergenteAddFAQ,
    handleSearch,
    idFAQ,
    showVentEmergenteDelete,
    setShowVentEmergenteDelete,
    loading = false,
    loadingAction = false,
    inhabilitarFAQ,
    recargar,
  } = useContext(FAQContext);

  const [faqSearch, setFaqSearch] = useState("");

  const lista = useMemo(() => filterBySearch(db || [], faqSearch), [db, faqSearch]);
  const itemNombre = (db || []).find((x) => x.id === idFAQ)?.pregunta || "seleccionada";

  return (
    <>
      <AdminEntityList
        title="Listado de Preguntas Frecuentes"
        count={db?.length || 0}
        searchProps={{
          placeholder: "Buscar pregunta...",
          value: faqSearch,
          onChange: (e) => {
            setFaqSearch(e.target.value);
          },
        }}
        addButton={{
          label: "Agregar pregunta",
          icon: <PlusOutlined />,
          onClick: () => setShowVentEmergenteAddFAQ(true),
          loading: loadingAction,
          disabled: loadingAction,
        }}
        columns={columns}
        dataSource={lista}
        loadingText="Cargando preguntas…"
        estado={{ entidad: "faq", singular: "pregunta", articulo: "la", onRestored: () => recargar?.() }}
        loading={loading}
        rowKey="id"
      />

      <VentEmergenteAddFAQ
        isOpen={showVentEmergenteAddFAQ}
        onClose={handleCloseVentEmergenteAddFAQ}
      />

      <VentEmergenteEditFAQ
        isOpen={showVentEmergenteEditFAQ}
        faqSelected={faqSelected}
        onClose={handleCloseVentEmergenteEditFAQ}
      />

      <VentEmergConfirmacion
        title={`¿Deshabilitar la pregunta frecuente «${itemNombre}»?`}
        mje={"Deja de mostrarse en Preguntas frecuentes. Los datos no se borran y se puede volver a habilitar desde el filtro «Deshabilitados»."}
        confirmText="Deshabilitar"
        danger
        errorFallback="No pudimos deshabilitar la pregunta frecuente"
        isOpen={showVentEmergenteDelete}
        onClose={() => setShowVentEmergenteDelete(false)}
        handleSi={async () => {
          const nombreItem = itemNombre;
          await inhabilitarFAQ(idFAQ);
          notify.success(`Pregunta frecuente «${nombreItem}» deshabilitada. Ya no se muestra en la app.`);
        }}
      />
    </>
  );
};

export default AdminFAQ;
