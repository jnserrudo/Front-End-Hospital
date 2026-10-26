import { ImagenSegura } from "../Components/MediaNoDisponible";
import React, { useContext, useEffect, useState } from "react";
import { Select, Input, Empty, Pagination } from "antd";
import { PictureOutlined, SearchOutlined } from "@ant-design/icons";
import { VentEmergenteRecetaSee } from "../Components/VentEmergRecetaSee";
import RecetaContext from "../Contexts/RecetaContext";
import { getAllPatologias } from "../services/patologia-services";
import { getRecetaByPatologia } from "../services/recetas-services";
import { getMediaUrl } from "../services/config";
import { HospitalIcon } from "../Components/HospitalIcon";
import { PageHeader } from "../Components/PageHeader";
import { SectionHelp } from "../Components/SectionHelp";
import { AdminShortcut } from "../Components/AdminShortcut";
import "../style.css";

export const Recetas = ({ setSelectedKey }) => {
  const [showVentEmergRecetaSee, setShowVentEmergRecetaSee] = useState(false);
  const [recetaSee, setRecetaSee] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  
  // Verificar si el usuario es administrador o profesional

  const {
    db,
    dbSearch,
    handleSearch,
    handleChangeSelectRecetasFiltrar,
    handleChangeSelectCategoriasFiltrar,
    patologiasxRecetasAdd,
    categoriasxRecetasAdd,
  } = useContext(RecetaContext);

  const [recetasPatologias, setRecetasPatologias] = useState([]);
  const [recetaSearch, setRecetaSearch] = useState("");

  const sharedPropsCategorias = {
    mode: "multiple",
    style: { width: "100%" },
    options: categoriasxRecetasAdd,
    placeholder: "Filtrar por categoría",
    maxTagCount: "responsive",
  };

  useEffect(() => {
    const getPatologias = async () => {
      await getAllPatologias();
    };
    getPatologias();
  }, []);

  useEffect(() => {
    if (recetaSee?.nombre) {
      setShowVentEmergRecetaSee(true);
    }
  }, [recetaSee]);

  const handleChange = async (value) => {
    let recetas = [];
    if (value.length > 0) {
      for (let idPatologia of value) {
        let recetasByPatologia = await getRecetaByPatologia(idPatologia);
        for (let receta of recetasByPatologia) {
          if (!recetas.some((r) => r.id === receta.id)) {
            recetas.push(receta);
          }
        }
      }
      setRecetasPatologias(recetas);
    }
  };

  const listaRecetas = recetaSearch.length > 0
    ? dbSearch
    : recetasPatologias.length > 0
    ? recetasPatologias
    : db;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRecetas = listaRecetas.slice(startIndex, endIndex);

  return (
    <div className="page-wrapper">
        <PageHeader
          icon={<HospitalIcon name="recetas" size={32} alt="" />}
          title="Recetas saludables"
          subtitle="Ideas de comidas pensadas para tu salud, con ingredientes, preparación e información nutricional"
          actions={<AdminShortcut adminKey="7" setSelectedKey={setSelectedKey} />}
        />
        <div className="filter-bar">
          <Input
            prefix={<SearchOutlined style={{ color: "var(--gray-400)" }} />}
            placeholder="Buscar receta por nombre..."
            value={recetaSearch}
            onChange={(e) => {
              setRecetaSearch(e.target.value);
              handleSearch(e.target.value, recetasPatologias.length === 0 ? db : recetasPatologias);
              setCurrentPage(1);
            }}
            allowClear
          />
          <Select
            name="idCategorias"
            {...sharedPropsCategorias}
            style={{ flex: "1 1 200px", minWidth: 0 }}
            allowClear
            notFoundContent="Todavía no hay categorías cargadas"
            onChange={(v) => {
              handleChangeSelectCategoriasFiltrar(v);
              setCurrentPage(1);
            }}
          />
        </div>

      <SectionHelp>
        Acá encontrás recetas saludables recomendadas por el equipo del hospital. Buscá por nombre o filtrá por
        categoría, y tocá una receta para ver los ingredientes, la preparación y su información nutricional.
      </SectionHelp>

      <div className="recetas-grid">
        {listaRecetas.length === 0 ? (
          <div className="recetas-empty">
            <Empty description="No encontramos recetas para mostrar. Probá con otra búsqueda o quitá el filtro de categoría." />
          </div>
        ) : (
          paginatedRecetas.map((receta) => (
            <div
              key={receta.id}
              className="receta-card-minimal"
              onClick={() => setRecetaSee(receta)}
            >
              <div className="receta-card-image-minimal">
                {receta?.urlFoto ? (
                  <ImagenSegura
                    src={getMediaUrl(receta.urlFoto)}
                    alt=""
                    compacto
                    style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="receta-image-placeholder" style={{ display: 'flex' }}>
                    <PictureOutlined style={{ fontSize: 36, color: 'var(--gray-400)' }} />
                    <span>Sin imagen</span>
                  </div>
                )}
              </div>
              <div className="receta-card-content-minimal">
                <h3 className="receta-card-title-minimal">{receta.nombre}</h3>
                <div className="receta-card-info-minimal">
                  {/* Si el dato ya trae la unidad (p. ej. «1 porción», «100 cal») no la repetimos */}
                  <span>{/^\s*\d+([.,]\d+)?\s*$/.test(String(receta.porciones ?? "")) ? `${receta.porciones} porciones` : receta.porciones}</span>
                  <span>{/^\s*\d+([.,]\d+)?\s*$/.test(String(receta.calorias ?? "")) ? `${receta.calorias} kcal` : receta.calorias}</span>
                  <span>{receta.tiempo}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {listaRecetas.length > pageSize && (
        <div className="recetas-pagination">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={listaRecetas.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger
            onShowSizeChange={(current, size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            pageSizeOptions={[6, 12, 24, 48]}
          />
        </div>
      )}

      <VentEmergenteRecetaSee
        isOpen={showVentEmergRecetaSee}
        onClose={() => setShowVentEmergRecetaSee(false)}
        recetaSelected={recetaSee}
      />
    </div>
  );
};
