#!/usr/bin/env node
// Vérifie les créneaux d'audit des brouillons de prospection (prospection/brouillons/*.md).
// Usage : node scripts/check-creneaux.mjs   (code de sortie 1 s'il y a un problème)
//
// Règles contrôlées :
//  - chaque créneau proposé est unique sur tous les brouillons + mails déjà envoyés + RDV fixes ;
//  - en semaine, entre 15 h et 17 h 30 (heure de début), jamais le mer 11/11 (férié) ;
//  - lun 16/11 de 15 h à 15 h 45 laissé libre (RDV Royal Champagne) ;
//  - au moins 2 jours ouvrés après la date d'envoi du mail (tag « — envoi <jour> J/M » du titre de section) ;
//  - 15 mails maximum par jour d'envoi ; jour de la semaine cohérent avec la date.
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "prospection", "brouillons");
const YEAR = 2026;
const MAX_PER_DAY = 15;
// Mails déjà envoyés (suivi.csv, 29/10) : leurs créneaux sont pris, sans contrôle de règle.
const SENT = new Set(["mercredi-28-10.md", "jeudi-29-10.md"]);
// Anciennes versions des mails envoyés le 29/10 (remplacées par mercredi-28-10.md) : ignorées.
const IGNORED = new Set(["PLANNING.md", "lundi-26-10.md", "harvey-a-coller.md"]);
const HOLIDAYS = new Set(["11/11"]);
const FIXED = [
  ["5/11", "15:00", "Hôtel Belfast (RDV proposé, mail du 27/10)"],
  ["6/11", "15:00", "Hôtel Belfast (RDV proposé, mail du 27/10)"],
  ["16/11", "15:00", "RDV Royal Champagne"],
];
const BLOCKED = [["16/11", ["15:15", "15:30", "15:45"], "marge du RDV Royal Champagne"]];

const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const SLOT_RE = /(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche) (\d{1,2})\/(\d{1,2}) à (\d{1,2}) h(?: (\d{2}))?/g;
const SEND_RE = /— envoi (lundi|mardi|mercredi|jeudi|vendredi) (\d{1,2})\/(\d{1,2})/;

