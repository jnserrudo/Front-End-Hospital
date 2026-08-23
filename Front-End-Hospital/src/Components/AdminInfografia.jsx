import React, { useState, useEffect } from "react";
import { Button as AntButton, Space, Popconfirm, message, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { getAllInfografias, disableInfografia } from "../services/infografia-services";
import { VentEmergenteAddInfografia } from "./VentEmergenteAddInfografia";
import { VentEmergenteEditInfografia } from "./VentEmergenteEditInfografia";
import { AdminEntityList } from "./AdminEntityList";

export const AdminInfografia = () => {
  const [infografias, setInfografias] = useState([]);
  const [infografiasFiltradas, setInfografiasFiltradas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedInfografia, setSelectedInfografia] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    cargarInfografias();
  }, []);

  const cargarInfografias = async () => {
    setLoading(true);
    const data = await getAllInfografias();
    setInfografias(data);
    setInfografiasFiltradas(data);
    setLoading(false);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (value === "") {
      setInfografiasFiltradas(infografias);
    } else {
      const filtradas = infografias.filter(
        (item) =>
          item.titulo.toLowerCase().includes(value.toLowerCase()) ||
          item.categoria.toLowerCase().includes(value.toLowerCase())
      );
      setInfografiasFiltradas(filtradas);
    }
  };

  const handleEdit = (record) => {
    setSelectedInfografia(record);
    setShowEdit(true);
  };

  const handleDelete = async (id) => {
    const result = await disableInfografia(id);
    if (result.id) {
      message.success("Infografía inhabilitada correctamente");
      cargarInfografias();
    } else {
      message.error("Error al inhabilitar la infografía");
    }
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
      render: (_, record) => (
        <Space>
          <AntButton
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="¿Estás seguro de inhabilitar esta infografía?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <AntButton type="primary" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
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
          label: "Agregar Infografía",
          icon: <PlusOutlined />,
          onClick: () => setShowAdd(true),
        }}
        columns={columns}
        dataSource={infografiasFiltradas}
        loading={loading}
        rowKey="id"
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
