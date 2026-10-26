import React, { useState, useEffect, useMemo } from "react";
import { FAQ_CATEGORIAS, faqCategoriaLabel } from "../utils/faqCategorias";
import { Collapse, Input, Spin, Tag, Empty, Button, Result } from "antd";
import {
  SearchOutlined,
  AppstoreOutlined,
  QuestionCircleOutlined,
  CoffeeOutlined,
  FireOutlined,
  MedicineBoxOutlined,
  MessageOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { getAllFAQs } from "../services/faq-services";
import { isStaff } from "../services/session";
import { HospitalIcon } from "../Components/HospitalIcon";
import { PageHeader } from "../Components/PageHeader";
import { SectionHelp } from "../Components/SectionHelp";
import { AdminShortcut } from "../Components/AdminShortcut";

// Estilo por categoría (ícono + color); las categorías desconocidas usan el estilo general.
const CAT_ESTILO = {
  general: { icon: <QuestionCircleOutlined />, color: "blue" },
  nutricion: { icon: <CoffeeOutlined />, color: "green" },
  ejercicio: { icon: <FireOutlined />, color: "orange" },
  patologias: { icon: <MedicineBoxOutlined />, color: "red" },
};
const estiloDe = (cat) => CAT_ESTILO[String(cat || "").toLowerCase()] || CAT_ESTILO.general;

// Para buscar sin importar mayúsculas ni tildes.
const normalizar = (t) =>
  String(t || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const escaparRegex = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Resalta el término buscado (coincidencia exacta, sin distinguir mayúsculas).
const Resaltar = ({ texto, termino }) => {
  if (!termino || termino.length < 2) return texto;
  const partes = String(texto).split(new RegExp(`(${escaparRegex(termino)})`, "gi"));
  return partes.map((p, i) =>
    p.toLowerCase() === termino.toLowerCase() ? <mark key={i} className="faq-mark">{p}</mark> : p
  );
};

export const FAQ = ({ setSelectedKey }) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [categoria, setCategoria] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const [abierta, setAbierta] = useState(null);
  const staff = isStaff();

  const cargarFAQs = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getAllFAQs();
      if (!Array.isArray(data)) throw new Error("Respuesta inesperada");
      setFaqs([...data].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0) || a.id - b.id));
    } catch (e) {
      console.error("Error al cargar preguntas frecuentes:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarFAQs();
  }, []);

  // Chips: categorías conocidas + cualquier otra que venga de la base, con su cantidad.
  const chips = useMemo(() => {
    const cuenta = {};
    faqs.forEach((f) => {
      const c = String(f.categoria || "general").toLowerCase();
      cuenta[c] = (cuenta[c] || 0) + 1;
    });
    const conocidas = FAQ_CATEGORIAS.map((c) => c.value);
    const extra = Object.keys(cuenta).filter((c) => !conocidas.includes(c));
    return [
      { value: "todas", label: "Todas", icon: <AppstoreOutlined />, n: faqs.length },
      ...[...conocidas, ...extra].map((c) => ({
        value: c,
        label: faqCategoriaLabel(c),
        icon: estiloDe(c).icon,
        n: cuenta[c] || 0,
      })),
    ];
  }, [faqs]);

  const termino = busqueda.trim();
  const filtradas = useMemo(() => {
    const t = normalizar(termino);
    return faqs.filter((f) => {
      if (categoria !== "todas" && String(f.categoria || "general").toLowerCase() !== categoria) return false;
      if (!t) return true;
      return normalizar(f.pregunta).includes(t) || normalizar(f.respuesta).includes(t);
    });
  }, [faqs, categoria, termino]);

  const limpiar = () => {
    setBusqueda("");
    setCategoria("todas");
  };

  const irAFeedback = () => {
    // Le pasamos la búsqueda al formulario para que no tengan que escribirla de nuevo.
    if (termino) {
      try {
        sessionStorage.setItem(
          "feedbackBorrador",
          JSON.stringify({ tipo: "consulta", mensaje: `Tengo una duda que no encontré en Preguntas frecuentes: ${termino}` })
        );
      } catch {
        /* sin sessionStorage: seguimos igual */
      }
    }
    setSelectedKey?.("18");
  };

  const items = filtradas.map((faq) => {
    const est = estiloDe(faq.categoria);
    return {
      key: String(faq.id),
      className: "faq-item",
      label: (
        <div className="faq-item-head">
          <span className={`faq-item-icon faq-item-icon--${est.color}`}>{est.icon}</span>
          <span className="faq-item-question">
            <Resaltar texto={faq.pregunta} termino={termino} />
          </span>
          {faq.categoria && (
            <Tag color={est.color} className="faq-item-tag">
              {faqCategoriaLabel(faq.categoria)}
            </Tag>
          )}
        </div>
      ),
      children: (
        <p className="faq-item-answer">
          <Resaltar texto={faq.respuesta} termino={termino} />
        </p>
      ),
    };
  });

  return (
    <div className="page-wrapper">
      <PageHeader
        icon={<HospitalIcon name="informacion" size={32} alt="" />}
        title="Preguntas frecuentes"
        subtitle="Respuestas del equipo de salud a las dudas más comunes"
        actions={<AdminShortcut adminKey="20" setSelectedKey={setSelectedKey} />}
      />

      <SectionHelp>
        Reunimos las preguntas que más nos hacen los pacientes, con la respuesta del equipo del hospital. Escribí una
        palabra en el buscador (por ejemplo «azúcar» o «caminar») o elegí una categoría, y tocá la pregunta para ver la
        respuesta. Si no encontrás lo que buscás, escribinos desde «Feedback».
      </SectionHelp>

      <div className="faq-search">
        <Input
          size="large"
          prefix={<SearchOutlined style={{ color: "var(--gray-400)" }} />}
          placeholder="¿Qué querés saber? Buscá en preguntas y respuestas…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          allowClear
          aria-label="Buscar en preguntas frecuentes"
        />
        <div className="faq-chips" role="group" aria-label="Filtrar por categoría">
          {chips.map((c) => (
            <button
              key={c.value}
              type="button"
              className={`faq-chip ${categoria === c.value ? "faq-chip--active" : ""}`}
              aria-pressed={categoria === c.value}
              onClick={() => setCategoria(c.value)}
            >
              {c.icon}
              <span>{c.label}</span>
              <span className="faq-chip-count">{c.n}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <Spin size="large" />
          <p style={{ marginTop: 16, color: "var(--gray-500)" }}>Cargando preguntas...</p>
        </div>
      ) : error ? (
        <Result
          status="warning"
          title="No pudimos cargar las preguntas"
          subTitle="Revisá tu conexión e intentá de nuevo en unos segundos."
          extra={<Button type="primary" onClick={cargarFAQs}>Reintentar</Button>}
        />
      ) : faqs.length === 0 ? (
        <Empty
          className="faq-empty"
          description="Todavía no hay preguntas frecuentes cargadas."
        >
          {staff && setSelectedKey && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setSelectedKey("20")}>
              Cargar la primera pregunta
            </Button>
          )}
        </Empty>
      ) : filtradas.length === 0 ? (
        <Empty
          className="faq-empty"
          description={
            termino
              ? `No encontramos preguntas que hablen de «${termino}»${categoria !== "todas" ? " en esta categoría" : ""}.`
              : "No hay preguntas en esta categoría todavía."
          }
        >
          <Button onClick={limpiar}>Ver todas las preguntas</Button>
        </Empty>
      ) : (
        <>
          <p className="faq-count">
            {filtradas.length} pregunta{filtradas.length !== 1 ? "s" : ""}
            {categoria !== "todas" ? ` en ${faqCategoriaLabel(categoria)}` : ""}
            {termino ? ` con «${termino}»` : ""}
          </p>
          <Collapse
            accordion
            className="faq-accordion"
            expandIconPosition="end"
            activeKey={abierta}
            onChange={(k) => setAbierta(Array.isArray(k) ? k[0] : k)}
            items={items}
            bordered={false}
          />
        </>
      )}

      {!loading && !error && (
        <div className="faq-cta">
          <div className="faq-cta-icon"><MessageOutlined /></div>
          <div className="faq-cta-text">
            <strong>¿No encontraste tu respuesta?</strong>
            <span>Escribinos tu duda: el equipo la lee y, si se repite, la sumamos a esta sección.</span>
          </div>
          {setSelectedKey && (
            <Button type="primary" icon={<MessageOutlined />} onClick={irAFeedback}>
              Escribinos
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
