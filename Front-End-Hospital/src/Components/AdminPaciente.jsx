import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  KeyOutlined,
  StopOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { Segmented, Tag, Alert, Button, Tooltip, Divider, Timeline, Empty } from "antd";
import { AdminEntityList } from "./AdminEntityList";
import { RowActions } from "./RowActions";
import { UsuarioFormModal } from "./UsuarioFormModal";
import { CredencialesModal } from "./CredencialesModal";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { VentEmergenteHabilitamiento } from "./VentEmergenteHabilitamiento";
import {
  getAllPacientes,
  getPacienteById,
  insertPaciente,
  updatePaciente,
  DeshabilitarPaciente,
  HabilitarPaciente,
} from "../services/paciente-services";
import { blanquearUsuario } from "../services/usuario-services";
import { getRol, ROLES } from "../services/session";
import { filterBySearch } from "../utils/search";
import { friendlyMessage } from "../services/http";
import { notify } from "../ui/notify";

const nombre = (p) => `${p?.usuario?.nombre || ""} ${p?.usuario?.apellido || ""}`.trim() || p?.usuario?.usuario || "el paciente";
const SOLO_ADMIN = "Solo un administrador puede hacer esto. Como profesional de salud podés ver los datos del paciente.";

const FICHA = ["Ficha de salud", "Consultas", "Informes", "Diarios"];

const fecha = (iso) =>
  iso ? new Date(iso).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" }) : "";

// Historial de habilitación: los 5 cambios más recientes y «Ver más» para el resto.
const HISTORIAL_VISIBLES = 5;
const HistorialHabilitacion = ({ items = [] }) => {
  const [verTodo, setVerTodo] = useState(false);
  if (!items?.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sin cambios de habilitación registrados." />;
  }
  const visibles = verTodo ? items : items.slice(0, HISTORIAL_VISIBLES);
  const ocultos = items.length - HISTORIAL_VISIBLES;
  return (
    <>
      <Timeline
        items={visibles.map((h) => ({
          key: h.id,
          color: h.tipo === "habilitacion" ? "green" : "red",
          children: (
            <span>
              <strong>{h.tipo === "habilitacion" ? "Habilitado" : "Deshabilitado"}</strong> · {fecha(h.fechaHora)}
              {h.usuario ? ` · por ${h.usuario.nombre} ${h.usuario.apellido}` : ""}
              <br />
              <span style={{ color: "var(--gray-600)" }}>Motivo: {h.motivo}</span>
            </span>
          ),
        }))}
      />
      {ocultos > 0 && (
        <Button type="link" style={{ paddingLeft: 0, marginTop: -8 }} onClick={() => setVerTodo((v) => !v)} aria-expanded={verTodo}>
          {verTodo ? "Ver menos" : `Ver más (${ocultos} anterior${ocultos === 1 ? "" : "es"})`}
        </Button>
      )}
    </>
  );
};

