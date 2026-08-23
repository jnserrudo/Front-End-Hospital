/**
 * Iconos del Hospital Oñativia (public/logos-hospital).
 * Uso: <img src={HOSPITAL_ICONS.recetas} alt="" /> o <HospitalIcon name="recetas" />
 */
const BASE = "/logos-hospital";

export const HOSPITAL_ICONS = {
  // Home / nutrición / multimedia
  recetas: `${BASE}/ic-recetas.png`,
  videosEjercicio: `${BASE}/ic-videos-ejercicio.png`,
  videosYogaMonitor: `${BASE}/ic-videos-yoga-monitor.png`,
  tablasInfo: `${BASE}/ic-tablas-info.png`,
  rutinas: `${BASE}/ic-rutinas.png`,
  treintaMin: `${BASE}/ic-30-min.png`,
  yogaGlucosa: `${BASE}/ic-yoga-glucosa.png`,
  ejercicioDiabetes: `${BASE}/ic-ejercicio-diabetes.png`,
  balanceAzucar: `${BASE}/ic-balance-azucar.png`,
  infoPrueba: `${BASE}/ic-info-prueba.png`,
  platoNutricion: `${BASE}/ic-plato-nutricion.png`,
  conversor: `${BASE}/ic-conversor.png`,
  fichaSalud: `${BASE}/ic-ficha-salud.png`,
  informacion: `${BASE}/ic-informacion.png`,
  consultaMedica: `${BASE}/ic-consulta-medica.png`,
  laboratorio: `${BASE}/ic-laboratorio.png`,
  kinesiologia: `${BASE}/ic-kinesiologia.png`,

  // Recetario / alimentos
  foodHumita: `${BASE}/ic-food-humita.png`,
  foodGuiso: `${BASE}/ic-food-guiso.png`,
  foodAnchi: `${BASE}/ic-food-anchi.png`,
  foodCayote: `${BASE}/ic-food-cayote.png`,
  foodQuesillo: `${BASE}/ic-food-quesillo.png`,
  foodTamal: `${BASE}/ic-food-tamal.png`,
  foodBombasPapa: `${BASE}/ic-food-bombas-papa.png`,
  foodEmpanadas: `${BASE}/ic-food-empanadas.png`,
  groupFrutas: `${BASE}/ic-group-frutas.png`,
  groupVegetales: `${BASE}/ic-group-vegetales.png`,
  groupPescados: `${BASE}/ic-group-pescados.png`,
  groupCarnes: `${BASE}/ic-group-carnes.png`,

  // Patologías / tratamientos
  patolObesidad: `${BASE}/ic-patol-obesidad.png`,
  patolCardiovascular: `${BASE}/ic-patol-cardiovascular.png`,
  patolDiabetes: `${BASE}/ic-patol-diabetes.png`,
  patolDiabetesInfantil: `${BASE}/ic-patol-diabetes-infantil.png`,
  patolRenal: `${BASE}/ic-patol-renal.png`,
  patolBocio: `${BASE}/ic-patol-bocio.png`,
  patolTiroides: `${BASE}/ic-patol-tiroides.png`,
  patolLipedema: `${BASE}/ic-patol-lipedema.png`,
  tratDialisis: `${BASE}/ic-trat-dialisis.png`,
  tratBariatrica: `${BASE}/ic-trat-bariatrica.png`,

  // Fondos
  bgPatternEjercicio: `${BASE}/bg-pattern-ejercicio.png`,
  bgPatternComida: `${BASE}/bg-pattern-comida.png`,
};

export const HOSPITAL_ICONS_BY_SECTION = {
  home: ["recetas", "platoNutricion", "tablasInfo", "videosEjercicio", "rutinas", "informacion"],
  recetas: [
    "recetas", "foodHumita", "foodGuiso", "foodAnchi", "foodCayote",
    "foodQuesillo", "foodTamal", "foodBombasPapa", "foodEmpanadas",
    "groupFrutas", "groupVegetales", "groupPescados", "groupCarnes",
  ],
  ejercicio: [
    "videosEjercicio", "videosYogaMonitor", "rutinas", "treintaMin",
    "yogaGlucosa", "ejercicioDiabetes", "kinesiologia",
  ],
  info: [
    "infoPrueba", "balanceAzucar", "patolObesidad", "patolCardiovascular",
    "patolDiabetes", "patolDiabetesInfantil", "patolRenal", "patolBocio",
    "patolTiroides", "patolLipedema", "tratDialisis", "tratBariatrica",
    "consultaMedica", "laboratorio", "fichaSalud",
  ],
  herramientas: ["conversor", "tablasInfo"],
};
