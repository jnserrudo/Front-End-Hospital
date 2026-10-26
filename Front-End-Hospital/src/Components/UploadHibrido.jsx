import React, { useState } from "react";
import { Upload, Radio, Input } from "antd";
import { InboxOutlined, FileTextOutlined, LinkOutlined } from "@ant-design/icons";
import { entorno } from "../services/config";
import { notify } from "../ui/notify";

const { Dragger } = Upload;



/**
 * Componente reutilizable para subir archivos de forma híbrida
 * Permite subir archivos locales O ingresar URLs externas
 * 
 * @param {Function} onUploadSuccess - Callback cuando se sube un archivo exitosamente
 * @param {Function} onUrlChange - Callback cuando se ingresa una URL externa
 * @param {String} acceptedTypes - Tipos de archivo aceptados (default: 'image/*,application/pdf')
 * @param {String} uploadEndpoint - Endpoint para subir archivos (default: '/infografias/upload/files')
 * @param {Number} maxSize - Tamaño máximo en MB (default: 5)
 */
export const UploadHibrido = ({
  onUploadSuccess,
  onUrlChange,
  acceptedTypes = "image/*,application/pdf",
  uploadEndpoint = "/infografias/upload/files",
  maxSize = 5,
}) => {
  const [tipoAlmacenamiento, setTipoAlmacenamiento] = useState("local");
  const [urlExterna, setUrlExterna] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const esPdf = file.type === "application/pdf";
    if (!file.type.startsWith("image/") && !esPdf) {
      notify.error("Ese tipo de archivo no está permitido. Subí una imagen (JPG o PNG) o un PDF.");
      return Upload.LIST_IGNORE;
    }
    const limite = esPdf ? Math.max(maxSize, 10) : maxSize;
    if (file.size > limite * 1024 * 1024) {
      notify.error(`El archivo es demasiado pesado: el máximo es ${limite} MB. Elegí uno más liviano o comprimilo.`);
      return Upload.LIST_IGNORE;
    }
    setUploading(true);
    try {
      const response = await fetch(entorno + uploadEndpoint, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      
      if (data.url) {
        onUploadSuccess && onUploadSuccess(data.url, "local");
      }
    } catch (error) {
      console.error("Error al subir archivo:", error);
      notify.error(error, "No pudimos subir el archivo");
    } finally {
      setUploading(false);
    }
    
    return false; // Prevenir upload automático de antd
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setUrlExterna(url);
    onUrlChange && onUrlChange(url, "externa");
  };

  const handleTipoChange = (e) => {
    setTipoAlmacenamiento(e.target.value);
    // Limpiar valores al cambiar de tipo
    if (e.target.value === "local") {
      setUrlExterna("");
      onUrlChange && onUrlChange("", "local");
    }
  };

  return (
    <div 
      style={{ marginBottom: "1rem" }}
      onErrorCapture={(e) => {
        if (e.target.tagName === 'IMG') {
          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzY0NzQ4YiIgc3Ryb2tlLXdpZHRoPSIxLjUiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIHJ5PSIyIi8+PGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiLz48cG9seWxpbmUgcG9pbnRzPSIyMSAxNSAxNiAxMCA1IDIxIi8+PC9zdmc+';
        }
      }}
    >
      <Radio.Group
        value={tipoAlmacenamiento}
        onChange={handleTipoChange}
        style={{ marginBottom: "1rem" }}
      >
        <Radio value="local">Subir archivo</Radio>
        <Radio value="externa">URL externa</Radio>
      </Radio.Group>

      {tipoAlmacenamiento === "local" ? (
        <Dragger
          accept={acceptedTypes}
          beforeUpload={handleFileUpload}
          maxCount={1}
          showUploadList={{
            showPreviewIcon: true,
            showRemoveIcon: true,
            showDownloadIcon: false,
          }}
          itemRender={(originNode, file, fileList, actions) => {
            if (file.status === 'error' || !file.url) {
              return (
                <div style={{
                  padding: '16px',
                  border: '1px dashed #d9d9d9',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#fafafa',
                  color: '#999',
                  fontSize: 14,
                }}>
                  <FileTextOutlined style={{ fontSize: 20, color: 'var(--gray-400)' }} />
                  <span>Archivo no disponible</span>
                </div>
              );
            }
            return originNode;
          }}
          disabled={uploading}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Hacé clic o arrastrá el archivo acá
          </p>
          <p className="ant-upload-hint">
            Podés subir imágenes JPG o PNG (máx. {maxSize} MB) o PDF (máx. {Math.max(maxSize, 10)} MB)
          </p>
        </Dragger>
      ) : (
        <Input
          type="url"
          placeholder="https://ejemplo.com/imagen.jpg"
          value={urlExterna}
          onChange={handleUrlChange}
          prefix={<LinkOutlined style={{ color: 'var(--gray-400)' }} />}
        />
      )}
    </div>
  );
};
