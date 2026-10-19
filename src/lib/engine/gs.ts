/**
 * General Schedule pay, rebuilt the way OPM builds its tables (5 U.S.C. 5303, 5304, 5305):
 *   locality rate = base rate x (1 + locality percentage), rounded to the nearest dollar,
 *   capped at the rate of Executive Schedule level IV;
 *   GS-1 to GS-4 in the United States: special rate table 001M wherever it is higher.
 * The test suite checks this rule against every one of the 8,700 cells of the 58 OPM XML tables.
 * Data: src/data/gs-2026.json (scripts/data/build-pay-tables.py), counties-2026.json, params-2026.json.
 */
import GS from '../../data/gs-2026.json';
import COUNTIES from '../../data/counties-2026.json';
import P from '../../data/params-2026.json';

export interface Area { code: string; name: string; short: string; slug: string; pct: number; prevPct: number | null }
export const AREAS: Area[] = GS.areas as Area[];
export const BASE: number[][] = GS.base;
export const PREV_BASE: number[][] = GS.prev.base;
export const CAP: number = GS.cap;
export const RAISE: number = GS.raise;
export const HOURS_PER_YEAR = 2087;
export const RUS = 'RUS';
const SPECIAL = P.pay.special001M.rates as Array<Array<number | null>>;

export function area(code: string): Area {
  const a = AREAS.find((x) => x.code === code);
  if (!a) throw new Error(`Unknown locality area ${code}`);
  return a;
}
export const areaBySlug = (slug: string) => AREAS.find((x) => x.slug === slug);
const roundDollar = (x: number) => Math.floor(x + 0.5 + 1e-9);
const cents = (x: number) => Math.round(x * 100 + 1e-9) / 100;
const clampGrade = (g: number) => Math.min(15, Math.max(1, Math.round(g)));
const clampStep = (s: number) => Math.min(10, Math.max(1, Math.round(s)));

/** Locality rate before special rates, exactly as on the OPM table. */
export function localityRate(base: number, pct: number, cap = CAP): number {
  return Math.min(cap, roundDollar(base * (1 + pct / 100)));
}
/** Special rate of table 001M (GS-1 to GS-4, nationwide), or null. */
export function special001M(grade: number, step: number): number | null {
  if (grade > 4) return null;
  return SPECIAL[grade - 1]?.[step - 1] ?? null;
}

export interface Pay {
  grade: number; step: number; code: string; base: number; locality: number; localityAmount: number;
  special: number | null; usesSpecial: boolean; annual: number; capped: boolean; hourly: number; biweekly: number; monthly: number; overtime: number;
}
/** Annual rate, hourly rate (annual / 2087), biweekly (80 hours) and the FLSA overtime hourly rate. */
export function pay(grade: number, step: number, code = RUS): Pay {
  const g = clampGrade(grade), s = clampStep(step), a = area(code);
  const base = BASE[g - 1][s - 1];
  const uncapped = roundDollar(base * (1 + a.pct / 100));
  const locality = Math.min(CAP, uncapped);
  const sp = special001M(g, s);
  const usesSpecial = sp !== null && sp > locality;
  const annual = usesSpecial ? (sp as number) : locality;
  const hourly = cents(annual / HOURS_PER_YEAR);
  const g10 = cents(localityRate(BASE[9][0], a.pct) / HOURS_PER_YEAR);
  const overtime = hourly <= g10 ? cents(1.5 * hourly) : Math.max(hourly, cents(1.5 * g10));
  return { grade: g, step: s, code: a.code, base, locality, localityAmount: locality - base, special: sp, usesSpecial, annual, capped: uncapped > CAP, hourly, biweekly: cents(hourly * 80), monthly: annual / 12, overtime };
}
/** The 2025 rate of the same cell (2025 base table, 2025 locality percentage, 2025 cap). */
export function pay2025(grade: number, step: number, code = RUS): number {
  const a = area(code);
  return localityRate(PREV_BASE[clampGrade(grade) - 1][clampStep(step) - 1], a.prevPct ?? a.pct, P.pay.cap2025);
}
/** A full 15 x 10 table for one area. */
export const table = (code = RUS) => BASE.map((row, g) => row.map((_, s) => pay(g + 1, s + 1, code).annual));

/** 2027 scenario: an across-the-board raise on the base table and an optional change of every locality
 *  percentage. A projection, never an official table: the 2027 tables are not published yet. */
export function pay2027(grade: number, step: number, code: string, raisePct: number, localityPoints = 0, cap = CAP): number {
  const a = area(code);
  const base = roundDollar(BASE[clampGrade(grade) - 1][clampStep(step) - 1] * (1 + raisePct / 100));
  return localityRate(base, a.pct + localityPoints, cap);
}

/* ---------- county -> locality area (OPM 2026 locality pay area definitions) ---------- */
export const STATE_NAMES: Record<string, string> = P.states as Record<string, string>;
const C = COUNTIES.states as Record<string, Array<[string, string]>>;
/** Counties (and independent cities) of a state that belong to a named locality area. */
export const countiesOf = (st: string): Array<[string, string]> => C[st] ?? [];
/** Locality area of a county of a state; any county not listed belongs to Rest of U.S. */
export function areaOf(st: string, county?: string): string {
  if (st === 'AK') return 'AK';
  if (st === 'HI') return 'HI';
  const hit = countiesOf(st).find(([n]) => n === county);
  return hit ? hit[1] : RUS;
}
/** Areas present in a state (for state pages and the lookup). */
export const areasInState = (st: string) => [...new Set(countiesOf(st).map(([, c]) => c))];
/** Counties of an area, grouped by state. */
export function countiesOfArea(code: string): Array<{ st: string; names: string[] }> {
  return Object.entries(C).map(([st, rows]) => ({ st, names: rows.filter(([, c]) => c === code).map(([n]) => n) })).filter((x) => x.names.length);
}
