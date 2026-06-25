import React, { useContext, useEffect, useState } from "react";
import { Select, Input, Empty, Pagination, Alert, Button } from "antd";
import { PictureOutlined, InfoCircleOutlined, SettingOutlined } from "@ant-design/icons";
import { VentEmergenteRecetaSee } from "../Components/VentEmergRecetaSee";
import RecetaContext from "../Contexts/RecetaContext";
import { getAllPatologias } from "../services/patologia-services";
import { getRecetaByPatologia } from "../services/recetas-services";
import { entorno, getMediaUrl } from "../services/config";
import "../style.css";

export const Recetas = ({ setSelectedKey }) => {
  const [showVentEmergRecetaSee, setShowVentEmergRecetaSee] = useState(false);
  const [recetaSee, setRecetaSee] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  
  // Verificar si el usuario es administrador o profesional
  const rol = localStorage.getItem("rol");
  const isAdmin = rol === "1" || rol === "2" || rol === 1 || rol === 2 || parseInt(rol) === 1 || parseInt(rol) === 2;

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
    <div className="recetas-page">
      <div className="recetas-header">
        <h1 className="recetas-title">Recetas Saludables</h1>
        <div className="recetas-filters">
          <Input
            placeholder="Buscar receta..."
            value={recetaSearch}
            onChange={(e) => {
              setRecetaSearch(e.target.value);
              handleSearch(e.target.value, recetasPatologias.length === 0 ? db : recetasPatologias);
              setCurrentPage(1);
            }}
            allowClear
            className="recetas-search"
            size="large"
          />
          <Select
            className="recetas-filter"
            name="idCategorias"
            {...sharedPropsCategorias}
            onChange={handleChangeSelectCategoriasFiltrar}
            size="large"
          />
          {isAdmin && setSelectedKey && (
            <Button
              type="primary"
              icon={<SettingOutlined />}
              onClick={() => setSelectedKey("7")}
              className="admin-action-btn"
              size="large"
            >
              <span className="btn-text">Administrar</span>
            </Button>
          )}
        </div>
      </div>

      <Alert
        message="¿Cómo usar esta sección?"
        description="Explora recetas saludables filtrando por categoría o buscando por nombre. Haz clic en cualquier receta para ver ingredientes, preparación e información nutricional completa."
        type="info"
        icon={<InfoCircleOutlined />}
        showIcon
        closable
        style={{ marginBottom: 24, borderRadius: "var(--radius-md)" }}
      />

      <div className="recetas-grid">
        {listaRecetas.length === 0 ? (
          <div className="recetas-empty">
            <Empty description="No se encontraron recetas" />
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
                  <img
                    src={getMediaUrl(receta.urlFoto)}
                    alt=""
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                    style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : null}
                <div 
                  className="receta-image-placeholder"
                  style={{ display: receta?.urlFoto ? 'none' : 'flex' }}
                >
                  <PictureOutlined style={{ fontSize: 36, color: 'var(--gray-400)' }} />
                  <span>Sin imagen</span>
                </div>
              </div>
              <div className="receta-card-content-minimal">
                <h3 className="receta-card-title-minimal">{receta.nombre}</h3>
                <div className="receta-card-info-minimal">
                  <span>{receta.porciones} porciones</span>
                  <span>{receta.calorias} kcal</span>
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
