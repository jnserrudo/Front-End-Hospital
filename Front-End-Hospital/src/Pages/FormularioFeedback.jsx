import React, { useEffect, useState } from "react";
import { Form, Input, Button, Result, Row, Col } from "antd";
import {
  MessageOutlined,
  UserOutlined,
  MailOutlined,
  SendOutlined,
  BulbOutlined,
  QuestionCircleOutlined,
  WarningOutlined,
  HeartOutlined,
  EllipsisOutlined,
  TeamOutlined,
  EyeOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import { insertFeedback } from "../services/feedback-services";
import { PageHeader } from "../Components/PageHeader";
import { SectionHelp } from "../Components/SectionHelp";
import { VentEmergConfirmacion } from "../Components/VentEmergConfirmacion";
import { getSession } from "../services/session";

const { TextArea } = Input;

// El valor viaja al back, que lo guarda como texto dentro del mensaje (el modelo no tiene columna propia).
const TIPOS = [
  { value: "sugerencia", label: "Sugerencia", icon: <BulbOutlined />, placeholder: "¿Qué te gustaría que agreguemos o mejoremos?" },
  { value: "consulta", label: "Consulta", icon: <QuestionCircleOutlined />, placeholder: "Contanos tu duda sobre la app o sus contenidos." },
  { value: "problema", label: "Problema", icon: <WarningOutlined />, placeholder: "¿Qué pasó? Si podés, contanos en qué pantalla y qué estabas haciendo." },
  { value: "felicitacion", label: "Felicitación", icon: <HeartOutlined />, placeholder: "¿Qué te gustó? Se lo vamos a hacer llegar al equipo." },
  { value: "otro", label: "Otro", icon: <EllipsisOutlined />, placeholder: "Contanos lo que quieras compartir con nosotros." },
];

const CARAS = [
  { valor: 1, emoji: "😞", texto: "Muy mala" },
  { valor: 2, emoji: "🙁", texto: "Mala" },
  { valor: 3, emoji: "😐", texto: "Regular" },
  { valor: 4, emoji: "🙂", texto: "Buena" },
  { valor: 5, emoji: "😄", texto: "Excelente" },
];

/** Selector de tipo de comentario (control de Form: recibe value/onChange). */
const TipoSelector = ({ value, onChange }) => (
  <div className="fb-types" role="radiogroup" aria-label="Tipo de comentario">
    {TIPOS.map((t) => (
      <button
        key={t.value}
        type="button"
        role="radio"
        aria-checked={value === t.value}
        className={`fb-type ${value === t.value ? "fb-type--active" : ""}`}
        onClick={() => onChange?.(t.value)}
      >
        <span className="fb-type-icon">{t.icon}</span>
        <span>{t.label}</span>
      </button>
    ))}
  </div>
);

/** Calificación con caritas (control de Form: recibe value/onChange). */
const CaritasRating = ({ value, onChange }) => (
  <div className="fb-rating">
    <div className="fb-faces" role="radiogroup" aria-label="Calificación de tu experiencia">
      {CARAS.map((c) => (
        <button
          key={c.valor}
          type="button"
          role="radio"
          aria-checked={value === c.valor}
          aria-label={`${c.valor} de 5: ${c.texto}`}
          title={c.texto}
          className={`fb-face ${value === c.valor ? "fb-face--active" : ""} ${value && value !== c.valor ? "fb-face--dim" : ""}`}
          onClick={() => onChange?.(c.valor)}
        >
          <span className="fb-face-emoji">{c.emoji}</span>
          <span className="fb-face-label">{c.texto}</span>
        </button>
      ))}
    </div>
  </div>
);

const leerBorrador = () => {
  try {
    const b = JSON.parse(sessionStorage.getItem("feedbackBorrador") || "null");
    sessionStorage.removeItem("feedbackBorrador");
    return b && typeof b === "object" ? b : null;
  } catch {
    return null;
  }
};

export const FormularioFeedback = ({ setSelectedKey }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pendiente, setPendiente] = useState(null);
  const [enviado, setEnviado] = useState(null);
  const tipo = Form.useWatch("tipo", form);
  const sesion = getSession();
  const nombreSesion = `${sesion?.nombre || ""} ${sesion?.apellido || ""}`.trim();

  const valoresIniciales = { tipo: "sugerencia", calificacion: 5, nombre: nombreSesion || undefined };

  // Si venimos de «Preguntas frecuentes» con una búsqueda, la traemos como borrador.
  useEffect(() => {
    const b = leerBorrador();
    if (b) {
      form.setFieldsValue({
        tipo: TIPOS.some((t) => t.value === b.tipo) ? b.tipo : "consulta",
        mensaje: String(b.mensaje || "").slice(0, 500),
      });
    }
  }, [form]);

  // Paso 1: el formulario validó → pedimos confirmación
  const handleSubmit = (values) => setPendiente(values);

  // Paso 2: confirmado → guardamos. Si falla, el diálogo muestra el motivo.
  const enviar = async () => {
    setLoading(true);
    try {
      await insertFeedback({
        nombre: pendiente.nombre,
        email: pendiente.email || "",
        mensaje: pendiente.mensaje,
        calificacion: pendiente.calificacion || 5,
        tipo: pendiente.tipo,
      });
      setEnviado(pendiente);
      setPendiente(null);
      form.resetFields(); // queda listo (y oculto) para otro comentario
    } finally {
      setLoading(false);
    }
  };

  const otroComentario = () => setEnviado(null);

  const tipoActual = TIPOS.find((t) => t.value === tipo) || TIPOS[0];
  const cara = (n) => CARAS.find((c) => c.valor === n);

  return (
    <div className="page-wrapper">
      <PageHeader
        icon={<MessageOutlined />}
        title="Contanos tu opinión"
        subtitle="Sugerencias, dudas, problemas o felicitaciones: todo nos sirve para mejorar"
      />

      <SectionHelp>
        Este formulario sirve para que nos cuentes qué te parece la app y cómo podemos mejorarla. Elegí el tipo de
        comentario, calificá tu experiencia y escribí tu mensaje. Lo lee el equipo del Hospital Dr. Arturo Oñativia que
        administra la plataforma. El email es opcional: dejalo solo si querés que te respondan.
      </SectionHelp>

      <Row gutter={[20, 20]} align="top">
        <Col xs={24} lg={8} className="fb-aside-col">
          <aside className="fb-aside">
            <div className="fb-aside-item">
              <span className="fb-aside-icon"><TeamOutlined /></span>
              <div>
                <strong>¿Quién lo lee?</strong>
                <p>El equipo del hospital que administra la app. Cada comentario queda registrado con tu usuario.</p>
              </div>
            </div>
            <div className="fb-aside-item">
              <span className="fb-aside-icon"><EyeOutlined /></span>
              <div>
                <strong>¿Qué pasa después?</strong>
                <p>Lo revisamos y lo usamos para mejorar contenidos y funciones. Si dejaste tu email, te pueden responder ahí.</p>
              </div>
            </div>
            <div className="fb-aside-item fb-aside-item--warn">
              <span className="fb-aside-icon"><AlertOutlined /></span>
              <div>
                <strong>No es un canal de urgencias</strong>
                <p>Si te sentís mal o tenés una duda sobre tu tratamiento, consultá a tu médico o acercate a la guardia.</p>
              </div>
            </div>
          </aside>
        </Col>

        <Col xs={24} lg={16}>
          <div className="fb-card">
            {enviado && (
              <Result
                status="success"
                title={`¡Gracias${enviado.nombre ? `, ${String(enviado.nombre).split(" ")[0]}` : ""}! Recibimos tu comentario`}
                subTitle={
                  <>
                    Enviaste una {TIPOS.find((t) => t.value === enviado.tipo)?.label.toLowerCase() || "opinión"} con una
                    calificación de {cara(enviado.calificacion)?.emoji} {cara(enviado.calificacion)?.texto?.toLowerCase()} ({enviado.calificacion}/5).
                    <br />
                    {enviado.email
                      ? `El equipo lo va a leer y, si hace falta, te va a responder a ${enviado.email}.`
                      : "El equipo lo va a leer. Como no dejaste email, no te van a poder responder directamente."}
                  </>
                }
                extra={[
                  <Button key="otro" type="primary" icon={<MessageOutlined />} onClick={otroComentario}>
                    Enviar otro comentario
                  </Button>,
                  setSelectedKey ? (
                    <Button key="inicio" onClick={() => setSelectedKey("1")}>
                      Volver al inicio
                    </Button>
                  ) : null,
                ]}
              />
            )}
            {/* El formulario queda montado (oculto) mientras se ve el mensaje de éxito. */}
            <div style={{ display: enviado ? "none" : undefined }}>
              <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={valoresIniciales} requiredMark="optional">
                <Form.Item label="¿Qué querés contarnos?" name="tipo" rules={[{ required: true, message: "Elegí el tipo de comentario" }]}>
                  <TipoSelector />
                </Form.Item>

                <Form.Item
                  label="¿Cómo fue tu experiencia con la app?"
                  name="calificacion"
                  rules={[{ required: true, message: "Elegí una carita para calificar tu experiencia" }]}
                >
                  <CaritasRating />
                </Form.Item>

                <Form.Item
                  label="Mensaje"
                  name="mensaje"
                  rules={[
                    { required: true, message: "Escribí tu mensaje" },
                    { min: 10, message: "Contanos un poco más (mínimo 10 caracteres)" },
                  ]}
                >
                  <TextArea rows={5} placeholder={tipoActual.placeholder} showCount maxLength={500} />
                </Form.Item>

                <div className="feedback-form-grid">
                  <Form.Item
                    label="Tu nombre"
                    name="nombre"
                    extra={nombreSesion ? "Lo completamos con el nombre de tu cuenta; podés cambiarlo." : undefined}
                    rules={[
                      { required: true, message: "Ingresá tu nombre" },
                      { min: 3, message: "Mínimo 3 caracteres" },
                    ]}
                  >
                    <Input prefix={<UserOutlined style={{ color: "var(--gray-400)" }} />} placeholder="Ej.: Juan Pérez" allowClear />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    extra="Solo si querés que te respondan."
                    rules={[{ type: "email", message: "Revisá el email: parece incompleto (ej.: nombre@gmail.com)." }]}
                  >
                    <Input prefix={<MailOutlined style={{ color: "var(--gray-400)" }} />} placeholder="tu@email.com" allowClear />
                  </Form.Item>
                </div>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button type="primary" htmlType="submit" loading={loading} icon={<SendOutlined />} size="large" block className="fb-submit">
                    {loading ? "Enviando..." : "Enviar comentario"}
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <VentEmergConfirmacion
              isOpen={Boolean(pendiente)}
              onClose={() => setPendiente(null)}
              title="¿Enviar tu comentario?"
              mje={`Vamos a enviar tu ${TIPOS.find((t) => t.value === pendiente?.tipo)?.label.toLowerCase() || "comentario"} con una calificación de ${pendiente?.calificacion || 5}/5 al equipo del hospital. ${pendiente?.email ? `Si hace falta, te van a responder a ${pendiente.email}.` : "No dejaste email, así que el equipo no va a poder responderte directamente."}`}
              confirmText="Enviar comentario"
              errorFallback="No pudimos enviar tu comentario"
              handleSi={enviar}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};
