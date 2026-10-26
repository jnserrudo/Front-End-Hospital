import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, Empty, Modal, Skeleton, Table, Tag } from "antd";
import { EyeOutlined, HeartOutlined, ReloadOutlined } from "@ant-design/icons";
import { apiFetch, friendlyMessage } from "../services/http";
import { RespuestasAutoevaluacion, formatFechaHora, nombreProfesional, nombreTipo } from "../utils/autoevaluacion";

export const EstadoAutoevaluacion = ({ a }) =>
  a?.revisada === 1 ? <Tag color="green">Revisada</Tag> : <Tag color="gold">Esperando revisión</Tag>;

/** Historial del paciente: lo que envió, a quién, si ya la revisaron y la devolución. */
export const MisAutoevaluaciones = ({ recargar = 0, onNueva }) => {
  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [detalle, setDetalle] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      const data = await apiFetch("/autoevaluaciones/mias");
      setLista(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err) err.notified = true;
      setError(friendlyMessage(err, "No pudimos cargar tus autoevaluaciones"));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar, recargar]);

  if (cargando) return <Skeleton active paragraph={{ rows: 4 }} />;
  if (error) {
    return (
      <Alert
        type="error"
        showIcon
        message={error}
        action={
          <Button size="small" icon={<ReloadOutlined />} onClick={cargar}>
            Reintentar
          </Button>
        }
      />
    );
  }
  if (lista.length === 0) {
    return (
      <Empty
        style={{ margin: "40px 0" }}
        description={
          <>
            <div style={{ fontWeight: 600 }}>Todavía no enviaste ninguna autoevaluación</div>
            <div style={{ color: "var(--gray-500)" }}>
              Hacé la general para contarnos cómo es tu actividad física, o tocá «Autoevaluar» en un video después de hacer el ejercicio.
            </div>
          </>
        }
      >
        {onNueva && (
          <Button type="primary" icon={<HeartOutlined />} onClick={onNueva}>
            Hacer autoevaluación general
          </Button>
        )}
      </Empty>
    );
  }

  const columnas = [
    { title: "Fecha", dataIndex: "createdAt", width: 150, render: (v) => formatFechaHora(v) },
    { title: "Autoevaluación", key: "tipo", render: (_, a) => nombreTipo(a) },
    {
      title: "Enviada a",
      key: "prof",
      render: (_, a) => (a.profesional ? nombreProfesional(a.profesional) : "Equipo de salud"),
    },
    { title: "Estado", key: "estado", width: 160, render: (_, a) => <EstadoAutoevaluacion a={a} /> },
    {
      title: "",
      key: "ver",
      width: 120,
      render: (_, a) => (
        <Button size="small" icon={<EyeOutlined />} onClick={() => setDetalle(a)}>
          Ver detalle
        </Button>
      ),
    },
  ];

  return (
    <>
      <p style={{ color: "var(--gray-600)", marginBottom: 12 }}>
        Acá ves todas las autoevaluaciones que enviaste. Cuando alguien del equipo la revisa, el estado cambia a «Revisada» y, si te dejó un comentario, lo ves en el detalle.
      </p>
      <Table rowKey="id" columns={columnas} dataSource={lista} pagination={{ pageSize: 10, hideOnSinglePage: true }} scroll={{ x: 640 }} />
      <Modal
        open={Boolean(detalle)}
        title={detalle ? `${nombreTipo(detalle)} · ${formatFechaHora(detalle.createdAt)}` : ""}
        onCancel={() => setDetalle(null)}
        footer={<Button onClick={() => setDetalle(null)}>Cerrar</Button>}
        width={700}
      >
        {detalle && (
          <>
            {detalle.revisada === 1 ? (
              <Alert
                type="success"
                showIcon
                style={{ marginBottom: 12 }}
                message={`Revisada por ${detalle.revisadaPorNombre || "el equipo de salud"} el ${formatFechaHora(detalle.revisadaAt)}`}
                description={detalle.devolucion ? `Devolución: ${detalle.devolucion}` : "No dejó comentarios adicionales."}
              />
            ) : (
              <Alert
                type="info"
                showIcon
                style={{ marginBottom: 12 }}
                message="Todavía no la revisaron"
                description="Cuando el equipo la lea, acá vas a ver su devolución. Las respuestas enviadas no se pueden modificar."
              />
            )}
            <RespuestasAutoevaluacion tipo={detalle.tipo} respuestas={detalle.respuestas} />
          </>
        )}
      </Modal>
    </>
  );
};

export default MisAutoevaluaciones;
