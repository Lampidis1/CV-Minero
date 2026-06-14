import React, { useState, useMemo, useEffect } from "react";
import {
  QrCode, Upload, Camera, Building2, ShieldCheck, User, ArrowRight, ArrowLeft,
  CheckCircle2, AlertTriangle, FileText, Sparkles, Download, Search, ScanLine,
  ClipboardList, BarChart3, Users, Briefcase, Send, Eye, MapPin, Clock,
  Plus, X, ChevronRight, Activity, Award, Truck, GraduationCap, Hash, Loader2
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from "recharts";

/* ============================== MARCA AMSA ============================== */
const C = {
  teal: "#00A399", tealDk: "#006973", tealLt: "#E4F6F5",
  gold: "#F2A900", dark: "#1C2632", gray: "#5F6973", grayLt: "#D7DEE4",
  white: "#FFFFFF", bg: "#F4F7F8",
};

/* ============================== DATA SEED ============================== */
const COMUNAS = ["Antofagasta", "Sierra Gorda", "Mejillones", "Calama", "Baquedano", "María Elena"];
const LIC = ["B", "C", "D", "A2", "A4", "A5"];
const CERTS = ["Trabajo en altura", "Bloqueo y etiquetado", "Espacios confinados", "Manejo defensivo", "Riesgo eléctrico", "Izaje y rigging"];
const EQUIPOS = ["Cargador frontal", "Camión tolva", "Retroexcavadora", "Grúa horquilla", "Bulldozer", "Camión aljibe"];

const seedPostulantes = [
  {
    id: "P-1001", nombre: "Juan Pérez Soto", rut: "15.482.901-2", telefono: "+56 9 8421 5530",
    correo: "juan.perez@mail.cl", comuna: "Sierra Gorda", localidad: "Sierra Gorda pueblo",
    disponibilidad: "Inmediata", perfil: "Ayudante de mantención con experiencia en faena minera y disponibilidad para turno 7x7.",
    expMinera: "3 años en faena (mantención mecánica, apoyo a cuadrillas)",
    expGeneral: "5 años (construcción, bodega)", oficio: "Mantención mecánica",
    licencias: ["B", "D"], certificaciones: ["Trabajo en altura"], cursos: ["Inducción minera", "Primeros auxilios"],
    equipos: ["Grúa horquilla"], educacion: "Técnico Nivel Medio", turno: "7x7 / 4x3",
    cargosSugeridos: ["Ayudante de mantención", "Bodeguero faena"], estado: "CV Minero generado", qr: true,
  },
  {
    id: "P-1002", nombre: "Carla Muñoz Díaz", rut: "18.220.114-9", telefono: "+56 9 7711 0042",
    correo: "carla.munoz@mail.cl", comuna: "Antofagasta", localidad: "Antofagasta",
    disponibilidad: "15 días", perfil: "Operadora de equipos con licencia A4 y certificación de bloqueo.",
    expMinera: "4 años operación camión tolva", expGeneral: "2 años logística",
    oficio: "Operadora de equipos pesados", licencias: ["A4", "B"], certificaciones: ["Bloqueo y etiquetado", "Manejo defensivo"],
    cursos: ["Operación camión CAEX"], equipos: ["Camión tolva", "Cargador frontal"], educacion: "Enseñanza Media completa",
    turno: "14x14", cargosSugeridos: ["Operador equipo pesado"], estado: "CV Minero generado", qr: true,
  },
  {
    id: "P-1003", nombre: "Rodrigo Tapia León", rut: "12.998.450-1", telefono: "+56 9 9032 7781",
    correo: "rodrigo.tapia@mail.cl", comuna: "Baquedano", localidad: "Baquedano",
    disponibilidad: "Inmediata", perfil: "Eléctrico industrial con experiencia en faena y riesgo eléctrico.",
    expMinera: "6 años eléctrico de terreno", expGeneral: "8 años total",
    oficio: "Electricidad industrial", licencias: ["B"], certificaciones: ["Riesgo eléctrico", "Trabajo en altura", "Espacios confinados"],
    cursos: ["SEC clase B"], equipos: [], educacion: "Técnico Profesional", turno: "5x2 / 7x7",
    cargosSugeridos: ["Eléctrico de mantención"], estado: "CV Minero generado", qr: true,
  },
];

const seedEmpresas = [
  {
    id: "E-01", nombre: "Servicios Mineros Atacama SpA", rut: "76.412.880-4", contacto: "reclutamiento@smatacama.cl",
    stand: "A-12", rubro: "Mantención y servicios",
    cargos: [
      {
        id: "C-01", nombre: "Ayudante de Mantención", descripcion: "Apoyo a cuadrillas de mantención mecánica en faena.",
        reqMin: ["Experiencia en faena", "Licencia B"], reqDes: ["Curso de bloqueo"], licencias: ["B"],
        certificaciones: ["Trabajo en altura"], expMin: "2 años", turno: "7x7", lugar: "Faena Centinela", vacantes: 4,
      },
      {
        id: "C-02", nombre: "Operador Equipo Pesado", descripcion: "Operación de camión tolva y cargador frontal.",
        reqMin: ["Licencia A4", "Experiencia operación"], reqDes: ["Manejo defensivo"], licencias: ["A4"],
        certificaciones: ["Bloqueo y etiquetado"], expMin: "3 años", turno: "14x14", lugar: "Faena Centinela", vacantes: 6,
      },
    ],
  },
  {
    id: "E-02", nombre: "Eléctrica Norte Grande Ltda.", rut: "77.105.220-9", contacto: "rrhh@electricang.cl",
    stand: "B-05", rubro: "Servicios eléctricos",
    cargos: [
      {
        id: "C-03", nombre: "Eléctrico de Mantención", descripcion: "Mantención eléctrica industrial de terreno.",
        reqMin: ["Riesgo eléctrico", "Experiencia industrial"], reqDes: ["Espacios confinados"], licencias: ["B"],
        certificaciones: ["Riesgo eléctrico"], expMin: "4 años", turno: "7x7", lugar: "Faena Centinela", vacantes: 2,
      },
    ],
  },
];

/* ============================== MATCHING ============================== */
function computeMatch(p, cargo) {
  let score = 40, cumple = [], brechas = [];
  // Licencias
  const licReq = cargo.licencias || [];
  if (licReq.length) {
    const ok = licReq.filter((l) => p.licencias.includes(l));
    if (ok.length === licReq.length) { score += 20; cumple.push(`Licencia ${licReq.join(", ")}`); }
    else if (ok.length) { score += 8; cumple.push(`Licencia ${ok.join(", ")}`); brechas.push(`Falta licencia ${licReq.filter((l) => !ok.includes(l)).join(", ")}`); }
    else brechas.push(`Sin licencia ${licReq.join(", ")}`);
  }
  // Certificaciones
  const certReq = cargo.certificaciones || [];
  if (certReq.length) {
    const ok = certReq.filter((c) => p.certificaciones.includes(c));
    if (ok.length === certReq.length) { score += 18; cumple.push(`Certificación ${certReq.join(", ")}`); }
    else if (ok.length) { score += 8; cumple.push(`Certificación ${ok.join(", ")}`); brechas.push(`Falta ${certReq.filter((c) => !ok.includes(c)).join(", ")}`); }
    else brechas.push(`Falta certificación ${certReq.join(", ")}`);
  }
  // Requisitos deseables -> brechas si no hay match con certs/cursos
  (cargo.reqDes || []).forEach((r) => {
    const has = [...p.certificaciones, ...p.cursos].some((x) => x.toLowerCase().includes(r.toLowerCase().split(" ")[0]));
    if (!has) brechas.push(`No declara: ${r}`);
  });
  // Experiencia minera
  if (/min|faena/i.test(p.expMinera)) { score += 12; cumple.push("Experiencia en faena minera"); }
  else brechas.push("Sin experiencia minera declarada");
  // Cercanía territorial
  const local = ["Sierra Gorda", "Baquedano", "Calama"];
  if (local.includes(p.comuna)) { score += 6; cumple.push(`Residencia local (${p.comuna})`); }
  // Disponibilidad
  if (/inmediata/i.test(p.disponibilidad)) { score += 4; cumple.push("Disponibilidad inmediata"); }
  score = Math.max(20, Math.min(98, score));
  return { score, cumple, brechas };
}
const matchColor = (s) => (s >= 75 ? C.teal : s >= 55 ? C.gold : C.gray);

/* ============================== PSEUDO-QR ============================== */
function PseudoQR({ seed = "X", size = 150 }) {
  const N = 21;
  const cells = useMemo(() => {
    let h = 0; for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    const rnd = () => { h = (h * 1103515245 + 12345) >>> 0; return (h >>> 16) & 1; };
    const g = Array.from({ length: N }, () => Array.from({ length: N }, () => rnd()));
    const finder = (r, c) => { for (let i = -1; i <= 7; i++) for (let j = -1; j <= 7; j++) { const rr = r + i, cc = c + j; if (rr < 0 || cc < 0 || rr >= N || cc >= N) continue; const onB = i >= 0 && i <= 6 && j >= 0 && j <= 6; const ring = i === 0 || i === 6 || j === 0 || j === 6; const core = i >= 2 && i <= 4 && j >= 2 && j <= 4; g[rr][cc] = onB ? (ring || core ? 1 : 0) : 0; } };
    finder(0, 0); finder(0, N - 7); finder(N - 7, 0);
    return g;
  }, [seed]);
  const u = size / N;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: 8, background: "#fff" }}>
      {cells.map((row, r) => row.map((v, c) => v ? <rect key={`${r}-${c}`} x={c * u} y={r * u} width={u} height={u} fill={C.dark} /> : null))}
    </svg>
  );
}

