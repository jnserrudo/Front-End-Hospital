import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Checkbox, Form, Input, Modal, Progress, Radio, Rate, Result, Select, Slider, Steps } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined, SendOutlined, WarningOutlined } from "@ant-design/icons";
import { apiFetch, friendlyMessage } from "../services/http";
import { OBSERVACIONES, PREGUNTAS, RespuestasAutoevaluacion, esAlerta, nombreProfesional, preguntasVisibles } from "../utils/autoevaluacion";

const SIN_PROFESIONAL = "equipo";

// Form.Item le pasa value/onChange: hay que reenviarlos al control.
const Campo = ({ p, ...control }) => {
  if (p.tipo === "radio") {
    return (
      <Radio.Group {...control} style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {p.opciones.map((o) => (
          <Radio.Button key={o} value={o}>
            {o}
          </Radio.Button>
        ))}
      </Radio.Group>
    );
  }
  if (p.tipo === "checks") {
    return (
      <Checkbox.Group {...control} style={{ width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
          {p.opciones.map((o) => (
            <Checkbox key={o} value={o}>
              {o}
            </Checkbox>
          ))}
        </div>
      </Checkbox.Group>
    );
  }
  if (p.tipo === "rate") return <Rate {...control} tooltips={p.niveles} style={{ fontSize: 26 }} />;
  if (p.tipo === "slider") return <Slider {...control} min={p.min} max={p.max} marks={p.marks} />;
  return <Input {...control} />;
};

/**
 * Autoevaluación del paciente en 3 pasos: qué es → preguntas (con progreso) → revisar y confirmar.
 * Props: open, onClose, tipo ("general" | "ejercicio"), ejercicio, profesionales, onEnviada
 */
export const AutoevaluacionWizard = ({ open, onClose, tipo = "general", ejercicio = null, profesionales = [], onEnviada }) => {
  const [form] = Form.useForm();
  const [paso, setPaso] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [enviada, setEnviada] = useState(null);
  // Valores actuales (para el progreso y para mostrar/ocultar la pregunta del dolor).
  const [valores, setValores] = useState({});

  useEffect(() => {
    if (open) {
      form.resetFields();
      setValores(form.getFieldsValue(true));
      setPaso(0);
      setError("");
      setEnviada(null);
    }
  }, [open, tipo, ejercicio, form]);

  const preguntas = preguntasVisibles(tipo, valores);
  const respondidas = preguntas.filter((p) => {
    const v = valores[p.name];
    return p.tipo === "checks" ? Array.isArray(v) : v !== undefined && v !== null && v !== "";
  }).length;
  const porcentaje = preguntas.length ? Math.round((respondidas / preguntas.length) * 100) : 0;

  const profesionalId = valores.profesionalId;
  const profesional = profesionales.find((p) => p.id === profesionalId);
  const destinatario = profesional ? `${profesional.nombre} ${profesional.apellido}` : "el equipo de salud";
  const aDestinatario = profesional ? `a ${destinatario}` : "al equipo de salud";
  const titulo = tipo === "general" ? "Autoevaluación general" : `Autoevaluación de «${ejercicio?.nombre || "ejercicio"}»`;
  const hayAlerta = esAlerta(valores);

  const initialValues = useMemo(
    () => ({ profesionalId: SIN_PROFESIONAL, ...(tipo === "ejercicio" ? { BorgScale: 5 } : {}) }),
    [tipo]
  );

  const siguiente = async () => {
    setError("");
    try {
      if (paso === 0) await form.validateFields(["profesionalId"]);
      if (paso === 1) await form.validateFields([...preguntas.map((p) => p.name), OBSERVACIONES.name]);
      setPaso(paso + 1);
    } catch {
      setError("Te faltan respuestas obligatorias (marcadas en rojo). Completalas para seguir.");
    }
  };

  const enviar = async () => {
    setEnviando(true);
    setError("");
    const { profesionalId: prof, ...resto } = form.getFieldsValue(true);
    const respuestas = {};
    [...preguntas.map((p) => p.name), OBSERVACIONES.name].forEach((k) => {
      if (resto[k] !== undefined) respuestas[k] = resto[k];
    });
    try {
      const creada = await apiFetch("/autoevaluaciones", {
        method: "POST",
        body: {
          tipo,
          ejercicioId: tipo === "ejercicio" ? ejercicio?.id : null,
          profesionalId: prof && prof !== SIN_PROFESIONAL ? +prof : null,
          respuestas,
        },
      });
      setEnviada(creada);
      setPaso(3);
      onEnviada?.(creada);
    } catch (err) {
      if (err) err.notified = true;
      setError(friendlyMessage(err, "No pudimos enviar tu autoevaluación. Tus respuestas siguen acá: probá de nuevo en unos minutos."));
    } finally {
      setEnviando(false);
    }
  };

  const cerrar = () => {
    if (enviando) return;
    onClose?.();
  };

  const footer =
    paso === 3
      ? [
          <Button key="ok" type="primary" onClick={cerrar}>
            Listo
          </Button>,
        ]
      : [
          paso > 0 ? (
            <Button key="back" icon={<ArrowLeftOutlined />} onClick={() => setPaso(paso - 1)} disabled={enviando}>
              Volver
            </Button>
          ) : (
            <Button key="cancel" onClick={cerrar}>
              Cancelar
            </Button>
          ),
          paso < 2 ? (
            <Button key="next" type="primary" onClick={siguiente}>
              {paso === 0 ? "Empezar" : "Revisar respuestas"} <ArrowRightOutlined />
            </Button>
          ) : (
            <Button key="send" type="primary" icon={<SendOutlined />} loading={enviando} onClick={enviar}>
              Confirmar y enviar
            </Button>
          ),
        ];

  return (
    <Modal
      title={titulo}
      open={open}
      onCancel={cerrar}
      footer={footer}
      width={700}
      maskClosable={false}
      destroyOnClose
    >
      <Steps
        size="small"
        current={paso}
        style={{ margin: "8px 0 20px" }}
        items={[{ title: "Antes de empezar" }, { title: "Preguntas" }, { title: "Revisar y enviar" }, { title: "Enviada" }]}
      />

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        preserve
        requiredMark
        onValuesChange={() => {
          setValores(form.getFieldsValue(true));
          setError("");
        }}
      >
        <div style={{ display: paso === 0 ? "block" : "none" }}>
          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
            message="¿Qué es y para qué sirve?"
            description={
              tipo === "general"
                ? "Son unas preguntas cortas sobre cómo hacés actividad física en tu día a día. Con tus respuestas, el equipo de salud puede ajustar tu plan de ejercicios. Te lleva unos 2 minutos."
                : `Contanos cómo te fue al hacer «${ejercicio?.nombre || "el ejercicio"}»: cuánto esfuerzo te costó, si tuviste dolor y cómo te salió la técnica. Así tu profesional sabe si hay que ajustarlo. Te lleva 1 minuto.`
            }
          />
          <Form.Item
            name="profesionalId"
            label="¿A quién se la querés enviar?"
            extra={
              profesionales.length === 0
                ? "Todavía no hay profesionales cargados en el sistema: tu autoevaluación la va a ver todo el equipo de salud."
                : "Si no sabés a quién, dejá «Equipo de salud»: la va a ver cualquier profesional del hospital."
            }
          >
            <Select
              options={[
                { value: SIN_PROFESIONAL, label: "Equipo de salud (cualquier profesional)" },
                ...profesionales.map((p) => ({ value: p.id, label: nombreProfesional(p) })),
              ]}
            />
          </Form.Item>
          <Alert
            type="warning"
            showIcon
            icon={<WarningOutlined />}
            message="Esto no reemplaza una consulta"
            description="Si ahora tenés dolor de pecho, falta de aire o mareos fuertes, no esperes la respuesta: andá a la guardia o llamá al 107."
          />
        </div>

        <div style={{ display: paso === 1 ? "block" : "none" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--gray-600)" }}>
              <span>Tu progreso</span>
              <span>
                {respondidas} de {preguntas.length} preguntas respondidas
              </span>
            </div>
            <Progress percent={porcentaje} showInfo={false} strokeColor="#0369a1" />
          </div>
          {PREGUNTAS[tipo].map((p) =>
            preguntas.includes(p) ? (
              <Form.Item
                key={p.name}
                name={p.name}
                label={p.label}
                extra={p.ayuda}
                rules={p.requerida ? [{ required: true, message: "Respondé esta pregunta para seguir." }] : []}
              >
                <Campo p={p} />
              </Form.Item>
            ) : null
          )}
          <Form.Item name={OBSERVACIONES.name} label={OBSERVACIONES.label} extra={OBSERVACIONES.ayuda}>
            <Input.TextArea rows={3} maxLength={300} showCount placeholder="Por ejemplo: me costó el último ejercicio, me dolió la rodilla…" />
          </Form.Item>
        </div>
      </Form>

      {paso === 2 && (
        <>
          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 12 }}
            message={`Revisá tus respuestas antes de enviarlas ${aDestinatario}`}
            description="Si algo no está bien, tocá «Volver» y corregilo. Una vez enviada, la autoevaluación no se puede modificar (podés hacer otra cuando quieras)."
          />
          {hayAlerta && (
            <Alert
              type="error"
              showIcon
              style={{ marginBottom: 12 }}
              message="Marcaste síntomas que pueden ser importantes"
              description="Vamos a avisarle al equipo, pero si los tenés ahora mismo, andá a la guardia o llamá al 107."
            />
          )}
          <RespuestasAutoevaluacion tipo={tipo} respuestas={form.getFieldsValue(true)} />
        </>
      )}

      {paso === 3 && (
        <Result
          status="success"
          title="¡Listo! Tu autoevaluación fue enviada"
          subTitle={`La recibió ${destinatario}. Cuando la revisen, vas a ver su devolución en la pestaña «Mis autoevaluaciones».`}
          extra={
            enviada?.alerta ? (
              <Alert
                type="error"
                showIcon
                message="Por lo que marcaste, si los síntomas siguen o empeoran, andá a la guardia o llamá al 107."
              />
            ) : null
          }
        />
      )}

      {error && <Alert type="error" showIcon message={error} style={{ marginTop: 12 }} />}
    </Modal>
  );
};

export default AutoevaluacionWizard;
