/* Konba Rika · datos de la demo
   La carta está transcrita de la carta impresa actual (Picoteo + Menú semanal).
   Los eventos son de ejemplo para la demo. */

window.KR = window.KR || {};

KR.info = {
  nombre: "Konba Rika",
  direccion: "Errepidea Nagusia 13, 48650 Barrika, Bizkaia",
  telefono: "+34 946 75 12 76",
  telHref: "tel:+34946751276",
  maps: "https://www.google.com/maps/search/?api=1&query=Konba+Rika+Barrika",
};

KR.carta = [
  {
    id: "ensaladas", nombre: "Ensaladas",
    platos: [
      { id: "ens-ventresca", nombre: "Ensalada de ventresca", precio: "18,00" },
      { id: "ens-langostinos", nombre: "Ensalada de langostinos panko", nota: "Con aguacate y vinagreta de mango y chili dulce", precio: "19,00" },
    ],
  },
  {
    id: "mar", nombre: "Del mar",
    platos: [
      { id: "gambon", nombre: "Gambón al ajillo", precio: "14,00" },
      { id: "gambas-huelva", nombre: "Gambas de Huelva", precio: "24,00" },
      { id: "zamburinas", nombre: "Zamburiñas", precio: "18,00" },
      { id: "pulpo", nombre: "Pulpo", precio: "24,00" },
      { id: "calamares", nombre: "Calamares", precio: "9,50" },
      { id: "mejillones", nombre: "Mejillones", precio: "12,00" },
    ],
  },
  {
    id: "croquetas", nombre: "Croquetas",
    platos: [
      { id: "croq-jamon", nombre: "Croquetas de jamón", precio: "9,50" },
      { id: "croq-bacalao", nombre: "Croquetas de bacalao", precio: "9,50" },
      { id: "croq-boletus", nombre: "Croquetas de boletus", precio: "9,50" },
      { id: "croq-txipis", nombre: "Croquetas de txipis", precio: "9,50" },
      { id: "croq-buey", nombre: "Croquetas de buey", precio: "12,50" },
    ],
  },
  {
    id: "picar", nombre: "Para picar",
    platos: [
      { id: "champis", nombre: "Champis a la plancha", precio: "9,50" },
      { id: "jamon-bellota", nombre: "Jamón de bellota", precio: "32,00" },
      { id: "morcilla", nombre: "Morcilla", precio: "9,50" },
      { id: "txistorra", nombre: "Txistorra", precio: "9,50" },
      { id: "pan", nombre: "Pan", nota: "Ración", precio: "0,50" },
    ],
  },
  {
    id: "principales", nombre: "Principales",
    platos: [
      { id: "costilla", nombre: "Costilla a la BBQ", nota: "Con puré de patata", precio: "22,00" },
      { id: "cachopo", nombre: "Cachopo de ternera", nota: "Con patatas y pimientos", precio: "21,00" },
      { id: "pilpil", nombre: "Bacalao al pil-pil", precio: "24,00" },
      { id: "bizkaina", nombre: "Bacalao a la bizkaina", precio: "24,00" },
      { id: "rodaballo", nombre: "Rodaballo", precio: "64,00", unidad: "/ kg" },
      { id: "sapito", nombre: "Sapito", precio: "24,00", unidad: "/ ud." },
    ],
  },
  {
    id: "arroces", nombre: "Arroces",
    platos: [
      { id: "arroz-bogavante", nombre: "Arroz con bogavante", nota: "Por encargo", precio: "28,00", unidad: "/ persona", destacado: true },
    ],
  },
];

KR.vinos = [
  { grupo: "Vermut y aperitivo", items: ["Miró Rojo", "Miró Blanco", "Miró Rojo Reserva", "Soho Spritz"] },
  { grupo: "Blancos", items: ["Gorka Izagirre · Txakoli", "La Charla · Verdejo", "Raimat · Chardonnay", "Raimat · Godello", "A Veira do Mar · Albariño", "Viña Pomal · Blanco"] },
  { grupo: "Tintos", items: ["Viña Pomal · Crianza", "Legaris Roble · Ribera del Duero"] },
  { grupo: "Rosados", items: ["Viña Pomal · Rioja", "Señorío de Sarria · Navarra"] },
];

