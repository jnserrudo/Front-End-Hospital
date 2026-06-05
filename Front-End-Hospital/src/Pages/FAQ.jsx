import React, { useState, useEffect } from "react";
import { Collapse, Input, Select, Spin, Tag, Empty, Alert } from "antd";
import { QuestionCircleOutlined, SearchOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { getAllFAQs, getFAQsByCategoria } from "../services/faq-services";

const { Panel } = Collapse;

const CATEGORIAS = [
  { value: "todas", label: "Todas las categorías" },
  { value: "general", label: "General" },
  { value: "nutricion", label: "Nutrición" },
  { value: "ejercicio", label: "Ejercicio" },
  { value: "patologias", label: "Patologías" },
];

const TAG_COLORS = {
  general: "blue",
  nutricion: "green",
  ejercicio: "orange",
  patologias: "red",
};

export const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [faqsFiltradas, setFaqsFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => { cargarFAQs(); }, []);

  const cargarFAQs = async () => {
    setLoading(true);
    const data = await getAllFAQs();
    setFaqs(data);
    setFaqsFiltradas(data);
    setLoading(false);
  };

  const handleCategoriaChange = async (categoria) => {
    setCategoriaSeleccionada(categoria);
    setLoading(true);
    const data = categoria === "todas" ? await getAllFAQs() : await getFAQsByCategoria(categoria);
    setFaqsFiltradas(data);
    setLoading(false);
  };

  const handleBusqueda = (value) => {
    setBusqueda(value);
    setFaqsFiltradas(
      value === ""
        ? faqs
        : faqs.filter(
            (f) =>
              f.pregunta.toLowerCase().includes(value.toLowerCase()) ||
              f.respuesta.toLowerCase().includes(value.toLowerCase())
          )
    );
  };

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
            <QuestionCircleOutlined />
          </div>
          <div>
            <h2 className="page-title">Preguntas Frecuentes</h2>
            <p className="page-subtitle">Encontrá respuestas a las dudas más comunes</p>
          </div>
        </div>
        <div className="page-title-bar" />
      </div>

      <div className="filter-bar">
        <Input
          prefix={<SearchOutlined style={{ color: "var(--gray-400)" }} />}
          placeholder="Buscar pregunta o respuesta..."
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
      </div>

      <Alert
        message="¿Cómo usar esta sección?"
        description="Busca respuestas a tus dudas sobre salud, nutrición, ejercicio y patologías. Usa el buscador o filtra por categoría. Haz clic en una pregunta para ver la respuesta completa."
        type="info"
        icon={<InfoCircleOutlined />}
        showIcon
        closable
        style={{ marginBottom: 24, borderRadius: "var(--radius-md)" }}
      />

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <Spin size="large" />
          <p style={{ marginTop: 16, color: "var(--gray-500)" }}>Cargando preguntas...</p>
        </div>
      ) : faqsFiltradas.length === 0 ? (
        <Empty
          description={<span style={{ color: "var(--gray-500)" }}>No se encontraron preguntas frecuentes</span>}
          style={{ padding: "4rem 0" }}
        />
      ) : (
        <Collapse
          accordion
          expandIconPosition="end"
          style={{ background: "transparent", border: "none", display: "flex", flexDirection: "column", gap: 8 }}
        >
          {faqsFiltradas.map((faq) => (
            <Panel
              key={faq.id}
              header={
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontWeight: 600, color: "var(--gray-800)" }}>{faq.pregunta}</span>
                  {faq.categoria && (
                    <Tag color={TAG_COLORS[faq.categoria] || "default"} style={{ borderRadius: "var(--radius-full)", marginLeft: "auto" }}>
                      {faq.categoria}
                    </Tag>
                  )}
                </div>
              }
              style={{
                background: "white",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--gray-200)",
                marginBottom: 8,
                overflow: "hidden",
              }}
            >
              <p style={{ color: "var(--gray-600)", lineHeight: 1.7, margin: 0 }}>{faq.respuesta}</p>
            </Panel>
          ))}
        </Collapse>
      )}
    </div>
  );
};
