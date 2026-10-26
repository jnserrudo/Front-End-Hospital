import { Tabs, Tab, TabList, TabPanel, TabPanels } from "@chakra-ui/react";
import { YoutubeEmbed } from "./YoutubeEmbed";
import { ModoLecturaNota } from "./ModoLecturaNota";

import {
  Button,
  ButtonGroup,
  Textarea,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Space, Upload, Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import "../style.css";
import ReactPlayer from "react-player";
import { MediaNoDisponible } from "./MediaNoDisponible";

import { VentEmergConfirmacion } from "./VentEmergConfirmacion";

import InformacionsContext from "../Contexts/InformacionContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@chakra-ui/react";
import { entorno, getMediaUrl } from "../services/config";
import { notify } from "../ui/notify";

// Envoltorio: si todavía no hay registro no se monta el formulario, así los hooks
// de adentro se llaman siempre en el mismo orden (reglas de hooks de React).
export const EditInformacion = (props) => (props.informacion ? <EditInformacionForm {...props} /> : null);

const EditInformacionForm = ({ informacion, onCloseEdit, onModoChange }) => {
  /* console.log(
    "edit informacion: ",
    informacion,
    entorno.slice(0, -4) + informacion.urlVideo
  ); */
  const navigate = useNavigate();
  const handleShowConsulta = (ndocu) => {
    navigate("/informacion/" + ndocu);
  };

  const [bandEdit, setBandEdit] = useState(false);
  // Avisamos al modal si estamos en modo lectura o edición (para el título)
  const cambiarModo = (v) => {
    setBandEdit(v);
    onModoChange?.(v);
  };
  const [bandUpdated, setBandUpdated] = useState(false);
  const [showVentEmergenteConfirmacion, setShowVentEmergenteConfirmacion] =
    useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [urlVideo, setUrlVideo] = useState("");
  const [previewError, setPreviewError] = useState(false);
  useEffect(() => setPreviewError(false), [previewUrl]);

  const [fileList, setFileList] = useState(
    informacion.urlVideo
      ? [
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: getMediaUrl(informacion.urlVideo),
          },
        ]
      : []
  );
  const [patologiasAsociadas, setPatologiasAsociadas] = useState([]);
  const [patologiasNoAsociadas, setPatologiasNoAsociadas] = useState([]);
  const [selectedPatologias, setSelectedPatologias] = useState([]);
  const [opcionesPatologias, setOpcionesPatologias] = useState([]);

  /* ------------------------- */

  const [categoriasAsociadas, setCategoriasAsociadas] = useState([]);
  const [categoriasNoAsociadas, setCategoriasNoAsociadas] = useState([]);
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const [opcionesCategorias, setOpcionesCategorias] = useState([]);

  /* ------------------------- */

  const {
    handleChangeInput,
    handleUpdate,
    handleChangeSelect,
    patologiasxInformacionEdit,
    categoriasxInformacionEdit,
    handleChangeSelectCategorias,
    loadingAction,
  } = useContext(InformacionsContext);

  const sharedProps = {
    mode: "multiple",
    style: { width: "100%" },
    options: opcionesPatologias,
    placeholder: "Elegí una patología",
    maxTagCount: "responsive",
    value: selectedPatologias,
    renderOptionLabel: (option) => (
      <div>
        {option.label} {option.type === "asociada" ? "(Asociada)" : ""}
      </div>
    ),
  };

  const sharedPropsCategorias = {
    mode: "multiple",
    style: { width: "100%" },
    options: opcionesCategorias,
    placeholder: "Elegí una categoría",
    maxTagCount: "responsive",
    value: selectedCategorias,
    renderOptionLabel: (option) => (
      <div>
        {option.label} {option.type === "asociada" ? "(Asociada)" : ""}
      </div>
    ),
  };

  useEffect(() => {
    setBandUpdated(bandEdit);
  }, [bandEdit]);

  useEffect(() => {
    setFileList(
      informacion.urlVideo
        ? [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: getMediaUrl(informacion.urlVideo),
            },
          ]
        : []
    );
    if (informacion?.urlVideo) {
      setUrlVideo(informacion?.urlVideo);
    }
    /* console.log("el valor de previewurl es: ",previewUrl)
    if (!previewUrl && informacion?.urlVideo?.length>0) {
      console.log("SE VA A PONER EN EL PREVIEWURL LO SGTE: ", getMediaUrl(informacion.urlVideo))
      setPreviewUrl(getMediaUrl(informacion.urlVideo));
    } */
  }, [informacion]);

  useEffect(() => {
    handleChangeInput({ target: { name: "urlVideo", value: urlVideo } });

    if (urlVideo.includes("<iframe")) {
      setPreviewUrl(urlVideo);
    } else {
      if (urlVideo.includes("blob")) {
        setPreviewUrl(urlVideo);
      } else {
        setPreviewUrl(getMediaUrl(urlVideo));
      }
    }
  }, [urlVideo]);

  useEffect(() => {
    console.log(patologiasxInformacionEdit);
    if (
      patologiasxInformacionEdit &&
      Object.values(patologiasxInformacionEdit).length > 1
    ) {
      setPatologiasAsociadas(patologiasxInformacionEdit.patologiasAsociadas);
      setPatologiasNoAsociadas(
        patologiasxInformacionEdit.patologiasNoAsociadas
      );
      setSelectedPatologias(
        patologiasxInformacionEdit.patologiasAsociadas.map((p) => p.id)
      );
    }
  }, [patologiasxInformacionEdit]);

  useEffect(() => {
    console.log(categoriasxInformacionEdit);
    if (
      categoriasxInformacionEdit &&
      Object.values(categoriasxInformacionEdit).length > 0
    ) {
      setCategoriasAsociadas(categoriasxInformacionEdit.categoriasAsociadas);
      setCategoriasNoAsociadas(
        categoriasxInformacionEdit.categoriasNoAsociadas
      );
      setSelectedCategorias(
        categoriasxInformacionEdit.categoriasAsociadas.map((p) => p.id)
      );
    }
  }, [categoriasxInformacionEdit]);

  useEffect(() => {
    if (patologiasAsociadas.length > 0 || patologiasNoAsociadas.length > 0) {
      console.log(
        "patologiasAsociadas,patologiasNoAsociadas: ",
        patologiasAsociadas,
        patologiasNoAsociadas
      );
      setOpcionesPatologias([
        ...patologiasAsociadas.map((p) => ({
          label: p.nombre,
          value: p.id,
          type: "asociada",
        })),
        ...patologiasNoAsociadas.map((p) => ({
          label: p.nombre,
          value: p.id,
          type: "no-asociada",
        })),
      ]);
    }
  }, [patologiasAsociadas, patologiasNoAsociadas]);

  useEffect(() => {
    if (categoriasAsociadas.length > 0 || categoriasNoAsociadas.length > 0) {
      console.log(
        "categoriasAsociadas,categoriasNoAsociadas: ",
        categoriasAsociadas,
        categoriasNoAsociadas
      );
      setOpcionesCategorias([
        ...categoriasAsociadas.map((p) => ({
          label: p.nombre,
          value: p.id,
          type: "asociada",
        })),
        ...categoriasNoAsociadas.map((p) => ({
          label: p.nombre,
          value: p.id,
          type: "no-asociada",
        })),
      ]);
    }
  }, [categoriasAsociadas, categoriasNoAsociadas]);

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const file = newFileList[0].originFileObj;
      const url = URL.createObjectURL(file);
      console.log(url);
      // Solo para la vista previa: la dirección «blob:» vive en este navegador y no se guarda.
      // La dirección definitiva la devuelve el servidor al subir el archivo al guardar.
      setPreviewUrl(url);
    } else if (newFileList.length === 0) {
      setPreviewUrl(urlVideo ? (urlVideo.includes("<iframe") ? urlVideo : getMediaUrl(urlVideo)) : null);
    }
  };
  const beforeUpload = (file) => {
    const esImagen = file.type.startsWith("image/");
    const esVideo = file.type.startsWith("video/");
    if (!esImagen && !esVideo) {
      notify.error("Ese tipo de archivo no está permitido. Subí un video (MP4, WEBM o MOV) o una imagen (JPG, PNG o WEBP).");
      return Upload.LIST_IGNORE;
    }
    const maxMB = esVideo ? 200 : 5;
    if (file.size > maxMB * 1024 * 1024) {
      notify.error(`El archivo es demasiado pesado: el máximo es ${maxMB} MB para ${esVideo ? "videos" : "imágenes"}. Elegí uno más liviano o comprimilo.`);
      return Upload.LIST_IGNORE;
    }
    return true;
  };
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(entorno + "/informacion/upload/files", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!data?.url || String(data.url).startsWith("blob:")) {
        throw new Error("No pudimos subir el archivo. Probá de nuevo o elegí otro.");
      }
      return data.url;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  // Función para limpiar líneas vacías
  const cleanTextFields = (text) => {
    if (!text) return text;
    return text
      .split("\n")
      .map(line => line.trim())
      .filter(line => line !== "")
      .join("\n");
  };

  const handleUpdateWithImage = async () => {
    try {
      let urlVideo;
      if (fileList.length > 0 && fileList[fileList.length - 1].originFileObj) {
        urlVideo = await handleFileUpload(
          fileList[fileList.length - 1].originFileObj
        );
        console.log(urlVideo);
        handleChangeInput({ target: { name: "urlVideo", value: urlVideo } });
      }
      
      const informacionToUpdate = urlVideo ? { ...informacion, urlVideo } : informacion;
      const informacionLimpia = {
        ...informacionToUpdate,
        descripcion: cleanTextFields(informacionToUpdate.descripcion),
      };
      
      await handleUpdate(informacionLimpia);
    } catch (error) {
      console.error("Error updating recipe:", error);
      throw error;
    }
  };

  return (
    <div className="form">
      <ModoLecturaNota editando={bandEdit} />
      <Grid
        className="grid_chackra"
        templateColumns={{
          base: "1fr",
          md: "repeat(auto-fit, minmax(470px, 1fr))",
        }}
        gap={10}
      >
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="nombre"
            isRequired
          >
            <Input
              className={`input_floating ${!bandEdit ? "input_disabled" : ""}`}
              label="Nombre"
              name="nombre"
              variant="outlined"
              type="text"
              disabled={!bandEdit}
              value={informacion.nombre ? informacion.nombre : ""}
              onChange={(e) => handleChangeInput(e)}
            />
            <FormLabel>Nombre</FormLabel>
          </FormControl>
        </GridItem>
        {previewUrl &&
          (previewUrl.includes("<iframe") ? (
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%', marginBottom: '1rem', background: 'var(--gray-100)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
  <YoutubeEmbed valor={previewUrl} />
</div>
                </div>
              </GridItem>
            ) : (
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%', marginBottom: '1rem', background: 'var(--gray-100)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  {previewError ? (
                    <MediaNoDisponible detalle="Elegí otro archivo o pegá un enlace de YouTube para reemplazarlo." style={{ position: 'absolute', inset: 0 }} />
                  ) : (
                    <ReactPlayer width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }} controls src={previewUrl} onError={() => setPreviewError(true)} />
                  )}
                </div>
              </GridItem>
            ))}

        <Tabs variant="enclosed">
          <TabList>
            <Tab>Reemplazar archivo</Tab>
            <Tab>Enlace de YouTube</Tab>
          </TabList>
          <TabPanels>
            <TabPanel className="tab_video_iframe">
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <Upload
                  className="imgCrop"
                  listType="picture-card"
                  fileList={fileList}
                  beforeUpload={beforeUpload}
                  maxCount={1}
                  progress={true}
                  disabled={!bandEdit}
                  onPreview={async (file) => {
                    if (file.url) {
                      window.open(file.url);
                    } else {
                      const preview = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file.originFileObj);
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = (error) => reject(error);
                      });
                      const imgWindow = window.open();
                      imgWindow.document.write(
                        `<img src="${preview}" alt="preview" onerror="this.style.display='none'; this.parentElement.innerHTML='<p style=\'color:#475569;text-align:center;padding:20px;\'>Este archivo no está disponible</p>'" />`
                      );
                    }
                  }}
                  showUploadList={false}
                  customRequest={({ file, onSuccess }) => {
                    setTimeout(() => {
                      onSuccess("ok");
                    }, 0);
                  }}
                  onChange={handleFileChange}
                >
                  {"Tocá para elegir otro video o imagen"}
                </Upload>
              </GridItem>
            </TabPanel>
            <TabPanel>
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <FormControl >
                  <FormLabel htmlFor="iframeUrl">Iframe URL</FormLabel>
                  <Textarea
                    className={`input_floating ${
                      !bandEdit ? "input_disabled" : ""
                    }`}
                    size="sm"
                    variant="outlined"
                    type="text"
                    id="iframeUrl"
                    disabled={!bandEdit}
                    value={urlVideo}
                    onChange={(e) => setUrlVideo(e.target.value)}
                    placeholder="Pegá la URL o el código del video (iframe)"
                  />
                </FormControl>
              </GridItem>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl isRequired>
            <FormLabel>Patologías</FormLabel>
            <Select
              disabled={!bandEdit}
              name="idPatologias"
              {...sharedProps}
              onChange={(e) => {
                handleChangeSelect(e);
                setSelectedPatologias(e);
              }}
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl isRequired>
            <FormLabel>Categorías</FormLabel>
            <Select
              disabled={!bandEdit}
              name="idCategorias"
              {...sharedPropsCategorias}
              onChange={(e) => {
                handleChangeSelectCategorias(e);
                setSelectedCategorias(e);
              }}
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl isRequired>
            <FormLabel>Tipo de Contenido</FormLabel>
            <Select
              disabled={!bandEdit}
              style={{ width: "100%" }}
              value={informacion?.tipoContenido || "video"}
              onChange={(value) => handleChangeInput({ target: { name: "tipoContenido", value } })}
              options={[
                { label: "Video", value: "video" },
                { label: "Infografia", value: "infografia" },
                { label: "Ambos", value: "ambos" },
              ]}
            />
          </FormControl>
        </GridItem>

        {(informacion?.tipoContenido === "infografia" || informacion?.tipoContenido === "ambos") && (
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <FormControl
              className="cont_input_edit"
              variant="floating"
              id="urlInfografia"
              isRequired
            >
              <Input
                className={`input_floating ${!bandEdit ? "input_disabled" : ""}`}
                placeholder=""
                name="urlInfografia"
                variant="outlined"
                type="text"
                disabled={!bandEdit}
                value={informacion?.urlInfografia ? informacion.urlInfografia : ""}
                onChange={(e) => handleChangeInput(e)}
              />
              <FormLabel>URL de la Infografia</FormLabel>
            </FormControl>
          </GridItem>
        )}

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl
            className="cont_input_edit"
            variant="floating"
            id="descripcion"
            isRequired
          >
            <Textarea
              className={`input_floating ${!bandEdit ? "input_disabled" : ""}`}
              label="Descripción"
              name="descripcion"
              size="sm"
              variant="outlined"
              type="text"
              disabled={!bandEdit}
              value={informacion.descripcion ? informacion.descripcion : ""}
              onChange={(e) => handleChangeInput(e)}
            />
            <FormLabel>Descripción</FormLabel>
          </FormControl>
        </GridItem>
      </Grid>

      <div className="cont_btns_acciones">
        {!bandEdit ? (
          <Button
            className="btn_accion_edit_informacion"
            /* variant="outlined" */
            colorScheme="blue" variant="outline"
            onClick={() => cambiarModo(true)}
          >
            Editar
          </Button>
        ) : (
          <Button
            className="btn_accion_edit_informacion"
            /* variant="contained" */
            colorScheme="gray"
            onClick={() => cambiarModo(false)}
          >
            Cancelar
          </Button>
        )}

        {bandUpdated ? (
          <Button
            className="btn_accion_edit_informacion"
            colorScheme="blue"
            onClick={() => setShowVentEmergenteConfirmacion(true)}
            isLoading={loadingAction}
          >
            Guardar cambios
          </Button>
        ) : null}
      </div>

      <VentEmergConfirmacion
        onClosePadre={onCloseEdit}
        onClose={() => setShowVentEmergenteConfirmacion(false)}
        title={`¿Guardar los cambios de «${informacion?.nombre || ""}»?`}
        mje="Los pacientes van a ver la versión actualizada en la sección Información."
        confirmText="Guardar cambios"
        errorFallback="No pudimos guardar los cambios"
        handleSi={async () => {
          await handleUpdateWithImage();
        }}
        isOpen={showVentEmergenteConfirmacion}
      />
    </div>
  );
};

/* 
  <TextField
                  className="input_carga plan_anioc_edicion_input"
                  id="outlined-basic"
                  label="Año de Cursado"
                  variant="outlined"
                  name="añoc"
                  type="number"
                  onChange={(e) => {
                    handleChange(e);
                    setCurso({
                      ...curso,
                      añoc: e.target.value,
                    });
                  }}
                  onBlur={() => handleBlurElementosForm("añoc")}
                  value={curso.añoc ? curso.añoc : ""}
                />
  */
