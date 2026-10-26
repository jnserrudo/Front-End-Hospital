import React, { useEffect, useState } from "react";
import { Alert, Button, Descriptions, Form, Input, Modal, Skeleton, Tag } from "antd";
import { LockOutlined, ReloadOutlined } from "@ant-design/icons";
import { apiFetch, friendlyMessage } from "../services/http";
import { updatePassword } from "../services/usuario-services";
import { getSession, updateToken, ROL_LABEL, ROLES } from "../services/session";
import { notify } from "../ui/notify";

/** «Mis datos»: perfil de la cuenta (solo lectura) y cambio de la propia contraseña. */
export const MisDatosModal = ({ open, onClose }) => {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [cambiando, setCambiando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorPwd, setErrorPwd] = useState("");
  const [form] = Form.useForm();

  const cargar = async () => {
    setCargando(true);
    setError("");
    try {
      setDatos(await apiFetch("/usuarios/me"));
    } catch (err) {
      if (err) err.notified = true;
      setError(friendlyMessage(err, "No pudimos cargar tus datos"));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (open) {
      setCambiando(false);
      setErrorPwd("");
      cargar();
    }
  }, [open]);

  const cambiarPassword = async (v) => {
    setGuardando(true);
    setErrorPwd("");
    try {
      const id = datos?.id ?? getSession()?.id;
      const r = await updatePassword(id, v.nueva, v.actual);
      if (r?.token) updateToken(r.token);
      notify.success("Listo: cambiaste tu contraseña. La próxima vez ingresá con la nueva.");
      form.resetFields();
      setCambiando(false);
    } catch (err) {
      if (err) err.notified = true;
      setErrorPwd(friendlyMessage(err, "No pudimos cambiar tu contraseña"));
    } finally {
      setGuardando(false);
    }
  };

  const esPaciente = datos?.idRol === ROLES.PACIENTE;

  return (
    <Modal title="Mis datos" open={open} onCancel={onClose} footer={<Button onClick={onClose}>Cerrar</Button>} width={600} destroyOnClose>
      {cargando && <Skeleton active paragraph={{ rows: 5 }} />}
      {!cargando && error && (
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
      )}
      {!cargando && datos && (
        <>
          <Descriptions bordered size="small" column={1} labelStyle={{ width: 160, fontWeight: 600 }}>
            <Descriptions.Item label="Nombre">
              {datos.nombre} {datos.apellido}
            </Descriptions.Item>
            <Descriptions.Item label="Usuario">{datos.usuario}</Descriptions.Item>
            <Descriptions.Item label="DNI">{datos.dni || "—"}</Descriptions.Item>
            <Descriptions.Item label="Email">{datos.email || "—"}</Descriptions.Item>
            <Descriptions.Item label="Rol">{ROL_LABEL[datos.idRol] || datos.rolNombre}</Descriptions.Item>
            {datos.idRol === ROLES.PROFESIONAL && (
              <Descriptions.Item label="Especialidad">
                {datos.especialidad || <span style={{ color: "var(--gray-500)" }}>Sin cargar (la carga un administrador)</span>}
              </Descriptions.Item>
            )}
            {esPaciente && (
              <Descriptions.Item label="Mis patologías">
                {datos.patologias?.length ? (
                  datos.patologias.map((p) => <Tag key={p.id}>{p.nombre}</Tag>)
                ) : (
                  <span style={{ color: "var(--gray-500)" }}>Todavía no tenés patologías asignadas</span>
                )}
              </Descriptions.Item>
            )}
          </Descriptions>
          <Alert
            type="info"
            showIcon
            style={{ marginTop: 12 }}
            message="¿Algún dato está mal?"
            description={
              esPaciente
                ? "Estos datos los carga el hospital y no se pueden editar desde acá. Si algo está mal (incluidas tus patologías, que definen qué recetas, ejercicios e información ves), avisale a tu profesional o al administrador."
                : "Los datos de la cuenta los edita un administrador desde Administración › Usuarios. Desde acá solo podés cambiar tu contraseña."
            }
          />

          <div style={{ marginTop: 16 }}>
            {!cambiando ? (
              <Button icon={<LockOutlined />} onClick={() => setCambiando(true)}>
                Cambiar mi contraseña
              </Button>
            ) : (
              <Form form={form} layout="vertical" onFinish={cambiarPassword} requiredMark={false}>
                <Form.Item name="actual" label="Contraseña actual" rules={[{ required: true, message: "Ingresá tu contraseña actual." }]}>
                  <Input.Password autoComplete="current-password" />
                </Form.Item>
                <Form.Item
                  name="nueva"
                  label="Contraseña nueva"
                  extra="Al menos 8 caracteres, con letras y números."
                  rules={[
                    { required: true, message: "Ingresá la contraseña nueva." },
                    { min: 8, message: "Tiene que tener al menos 8 caracteres." },
                    { pattern: /(?=.*[A-Za-zÑñ])(?=.*\d)/, message: "Tiene que tener al menos una letra y un número." },
                  ]}
                >
                  <Input.Password autoComplete="new-password" />
                </Form.Item>
                <Form.Item
                  name="repetir"
                  label="Repetí la contraseña nueva"
                  dependencies={["nueva"]}
                  rules={[
                    { required: true, message: "Repetí la contraseña nueva." },
                    ({ getFieldValue }) => ({
                      validator: (_, v) =>
                        !v || v === getFieldValue("nueva") ? Promise.resolve() : Promise.reject(new Error("Las dos contraseñas no coinciden.")),
                    }),
                  ]}
                >
                  <Input.Password autoComplete="new-password" />
                </Form.Item>
                {errorPwd && <Alert type="error" showIcon message={errorPwd} style={{ marginBottom: 12 }} />}
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <Button
                    onClick={() => {
                      form.resetFields();
                      setErrorPwd("");
                      setCambiando(false);
                    }}
                    disabled={guardando}
                  >
                    Cancelar
                  </Button>
                  <Button type="primary" htmlType="submit" loading={guardando}>
                    Guardar contraseña nueva
                  </Button>
                </div>
              </Form>
            )}
          </div>
        </>
      )}
    </Modal>
  );
};

export default MisDatosModal;
