import React, { useState, useEffect } from "react";
import { Table, Button as AntButton, Space, Popconfirm, message, Tag, Input as AntInput } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, PictureOutlined } from "@ant-design/icons";
import { Button, Input, FormControl, InputGroup, InputRightElement } from "@chakra-ui/react";
import { getAllInfografias, disableInfografia } from "../services/infografia-services";
import { VentEmergenteAddInfografia } from "./VentEmergenteAddInfografia";
import { VentEmergenteEditInfografia } from "./VentEmergenteEditInfografia";

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
      width: "25%",
    },
    {
      title: "Categoría",
      dataIndex: "categoria",
      key: "categoria",
      width: "15%",
      render: (categoria) => <Tag color="blue">{categoria}</Tag>,
    },
    {
      title: "Tipo",
      dataIndex: "tipoArchivo",
      key: "tipoArchivo",
      width: "10%",
      render: (tipo) => <Tag color={tipo === "imagen" ? "green" : "orange"}>{tipo}</Tag>,
    },
    {
      title: "Almacenamiento",
      dataIndex: "tipoAlmacenamiento",
      key: "tipoAlmacenamiento",
      width: "15%",
      render: (tipo) => <Tag color={tipo === "local" ? "purple" : "cyan"}>{tipo}</Tag>,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "Acciones",
      key: "acciones",
      width: "10%",
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
    <div className="admin-page-wrapper">
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            <h3>Listado de Infografías</h3>
            <span className="admin-badge">{infografias.length} en total</span>
          </div>
          <div className="admin-card-actions">
            <AntInput
              prefix={<SearchOutlined style={{ color: "var(--gray-400)" }} />}
              placeholder="Buscar por título o categoría..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
            <Button
              colorScheme="green"
              onClick={() => setShowAdd(true)}
            >
              Agregar Infografía <PlusOutlined className="icons" />
            </Button>
          </div>
        </div>

        <Table scroll={{ x: 'max-content' }}
            className="admin-table"
            columns={columns}
            dataSource={infografiasFiltradas}
            loading={loading}
            rowKey="id"
            pagination={{ position: ["bottomRight"], pageSize: 8 }}
            locale={{ emptyText: "Sin registros" }}
          />
      </div>

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
    </div>
  );
};
