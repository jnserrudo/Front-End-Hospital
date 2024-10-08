import React, { useState } from "react";
import {
  Input,
  Select,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Divider,
} from "antd";
import { SwapOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;

export const ConversionUnidades = () => {
  const [valor, setValor] = useState();
  const [unidadOrigen, setUnidadOrigen] = useState("g");
  const [unidadDestino, setUnidadDestino] = useState("mg");
  const [resultado, setResultado] = useState(null);

  const conversiones = {
    g: { mg: 1000, kg: 0.001, lb: 0.00220462, g: 1 },
    mg: { g: 0.001, kg: 0.000001, lb: 0.00000220462, mg: 1 },
    kg: { g: 1000, mg: 1000000, lb: 2.20462, kg: 1 },
    lb: { g: 453.592, mg: 453592, kg: 0.453592, lb: 1 },
  };

  const formatearNumero = (numero) => {
    // Formatea el número con separadores de miles y hasta 4 decimales, sin ceros innecesarios
    return new Intl.NumberFormat("es-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    }).format(numero);
  };

  const realizarConversion = () => {
    const factorConversion = conversiones[unidadOrigen][unidadDestino];
    const resultadoConversion = valor * factorConversion;
    setResultado(resultadoConversion);
  };

  return (
    <Card style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <Title level={3}>Conversión de Unidades de Medida</Title>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={8}>
          <Input
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Ingrese el valor"
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={24} sm={7}>
          <Select
            value={unidadOrigen}
            onChange={setUnidadOrigen}
            style={{ width: "100%" }}
          >
            <Option value="g">Gramos (g)</Option>
            <Option value="mg">Miligramos (mg)</Option>
            <Option value="kg">Kilogramos (kg)</Option>
            <Option value="lb">Libras (lb)</Option>
          </Select>
        </Col>
        <Col xs={24} sm={2} style={{ textAlign: "center" }}>
          <SwapOutlined style={{ fontSize: 24 }} />
        </Col>
        <Col xs={24} sm={7}>
          <Select
            value={unidadDestino}
            onChange={setUnidadDestino}
            style={{ width: "100%" }}
          >
            <Option value="g">Gramos (g)</Option>
            <Option value="mg">Miligramos (mg)</Option>
            <Option value="kg">Kilogramos (kg)</Option>
            <Option value="lb">Libras (lb)</Option>
          </Select>
        </Col>
      </Row>

      <Divider />

      <Row
        gutter={[16, 16]}
        align={"middle"}
        justify="center"
        style={{ marginTop: 20 }}
      >
        <Col>
          <Button type="primary" onClick={realizarConversion}>
            Convertir
          </Button>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => {
              setValor("");
              setResultado(null);
            }}
          >
            Resetear
          </Button>
        </Col>
      </Row>

      {resultado !== null && (
        <Card
          style={{
            marginTop: 30,
            background: "#f0f2f5",
            textAlign: "center",
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 20 }}>
            <b>{formatearNumero(valor)}</b> {unidadOrigen.toUpperCase()} es
            equivalente a:
          </Text>
          <Title level={2} style={{ marginTop: 10 }}>
            {formatearNumero(resultado)} {unidadDestino.toUpperCase()}
          </Title>
        </Card>
      )}
    </Card>
  );
};
