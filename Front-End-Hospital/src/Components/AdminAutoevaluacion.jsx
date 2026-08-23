import { useEffect, useState } from "react";
import { Button, Input, Select, Modal, Tabs, Tag, Empty } from "antd";
import { SearchOutlined, EyeOutlined, PrinterOutlined, BarChartOutlined } from "@ant-design/icons";
import { entorno } from "../services/config";
import { AdminEntityList } from "./AdminEntityList";

export const AdminAutoevaluacion = () => {
  const [db, setDb] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profesionales, setProfesionales] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState("1");

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [profesionalId, setProfesionalId] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [alerta, setAlerta] = useState(null);

  // Cargar datos
  const fetchAutoevaluaciones = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${entorno}/autoevaluaciones`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setDb(data);
      }
    } catch (err) {
      console.error("Error al cargar autoevaluaciones", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfesionales = async () => {
    try {
      const res = await fetch(`${entorno}/usuarios/profesionales/lista`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProfesionales(data);
      }
    } catch (err) {
      console.error("Error al cargar profesionales", err);
    }
  };

  useEffect(() => {
    fetchAutoevaluaciones();
    fetchProfesionales();
  }, []);

  const handleOpenDetail = (record) => {
    setSelectedRecord(record);
    setActiveTabKey("1");
    setIsDetailVisible(true);
  };

  // Helper para verificar alertas clínicas
  const checkClinicalAlert = (record) => {
    let respuestas = {};
    try {
      respuestas = typeof record.respuestas === "string" ? JSON.parse(record.respuestas) : record.respuestas;
    } catch (e) {
      return false;
    }
    const eva = respuestas.PainEVA !== undefined ? Number(respuestas.PainEVA) : 0;
    const tieneSintomasAlarma = respuestas.AlarmSymptoms && respuestas.AlarmSymptoms.length > 0;
    return (respuestas.PainPresent === "Sí" && eva >= 7) || tieneSintomasAlarma;
  };

  // Filtrado del lado del cliente
  const filteredData = db.filter((item) => {
    const pacienteNombre = `${item.paciente?.usuario?.nombre || ""} ${item.paciente?.usuario?.apellido || ""}`.toLowerCase();
    const pacienteDni = String(item.paciente?.usuario?.dni || "");
    const matchBusqueda = pacienteNombre.includes(busqueda.toLowerCase()) || pacienteDni.includes(busqueda);

    const matchProfesional = !profesionalId || item.profesionalId === profesionalId;
    const matchTipo = !tipo || item.tipo === tipo;

    const esAlerta = checkClinicalAlert(item);
    const matchAlerta = !alerta || (alerta === "alerta" && esAlerta) || (alerta === "normal" && !esAlerta);

    return matchBusqueda && matchProfesional && matchTipo && matchAlerta;
  });

  const columns = [
    {
      title: "Fecha",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
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
            <div style={{ fontWeight: 600 }}>{u.nombre} {u.apellido}</div>
            <div style={{ fontSize: 12, color: "var(--gray-500)" }}>DNI: {u.dni}</div>
          </div>
        ) : "Paciente no especificado";
      },
    },
    {
      title: "Tipo",
      dataIndex: "tipo",
      key: "tipo",
      render: (text) => (
        <Tag color={text === "general" ? "blue" : "purple"}>
          {text === "general" ? "General" : "Ejercicio"}
        </Tag>
      ),
    },
    {
      title: "Ejercicio / Rutina",
      key: "ejercicio",
      render: (_, record) => record.ejercicio?.nombre || "N/A",
    },
    {
      title: "Médico / Kinesiólogo",
      key: "profesional",
      render: (_, record) => {
        const p = record.profesional;
        return p ? `${p.nombre} ${p.apellido}` : "Sin asignar";
      },
    },
    {
      title: "Dolor (EVA) / Fatiga (Borg)",
      key: "scores",
      render: (_, record) => {
        let respuestas = {};
        try {
          respuestas = typeof record.respuestas === "string" ? JSON.parse(record.respuestas) : record.respuestas;
        } catch (e) {
          console.warn("Error parsing JSON:", e);
        }
        
        if (record.tipo === "general") {
          return <span style={{ color: "var(--gray-400)" }}>N/A</span>;
        }

        const eva = respuestas.PainEVA !== undefined ? respuestas.PainEVA : "N/A";
        const borg = respuestas.BorgScale !== undefined ? respuestas.BorgScale : "N/A";
        
        return (
          <div>
            <div>EVA: <span style={{ fontWeight: 600, color: eva >= 7 ? "var(--red-600)" : "inherit" }}>{eva}/10</span></div>
            <div>Borg: <span style={{ fontWeight: 600 }}>{borg}/10</span></div>
          </div>
        );
      },
    },
    {
      title: "Estado Alerta",
      key: "alerta",
      align: "center",
      render: (_, record) => {
        const esAlerta = checkClinicalAlert(record);
        return esAlerta ? (
          <Tag color="error">ALERTA CRÍTICA</Tag>
        ) : (
          <Tag color="success">Normal</Tag>
        );
      },
    },
    {
      title: "Acción",
      key: "accion",
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          ghost
          icon={<EyeOutlined />}
          onClick={() => handleOpenDetail(record)}
        >
          Ver Detalle
        </Button>
      ),
    },
  ];

  // Helper para renderizar respuestas formateadas
  const renderDetailFields = (record) => {
    if (!record) return null;
    let respuestas = {};
    try {
      respuestas = typeof record.respuestas === "string" ? JSON.parse(record.respuestas) : record.respuestas;
    } catch (e) {
      return <div style={{ color: "var(--red-500)" }}>Error al formatear respuestas del paciente.</div>;
    }

    const itemStyle = {
      padding: "12px 16px",
      borderBottom: "1px solid var(--gray-100)",
      display: "flex",
      flexDirection: "column",
      gap: 4,
    };

    if (record.tipo === "general") {
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={itemStyle}>
            <span style={{ fontSize: 12, color: "var(--gray-500)", textTransform: "uppercase" }}>Frecuencia Semanal de Deporte</span>
            <span style={{ fontWeight: 600 }}>{respuestas.FrecuenciaSemanal || "No especificado"}</span>
          </div>
          <div style={itemStyle}>
            <span style={{ fontSize: 12, color: "var(--gray-500)", textTransform: "uppercase" }}>Duración Promedio de Sesiones</span>
            <span style={{ fontWeight: 600 }}>{respuestas.DuracionPromedio || "No especificado"}</span>
          </div>
          <div style={itemStyle}>
            <span style={{ fontSize: 12, color: "var(--gray-500)", textTransform: "uppercase" }}>Actividades Físicas Habituales</span>
            <div>
              {Array.isArray(respuestas.TipoActividades) && respuestas.TipoActividades.length > 0 ? (
                respuestas.TipoActividades.map((act, i) => <Tag key={i} color="blue">{act}</Tag>)
              ) : (
                "Ninguna especificada"
              )}
            </div>
          </div>
          <div style={itemStyle}>
            <span style={{ fontSize: 12, color: "var(--gray-500)", textTransform: "uppercase" }}>Aptitud Física Percibida</span>
            <span style={{ fontWeight: 600 }}>{respuestas.AptitudFisica ? `${respuestas.AptitudFisica} de 5 estrellas` : "No calificado"}</span>
          </div>
          <div style={itemStyle}>
            <span style={{ fontSize: 12, color: "var(--gray-500)", textTransform: "uppercase" }}>Dificultades / Barreras</span>
            <div>
              {Array.isArray(respuestas.BarrerasEjercicio) && respuestas.BarrerasEjercicio.length > 0 ? (
                respuestas.BarrerasEjercicio.map((barr, i) => <Tag key={i} color="orange">{barr}</Tag>)
              ) : (
                "Ninguna especificada"
              )}
            </div>
          </div>
          <div style={itemStyle}>
            <span style={{ fontSize: 12, color: "var(--gray-500)", textTransform: "uppercase" }}>Objetivos de Salud</span>
            <div>
              {Array.isArray(respuestas.ObjetivosSalud) && respuestas.ObjetivosSalud.length > 0 ? (
                respuestas.ObjetivosSalud.map((obj, i) => <Tag key={i} color="green">{obj}</Tag>)
              ) : (
                "Ninguno especificado"
              )}
            </div>
          </div>
          <div style={itemStyle}>
            <span style={{ fontSize: 12, color: "var(--gray-500)", textTransform: "uppercase" }}>Observaciones</span>
            <p style={{ margin: 0, whiteSpace: "pre-line" }}>{respuestas.Observaciones || "Sin observaciones adicionales."}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={itemStyle}>
            <span style={{ fontSize: 12, color: "var(--gray-500)", textTransform: "uppercase" }}>Ejercicio Evaluado</span>
            <span style={{ fontWeight: 600 }}>{record.ejercicio?.nombre || "No especificado"}</span>
          </div>
          <div style={itemStyle}>
            <span style={{ fontSize: 12, color: "var(--gray-500)", textTransform: "uppercase" }}>Nivel de Esfuerzo Percibido (Borg)</span>
            <span style={{ fontWeight: 600 }}>{respuestas.BorgScale}/10</span>
          </div>
          <div style={itemStyle}>
            <span style={{ fontSize: 12, color: "var(--gray-500)", textTransform: "uppercase" }}>¿Experimentó Dolor?</span>
            <span style={{ fontWeight: 600, color: respuestas.PainPresent === "Sí" ? "var(--red-500)" : "inherit" }}>
              {respuestas.PainPresent || "No especificado"}
            </span>
          </div>
          {respuestas.PainPresent === "Sí" && (
            <div style={itemStyle}>
              <span style={{ fontSize: 12, color: "var(--gray-500)", textTransform: "uppercase" }}>Intensidad del Dolor (EVA)</span>
              <span style={{ fontWeight: 600, color: respuestas.PainEVA >= 7 ? "var(--red-600)" : "inherit" }}>
                {respuestas.PainEVA}/10
              </span>
            </div>
          )}
          <div style={itemStyle}>
            <span style={{ fontSize: 12, color: "var(--gray-500)", textTransform: "uppercase" }}>Síntomas de Alarma</span>
            <div>
              {Array.isArray(respuestas.AlarmSymptoms) && respuestas.AlarmSymptoms.length > 0 ? (
                respuestas.AlarmSymptoms.map((sint, i) => <Tag key={i} color="error">{sint}</Tag>)
              ) : (
                <Tag color="success">Ninguno</Tag>
              )}
            </div>
          </div>
          <div style={itemStyle}>
            <span style={{ fontSize: 12, color: "var(--gray-500)", textTransform: "uppercase" }}>Ejecución del Ejercicio</span>
            <span style={{ fontWeight: 600 }}>{respuestas.ExecutionQuality || "No especificada"}</span>
          </div>
          <div style={itemStyle}>
            <span style={{ fontSize: 12, color: "var(--gray-500)", textTransform: "uppercase" }}>Observaciones</span>
            <p style={{ margin: 0, whiteSpace: "pre-line" }}>{respuestas.Observaciones || "Sin observaciones adicionales."}</p>
          </div>
        </div>
      );
    }
  };

  // Renderizador de gráfico evolutivo SVG sin librerías externas
  const renderEvolutionChart = () => {
    if (!selectedRecord) return null;
    const patientEvals = db
      .filter((item) => item.pacienteId === selectedRecord.pacienteId && item.tipo === "ejercicio")
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    if (patientEvals.length < 2) {
      return (
        <Empty
          description="Se necesitan al menos 2 autoevaluaciones de ejercicios para graficar la evolución kinesiológica temporal."
          style={{ margin: "48px 0" }}
        />
      );
    }

    const mappedPoints = patientEvals.map((e, index) => {
      let resp = {};
      try {
        resp = typeof e.respuestas === "string" ? JSON.parse(e.respuestas) : e.respuestas;
      } catch (err) {
        console.warn("Error parsing JSON:", err);
      }
      const eva = resp.PainEVA !== undefined ? Number(resp.PainEVA) : 0;
      const borg = resp.BorgScale !== undefined ? Number(resp.BorgScale) : 0;
      const date = new Date(e.createdAt).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
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
            <span style={{ fontSize: 12, fontWeight: 500 }}>Fatiga (Borg)</span>
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
          Gráfico ordenado de manera cronológica (izquierda a derecha)
        </span>
      </div>
    );
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    let respuestas = {};
    try {
      respuestas = typeof selectedRecord.respuestas === "string" ? JSON.parse(selectedRecord.respuestas) : selectedRecord.respuestas;
    } catch (e) {
      console.warn("Error parsing JSON:", e);
    }

    const pacienteNombre = `${selectedRecord.paciente?.usuario?.nombre || ""} ${selectedRecord.paciente?.usuario?.apellido || ""}`;
    const pacienteDni = selectedRecord.paciente?.usuario?.dni || "";
    const profesionalNombre = selectedRecord.profesional ? `${selectedRecord.profesional.nombre} ${selectedRecord.profesional.apellido}` : "Sin asignar";
    const fecha = new Date(selectedRecord.createdAt).toLocaleString("es-AR");

    const contentHtml = `
      <html>
        <head>
          <title>Reporte de Autoevaluación Clínica</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            h1 { color: #0284c7; border-bottom: 2px solid #0284c7; padding-bottom: 8px; }
            .meta { margin-bottom: 24px; line-height: 1.6; }
            .meta strong { color: #0369a1; }
            .fields { border-collapse: collapse; width: 100%; margin-top: 20px; }
            .fields th, .fields td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
            .fields th { background: #f8fafc; font-weight: bold; width: 40%; }
          </style>
        </head>
        <body>
          <h1>Reporte de Autoevaluación Clínica</h1>
          <div class="meta">
            <p><strong>Paciente:</strong> ${pacienteNombre} (DNI: ${pacienteDni})</p>
            <p><strong>Profesional a Cargo:</strong> ${profesionalNombre}</p>
            <p><strong>Fecha de Envío:</strong> ${fecha}</p>
            <p><strong>Tipo:</strong> ${selectedRecord.tipo === "general" ? "Autoevaluación General" : "Autoevaluación de Ejercicio"}</p>
          </div>
          <table class="fields">
            ${selectedRecord.tipo === "general" ? `
              <tr><th>Frecuencia Semanal</th><td>${respuestas.FrecuenciaSemanal || "N/A"}</td></tr>
              <tr><th>Duración de Sesiones</th><td>${respuestas.DuracionPromedio || "N/A"}</td></tr>
              <tr><th>Actividades Habituales</th><td>${Array.isArray(respuestas.TipoActividades) ? respuestas.TipoActividades.join(", ") : "N/A"}</td></tr>
              <tr><th>Aptitud Percibida</th><td>${respuestas.AptitudFisica || "N/A"} / 5</td></tr>
              <tr><th>Barreras o Limitaciones</th><td>${Array.isArray(respuestas.BarrerasEjercicio) ? respuestas.BarrerasEjercicio.join(", ") : "N/A"}</td></tr>
              <tr><th>Objetivos de Salud</th><td>${Array.isArray(respuestas.ObjetivosSalud) ? respuestas.ObjetivosSalud.join(", ") : "N/A"}</td></tr>
              <tr><th>Observaciones</th><td>${respuestas.Observaciones || "Sin observaciones."}</td></tr>
            ` : `
              <tr><th>Ejercicio</th><td>${selectedRecord.ejercicio?.nombre || "N/A"}</td></tr>
              <tr><th>Esfuerzo Borg</th><td>${respuestas.BorgScale || "N/A"} / 10</td></tr>
              <tr><th>¿Presentó dolor?</th><td>${respuestas.PainPresent || "N/A"}</td></tr>
              ${respuestas.PainPresent === "Sí" ? `<tr><th>Intensidad EVA</th><td>${respuestas.PainEVA || "N/A"} / 10</td></tr>` : ""}
              <tr><th>Síntomas de Alarma</th><td>${Array.isArray(respuestas.AlarmSymptoms) ? respuestas.AlarmSymptoms.join(", ") : "Ninguno"}</td></tr>
              <tr><th>Técnica</th><td>${respuestas.ExecutionQuality || "N/A"}</td></tr>
              <tr><th>Observaciones</th><td>${respuestas.Observaciones || "Sin observaciones."}</td></tr>
            `}
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(contentHtml);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <AdminEntityList
        title="Autoevaluaciones Clínicas"
        count={filteredData.length}
        extraFilters={
          <>
            <Input
              prefix={<SearchOutlined style={{ color: "var(--gray-400)" }} />}
              placeholder="Buscar por Paciente o DNI..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              allowClear
            />

            <Select
              placeholder="Filtrar por Profesional"
              value={profesionalId}
              onChange={(val) => setProfesionalId(val)}
              allowClear
            >
              {profesionales.map((p) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.nombre} {p.apellido}
                </Select.Option>
              ))}
            </Select>

            <Select
              placeholder="Filtrar por Tipo"
              value={tipo}
              onChange={(val) => setTipo(val)}
              allowClear
            >
              <Select.Option value="general">Autoevaluación General</Select.Option>
              <Select.Option value="ejercicio">Ejercicio Específico</Select.Option>
            </Select>

            <Select
              placeholder="Estado de Alerta"
              value={alerta}
              onChange={(val) => setAlerta(val)}
              allowClear
            >
              <Select.Option value="alerta">Alertas Críticas</Select.Option>
              <Select.Option value="normal">Estado Normal</Select.Option>
            </Select>
          </>
        }
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        emptyText="Sin autoevaluaciones registradas"
      />

      <Modal
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: 32 }}>
            <span>Detalle Clínico de Autoevaluación</span>
            <Button icon={<PrinterOutlined />} onClick={handlePrint} type="dashed">
              Imprimir Reporte
            </Button>
          </div>
        }
        open={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={null}
        width={550}
        destroyOnClose
      >
        {selectedRecord && (
          <div style={{ paddingTop: 12 }}>
            <div style={{ marginBottom: 16, background: "var(--gray-50)", padding: 12, borderRadius: 8, border: "1px solid var(--gray-100)" }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>
                {selectedRecord.paciente?.usuario?.nombre} {selectedRecord.paciente?.usuario?.apellido}
              </div>
              <div style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 4 }}>
                DNI: {selectedRecord.paciente?.usuario?.dni} | Fecha: {new Date(selectedRecord.createdAt).toLocaleString("es-AR")}
              </div>
            </div>

            <Tabs activeKey={activeTabKey} onChange={(key) => setActiveTabKey(key)}>
              <Tabs.TabPane tab="Respuestas del Formulario" key="1">
                {renderDetailFields(selectedRecord)}
              </Tabs.TabPane>
              {selectedRecord.tipo === "ejercicio" && (
                <Tabs.TabPane
                  tab={
                    <span>
                      <BarChartOutlined /> Evolución Temporal
                    </span>
                  }
                  key="2"
                >
                  {renderEvolutionChart()}
                </Tabs.TabPane>
              )}
            </Tabs>
          </div>
        )}
      </Modal>
    </>
  );
};
