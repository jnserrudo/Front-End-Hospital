import React, { useContext, useEffect, useState } from "react";
import { Select, Input, Alert, Tabs, Button, Empty } from "antd";
import { ListVideos } from "../Components/ListVideos";
import InformacionContext from "../Contexts/InformacionContext";
import { entorno, getMediaUrl } from "../services/config";
import { SearchOutlined, ReadOutlined, InfoCircleOutlined, FilePdfOutlined, ExportOutlined, SettingOutlined } from "@ant-design/icons";
import { getAllInformacions } from "../services/informacion-services";
export const Info = ({ setSelectedKey }) => {
  //esta vble videos sera reemplazada por un listado de videos que ser iran cargando con sus URLs en la BD
  const [videos, setVideos] = useState([]);

  const [options, setOptions] = useState([]);
  const [videosSearch, setVideosSearch] = useState("");
  const [activeTab, setActiveTab] = useState("1");
  
  // Verificar si el usuario es administrador o profesional
  const rol = localStorage.getItem("rol");
  const isAdmin = rol === "1" || rol === "2" || rol === 1 || rol === 2 || parseInt(rol) === 1 || parseInt(rol) === 2;
  const {
    db,
    dbSearch,
    handleSearch,
    patologiasxInformacionAdd,
    categoriasxInformacionAdd,
    handleChangeSelectInformacionFiltrar,
    handleChangeSelectCategoriasFiltrar,
  } = useContext(InformacionContext);
  console.log(db);

  const sharedProps = {
    mode: "multiple",
    style: {
      width: "100%",
    },
    options: patologiasxInformacionAdd,
    placeholder: "Seleccione una Patología",
    maxTagCount: "responsive",
  };

  const sharedPropsCategorias = {
    mode: "multiple",
    style: {
      width: "100%",
    },
    options: categoriasxInformacionAdd,
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

  const getinformacionxpaciente = async (idUsuario) => {
    //const infos = await getInformacionxPaciente(idUsuario); AHORA SE LLAMA A TODOS, SIN IMPORTAR LA PATOLOGIA
    const infos = await getAllInformacions();

    let videosOfInfo = infos.map((item) => {
      return {
        ...item,
        url: item.urlVideo ? getMediaUrl(item.urlVideo) : "",
      };
    });
    console.log(videosOfInfo);
    setVideos(videosOfInfo);
  };

  useEffect(() => {
    console.log(db);
    //vamos a traer las patologias relacionadas con el usuario
    localStorage.getItem("idUsuario");
    console.log(localStorage.getItem("idUsuario"));
    /* if (localStorage.getItem("rol") == 3) {
      getinformacionxpaciente(localStorage.getItem("idUsuario"));
    } else {
      if (db?.length > 0) {
        let videosOfInfo = db.map((videos) => {
          if (videos.urlVideo) {
            return {
              ...videos,
              url: getMediaUrl(videos.urlVideo),
            };
          }
        });
        console.log(videosOfInfo);
        setVideos(videosOfInfo);
      }
    } */

    if (db?.length > 0) {
      let videosOfInfo = db.map((item) => {
        return {
          ...item,
          url: item.urlVideo ? getMediaUrl(item.urlVideo) : "",
        };
      });
      console.log(videosOfInfo);
      setVideos(videosOfInfo);
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
                    <span style={{ fontSize: 12, color: "#92400e", fontWeight: 600 }}>Guía de Patología (PDF)</span>
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
                <div style={{ marginTop: 'auto' }}>
                  <Button
                    type="primary"
                    icon={<ExportOutlined />}
                    onClick={() => window.open(getUrl(v), "_blank")}
                    style={{ width: '100%', borderRadius: 'var(--radius-sm)' }}
                  >
                    Ver Infografía
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
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
          <ReadOutlined />
        </div>
        <div className="cont_sel_recetas">
          <p className="titulo_see">Información Saludable</p>
          <div className="filters-row-premium">
            <Input
              prefix={<SearchOutlined style={{ color: "var(--gray-400)" }} />}
              placeholder="Buscar información..."
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
            {isAdmin && setSelectedKey && (
              <Button
                type="primary"
                icon={<SettingOutlined />}
                onClick={() => setSelectedKey("9")}
                className="admin-action-btn"
                size="large"
              >
                <span className="btn-text">Administrar</span>
              </Button>
            )}
          </div>
        </div>
      </nav>
      <Alert
        message="¿Cómo usar esta sección?"
        description="Encuentra videos educativos, podcasts e infografías de interés sobre salud y patologías. Usa los filtros de categoría y busca palabras clave."
        type="info"
        icon={<InfoCircleOutlined />}
        showIcon
        closable
        style={{ margin: "16px 24px", borderRadius: "var(--radius-md)" }}
      />

      <div style={{ padding: "0 24px" }}>
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)} type="card" style={{ marginBottom: 16 }}>
          <Tabs.TabPane tab="Videos y Podcasts" key="1">
            <div className="cont_recetas">
              <ListVideos videos={videoItems} />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Infografías y Guías" key="2">
            <div className="cont_recetas">
              {renderInfografias(infografiaItems)}
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};
