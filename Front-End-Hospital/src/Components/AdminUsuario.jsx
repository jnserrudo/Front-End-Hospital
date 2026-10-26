import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PlusOutlined, EditOutlined, KeyOutlined, StopOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Segmented, Tag, Alert, Button } from "antd";
import { AdminEntityList } from "./AdminEntityList";
import { RowActions } from "./RowActions";
import { UsuarioFormModal } from "./UsuarioFormModal";
import { CredencialesModal } from "./CredencialesModal";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { VentEmergenteHabilitamiento } from "./VentEmergenteHabilitamiento";
import {
  getAllUsuarios,
  insertUsuario,
  updateUsuario,
  blanquearUsuario,
  inhabilitarUsuario,
  habilitarUsuario,
} from "../services/usuario-services";
import { DeshabilitarPaciente, HabilitarPaciente } from "../services/paciente-services";
import { getSession, ROLES } from "../services/session";
import { filterBySearch } from "../utils/search";
import { friendlyMessage } from "../services/http";
import { notify } from "../ui/notify";

const nombre = (u) => `${u?.nombre || ""} ${u?.apellido || ""}`.trim() || u?.usuario;

export const AdminUsuario = () => {
  const [db, setDb] = useState([]);
  const [loading, setLoading] = useState(true);
  const [credenciales, setCredenciales] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState("activos");
  const [modal, setModal] = useState(null); // { mode, record }
  const [confirm, setConfirm] = useState(null); // { tipo, record }
  const yo = getSession();

  const cargar = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await getAllUsuarios();
      setDb(Array.isArray(data) ? data : []);
    } catch (err) {
      setLoadError(friendlyMessage(err, "No pudimos cargar la lista de usuarios"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const porEstado = useMemo(
    () => db.filter((u) => (estado === "todos" ? true : estado === "activos" ? u.activo : !u.activo)),
    [db, estado]
  );
  const lista = useMemo(() => filterBySearch(porEstado, search), [porEstado, search]);

  const columns = [
    { title: "DNI", dataIndex: "dni", align: "center" },
    { title: "Usuario", dataIndex: "usuario" },
    { title: "Nombre", dataIndex: "nombre" },
    { title: "Apellido", dataIndex: "apellido" },
    {
      title: "Rol",
      dataIndex: "rolNombre",
      render: (t, r) => (
        <>
          <Tag>{t}</Tag>
          {r.especialidad && <div style={{ fontSize: 12, color: "var(--gray-500)", marginTop: 2 }}>{r.especialidad}</div>}
        </>
      ),
    },
    {
      title: "Estado",
      dataIndex: "activo",
      align: "center",
      render: (activo) => <Tag color={activo ? "green" : "red"}>{activo ? "Activo" : "Deshabilitado"}</Tag>,
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      render: (_, record) => {
        const esYo = record.id === yo?.id;
        return (
          <RowActions
            actions={[
              { key: "edit", label: "Ver detalle y editar", icon: <EditOutlined />, onClick: () => setModal({ mode: "edit", record }) },
              {
                key: "reset",
                label: "Restablecer contraseña",
                icon: <KeyOutlined />,
                onClick: () => setConfirm({ tipo: "reset", record }),
                disabled: !record.activo,
                disabledReason: "La cuenta está deshabilitada: habilitala primero para restablecer su contraseña.",
              },
              record.activo
                ? {
                    key: "off",
                    label: "Deshabilitar",
                    icon: <StopOutlined />,
                    danger: true,
                    disabled: esYo,
                    disabledReason: "No podés deshabilitar tu propia cuenta.",
                    onClick: () => setConfirm({ tipo: "off", record }),
                  }
                : { key: "on", label: "Habilitar", icon: <CheckCircleOutlined />, onClick: () => setConfirm({ tipo: "on", record }) },
            ]}
          />
        );
      },
    },
  ];

  const esPacienteConFicha = (u) => u?.idRol === ROLES.PACIENTE && u?.paciente?.id;

  const ejecutarConfirm = async () => {
    const { tipo, record } = confirm;
    if (tipo === "reset") {
      const r = await blanquearUsuario(record);
      if (r?.emailEnviado) {
        notify.success(`Contraseña restablecida. Enviamos la temporal a ${r.email}.`, { duration: 6000 });
      } else {
        notify.success("Contraseña restablecida. El email no se pudo enviar: te mostramos la temporal para que se la entregues.", { duration: 6000 });
        setCredenciales({ titulo: `Contraseña restablecida: ${nombre(record)}`, nombre: nombre(record), usuario: record.usuario, password: r?.passwordTemporal, motivo: r?.motivoEmail });
      }
    } else if (tipo === "off") {
      await inhabilitarUsuario(record.id);
      notify.success(`Cuenta de ${nombre(record)} deshabilitada. Ya no puede ingresar.`);
    } else if (tipo === "on") {
      await habilitarUsuario(record.id);
      notify.success(`Cuenta de ${nombre(record)} habilitada. Ya puede ingresar.`);
    }
    await cargar();
  };

  const textosConfirm = () => {
    const r = confirm?.record;
    if (!r) return {};
    if (confirm.tipo === "reset")
      return {
        title: `¿Restablecer la contraseña de ${nombre(r)}?`,
        mje: `Vamos a generar una contraseña temporal nueva e intentar enviarla a ${r.email} (si el correo no sale, te la mostramos). La actual deja de funcionar y la persona tendrá que crear una nueva en su próximo ingreso.`,
        confirmText: "Restablecer contraseña",
        danger: true,
      };
    if (confirm.tipo === "off")
      return {
        title: `¿Deshabilitar la cuenta de ${nombre(r)}?`,
        mje: `«${r.usuario}» no va a poder ingresar a la app hasta que la vuelvas a habilitar. Sus datos se conservan y la podés ver en el filtro «Deshabilitados».`,
        confirmText: "Deshabilitar",
        danger: true,
      };
    return {
      title: `¿Habilitar la cuenta de ${nombre(r)}?`,
      mje: `«${r.usuario}» va a poder volver a ingresar con su usuario y contraseña.`,
      confirmText: "Habilitar",
    };
  };

  // Los pacientes se habilitan/deshabilitan con motivo (queda en su historial).
  const confirmEsPaciente = confirm && (confirm.tipo === "off" || confirm.tipo === "on") && esPacienteConFicha(confirm.record);

  return (
    <>
      {loadError && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 12 }}
          message={loadError}
          action={<Button size="small" onClick={cargar}>Reintentar</Button>}
        />
      )}
      <AdminEntityList
        title="Listado de Usuarios"
        count={porEstado.length}
        searchProps={{
          placeholder: "Buscar por nombre, DNI o usuario...",
          value: search,
          onChange: (e) => setSearch(e.target.value),
        }}
        addButton={{ label: "Agregar usuario", icon: <PlusOutlined />, onClick: () => setModal({ mode: "add" }) }}
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
        emptyText={estado === "deshabilitados" ? "No hay cuentas deshabilitadas." : "Todavía no hay usuarios cargados."}
        columns={columns}
        dataSource={lista}
        loading={loading}
        loadingText="Cargando usuarios…"
        rowKey="id"
      />

      <UsuarioFormModal
        open={Boolean(modal)}
        mode={modal?.mode}
        record={modal?.record}
        canEdit
        onSave={(values, record) => (record ? updateUsuario({ ...values, id: record.id }) : insertUsuario(values))}
        onSaved={cargar}
        onClose={() => setModal(null)}
      >
        {modal?.record?.idRol === ROLES.PACIENTE && (
          <Alert
            type="info"
            showIcon
            message="Esta cuenta es de un paciente"
            description="Para ver su estado, historial y habilitarlo o deshabilitarlo con motivo, también podés usar Administración › Paciente."
          />
        )}
      </UsuarioFormModal>

      <VentEmergConfirmacion
        isOpen={Boolean(confirm) && !confirmEsPaciente}
        onClose={() => setConfirm(null)}
        {...textosConfirm()}
        handleSi={ejecutarConfirm}
      />
      <VentEmergenteHabilitamiento
        isOpen={Boolean(confirmEsPaciente)}
        onClose={() => setConfirm(null)}
        accion={confirm?.tipo === "off" ? "deshabilitar" : "habilitar"}
        nombre={nombre(confirm?.record)}
        handleSi={async (motivo) => {
          const r = confirm.record;
          if (confirm.tipo === "off") {
            await DeshabilitarPaciente(r.paciente.id, motivo);
            notify.success(`${nombre(r)} quedó deshabilitado. Ya no puede ingresar.`);
          } else {
            await HabilitarPaciente(r.paciente.id, motivo);
            notify.success(`${nombre(r)} quedó habilitado. Ya puede ingresar.`);
          }
          await cargar();
        }}
      />
      <CredencialesModal datos={credenciales} onClose={() => setCredenciales(null)} />
    </>
  );
};
