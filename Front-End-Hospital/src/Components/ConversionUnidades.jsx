import React, { useState, useMemo } from "react";
import {
  Input,
  Select,
  Button,
  Row,
  Col,
  Divider,
  Segmented,
  Alert,
} from "antd";
import {
  SwapOutlined,
  InfoCircleOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { HospitalIcon } from "./HospitalIcon";

const { Option } = Select;

export const ConversionUnidades = () => {
  const [categoria, setCategoria] = useState("masa");
  const [valor, setValor] = useState("");
  const [unidadOrigen, setUnidadOrigen] = useState("g");
  const [unidadDestino, setUnidadDestino] = useState("mg");

  const conversiones = {
    masa: {
      g: { mg: 1000, kg: 0.001, lb: 0.00220462, g: 1 },
      mg: { g: 0.001, kg: 0.000001, lb: 0.00000220462, mg: 1 },
      kg: { g: 1000, mg: 1000000, lb: 2.20462, kg: 1 },
      lb: { g: 453.592, mg: 453592, kg: 0.453592, lb: 1 },
    },
    volumen: {
      ml: { L: 0.001, cdta: 0.2, cda: 0.0666667, tza: 0.004, ml: 1 },
      L: { ml: 1000, cdta: 200, cda: 66.6667, tza: 4, L: 1 },
      cdta: { ml: 5, L: 0.005, cda: 0.333333, tza: 0.02, cdta: 1 },
      cda: { ml: 15, L: 0.015, cdta: 3, tza: 0.06, cda: 1 },
      tza: { ml: 250, L: 0.25, cdta: 50, cda: 16.6667, tza: 1 },
    },
  };

  const nombresUnidades = {
    masa: {
      g: "Gramos (g)",
      mg: "Miligramos (mg)",
      kg: "Kilogramos (kg)",
      lb: "Libras (lb)",
    },
    volumen: {
      ml: "Mililitros (ml)",
      L: "Litros (L)",
      cdta: "Cucharadita (cdta)",
      cda: "Cucharada (cda)",
      tza: "Taza (tza)",
    },
  };

  const medidasDomesticas = [
    { medida: "1 Vaso de agua", equiv: "200 ml" },
    { medida: "1 Taza de té", equiv: "150 ml" },
    { medida: "1 Pocillo de café", equiv: "60 ml" },
    { medida: "1 Vaso de vidrio común", equiv: "250 ml" },
    { medida: "1 Cucharada sopera (rasa)", equiv: "15 ml / 15 g" },
    { medida: "1 Cucharadita de té (rasa)", equiv: "5 ml / 5 g" },
    { medida: "1 Cucharada sopera colmada", equiv: "25 - 30 g" },
    { medida: "1 Puñado (frutos secos)", equiv: "30 - 40 g" },
  ];

  const handleCategoriaChange = (newCat) => {
    setCategoria(newCat);
    if (newCat === "masa") {
      setUnidadOrigen("g");
      setUnidadDestino("mg");
    } else {
      setUnidadOrigen("ml");
      setUnidadDestino("L");
    }
  };

  const swapUnidades = () => {
    const temp = unidadOrigen;
    setUnidadOrigen(unidadDestino);
    setUnidadDestino(temp);
  };

  const formatearNumero = (numero) => {
    if (numero === null || numero === undefined || isNaN(numero) || numero === "") return "";
    return new Intl.NumberFormat("es-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    }).format(numero);
  };

  const resultado = useMemo(() => {
    if (valor === "" || valor === null || valor === undefined || isNaN(valor)) {
      return null;
    }
    const factor = conversiones[categoria][unidadOrigen][unidadDestino];
    return valor * factor;
  }, [valor, unidadOrigen, unidadDestino, categoria]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", width: "100%", boxSizing: "border-box" }}>
      <nav className="nav_recetas">
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "var(--radius-md)",
            background: "var(--primary-100)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <HospitalIcon name="conversor" size={36} alt="Conversor" />
        </div>
        <div className="cont_sel_recetas">
          <div className="page-header-main">
            <div className="page-header-text">
              <p className="titulo_see">Conversor de Unidades</p>
            </div>
          </div>
        </div>
      </nav>

      <Alert
        message="¿Cómo usar esta sección?"
        description="Convierte unidades de medida para cocina y nutrición. Selecciona la categoría (masa o volumen), ingresa el valor y elige las unidades de origen y destino. El resultado se calcula automáticamente."
        type="info"
        icon={<InfoCircleOutlined />}
        showIcon
        closable
        style={{ margin: "24px 0", borderRadius: "var(--radius-md)" }}
      />

      <Row gutter={[24, 24]} style={{ marginTop: 24, marginBottom: 48 }}>
        {/* Columna Izquierda: Calculadora */}
        <Col xs={24} lg={12}>
          <div className="converter-card">
            <div className="segmented-control-container">
              <Segmented
                size="large"
                options={[
                  { label: "Masa / Peso", value: "masa" },
                  { label: "Volumen / Líquidos", value: "volumen" },
                ]}
                value={categoria}
                onChange={handleCategoriaChange}
                block
              />
            </div>

            <div className="converter-input-wrapper">
              <span className="converter-input-label">Valor a Convertir</span>
              <Input
                type="number"
                size="large"
                className="converter-input"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Ingrese el valor (ej. 100)"
              />
            </div>

            <div className="unit-selectors-row">
              <div className="unit-selector">
                <span className="converter-input-label">De</span>
                <Select
                  size="large"
                  value={unidadOrigen}
                  onChange={setUnidadOrigen}
                  style={{ width: "100%" }}
                >
                  {Object.entries(nombresUnidades[categoria]).map(([key, name]) => (
                    <Option key={key} value={key}>
                      {name}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className="swap-button-container" style={{ marginTop: 24 }}>
                <button
                  className="swap-btn-circular"
                  onClick={swapUnidades}
                  title="Intercambiar unidades"
                >
                  <SwapOutlined />
                </button>
              </div>

              <div className="unit-selector">
                <span className="converter-input-label">A</span>
                <Select
                  size="large"
                  value={unidadDestino}
                  onChange={setUnidadDestino}
                  style={{ width: "100%" }}
                >
                  {Object.entries(nombresUnidades[categoria]).map(([key, name]) => (
                    <Option key={key} value={key}>
                      {name}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            <Row justify="end" gutter={12}>
              <Col>
                <Button
                  size="large"
                  style={{ borderRadius: "var(--radius-md)" }}
                  onClick={() => {
                    setValor("");
                  }}
                >
                  Resetear
                </Button>
              </Col>
            </Row>

            {resultado !== null && valor !== "" && (
              <div className="result-card-premium">
                <div className="result-text-label">Resultado obtenido</div>
                <div className="result-value-main">
                  {formatearNumero(valor)} {unidadOrigen} = {formatearNumero(resultado)} {unidadDestino}
                </div>
                <div className="result-equation">
                  Fórmula: Multiplicar por {formatearNumero(conversiones[categoria][unidadOrigen][unidadDestino])}
                </div>
              </div>
            )}
          </div>
        </Col>

        {/* Columna Derecha: Guías y Equivalencias */}
        <Col xs={24} lg={12}>
          <div className="reference-card-premium">
            <div className="reference-card-title">
              <InfoCircleOutlined style={{ color: "var(--primary)" }} />
              Equivalencias Rápidas (1 {unidadOrigen.toUpperCase()})
            </div>

            <div className="equivalence-grid">
              {Object.entries(conversiones[categoria][unidadOrigen])
                .filter(([unit]) => unit !== unidadOrigen)
                .map(([unit, factor]) => (
                  <div className="equivalence-item" key={unit}>
                    <span className="equivalence-item-val">
                      {formatearNumero(factor)} {unit.toUpperCase()}
                    </span>
                    <span className="equivalence-item-label">
                      {nombresUnidades[categoria][unit]}
                    </span>
                  </div>
                ))}
            </div>

            <Divider style={{ margin: "24px 0" }} />

            <div className="reference-card-title">
              <TableOutlined style={{ color: "var(--primary)" }} />
              Medidas Domésticas Comunes (Nutrición)
            </div>

            <div className="list-summary-bar domestic-measures-summary">
              <span>{medidasDomesticas.length} medidas</span>
            </div>

            <div className="domestic-measures-cards">
              {medidasDomesticas.map((item, index) => (
                <div className="domestic-measure-card domestic-measure-card--compact" key={index}>
                  <div className="domestic-measure-card-medida">{item.medida}</div>
                  <div className="domestic-measure-card-equiv">
                    <strong>{item.equiv}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="domestic-table-wrap">
              <table className="domestic-table">
                <thead>
                  <tr>
                    <th>Medida Casera</th>
                    <th>Equivalencia Sugerida</th>
                  </tr>
                </thead>
                <tbody>
                  {medidasDomesticas.map((item, index) => (
                    <tr key={index}>
                      <td>{item.medida}</td>
                      <td>
                        <strong>{item.equiv}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
