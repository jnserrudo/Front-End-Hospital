import React, { useEffect, useMemo, useState } from "react";
import { Tag, Segmented, Modal, Button, Tooltip, Typography } from "antd";
import { EyeOutlined, CheckOutlined, MailOutlined } from "@ant-design/icons";
import { getAllFeedbacks, markFeedbackAsRead } from "../services/feedback-services";
import { AdminEntityList } from "./AdminEntityList";
import { RowActions } from "./RowActions";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { filterBySearch } from "../utils/search";
import { notify } from "../ui/notify";
import { friendlyMessage } from "../services/http";

const fecha = (f) => (f ? new Date(f).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" }) : "—");
const resumen = (t, n = 80) => {
  const s = String(t || "").replace(/\s+/g, " ").trim();
  return s.length > n ? `${s.slice(0, n)}…` : s;
};

// El tipo y la calificación vienen al final del mensaje («— Tipo: Sugerencia · Calificación: 4/5 · Usuario: …»).
const TIPO_COLOR = { Sugerencia: "blue", Consulta: "cyan", Problema: "red", "Felicitación": "green", Otro: "default" };
const tipoDe = (m) => (String(m || "").match(/Tipo: ([^·\n]+)/) || [])[1]?.trim() || null;

/** Administración > Feedback: el administrador lee los comentarios y los marca como leídos. */
export const AdminFeedback = () => {
  const [db, setDb] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState("noLeidos");
  const [detalle, setDetalle] = useState(null);
  const [marcar, setMarcar] = useState(null);

  const cargar = async () => {
    setLoading(true);
    try {
      const r = await getAllFeedbacks();
      setDb(Array.isArray(r) ? r : []);
    } catch (e) {
      notify.error(friendlyMessage(e, "No pudimos cargar los comentarios"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const noLeidos = db.filter((f) => !f.leido).length;
  const lista = useMemo(() => {
    const base = filtro === "todos" ? db : db.filter((f) => (filtro === "leidos" ? f.leido : !f.leido));
    return filterBySearch(base, search);
  }, [db, filtro, search]);

  const columns = [
    {
      title: "Estado",
      dataIndex: "leido",
      key: "leido",
      width: 110,
      render: (l) => (l ? <Tag>Leído</Tag> : <Tag color="blue">Sin leer</Tag>),
    },
    { title: "Fecha", dataIndex: "createdAt", key: "createdAt", width: 140, render: fecha },
    { title: "Nombre", dataIndex: "nombre", key: "nombre", render: (n) => n || "—" },
    { title: "Email", dataIndex: "email", key: "email", render: (e) => e || <span style={{ color: "var(--gray-400)" }}>Sin email</span> },
    {
      title: "Tipo",
      key: "tipo",
      width: 120,
      render: (_, r) => {
        const t = tipoDe(r.mensaje);
        return t ? <Tag color={TIPO_COLOR[t] || "default"}>{t}</Tag> : <span style={{ color: "var(--gray-400)" }}>—</span>;
      },
    },
    { title: "Mensaje", dataIndex: "mensaje", key: "mensaje", render: (m) => resumen(m) },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      render: (_, r) => (
        <RowActions
          actions={[
            { key: "ver", label: "Ver comentario completo", icon: <EyeOutlined />, onClick: () => setDetalle(r) },
            {
              key: "leido",
              label: "Marcar como leído",
              disabledReason: "Ya está marcado como leído",
              icon: <CheckOutlined />,
              disabled: Boolean(r.leido),
              onClick: () => setMarcar(r),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <AdminEntityList
        title="Comentarios de usuarios"
        count={lista.length}
        loading={loading}
        loadingText="Cargando comentarios…"
        emptyText={filtro === "noLeidos" ? "No hay comentarios sin leer" : "No hay comentarios"}
        searchProps={{ placeholder: "Buscar por nombre, email o texto...", value: search, onChange: (e) => setSearch(e.target.value) }}
        extraFilters={
          <Segmented
            value={filtro}
            onChange={setFiltro}
            options={[
              { label: `Sin leer${loading ? "" : ` (${noLeidos})`}`, value: "noLeidos" },
              { label: "Leídos", value: "leidos" },
              { label: "Todos", value: "todos" },
            ]}
          />
        }
        columns={columns}
        dataSource={lista}
      />

      <Modal
        open={Boolean(detalle)}
        onCancel={() => setDetalle(null)}
        centered
        title={detalle ? `Detalle del comentario de ${detalle.nombre || "un usuario"}` : ""}
        footer={[
          <Button key="c" onClick={() => setDetalle(null)}>Cerrar</Button>,
          detalle && !detalle.leido ? (
            <Button key="m" type="primary" icon={<CheckOutlined />} onClick={() => setMarcar(detalle)}>
              Marcar como leído
            </Button>
          ) : (
            <Tooltip key="m" title="Este comentario ya está marcado como leído">
              <span style={{ display: "inline-block", cursor: "not-allowed" }}>
                <Button disabled icon={<CheckOutlined />} style={{ pointerEvents: "none" }}>Leído</Button>
              </span>
            </Tooltip>
          ),
        ]}
      >
        {detalle && (
          <div style={{ display: "grid", gap: 8 }}>
            <Typography.Text type="secondary">{fecha(detalle.createdAt)}</Typography.Text>
            <div>
              <MailOutlined />{" "}
              {detalle.email ? <a href={`mailto:${detalle.email}`}>{detalle.email}</a> : "No dejó email (no se le puede responder)."}
            </div>
            <div style={{ whiteSpace: "pre-wrap", background: "var(--gray-50, #f8fafc)", padding: 12, borderRadius: 8 }}>{detalle.mensaje}</div>
          </div>
        )}
      </Modal>

      <VentEmergConfirmacion
        isOpen={Boolean(marcar)}
        onClose={() => setMarcar(null)}
        title={`¿Marcar como leído el comentario de ${marcar?.nombre || "este usuario"}?`}
        mje="Va a pasar a la pestaña «Leídos». Sirve para saber qué comentarios ya revisó el equipo."
        confirmText="Marcar como leído"
        errorFallback="No pudimos marcar el comentario como leído"
        handleSi={async () => {
          const r = marcar;
          await markFeedbackAsRead(r.id);
          notify.success(`Comentario de ${r.nombre || "usuario"} marcado como leído.`);
          setDb((prev) => prev.map((f) => (f.id === r.id ? { ...f, leido: 1 } : f)));
          setDetalle((d) => (d && d.id === r.id ? { ...d, leido: 1 } : d));
        }}
      />
    </>
  );
};

export default AdminFeedback;
