import { ImagenSegura } from "../Components/MediaNoDisponible";
import React, { useState, useEffect, useMemo } from "react";
import { Calendar, Modal, Spin, Select, Tag, Button, Segmented, Row, Col, Empty, Result, Grid } from "antd";
import {
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  DownloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { getAllEventos } from "../services/calendario-services";
import { getMediaUrl } from "../services/config";
import { isStaff } from "../services/session";
import { PageHeader } from "../Components/PageHeader";
import { SectionHelp } from "../Components/SectionHelp";
import { AdminShortcut } from "../Components/AdminShortcut";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

const TIPOS = {
  general: { label: "General", color: "green" },
  patologia: { label: "Por patología", color: "orange" },
};
const tipoInfo = (tipo) => TIPOS[tipo] || { label: tipo ? String(tipo) : "Evento", color: "blue" };

// Las fechas se guardan a medianoche UTC: usamos el día tal cual viene (AAAA-MM-DD) para no correrlo un día.
const diaKey = (fecha) => String(fecha || "").slice(0, 10);
const diaDe = (fecha) => dayjs(diaKey(fecha));
const capitalizar = (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : t);

const cuandoEs = (fecha) => {
  const dias = diaDe(fecha).diff(dayjs().startOf("day"), "day");
  if (dias === 0) return "Hoy";
  if (dias === 1) return "Mañana";
  if (dias > 1 && dias < 7) return `En ${dias} días`;
  if (dias < 0) return "Ya pasó";
  return null;
};

// Archivo .ics de día completo para agendarlo en el calendario del celular o la compu.
const descargarIcs = (ev) => {
  const ini = diaDe(ev.fecha);
  const esc = (t) => String(t || "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/[,;]/g, (m) => "\\" + m);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hospital Dr. Arturo Oñativia//Calendario//ES",
    "BEGIN:VEVENT",
    `UID:evento-${ev.id}@hospital-onativia`,
    `DTSTAMP:${dayjs().format("YYYYMMDD[T]HHmmss")}`,
    `DTSTART;VALUE=DATE:${ini.format("YYYYMMDD")}`,
    `DTEND;VALUE=DATE:${ini.add(1, "day").format("YYYYMMDD")}`,
    `SUMMARY:${esc(ev.titulo)}`,
    `DESCRIPTION:${esc(ev.descripcion)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `evento-${ini.format("YYYY-MM-DD")}.ics`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const DateBadge = ({ fecha, size = "md" }) => {
  const d = diaDe(fecha);
  return (
    <div className={`cal-date-badge cal-date-badge--${size}`} aria-hidden="true">
      <span className="cal-date-badge-month">{d.format("MMM").replace(".", "")}</span>
      <span className="cal-date-badge-day">{d.format("D")}</span>
    </div>
  );
};

const EventoItem = ({ ev, onClick }) => {
  const info = tipoInfo(ev.tipo);
  const cuando = cuandoEs(ev.fecha);
  return (
    <button type="button" className="cal-event-item" onClick={() => onClick(ev)}>
      <DateBadge fecha={ev.fecha} />
      <div className="cal-event-item-body">
        <span className="cal-event-item-title">{ev.titulo}</span>
        <span className="cal-event-item-meta">
          {capitalizar(diaDe(ev.fecha).format("dddd D [de] MMMM"))}
          {cuando && cuando !== "Ya pasó" ? <strong className="cal-event-item-when"> · {cuando}</strong> : null}
        </span>
        <span>
          <Tag color={info.color} style={{ marginInlineEnd: 4 }}>{info.label}</Tag>
          {ev.patologia?.nombre ? <Tag icon={<MedicineBoxOutlined />}>{ev.patologia.nombre}</Tag> : null}
        </span>
      </div>
    </button>
  );
};

export const Calendario = ({ setSelectedKey }) => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [patologiaFiltro, setPatologiaFiltro] = useState(null);
  const [mes, setMes] = useState(() => dayjs());
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const screens = Grid.useBreakpoint();
  const compacto = !screens.md;
  const staff = isStaff();

  const cargarEventos = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getAllEventos();
      if (!Array.isArray(data)) throw new Error("Respuesta inesperada");
      setEventos(data);
    } catch (e) {
      console.error("Error al cargar eventos:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  const patologiasConEventos = useMemo(() => {
    const m = new Map();
    eventos.forEach((e) => e.patologia?.id && m.set(e.patologia.id, e.patologia.nombre));
    return [...m.entries()].map(([value, label]) => ({ value, label }));
  }, [eventos]);

  const filtrados = useMemo(
    () =>
      eventos
        .filter((e) => tipoFiltro === "todos" || e.tipo === tipoFiltro)
        .filter((e) => !patologiaFiltro || e.patologia?.id === patologiaFiltro)
        .sort((a, b) => diaKey(a.fecha).localeCompare(diaKey(b.fecha))),
    [eventos, tipoFiltro, patologiaFiltro]
  );

  const porDia = useMemo(() => {
    const m = {};
    filtrados.forEach((e) => {
      (m[diaKey(e.fecha)] ||= []).push(e);
    });
    return m;
  }, [filtrados]);

  const hoyKey = dayjs().format("YYYY-MM-DD");
  const proximos = filtrados.filter((e) => diaKey(e.fecha) >= hoyKey);
  const pasados = filtrados.filter((e) => diaKey(e.fecha) < hoyKey);
  const delMes = filtrados.filter((e) => diaKey(e.fecha).slice(0, 7) === mes.format("YYYY-MM")).length;
  const eventosDiaSel = diaSeleccionado ? porDia[diaSeleccionado.format("YYYY-MM-DD")] || [] : [];

  const abrirEvento = (ev) => setSelectedEvento(ev);
  const irAEvento = (ev) => {
    setMes(diaDe(ev.fecha));
    abrirEvento(ev);
  };

  const cellRender = (fecha, info) => {
    if (info.type !== "date") return info.originNode;
    const lista = porDia[fecha.format("YYYY-MM-DD")];
    if (!lista?.length) return null;
    if (compacto) {
      return (
        <div className="cal-dots">
          {lista.slice(0, 3).map((ev) => (
            <span key={ev.id} className={`cal-dot cal-dot--${TIPOS[ev.tipo] ? ev.tipo : "otro"}`} />
          ))}
        </div>
      );
    }
    return (
      <ul className="cal-chips">
        {lista.slice(0, 3).map((ev) => (
          <li key={ev.id}>
            <button
              type="button"
              className={`cal-chip cal-chip--${TIPOS[ev.tipo] ? ev.tipo : "otro"}`}
              title={ev.titulo}
              onClick={(e) => {
                e.stopPropagation();
                abrirEvento(ev);
              }}
            >
              {ev.titulo}
            </button>
          </li>
        ))}
        {lista.length > 3 && <li className="cal-chip-more">+{lista.length - 3} más</li>}
      </ul>
    );
  };

  const headerRender = ({ value, onChange }) => (
    <div className="cal-header">
      <Button
        shape="circle"
        icon={<LeftOutlined />}
        aria-label="Mes anterior"
        onClick={() => onChange(value.subtract(1, "month"))}
      />
      <div className="cal-header-title">
        <span>{capitalizar(value.format("MMMM YYYY"))}</span>
        <small>
          {delMes === 0 ? "Sin eventos este mes" : `${delMes} evento${delMes !== 1 ? "s" : ""} este mes`}
        </small>
      </div>
      <Button
        shape="circle"
        icon={<RightOutlined />}
        aria-label="Mes siguiente"
        onClick={() => onChange(value.add(1, "month"))}
      />
      <Button
        className="cal-header-today"
        onClick={() => {
          onChange(dayjs());
          setDiaSeleccionado(null);
        }}
        disabled={value.isSame(dayjs(), "month")}
        title={value.isSame(dayjs(), "month") ? "Ya estás viendo el mes actual" : undefined}
      >
        Hoy
      </Button>
    </div>
  );

  const renderLista = () => {
    if (diaSeleccionado) {
      return (
        <>
          <div className="cal-side-title">
            <span>{capitalizar(diaSeleccionado.format("dddd D [de] MMMM"))}</span>
            <Button type="link" size="small" onClick={() => setDiaSeleccionado(null)}>
              Ver próximos
            </Button>
          </div>
          {eventosDiaSel.length ? (
            eventosDiaSel.map((ev) => <EventoItem key={ev.id} ev={ev} onClick={abrirEvento} />)
          ) : (
            <p className="cal-side-empty">No hay eventos este día. Elegí otro día marcado en el calendario.</p>
          )}
        </>
      );
    }
    return (
      <>
        <div className="cal-side-title">
          <span>Próximos eventos</span>
          {proximos.length > 0 && <Tag color="blue">{proximos.length}</Tag>}
        </div>
        {proximos.length ? (
          proximos.slice(0, 6).map((ev) => <EventoItem key={ev.id} ev={ev} onClick={irAEvento} />)
        ) : (
          <p className="cal-side-empty">
            No hay eventos próximos
            {tipoFiltro !== "todos" || patologiaFiltro ? " con este filtro" : ""}.
            {pasados.length > 0 && (
              <>
                {" "}El último fue <strong>«{pasados[pasados.length - 1].titulo}»</strong> el{" "}
                {diaDe(pasados[pasados.length - 1].fecha).format("D [de] MMMM")}.
              </>
            )}
          </p>
        )}
        {proximos.length > 6 && (
          <p className="cal-side-empty">Y {proximos.length - 6} más: avanzá de mes en el calendario para verlos.</p>
        )}
      </>
    );
  };

  const leyenda = (
    <div className="cal-legend" aria-label="Referencias de colores">
      <span><i className="cal-dot cal-dot--general" /> General: para todos</span>
      <span><i className="cal-dot cal-dot--patologia" /> Por patología: para pacientes con esa condición</span>
      <span><i className="cal-legend-today" /> Hoy</span>
    </div>
  );

  const info = selectedEvento ? tipoInfo(selectedEvento.tipo) : null;

  return (
    <div className="page-wrapper">
      <PageHeader
        icon={<CalendarOutlined />}
        title="Calendario de eventos"
        subtitle="Charlas, talleres y actividades del hospital"
        actions={<AdminShortcut adminKey="21" setSelectedKey={setSelectedKey} />}
      />

      <SectionHelp>
        Acá ves las actividades que organiza el hospital para acompañarte en tu tratamiento.{" "}
        {staff
          ? "Los eventos generales los ven todos los pacientes; los de una patología, solo los pacientes que la tienen asignada (vos ves todos)."
          : "Ves los eventos generales y los pensados para tus patologías."}{" "}
        Tocá un evento (en el calendario
        o en «Próximos eventos») para ver el detalle y agendarlo en tu celular; tocá un día para ver solo lo de esa fecha.
      </SectionHelp>

      <div className="filter-bar">
        <Segmented
          value={tipoFiltro}
          onChange={(v) => {
            setTipoFiltro(v);
            if (v === "general") setPatologiaFiltro(null);
          }}
          options={[
            { value: "todos", label: "Todos" },
            { value: "general", label: "Generales" },
            { value: "patologia", label: "Por patología" },
          ]}
        />
        {patologiasConEventos.length > 0 && tipoFiltro !== "general" && (
          <Select
            allowClear
            placeholder="Filtrar por patología"
            value={patologiaFiltro}
            onChange={(v) => setPatologiaFiltro(v ?? null)}
            options={patologiasConEventos}
            style={{ flex: "1 1 200px", minWidth: 0 }}
          />
        )}
        <span className="filter-bar-meta">
          {proximos.length} próximo{proximos.length !== 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <Spin size="large" />
          <p style={{ marginTop: 16, color: "var(--gray-500)" }}>Cargando eventos...</p>
        </div>
      ) : error ? (
        <Result
          status="warning"
          title="No pudimos cargar el calendario"
          subTitle="Revisá tu conexión e intentá de nuevo en unos segundos."
          extra={<Button type="primary" onClick={cargarEventos}>Reintentar</Button>}
        />
      ) : eventos.length === 0 ? (
        <div className="calendar-panel cal-empty">
          <Empty
            image={<CalendarOutlined style={{ fontSize: 56, color: "var(--primary-light)" }} />}
            description={
              <>
                <strong>Todavía no hay eventos programados.</strong>
                <br />
                Cuando el hospital organice charlas, talleres o actividades, las vas a ver acá. Volvé a mirar más adelante.
              </>
            }
          >
            {staff && setSelectedKey && (
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setSelectedKey("21")}>
                Cargar el primer evento
              </Button>
            )}
          </Empty>
        </div>
      ) : (
        <Row gutter={[20, 20]}>
          <Col xs={24} lg={16}>
            <div className="calendar-panel cal-panel">
              <Calendar
                value={mes}
                fullscreen={!compacto}
                onPanelChange={(v) => setMes(v)}
                onSelect={(d, sel) => {
                  setMes(d);
                  if (!sel || sel.source === "date") setDiaSeleccionado(d);
                }}
                headerRender={headerRender}
                cellRender={cellRender}
              />
              {leyenda}
            </div>
          </Col>
          <Col xs={24} lg={8}>
            <div className="cal-side">{renderLista()}</div>
          </Col>
        </Row>
      )}

      <Modal
        open={Boolean(selectedEvento)}
        onCancel={() => setSelectedEvento(null)}
        footer={
          selectedEvento
            ? [
                <Button key="ics" icon={<DownloadOutlined />} onClick={() => descargarIcs(selectedEvento)}>
                  Agendar en mi calendario
                </Button>,
                <Button key="ok" type="primary" onClick={() => setSelectedEvento(null)}>
                  Listo
                </Button>,
              ]
            : null
        }
        width="min(560px, 95vw)"
        title={null}
        destroyOnClose
      >
        {selectedEvento && (
          <div className="cal-modal">
            <div className="cal-modal-head">
              <DateBadge fecha={selectedEvento.fecha} size="lg" />
              <div>
                <h3 className="cal-modal-title">{selectedEvento.titulo}</h3>
                <p className="cal-modal-date">
                  <ClockCircleOutlined /> {capitalizar(diaDe(selectedEvento.fecha).format("dddd D [de] MMMM [de] YYYY"))}
                  {cuandoEs(selectedEvento.fecha) ? ` · ${cuandoEs(selectedEvento.fecha)}` : ""}
                </p>
                <div>
                  <Tag color={info.color}>{info.label}</Tag>
                  {selectedEvento.patologia?.nombre && (
                    <Tag icon={<MedicineBoxOutlined />}>{selectedEvento.patologia.nombre}</Tag>
                  )}
                </div>
              </div>
            </div>
            {selectedEvento.urlImagen && (
              <ImagenSegura className="cal-modal-img" src={getMediaUrl(selectedEvento.urlImagen)} alt="" compacto style={undefined} />
            )}
            {selectedEvento.descripcion ? (
              <p className="cal-modal-desc">{selectedEvento.descripcion}</p>
            ) : (
              <p className="cal-modal-desc cal-side-empty">Este evento no tiene descripción.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
