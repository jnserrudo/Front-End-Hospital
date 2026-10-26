import React, { useEffect, useState } from "react";
import { CalendarOutlined, HeartOutlined, TeamOutlined, UserOutlined, FileSearchOutlined, MessageOutlined, RightOutlined } from "@ant-design/icons";
import { Card } from "./Card";
import { HospitalIcon } from "./HospitalIcon";
import { apiFetch } from "../services/http";
import { getSession, ROLES } from "../services/session";

const saludo = () => {
  const h = new Date().getHours();
  if (h < 6) return "Hola";
  if (h < 13) return "Buen día";
  if (h < 20) return "Buenas tardes";
  return "Buenas noches";
};

const fechaCorta = (f) => {
  const [a, m, d] = String(f).slice(0, 10).split("-");
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${+d} ${meses[+m - 1] || ""}${a !== String(new Date().getFullYear()) ? ` ${a}` : ""}`;
};

// Bienvenida con accesos rápidos según el rol (no reemplaza las tarjetas, las complementa).
const Bienvenida = ({ ir }) => {
  const s = getSession();
  const rol = +s?.rol;
  const esStaff = rol === ROLES.ADMIN || rol === ROLES.PROFESIONAL;
  const [sinRevisar, setSinRevisar] = useState(null);
  const [proximo, setProximo] = useState(undefined);

  useEffect(() => {
    let vivo = true;
    if (esStaff) {
      apiFetch("/autoevaluaciones?revisada=0")
        .then((l) => vivo && setSinRevisar(Array.isArray(l) ? l.length : null))
        .catch(() => vivo && setSinRevisar(null));
    }
    apiFetch("/calendario")
      .then((l) => {
        if (!vivo) return;
        const hoy = new Date().toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });
        const futuros = (Array.isArray(l) ? l : []).filter((e) => e?.habilitado !== 0 && String(e.fecha).slice(0, 10) >= hoy);
        futuros.sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
        setProximo(futuros[0] || null);
      })
      .catch(() => vivo && setProximo(null));
    return () => { vivo = false; };
  }, [esStaff]);

  const atajos =
    rol === ROLES.PACIENTE
      ? [
          { k: 4, icon: <HeartOutlined />, t: "Contanos cómo te fue", d: "Hacé una autoevaluación" },
          { k: 16, icon: <CalendarOutlined />, t: "Calendario", d: "Charlas y actividades" },
          { k: 18, icon: <MessageOutlined />, t: "Tu opinión", d: "Dejanos un comentario" },
        ]
      : [
          {
            k: 22,
            icon: <FileSearchOutlined />,
            t: "Autoevaluaciones",
            d: sinRevisar == null ? "Revisá lo que enviaron los pacientes" : sinRevisar === 0 ? "Está todo revisado" : `${sinRevisar} sin revisar`,
            badge: sinRevisar > 0 ? sinRevisar : null,
          },
          { k: 11, icon: <TeamOutlined />, t: "Pacientes", d: rol === ROLES.ADMIN ? "Altas y patologías" : "Consultá sus datos" },
          rol === ROLES.ADMIN
            ? { k: 10, icon: <UserOutlined />, t: "Usuarios", d: "Cuentas del equipo" }
            : { k: 21, icon: <CalendarOutlined />, t: "Calendario", d: "Cargá actividades" },
        ];

  return (
    <section className="home-bienvenida" aria-label="Bienvenida">
      <div className="home-bienvenida__texto">
        <h1>
          {saludo()}
          {s?.nombre ? `, ${s.nombre}` : ""} 👋
        </h1>
        <p>
          {rol === ROLES.PACIENTE
            ? "Acá tenés recetas, videos y ejercicios pensados para vos."
            : rol === ROLES.PROFESIONAL
              ? "Acompañá a tus pacientes y mantené el contenido al día."
              : "Gestioná el equipo, los pacientes y el contenido de la app."}
        </p>
        {proximo && (
          <button type="button" className="home-proximo" onClick={() => ir(16)}>
            <CalendarOutlined /> Próxima actividad: <strong>{proximo.titulo}</strong> · {fechaCorta(proximo.fecha)}
          </button>
        )}
      </div>
      <div className="home-atajos">
        {atajos.map((a) => (
          <button type="button" key={a.k} className="home-atajo" onClick={() => ir(a.k)}>
            <span className="home-atajo__icono">{a.icon}</span>
            <span className="home-atajo__txt">
              <strong>{a.t}</strong>
              <small>{a.d}</small>
            </span>
            {a.badge ? <span className="home-atajo__badge">{a.badge}</span> : <RightOutlined className="home-atajo__flecha" />}
          </button>
        ))}
      </div>
    </section>
  );
};

export const ListCard = ({ setTabIndex }) => {
  return (
    <div className="home-wrap">
      <Bienvenida ir={setTabIndex} />
      <div className="list_card">
        <Card
          onClick={() => setTabIndex(2)}
          mje="Recetas saludables"
          desc="Recetas que te ayudan a sentirte mejor"
          logo={<HospitalIcon name="recetas" size={48} alt="" />}
        />
        <Card
          onClick={() => setTabIndex(3)}
          mje="Información y salud"
          desc="Videos y podcasts sobre patologías y tips para cuidarte"
          logo={<HospitalIcon name="consultaMedica" size={48} alt="" />}
        />
        <Card
          onClick={() => setTabIndex(4)}
          mje="Ejercitate con nosotros"
          desc="Videos para que puedas ejercitarte desde casa"
          logo={<HospitalIcon name="videosEjercicio" size={48} alt="" />}
        />
        <Card
          onClick={() => setTabIndex(13)}
          mje="Tablas nutricionales"
          desc="Información nutricional de alimentos"
          logo={<HospitalIcon name="tablasInfo" size={48} alt="" />}
        />
        <Card
          onClick={() => setTabIndex(15)}
          mje="Infografías de dietas"
          desc="Material visual sobre nutrición y planes alimentarios"
          logo={<HospitalIcon name="platoNutricion" size={48} alt="" />}
        />
        <Card
          onClick={() => setTabIndex(17)}
          mje="Preguntas frecuentes"
          desc="Encontrá respuestas a las dudas más comunes"
          logo={<HospitalIcon name="informacion" size={48} alt="" />}
        />
      </div>
    </div>
  );
};
