import React, { useState, useEffect } from "react";
import { Calendar, Badge, Modal, Spin, Select, Tag, Descriptions, ConfigProvider, Alert, Button } from "antd";
import esES from "antd/locale/es_ES";
import { CalendarOutlined, ClockCircleOutlined, TagOutlined, InfoCircleOutlined, SettingOutlined } from "@ant-design/icons";
import { getAllEventos } from "../services/calendario-services";
import dayjs from "dayjs";
import "dayjs/locale/es";

// Configurar dayjs en español
dayjs.locale("es");

const TIPOS_FILTRO = [
  { value: "todos", label: "Todos los eventos" },
  { value: "general", label: "Eventos generales" },
  { value: "patologia", label: "Eventos por patología" },
];

const TIPO_BADGE = { general: "success", patologia: "warning" };
const TIPO_TAG_COLOR = { general: "green", patologia: "orange" };

export const Calendario = ({ setSelectedKey }) => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  
  // Verificar si el usuario es administrador o profesional
  const rol = localStorage.getItem("rol");
  const isAdmin = rol === "1" || rol === "2" || rol === 1 || rol === 2 || parseInt(rol) === 1 || parseInt(rol) === 2;

  useEffect(() => { cargarEventos(); }, []);

  const cargarEventos = async () => {
    setLoading(true);
    const data = await getAllEventos();
    setEventos(data);
    setLoading(false);
  };

  const getEventosDelDia = (fecha) =>
    eventos.filter((e) => {
      if (tipoFiltro !== "todos" && e.tipo !== tipoFiltro) return false;
      return dayjs(e.fecha).format("YYYY-MM-DD") === fecha.format("YYYY-MM-DD");
    });

  const dateCellRender = (fecha) => {
    const eventosDelDia = getEventosDelDia(fecha);
    if (!eventosDelDia.length) return null;
    return (
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {eventosDelDia.map((ev) => (
          <li key={ev.id} style={{ marginBottom: 2 }}>
            <Badge
              status={TIPO_BADGE[ev.tipo] || "default"}
              text={
                <span
                  style={{ fontSize: 11, cursor: "pointer", color: "var(--gray-700)" }}
                  onClick={(e) => { e.stopPropagation(); handleEventoClick(ev); }}
                >
                  {ev.titulo.substring(0, 18)}{ev.titulo.length > 18 ? "…" : ""}
                </span>
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  const handleEventoClick = (evento) => {
    setSelectedEvento(evento);
    setModalVisible(true);
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
            <CalendarOutlined />
          </div>
          <div>
            <h2 className="page-title">Calendario de Eventos</h2>
            <p className="page-subtitle">Actividades y eventos del hospital</p>
          </div>
        </div>
        <div className="page-title-bar" />
      </div>

      <div className="filter-bar">
        <Select
          value={tipoFiltro}
          onChange={setTipoFiltro}
          options={TIPOS_FILTRO}
          style={{ minWidth: 220 }}
        />
        <span style={{ color: "var(--gray-400)", fontSize: 13 }}>
          {eventos.length} evento{eventos.length !== 1 ? "s" : ""} cargado{eventos.length !== 1 ? "s" : ""}
        </span>
        {isAdmin && setSelectedKey && (
          <Button
            type="primary"
            icon={<SettingOutlined />}
            onClick={() => setSelectedKey("21")}
            className="admin-action-btn"
            size="large"
          >
            <span className="btn-text">Administrar</span>
          </Button>
        )}
      </div>

      <Alert
        message="¿Cómo usar esta sección?"
        description="Consulta eventos y actividades del hospital. Filtra por tipo de evento y haz clic en cualquier día con eventos para ver los detalles completos."
        type="info"
        icon={<InfoCircleOutlined />}
        showIcon
        closable
        style={{ marginBottom: 24, borderRadius: "var(--radius-md)" }}
      />

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <Spin size="large" />
          <p style={{ marginTop: 16, color: "var(--gray-500)" }}>Cargando eventos...</p>
        </div>
      ) : (
        <div style={{
          background: "white",
          border: "1px solid var(--gray-200)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          boxShadow: "var(--shadow)",
        }}>
          <ConfigProvider locale={esES}>
            <Calendar cellRender={dateCellRender} />
          </ConfigProvider>
        </div>
      )}

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <CalendarOutlined style={{ color: "var(--primary)" }} />
            <span>{selectedEvento?.titulo}</span>
          </div>
        }
        open={modalVisible}
        onCancel={() => { setModalVisible(false); setSelectedEvento(null); }}
        footer={null}
        width={560}
        styles={{ header: { borderBottom: "1px solid var(--gray-200)", paddingBottom: 12 } }}
      >
        {selectedEvento && (
          <div style={{ paddingTop: 8 }}>
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label={<span><ClockCircleOutlined /> Fecha</span>}>
                {dayjs(selectedEvento.fecha).format("DD [de] MMMM, YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label={<span><TagOutlined /> Tipo</span>}>
                <Tag color={TIPO_TAG_COLOR[selectedEvento.tipo] || "default"}>
                  {selectedEvento.tipo}
                </Tag>
              </Descriptions.Item>
              {selectedEvento.descripcion && (
                <Descriptions.Item label="Descripción">
                  {selectedEvento.descripcion}
                </Descriptions.Item>
              )}
            </Descriptions>
            {selectedEvento.urlImagen && (
              <img
                src={selectedEvento.urlImagen}
                alt={selectedEvento.titulo}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
                style={{
                  width: "100%", maxHeight: 320, objectFit: "cover",
                  borderRadius: "var(--radius-md)", marginTop: 16,
                }}
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
