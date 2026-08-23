# Iconos Hospital Oñativia — mapa de assets

Carpeta: `public/logos-hospital/`  
Registro JS: `src/constants/hospitalIcons.js`

Uso en React (archivos en `public`, sin import de imagen):

```jsx
import { HOSPITAL_ICONS } from "../constants/hospitalIcons";

<img src={HOSPITAL_ICONS.recetas} alt="Recetas" width={48} height={48} />
```

---

## Renombrado (origen → destino)

| Antes | Después | Concepto | Sección sugerida |
|-------|---------|----------|------------------|
| 01.png | ic-recetas.png | Recetas | Home / Recetas |
| 02.png | ic-videos-ejercicio.png | Videos ejercicio | Ejercicio / Home |
| 03.png | ic-videos-yoga-monitor.png | **EXTRA** — yoga en monitor + Play | Ejercicio |
| 04.png | ic-tablas-info.png | Tablas informativas | Tablas / Home |
| 05.png | ic-rutinas.png | Rutinas | Ejercicio |
| 06.png | ic-30-min.png | 30 min ejercicio | Ejercicio / objetivos |
| 07.png | ic-yoga-glucosa.png | Yoga / bajar glucosa | Info / Diabetes |
| 08.png | ic-patol-diabetes-infantil.png | **EXTRA** — bebé + gota | Info / patologías |
| 09.png | ic-ejercicio-diabetes.png | Ejercicio vs diabetes | Ejercicio / Info |
| 010.png | ic-balance-azucar.png | Hipo vs hiperglucemia | Info educación |
| 011.png | ic-info-prueba.png | Info prueba / formularios | Info / evaluaciones |
| 012.png | ic-food-humita.png | Humita | Recetas regionales |
| 013.png | ic-food-guiso.png | Guiso de lentejas | Recetas |
| 014.png | ic-food-anchi.png | Anchi | Recetas postres |
| 015.png | ic-food-cayote.png | Dulce de cayote | Recetas postres |
| 016.png | ic-group-frutas.png | Grupo frutas | Recetas categorías |
| 017.png | ic-group-vegetales.png | Grupo vegetales | Recetas categorías |
| 018.png | ic-group-pescados.png | Grupo pescados | Recetas categorías |
| 019.png | ic-group-carnes.png | Grupo carnes | Recetas categorías |
| 020.png | ic-food-quesillo.png | Quesillo | Recetas regionales |
| 021.png | ic-food-tamal.png | Tamales | Recetas regionales |
| 022.png | ic-food-bombas-papa.png | Bombas de papa | Recetas |
| 023.png | ic-food-empanadas.png | Empanadas | Recetas regionales |
| 024.png | ic-ficha-salud.png | Ficha de salud | Paciente / perfil |
| 025.png | ic-conversor.png | Conversor | ConversionUnidades |
| 026.png | — | **FALTANTE** `ic-salero` | Tips sodio |
| 027.png | ic-plato-nutricion.png | Plato nutrición | Home / dietas |
| 028.png | ic-patol-obesidad.png | Obesidad | Info patologías |
| 029.png | ic-patol-cardiovascular.png | Enfermedad CV | Info patologías |
| 030.png | ic-patol-diabetes.png | Diabetes | Info / glucosa |
| 031.png | ic-informacion.png | Información (i) | Tooltips / FAQ |
| 032.png | ic-patol-renal.png | Enfermedad renal | Info patologías |
| 033.png | ic-trat-dialisis.png | Diálisis | Info tratamientos |
| 034.png | ic-patol-bocio.png | Bocio | Info endocrino |
| 035.png | ic-consulta-medica.png | Profesional y paciente | Turnos / contacto |
| 036.png | ic-patol-tiroides.png | Cáncer de tiroides | Info oncología |
| 037.png | ic-laboratorio.png | Laboratorio | Info estudios |
| 038.png | ic-kinesiologia.png | Kinesiología | Rehabilitación |
| 039.png | ic-trat-bariatrica.png | Cirugía bariátrica | Tratamientos |
| 040.png | ic-patol-lipedema.png | Lipedema | Info patologías |
| 041.png | bg-pattern-ejercicio.png | **Patrón fondo** ejercicio | CSS / fondos |
| 042.png | bg-pattern-comida.png | **Patrón fondo** comida | CSS / fondos |

---

## Extras (no estaban en el diccionario)

1. **`ic-videos-yoga-monitor.png`** (ex `03.png`) — monitor con persona en yoga y botón Play.  
2. **`ic-patol-diabetes-infantil.png`** (ex `08.png`) — bebé en manos con gota de sangre (posible diabetes gestacional/pediátrica). Confirmar nombre con el diseñador.  
3. **`bg-pattern-ejercicio.png`** / **`bg-pattern-comida.png`** (ex `041`/`042`) — patrones seamless, no iconos UI.

## Faltante

- **`ic-salero.png`** — correspondería a `026.png` (salero / reducción de sodio). **No vino en la carpeta.** Pedir al diseñador y agregar la clave `salero` en `hospitalIcons.js`.

---

## Dónde enchufar en el frontend

| Claves `HOSPITAL_ICONS` | Archivo / ruta UI |
|-------------------------|-------------------|
| `recetas`, `platoNutricion`, `tablasInfo`, … | `src/Components/ListCard.jsx`, menú `MainApp.jsx` |
| `food*`, `group*` | `src/Pages/Recetas.jsx` |
| `videosEjercicio`, `rutinas`, `treintaMin`, `yogaGlucosa`, … | `src/Pages/Ejercicio.jsx` |
| `patol*`, `trat*`, `consultaMedica`, `laboratorio` | `src/Pages/Info.jsx` + admin Patología |
| `conversor` | `src/Components/ConversionUnidades.jsx` |
| `fichaSalud` | Admin Paciente / perfil |
| `informacion` | FAQ / modales |
| `bgPattern*` | fondos CSS login/home (opcional) |

Esta pasada **no** reemplaza aún los iconos de Ant Design en Home; solo deja assets renombrados + registro listo para usar.