/* ============================== UI PRIMITIVES ============================== */
const font = "'Barlow', system-ui, sans-serif";
const fontC = "'Barlow Condensed', system-ui, sans-serif";

function Tag({ children, color = C.tealDk, bg = C.tealLt }) {
  return <span style={{ fontFamily: fontC, fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color, background: bg, padding: "3px 9px", borderRadius: 4 }}>{children}</span>;
}
function Card({ children, style, onClick }) {
  return <div onClick={onClick} style={{ background: "#fff", border: `1px solid ${C.grayLt}`, borderRadius: 12, padding: 18, ...style, cursor: onClick ? "pointer" : "default" }}>{children}</div>;
}
function Btn({ children, onClick, variant = "primary", disabled, style }) {
  const v = {
    primary: { background: C.teal, color: "#fff", border: "none" },
    dark: { background: C.tealDk, color: "#fff", border: "none" },
    gold: { background: C.gold, color: C.dark, border: "none" },
    ghost: { background: "#fff", color: C.tealDk, border: `1px solid ${C.grayLt}` },
  }[variant];
  return <button onClick={onClick} disabled={disabled} style={{ fontFamily: font, fontWeight: 600, fontSize: 14, padding: "10px 16px", borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1, display: "inline-flex", alignItems: "center", gap: 8, ...v, ...style }}>{children}</button>;
}
function Field({ label, value, onChange, placeholder, options }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <span style={{ fontFamily: fontC, fontWeight: 600, fontSize: 12, letterSpacing: 0.5, textTransform: "uppercase", color: C.gray }}>{label}</span>
      {options ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", marginTop: 4, padding: "9px 10px", borderRadius: 8, border: `1px solid ${C.grayLt}`, fontFamily: font, fontSize: 14, color: C.dark, background: "#fff" }}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", marginTop: 4, padding: "9px 10px", borderRadius: 8, border: `1px solid ${C.grayLt}`, fontFamily: font, fontSize: 14, color: C.dark, boxSizing: "border-box" }} />
      )}
    </label>
  );
}
function Chips({ items, color = C.tealDk, bg = C.tealLt }) {
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{(items || []).map((i, k) => <span key={k} style={{ fontFamily: font, fontSize: 12, color, background: bg, padding: "3px 9px", borderRadius: 20 }}>{i}</span>)}</div>;
}

