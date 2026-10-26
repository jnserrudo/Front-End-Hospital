import React from "react";
import { Alert } from "antd";

/**
 * Aviso que explica por qué los campos están bloqueados (modo lectura)
 * y cómo desbloquearlos. Usar en todos los formularios con botón «Editar».
 */
export const ModoLecturaNota = ({ editando, texto }) =>
  editando ? null : (
    <Alert
      type="info"
      showIcon
      style={{ marginBottom: 12 }}
      message="Estás viendo los datos en modo lectura"
      description={texto || "Los campos están bloqueados para que no se modifiquen por error. Tocá «Editar» (abajo) para modificarlos."}
    />
  );

export default ModoLecturaNota;
