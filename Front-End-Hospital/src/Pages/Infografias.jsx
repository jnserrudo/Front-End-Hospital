import React, { useState, useEffect } from "react";
import { Card, Select, Input, Spin, Row, Col, Tag, Empty, Badge, Alert, Button } from "antd";
import { PictureOutlined, FilePdfOutlined, SearchOutlined, AppstoreOutlined, ExportOutlined, InfoCircleOutlined, SettingOutlined } from "@ant-design/icons";
import { getAllInfografias, getInfografiasByCategoria } from "../services/infografia-services";
import { getMediaUrl } from "../services/config";

const { Meta } = Card;

const CATEGORIAS = [
  { value: "todas", label: "Todas las dietas" },
  { value: "vegetariana", label: "Vegetariana" },
  { value: "cetogenica", label: "Cetogénica" },
  { value: "mediterranea", label: "Mediterránea" },
  { value: "dash", label: "DASH" },
  { value: "baja_sodio", label: "Baja en Sodio" },
];

const CATEGORIA_COLORS = {
  vegetariana: "green",
  cetogenica: "purple",
  mediterranea: "blue",
  dash: "cyan",
  baja_sodio: "orange",
};

export const Infografias = ({ setSelectedKey }) => {
  const [infografias, setInfografias] = useState([]);
  const [infografiasFiltradas, setInfografiasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  
  // Verificar si el usuario es administrador o profesional
  const rol = localStorage.getItem("rol");
  const isAdmin = rol === "1" || rol === "2" || rol === 1 || rol === 2 || parseInt(rol) === 1 || parseInt(rol) === 2;
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => { cargarInfografias(); }, []);

  const cargarInfografias = async () => {
    setLoading(true);
    try {
      const data = await getAllInfografias();
      if (Array.isArray(data)) {
        setInfografias(data);
        setInfografiasFiltradas(data);
      } else {
        console.error("Response is not an array:", data);
        setInfografias([]);
        setInfografiasFiltradas([]);
      }
    } catch (err) {
      console.error("Error loading infografias:", err);
      setInfografias([]);
      setInfografiasFiltradas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoriaChange = async (categoria) => {
    setCategoriaSeleccionada(categoria);
    setLoading(true);
    try {
      const data = categoria === "todas" 
        ? await getAllInfografias() 
        : await getInfografiasByCategoria(categoria);
      if (Array.isArray(data)) {
        setInfografiasFiltradas(data);
      } else {
        console.error("Response is not an array:", data);
        setInfografiasFiltradas([]);
      }
    } catch (err) {
      console.error("Error filtering infografias:", err);
      setInfografiasFiltradas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBusqueda = (value) => {
    setBusqueda(value);
    setInfografiasFiltradas(
      value === ""
        ? infografias
        : infografias.filter(
            (i) =>
              i.titulo.toLowerCase().includes(value.toLowerCase()) ||
              i.descripcion?.toLowerCase().includes(value.toLowerCase())
          )
    );
  };

  const getUrl = (inf) =>
    inf.tipoAlmacenamiento === "externa" ? inf.urlExterna : getMediaUrl(inf.urlArchivo);

  const esPDF = (inf) => inf.tipoArchivo === "pdf";

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "var(--radius-md)",
            background: "var(--primary-100)", display: "flex",
            alignItems: "center", justifyContent: "center",
            color: "var(--primary)", fontSize: 24,
          }}>
            <AppstoreOutlined />
          </div>
          <div>
            <h2 className="page-title">Infografías de Dietas</h2>
            <p className="page-subtitle">
              Material visual sobre nutrición y planes alimentarios
              {infografiasFiltradas.length > 0 && (
                <Badge
                  count={infografiasFiltradas.length}
                  style={{ backgroundColor: "var(--primary)", marginLeft: 8 }}
                />
              )}
            </p>
          </div>
        </div>
        <div className="page-title-bar" />
      </div>

      <div className="filter-bar">
        <Input
          prefix={<SearchOutlined style={{ color: "var(--gray-400)" }} />}
          placeholder="Buscar infografía..."
          value={busqueda}
          onChange={(e) => handleBusqueda(e.target.value)}
          style={{ flex: 1, minWidth: 200 }}
          allowClear
        />
        <Select
          value={categoriaSeleccionada}
          onChange={handleCategoriaChange}
          options={CATEGORIAS}
          style={{ minWidth: 200 }}
        />
        {isAdmin && setSelectedKey && (
          <Button
            type="primary"
            icon={<SettingOutlined />}
            onClick={() => setSelectedKey("19")}
            className="admin-action-btn"
            size="large"
          >
            <span className="btn-text">Administrar</span>
          </Button>
        )}
      </div>

      <Alert
        message="¿Cómo usar esta sección?"
        description="Explora infografías sobre diferentes tipos de dietas y planes alimentarios. Filtra por categoría o busca por nombre. Haz clic en una infografía para verla en tamaño completo o descargarla."
        type="info"
        icon={<InfoCircleOutlined />}
        showIcon
        closable
        style={{ marginBottom: 24, borderRadius: "var(--radius-md)" }}
      />

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <Spin size="large" />
          <p style={{ marginTop: 16, color: "var(--gray-500)" }}>Cargando infografías...</p>
        </div>
      ) : infografiasFiltradas.length === 0 ? (
        <Empty
          description={<span style={{ color: "var(--gray-500)" }}>No se encontraron infografías</span>}
          style={{ padding: "4rem 0" }}
        />
      ) : (
        <Row gutter={[20, 20]}>
          {infografiasFiltradas.map((inf) => (
            <Col xs={24} sm={12} md={8} lg={6} key={inf.id}>
              <Card
                hoverable
                style={{ borderRadius: "var(--radius-md)", overflow: "hidden", height: "100%" }}
                cover={
                  esPDF(inf) ? (
                    <div style={{
                      height: 180, background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: 8,
                    }}>
                      <FilePdfOutlined style={{ fontSize: 48, color: "#d97706" }} />
                      <span style={{ fontSize: 12, color: "#92400e", fontWeight: 600 }}>Documento PDF</span>
                    </div>
                  ) : (
                    <div style={{ height: 180, overflow: "hidden", background: "var(--gray-100)" }}>
                      <img
                        src={getUrl(inf)}
                        alt={inf.titulo}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzY0NzQ4YiIgc3Ryb2tlLXdpZHRoPSIxLjUiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIHJ5PSIyIi8+PGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiLz48cG9seWxpbmUgcG9pbnRzPSIyMSAxNSAxNiAxMCA1IDIxIi8+PC9zdmc+';
                        }}
                      />
                    </div>
                  )
                }
                actions={[
                  <div
                    key="ver"
                    onClick={() => window.open(getUrl(inf), "_blank")}
                    style={{ color: "var(--primary)", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
                  >
                    <ExportOutlined /> Ver {esPDF(inf) ? "PDF" : "imagen"}
                  </div>,
                ]}
              >
                <Meta
                  title={
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-800)" }}>
                      {inf.titulo}
                    </span>
                  }
                  description={
                    <div>
                      <p style={{ fontSize: 12, color: "var(--gray-500)", marginBottom: 8, lineHeight: 1.5 }}>
                        {inf.descripcion?.substring(0, 80)}{inf.descripcion?.length > 80 ? "..." : ""}
                      </p>
                      {inf.categoria && (
                        <Tag
                          color={CATEGORIA_COLORS[inf.categoria] || "default"}
                          style={{ borderRadius: "var(--radius-full)", fontSize: 11 }}
                        >
                          {inf.categoria}
                        </Tag>
                      )}
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};
