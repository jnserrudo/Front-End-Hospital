import React, { useEffect, useMemo, useState } from "react";
import { Modal, Form, Input, Select, Button, Alert, Tooltip, Tag, Row, Col, AutoComplete } from "antd";
import { PlusOutlined, EditOutlined, LockOutlined, InfoCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { CredencialesModal } from "./CredencialesModal";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { getAllPatologias } from "../services/patologia-services";
import { ROL_LABEL, ROLES, getSession } from "../services/session";
import { friendlyMessage } from "../services/http";
import { notify } from "../ui/notify";

const ROL_OPCIONES = [
  { value: ROLES.ADMIN, label: "Administrador", desc: "Gestiona todo el sistema" },
  { value: ROLES.PROFESIONAL, label: "Profesional de salud", desc: "Carga contenido, consulta pacientes y recibe y revisa autoevaluaciones" },
  { value: ROLES.PACIENTE, label: "Paciente", desc: "Usa la app; ve contenido según sus patologías" },
];

const CAMPOS = { nombre: "Nombre", apellido: "Apellido", dni: "DNI", email: "Email", usuario: "Usuario", especialidad: "Especialidad", detalle: "Notas internas" };

// Sugerencias: se puede escribir cualquier otra.
const ESPECIALIDADES = [
  "Clínica médica",
  "Nutrición",
  "Kinesiología",
  "Diabetología",
  "Endocrinología",
  "Cardiología",
  "Enfermería",
  "Psicología",
  "Educación física",
  "Pediatría",
].map((value) => ({ value }));

const nombreCompleto = (v) => `${v?.nombre || ""} ${v?.apellido || ""}`.trim() || "esta persona";

/**
 * Alta y edición de cuentas (usuarios y pacientes). Un paciente es una cuenta con
 * rol Paciente: si `fixedRol` es 3, el rol no se elige y las patologías son obligatorias.
 *
 * Edición: se abre en modo lectura con un botón «Editar» y una nota que explica
 * por qué los campos están bloqueados.
 */
export const UsuarioFormModal = ({
  open,
  mode = "add",
  fixedRol = null,
  record = null,
  canEdit = true,
  lockedReason = "",
  entidad = "usuario", // "usuario" | "paciente" (para los textos)
  onSave, // async (values, record) => resultado
  onSaved,
  onClose,
  children, // secciones extra en edición (estado, ficha, etc.)
}) => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(mode === "add");
  const [patologias, setPatologias] = useState([]);
  const [patologiasError, setPatologiasError] = useState("");
  const [loadingPatologias, setLoadingPatologias] = useState(false);
  const [pendiente, setPendiente] = useState(null); // { title, mje, confirmText, values }
  const [confirmDescartar, setConfirmDescartar] = useState(null); // "cerrar" | "cancelar"
  const [formError, setFormError] = useState("");
  const rolElegido = Form.useWatch("idRol", form);
  const rolActual = fixedRol ?? rolElegido;
  const esPaciente = +rolActual === ROLES.PACIENTE;
  const esProfesional = +rolActual === ROLES.PROFESIONAL;
  const esAlta = mode === "add";
  const textoEntidad = entidad === "paciente" ? "paciente" : "cuenta";
  const [credenciales, setCredenciales] = useState(null);
  // No se puede cambiar el rol propio (también lo impide el servidor).
  const esMiCuenta = !esAlta && record?.id != null && +record.id === +getSession()?.id;

  const valoresIniciales = useMemo(() => {
    if (esAlta)
      return {
        nombre: undefined,
        apellido: undefined,
        dni: undefined,
        email: undefined,
        usuario: undefined,
        detalle: undefined,
        especialidad: undefined,
        password: undefined,
        idRol: fixedRol ?? undefined,
        idsPatologias: [],
      };
    return {
      nombre: record?.nombre,
      apellido: record?.apellido,
      dni: record?.dni ? String(record.dni) : "",
      email: record?.email,
      usuario: record?.usuario,
      detalle: record?.detalle,
      especialidad: record?.especialidad || undefined,
      idRol: fixedRol ?? (record?.idRol != null ? +record.idRol : undefined),
      idsPatologias: (record?.patologias || []).map((p) => p.id),
    };
  }, [esAlta, fixedRol, record]);

  useEffect(() => {
    if (!open) return;
    setEditing(esAlta);
    setFormError("");
    form.resetFields();
    form.setFieldsValue(valoresIniciales);
  }, [open, esAlta, valoresIniciales, form]);

  useEffect(() => {
    if (!open) return;
    const cargar = async () => {
      setLoadingPatologias(true);
      setPatologiasError("");
      try {
        const data = await getAllPatologias();
        setPatologias(Array.isArray(data) ? data.map((p) => ({ value: p.id, label: p.nombre })) : []);
      } catch (err) {
        setPatologiasError(friendlyMessage(err, "No pudimos cargar la lista de patologías"));
      } finally {
        setLoadingPatologias(false);
      }
    };
    cargar();
  }, [open]);

  const nombrePatologia = (id) => patologias.find((p) => p.value === id)?.label || `#${id}`;

  const resumenCambios = (values) => {
    const cambios = [];
    Object.keys(CAMPOS).forEach((k) => {
      const antes = String(valoresIniciales[k] ?? "").trim();
      const despues = String(values[k] ?? "").trim();
      if (antes !== despues) cambios.push(CAMPOS[k]);
    });
    const consecuencias = [];
    if (!fixedRol && +values.idRol !== +valoresIniciales.idRol) {
      cambios.push("Rol");
      consecuencias.push(
        `El rol pasa de ${ROL_LABEL[valoresIniciales.idRol] || "sin rol"} a ${ROL_LABEL[values.idRol]}: cambia lo que puede ver y hacer en la app.`
      );
    }
    if (+values.idRol === ROLES.PACIENTE || fixedRol === ROLES.PACIENTE) {
      const antes = new Set(valoresIniciales.idsPatologias || []);
      const despues = new Set(values.idsPatologias || []);
      const quitadas = [...antes].filter((id) => !despues.has(id));
      const agregadas = [...despues].filter((id) => !antes.has(id));
      if (quitadas.length || agregadas.length) cambios.push("Patologías");
      if (quitadas.length)
        consecuencias.push(`Va a dejar de ver el contenido específico de: ${quitadas.map(nombrePatologia).join(", ")}.`);
      if (agregadas.length)
        consecuencias.push(`Va a empezar a ver el contenido de: ${agregadas.map(nombrePatologia).join(", ")}.`);
    }
    return { cambios, consecuencias };
  };

  const pedirConfirmacion = async () => {
    setFormError("");
    let values;
    try {
      values = await form.validateFields();
    } catch {
      setFormError("Revisá los campos marcados en rojo antes de guardar.");
      return;
    }
    const nombre = nombreCompleto(values);
    if (esAlta) {
      const rolTxt = ROL_LABEL[fixedRol ?? values.idRol];
      const pats = esPaciente ? ` con ${values.idsPatologias.length} patología${values.idsPatologias.length === 1 ? "" : "s"} (${values.idsPatologias.map(nombrePatologia).join(", ")})` : "";
      setPendiente({
        values,
        title: entidad === "paciente" ? `¿Dar de alta a ${nombre} como paciente?` : `¿Crear la cuenta de ${nombre}?`,
        mje: `Se va a crear una cuenta con rol ${rolTxt}${pats} y el usuario «${values.usuario}». ${
          values.password
            ? `Vas a tener que comunicarle la contraseña que escribiste (también intentamos enviarla a ${values.email}).`
            : `Vamos a intentar enviarle una contraseña temporal a ${values.email}; si el correo no sale, te la mostramos para que se la entregues.`
        } La va a tener que cambiar en su primer ingreso.${
          +values.idRol === ROLES.PROFESIONAL ? " Desde ese momento va a aparecer en «Enviada a» de las autoevaluaciones." : ""
        }`,
        confirmText: entidad === "paciente" ? "Dar de alta" : "Crear cuenta",
      });
    } else {
      const { cambios, consecuencias } = resumenCambios(values);
      if (cambios.length === 0) {
        notify.info("No hiciste ningún cambio: no hay nada para guardar.");
        setEditing(false);
        return;
      }
      setPendiente({
        values,
        title: `¿Guardar los cambios de ${nombre}?`,
        mje: [`Vas a modificar: ${cambios.join(", ")}.`, ...consecuencias].join(" "),
        confirmText: "Guardar cambios",
      });
    }
  };

  const ejecutarGuardado = async () => {
    const values = pendiente.values;
    const payload = {
      ...values,
      dni: String(values.dni).replace(/\D/g, ""),
      idRol: fixedRol ?? values.idRol,
      idsPatologias: esPaciente ? values.idsPatologias : undefined,
      especialidad: esProfesional ? (values.especialidad || "").trim() : undefined,
    };
    if (!payload.password) delete payload.password;
    const result = await onSave(payload, record);
    const nombre = nombreCompleto(values);
    if (esAlta) {
      const email = result?.emailEnmascarado || values.email;
      const creada = entidad === "paciente" ? `Paciente ${nombre} dado de alta.` : `Cuenta de ${nombre} creada.`;
      if (result?.emailEnviado) {
        notify.success(`${creada} Enviamos la contraseña ${values.password ? "" : "temporal "}a ${email}.`, { duration: 6000 });
      } else if (result?.passwordTemporal) {
        notify.success(`${creada} El email no se pudo enviar: te mostramos la contraseña temporal para que se la entregues.`, { duration: 6000 });
        setCredenciales({
          titulo: `${entidad === "paciente" ? "Paciente creado" : "Cuenta creada"}: ${nombre}`,
          nombre,
          usuario: values.usuario,
          password: result.passwordTemporal,
          motivo: result.motivoEmail,
        });
      } else {
        notify.warning(
          `${creada} No pudimos enviar el email, así que comunicale vos la contraseña que escribiste. La va a tener que cambiar en su primer ingreso.`,
          { duration: 9000 }
        );
      }
    } else {
      notify.success(`Cambios de ${nombre} guardados.`);
    }
    setPendiente(null);
    onSaved?.(result);
    onClose?.();
  };

  const intentarCerrar = (origen) => {
    if (editing && form.isFieldsTouched()) {
      setConfirmDescartar(origen);
      return;
    }
    if (origen === "cancelar" && !esAlta) {
      setEditing(false);
      return;
    }
    onClose?.();
  };

  const descartar = () => {
    form.setFieldsValue(valoresIniciales);
    form.resetFields();
    form.setFieldsValue(valoresIniciales);
    if (confirmDescartar === "cancelar" && !esAlta) setEditing(false);
    else onClose?.();
    setConfirmDescartar(null);
  };

  const disabled = !editing;
  const sustantivo = entidad === "paciente" ? "paciente" : "usuario";
  const titulo = esAlta ? `Agregar ${sustantivo}` : editing ? `Editar ${sustantivo}` : `Detalle de ${sustantivo}`;

  const footer = esAlta
    ? [
        <Button key="c" onClick={() => intentarCerrar("cerrar")}>Cancelar</Button>,
        <Button key="g" type="primary" onClick={pedirConfirmacion}>
          {entidad === "paciente" ? "Guardar paciente" : "Crear cuenta"}
        </Button>,
      ]
    : editing
    ? [
        <Button key="c" onClick={() => intentarCerrar("cancelar")}>Cancelar edición</Button>,
        <Button key="g" type="primary" onClick={pedirConfirmacion}>Guardar cambios</Button>,
      ]
    : [
        <Button key="c" onClick={() => onClose?.()}>Cerrar</Button>,
        <Tooltip key="e" title={canEdit ? "Habilita los campos para modificarlos" : lockedReason}>
          <span>
            <Button type="primary" icon={<EditOutlined />} disabled={!canEdit} onClick={() => setEditing(true)} style={{ marginLeft: 8 }}>
              Editar
            </Button>
          </span>
        </Tooltip>,
      ];

  return (
    <>
    <Modal
      open={open}
      onCancel={() => intentarCerrar("cerrar")}
      maskClosable={!editing}
      width={720}
      destroyOnClose
      footer={footer}
      styles={{ header: { borderBottom: "1px solid var(--gray-200)", paddingBottom: 12 } }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {esAlta ? (
            <PlusOutlined style={{ color: "var(--primary)" }} />
          ) : editing ? (
            <EditOutlined style={{ color: "var(--primary)" }} />
          ) : (
            <EyeOutlined style={{ color: "var(--primary)" }} />
          )}
          <span>{titulo}{!esAlta && record ? `: ${nombreCompleto(record)}` : ""}</span>
          {!esAlta && record && (
            <Tag color={record.activo === false ? "red" : "green"}>{record.activo === false ? "Deshabilitado" : "Activo"}</Tag>
          )}
        </div>
      }
    >
      {!esAlta && !canEdit && (
        <Alert type="warning" showIcon icon={<LockOutlined />} style={{ marginBottom: 16 }} message="Solo lectura" description={lockedReason} />
      )}
      {!esAlta && canEdit && !editing && (
        <Alert
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          style={{ marginBottom: 16 }}
          message="Estás viendo los datos guardados"
          description="Los campos están bloqueados para evitar cambios por error. Tocá «Editar» para modificarlos; nada se guarda hasta que confirmes con «Guardar cambios»."
        />
      )}
      {esAlta && (
        <p style={{ color: "var(--gray-500)", marginTop: 0 }}>
          Los campos con <span style={{ color: "#ef4444" }}>*</span> son obligatorios.
          {entidad === "paciente" && " El paciente es una cuenta con rol Paciente: con su usuario y contraseña entra a la app y ve el contenido de sus patologías."}
        </p>
      )}
      {formError && <Alert type="error" showIcon message={formError} style={{ marginBottom: 16 }} />}

      <Form form={form} layout="vertical" disabled={disabled} requiredMark scrollToFirstError>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="nombre" label="Nombre" rules={[{ required: true, whitespace: true, message: "Ingresá el nombre." }]}>
              <Input placeholder="Ej.: Juan" maxLength={120} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="apellido" label="Apellido" rules={[{ required: true, whitespace: true, message: "Ingresá el apellido." }]}>
              <Input placeholder="Ej.: Pérez" maxLength={120} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="dni"
              label="DNI"
              extra="Solo números, sin puntos."
              normalize={(v) => (v == null ? v : String(v).replace(/\D/g, "").slice(0, 10))}
              rules={[
                { required: true, message: "Ingresá el DNI." },
                { pattern: /^\d{6,10}$/, message: "El DNI tiene que tener entre 6 y 10 números, sin puntos." },
              ]}
            >
              <Input
                placeholder="Ej.: 30123456"
                inputMode="numeric"
                maxLength={10}
                onKeyDown={(e) => {
                  // Bloqueamos letras y símbolos al tipear (las teclas de control siguen funcionando)
                  if (e.key.length === 1 && !/\d/.test(e.key) && !e.ctrlKey && !e.metaKey) e.preventDefault();
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="email"
              label="Email"
              extra={esAlta ? "Intentamos enviarle acá la contraseña temporal." : "Se usa para enviar contraseñas temporales."}
              rules={[
                { required: true, message: "Ingresá el email." },
                { type: "email", message: "El email no es válido (ej.: nombre@gmail.com)." },
              ]}
            >
              <Input placeholder="Ej.: juan.perez@gmail.com" maxLength={180} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="usuario"
              label="Usuario"
              extra="Con este nombre va a ingresar. Sugerencia: el DNI."
              rules={[
                { required: true, whitespace: true, message: "Ingresá el nombre de usuario." },
                { pattern: /^\S+$/, message: "El usuario no puede tener espacios." },
              ]}
            >
              <Input placeholder="Ej.: 30123456" maxLength={60} autoComplete="off" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            {fixedRol ? (
              <Form.Item label="Rol" extra="Las cuentas que se crean desde Pacientes siempre tienen rol Paciente. Para otro rol usá Administración › Usuario.">
                <Tag color="blue" style={{ padding: "4px 10px", fontSize: 14 }}>{ROL_LABEL[fixedRol]}</Tag>
              </Form.Item>
            ) : (
              <Form.Item
                name="idRol"
                label="Rol"
                rules={[{ required: true, message: "Elegí un rol." }]}
                normalize={(v) => (v == null ? v : +v)}
                extra={
                  esMiCuenta ? (
                    <span><LockOutlined /> No podés cambiar tu propio rol. Pedile a otro administrador que lo haga.</span>
                  ) : undefined
                }
              >
                <Select
                  placeholder="Elegí un rol"
                  disabled={esMiCuenta || disabled}
                  title={esMiCuenta ? "No podés cambiar tu propio rol" : undefined}
                  // Mostramos solo el nombre del rol al elegirlo; la descripción, en la lista.
                  optionLabelProp="label"
                  options={ROL_OPCIONES.map((r) => ({ value: r.value, label: r.label, desc: r.desc }))}
                  optionRender={(o) => (
                    <span>
                      {o.data.label} <span style={{ color: "var(--gray-500)", fontSize: 12 }}>· {o.data.desc}</span>
                    </span>
                  )}
                />
              </Form.Item>
            )}
          </Col>
          {esProfesional && (
            <Col xs={24} md={12}>
              <Form.Item
                name="especialidad"
                label="Especialidad (opcional)"
                extra="La ven los pacientes al elegir a quién mandar su autoevaluación. Ej.: Kinesiología, Nutrición, Clínica médica."
                rules={[{ max: 80, message: "Usá hasta 80 caracteres." }]}
              >
                <AutoComplete
                  options={ESPECIALIDADES}
                  placeholder="Elegí una o escribila"
                  allowClear
                  filterOption={(input, o) =>
                    o.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
                  }
                />
              </Form.Item>
            </Col>
          )}
          {esProfesional && (
            <Col xs={24}>
              <Alert
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
                message="Cuenta de profesional de salud"
                description="Va a poder cargar contenido, consultar pacientes y revisar autoevaluaciones. Apenas la crees, aparece en «Enviada a» para que los pacientes le manden sus autoevaluaciones. Le enviamos el usuario y una contraseña temporal a su email (si no sale, te la mostramos para que se la entregues)."
              />
            </Col>
          )}
          {esPaciente && (
            <Col xs={24}>
              {patologiasError && <Alert type="warning" showIcon message={patologiasError} style={{ marginBottom: 8 }} />}
              <Form.Item
                name="idsPatologias"
                label="Patologías"
                extra="Elegí al menos una. Define qué recetas, ejercicios e información va a ver."
                rules={[{ required: true, type: "array", min: 1, message: "Elegí al menos una patología." }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Elegí una o más patologías"
                  options={patologias}
                  loading={loadingPatologias}
                  optionFilterProp="label"
                  showSearch
                  notFoundContent="No hay patologías cargadas. Creá una en Administración › Patologías."
                />
              </Form.Item>
            </Col>
          )}
          {esAlta && (
            <Col xs={24} md={12}>
              <Form.Item
                name="password"
                label="Contraseña temporal (opcional)"
                extra="Si la dejás vacía generamos una segura. Mínimo 8 caracteres, con letras y números."
                rules={[
                  {
                    validator: (_, v) =>
                      !v || (v.length >= 8 && /[A-Za-z]/.test(v) && /\d/.test(v))
                        ? Promise.resolve()
                        : Promise.reject(new Error("Mínimo 8 caracteres, con al menos una letra y un número.")),
                  },
                ]}
              >
                <Input.Password placeholder="Dejala vacía para generarla" autoComplete="new-password" />
              </Form.Item>
            </Col>
          )}
          <Col xs={24}>
            <Form.Item name="detalle" label="Notas internas (opcional)" extra="Solo las ven los administradores.">
              <Input.TextArea
                rows={2}
                maxLength={180}
                showCount
                placeholder={esProfesional ? "Ej.: Atiende martes y jueves en consultorio 3" : "Ej.: Derivado por consultorio de nutrición"}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {!esAlta && (typeof children === "function" ? children({ editing }) : children)}

      <VentEmergConfirmacion
        isOpen={Boolean(pendiente)}
        onClose={() => setPendiente(null)}
        title={pendiente?.title}
        mje={pendiente?.mje}
        confirmText={pendiente?.confirmText}
        errorFallback={esAlta ? `No pudimos crear la ${textoEntidad}` : "No pudimos guardar los cambios"}
        handleSi={ejecutarGuardado}
      />
      <VentEmergConfirmacion
        isOpen={Boolean(confirmDescartar)}
        onClose={() => setConfirmDescartar(null)}
        title="¿Descartar los cambios?"
        mje="Modificaste algunos campos y todavía no los guardaste. Si seguís, esos cambios se pierden."
        confirmText="Descartar cambios"
        cancelText="Seguir editando"
        danger
        handleSi={descartar}
      />
    </Modal>
    <CredencialesModal datos={credenciales} onClose={() => setCredenciales(null)} />
    </>
  );
};
