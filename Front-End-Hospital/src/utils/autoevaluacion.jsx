import React from "react";
import { Descriptions, Grid, Tag } from "antd";

// Fuente única de preguntas de las autoevaluaciones (paciente y equipo de salud usan los mismos textos).
export const PREGUNTAS = {
  general: [
    {
      name: "FrecuenciaSemanal",
      label: "¿Cuántos días por semana hacés actividad física?",
      tipo: "radio",
      requerida: true,
      opciones: ["0 días", "1-2 días", "3-4 días", "5 o más días"],
    },
    {
      name: "DuracionPromedio",
      label: "¿Cuánto duran tus sesiones de ejercicio, en promedio?",
      tipo: "radio",
      requerida: true,
      opciones: ["Menos de 30 minutos", "30 a 60 minutos", "Más de 60 minutos"],
    },
    {
      name: "TipoActividades",
      label: "¿Qué tipo de actividad hacés habitualmente?",
      ayuda: "Marcá todas las que correspondan.",
      tipo: "checks",
      opciones: ["Aeróbico (Cardio)", "Fuerza / Musculación", "Flexibilidad / Estiramientos", "Deportes de equipo"],
    },
    {
      name: "AptitudFisica",
      label: "¿Cómo sentís tu estado físico en general?",
      ayuda: "1 estrella = muy malo, 5 estrellas = excelente.",
      tipo: "rate",
      niveles: ["Muy malo", "Regular", "Bueno", "Muy bueno", "Excelente"],
    },
    {
      name: "BarrerasEjercicio",
      label: "¿Qué te dificulta hacer ejercicio con regularidad?",
      ayuda: "Marcá todas las que correspondan.",
      tipo: "checks",
      opciones: ["Falta de tiempo", "Dolor o limitaciones físicas", "Fatiga / Cansancio", "Falta de motivación"],
    },
    {
      name: "ObjetivosSalud",
      label: "¿Qué querés lograr con el ejercicio?",
      ayuda: "Marcá todas las que correspondan.",
      tipo: "checks",
      opciones: ["Mejorar salud general", "Controlar peso", "Ganar fuerza / Masa muscular", "Controlar patologías crónicas"],
    },
  ],
  ejercicio: [
    {
      name: "BorgScale",
      label: "¿Cuánto esfuerzo te costó? (escala de Borg)",
      ayuda: "1 = como estar en reposo, 10 = el máximo esfuerzo que podés hacer.",
      tipo: "slider",
      min: 1,
      max: 10,
      requerida: true,
      marks: { 1: "Reposo", 5: "Moderado", 10: "Máximo" },
    },
    {
      name: "PainPresent",
      label: "¿Tuviste dolor durante o después del ejercicio?",
      tipo: "radio",
      requerida: true,
      opciones: ["Sí", "No"],
    },
    {
      name: "PainEVA",
      label: "¿Qué tan fuerte fue el dolor? (escala EVA)",
      ayuda: "0 = sin dolor, 10 = el peor dolor imaginable.",
      tipo: "slider",
      min: 0,
      max: 10,
      requerida: true,
      soloSi: { campo: "PainPresent", valor: "Sí" },
      marks: { 0: "0", 5: "5", 10: "10" },
    },
    {
      name: "AlarmSymptoms",
      label: "¿Tuviste alguno de estos síntomas?",
      ayuda: "Marcalos solo si te pasaron. Si no tuviste ninguno, dejalo vacío.",
      tipo: "checks",
      opciones: ["Dolor / Opresión de pecho", "Mareo / Inestabilidad severa", "Dificultad extrema para respirar", "Palpitaciones aceleradas"],
    },
    {
      name: "ExecutionQuality",
      label: "¿Cómo te salió la técnica del ejercicio?",
      tipo: "radio",
      requerida: true,
      opciones: ["Totalmente correcta", "Parcialmente correcta", "No pude realizar la técnica"],
    },
  ],
};

export const OBSERVACIONES = {
  name: "Observaciones",
  label: "¿Querés contarle algo más al equipo?",
  ayuda: "Opcional. Hasta 300 caracteres.",
};

// «Nombre Apellido · Especialidad» (la especialidad solo si está cargada).
export const nombreProfesional = (p) =>
  p ? [`${p.nombre || ""} ${p.apellido || ""}`.trim(), p.especialidad].filter(Boolean).join(" · ") : "";

export const TIPO_LABEL = { general: "General", ejercicio: "De un ejercicio" };

export const preguntasVisibles = (tipo, valores = {}) =>
  (PREGUNTAS[tipo] || []).filter((p) => !p.soloSi || valores[p.soloSi.campo] === p.soloSi.valor);

export const parseRespuestas = (r) => {
  if (!r) return {};
  if (typeof r === "object") return r;
  try {
    return JSON.parse(r);
  } catch {
    return {};
  }
};

export const esAlerta = (r = {}) =>
  (r.PainPresent === "Sí" && Number(r.PainEVA) >= 7) || (Array.isArray(r.AlarmSymptoms) && r.AlarmSymptoms.length > 0);

export const formatFechaHora = (iso) =>
  iso
    ? new Date(iso).toLocaleString("es-AR", {
        timeZone: "America/Argentina/Buenos_Aires",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      })
    : "—";

export const nombreTipo = (a) =>
  a?.tipo === "ejercicio" ? `Ejercicio: ${a?.ejercicio?.nombre || "(ejercicio dado de baja)"}` : "Autoevaluación general";

const valorLegible = (p, v) => {
  if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0)) {
    return <span style={{ color: "var(--gray-500)" }}>{p.tipo === "checks" ? "Ninguno" : "Sin respuesta"}</span>;
  }
  if (Array.isArray(v)) return v.join(", ");
  if (p.tipo === "rate") return `${v} de 5 (${p.niveles?.[v - 1] || ""})`;
  if (p.tipo === "slider") return `${v} de ${p.max}`;
  return String(v);
};

/** Muestra las respuestas con las mismas preguntas que vio el paciente. Solo lectura. */
export const RespuestasAutoevaluacion = ({ tipo, respuestas, column = 1, size = "small" }) => {
  const r = parseRespuestas(respuestas);
  // En pantallas chicas, pregunta arriba y respuesta abajo (no entra en dos columnas).
  const pantallas = Grid.useBreakpoint();
  const layout = pantallas.sm === false ? "vertical" : "horizontal";
  const alertaDolor = r.PainPresent === "Sí" && Number(r.PainEVA) >= 7;
  return (
    <Descriptions
      bordered
      size={size}
      column={column}
      layout={layout}
      labelStyle={{ width: layout === "horizontal" ? "48%" : undefined, fontWeight: 600 }}
    >
      {preguntasVisibles(tipo, r).map((p) => (
        <Descriptions.Item key={p.name} label={p.label}>
          {valorLegible(p, r[p.name])}
          {p.name === "AlarmSymptoms" && r.AlarmSymptoms?.length > 0 && (
            <Tag color="red" style={{ marginLeft: 8 }}>Síntoma de alarma</Tag>
          )}
          {p.name === "PainEVA" && alertaDolor && <Tag color="red" style={{ marginLeft: 8 }}>Dolor intenso</Tag>}
        </Descriptions.Item>
      ))}
      <Descriptions.Item label={OBSERVACIONES.label}>
        {r.Observaciones ? r.Observaciones : <span style={{ color: "var(--gray-500)" }}>Sin comentarios</span>}
      </Descriptions.Item>
    </Descriptions>
  );
};