const date = (d, m) => new Date(Date.UTC(YEAR, m - 1, d));
const key = (dt) => `${dt.getUTCDate()}/${dt.getUTCMonth() + 1}`;
const isBusiness = (dt) => dt.getUTCDay() % 6 !== 0 && !HOLIDAYS.has(key(dt));
const addBusinessDays = (dt, n) => {
  const r = new Date(dt);
  while (n > 0) {
    r.setUTCDate(r.getUTCDate() + 1);
    if (isBusiness(r)) n--;
  }
  return r;
};
const hm = (h, m) => `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

const errors = [];
const taken = new Map(); // "J/M HH:MM" -> owner
const take = (slot, owner) => {
  if (taken.has(slot)) errors.push(`COLLISION ${slot} : ${owner}  <->  ${taken.get(slot)}`);
  else taken.set(slot, owner);
};
for (const [d, t, who] of FIXED) take(`${d} ${t}`, who);
const blocked = new Map();
for (const [d, ts, why] of BLOCKED) for (const t of ts) blocked.set(`${d} ${t}`, why);

const perDay = new Map();
let nDrafts = 0;
let nSent = 0;
const files = readdirSync(DIR).filter((f) => f.endsWith(".md") && !IGNORED.has(f)).sort();
for (const f of files) {
  const lines = readFileSync(join(DIR, f), "utf8").split("\n");
  const sent = SENT.has(f);
  let sec = null;
  const sections = [];
  for (const line of lines) {
    const h = line.match(/^## (\d+)\. (.*)$/);
    if (h) { sec = { n: h[1], title: h[2], slotLines: [] }; sections.push(sec); continue; }
    if (line.startsWith("## ")) { sec = null; continue; }
    if (sec && /udit/.test(line) && [...line.matchAll(SLOT_RE)].length >= 2) sec.slotLines.push(line);
  }
  for (const s of sections) {
    const name = `${f} n° ${s.n} (${s.title.split(" — ")[0]})`;
    if (s.slotLines.length !== 1) { errors.push(`${name} : ${s.slotLines.length} ligne(s) de créneaux (attendu 1)`); continue; }
    let send = null;
    if (!sent) {
      const m = s.title.match(SEND_RE);
      if (!m) { errors.push(`${name} : pas de tag « — envoi <jour> J/M » dans le titre`); continue; }
      send = date(+m[2], +m[3]);
      if (JOURS[send.getUTCDay()] !== m[1]) errors.push(`${name} : date d'envoi ${key(send)} n'est pas un ${m[1]}`);
      if (!isBusiness(send)) errors.push(`${name} : envoi un jour non ouvré (${key(send)})`);
      perDay.set(key(send), [...(perDay.get(key(send)) || []), name]);
      nDrafts++;
    } else nSent++;
    const slots = [...s.slotLines[0].matchAll(SLOT_RE)];
    if (slots.length !== 2) errors.push(`${name} : ${slots.length} créneaux (attendu 2)`);
    for (const [, jour, d, m, h, mm] of slots) {
      const dt = date(+d, +m);
      const t = hm(+h, +(mm || 0));
      const slot = `${key(dt)} ${t}`;
      take(slot, name);
      if (sent) continue;
      if (JOURS[dt.getUTCDay()] !== jour) errors.push(`${name} : ${slot} n'est pas un ${jour}`);
      if (!isBusiness(dt)) errors.push(`${name} : ${slot} tombe un jour non ouvré / férié`);
      if (t < "15:00" || t > "17:30") errors.push(`${name} : ${slot} hors plage 15 h – 17 h 30`);
      if (blocked.has(slot)) errors.push(`${name} : ${slot} bloqué (${blocked.get(slot)})`);
      const min = addBusinessDays(send, 2);
      if (dt < min) errors.push(`${name} : ${slot} trop tôt (envoi ${key(send)}, au plus tôt ${key(min)})`);
    }
  }
}
for (const [d, names] of perDay) if (names.length > MAX_PER_DAY) errors.push(`${d} : ${names.length} envois (max ${MAX_PER_DAY})`);

console.log(`Brouillons contrôlés : ${nDrafts} mails à envoyer, ${nSent} mails envoyés (créneaux pris), ${FIXED.length} RDV fixes.`);
console.log("\nEnvois par jour :");
const byDate = (a, b) => { const [d1, m1] = a.split("/").map(Number); const [d2, m2] = b.split("/").map(Number); return m1 - m2 || d1 - d2; };
for (const d of [...perDay.keys()].sort(byDate)) console.log(`  ${d.padEnd(6)} ${String(perDay.get(d).length).padStart(2)} / ${MAX_PER_DAY}`);
console.log("\nCréneaux pris par jour (à partir du 2/11) :");
const days = new Map();
for (const [slot, who] of taken) {
  const [d, t] = slot.split(" ");
  const [dd, mm] = d.split("/").map(Number);
  if (mm < 11 || (mm === 11 && dd < 2)) continue;
  days.set(d, [...(days.get(d) || []), `${t} ${who.replace(/ \(.*$/, "").replace(/^(.*?)\.md n° /, "$1#")}`]);
}
for (const d of [...days.keys()].sort(byDate)) console.log(`  ${d.padEnd(6)} ${String(days.get(d).length).padStart(2)} : ${days.get(d).sort().map((x) => x.split(" ")[0]).join(" ")}`);
console.log(`\nTotal créneaux : ${taken.size} — problèmes : ${errors.length}`);
if (errors.length) { for (const e of errors) console.log("  ✗ " + e); process.exit(1); }
console.log("✓ 0 collision, toutes les règles respectées.");
