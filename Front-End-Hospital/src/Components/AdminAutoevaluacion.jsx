import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, DatePicker, Input, Modal, Select, Skeleton, Tabs, Tag, Empty } from "antd";
import { SearchOutlined, EyeOutlined, PrinterOutlined, BarChartOutlined, CheckCircleOutlined, ReloadOutlined, EditOutlined } from "@ant-design/icons";
import { AdminEntityList } from "./AdminEntityList";
import { RowActions } from "./RowActions";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { apiFetch, friendlyMessage } from "../services/http";
import { getSession } from "../services/session";
import { notify } from "../ui/notify";
import {
  OBSERVACIONES,
  RespuestasAutoevaluacion,
  formatFechaHora,
  nombreProfesional,
  nombreTipo,
  parseRespuestas,
  preguntasVisibles,
} from "../utils/autoevaluacion";

const { RangePicker } = DatePicker;

const escapeHtml = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const nombrePaciente = (a) => {
  const u = a?.paciente?.usuario;
  return u ? `${u.nombre} ${u.apellido}` : "Paciente sin cuenta vinculada";
};

export const AdminAutoevaluacion = () => {
  const yo = getSession();
  const [db, setDb] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profesionales, setProfesionales] = useState([]);
  const [patologias, setPatologias] = useState([]);

  // Filtros (fecha, patología, profesional, tipo y estado los resuelve el servidor)
  const [busqueda, setBusqueda] = useState("");
  const [profesionalId, setProfesionalId] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [alerta, setAlerta] = useState(null);
  const [estado, setEstado] = useState(null);
  const [patologiaId, setPatologiaId] = useState(null);
  const [rango, setRango] = useState(null);

  // Detalle
  const [detalle, setDetalle] = useState(null);
  const [historial, setHistorial] = useState(null);
  const [devolucion, setDevolucion] = useState("");
  const [editandoDevolucion, setEditandoDevolucion] = useState(false);
  const [confirmarRevision, setConfirmarRevision] = useState(false);

  const query = useMemo(() => {
    const q = new URLSearchParams();
    if (profesionalId) q.set("profesionalId", profesionalId);
    if (tipo) q.set("tipo", tipo);
    if (estado !== null && estado !== undefined) q.set("revisada", estado);
    if (patologiaId) q.set("patologiaId", patologiaId);
    if (rango?.[0]) q.set("desde", rango[0].format("YYYY-MM-DD"));
    if (rango?.[1]) q.set("hasta", rango[1].format("YYYY-MM-DD"));
    return q.toString();
  }, [profesionalId, tipo, estado, patologiaId, rango]);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch(`/autoevaluaciones${query ? `?${query}` : ""}`);
      setDb(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err) err.notified = true;
      setError(friendlyMessage(err, "No pudimos cargar las autoevaluaciones"));
      setDb([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  useEffect(() => {
    apiFetch("/usuarios/profesionales/lista")
      .then((d) => Array.isArray(d) && setProfesionales(d))
      .catch((err) => err && (err.notified = true));
    apiFetch("/patologias")
      .then((d) => Array.isArray(d) && setPatologias(d))
      .catch((err) => err && (err.notified = true));
  }, []);

  const abrirDetalle = async (record) => {
    setDetalle(record);
    setDevolucion(record.devolucion || "");
    setEditandoDevolucion(record.revisada !== 1);
    setHistorial(null);
    try {
      const h = await apiFetch(`/autoevaluaciones?pacienteId=${record.pacienteId}&tipo=ejercicio`);
      setHistorial(Array.isArray(h) ? h : []);
    } catch (err) {
      if (err) err.notified = true;
      setHistorial([]);
    }
  };

  const guardarRevision = async () => {
    const actualizada = await apiFetch(`/autoevaluaciones/${detalle.id}/revision`, {
      method: "PUT",
      body: { devolucion },
    });
    const quien = nombrePaciente(actualizada);
    const avisoEmail = {
      enviado: ` y le avisamos por email a ${quien}`,
      sin_email: `. ${quien} no tiene email cargado: va a ver la devolución cuando entre a la app`,
      fallo: ". No pudimos mandarle el email ahora, pero va a ver la devolución cuando entre a la app",
      sin_cambios: "",
      sin_devolucion: "",
    }[actualizada.email] ?? "";
    const base = actualizada.devolucion
      ? `Guardamos tu devolución para ${quien}`
      : `Autoevaluación de ${quien} marcada como revisada`;
    if (actualizada.email === "fallo" || actualizada.email === "sin_email") notify.warning(`${base}${avisoEmail}.`);
    else notify.success(`${base}${avisoEmail}.`);
    setDb((prev) => prev.map((a) => (a.id === actualizada.id ? actualizada : a)));
    setDetalle(actualizada);
    setEditandoDevolucion(false);
  };

  const texto = busqueda.trim().toLowerCase();
  const filteredData = db.filter((item) => {
    const u = item.paciente?.usuario;
    const matchBusqueda =
      !texto || `${u?.nombre || ""} ${u?.apellido || ""}`.toLowerCase().includes(texto) || String(u?.dni || "").includes(texto);
    const matchAlerta = !alerta || (alerta === "alerta" && item.alerta) || (alerta === "normal" && !item.alerta);
    return matchBusqueda && matchAlerta;
  });

  const hayFiltros = Boolean(busqueda || profesionalId || tipo || alerta || estado !== null || patologiaId || rango);
  const limpiarFiltros = () => {
    setBusqueda("");
    setProfesionalId(null);
    setTipo(null);
    setAlerta(null);
    setEstado(null);
    setPatologiaId(null);
    setRango(null);
  };

  const columns = [
    {
      title: "Fecha",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => formatFechaHora(text),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: "descend",
    },
    {
      title: "Paciente",
      key: "paciente",
      render: (_, record) => {
        const u = record.paciente?.usuario;
        return u ? (
          <div>
            <div style={{ fontWeight: 600 }}>
              {u.nombre} {u.apellido}
            </div>
            <div style={{ fontSize: 12, color: "var(--gray-500)" }}>DNI: {u.dni}</div>
          </div>
        ) : (
          "Paciente sin cuenta vinculada"
        );
      },
    },
    {
      title: "Patologías",
      key: "patologias",
      render: (_, r) =>
        r.patologias?.length ? r.patologias.map((p) => <Tag key={p.id}>{p.nombre}</Tag>) : <span style={{ color: "var(--gray-500)" }}>Sin patologías</span>,
    },
    {
      title: "Autoevaluación",
      key: "tipo",
      render: (_, r) => (
        <div>
          <Tag color={r.tipo === "general" ? "blue" : "purple"}>{r.tipo === "general" ? "General" : "Ejercicio"}</Tag>
          {r.tipo === "ejercicio" && <div style={{ fontSize: 12, marginTop: 4 }}>{r.ejercicio?.nombre || "(ejercicio dado de baja)"}</div>}
        </div>
      ),
    },
    {
      title: "Enviada a",
      key: "profesional",
      render: (_, record) => (record.profesional ? nombreProfesional(record.profesional) : "Equipo de salud"),
    },
    {
      title: "Estado",
      key: "estado",
      render: (_, r) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}>
          {r.revisada === 1 ? <Tag color="green">Revisada</Tag> : <Tag color="gold">Sin revisar</Tag>}
          {r.alerta && <Tag color="error">Atender primero</Tag>}
        </div>
      ),
    },
    {
      title: "Acciones",
      key: "accion",
      align: "center",
      render: (_, record) => (
        <RowActions
          actions={[
            { key: "ver", label: "Ver detalle y revisar", icon: <EyeOutlined />, onClick: () => abrirDetalle(record) },
          ]}
        />
      ),
    },
  ];

  // Renderizador de gráfico evolutivo SVG sin librerías externas
  const renderEvolutionChart = () => {
    if (!detalle) return null;
    if (historial === null) return <Skeleton active paragraph={{ rows: 4 }} />;
    const patientEvals = [...historial].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    if (patientEvals.length < 2) {
      return (
        <Empty
          description="Para ver la evolución hacen falta al menos 2 autoevaluaciones de ejercicios de este paciente."
          style={{ margin: "48px 0" }}
        />
      );
    }

    const mappedPoints = patientEvals.map((e, index) => {
      const resp = parseRespuestas(e.respuestas);
      const eva = resp.PainEVA !== undefined ? Number(resp.PainEVA) : 0;
      const borg = resp.BorgScale !== undefined ? Number(resp.BorgScale) : 0;
      const date = new Date(e.createdAt).toLocaleDateString("es-AR", { timeZone: "America/Argentina/Buenos_Aires", day: "2-digit", month: "2-digit" });
      return {
        x: 50 + (patientEvals.length > 1 ? (index / (patientEvals.length - 1)) * 420 : 0),
        y_eva: 185 - (eva / 10) * 150,
        y_borg: 185 - (borg / 10) * 150,
        eva,
        borg,
        date,
      };
    });

    const buildPath = (yField) => {
      return mappedPoints.reduce((path, pt, index) => {
        const cmd = index === 0 ? "M" : "L";
        return `${path} ${cmd} ${pt.x} ${pt[yField]}`;
      }, "");
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <div style={{ display: "flex", gap: 16, marginBottom: 12, justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
            <span style={{ fontSize: 12, fontWeight: 500 }}>Dolor (EVA)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
            <span style={{ fontSize: 12, fontWeight: 500 }}>Esfuerzo (Borg)</span>
          </div>
        </div>
        <div style={{ position: "relative", width: "100%", maxWidth: 500, background: "#fafafa", borderRadius: 8, padding: 8, border: "1px solid #e5e7eb" }}>
          <svg viewBox="0 0 500 220" style={{ width: "100%" }}>
            {/* Grid Lines */}
            {[0, 2, 4, 6, 8, 10].map((val) => {
              const y = 185 - (val / 10) * 150;
              return (
                <g key={val}>
                  <line x1="45" y1={y} x2="480" y2={y} stroke="#e5e7eb" strokeDasharray="3,3" />
                  <text x="35" y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{val}</text>
                </g>
              );
            })}
            
            {/* Paths */}
            <path d={buildPath("y_eva")} fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d={buildPath("y_borg")} fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Circles for interactive feeling */}
            {mappedPoints.map((pt, index) => (
              <g key={index}>
                <circle cx={pt.x} cy={pt.y_eva} r="5" fill="#ef4444" stroke="white" strokeWidth="1.5" />
                <circle cx={pt.x} cy={pt.y_borg} r="5" fill="#f59e0b" stroke="white" strokeWidth="1.5" />
                
                {/* Dates beneath */}
                <text x={pt.x} y="205" textAnchor="middle" fontSize="9" fill="#6b7280" transform={`rotate(-15, ${pt.x}, 205)`}>
                  {pt.date}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <span style={{ fontSize: 11, color: "var(--gray-400)", marginTop: 16 }}>
          De la más vieja (izquierda) a la más reciente (derecha). Solo autoevaluaciones de ejercicios.
        </span>
      </div>
    );
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      notify.error("Tu navegador bloqueó la ventana de impresión. Permití las ventanas emergentes para este sitio e intentá de nuevo.");
      return;
    }
    const r = parseRespuestas(detalle.respuestas);
    const u = detalle.paciente?.usuario;
    const filas = [...preguntasVisibles(detalle.tipo, r), OBSERVACIONES]
      .map((p) => {
        const v = r[p.name];
        const txt = Array.isArray(v) ? (v.length ? v.join(", ") : "Ninguno") : v === undefined || v === "" ? "Sin respuesta" : v;
        return `<tr><th>${escapeHtml(p.label)}</th><td>${escapeHtml(txt)}</td></tr>`;
      })
      .join("");
    const html = `<html><head><title>Autoevaluación</title><style>
      body{font-family:sans-serif;padding:40px;color:#333} h1{color:#0369a1;border-bottom:2px solid #0369a1;padding-bottom:8px}
      .meta{margin-bottom:24px;line-height:1.6} .meta strong{color:#0369a1}
      table{border-collapse:collapse;width:100%;margin-top:20px} th,td{border:1px solid #e2e8f0;padding:10px;text-align:left;vertical-align:top}
      th{background:#f8fafc;width:45%}</style></head><body>
      <h1>Autoevaluación del paciente</h1>
      <div class="meta">
        <p><strong>Paciente:</strong> ${escapeHtml(u ? `${u.nombre} ${u.apellido}` : "Sin cuenta vinculada")} (DNI: ${escapeHtml(u?.dni ?? "—")})</p>
        <p><strong>Patologías:</strong> ${escapeHtml((detalle.patologias || []).map((p) => p.nombre).join(", ") || "Sin patologías")}</p>
        <p><strong>Enviada a:</strong> ${escapeHtml(detalle.profesional ? nombreProfesional(detalle.profesional) : "Equipo de salud")}</p>
        <p><strong>Fecha:</strong> ${escapeHtml(formatFechaHora(detalle.createdAt))}</p>
        <p><strong>Tipo:</strong> ${escapeHtml(nombreTipo(detalle))}</p>
        <p><strong>Estado:</strong> ${detalle.revisada === 1 ? `Revisada por ${escapeHtml(detalle.revisadaPorNombre || "")} el ${escapeHtml(formatFechaHora(detalle.revisadaAt))}` : "Sin revisar"}</p>
        ${detalle.devolucion ? `<p><strong>Devolución:</strong> ${escapeHtml(detalle.devolucion)}</p>` : ""}
      </div>
      <table>${filas}</table></body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const revisionPanel = detalle && (
    <div style={{ marginTop: 16, padding: 12, border: "1px solid var(--gray-200)", borderRadius: 8, background: "var(--gray-50)" }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Devolución al paciente</div>
      {detalle.revisada === 1 && !editandoDevolucion ? (
        <>
          <Alert
            type="success"
            showIcon
            message={`Revisada por ${detalle.revisadaPorNombre || "el equipo"} el ${formatFechaHora(detalle.revisadaAt)}`}
            description={detalle.devolucion ? detalle.devolucion : "Se marcó como revisada sin comentarios."}
          />
          <Button style={{ marginTop: 8 }} icon={<EditOutlined />} onClick={() => setEditandoDevolucion(true)}>
            Cambiar devolución
          </Button>
        </>
      ) : (
        <>
          <Input.TextArea
            rows={3}
            maxLength={1000}
            showCount
            value={devolucion}
            onChange={(e) => setDevolucion(e.target.value)}
            placeholder="Opcional. Por ejemplo: «Bajá la intensidad esta semana y consultanos si el dolor sigue»."
          />
          <div style={{ fontSize: 12, color: "var(--gray-500)", margin: "6px 0 8px" }}>
            El paciente ve esta devolución en «Ejercitarse › Mis autoevaluaciones» y, si tiene email cargado, le avisamos por correo.
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            {detalle.revisada === 1 && (
              <Button
                onClick={() => {
                  setDevolucion(detalle.devolucion || "");
                  setEditandoDevolucion(false);
                }}
              >
                Cancelar
              </Button>
            )}
            <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => setConfirmarRevision(true)}>
              {detalle.revisada === 1 ? "Guardar devolución" : "Marcar como revisada"}
            </Button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      {error && (
        <Alert
          type="error"
          showIcon
          style={{ marginBottom: 12 }}
          message={error}
          action={
            <Button size="small" icon={<ReloadOutlined />} onClick={cargar}>
              Reintentar
            </Button>
          }
        />
      )}
      <AdminEntityList
        title="Autoevaluaciones de pacientes"
        count={filteredData.length}
        extraFilters={
          <>
            <Input
              prefix={<SearchOutlined style={{ color: "var(--gray-400)" }} />}
              placeholder="Buscar paciente por nombre o DNI"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              allowClear
            />
            <RangePicker
              value={rango}
              onChange={setRango}
              format="DD/MM/YYYY"
              placeholder={["Desde", "Hasta"]}
              allowEmpty={[true, true]}
            />
            <Select
              placeholder="Patología"
              value={patologiaId}
              onChange={setPatologiaId}
              allowClear
              showSearch
              optionFilterProp="label"
              options={patologias.map((p) => ({ value: p.id, label: p.nombre }))}
              notFoundContent="No hay patologías cargadas"
            />
            <Select
              placeholder="Enviada a"
              value={profesionalId}
              onChange={setProfesionalId}
              allowClear
              title={profesionales.length === 0 ? "Todavía no hay profesionales con cuenta: todas llegan al «Equipo de salud»" : undefined}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  {profesionales.length === 0 && (
                    <div style={{ padding: "8px 12px", fontSize: 12, color: "var(--gray-500)", borderTop: "1px solid var(--gray-200)", whiteSpace: "normal" }}>
                      Todavía no hay profesionales con cuenta. Un administrador los crea en Administración › Usuarios con el rol «Profesional de salud».
                    </div>
                  )}
                </>
              )}
              options={[
                ...(yo?.id && profesionales.some((p) => p.id === +yo.id) ? [{ value: String(yo.id), label: "Enviadas a mí" }] : []),
                { value: "sin", label: "Equipo de salud (sin profesional)" },
                ...profesionales.filter((p) => p.id !== +yo?.id).map((p) => ({ value: String(p.id), label: nombreProfesional(p) })),
              ]}
            />
            <Select
              placeholder="Tipo"
              value={tipo}
              onChange={setTipo}
              allowClear
              options={[
                { value: "general", label: "General" },
                { value: "ejercicio", label: "De un ejercicio" },
              ]}
            />
            <Select
              placeholder="Estado"
              value={estado}
              onChange={(v) => setEstado(v ?? null)}
              allowClear
              options={[
                { value: "0", label: "Sin revisar" },
                { value: "1", label: "Revisadas" },
              ]}
            />
            <Select
              placeholder="Alertas"
              value={alerta}
              onChange={setAlerta}
              allowClear
              options={[
                { value: "alerta", label: "Con alerta (atender primero)" },
                { value: "normal", label: "Sin alertas" },
              ]}
            />
            {hayFiltros && <Button onClick={limpiarFiltros}>Limpiar filtros</Button>}
          </>
        }
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        emptyText={
          error
            ? "No pudimos cargar la lista"
            : hayFiltros
            ? "Ninguna autoevaluación coincide con los filtros. Probá quitando alguno."
            : "Todavía no llegó ninguna autoevaluación. Aparecen acá cuando un paciente la envía desde «Ejercitarse»."
        }
      />

      <Modal
        title={detalle ? `Autoevaluación de ${nombrePaciente(detalle)}` : ""}
        open={Boolean(detalle)}
        onCancel={() => setDetalle(null)}
        footer={[
          <Button key="print" icon={<PrinterOutlined />} onClick={handlePrint}>
            Imprimir
          </Button>,
          <Button key="close" onClick={() => setDetalle(null)}>
            Cerrar
          </Button>,
        ]}
        width={720}
        destroyOnClose
      >
        {detalle && (
          <div style={{ paddingTop: 4 }}>
            <div style={{ marginBottom: 12, background: "var(--gray-50)", padding: 12, borderRadius: 8, border: "1px solid var(--gray-100)" }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>
                {nombrePaciente(detalle)} {detalle.alerta && <Tag color="error" style={{ marginLeft: 6 }}>Atender primero</Tag>}
              </div>
              <div style={{ fontSize: 13, color: "var(--gray-600)", marginTop: 4 }}>
                DNI: {detalle.paciente?.usuario?.dni ?? "—"} · {nombreTipo(detalle)} · Enviada el {formatFechaHora(detalle.createdAt)} a{" "}
                {detalle.profesional ? nombreProfesional(detalle.profesional) : "el equipo de salud"}
              </div>
              <div style={{ marginTop: 6 }}>
                {(detalle.patologias || []).length
                  ? detalle.patologias.map((p) => <Tag key={p.id}>{p.nombre}</Tag>)
                  : <span style={{ fontSize: 12, color: "var(--gray-500)" }}>Sin patologías asignadas</span>}
              </div>
            </div>
            <Alert
              type="info"
              showIcon
              style={{ marginBottom: 12 }}
              message="Solo lectura"
              description="Estas son las respuestas tal como las envió el paciente y no se pueden modificar. Si hace falta, dejale una devolución abajo."
            />
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  key: "1",
                  label: "Respuestas",
                  children: <RespuestasAutoevaluacion tipo={detalle.tipo} respuestas={detalle.respuestas} />,
                },
                {
                  key: "2",
                  label: (
                    <span>
                      <BarChartOutlined /> Evolución
                    </span>
                  ),
                  children: renderEvolutionChart(),
                },
              ]}
            />
            {revisionPanel}
          </div>
        )}
      </Modal>

      <VentEmergConfirmacion
        isOpen={confirmarRevision}
        onClose={() => setConfirmarRevision(false)}
        title={
          detalle?.revisada === 1
            ? `¿Guardar la nueva devolución para ${nombrePaciente(detalle)}?`
            : `¿Marcar como revisada la autoevaluación de ${nombrePaciente(detalle)}?`
        }
        mje={
          devolucion.trim()
            ? `${nombrePaciente(detalle)} va a ver el estado «Revisada» y tu devolución en su historial de autoevaluaciones. ${
                detalle?.paciente?.usuario?.tieneEmail
                  ? "Además le vamos a avisar por email."
                  : "No tiene email cargado, así que no le llega aviso por correo: la va a ver cuando entre a la app."
              }`
            : "El paciente va a ver el estado «Revisada» en su historial. No escribiste devolución: si querés dejarle un comentario, cancelá y escribilo."
        }
        confirmText={detalle?.revisada === 1 ? "Guardar devolución" : "Marcar como revisada"}
        errorFallback="No pudimos guardar la revisión"
        handleSi={guardarRevision}
      />
    </>
  );
};
