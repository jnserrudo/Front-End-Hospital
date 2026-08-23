import React, { useEffect, useState } from "react";
import { entorno, getMediaUrl } from "../services/config";
import { Tag, Divider, Row, Col } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import { getCategoriaToRecetaEdit } from "../services/recetas-services";
import "../style.css";

export const RecetaSee = ({ receta }) => {
  const colors = ["gold", "lime", "green", "cyan", "blue", "red"];
  const [categorias, setCategorias] = useState([]);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
    const categoriasasociadas = async () => {
      let categorias = await getCategoriaToRecetaEdit(receta.id);
      const categoriasConColor = categorias.categoriasAsociadas.map(
        (cat, index) => ({
          ...cat,
          value: cat.id,
          label: cat.nombre,
          color: colors[index % colors.length],
        })
      );
      setCategorias(categoriasConColor);
    };
    categoriasasociadas();
  }, [receta]);

  return (
    <div className="receta-see-container-minimal">
      <div className="receta-see-tags-minimal">
        {categorias.length > 0 && (
          <div className="receta-see-tag-group">
            <span className="receta-see-tag-label">Categorías:</span>
            {categorias.map((cat) => (
              <Tag key={cat.value} color={cat.color}>{cat.label}</Tag>
            ))}
          </div>
        )}
        {receta.patologia?.length > 0 && (
          <div className="receta-see-tag-group">
            <span className="receta-see-tag-label">Patologías:</span>
            {receta.patologia.map((pat) => (
              <Tag key={pat.patologia.id} color="blue">{pat.patologia.nombre}</Tag>
            ))}
          </div>
        )}
      </div>

      <Row gutter={[16, 12]}>
        <Col xs={24} md={10}>
           <div className="receta-see-image-container-minimal">
             {!receta?.urlFoto || imageError ? (
               <div className="receta-see-image-placeholder">
                 <PictureOutlined style={{ fontSize: 36, color: 'var(--gray-400)' }} />
                 <span>Sin imagen</span>
               </div>
             ) : (
               <img
                 className="receta-see-image-minimal"
                 src={getMediaUrl(receta.urlFoto)}
                 alt={receta.nombre}
                 onError={() => setImageError(true)}
               />
             )}
           </div>
        </Col>

        <Col xs={24} md={14}>
          <h1 className="receta-see-title-minimal">{receta.nombre}</h1>
          
          <div className="receta-see-stats-minimal">
            <div className="receta-stat-item">
              <span className="receta-stat-value">{receta.porciones}</span>
              <span className="receta-stat-label">Porciones</span>
            </div>
            <div className="receta-stat-item">
              <span className="receta-stat-value">{receta.calorias}</span>
              <span className="receta-stat-label">Calorías</span>
            </div>
            <div className="receta-stat-item">
              <span className="receta-stat-value">{receta.tiempo}</span>
              <span className="receta-stat-label">Tiempo</span>
            </div>
          </div>

          <Divider />

          <div className="receta-see-section-minimal">
            <h3 className="receta-see-section-title-minimal">Ingredientes</h3>
            <ul className="receta-see-list-minimal">
              {receta.ingredientes?.split("\n")
                .filter(line => line.trim() !== "")
                .map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
            </ul>
          </div>
        </Col>
      </Row>

      <Divider />

      <div className="receta-see-section-minimal">
        <h3 className="receta-see-section-title-minimal">Preparación</h3>
        <ol className="receta-see-list-ordered-minimal">
          {receta.preparacion?.split("\n")
            .filter(line => line.trim() !== "")
            .map((line, index) => (
              <li key={index}>{line}</li>
            ))}
        </ol>
      </div>

      {(receta?.tipsSaludables || receta?.composicionNutricional) && (
        <>
          <Divider />
          <Row gutter={[24, 24]}>
            {receta?.tipsSaludables && receta.tipsSaludables.length > 0 && (
              <Col xs={24} md={12}>
                <div className="receta-see-card-minimal">
                  <h3 className="receta-see-section-title-minimal">Tips Saludables</h3>
                  <ul className="receta-see-list-minimal">
                    {receta.tipsSaludables.split("\n")
                      .filter(line => line.trim() !== "")
                      .map((line, index) => (
                        <li key={index}>{line}</li>
                      ))}
                  </ul>
                </div>
              </Col>
            )}
            {receta?.composicionNutricional && receta.composicionNutricional.length > 0 && (
              <Col xs={24} md={12}>
                <div className="receta-see-card-minimal">
                  <h3 className="receta-see-section-title-minimal">Composición Nutricional</h3>
                  <ul className="receta-see-list-minimal">
                    {receta.composicionNutricional.split("\n")
                      .filter(line => line.trim() !== "")
                      .map((line, index) => (
                        <li key={index}>{line}</li>
                      ))}
                  </ul>
                </div>
              </Col>
            )}
          </Row>
        </>
      )}
    </div>
  );
};
