/**
 * FERS basic annuity, supplement, survivor reduction and COLA (5 U.S.C. chapter 84, subchapter II).
 * Every age, rate and threshold comes from params-2026.json > fers and > ssa. Ages are handled in
 * months to avoid rounding a 56 and 4 month MRA to 56.
 */
import P from '../../data/params-2026.json';

const F = P.fers;
export type Plan = 'regular' | 'special';
export type Survivor = 'none' | 'partial' | 'full';
export type Kind = 'immediate' | 'mra10' | 'earlyout' | 'deferred' | 'none';

/** MRA in months, from the table of 5 U.S.C. 8412(h). */
export function mraMonths(birthYear: number): number {
  const t = F.mra as Array<[number, number, number]>; // [born up to (inclusive), years, months]
  for (const [upTo, y, m] of t) if (birthYear <= upTo) return y * 12 + m;
  const last = t[t.length - 1];
  return last[1] * 12 + last[2];
}
export const ym = (months: number) => ({ y: Math.floor(months / 12), m: Math.round(months % 12) });
export const fmtYM = (months: number) => { const { y, m } = ym(months); return m ? `${y} and ${m} month${m > 1 ? 's' : ''}` : `${y}`; };

/** Sick leave hours to months of service for the computation only (OPM chart: 2,087 hours = 1 year). */
export function sickLeaveMonths(hours: number): number {
  return Math.floor((Math.max(0, hours) / F.sickLeaveHoursPerYear) * 12 + 1e-9);
}

export interface FersIn {
  birthYear: number; retireAgeMonths: number; serviceMonths: number; high3: number;
  sickHours?: number; plan?: Plan; survivor?: Survivor; ss62?: number; earnings?: number;
  /** Separated earlier (deferred): age at which the annuity starts, in months. */
  startAgeMonths?: number; earlyOut?: boolean;
}
export interface FersOut {
  kind: Kind; label: string; mra: number; eligible: boolean; startAge: number;
  serviceCounted: number; multiplier: number; gross: number; reduction: number; ageReductionPct: number;
  survivorCut: number; net: number; survivorAnnuity: number; supplement: number; supplementAfterTest: number; supplementStarts: number; supplementEnds: number;
  rule: string;
}
/** Which retirement a separation at this age with this service gives (5 U.S.C. 8412, 8414). */
export function kindOf(age: number, service: number, mra: number, plan: Plan = 'regular', earlyOut = false): { kind: Kind; rule: string } {
  const yrs = service / 12;
  if (plan === 'special') {
    if ((age >= 50 * 12 && yrs >= 20) || yrs >= 25) return { kind: 'immediate', rule: 'Special provisions: age 50 with 20 years, or 25 years at any age' };
  }
  if (age >= 62 * 12 && yrs >= 5) return { kind: 'immediate', rule: 'Age 62 with 5 years' };
  if (age >= 60 * 12 && yrs >= 20) return { kind: 'immediate', rule: 'Age 60 with 20 years' };
  if (age >= mra && yrs >= 30) return { kind: 'immediate', rule: 'MRA with 30 years' };
  if (earlyOut && ((age >= 50 * 12 && yrs >= 20) || yrs >= 25)) return { kind: 'earlyout', rule: 'Early retirement (VERA or discontinued service): age 50 with 20 years, or 25 years' };
  if (age >= mra && yrs >= 10) return { kind: 'mra10', rule: 'MRA with 10 years: reduced 5 % a year under 62 unless postponed' };
  if (yrs >= 5) return { kind: 'deferred', rule: 'Deferred: you leave with 5 years or more, the annuity starts later' };
  return { kind: 'none', rule: 'Fewer than 5 years of creditable service: no annuity, refund of contributions only' };
}

/** Basic annuity before survivor reduction (5 U.S.C. 8415). */
export function multiplier(startAge: number, serviceYearsNoSick: number, plan: Plan, countedYears: number) {
  if (plan === 'special') {
    const first = Math.min(20, countedYears);
    return { rate: (F.special.first20 * first + F.regular.base * Math.max(0, countedYears - 20)) / Math.max(countedYears, 1e-9), text: `${F.special.first20 * 100} % for the first 20 years, ${F.regular.base * 100} % after` };
  }
  const enhanced = startAge >= F.regular.enhancedAge * 12 && serviceYearsNoSick >= F.regular.enhancedYears;
  return { rate: enhanced ? F.regular.enhanced : F.regular.base, text: enhanced ? `${(F.regular.enhanced * 100).toFixed(1)} % (age ${F.regular.enhancedAge} with ${F.regular.enhancedYears} years)` : `${F.regular.base * 100} %` };
}

/** Estimated Social Security retirement benefit at 62, the base of the supplement (approximation). */
export function ss62Estimate(salary: number, careerYears: number): { pia: number; at62: number; aime: number } {
  const S = P.ssa;
  const capped = Math.min(salary, S.wageBase);
  const aime = Math.floor((capped * Math.min(35, Math.max(0, careerYears))) / 35 / 12);
  const [b1, b2] = S.bendPoints;
  const pia = Math.floor((0.9 * Math.min(aime, b1) + 0.32 * Math.max(0, Math.min(aime, b2) - b1) + 0.15 * Math.max(0, aime - b2)) * 10) / 10;
  return { aime, pia, at62: Math.floor(pia * S.reductionAt62Fra67) };
}

