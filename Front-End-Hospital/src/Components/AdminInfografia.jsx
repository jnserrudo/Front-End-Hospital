import React, { useState, useEffect, useMemo } from "react";
import { Tag } from "antd";
import { EditOutlined, StopOutlined, PlusOutlined } from "@ant-design/icons";
import { RowActions } from "./RowActions";
import { getAllInfografias, disableInfografia } from "../services/infografia-services";
import { VentEmergenteAddInfografia } from "./VentEmergenteAddInfografia";
import { VentEmergenteEditInfografia } from "./VentEmergenteEditInfografia";
import { AdminEntityList } from "./AdminEntityList";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { filterBySearch } from "../utils/search";
import { notify } from "../ui/notify";

export const AdminInfografia = () => {
  const [infografias, setInfografias] = useState([]);
  const [aDeshabilitar, setADeshabilitar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedInfografia, setSelectedInfografia] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    cargarInfografias();
  }, []);

  const cargarInfografias = async () => {
    setLoading(true);
    try {
      const data = await getAllInfografias();
      setInfografias(Array.isArray(data) ? data : []);
    } catch (err) {
      notify.error(err, "No pudimos cargar las infografías");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => setSearchText(value);
  const infografiasFiltradas = useMemo(() => filterBySearch(infografias, searchText), [infografias, searchText]);

  const handleEdit = (record) => {
    setSelectedInfografia(record);
    setShowEdit(true);
  };

  const handleDelete = async () => {
    const r = aDeshabilitar;
    await disableInfografia(r.id);
    notify.success(`Infografía «${r.titulo}» deshabilitada. Ya no se muestra en la app.`);
    await cargarInfografias();
  };

  const columns = [
    {
      title: "Título",
      dataIndex: "titulo",
      key: "titulo",
    },
    {
      title: "Categoría",
      dataIndex: "categoria",
      key: "categoria",
      render: (categoria) => <Tag color="blue">{categoria}</Tag>,
    },
    {
      title: "Tipo",
      dataIndex: "tipoArchivo",
      key: "tipoArchivo",
      render: (tipo) => <Tag color={tipo === "imagen" ? "green" : "orange"}>{tipo}</Tag>,
    },
    {
      title: "Almacenamiento",
      dataIndex: "tipoAlmacenamiento",
      key: "tipoAlmacenamiento",
      render: (tipo) => <Tag color={tipo === "local" ? "purple" : "cyan"}>{tipo}</Tag>,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      render: (_, record) => (
        <RowActions
          actions={[
            { key: "edit", label: "Editar", icon: <EditOutlined />, onClick: () => handleEdit(record) },
            { key: "off", label: "Deshabilitar", icon: <StopOutlined />, danger: true, onClick: () => setADeshabilitar(record) },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <AdminEntityList
        title="Listado de Infografías"
        count={infografias.length}
        searchProps={{
          placeholder: "Buscar por título o categoría...",
          value: searchText,
          onChange: (e) => handleSearch(e.target.value),
        }}
        addButton={{
          label: "Agregar infografía",
          icon: <PlusOutlined />,
          onClick: () => setShowAdd(true),
        }}
        columns={columns}
        dataSource={infografiasFiltradas}
        loadingText="Cargando infografías…"
        estado={{ entidad: "infografias", singular: "infografía", articulo: "la", onRestored: cargarInfografias }}
        loading={loading}
        rowKey="id"
      />

      <VentEmergConfirmacion
        isOpen={Boolean(aDeshabilitar)}
        onClose={() => setADeshabilitar(null)}
        title={`¿Deshabilitar la infografía «${aDeshabilitar?.titulo || ""}»?`}
        mje="Deja de mostrarse en la sección Infografías para todos. Los datos no se borran y se puede volver a habilitar desde el filtro «Deshabilitados»."
        confirmText="Deshabilitar"
        danger
        errorFallback="No pudimos deshabilitar la infografía"
        handleSi={handleDelete}
      />

      {showAdd && (
        <VentEmergenteAddInfografia
          show={showAdd}
          handleClose={() => {
            setShowAdd(false);
            cargarInfografias();
          }}
        />
      )}

      {showEdit && (
        <VentEmergenteEditInfografia
          show={showEdit}
          handleClose={() => {
            setShowEdit(false);
            setSelectedInfografia(null);
            cargarInfografias();
          }}
          infografia={selectedInfografia}
        />
      )}
    </>
  );
};