export const AdminPaciente = () => {
  const esAdmin = getRol() === ROLES.ADMIN;
  const [db, setDb] = useState([]);
  const [loading, setLoading] = useState(true);
  const [credenciales, setCredenciales] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState("activos");
  const [modal, setModal] = useState(null); // { mode, record }
  const [habilitacion, setHabilitacion] = useState(null); // { accion, record }
  const [reset, setReset] = useState(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await getAllPacientes();
      setDb(Array.isArray(data) ? data : []);
    } catch (err) {
      setLoadError(friendlyMessage(err, "No pudimos cargar la lista de pacientes"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Abrimos la ficha con los datos completos (incluye el historial de habilitación).
  const abrir = async (record) => {
    try {
      const full = await getPacienteById(record.id);
      setModal({ mode: "edit", record: full });
    } catch (err) {
      notify.error(err, "No pudimos abrir los datos del paciente");
    }
  };

  const recargarAbierto = async (id) => {
    await cargar();
    if (modal?.record?.id === id) {
      try {
        setModal({ mode: "edit", record: await getPacienteById(id) });
      } catch {
        setModal(null);
      }
    }
  };

  const filas = useMemo(
    () =>
      db.map((p) => ({
        ...p,
        // campos planos para la tabla y la búsqueda
        dni: p.usuario?.dni,
        nombre: p.usuario?.nombre,
        apellido: p.usuario?.apellido,
        usuarioNombre: p.usuario?.usuario,
        patologiasTexto: (p.patologias || []).map((x) => x.nombre).join(", "),
      })),
    [db]
  );
  const porEstado = useMemo(
    () => filas.filter((p) => (estado === "todos" ? true : estado === "activos" ? p.activo : !p.activo)),
    [filas, estado]
  );
  const lista = useMemo(() => filterBySearch(porEstado, search), [porEstado, search]);

  const columns = [
    { title: "DNI", dataIndex: "dni", align: "center" },
    { title: "Nombre", dataIndex: "nombre" },
    { title: "Apellido", dataIndex: "apellido" },
    {
      title: "Patologías",
      dataIndex: "patologias",
      render: (pats) =>
        pats?.length ? pats.map((p) => <Tag color="blue" key={p.id}>{p.nombre}</Tag>) : (
          <Tooltip title="Editá al paciente y asignale al menos una patología para que vea contenido personalizado.">
            <Tag color="orange">Sin patologías</Tag>
          </Tooltip>
        ),
    },
    {
      title: "Estado",
      dataIndex: "activo",
      align: "center",
      render: (activo, r) => (
        <Tooltip
          title={
            r.ultimaHabilitacion
              ? `Último cambio (${fecha(r.ultimaHabilitacion.fechaHora)}): ${r.ultimaHabilitacion.motivo}`
              : activo ? "Puede ingresar a la app" : "No puede ingresar a la app"
          }
        >
          <Tag color={activo ? "green" : "red"}>{activo ? "Activo" : "Deshabilitado"}</Tag>
        </Tooltip>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      render: (_, record) => (
        <RowActions
          actions={[
            {
              key: "edit",
              label: esAdmin ? "Ver detalle y editar" : "Ver detalle",
              icon: esAdmin ? <EditOutlined /> : <EyeOutlined />,
              onClick: () => abrir(record),
            },
            {
              key: "reset",
              label: "Restablecer contraseña",
              icon: <KeyOutlined />,
              disabled: !esAdmin || !record.activo,
              disabledReason: !esAdmin ? SOLO_ADMIN : "El paciente está deshabilitado: habilitalo primero.",
              onClick: () => setReset(record),
            },
            record.activo
              ? {
                  key: "off",
                  label: "Deshabilitar",
                  icon: <StopOutlined />,
                  danger: true,
                  disabled: !esAdmin,
                  disabledReason: SOLO_ADMIN,
                  onClick: () => setHabilitacion({ accion: "deshabilitar", record }),
                }
              : {
                  key: "on",
                  label: "Habilitar",
                  icon: <CheckCircleOutlined />,
                  disabled: !esAdmin,
                  disabledReason: SOLO_ADMIN,
                  onClick: () => setHabilitacion({ accion: "habilitar", record }),
                },
          ]}
        />
      ),
    },
  ];

  const registro = modal?.record;
  const recordForm = registro
    ? { ...registro.usuario, patologias: registro.patologias, activo: registro.activo, idRol: ROLES.PACIENTE }
    : null;

  return (
    <>
      {loadError && (
        <Alert type="warning" showIcon style={{ marginBottom: 12 }} message={loadError} action={<Button size="small" onClick={cargar}>Reintentar</Button>} />
      )}
      {!esAdmin && (
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 12 }}
          message="Estás viendo los pacientes como profesional de salud"
          description="Podés consultar sus datos y patologías. El alta, la edición y la habilitación de pacientes las hace un administrador."
        />
      )}
      <AdminEntityList
        title="Listado de Pacientes"
        count={porEstado.length}
        searchProps={{
          placeholder: "Buscar por nombre, DNI o patología...",
          value: search,
          onChange: (e) => setSearch(e.target.value),
        }}
        addButton={{
          label: "Agregar paciente",
          icon: <PlusOutlined />,
          onClick: () => setModal({ mode: "add" }),
          disabled: !esAdmin,
          disabledReason: SOLO_ADMIN,
        }}
        extraFilters={
          <Segmented
            value={estado}
            onChange={setEstado}
            options={[
              { label: "Activos", value: "activos" },
              { label: "Deshabilitados", value: "deshabilitados" },
              { label: "Todos", value: "todos" },
            ]}
          />
        }
        emptyText={estado === "deshabilitados" ? "No hay pacientes deshabilitados." : "Todavía no hay pacientes. Tocá «Agregar paciente» para dar de alta el primero."}
        columns={columns}
        dataSource={lista}
        loading={loading}
        loadingText="Cargando pacientes…"
        rowKey="id"
      />

      <UsuarioFormModal
        open={Boolean(modal)}
        mode={modal?.mode}
        fixedRol={ROLES.PACIENTE}
        entidad="paciente"
        record={recordForm}
        canEdit={esAdmin}
        lockedReason={SOLO_ADMIN}
        onSave={(values) => (registro ? updatePaciente({ ...values, id: registro.id }) : insertPaciente(values))}
        onSaved={cargar}
        onClose={() => setModal(null)}
      >
        {({ editing }) => registro && (
          <>
            <Divider orientation="left" style={{ marginTop: 8 }}>Acceso a la app</Divider>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <Tag color={registro.activo ? "green" : "red"} style={{ fontSize: 14, padding: "4px 10px" }}>
                {registro.activo ? "Activo: puede ingresar" : "Deshabilitado: no puede ingresar"}
              </Tag>
              <Tooltip
                title={
                  !esAdmin
                    ? SOLO_ADMIN
                    : editing
                    ? "Primero guardá o cancelá la edición de los datos; después podés cambiar el acceso."
                    : "Acción aparte de «Editar»: te pide un motivo y su propia confirmación."
                }
              >
                <span style={{ display: "inline-block", cursor: !esAdmin || editing ? "not-allowed" : undefined }}>
                  {registro.activo ? (
                    <Button danger icon={<StopOutlined />} disabled={!esAdmin || editing} style={!esAdmin || editing ? { pointerEvents: "none" } : undefined} onClick={() => setHabilitacion({ accion: "deshabilitar", record: registro })}>
                      Deshabilitar
                    </Button>
                  ) : (
                    <Button type="primary" icon={<CheckCircleOutlined />} disabled={!esAdmin || editing} style={!esAdmin || editing ? { pointerEvents: "none" } : undefined} onClick={() => setHabilitacion({ accion: "habilitar", record: registro })}>
                      Habilitar
                    </Button>
                  )}
                </span>
              </Tooltip>
            </div>
            <p style={{ color: "var(--gray-500)", fontSize: 13, marginTop: 8 }}>
              Esto es independiente de «Editar»: no cambia sus datos, solo si puede ingresar. Deshabilitar no borra nada; el motivo queda en su historial y lo podés volver a habilitar cuando quieras.
            </p>

            <Divider orientation="left"><HistoryOutlined /> Historial de habilitación</Divider>
            <HistorialHabilitacion items={registro.habilitaciones} />

            <Divider orientation="left"><FileTextOutlined /> Ficha clínica</Divider>
            <Alert
              type="info"
              showIcon
              message="Próximamente"
              description="La ficha de salud, consultas, informes y diarios del paciente se van a habilitar en la próxima etapa (ficha clínica). Por ahora no se pueden cargar datos clínicos desde acá."
              style={{ marginBottom: 8 }}
            />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {FICHA.map((f) => (
                <Tooltip key={f} title={`${f}: disponible próximamente, cuando esté la ficha clínica del paciente.`}>
                  <span style={{ display: "inline-block", cursor: "not-allowed" }} tabIndex={0} aria-label={`${f}: próximamente`}>
                    <Button disabled style={{ pointerEvents: "none" }}>
                      {f} <Tag style={{ marginLeft: 6 }}>Próximamente</Tag>
                    </Button>
                  </span>
                </Tooltip>
              ))}
            </div>
          </>
        )}
      </UsuarioFormModal>

      <VentEmergenteHabilitamiento
        isOpen={Boolean(habilitacion)}
        onClose={() => setHabilitacion(null)}
        accion={habilitacion?.accion}
        nombre={nombre(habilitacion?.record)}
        handleSi={async (motivo) => {
          const r = habilitacion.record;
          if (habilitacion.accion === "deshabilitar") {
            await DeshabilitarPaciente(r.id, motivo);
            notify.success(`${nombre(r)} quedó deshabilitado. Ya no puede ingresar a la app.`);
          } else {
            await HabilitarPaciente(r.id, motivo);
            notify.success(`${nombre(r)} quedó habilitado. Ya puede ingresar a la app.`);
          }
          await recargarAbierto(r.id);
        }}
      />

      <VentEmergConfirmacion
        isOpen={Boolean(reset)}
        onClose={() => setReset(null)}
        title={`¿Restablecer la contraseña de ${nombre(reset)}?`}
        mje={`Vamos a generar una contraseña temporal nueva e intentar enviarla a ${reset?.usuario?.email} (si el correo no sale, te la mostramos). La actual deja de funcionar y el paciente va a tener que crear una nueva en su próximo ingreso.`}
        confirmText="Restablecer contraseña"
        danger
        handleSi={async () => {
          const p = reset;
          const r = await blanquearUsuario({ id: p.usuario.id });
          if (r?.emailEnviado) {
            notify.success(`Contraseña restablecida. Enviamos la temporal a ${r.email}.`, { duration: 6000 });
          } else {
            notify.success("Contraseña restablecida. El email no se pudo enviar: te mostramos la temporal para que se la entregues.", { duration: 6000 });
            setCredenciales({ titulo: `Contraseña restablecida: ${nombre(p)}`, nombre: nombre(p), usuario: p.usuario.usuario, password: r?.passwordTemporal, motivo: r?.motivoEmail });
          }
        }}
      />
      <CredencialesModal datos={credenciales} onClose={() => setCredenciales(null)} />
    </>
  );
};
