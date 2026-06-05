import React, { useContext, useEffect, useState } from "react";
import { Select, Input, Alert, Button, Modal, Form, Radio, Checkbox, Slider, Rate, message, Tabs, Tag, Empty } from "antd";
import { ListVideos } from "../Components/ListVideos";
import EjercicioContext from "../Contexts/EjercicioContext";
import { entorno, getMediaUrl } from "../services/config";
import { SearchOutlined, ThunderboltOutlined, InfoCircleOutlined, HeartOutlined, SendOutlined, FilePdfOutlined, ExportOutlined } from "@ant-design/icons";
import { getAllEjercicios } from "../services/ejercicio-services";

export const Ejercicio = () => {
  const [videos, setVideos] = useState([]);

  const [options, setOptions] = useState([]);
  const [videosSearch, setVideosSearch] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [evalType, setEvalType] = useState('general'); // 'general' o 'ejercicio'
  const [selectedEjercicio, setSelectedEjercicio] = useState(null);
  const [profesionales, setProfesionales] = useState([]);
  const [form] = Form.useForm();
  const [submittingEval, setSubmittingEval] = useState(false);
  const [activeTab, setActiveTab] = useState("1"); // "1" = Videos, "2" = Infografías

  // Cargar profesionales
  useEffect(() => {
    const fetchProfesionales = async () => {
      try {
        const res = await fetch(`${entorno}/usuarios/profesionales/lista`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setProfesionales(data);
        }
      } catch (err) {
        console.error("Error al cargar profesionales", err);
      }
    };
    fetchProfesionales();
  }, []);

  const handleOpenAutoevaluacion = (type, ejercicio = null) => {
    setEvalType(type);
    setSelectedEjercicio(ejercicio);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSendAutoevaluacion = async (values) => {
    setSubmittingEval(true);
    const idUsuario = localStorage.getItem("idUsuario");
    if (!idUsuario) {
      message.error("Sesión de usuario no válida");
      setSubmittingEval(false);
      return;
    }

    const { profesionalId, ...respuestas } = values;

    const payload = {
      idUsuario: +idUsuario,
      profesionalId: +profesionalId,
      ejercicioId: selectedEjercicio ? selectedEjercicio.id : null,
      tipo: evalType,
      respuestas: respuestas
    };

    try {
      const res = await fetch(`${entorno}/autoevaluaciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = res.ok ? await res.json() : null;
      if (res.ok && result && !result.err) {
        message.success("Autoevaluación enviada con éxito al profesional");
        setIsModalVisible(false);
      } else {
        message.error("Error al enviar la autoevaluación: " + ((result && result.message) || "Intente nuevamente"));
      }
    } catch (err) {
      console.error(err);
      message.error("Error de conexión al enviar autoevaluación");
    } finally {
      setSubmittingEval(false);
    }
  };

  const {
    db,
    dbSearch,
    handleSearch,
    patologiasxEjercicioAdd,
    categoriasxEjercicioAdd,
    handleChangeSelectEjercicioFiltrar,
    handleChangeSelectCategoriasFiltrar,
  } = useContext(EjercicioContext);
  console.log(db);

  const sharedProps = {
    mode: "multiple",
    style: {
      width: "100%",
    },
    options: patologiasxEjercicioAdd,
    placeholder: "Seleccione una Patología",
    maxTagCount: "responsive",
  };

  const sharedPropsCategorias = {
    mode: "multiple",
    style: {
      width: "100%",
    },
    options: categoriasxEjercicioAdd,
    placeholder: "Seleccione una Categoría",
    maxTagCount: "responsive",
  };

  // Generar opciones de patologías aleatorias
  const generateRandomPatologias = () => {
    const patologias = [];
    const patologiasCount = 20; // Número de patologías a generar

    for (let i = 1; i <= patologiasCount; i++) {
      patologias.push({
        label: `Patología ${i}`,
        value: i,
      });
    }

    setOptions(patologias);
  };
  useEffect(() => {
    generateRandomPatologias();
  }, []);

  const getejerciciosxpaciente = async (idUsuario) => {
    //const ejercicios = await getEjercicioxPaciente(idUsuario); AHORA SE LLAMA A TODOS, SIN IMPORTAR LA PATOLOGIA

    const ejercicios = await getAllEjercicios();

    console.log(ejercicios);
    let videosOfEjercicio = ejercicios.map((videos) => {
      if (videos.urlVideo) {
        return {
          ...videos,
          url: getMediaUrl(videos.urlVideo),
        };
      }
    });
    console.log(videosOfEjercicio);
    setVideos(videosOfEjercicio);
  };

  useEffect(() => {
    console.log(db);
    //vamos a traer las pagologias relacionadas con el usuario
    localStorage.getItem("idUsuario");
    console.log(localStorage.getItem("idUsuario"));
    /* if (localStorage.getItem("rol") == 3) {
      getejerciciosxpaciente(localStorage.getItem("idUsuario"));
    } else {
      if (db?.length > 0) {
        let videosOfEjercicio = db.map((videos) => {
          if (videos.urlVideo) {
            return {
              ...videos,
              url: getMediaUrl(videos.urlVideo),
            };
          }
        });
        console.log(videosOfEjercicio);
        setVideos(videosOfEjercicio);
      }
    } */

    if (db?.length > 0) {
      let videosOfEjercicio = db.map((videos) => {
        if (videos.urlVideo) {
          return {
            ...videos,
            url: getMediaUrl(videos.urlVideo),
          };
        }
      });
      console.log(videosOfEjercicio);
      setVideos(videosOfEjercicio);
    }
  }, [db]);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const videoItems = (videosSearch.length > 0 ? dbSearch : videos).filter(v => v && (v.tipoContenido === "video" || v.tipoContenido === "ambos" || !v.tipoContenido));
  const infografiaItems = (videosSearch.length > 0 ? dbSearch : videos).filter(v => v && (v.tipoContenido === "infografia" || v.tipoContenido === "ambos"));

  const renderInfografias = (items) => {
    if (!items || items.filter(Boolean).length === 0) {
      return <Empty description="No hay infografías disponibles" style={{ margin: "48px 0" }} />;
    }

    const getUrl = (inf) => getMediaUrl(inf.urlInfografia);

    return (
      <div className="cont_videos">
        {items.filter(Boolean).map((v, index) => {
          const isPdf = v.urlInfografia && v.urlInfografia.toLowerCase().endsWith(".pdf");
          return (
            <div key={v?.id || index} className="video-card">
              <div style={{ height: 180, overflow: "hidden", background: "var(--gray-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {isPdf ? (
                  <div style={{
                    height: "100%", width: "100%", background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 8,
                  }}>
                    <FilePdfOutlined style={{ fontSize: 48, color: "#d97706" }} />
                    <span style={{ fontSize: 12, color: "#92400e", fontWeight: 600 }}>Planes de Entrenamiento</span>
                  </div>
                ) : (
                  <img
                    src={v.urlInfografia ? getUrl(v) : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzY0NzQ4YiIgc3Ryb2tlLXdpZHRoPSIxLjUiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIaIiBoZWlnaHQ9IjE4IiByeD0iMiIgcnk9IjIiLz48Y2lyY2xlIGN4PSI4LjUiIGN5PSI4LjUiIHI9IjEuNSIvPjxwb2x5bGluZSBwb2ludHM9IjIxIDE1IDE2IDEwIDUgMjEiLz48L3N2Zz4="}
                    alt={v.nombre}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzY0NzQ4YiIgc3Ryb2tlLXdpZHRoPSIxLjUiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIHJ5PSIyIi8+PGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiLz48cG9seWxpbmUgcG9pbnRzPSIyMSAxNSAxNiAxMCA1IDIxIi8+PC9zdmc+';
                    }}
                  />
                )}
              </div>
              <div className="video-info" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <p className="video-title">{v.nombre}</p>
                {v.descripcion && (
                  <p className="video-desc">{v.descripcion}</p>
                )}
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Button
                    type="primary"
                    icon={<ExportOutlined />}
                    onClick={() => window.open(getUrl(v), "_blank")}
                    style={{ width: '100%', borderRadius: 'var(--radius-sm)' }}
                  >
                    Ver Infografía
                  </Button>
                  <Button
                    type="primary"
                    ghost
                    icon={<HeartOutlined />}
                    onClick={() => handleOpenAutoevaluacion('ejercicio', v)}
                    style={{ width: '100%', borderRadius: 'var(--radius-sm)' }}
                  >
                    Autoevaluar Ejercicio
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div>
      <nav className="nav_recetas">
        <div style={{
          width: 56, height: 56, borderRadius: "var(--radius-md)",
          background: "var(--primary-100)", display: "flex",
          alignItems: "center", justifyContent: "center",
          color: "var(--primary)", fontSize: 26, flexShrink: 0,
        }}>
          <ThunderboltOutlined />
        </div>
        <div className="cont_sel_recetas">
          <p className="titulo_see">Ejercicios Saludables</p>
          <div className="filters-row-premium">
            <Input
              prefix={<SearchOutlined style={{ color: "var(--gray-400)" }} />}
              placeholder="Buscar ejercicio..."
              value={videosSearch}
              onChange={(e) => {
                setVideosSearch(e.target.value);
                handleSearch(e.target.value, videos);
              }}
              allowClear
              size="large"
            />
            <Select
              className="select_recetas"
              name="idCategorias"
              {...sharedPropsCategorias}
              onChange={handleChangeSelectCategoriasFiltrar}
              size="large"
            />
            <Button
              type="primary"
              icon={<HeartOutlined />}
              onClick={() => handleOpenAutoevaluacion('general')}
              size="large"
              style={{ background: 'var(--primary)', borderColor: 'var(--primary)', color: 'white', borderRadius: 'var(--radius)' }}
            >
              Evaluación General
            </Button>
          </div>
        </div>
      </nav>
      <Alert
        message="¿Cómo usar esta sección?"
        description="Descubre rutinas de ejercicios adaptadas a diferentes necesidades. Filtra por categoría o busca ejercicios específicos. Puedes realizar autoevaluaciones generales o específicas para reportar tus progresos al profesional."
        type="info"
        icon={<InfoCircleOutlined />}
        showIcon
        closable
        style={{ margin: "16px 24px", borderRadius: "var(--radius-md)" }}
      />

      <div style={{ padding: "0 24px" }}>
        <Tabs activeKey={activeTab} onChange={handleTabChange} type="card" style={{ marginBottom: 16 }}>
          <Tabs.TabPane tab="Videos Instructivos" key="1">
            <div className="cont_recetas">
              <ListVideos videos={videoItems} onEvaluate={(v) => handleOpenAutoevaluacion('ejercicio', v)} />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Infografías de Planes" key="2">
            <div className="cont_recetas">
              {renderInfografias(infografiaItems)}
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>

      <Modal
        title={evalType === 'general' ? "Autoevaluación General de Deporte y Ejercicio" : `Autoevaluación de Ejercicio: ${selectedEjercicio?.nombre}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={650}
        destroyOnClose
        styles={{ header: { borderBottom: "1px solid var(--gray-200)", paddingBottom: 12 } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSendAutoevaluacion}
          initialValues={{
            BorgScale: 5,
            PainEVA: 0,
            PainPresent: 'No',
            ExecutionQuality: 'Totalmente correcta'
          }}
        >
          <Form.Item
            name="profesionalId"
            label="Seleccionar Profesional de la Salud Receptor"
            rules={[{ required: true, message: "Debe seleccionar un profesional" }]}
          >
            <Select placeholder="Seleccione el profesional de la salud...">
              {profesionales.map((p) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.nombre} {p.apellido} ({p.email})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {evalType === 'general' ? (
            <>
              <Form.Item
                name="FrecuenciaSemanal"
                label="¿Cuántos días a la semana realiza actividad física?"
                rules={[{ required: true }]}
              >
                <Radio.Group style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <Radio value="0 días">0 días</Radio>
                  <Radio value="1-2 días">1-2 días</Radio>
                  <Radio value="3-4 días">3-4 días</Radio>
                  <Radio value="5 o más días">5 o más días</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="DuracionPromedio"
                label="¿Cuánto tiempo duran sus sesiones de ejercicio en promedio?"
                rules={[{ required: true }]}
              >
                <Radio.Group style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <Radio value="Menos de 30 minutos">Menos de 30 min</Radio>
                  <Radio value="30 a 60 minutos">30 a 60 min</Radio>
                  <Radio value="Más de 60 minutos">Más de 60 min</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="TipoActividades"
                label="¿Qué tipo de actividades físicas realiza habitualmente? (Seleccione todas las que apliquen)"
              >
                <Checkbox.Group style={{ width: '100%' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
                    <Checkbox value="Aeróbico (Cardio)">Aeróbico (Cardio)</Checkbox>
                    <Checkbox value="Fuerza / Musculación">Fuerza / Musculación</Checkbox>
                    <Checkbox value="Flexibilidad / Estiramientos">Flexibilidad / Estiramientos</Checkbox>
                    <Checkbox value="Deportes de equipo">Deportes de equipo</Checkbox>
                  </div>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item
                name="AptitudFisica"
                label="Aptitud física percibida general"
              >
                <Rate tooltips={['Muy mala', 'Regular', 'Bueno', 'Muy bueno', 'Excelente']} style={{ fontSize: 24 }} />
              </Form.Item>

              <Form.Item
                name="BarrerasEjercicio"
                label="¿Qué dificultades encuentra para realizar ejercicio regularmente?"
              >
                <Checkbox.Group style={{ width: '100%' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
                    <Checkbox value="Falta de tiempo">Falta de tiempo</Checkbox>
                    <Checkbox value="Dolor o limitaciones físicas">Dolor o limitaciones físicas</Checkbox>
                    <Checkbox value="Fatiga / Cansancio">Fatiga / Cansancio</Checkbox>
                    <Checkbox value="Falta de motivación">Falta de motivación</Checkbox>
                  </div>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item
                name="ObjetivosSalud"
                label="¿Cuáles son sus principales objetivos de salud con el ejercicio?"
              >
                <Checkbox.Group style={{ width: '100%' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
                    <Checkbox value="Mejorar salud general">Mejorar salud general</Checkbox>
                    <Checkbox value="Controlar peso">Controlar peso</Checkbox>
                    <Checkbox value="Ganar fuerza / Masa muscular">Ganar fuerza / Masa muscular</Checkbox>
                    <Checkbox value="Controlar patologías crónicas">Controlar patologías crónicas</Checkbox>
                  </div>
                </Checkbox.Group>
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                name="BorgScale"
                label="Esfuerzo percibido general (Escala de Borg: 1 = Reposo absoluto, 10 = Esfuerzo máximo)"
              >
                <Slider min={1} max={10} marks={{ 1: 'Reposo', 5: 'Moderado', 10: 'Máximo' }} />
              </Form.Item>

              <Form.Item
                name="PainPresent"
                label="¿Experimentó algún tipo de dolor durante o después de la sesión?"
                rules={[{ required: true }]}
              >
                <Radio.Group style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }} onChange={(e) => {
                  form.setFieldsValue({ PainPresent: e.target.value });
                }}>
                  <Radio value="Sí">Sí</Radio>
                  <Radio value="No">No</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.PainPresent !== currentValues.PainPresent}
              >
                {({ getFieldValue }) =>
                  getFieldValue('PainPresent') === 'Sí' ? (
                    <Form.Item
                      name="PainEVA"
                      label="Intensidad del dolor (Escala EVA: 0 = Sin dolor, 10 = Dolor insoportable)"
                    >
                      <Slider min={0} max={10} marks={{ 0: '0', 5: '5', 10: '10' }} />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>

              <Form.Item
                name="AlarmSymptoms"
                label="¿Presentó alguno de los siguientes síntomas de alarma? (Marcar si aplica)"
              >
                <Checkbox.Group style={{ width: '100%' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
                    <Checkbox value="Dolor / Opresión de pecho">Dolor / Opresión de pecho</Checkbox>
                    <Checkbox value="Mareo / Inestabilidad severa">Mareo / Inestabilidad severa</Checkbox>
                    <Checkbox value="Dificultad extrema para respirar">Dificultad extrema para respirar</Checkbox>
                    <Checkbox value="Palpitaciones aceleradas">Palpitaciones aceleradas</Checkbox>
                  </div>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item
                name="ExecutionQuality"
                label="¿Cómo considera la ejecución de la técnica del ejercicio?"
                rules={[{ required: true }]}
              >
                <Radio.Group style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <Radio value="Totalmente correcta">Totalmente correcta</Radio>
                  <Radio value="Parcialmente correcta">Parcialmente correcta</Radio>
                  <Radio value="No pude realizar la técnica">No pude realizar la técnica</Radio>
                </Radio.Group>
              </Form.Item>
            </>
          )}

          <Form.Item
            name="Observaciones"
            label="Observaciones o comentarios adicionales"
          >
            <Input.TextArea placeholder="Escriba comentarios para el profesional de salud..." rows={3} maxLength={300} />
          </Form.Item>

          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 0 }}>
            <Button onClick={() => setIsModalVisible(false)} style={{ marginRight: 8 }}>
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              loading={submittingEval}
              style={{ background: 'var(--primary)', borderColor: 'var(--primary)' }}
            >
              Enviar Reporte
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
