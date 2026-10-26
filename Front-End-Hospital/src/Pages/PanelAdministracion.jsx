import React from "react";
import { SettingOutlined } from "@ant-design/icons";
import { AdminPatologia } from "../Components/AdminPatologia";
import { AdminPaciente } from "../Components/AdminPaciente";
import { AdminReceta } from "../Components/AdminReceta";
import { AdminInformacion } from "../Components/AdminInformacion";
import { AdminEjercicio } from "../Components/AdminEjercicio";
import { AdminUsuario } from "../Components/AdminUsuario";
import { AdminCategoria } from "../Components/AdminCategoria";
import { AdminInfografia } from "../Components/AdminInfografia";
import { AdminFAQ } from "../Components/AdminFAQ";
import { AdminCalendario } from "../Components/AdminCalendario";
import { AdminAutoevaluacion } from "../Components/AdminAutoevaluacion";
import { AdminFeedback } from "../Components/AdminFeedback";
import { PageHeader } from "../Components/PageHeader";
import { SectionHelp } from "../Components/SectionHelp";

const PANEL_LABELS = {
  "6": "Patologías",
  "7": "Recetas",
  "8": "Información",
  "9": "Ejercicios",
  "10": "Usuarios",
  "11": "Pacientes",
  "12": "Categorías",
  "19": "Infografías",
  "20": "Preguntas frecuentes",
  "21": "Calendario",
  "22": "Autoevaluaciones",
  "23": "Comentarios",
};

// Texto común a las listas con Activos/Deshabilitados y menú «⋮» por fila.
const ACCIONES_FILA =
  "Tocá «⋮» en cada fila para ver el detalle, editar o deshabilitar. Lo deshabilitado no se borra: deja de verse en la app y lo podés recuperar desde «Deshabilitados».";

const PANEL_HELP = {
  "6": `Las patologías se asignan a los pacientes y a los contenidos: así cada paciente ve las recetas, la información y los ejercicios pensados para su condición. Usá «Agregar» para crear una. ${ACCIONES_FILA}`,
  "7": `Cargá recetas con ingredientes, preparación e información nutricional. Asocialas a patologías para que les aparezcan a esos pacientes (sin patología, las ve todo el mundo) y a categorías para que se puedan filtrar. ${ACCIONES_FILA}`,
  "8": `Publicá videos, podcasts o enlaces educativos que se ven en «Informarse». Clasificalos por patología y categoría para que cada paciente encuentre lo que le sirve. ${ACCIONES_FILA}`,
  "9": `Publicá los videos de ejercicios que se ven en «Ejercitarse». Clasificalos por patología y categoría; sobre cada ejercicio el paciente puede enviar una autoevaluación. ${ACCIONES_FILA}`,
  "10": "Creá las cuentas del equipo y de los pacientes y asigná el rol (Administrador, Profesional o Paciente), que define qué puede ver y hacer cada uno. Para sumar a un profesional, tocá «Agregar» y elegí el rol «Profesional de salud»: va a poder cargar contenido, consultar pacientes y aparecer como destinatario de las autoevaluaciones. Desde «⋮» en cada fila podés editar la cuenta, restablecer la contraseña o deshabilitarla (y volver a habilitarla); las cuentas deshabilitadas quedan en la lista pero no pueden ingresar.",
  "11": "Vinculá a cada paciente con sus patologías: de eso depende qué contenidos personalizados ve en la app. Desde «⋮» podés ver o editar sus datos, restablecer su contraseña o deshabilitarlo; los profesionales pueden consultar, pero solo un administrador puede hacer cambios.",
  "12": `Las categorías ordenan las recetas, la información y los ejercicios, y son las opciones de los filtros que usan los pacientes. ${ACCIONES_FILA}`,
  "19": `Subí infografías (imagen o PDF) o enlaces sobre dietas y planes alimentarios; se muestran en la sección «Infografías». ${ACCIONES_FILA}`,
  "20": `Cargá las preguntas que más se repiten con su respuesta, agrupadas por categoría. Ayudan a que los pacientes resuelvan sus dudas sin tener que consultar. ${ACCIONES_FILA}`,
  "21": `Cargá charlas, talleres y actividades del hospital. Pueden ser generales (las ve todo el mundo) o para una patología. Se muestran en la sección «Calendario». ${ACCIONES_FILA}`,
  "22": "Acá llegan las autoevaluaciones que envían los pacientes. Las respuestas son del paciente y no se pueden editar; lo que sí podés hacer es dejarle una devolución y marcarla como revisada (el paciente la ve en «Ejercitarse › Mis autoevaluaciones»). Las alertas marcan dolor intenso o síntomas de alarma: atendelas primero. Filtrá por paciente, fecha, patología, profesional o estado.",
  "23": "Leé los comentarios que envían los usuarios desde «Feedback» y marcalos como leídos cuando el equipo los haya revisado. Sirven para mejorar la app y la atención.",
};

export const PanelAdministracion = ({ selectedKey }) => {
  const label = PANEL_LABELS[selectedKey] || "Administración";

  return (
    <div className="page-wrapper page-wrapper--admin">
      <PageHeader
        icon={<SettingOutlined />}
        title={`Administración — ${label}`}
        subtitle="Cargá y mantené actualizado el contenido que ven los usuarios de la app"
      />

      {PANEL_HELP[selectedKey] && (
        <SectionHelp key={selectedKey} className="admin-help-alert">
          {PANEL_HELP[selectedKey]}
        </SectionHelp>
      )}

      {selectedKey === "6" && <AdminPatologia />}
      {selectedKey === "7" && <AdminReceta />}
      {selectedKey === "8" && <AdminInformacion />}
      {selectedKey === "9" && <AdminEjercicio />}
      {selectedKey === "10" && <AdminUsuario />}
      {selectedKey === "11" && <AdminPaciente selectedKey={selectedKey} />}
      {selectedKey === "12" && <AdminCategoria />}
      {selectedKey === "19" && <AdminInfografia />}
      {selectedKey === "20" && <AdminFAQ />}
      {selectedKey === "21" && <AdminCalendario />}
      {selectedKey === "22" && <AdminAutoevaluacion />}
      {selectedKey === "23" && <AdminFeedback />}
    </div>
  );
};