KR.menuDiaDefault = {
  precio: "22",
  aperitivo: "Aperitivo de la casa",
  primeros: [
    "Ensalada de ventresca con mayonesa de anchoa",
    "Berenjena rellena de carne y verduritas sobre crema de verduras",
    "Pasta fresca a la carbonara",
  ],
  segundos: [
    "Pimientos rellenos de bacalao a la bizkaina",
    "Cachopo de pollo con pimientos y patatas",
    "Sukalki de ternera",
  ],
  postres: ["Selección de helados", "Trifle de queso", "Smoothie de frutas"],
  incluye: "Incluye pan y agua · IVA incluido",
};

KR.eventosDefault = [
  {
    id: "ev-sunset", titulo: "Sunset Session", cat: "musica",
    fecha: "2026-11-21", hora: "18:00",
    texto: "DJ en la campa, vermut y picoteo mientras el sol cae sobre el Cantábrico.",
    img: "assets/img/p0402-sm.jpg",
  },
  {
    id: "ev-txakoli", titulo: "Noche de txakoli y pintxos", cat: "gastro",
    fecha: "2026-11-27", hora: "20:30",
    texto: "Gorka Izagirre por copas y pintxos de la casa en barra.",
    img: "assets/img/p0400-sm.jpg",
  },
  {
    id: "ev-vermut", titulo: "Domingo de vermut con directo", cat: "musica",
    fecha: "2026-11-29", hora: "12:30",
    texto: "Vermut Miró, música acústica y la terraza abierta si el tiempo acompaña.",
    img: "assets/img/p0353-sm.jpg",
  },
  {
    id: "ev-bogavante", titulo: "Mesa larga de arroz con bogavante", cat: "gastro",
    fecha: "2026-12-05", hora: "14:00",
    texto: "Una mesa compartida frente al mar con nuestro arroz con bogavante. Plazas limitadas.",
    img: "assets/img/p0354-sm.jpg",
  },
  {
    id: "ev-empresa", titulo: "Comidas y cenas de empresa", cat: "grupos",
    fecha: "2026-12-12", hora: "13:30",
    texto: "Menús de grupo para Navidad en una sala para 150 personas. Reserva tu fecha.",
    img: "assets/img/p0396-sm.jpg",
  },
  {
    id: "ev-nochevieja", titulo: "Nochevieja en Konba Rika", cat: "fiesta",
    fecha: "2026-12-31", hora: "21:00",
    texto: "Cena, uvas con vistas al mar y fiesta hasta tarde.",
    img: "assets/img/p0373-sm.jpg",
  },
];

KR.categorias = {
  musica: "Música",
  gastro: "Gastronomía",
  grupos: "Grupos",
  fiesta: "Fiesta",
};

/* ---- Almacenamiento local (demo del panel de equipo) ---- */
KR.store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem("kr-" + key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem("kr-" + key, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  },
  del(key) { try { localStorage.removeItem("kr-" + key); } catch (e) {} },
};

KR.getEventos = function () {
  const extra = KR.store.get("eventos", []);
  const ocultos = KR.store.get("eventos-ocultos", []);
  return KR.eventosDefault
    .filter((e) => !ocultos.includes(e.id))
    .concat(extra)
    .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
};

KR.getMenuDia = function () { return KR.store.get("menu-dia", KR.menuDiaDefault); };
KR.getAgotados = function () { return KR.store.get("agotados", []); };

KR.fmtFecha = function (iso) {
  const d = new Date(iso + "T12:00:00");
  const dias = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return { dia: d.getDate(), mes: meses[d.getMonth()], semana: dias[d.getDay()] };
};

KR.esc = function (s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
};
