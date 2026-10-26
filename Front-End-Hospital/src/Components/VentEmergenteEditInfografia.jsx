import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { notify } from "../ui/notify";
import { updateInfografia } from "../services/infografia-services";
import { UploadHibrido } from "./UploadHibrido";

const { TextArea } = Input;

export const VentEmergenteEditInfografia = ({ show, handleClose, infografia }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pendiente, setPendiente] = useState(null);
  const [urlArchivo, setUrlArchivo] = useState("");
  const [tipoAlmacenamiento, setTipoAlmacenamiento] = useState("local");

  useEffect(() => {
    if (infografia) {
      form.setFieldsValue({
        titulo: infografia.titulo,
        descripcion: infografia.descripcion,
        categoria: infografia.categoria,
        tipoArchivo: infografia.tipoArchivo,
      });
      setTipoAlmacenamiento(infografia.tipoAlmacenamiento);
      setUrlArchivo(
        infografia.tipoAlmacenamiento === "local"
          ? infografia.urlArchivo
          : infografia.urlExterna
      );
    }
  }, [infografia, form]);

  // 1) validamos, 2) pedimos confirmación, 3) guardamos.
  const handleSubmit = async () => {
    let values;
    try {
      values = await form.validateFields();
    } catch {
      notify.warning("Revisá los campos marcados en rojo antes de guardar.");
      return;
    }
    if (!urlArchivo) {
      notify.warning("Falta el archivo: subí una imagen/PDF o pegá un enlace externo.");
      return;
    }
    setPendiente({
      titulo: values.titulo,
      descripcion: values.descripcion,
      categoria: values.categoria,
      tipoArchivo: values.tipoArchivo,
      tipoAlmacenamiento: tipoAlmacenamiento,
      urlArchivo: tipoAlmacenamiento === "local" ? urlArchivo : null,
      urlExterna: tipoAlmacenamiento === "externa" ? urlArchivo : null,
    });
  };

  const guardar = async () => {
    const datos = pendiente;
    setLoading(true);
    try {
      await updateInfografia(infografia.id, datos);
      notify.success(`Infografía «${datos.titulo}» actualizada.`);
      setPendiente(null);
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (url, tipo) => {
    setUrlArchivo(url);
    setTipoAlmacenamiento(tipo);
  };

  const handleUrlChange = (url, tipo) => {
    setUrlArchivo(url);
    setTipoAlmacenamiento(tipo);
  };

  return (
    <Modal
      title={`Editar infografía${infografia?.titulo ? `: ${infografia.titulo}` : ""}`}
      open={show}
      onOk={handleSubmit}
      onCancel={handleClose}
      confirmLoading={loading}
      width={600}
      okText="Guardar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Título"
          name="titulo"
          rules={[{ required: true, message: "El título es requerido" }]}
        >
          <Input placeholder="Ej: Dieta Mediterránea" />
        </Form.Item>

        <Form.Item
          label="Descripción"
          name="descripcion"
          rules={[{ required: true, message: "La descripción es requerida" }]}
        >
          <TextArea rows={3} placeholder="Descripción de la infografía..." />
        </Form.Item>

        <Form.Item
          label="Categoría"
          name="categoria"
          rules={[{ required: true, message: "La categoría es requerida" }]}
        >
          <Select placeholder="Elegí una categoría">
            <Select.Option value="vegetariana">Vegetariana</Select.Option>
            <Select.Option value="cetogenica">Cetogénica</Select.Option>
            <Select.Option value="mediterranea">Mediterránea</Select.Option>
            <Select.Option value="dash">DASH</Select.Option>
            <Select.Option value="baja_sodio">Baja en Sodio</Select.Option>
            <Select.Option value="diabetica">Diabética</Select.Option>
            <Select.Option value="hipertension">Hipertensión</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Tipo de Archivo"
          name="tipoArchivo"
          rules={[{ required: true, message: "El tipo de archivo es requerido" }]}
        >
          <Select placeholder="Elegí el tipo">
            <Select.Option value="imagen">Imagen</Select.Option>
            <Select.Option value="pdf">PDF</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Archivo / URL">
          <UploadHibrido
            onUploadSuccess={handleUploadSuccess}
            onUrlChange={handleUrlChange}
            acceptedTypes="image/*,application/pdf"
            uploadEndpoint="/infografias/upload/files"
            maxSize={5}
          />
        </Form.Item>
      </Form>
      <VentEmergConfirmacion
        isOpen={Boolean(pendiente)}
        onClose={() => setPendiente(null)}
        title={`¿Guardar los cambios de «${pendiente?.titulo || ""}»?`}
        mje={"Los pacientes van a ver la versión actualizada en la sección Infografías."}
        confirmText={"Guardar cambios"}
        errorFallback="No pudimos guardar la infografía"
        handleSi={guardar}
      />
    </Modal>
  );
};
