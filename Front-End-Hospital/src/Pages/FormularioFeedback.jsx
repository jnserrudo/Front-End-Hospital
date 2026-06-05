import React, { useState } from "react";
import { Form, Input, Button, Rate, Alert } from "antd";
import {
  MessageOutlined,
  UserOutlined,
  MailOutlined,
  SendOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { insertFeedback } from "../services/feedback-services";

const { TextArea } = Input;

const rateDesc = ["Muy malo", "Malo", "Regular", "Bueno", "Excelente"];

export const FormularioFeedback = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [rateValue, setRateValue] = useState(5);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const result = await insertFeedback({
        nombre: values.nombre,
        email: values.email,
        mensaje: values.mensaje,
        calificacion: values.calificacion || 5,
        leido: false,
      });
      if (result && result.id) {
        setEnviado(true);
        form.resetFields();
        setRateValue(5);
      }
    } catch (error) {
      /* silencioso, el Form muestra error inline */
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: 700 }}>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "var(--radius-md)",
            background: "var(--primary-100)", display: "flex",
            alignItems: "center", justifyContent: "center",
            color: "var(--primary)", fontSize: 24,
          }}>
            <MessageOutlined />
          </div>
          <div>
            <h2 className="page-title">Envíanos tu Feedback</h2>
            <p className="page-subtitle">
              Tu opinión es muy importante para nosotros
            </p>
          </div>
        </div>
        <div className="page-title-bar" />
      </div>

      <Alert
        message="¿Cómo usar esta sección?"
        description="Comparte tu experiencia con la plataforma. Completa el formulario con tu nombre, email, calificación y comentarios. Tu feedback nos ayuda a mejorar."
        type="info"
        icon={<InfoCircleOutlined />}
        showIcon
        closable
        style={{ marginBottom: 24, borderRadius: "var(--radius-md)" }}
      />

      {enviado && (
        <Alert
          message="¡Gracias por tu feedback!"
          description="Lo revisaremos pronto y lo tendremos en cuenta para mejorar."
          type="success"
          showIcon
          icon={<CheckCircleOutlined />}
          closable
          onClose={() => setEnviado(false)}
          style={{ marginBottom: 24, borderRadius: "var(--radius-md)" }}
        />
      )}

      <div style={{
        background: "white",
        border: "1px solid var(--gray-200)",
        borderRadius: "var(--radius-lg)",
        padding: "2rem",
        boxShadow: "var(--shadow)",
      }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ calificacion: 5 }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Form.Item
              label="Nombre completo"
              name="nombre"
              rules={[
                { required: true, message: "Ingresá tu nombre" },
                { min: 3, message: "Mínimo 3 caracteres" },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "var(--gray-400)" }} />}
                placeholder="Ej: Juan Pérez"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Ingresá tu email" },
                { type: "email", message: "Email no válido" },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: "var(--gray-400)" }} />}
                placeholder="tu@email.com"
              />
            </Form.Item>
          </div>

          <Form.Item
            label={
              <span>
                Calificación{" "}
                {rateValue > 0 && (
                  <span style={{ color: "var(--gray-400)", fontWeight: 400, fontSize: "0.8rem" }}>
                    — {rateDesc[rateValue - 1]}
                  </span>
                )}
              </span>
            }
            name="calificacion"
            rules={[{ required: true, message: "Calificá tu experiencia" }]}
          >
            <Rate onChange={setRateValue} value={rateValue} style={{ fontSize: 28 }} />
          </Form.Item>

          <Form.Item
            label="Mensaje"
            name="mensaje"
            rules={[
              { required: true, message: "Escribí tu mensaje" },
              { min: 10, message: "Mínimo 10 caracteres" },
            ]}
          >
            <TextArea
              rows={5}
              placeholder="Cuéntanos tu experiencia, sugerencias o comentarios..."
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SendOutlined />}
              size="large"
              block
              style={{ borderRadius: "var(--radius)", fontWeight: 600, height: 48 }}
            >
              {loading ? "Enviando..." : "Enviar Feedback"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
