import { ImagenSegura } from "../Components/MediaNoDisponible";
import React, { useContext, useEffect, useState } from "react";
import { Select, Input, Button, Tabs, Empty } from "antd";
import { ListVideos } from "../Components/ListVideos";
import EjercicioContext from "../Contexts/EjercicioContext";
import { getMediaUrl } from "../services/config";
import { SearchOutlined, HeartOutlined, FilePdfOutlined, ExportOutlined } from "@ant-design/icons";
import { HospitalIcon } from "../Components/HospitalIcon";
import { PageHeader } from "../Components/PageHeader";
import { SectionHelp } from "../Components/SectionHelp";
import { AdminShortcut } from "../Components/AdminShortcut";
import { AutoevaluacionWizard } from "../Components/AutoevaluacionWizard";
import { MisAutoevaluaciones } from "../Components/MisAutoevaluaciones";
import { apiFetch } from "../services/http";
import { getRol, ROLES } from "../services/session";

export const Ejercicio = ({ setSelectedKey }) => {
  const [videos, setVideos] = useState([]);
  const [videosSearch, setVideosSearch] = useState("");
  const [activeTab, setActiveTab] = useState("1"); // "1" Videos, "2" Infografías, "3" Mis autoevaluaciones

  // Solo los pacientes envían autoevaluaciones (el equipo las lee en Administración › Autoevaluaciones).
  const esPaciente = getRol() === ROLES.PACIENTE;
  const [autoeval, setAutoeval] = useState(null); // { tipo, ejercicio }
  const [profesionales, setProfesionales] = useState([]);
  const [recargarHistorial, setRecargarHistorial] = useState(0);

  // Lista de profesionales (solo para el formulario del paciente)
  useEffect(() => {
    if (!esPaciente) return;
    apiFetch("/usuarios/profesionales/lista")
      .then((data) => Array.isArray(data) && setProfesionales(data))
      .catch((err) => {
        // Sin la lista igual puede enviarla al «Equipo de salud».
        if (err) err.notified = true;
        console.warn("[autoevaluación] No se pudo cargar la lista de profesionales:", err);
      });
  }, [esPaciente]);

  const handleOpenAutoevaluacion = (tipo, ejercicio = null) => setAutoeval({ tipo, ejercicio });

  const {
    db,
    dbSearch,
    handleSearch,
    categoriasxEjercicioAdd,
    handleChangeSelectCategoriasFiltrar,
  } = useContext(EjercicioContext);

  const sharedPropsCategorias = {
    mode: "multiple",
    style: {
      width: "100%",
    },
    options: categoriasxEjercicioAdd,
    placeholder: "Filtrar por categoría",
    maxTagCount: "responsive",
  };

  useEffect(() => {
    if (Array.isArray(db)) {
      setVideos(db.map((item) => ({ ...item, url: item.urlVideo ? getMediaUrl(item.urlVideo) : "" })));
    }
  }, [db]);

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
                  <ImagenSegura
                    src={v.urlInfografia ? getUrl(v) : ""}
                    alt={v.nombre}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                  {esPaciente && (
                    <Button
                      type="primary"
                      ghost
                      icon={<HeartOutlined />}
                      onClick={() => handleOpenAutoevaluacion('ejercicio', v)}
                      style={{ width: '100%', borderRadius: 'var(--radius-sm)' }}
                    >
                      Autoevaluar este ejercicio
                    </Button>
                  )}
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
    <div className="page-wrapper">
      <PageHeader
        icon={<HospitalIcon name="videosEjercicio" size={32} alt="" />}
        title="Ejercicios saludables"
        subtitle="Rutinas guiadas por el equipo de salud para moverte de forma segura"
        actions={<AdminShortcut adminKey="9" setSelectedKey={setSelectedKey} />}
      />

      <div className="filter-bar">
        <Input
          prefix={<SearchOutlined style={{ color: "var(--gray-400)" }} />}
          placeholder="Buscar ejercicio por nombre..."
          value={videosSearch}
          onChange={(e) => {
            setVideosSearch(e.target.value);
            handleSearch(e.target.value, videos);
          }}
          allowClear
        />
        <Select
          name="idCategorias"
          {...sharedPropsCategorias}
          style={{ flex: "1 1 200px", minWidth: 0 }}
          allowClear
          notFoundContent="Todavía no hay categorías cargadas"
          onChange={handleChangeSelectCategoriasFiltrar}
        />
        {esPaciente && (
          <Button type="primary" icon={<HeartOutlined />} onClick={() => handleOpenAutoevaluacion("general")}>
            Autoevaluación general
          </Button>
        )}
      </div>

      <SectionHelp>
        {esPaciente
          ? "Acá tenés las rutinas de ejercicio pensadas para tus patologías. Mirá el video instructivo antes de empezar y, cuando termines, contale a tu profesional cómo te fue con una autoevaluación (general o de un ejercicio puntual): así puede ajustar tu plan. En la pestaña «Mis autoevaluaciones» ves todo lo que enviaste y la devolución del equipo."
          : "Acá ves todos los ejercicios publicados, tal como los ven los pacientes. Las autoevaluaciones solo las envían los pacientes y el equipo las lee en Administración › Autoevaluaciones."}
      </SectionHelp>

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        type="card"
        className="tabs-contenido"
        style={{ marginBottom: 16 }}
        items={[
          {
            key: "1",
            label: <><span className="tab-largo">Videos instructivos</span><span className="tab-corto">Videos</span></>,
            children: (
              <div className="cont_recetas">
                <ListVideos videos={videoItems} onEvaluate={esPaciente ? (v) => handleOpenAutoevaluacion("ejercicio", v) : undefined} />
              </div>
            ),
          },
          {
            key: "2",
            label: <><span className="tab-largo">Infografías de planes</span><span className="tab-corto">Infografías</span></>,
            children: <div className="cont_recetas">{renderInfografias(infografiaItems)}</div>,
          },
          ...(esPaciente
            ? [
                {
                  key: "3",
                  label: "Mis autoevaluaciones",
                  children: (
                    <MisAutoevaluaciones
                      recargar={recargarHistorial}
                      onNueva={() => handleOpenAutoevaluacion("general")}
                    />
                  ),
                },
              ]
            : []),
        ]}
      />

      {esPaciente && (
        <AutoevaluacionWizard
          open={Boolean(autoeval)}
          tipo={autoeval?.tipo || "general"}
          ejercicio={autoeval?.ejercicio}
          profesionales={profesionales}
          onClose={() => setAutoeval(null)}
          onEnviada={() => setRecargarHistorial((n) => n + 1)}
        />
      )}
    </div>
  );
};
