import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, Empty, Spin, Alert, Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { RowActions } from "./RowActions";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { apiFetch, friendlyMessage } from "../services/http";
import { filterBySearch } from "../utils/search";
import { notify } from "../ui/notify";

/**
 * Lista de elementos deshabilitados (borrado lógico) de una entidad, con la acción
 * «Habilitar» para recuperarlos. Usa /api/estado/:entidad.
 * props: entidad ("faq", "recetas"…), singular ("pregunta"), articulo ("la" | "el"),
 *        search (texto), onRestored() para recargar la lista de activos.
 */
export const DeshabilitadosList = ({ entidad, singular, articulo = "la", search = "", onRestored, onCount }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aHabilitar, setAHabilitar] = useState(null);
  const Singular = singular.charAt(0).toUpperCase() + singular.slice(1);
  const fem = articulo === "la";

  const cargar = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch(`/estado/${entidad}/deshabilitados`);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(friendlyMessage(err, "No pudimos cargar los elementos deshabilitados"));
    } finally {
      setLoading(false);
    }
  }, [entidad]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const lista = useMemo(() => filterBySearch(items, search), [items, search]);
  useEffect(() => {
    onCount?.(items.length);
  }, [items.length, onCount]);

  const columns = [
    { title: Singular, dataIndex: "etiqueta", key: "etiqueta" },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      width: 120,
      render: (_, r) => (
        <RowActions
          actions={[
            { key: "on", label: "Volver a habilitar", icon: <CheckCircleOutlined />, onClick: () => setAHabilitar(r) },
          ]}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <Spin tip={`Cargando ${singular}s deshabilitad${fem ? "a" : "o"}s…`}>
          <div style={{ minHeight: 40 }} />
        </Spin>
      </div>
    );
  }

  return (
    <>
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 12 }}
        message={`Estos elementos no se muestran en la app`}
        description={`Deshabilitar no borra nada. Tocá el ícono de «Habilitar» para que ${articulo} ${singular} vuelva a mostrarse.`}
      />
      {error ? (
        <Alert type="warning" showIcon message={error} action={<Button size="small" onClick={cargar}>Reintentar</Button>} />
      ) : (
        <Table
          className="admin-table"
          rowKey="id"
          columns={columns}
          dataSource={lista}
          pagination={{ pageSize: 8, hideOnSinglePage: true }}
          locale={{
            emptyText: (
              <Empty
                description={
                  search
                    ? `No encontramos ${singular}s deshabilitad${fem ? "a" : "o"}s para «${search}».`
                    : `No hay ${singular}s deshabilitad${fem ? "a" : "o"}s.`
                }
              />
            ),
          }}
        />
      )}
      <VentEmergConfirmacion
        isOpen={Boolean(aHabilitar)}
        onClose={() => setAHabilitar(null)}
        title={`¿Volver a habilitar ${articulo} ${singular} «${aHabilitar?.etiqueta || ""}»?`}
        mje={`Va a volver a mostrarse en la app como antes de deshabilitarl${fem ? "a" : "o"}.`}
        confirmText="Habilitar"
        errorFallback={`No pudimos habilitar ${articulo} ${singular}`}
        handleSi={async () => {
          const r = aHabilitar;
          await apiFetch(`/estado/${entidad}/habilitar/${r.id}`, { method: "PUT" });
          notify.success(`${Singular} «${r.etiqueta}» habilitad${fem ? "a" : "o"}. Ya se muestra de nuevo en la app.`);
          await cargar();
          onRestored?.();
        }}
      />
    </>
  );
};

export default DeshabilitadosList;