/** FERS supplement (5 U.S.C. 8421): estimated SS at 62 x FERS civilian years / 40, then the earnings test. */
export function supplement(ss62Monthly: number, fersYears: number, earnings: number, exempt = P.ssa.earningsTest.exempt2026) {
  const years = Math.round(fersYears); // OPM rounds FERS civilian service to the nearest whole year
  const monthly = Math.floor(ss62Monthly * Math.min(years, 40) / 40);
  const yearly = monthly * 12;
  const cut = Math.max(0, Math.floor((earnings - exempt) / 2));
  const after = Math.max(0, yearly - cut);
  return { years, monthly, yearly, cut: Math.min(cut, yearly), after, afterMonthly: after / 12, zeroAt: exempt + 2 * yearly };
}

export function fers(i: FersIn): FersOut {
  const plan = i.plan ?? 'regular', survivor = i.survivor ?? 'none';
  const mra = mraMonths(i.birthYear);
  const { kind, rule } = kindOf(i.retireAgeMonths, i.serviceMonths, mra, plan, i.earlyOut);
  const startAge = kind === 'deferred' ? Math.max(i.startAgeMonths ?? 62 * 12, i.serviceMonths >= 120 ? mra : 62 * 12)
    : kind === 'mra10' ? Math.max(i.retireAgeMonths, i.startAgeMonths ?? i.retireAgeMonths) : i.retireAgeMonths;
  // Sick leave adds to the computation only, and only for an immediate or MRA+10 annuity (5 U.S.C. 8415(m)).
  const sick = kind === 'deferred' ? 0 : sickLeaveMonths(i.sickHours ?? 0);
  const counted = Math.floor(i.serviceMonths + sick); // whole months; extra days are dropped
  const countedYears = counted / 12;
  // The 1.1 % test looks at the age at separation, not at the first payment (OPM, computation).
  const m = multiplier(i.retireAgeMonths, i.serviceMonths / 12, plan, countedYears);
  const gross = i.high3 * countedYears * m.rate;
  // MRA+10 (and a deferred annuity taken at the MRA with 10 to 19 years): 5/12 % per month under 62,
  // waived from 60 with 20 years.
  let agePct = 0;
  const reduced = kind === 'mra10' || (kind === 'deferred' && i.serviceMonths >= 120);
  if (reduced && !(startAge >= 60 * 12 && i.serviceMonths >= 240)) agePct = Math.max(0, 62 * 12 - startAge) * (F.mra10ReductionPerYear / 12);
  const reduction = gross * agePct;
  const afterAge = gross - reduction;
  const cutPct = survivor === 'full' ? F.survivor.fullCost : survivor === 'partial' ? F.survivor.partialCost : 0;
  const survivorCut = afterAge * cutPct;
  const survivorAnnuity = survivor === 'full' ? gross * F.survivor.fullBenefit : survivor === 'partial' ? gross * F.survivor.partialBenefit : 0;
  const net = afterAge - survivorCut;
  const supEligible = (kind === 'immediate' || kind === 'earlyout') && startAge < 62 * 12 && !(i.retireAgeMonths >= 62 * 12);
  const sup = supEligible && i.ss62 ? supplement(i.ss62, i.serviceMonths / 12, i.earnings ?? 0) : null;
  const label = kind === 'immediate' ? 'Immediate unreduced annuity' : kind === 'mra10' ? (agePct > 0 ? 'MRA+10 annuity, reduced' : 'MRA+10 annuity, postponed to avoid the reduction') : kind === 'earlyout' ? 'Early retirement annuity' : kind === 'deferred' ? 'Deferred annuity' : 'No annuity';
  return {
    kind, label, mra, eligible: kind !== 'none', startAge, serviceCounted: counted, multiplier: m.rate, gross, reduction, ageReductionPct: agePct,
    survivorCut, net: kind === 'none' ? 0 : net, survivorAnnuity, supplement: sup?.yearly ?? 0, supplementAfterTest: sup?.after ?? 0, supplementStarts: kind === 'earlyout' ? Math.max(startAge, mra) : startAge, supplementEnds: 62 * 12, rule: `${rule} · ${m.text}`,
  };
}

/** FERS COLA from the CPI-W increase (5 U.S.C. 8462(b)): the "diet COLA". */
export function fersCola(cpi: number): number {
  const c = Math.max(0, cpi);
  if (c <= F.cola.fullUpTo) return c;
  if (c <= F.cola.capBand) return F.cola.fullUpTo;
  return c - F.cola.minus;
}
/**
 * Annuity over the years with FERS COLAs. Regular retirees get no COLA before 62 (5 U.S.C. 8462(c)(1));
 * retirees under the special provisions of 8412(d) and (e) (law enforcement officers, firefighters, air traffic controllers)
 * get it at any age (8462(c)(3)). The first COLA after retirement is
 * prorated, which we ignore.
 */
export function colaPath(annual: number, startAge: number, years: number, cpi: number, plan: Plan = 'regular') {
  const rows: Array<{ age: number; fers: number; csrsLike: number }> = [];
  let a = annual, b = annual;
  for (let k = 0; k <= years; k++) {
    const age = Math.floor(startAge / 12) + k;
    rows.push({ age, fers: a, csrsLike: b });
    if (plan === 'special' || age + 1 >= 62) a *= 1 + fersCola(cpi);
    b *= 1 + cpi;
  }
  return rows;
}

/** High-3: highest average basic pay (locality included) over any 3 consecutive years. */
export function high3(salaries: number[]): number {
  if (salaries.length < 3) return salaries.reduce((a, b) => a + b, 0) / Math.max(1, salaries.length);
  let best = 0;
  for (let k = 0; k + 3 <= salaries.length; k++) best = Math.max(best, (salaries[k] + salaries[k + 1] + salaries[k + 2]) / 3);
  return best;
}
