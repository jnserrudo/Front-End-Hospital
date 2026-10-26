import { ImagenSegura } from "../Components/MediaNoDisponible";
import React, { useContext, useEffect, useState } from "react";
import { Select, Input, Tabs, Button, Empty } from "antd";
import { ListVideos } from "../Components/ListVideos";
import InformacionContext from "../Contexts/InformacionContext";
import { getMediaUrl } from "../services/config";
import { SearchOutlined, FilePdfOutlined, ExportOutlined } from "@ant-design/icons";
import { getAllInformacions } from "../services/informacion-services";
import { HospitalIcon } from "../Components/HospitalIcon";
import { PageHeader } from "../Components/PageHeader";
import { SectionHelp } from "../Components/SectionHelp";
import { AdminShortcut } from "../Components/AdminShortcut";
export const Info = ({ setSelectedKey }) => {
  //esta vble videos sera reemplazada por un listado de videos que ser iran cargando con sus URLs en la BD
  const [videos, setVideos] = useState([]);

  const [options, setOptions] = useState([]);
  const [videosSearch, setVideosSearch] = useState("");
  const [activeTab, setActiveTab] = useState("1");
  
  const {
    db,
    dbSearch,
    handleSearch,
    patologiasxInformacionAdd,
    categoriasxInformacionAdd,
    handleChangeSelectInformacionFiltrar,
    handleChangeSelectCategoriasFiltrar,
  } = useContext(InformacionContext);

  const sharedProps = {
    mode: "multiple",
    style: {
      width: "100%",
    },
    options: patologiasxInformacionAdd,
    placeholder: "Elegí una patología",
    maxTagCount: "responsive",
  };

  const sharedPropsCategorias = {
    mode: "multiple",
    style: {
      width: "100%",
    },
    options: categoriasxInformacionAdd,
    placeholder: "Filtrar por categoría",
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
    <div className="page-wrapper">
      <PageHeader
        icon={<HospitalIcon name="consultaMedica" size={32} alt="" />}
        title="Información saludable"
        subtitle="Videos, podcasts y guías del equipo de salud para entender mejor tu tratamiento"
        actions={<AdminShortcut adminKey="8" setSelectedKey={setSelectedKey} />}
      />

      <div className="filter-bar">
        <Input
          prefix={<SearchOutlined style={{ color: "var(--gray-400)" }} />}
          placeholder="Buscar por título o tema..."
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
      </div>

      <SectionHelp>
        Acá vas a encontrar material educativo preparado por el equipo del hospital para que conozcas mejor tu
        patología y cómo cuidarte. En «Videos y podcasts» podés reproducirlos acá mismo; en «Infografías y guías»
        podés abrir o descargar los documentos. Buscá por palabra clave o filtrá por categoría.
      </SectionHelp>

      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        type="card"
        className="tabs-contenido"
        style={{ marginBottom: 16 }}
        items={[
          {
            key: "1",
            label: <><span className="tab-largo">Videos y podcasts</span><span className="tab-corto">Videos</span></>,
            children: (
              <div className="cont_recetas">
                <ListVideos videos={videoItems} />
              </div>
            ),
          },
          {
            key: "2",
            label: <><span className="tab-largo">Infografías y guías</span><span className="tab-corto">Infografías</span></>,
            children: <div className="cont_recetas">{renderInfografias(infografiaItems)}</div>,
          },
        ]}
      />
    </div>
  );
};
