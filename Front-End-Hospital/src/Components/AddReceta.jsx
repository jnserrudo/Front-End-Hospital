import React, { useContext, useEffect, useState } from "react";
import { Tabs, Input, Button, Space, Upload, Select, Form, Row, Col, Divider } from "antd";
import { UploadOutlined, ArrowRightOutlined, DeleteOutlined, PictureOutlined, WarningOutlined, InboxOutlined } from "@ant-design/icons";
import { SmartTextArea } from "./SmartTextArea";
import RecetasContext from "../Contexts/RecetaContext";
import { VentEmergConfirmacion } from "./VentEmergConfirmacion";
import { entorno } from "../services/config";
import toast from "react-hot-toast";
import "../style.css";

const { TabPane } = Tabs;



export const AddReceta = ({ onClosePadre }) => {
  const {
    recetaToInsert,
    handleChangeInputInsert,
    handleChangeSelectInsert,
    handleChangeSelectCategoriasInsert,
    bandInsert,
    handleInsert,
    handleCloseVentEmergConfirmacion,
    patologiasxRecetasAdd,
    categoriasxRecetasAdd,
    loadingAction,
  } = useContext(RecetasContext);

  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("1");
  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [shouldInsert, setShouldInsert] = useState(false);
  const [errors, setErrors] = useState({});
  const [localPreview, setLocalPreview] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (shouldInsert) {
      toast.promise(handleInsert(), {
        loading: "Cargando",
        success: <b>Se agregó la receta!</b>,
        error: <b>No se pudo agregar la receta.</b>,
      });
      setShouldInsert(false);
    }
  }, [shouldInsert, handleInsert]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!recetaToInsert?.nombre || recetaToInsert.nombre.length < 3) {
      newErrors.nombre = "Nombre requerido (mínimo 3 caracteres)";
    }
    
    if (!recetaToInsert?.porciones) {
      newErrors.porciones = "Porciones requeridas";
    } else {
      const porciones = parseInt(recetaToInsert.porciones);
      if (isNaN(porciones) || porciones < 1 || porciones > 20) {
        newErrors.porciones = "Porciones deben ser entre 1 y 20";
      }
    }
    
    if (!recetaToInsert?.calorias) {
      newErrors.calorias = "Calorías requeridas";
    } else {
      const calorias = parseInt(recetaToInsert.calorias);
      if (isNaN(calorias) || calorias < 1 || calorias > 9999) {
        newErrors.calorias = "Calorías deben ser entre 1 y 9999";
      }
    }
    
    if (!recetaToInsert?.tiempo) {
      newErrors.tiempo = "Tiempo requerido";
    }
    
    if (!recetaToInsert?.ingredientes) {
      newErrors.ingredientes = "Ingredientes requeridos";
    } else {
      const lines = recetaToInsert.ingredientes.split("\n").filter(l => l.trim() !== "");
      if (lines.length < 3) {
        // Validacion removida - no hay minimo de ingredientes
      }
    }
    
    if (!recetaToInsert?.preparacion) {
      newErrors.preparacion = "Preparación requerida";
    } else {
      const lines = recetaToInsert.preparacion.split("\n").filter(l => l.trim() !== "");
      if (lines.length < 3) {
        // Validacion removida - no hay minimo de pasos
      }
    }
    
    if (!recetaToInsert?.idPatologias || recetaToInsert.idPatologias.length === 0) {
      newErrors.idPatologias = "Seleccione al menos una patología";
    }
    
    if (!recetaToInsert?.idCategorias || recetaToInsert.idCategorias.length === 0) {
      newErrors.idCategorias = "Seleccione al menos una categoría";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    const updatedFileList = newFileList.map((f) => {
      if (f.status === "error") {
        return { ...f, status: "done" };
      }
      return f;
    });
    setFileList(updatedFileList);

    if (updatedFileList.length > 0) {
      const file = updatedFileList[0];
      if (file.originFileObj) {
        const url = URL.createObjectURL(file.originFileObj);
        setLocalPreview(url);
        setImageError(false);
      } else if (file.url) {
        setLocalPreview(file.url);
        setImageError(false);
      }
    } else {
      setLocalPreview(null);
      setImageError(false);
      handleChangeInputInsert({ target: { name: "urlFoto", value: "" } });
    }
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(entorno + "/recetas/upload/files", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg" || file.type === "image/webp";
    if (!isJpgOrPng) {
      toast.error("Solo se permiten archivos de imagen (jpeg, jpg, png, webp)");
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      toast.error("La imagen debe ser menor a 5MB");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  // Función para limpiar líneas vacías de campos de texto
  const cleanTextFields = (text) => {
    if (!text) return text;
    return text
      .split("\n")
      .map(line => line.trim())
      .filter(line => line !== "")
      .join("\n");
  };

  const handleInsertWithImage = async () => {
    if (!validateForm()) {
      toast.error("Por favor, corrija los errores en el formulario");
      return;
    }

    try {
      let urlFoto = "";
      if (fileList.length > 0) {
        const uploadedImageUrls = await Promise.all(
          fileList.map((file) => handleFileUpload(file.originFileObj))
        );
        urlFoto = uploadedImageUrls[0];
      }

      // Crear receta completa con la imagen y transformar nombres para el backend
      const { idPatologias, idCategorias, ...restReceta } = recetaToInsert;
      
      // Limpiar campos de texto (eliminar líneas vacías)
      const fullReceta = {
        ...restReceta,
        urlFoto: urlFoto,
        ingredientes: cleanTextFields(restReceta.ingredientes),
        preparacion: cleanTextFields(restReceta.preparacion),
        tipsSaludables: cleanTextFields(restReceta.tipsSaludables),
        composicionNutricional: cleanTextFields(restReceta.composicionNutricional),
        idsPatologias: idPatologias, // Backend espera "idsPatologias"
        idsCategorias: idCategorias  // Backend espera "idsCategorias"
      };

      // Llamar a handleInsert con toast.promise
      await toast.promise(handleInsert(fullReceta), {
        loading: "Guardando receta...",
        success: <b>Se agregó la receta!</b>,
        error: <b>No se pudo agregar la receta.</b>,
      });
    } catch (error) {
      console.error("Error inserting recipe:", error);
      throw error;
    }
  };

  const handleCloseVentEmergente = async () => {
    setShowVentEmergenteConfirmacion(false);
  };

  const normalizeTime = (value) => {
    return value.replace(/minutos?/g, "min").replace(/horas?/g, "h");
  };

  return (
    <div className="form-container-receta modal-form-dense">

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        className="form-tabs"
      >
        {/* TAB 1: BÁSICO */}
        <TabPane tab="Básico" key="1">
          <div className="section-guide">
             Complete la información básica de la receta
          </div>

          <div className="form-section">
            <div className="form-section-title">Información General</div>
            
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div className="form-field">
                  <label className="form-label">
                    Nombre <span className="required">*</span>
                  </label>
                  <Input
                    placeholder="Ej: Humitas Saludables"
                    value={recetaToInsert?.nombre || ""}
                    onChange={(e) => handleChangeInputInsert(e)}
                    name="nombre"
                    className={errors.nombre ? "input-error" : ""}
                  />
                  {errors.nombre && <div className="error-message"> {errors.nombre}</div>}
                  <div className="field-help">3-100 caracteres</div>
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div className="form-field">
                  <label className="form-label">
                    Porciones <span className="required">*</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="Ej: 4"
                    value={recetaToInsert?.porciones || ""}
                    onChange={(e) => handleChangeInputInsert(e)}
                    name="porciones"
                    min={1}
                    max={20}
                    className={errors.porciones ? "input-error" : ""}
                  />
                  {errors.porciones && <div className="error-message"> {errors.porciones}</div>}
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div className="form-field">
                  <label className="form-label">
                    Calorías <span className="required">*</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="Ej: 130"
                    value={recetaToInsert?.calorias || ""}
                    onChange={(e) => handleChangeInputInsert(e)}
                    name="calorias"
                    min={1}
                    max={9999}
                    className={errors.calorias ? "input-error" : ""}
                  />
                  {errors.calorias && <div className="error-message"> {errors.calorias}</div>}
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div className="form-field">
                  <label className="form-label">
                    Tiempo <span className="required">*</span>
                  </label>
                  <Input
                    placeholder="Ej: 30 min"
                    value={recetaToInsert?.tiempo || ""}
                    onChange={(e) => handleChangeInputInsert(e)}
                    name="tiempo"
                    className={errors.tiempo ? "input-error" : ""}
                  />
                  {errors.tiempo && <div className="error-message"> {errors.tiempo}</div>}
                </div>
              </Col>
            </Row>
          </div>

          <Divider />

          <div className="form-section form-receta-media-row">
            <Row gutter={[16, 12]} align="top">
              <Col xs={24} md={10}>
                <div className="form-field">
                  <label className="form-label">Foto de la receta</label>

                  {localPreview && !imageError ? (
                    <div className="custom-image-preview-container">
                      <img
                        src={localPreview}
                        alt={recetaToInsert?.nombre || "Foto de la receta"}
                        className="custom-image-preview"
                        onError={() => setImageError(true)}
                      />
                      <div className="custom-image-overlay">
                        <div className="custom-image-actions">
                          <Upload
                            accept="image/*"
                            beforeUpload={beforeUpload}
                            showUploadList={false}
                            onChange={handleFileChange}
                            fileList={fileList}
                            maxCount={1}
                          >
                            <Button type="primary" icon={<UploadOutlined />}>
                              Cambiar
                            </Button>
                          </Upload>
                          <Button
                            danger
                            type="primary"
                            icon={<DeleteOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              setFileList([]);
                              setLocalPreview(null);
                              setImageError(false);
                              handleChangeInputInsert({
                                target: { name: "urlFoto", value: "" },
                              });
                            }}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Upload
                      accept="image/*"
                      beforeUpload={beforeUpload}
                      showUploadList={false}
                      onChange={handleFileChange}
                      fileList={fileList}
                      maxCount={1}
                    >
                      <div className="custom-image-upload-dropzone">
                        {imageError ? (
                          <div className="custom-image-placeholder-error">
                            <span className="placeholder-icon">
                              <WarningOutlined
                                style={{ color: "var(--danger)" }}
                              />
                            </span>
                            <span className="placeholder-title">
                              {recetaToInsert?.nombre || "Sin imagen"}
                            </span>
                            <span className="placeholder-subtitle">
                              Subí otra imagen
                            </span>
                          </div>
                        ) : (
                          <div className="custom-image-placeholder-empty">
                            <span className="placeholder-icon">
                              <InboxOutlined
                                style={{ color: "var(--primary)" }}
                              />
                            </span>
                            <span className="placeholder-title font-semibold">
                              Subir foto
                            </span>
                            <span className="placeholder-subtitle">
                              JPG, PNG, WEBP · máx 5MB
                            </span>
                          </div>
                        )}
                      </div>
                    </Upload>
                  )}
                </div>
              </Col>

              <Col xs={24} md={14}>
                <div className="form-section-title">Clasificación</div>
                <div className="form-field">
                  <label className="form-label">
                    Patologías <span className="required">*</span>
                  </label>
                  <Select
                    mode="multiple"
                    placeholder="Seleccione patologías"
                    value={recetaToInsert?.idPatologias || []}
                    onChange={(value) =>
                      handleChangeSelectInsert({
                        target: { name: "idPatologias", value },
                      })
                    }
                    options={patologiasxRecetasAdd}
                    maxTagCount="responsive"
                    className={errors.idPatologias ? "input-error" : ""}
                  />
                  {errors.idPatologias && (
                    <div className="error-message"> {errors.idPatologias}</div>
                  )}
                </div>
                <div className="form-field">
                  <label className="form-label">
                    Categorías <span className="required">*</span>
                  </label>
                  <Select
                    mode="multiple"
                    placeholder="Seleccione categorías"
                    value={recetaToInsert?.idCategorias || []}
                    onChange={(value) =>
                      handleChangeSelectCategoriasInsert({
                        target: { name: "idCategorias", value },
                      })
                    }
                    options={categoriasxRecetasAdd}
                    maxTagCount="responsive"
                    className={errors.idCategorias ? "input-error" : ""}
                  />
                  {errors.idCategorias && (
                    <div className="error-message"> {errors.idCategorias}</div>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </TabPane>

        {/* TAB 2: INGREDIENTES & PREPARACIÓN */}
        <TabPane tab="Ingredientes & Preparación" key="2">
          <div className="section-guide">
             Presiona Enter para numerar automáticamente. Mínimo 3 ingredientes y 3 pasos.
          </div>

          <div className="form-section">
            <div className="form-section-title">Ingredientes</div>
            
            <div className="form-field">
              <SmartTextArea
                value={recetaToInsert?.ingredientes || ""}
                onChange={handleChangeInputInsert}
                name="ingredientes"
                placeholder="Ejemplo: 1 taza de harina&#10;65 gr de zapallo&#10;50 gr de pimiento"
                helpText="Presiona Enter para numerar automáticamente"
                required={true}
              />
              {errors.ingredientes && <div className="error-message"> {errors.ingredientes}</div>}
            </div>
          </div>

          <Divider />

          <div className="form-section">
            <div className="form-section-title">Preparación</div>
            
            <div className="form-field">
              <SmartTextArea
                value={recetaToInsert?.preparacion || ""}
                onChange={handleChangeInputInsert}
                name="preparacion"
                placeholder="Ejemplo: Cortar el choclo en trozos&#10;Cocinar el zapallo&#10;Mezclar todos los ingredientes"
                helpText="Describe paso a paso. Presiona Enter para numerar."
                maxItems={20}
                required={true}
              />
              {errors.preparacion && <div className="error-message"> {errors.preparacion}</div>}
            </div>
          </div>
        </TabPane>

        {/* TAB 3: NUTRICIÓN & TIPS */}
        <TabPane tab="Nutrición & Tips" key="3">
          <div className="section-guide">
             Información nutricional opcional para enriquecer la receta
          </div>

          <div className="form-section">
            <div className="form-section-title">Tips Saludables (Opcional)</div>
            
            <div className="form-field">
              <label className="form-label">
                Tips
              </label>
              <SmartTextArea
                value={recetaToInsert?.tipsSaludables || ""}
                onChange={handleChangeInputInsert}
                name="tipsSaludables"
                placeholder="Ejemplo: Rico en fibra&#10;Bajo en sodio&#10;Sin gluten"
                helpText="Consejos nutricionales"
                minItems={0}
                maxItems={10}
                required={false}
              />
            </div>
          </div>

          <Divider />

          <div className="form-section">
            <div className="form-section-title">Composición Nutricional (Opcional)</div>
            
            <div className="form-field">
              <label className="form-label">
                Composición
              </label>
              <SmartTextArea
                value={recetaToInsert?.composicionNutricional || ""}
                onChange={handleChangeInputInsert}
                name="composicionNutricional"
                placeholder="Ejemplo: Proteínas: 5g&#10;Carbohidratos: 20g&#10;Grasas: 3g"
                helpText="Detalla valores nutricionales"
                minItems={0}
                maxItems={15}
                required={false}
              />
            </div>
          </div>
        </TabPane>
      </Tabs>

      <div className="form-actions">
        <Space>
          <Button onClick={onClosePadre}>
            Cancelar
          </Button>
          <Button 
            type="primary" 
            icon={<ArrowRightOutlined />}
            loading={activeTab === "3" && loadingAction}
            onClick={() => {
              if (activeTab === "1") {
                setActiveTab("2");
              } else if (activeTab === "2") {
                setActiveTab("3");
              } else {
                setShowVentEmergenteConfirmacion(true);
              }
            }}
          >
            {activeTab === "3" ? "Guardar Receta" : "Siguiente"}
          </Button>
        </Space>
      </div>

      <VentEmergConfirmacion
        onClosePadre={onClosePadre}
        onClose={handleCloseVentEmergente}
        mje="¿Está seguro de agregar esta receta?"
        handleSi={handleInsertWithImage}
        isOpen={showVentEmergenteConfirmacion}
      />
    </div>
  );
};