/* ============================== APP ============================== */
export default function App() {
  const [role, setRole] = useState(null); // null | postulante | empresa | admin
  const [postulantes, setPostulantes] = useState(seedPostulantes);
  const [empresas, setEmpresas] = useState(seedEmpresas);
  const [postulaciones, setPostulaciones] = useState([
    { id: "AP-1", postulanteId: "P-1001", cargoId: "C-01", estado: "Preseleccionado" },
    { id: "AP-2", postulanteId: "P-1002", cargoId: "C-02", estado: "Revisado por empresa" },
  ]);
  const [eventos, setEventos] = useState([
    { id: 1, tipo: "Postulante registrado", actor: "Juan Pérez", detalle: "P-1001", ts: "09:02" },
    { id: 2, tipo: "QR generado", actor: "Carla Muñoz", detalle: "P-1002", ts: "09:14" },
  ]);
  const log = (tipo, actor, detalle) =>
    setEventos((e) => [{ id: e.length + 1, tipo, actor, detalle, ts: new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }) }, ...e]);

  const allCargos = useMemo(() => empresas.flatMap((e) => e.cargos.map((c) => ({ ...c, empresaId: e.id, empresaNombre: e.nombre, stand: e.stand }))), [empresas]);

  const shared = { postulantes, setPostulantes, empresas, setEmpresas, postulaciones, setPostulaciones, eventos, log, allCargos, setRole };

  return (
    <div style={{ fontFamily: font, background: C.bg, minHeight: "100vh", color: C.dark }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Barlow:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box} ::-webkit-scrollbar{width:8px;height:8px} ::-webkit-scrollbar-thumb{background:${C.grayLt};border-radius:8px}`}</style>
      <TopBar role={role} setRole={setRole} />
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "22px 18px 60px" }}>
        {!role && <Landing setRole={setRole} />}
        {role === "postulante" && <Postulante {...shared} />}
        {role === "empresa" && <Empresa {...shared} />}
        {role === "admin" && <Admin {...shared} />}
      </div>
    </div>
  );
}

function TopBar({ role, setRole }) {
  return (
    <div style={{ background: C.tealDk, color: "#fff", padding: "12px 18px", position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setRole(null)}>
        <div style={{ background: C.teal, width: 34, height: 34, borderRadius: 8, display: "grid", placeItems: "center" }}><QrCode size={20} color="#fff" /></div>
        <div>
          <div style={{ fontFamily: fontC, fontWeight: 800, fontSize: 18, lineHeight: 1 }}>CV MINERO QR</div>
          <div style={{ fontSize: 10, opacity: 0.8, letterSpacing: 0.4 }}>Apresto laboral con IA · Ferias mineras</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {role && <Tag color="#fff" bg={C.teal}>{role}</Tag>}
        <span style={{ fontFamily: fontC, fontWeight: 700, fontSize: 12, opacity: 0.85, letterSpacing: 0.5 }}>ANTOFAGASTA MINERALS</span>
      </div>
    </div>
  );
}

/* ============================== LANDING ============================== */
function Landing({ setRole }) {
  const roles = [
    { k: "postulante", Icon: User, t: "Soy postulante", d: "Carga tu CV, genera tu Currículum Minero y tu QR para postular en stands.", v: "primary" },
    { k: "empresa", Icon: Building2, t: "Soy empresa", d: "Publica cargos, revisa candidatos compatibles y descarga tu base.", v: "dark" },
    { k: "admin", Icon: ShieldCheck, t: "Soy administrador", d: "Trazabilidad de la feria, indicadores y exportación de bases.", v: "gold" },
  ];
  return (
    <div>
      <div style={{ background: "#fff", border: `1px solid ${C.grayLt}`, borderRadius: 16, padding: "34px 30px", position: "relative", overflow: "hidden", marginBottom: 22 }}>
        <div style={{ position: "absolute", right: -40, top: -40, width: 220, height: 220, background: C.tealLt, transform: "rotate(20deg)", borderRadius: 30 }} />
        <div style={{ position: "relative" }}>
          <Tag>Digitalización inteligente de currículums</Tag>
          <h1 style={{ fontFamily: fontC, fontWeight: 800, fontSize: 46, lineHeight: 1.02, margin: "12px 0 8px", maxWidth: 620 }}>
            Del CV físico al <span style={{ color: C.teal }}>perfil minero trazable</span>
          </h1>
          <p style={{ color: C.gray, fontSize: 16, maxWidth: 560, margin: 0 }}>
            La persona escanea o carga su CV, la IA lo convierte en un Currículum Minero estándar y genera un QR único reutilizable en ferias laborales.
          </p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
        {roles.map(({ k, Icon, t, d, v }) => (
          <Card key={k} onClick={() => setRole(k)} style={{ display: "flex", flexDirection: "column", gap: 12, transition: "transform .15s", minHeight: 190 }}>
            <div style={{ width: 46, height: 46, borderRadius: 10, background: C.tealLt, display: "grid", placeItems: "center" }}><Icon size={24} color={C.tealDk} /></div>
            <div style={{ fontFamily: fontC, fontWeight: 700, fontSize: 22 }}>{t}</div>
            <div style={{ color: C.gray, fontSize: 14, flex: 1 }}>{d}</div>
            <Btn variant={v}>Entrar <ArrowRight size={16} /></Btn>
          </Card>
        ))}
      </div>
      <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
        {[["100%", "CV en formato estándar"], ["QR", "Perfil reutilizable"], ["360°", "Trazabilidad de feria"], ["Excel", "Bases por empresa"]].map(([n, l]) => (
          <Card key={l} style={{ textAlign: "center", padding: 14 }}>
            <div style={{ fontFamily: fontC, fontWeight: 800, fontSize: 30, color: C.teal }}>{n}</div>
            <div style={{ fontSize: 12, color: C.gray }}>{l}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================== POSTULANTE ============================== */
function Postulante(props) {
  const { setPostulantes, log, allCargos, postulaciones, setPostulaciones, setRole } = props;
  const [step, setStep] = useState(0); // 0 reg, 1 upload, 2 cv minero, 3 qr, 4 cargos
  const [form, setForm] = useState({ nombre: "", rut: "", telefono: "", correo: "", comuna: "Sierra Gorda", localidad: "", disponibilidad: "Inmediata", consent: false });
  const [scanning, setScanning] = useState(false);
  const [cv, setCv] = useState(null);
  const [myApps, setMyApps] = useState([]);

  const steps = ["Registro", "Cargar CV", "Currículum Minero", "QR laboral", "Cargos"];

  const startScan = () => {
    setScanning(true);
    setTimeout(() => {
      const extracted = {
        id: "P-" + Math.floor(2000 + Math.random() * 7000),
        ...form, perfil: "Mantención mecánica con experiencia en faena minera y disponibilidad para turno rotativo.",
        expMinera: "3 años en faena (apoyo a cuadrillas de mantención)", expGeneral: "5 años (construcción y bodega)",
        oficio: "Mantención mecánica", licencias: ["B", "D"], certificaciones: ["Trabajo en altura"],
        cursos: ["Inducción minera", "Primeros auxilios"], equipos: ["Grúa horquilla"], educacion: "Técnico Nivel Medio",
        turno: "7x7 / 4x3", cargosSugeridos: ["Ayudante de mantención", "Bodeguero faena"], estado: "CV Minero generado", qr: true,
      };
      setCv(extracted); setScanning(false); setStep(2);
      log("CV cargado", form.nombre, "Lectura IA");
    }, 2200);
  };

  const confirmCV = () => {
    setPostulantes((p) => [...p, cv]);
    log("CV Minero generado", cv.nombre, cv.id);
    log("QR generado", cv.nombre, cv.id);
    setStep(3);
  };

  const recomendados = useMemo(() => {
    if (!cv) return [];
    return allCargos.map((c) => ({ ...c, m: computeMatch(cv, c) })).sort((a, b) => b.m.score - a.m.score);
  }, [cv, allCargos]);

  const aplicar = (cargo) => {
    if (myApps.includes(cargo.id)) return;
    setMyApps((a) => [...a, cargo.id]);
    setPostulaciones((p) => [...p, { id: "AP-" + (p.length + 1), postulanteId: cv.id, cargoId: cargo.id, estado: "Postulado" }]);
    log("Postulante postuló a cargo", cv.nombre, `${cargo.nombre} · ${cargo.empresaNombre}`);
  };

  return (
    <div>
      <Stepper steps={steps} active={step} />
      {step === 0 && (
        <Card>
          <h2 style={hStyle}>Registro de postulante</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>
            <Field label="Nombre completo" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} placeholder="Ej: Juan Pérez Soto" />
            <Field label="RUT (opcional)" value={form.rut} onChange={(v) => setForm({ ...form, rut: v })} placeholder="12.345.678-9" />
            <Field label="Teléfono" value={form.telefono} onChange={(v) => setForm({ ...form, telefono: v })} placeholder="+56 9 ..." />
            <Field label="Correo" value={form.correo} onChange={(v) => setForm({ ...form, correo: v })} placeholder="correo@mail.cl" />
            <Field label="Comuna" value={form.comuna} onChange={(v) => setForm({ ...form, comuna: v })} options={COMUNAS} />
            <Field label="Localidad" value={form.localidad} onChange={(v) => setForm({ ...form, localidad: v })} placeholder="Ej: Sierra Gorda pueblo" />
            <Field label="Disponibilidad" value={form.disponibilidad} onChange={(v) => setForm({ ...form, disponibilidad: v })} options={["Inmediata", "15 días", "30 días"]} />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, margin: "6px 0 16px", fontSize: 13, color: C.gray }}>
            <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} />
            Autorizo el uso de mis datos para fines de la feria laboral.
          </label>
          <Btn disabled={!form.nombre || !form.consent} onClick={() => setStep(1)}>Continuar <ArrowRight size={16} /></Btn>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <h2 style={hStyle}>Cargar o escanear tu CV</h2>
          <p style={{ color: C.gray, marginTop: 0 }}>Sube tu CV en PDF, Word, JPG o PNG, o usa la cámara del teléfono.</p>
          {!scanning ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <button onClick={startScan} style={dropStyle}><Upload size={28} color={C.teal} /><span style={{ fontWeight: 600 }}>Subir archivo</span><span style={{ fontSize: 12, color: C.gray }}>PDF · Word · JPG · PNG</span></button>
              <button onClick={startScan} style={dropStyle}><Camera size={28} color={C.teal} /><span style={{ fontWeight: 600 }}>Escanear con cámara</span><span style={{ fontSize: 12, color: C.gray }}>Simulación de captura</span></button>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Loader2 size={42} color={C.teal} style={{ animation: "spin 1s linear infinite" }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <div style={{ fontFamily: fontC, fontWeight: 700, fontSize: 22, marginTop: 14 }}>Leyendo CV con IA…</div>
              <div style={{ color: C.gray, fontSize: 14 }}>OCR + extracción de experiencia, licencias y cursos</div>
            </div>
          )}
          <div style={{ marginTop: 16 }}><Btn variant="ghost" onClick={() => setStep(0)}><ArrowLeft size={16} /> Volver</Btn></div>
        </Card>
      )}

      {step === 2 && cv && (
        <div>
          <Card style={{ marginBottom: 16, background: C.tealLt, border: `1px solid ${C.teal}` }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Sparkles size={20} color={C.tealDk} />
              <div><b>Lectura completada.</b> <span style={{ color: C.gray }}>Revisa y valida tu Currículum Minero antes de publicarlo.</span></div>
            </div>
          </Card>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: 8 }}>
              <div>
                <Tag>Currículum Minero</Tag>
                <h2 style={{ ...hStyle, marginTop: 8 }}>{cv.nombre || "Postulante"}</h2>
                <div style={{ color: C.gray, fontSize: 13 }}>{cv.id} · {cv.comuna} · {cv.disponibilidad}</div>
              </div>
              <FileText size={28} color={C.grayLt} />
            </div>
            <p style={{ background: C.bg, borderLeft: `3px solid ${C.teal}`, padding: "10px 12px", borderRadius: 6, color: C.dark, fontSize: 14 }}>{cv.perfil}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 22px" }}>
              <Detail Icon={Activity} t="Experiencia minera" v={cv.expMinera} />
              <Detail Icon={Briefcase} t="Experiencia general" v={cv.expGeneral} />
              <Detail Icon={Award} t="Oficio / especialidad" v={cv.oficio} />
              <Detail Icon={GraduationCap} t="Nivel educacional" v={cv.educacion} />
              <Detail Icon={Clock} t="Disponibilidad de turno" v={cv.turno} />
              <Detail Icon={MapPin} t="Comuna / localidad" v={`${cv.comuna} · ${cv.localidad || "—"}`} />
            </div>
            <Block t="Licencias de conducir"><Chips items={cv.licencias} /></Block>
            <Block t="Certificaciones"><Chips items={cv.certificaciones} color={C.dark} bg="#FCEFC7" /></Block>
            <Block t="Cursos"><Chips items={cv.cursos} /></Block>
            <Block t="Equipos / maquinaria"><Chips items={cv.equipos.length ? cv.equipos : ["—"]} /></Block>
            <Block t="Cargos sugeridos"><Chips items={cv.cargosSugeridos} color="#fff" bg={C.teal} /></Block>
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <Btn onClick={confirmCV}><CheckCircle2 size={16} /> Validar y generar QR</Btn>
              <Btn variant="ghost" onClick={() => setStep(1)}>Volver a cargar</Btn>
            </div>
          </Card>
        </div>
      )}

      {step === 3 && cv && (
        <Card style={{ textAlign: "center" }}>
          <Tag>QR laboral generado</Tag>
          <h2 style={{ ...hStyle, marginTop: 10 }}>{cv.nombre}</h2>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.teal, fontWeight: 600, fontSize: 14, marginBottom: 14 }}><CheckCircle2 size={16} /> CV Minero generado</div>
          <div style={{ display: "grid", placeItems: "center", marginBottom: 8 }}>
            <div style={{ padding: 14, border: `1px solid ${C.grayLt}`, borderRadius: 14, background: "#fff" }}><PseudoQR seed={cv.id} size={170} /></div>
          </div>
          <div style={{ fontSize: 12, color: C.gray, marginBottom: 16 }}><Hash size={12} style={{ verticalAlign: "middle" }} /> Identificador seguro {cv.id} · no expone datos personales directamente</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn variant="ghost"><Download size={16} /> Descargar QR</Btn>
            <Btn onClick={() => setStep(4)}>Ver cargos recomendados <ArrowRight size={16} /></Btn>
          </div>
        </Card>
      )}

      {step === 4 && cv && (
        <div>
          <h2 style={hStyle}>Cargos recomendados para ti</h2>
          <p style={{ color: C.gray, marginTop: 0 }}>Ordenados por Índice de Compatibilidad Laboral. Puedes postular a uno o varios.</p>
          <div style={{ display: "grid", gap: 14 }}>
            {recomendados.map((c) => {
              const aplicado = myApps.includes(c.id);
              return (
                <Card key={c.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 240 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontFamily: fontC, fontWeight: 700, fontSize: 20 }}>{c.nombre}</span>
                        <Tag color={C.gray} bg={C.bg}>Stand {c.stand}</Tag>
                      </div>
                      <div style={{ color: C.gray, fontSize: 13, marginBottom: 8 }}>{c.empresaNombre} · {c.lugar} · {c.turno} · {c.vacantes} vacantes</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                        <MatchList Icon={CheckCircle2} color={C.teal} t="Cumple" items={c.m.cumple} />
                        <MatchList Icon={AlertTriangle} color={C.gold} t="Brechas" items={c.m.brechas} />
                      </div>
                    </div>
                    <div style={{ textAlign: "center", minWidth: 120 }}>
                      <Gauge value={c.m.score} />
                      <Btn variant={aplicado ? "ghost" : "primary"} disabled={aplicado} onClick={() => aplicar(c)} style={{ marginTop: 10, width: "100%", justifyContent: "center" }}>
                        {aplicado ? <><CheckCircle2 size={16} /> Postulado</> : <><Send size={16} /> Postular</>}
                      </Btn>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          {myApps.length > 0 && (
            <Card style={{ marginTop: 16, background: C.tealLt }}>
              <b>Tus postulaciones ({myApps.length})</b>
              <div style={{ color: C.gray, fontSize: 13, marginTop: 4 }}>Estado inicial: <b>Postulado</b>. Las empresas revisan y actualizan tu estado desde su panel.</div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================== EMPRESA ============================== */
function Empresa(props) {
  const { empresas, setEmpresas, postulantes, postulaciones, setPostulaciones, log } = props;
  const [logged, setLogged] = useState(null);
  const [tab, setTab] = useState("cargos");

  if (!logged) {
    return (
      <Card style={{ maxWidth: 460, margin: "0 auto" }}>
        <h2 style={hStyle}>Iniciar sesión empresa</h2>
        <p style={{ color: C.gray, marginTop: 0, fontSize: 14 }}>Selecciona tu empresa participante (demo).</p>
        {empresas.map((e) => (
          <button key={e.id} onClick={() => setLogged(e.id)} style={{ ...dropStyle, flexDirection: "row", justifyContent: "space-between", marginBottom: 10, padding: "14px 16px", alignItems: "center" }}>
            <div style={{ textAlign: "left" }}><div style={{ fontWeight: 600 }}>{e.nombre}</div><div style={{ fontSize: 12, color: C.gray }}>Stand {e.stand} · {e.rubro}</div></div>
            <ChevronRight size={18} color={C.teal} />
          </button>
        ))}
      </Card>
    );
  }

  const emp = empresas.find((e) => e.id === logged);
  const tabs = [["cargos", "Cargos", Briefcase], ["candidatos", "Candidatos compatibles", Users], ["scan", "Escaneo en stand", ScanLine], ["base", "Mi base", Download]];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div><h2 style={{ ...hStyle, margin: 0 }}>{emp.nombre}</h2><div style={{ color: C.gray, fontSize: 13 }}>Stand {emp.stand} · {emp.rut} · {emp.rubro}</div></div>
        <Btn variant="ghost" onClick={() => setLogged(null)}>Cambiar empresa</Btn>
      </div>
      <Tabs tabs={tabs} tab={tab} setTab={setTab} />
      {tab === "cargos" && <EmpresaCargos emp={emp} empresas={empresas} setEmpresas={setEmpresas} log={log} />}
      {tab === "candidatos" && <EmpresaCandidatos emp={emp} postulantes={postulantes} />}
      {tab === "scan" && <EmpresaScan emp={emp} postulantes={postulantes} postulaciones={postulaciones} setPostulaciones={setPostulaciones} log={log} />}
      {tab === "base" && <EmpresaBase emp={emp} postulantes={postulantes} postulaciones={postulaciones} log={log} />}
    </div>
  );
}

function EmpresaCargos({ emp, empresas, setEmpresas, log }) {
  const [open, setOpen] = useState(false);
  const [c, setC] = useState({ nombre: "", descripcion: "", reqMin: "", reqDes: "", licencias: "", certificaciones: "", expMin: "2 años", turno: "7x7", lugar: "Faena Centinela", vacantes: 1 });
  const add = () => {
    const nuevo = {
      id: "C-" + Math.floor(100 + Math.random() * 900), nombre: c.nombre, descripcion: c.descripcion,
      reqMin: c.reqMin.split(",").map((x) => x.trim()).filter(Boolean), reqDes: c.reqDes.split(",").map((x) => x.trim()).filter(Boolean),
      licencias: c.licencias.split(",").map((x) => x.trim()).filter(Boolean), certificaciones: c.certificaciones.split(",").map((x) => x.trim()).filter(Boolean),
      expMin: c.expMin, turno: c.turno, lugar: c.lugar, vacantes: Number(c.vacantes) || 1,
    };
    setEmpresas((es) => es.map((e) => e.id === emp.id ? { ...e, cargos: [...e.cargos, nuevo] } : e));
    log("Cargo creado", emp.nombre, nuevo.nombre);
    setOpen(false); setC({ nombre: "", descripcion: "", reqMin: "", reqDes: "", licencias: "", certificaciones: "", expMin: "2 años", turno: "7x7", lugar: "Faena Centinela", vacantes: 1 });
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ color: C.gray, fontSize: 14 }}>{emp.cargos.length} cargos publicados</span>
        <Btn onClick={() => setOpen(!open)}>{open ? <X size={16} /> : <Plus size={16} />} {open ? "Cerrar" : "Nuevo cargo"}</Btn>
      </div>
      {open && (
        <Card style={{ marginBottom: 14, background: C.bg }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>
            <Field label="Nombre del cargo" value={c.nombre} onChange={(v) => setC({ ...c, nombre: v })} placeholder="Ej: Soldador 6G" />
            <Field label="Vacantes" value={c.vacantes} onChange={(v) => setC({ ...c, vacantes: v })} />
            <div style={{ gridColumn: "1 / -1" }}><Field label="Descripción" value={c.descripcion} onChange={(v) => setC({ ...c, descripcion: v })} /></div>
            <Field label="Requisitos mínimos (coma)" value={c.reqMin} onChange={(v) => setC({ ...c, reqMin: v })} placeholder="Experiencia en faena, Licencia B" />
            <Field label="Requisitos deseables (coma)" value={c.reqDes} onChange={(v) => setC({ ...c, reqDes: v })} placeholder="Curso de bloqueo" />
            <Field label="Licencias requeridas (coma)" value={c.licencias} onChange={(v) => setC({ ...c, licencias: v })} placeholder="B, A4" />
            <Field label="Certificaciones (coma)" value={c.certificaciones} onChange={(v) => setC({ ...c, certificaciones: v })} placeholder="Trabajo en altura" />
            <Field label="Experiencia mínima" value={c.expMin} onChange={(v) => setC({ ...c, expMin: v })} />
            <Field label="Turno" value={c.turno} onChange={(v) => setC({ ...c, turno: v })} options={["7x7", "14x14", "5x2", "4x3"]} />
            <Field label="Lugar de trabajo" value={c.lugar} onChange={(v) => setC({ ...c, lugar: v })} />
          </div>
          <Btn disabled={!c.nombre} onClick={add}><Plus size={16} /> Publicar cargo</Btn>
        </Card>
      )}
      <div style={{ display: "grid", gap: 12 }}>
        {emp.cargos.map((cg) => (
          <Card key={cg.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div><span style={{ fontFamily: fontC, fontWeight: 700, fontSize: 19 }}>{cg.nombre}</span><div style={{ color: C.gray, fontSize: 13 }}>{cg.descripcion}</div></div>
              <Tag color="#fff" bg={C.teal}>{cg.vacantes} vac.</Tag>
            </div>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 10, fontSize: 13 }}>
              <span><b>Turno:</b> {cg.turno}</span><span><b>Exp:</b> {cg.expMin}</span><span><b>Lugar:</b> {cg.lugar}</span>
            </div>
            <Block t="Requisitos mínimos"><Chips items={cg.reqMin} /></Block>
            {cg.certificaciones.length > 0 && <Block t="Certificaciones"><Chips items={cg.certificaciones} color={C.dark} bg="#FCEFC7" /></Block>}
          </Card>
        ))}
      </div>
    </div>
  );
}

function EmpresaCandidatos({ emp, postulantes }) {
  const ranked = useMemo(() => {
    return emp.cargos.map((cg) => ({
      cargo: cg,
      lista: postulantes.map((p) => ({ p, m: computeMatch(p, cg) })).sort((a, b) => b.m.score - a.m.score),
    }));
  }, [emp, postulantes]);
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {ranked.map(({ cargo, lista }) => (
        <Card key={cargo.id}>
          <div style={{ fontFamily: fontC, fontWeight: 700, fontSize: 19, marginBottom: 10 }}>{cargo.nombre} <span style={{ fontSize: 13, color: C.gray, fontFamily: font }}>· ranking por compatibilidad</span></div>
          {lista.map(({ p, m }) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: `1px solid ${C.bg}` }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: C.tealLt, display: "grid", placeItems: "center", color: C.tealDk, fontWeight: 700, fontFamily: fontC }}>{p.nombre.split(" ").map((x) => x[0]).slice(0, 2).join("")}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{p.nombre} <span style={{ color: C.gray, fontWeight: 400, fontSize: 12 }}>· {p.comuna} · {p.oficio}</span></div>
                <div style={{ fontSize: 12, color: C.gray }}>{m.cumple.slice(0, 2).join(" · ")}</div>
              </div>
              <BarScore value={m.score} />
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
}

function EmpresaScan({ emp, postulantes, postulaciones, setPostulaciones, log }) {
  const [scanning, setScanning] = useState(false);
  const [found, setFound] = useState(null);
  const [q, setQ] = useState("");
  const doScan = () => {
    setScanning(true);
    setTimeout(() => { const p = postulantes[Math.floor(Math.random() * postulantes.length)]; setFound(p); setScanning(false); log("Empresa escaneó QR", emp.nombre, p.id); }, 1400);
  };
  const buscar = () => { const p = postulantes.find((x) => x.id.toLowerCase() === q.toLowerCase().trim() || x.nombre.toLowerCase().includes(q.toLowerCase().trim())); if (p) { setFound(p); log("Empresa buscó postulante", emp.nombre, p.id); } };
  const setEstado = (estado) => {
    if (!found) return;
    const cargo = emp.cargos[0];
    setPostulaciones((ps) => {
      const ex = ps.find((x) => x.postulanteId === found.id && x.cargoId === cargo.id);
      if (ex) return ps.map((x) => x === ex ? { ...x, estado } : x);
      return [...ps, { id: "AP-" + (ps.length + 1), postulanteId: found.id, cargoId: cargo.id, estado }];
    });
    log("Empresa cambió estado del postulante", emp.nombre, `${found.nombre} → ${estado}`);
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16, alignItems: "start" }}>
      <Card style={{ textAlign: "center" }}>
        <h3 style={{ ...hStyle, fontSize: 20 }}>Escanear QR en stand</h3>
        <div onClick={doScan} style={{ cursor: "pointer", border: `2px dashed ${C.teal}`, borderRadius: 14, padding: 24, margin: "10px 0", background: C.tealLt }}>
          {scanning ? <Loader2 size={36} color={C.tealDk} style={{ animation: "spin 1s linear infinite" }} /> : <ScanLine size={42} color={C.tealDk} />}
          <div style={{ fontWeight: 600, marginTop: 8 }}>{scanning ? "Leyendo QR…" : "Tocar para escanear"}</div>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por ID o nombre" style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.grayLt}`, fontFamily: font, fontSize: 13 }} />
          <Btn variant="dark" onClick={buscar} style={{ padding: "8px 12px" }}><Search size={16} /></Btn>
        </div>
      </Card>
      <div>
        {!found ? <Card style={{ color: C.gray, textAlign: "center", padding: 40 }}>Escanea un QR o busca un postulante para ver su Currículum Minero.</Card> : (
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div><Tag>Currículum Minero</Tag><h3 style={{ ...hStyle, marginTop: 8, fontSize: 24 }}>{found.nombre}</h3><div style={{ color: C.gray, fontSize: 13 }}>{found.id} · {found.comuna} · {found.disponibilidad}</div></div>
              <PseudoQR seed={found.id} size={70} />
            </div>
            <p style={{ background: C.bg, borderLeft: `3px solid ${C.teal}`, padding: "10px 12px", borderRadius: 6, fontSize: 14 }}>{found.perfil}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>
              <Detail Icon={Activity} t="Experiencia minera" v={found.expMinera} />
              <Detail Icon={Award} t="Oficio" v={found.oficio} />
            </div>
            <Block t="Licencias"><Chips items={found.licencias} /></Block>
            <Block t="Certificaciones"><Chips items={found.certificaciones} color={C.dark} bg="#FCEFC7" /></Block>
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.bg}` }}>
              <div style={{ fontFamily: fontC, fontWeight: 600, fontSize: 13, textTransform: "uppercase", color: C.gray, marginBottom: 8 }}>Asociar a cargo · {emp.cargos[0]?.nombre} · marcar estado</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Revisado por empresa", "Preseleccionado", "No seleccionado"].map((s) => <Btn key={s} variant="ghost" onClick={() => setEstado(s)}>{s}</Btn>)}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function EmpresaBase({ emp, postulantes, postulaciones, log }) {
  const rows = useMemo(() => {
    const cargoIds = emp.cargos.map((c) => c.id);
    return postulaciones.filter((ap) => cargoIds.includes(ap.cargoId)).map((ap) => {
      const p = postulantes.find((x) => x.id === ap.postulanteId);
      const cargo = emp.cargos.find((c) => c.id === ap.cargoId);
      if (!p || !cargo) return null;
      return { ...ap, nombre: p.nombre, comuna: p.comuna, oficio: p.oficio, cargo: cargo.nombre, comp: computeMatch(p, cargo).score };
    }).filter(Boolean).sort((a, b) => b.comp - a.comp);
  }, [emp, postulantes, postulaciones]);

  const exportCSV = () => {
    const head = "Postulante,Comuna,Oficio,Cargo,Estado,Compatibilidad\n";
    const body = rows.map((r) => `${r.nombre},${r.comuna},${r.oficio},${r.cargo},${r.estado},${r.comp}%`).join("\n");
    const blob = new Blob([head + body], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `base_${emp.id}.csv`; a.click();
    log("Base descargada", emp.nombre, `${rows.length} postulantes`);
  };
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div><h3 style={{ ...hStyle, fontSize: 20, margin: 0 }}>Base de postulantes — {emp.nombre}</h3><div style={{ color: C.gray, fontSize: 13 }}>Información propia, ordenada y auditable</div></div>
        <Btn variant="gold" onClick={exportCSV}><Download size={16} /> Exportar CSV</Btn>
      </div>
      <Table head={["Postulante", "Comuna", "Cargo", "Estado", "Comp."]} rows={rows.map((r) => [r.nombre, r.comuna, r.cargo, <EstadoTag e={r.estado} />, <b style={{ color: matchColor(r.comp) }}>{r.comp}%</b>])} empty="Aún no hay postulaciones ni escaneos asociados a tus cargos." />
    </Card>
  );
}

/* ============================== ADMIN ============================== */
function Admin(props) {
  const { postulantes, empresas, postulaciones, eventos, allCargos, log } = props;
  const [tab, setTab] = useState("resumen");
  const tabs = [["resumen", "Resumen", BarChart3], ["empresas", "Empresas", Building2], ["postulantes", "Postulantes", Users], ["cargos", "Cargos", Briefcase], ["traza", "Trazabilidad", ClipboardList]];

  const kpis = [
    ["Postulantes", postulantes.length, Users], ["Empresas", empresas.length, Building2],
    ["Cargos", allCargos.length, Briefcase], ["Postulaciones", postulaciones.length, Send],
  ];
  const porEmpresa = empresas.map((e) => ({ name: e.nombre.split(" ")[0], v: postulaciones.filter((ap) => e.cargos.some((c) => c.id === ap.cargoId)).length }));
  const compPromedio = allCargos.map((c) => { const ms = postulantes.map((p) => computeMatch(p, c).score); return { name: c.nombre.slice(0, 14), v: Math.round(ms.reduce((a, b) => a + b, 0) / (ms.length || 1)) }; });
  const estadoDist = ["Postulado", "Revisado por empresa", "Preseleccionado", "No seleccionado"].map((s, i) => ({ name: s, value: postulaciones.filter((p) => p.estado === s).length, fill: [C.teal, C.gold, C.tealDk, C.gray][i] }));

  const exportAll = () => {
    const head = "Postulante,Comuna,Cargo,Empresa,Estado\n";
    const body = postulaciones.map((ap) => { const p = postulantes.find((x) => x.id === ap.postulanteId); const c = allCargos.find((x) => x.id === ap.cargoId); return `${p?.nombre},${p?.comuna},${c?.nombre},${c?.empresaNombre},${ap.estado}`; }).join("\n");
    const blob = new Blob([head + body], { type: "text/csv" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "feria_consolidada.csv"; a.click();
    log("Base descargada", "Administrador", "Consolidado feria");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div><h2 style={{ ...hStyle, margin: 0 }}>Panel administrador</h2><div style={{ color: C.gray, fontSize: 13 }}>Feria Laboral Minera · Antofagasta Minerals · trazabilidad general</div></div>
        <Btn variant="gold" onClick={exportAll}><Download size={16} /> Exportar consolidado</Btn>
      </div>
      <Tabs tabs={tabs} tab={tab} setTab={setTab} />

      {tab === "resumen" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 16 }}>
            {kpis.map(([l, n, Icon]) => (
              <Card key={l} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: C.tealLt, display: "grid", placeItems: "center" }}><Icon size={22} color={C.tealDk} /></div>
                <div><div style={{ fontFamily: fontC, fontWeight: 800, fontSize: 30, lineHeight: 1 }}>{n}</div><div style={{ fontSize: 12, color: C.gray }}>{l}</div></div>
              </Card>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card><ChartTitle t="Postulaciones por empresa" /><ResponsiveContainer width="100%" height={210}><BarChart data={porEmpresa}><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis allowDecimals={false} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="v" radius={[6, 6, 0, 0]}>{porEmpresa.map((_, i) => <Cell key={i} fill={C.teal} />)}</Bar></BarChart></ResponsiveContainer></Card>
            <Card><ChartTitle t="Compatibilidad promedio por cargo" /><ResponsiveContainer width="100%" height={210}><BarChart data={compPromedio} layout="vertical"><XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} /><YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="v" radius={[0, 6, 6, 0]}>{compPromedio.map((d, i) => <Cell key={i} fill={matchColor(d.v)} />)}</Bar></BarChart></ResponsiveContainer></Card>
            <Card><ChartTitle t="Estados de postulación" /><ResponsiveContainer width="100%" height={210}><PieChart><Pie data={estadoDist} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75}>{estadoDist.map((e, i) => <Cell key={i} fill={e.fill} />)}</Pie><Legend wrapperStyle={{ fontSize: 11 }} /></PieChart></ResponsiveContainer></Card>
            <Card><ChartTitle t="Inscritos por comuna" /><ResponsiveContainer width="100%" height={210}><BarChart data={Object.entries(postulantes.reduce((a, p) => ((a[p.comuna] = (a[p.comuna] || 0) + 1), a), {})).map(([name, v]) => ({ name, v }))}><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis allowDecimals={false} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="v" radius={[6, 6, 0, 0]} fill={C.gold} /></BarChart></ResponsiveContainer></Card>
          </div>
        </div>
      )}

      {tab === "empresas" && <Card><Table head={["ID", "Empresa", "Stand", "Rubro", "Cargos"]} rows={empresas.map((e) => [e.id, e.nombre, e.stand, e.rubro, e.cargos.length])} /></Card>}
      {tab === "postulantes" && <Card><Table head={["ID", "Nombre", "Comuna", "Oficio", "Estado"]} rows={postulantes.map((p) => [p.id, p.nombre, p.comuna, p.oficio, <EstadoTag e={p.estado} />])} /></Card>}
      {tab === "cargos" && <Card><Table head={["Cargo", "Empresa", "Stand", "Turno", "Vacantes"]} rows={allCargos.map((c) => [c.nombre, c.empresaNombre, c.stand, c.turno, c.vacantes])} /></Card>}
      {tab === "traza" && (
        <Card>
          <ChartTitle t="Bitácora de trazabilidad" />
          <div style={{ position: "relative", paddingLeft: 18 }}>
            <div style={{ position: "absolute", left: 5, top: 4, bottom: 4, width: 2, background: C.grayLt }} />
            {eventos.map((ev) => (
              <div key={ev.id} style={{ position: "relative", paddingBottom: 14 }}>
                <div style={{ position: "absolute", left: -16, top: 3, width: 10, height: 10, borderRadius: 5, background: C.teal, border: "2px solid #fff" }} />
                <div style={{ fontSize: 13 }}><b>{ev.tipo}</b> <span style={{ color: C.gray }}>· {ev.actor}</span></div>
                <div style={{ fontSize: 11, color: C.gray }}>{ev.detalle} · {ev.ts}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

/* ============================== SHARED COMPONENTS ============================== */
const hStyle = { fontFamily: fontC, fontWeight: 700, fontSize: 26, margin: "0 0 14px" };
const dropStyle = { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "26px 16px", border: `2px dashed ${C.grayLt}`, borderRadius: 12, background: "#fff", cursor: "pointer", fontFamily: font, color: C.dark };

function Stepper({ steps, active }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: i <= active ? 1 : 0.4 }}>
            <div style={{ width: 24, height: 24, borderRadius: 12, background: i < active ? C.teal : i === active ? C.tealDk : C.grayLt, color: "#fff", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700, fontFamily: fontC }}>{i < active ? "✓" : i + 1}</div>
            <span style={{ fontFamily: fontC, fontWeight: 600, fontSize: 13, color: i === active ? C.dark : C.gray }}>{s}</span>
          </div>
          {i < steps.length - 1 && <div style={{ width: 18, height: 2, background: C.grayLt }} />}
        </React.Fragment>
      ))}
    </div>
  );
}
function Tabs({ tabs, tab, setTab }) {
  return (
    <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${C.grayLt}`, marginBottom: 16, flexWrap: "wrap" }}>
      {tabs.map(([k, l, Icon]) => (
        <button key={k} onClick={() => setTab(k)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", border: "none", background: "none", cursor: "pointer", fontFamily: fontC, fontWeight: 600, fontSize: 14, color: tab === k ? C.tealDk : C.gray, borderBottom: tab === k ? `3px solid ${C.teal}` : "3px solid transparent" }}>
          <Icon size={16} /> {l}
        </button>
      ))}
    </div>
  );
}
function Detail({ Icon, t, v }) {
  return <div style={{ display: "flex", gap: 8, padding: "8px 0" }}><Icon size={16} color={C.teal} style={{ marginTop: 2, flexShrink: 0 }} /><div><div style={{ fontFamily: fontC, fontWeight: 600, fontSize: 11, textTransform: "uppercase", color: C.gray, letterSpacing: 0.4 }}>{t}</div><div style={{ fontSize: 14 }}>{v}</div></div></div>;
}
function Block({ t, children }) {
  return <div style={{ margin: "10px 0" }}><div style={{ fontFamily: fontC, fontWeight: 600, fontSize: 11, textTransform: "uppercase", color: C.gray, letterSpacing: 0.4, marginBottom: 5 }}>{t}</div>{children}</div>;
}
function MatchList({ Icon, color, t, items }) {
  return <div style={{ marginTop: 6 }}><div style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: fontC, fontWeight: 600, fontSize: 12, color, textTransform: "uppercase" }}><Icon size={13} /> {t}</div><ul style={{ margin: "4px 0 0", paddingLeft: 16, fontSize: 12.5, color: C.dark }}>{(items.length ? items : ["—"]).map((i, k) => <li key={k} style={{ marginBottom: 2 }}>{i}</li>)}</ul></div>;
}
function Gauge({ value }) {
  const col = matchColor(value);
  return (
    <div>
      <div style={{ position: "relative", width: 90, height: 90, margin: "0 auto" }}>
        <svg width="90" height="90" viewBox="0 0 90 90"><circle cx="45" cy="45" r="38" fill="none" stroke={C.grayLt} strokeWidth="8" /><circle cx="45" cy="45" r="38" fill="none" stroke={col} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(value / 100) * 238.7} 238.7`} transform="rotate(-90 45 45)" /></svg>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}><div style={{ fontFamily: fontC, fontWeight: 800, fontSize: 24, color: col }}>{value}%</div></div>
      </div>
      <div style={{ fontSize: 11, color: C.gray, fontFamily: fontC, fontWeight: 600, textTransform: "uppercase" }}>Compatibilidad</div>
    </div>
  );
}
function BarScore({ value }) {
  const col = matchColor(value);
  return <div style={{ width: 110, textAlign: "right" }}><div style={{ fontFamily: fontC, fontWeight: 700, color: col, fontSize: 16 }}>{value}%</div><div style={{ height: 6, background: C.grayLt, borderRadius: 4, marginTop: 2 }}><div style={{ width: `${value}%`, height: "100%", background: col, borderRadius: 4 }} /></div></div>;
}
function ChartTitle({ t }) { return <div style={{ fontFamily: fontC, fontWeight: 700, fontSize: 16, marginBottom: 10 }}>{t}</div>; }
function EstadoTag({ e }) {
  const map = { "Postulado": [C.tealDk, C.tealLt], "Revisado por empresa": [C.dark, "#FCEFC7"], "Preseleccionado": ["#fff", C.teal], "No seleccionado": ["#fff", C.gray], "CV Minero generado": [C.tealDk, C.tealLt] };
  const [color, bg] = map[e] || [C.gray, C.bg];
  return <span style={{ fontFamily: fontC, fontWeight: 600, fontSize: 11, color, background: bg, padding: "3px 8px", borderRadius: 12 }}>{e}</span>;
}
function Table({ head, rows, empty }) {
  if (!rows.length) return <div style={{ color: C.gray, padding: 24, textAlign: "center" }}>{empty || "Sin datos."}</div>;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
        <thead><tr>{head.map((h) => <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontFamily: fontC, fontWeight: 700, fontSize: 11, textTransform: "uppercase", color: C.gray, borderBottom: `2px solid ${C.grayLt}` }}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} style={{ padding: "9px 10px", borderBottom: `1px solid ${C.bg}` }}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
