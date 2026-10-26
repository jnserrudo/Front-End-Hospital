import { ImagenSegura } from "../Components/MediaNoDisponible";
import React, { useState, useEffect } from "react";
import { Card, Select, Input, Spin, Row, Col, Tag, Empty, Badge } from "antd";
import { FilePdfOutlined, SearchOutlined, ExportOutlined } from "@ant-design/icons";
import { getAllInfografias, getInfografiasByCategoria } from "../services/infografia-services";
import { getMediaUrl } from "../services/config";
import { HospitalIcon } from "../Components/HospitalIcon";
import { PageHeader } from "../Components/PageHeader";
import { SectionHelp } from "../Components/SectionHelp";
import { AdminShortcut } from "../Components/AdminShortcut";

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
      <PageHeader
        icon={<HospitalIcon name="platoNutricion" size={32} alt="" />}
        title="Infografías de dietas"
        subtitle={
          <>
            Material visual sobre nutrición y planes alimentarios
            {infografiasFiltradas.length > 0 && (
              <Badge
                count={infografiasFiltradas.length}
                style={{ backgroundColor: "var(--primary)", marginLeft: 8 }}
              />
            )}
          </>
        }
        actions={<AdminShortcut adminKey="19" setSelectedKey={setSelectedKey} />}
      />

      <div className="filter-bar">
        <Input
          prefix={<SearchOutlined style={{ color: "var(--gray-400)" }} />}
          placeholder="Buscar infografía..."
          value={busqueda}
          onChange={(e) => handleBusqueda(e.target.value)}
          style={{ flex: 1, minWidth: 0 }}
          allowClear
        />
        <Select
          value={categoriaSeleccionada}
          onChange={handleCategoriaChange}
          options={CATEGORIAS}
          style={{ flex: "1 1 140px", minWidth: 0, maxWidth: "100%" }}
        />
      </div>

      <SectionHelp>
        Las infografías resumen en una imagen o PDF los distintos tipos de dietas y planes alimentarios que usa el
        equipo de nutrición. Buscá por nombre o filtrá por categoría, y tocá una tarjeta para verla en tamaño completo
        o descargarla y tenerla a mano.
      </SectionHelp>

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
                      <ImagenSegura
                        src={getUrl(inf)}
                        alt={inf.titulo}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
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
