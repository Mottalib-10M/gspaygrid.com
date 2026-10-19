/**
 * Within-grade increases (5 CFR 531.405) and the two-step promotion rule (5 CFR 531.214(d)).
 * Waiting periods and the rule itself live in params-2026.json > career.
 */
import P from '../../data/params-2026.json';
import { pay, BASE, RUS, area, localityRate, special001M, CAP } from './gs';

/** Weeks of creditable service needed to move INTO a step (index = step). */
export const WAIT_WEEKS: number[] = [0, 0, ...P.career.wgiWeeks];
export const waitWeeks = (toStep: number) => WAIT_WEEKS[toStep] ?? 0;

export interface StepRow { step: number; weeks: number; monthsFromNow: number; annual: number; gain: number }
/**
 * The steps still ahead in the grade. `monthsInStep` = months already served in the current step.
 * Each row gives the waiting period, when it falls from today (in months, never a calendar date, so the
 * page renders the same on any day) and the pay at that step in today's table.
 */
export function stepsAhead(grade: number, step: number, monthsInStep: number, code = RUS): StepRow[] {
  const rows: StepRow[] = [];
  let months = -Math.max(0, monthsInStep);
  for (let s = step + 1; s <= 10; s++) {
    const w = waitWeeks(s);
    months += (w * 7) / (365.25 / 12);
    rows.push({ step: s, weeks: w, monthsFromNow: Math.max(0, months), annual: pay(grade, s, code).annual, gain: pay(grade, s, code).annual - pay(grade, s - 1, code).annual });
  }
  return rows;
}
/** Years from step 1 to step 10 when every increase comes on time. */
export const yearsStep1To10 = () => WAIT_WEEKS.slice(2).reduce((a, b) => a + b, 0) / 52;

export interface Promotion {
  from: { grade: number; step: number; annual: number }; to: { grade: number; step: number; annual: number };
  twoStepTarget: number; raise: number; raisePct: number; stepIncrement: number; capped: boolean; waitResets: boolean;
}
/**
 * GS to GS promotion, standard method of 5 CFR 531.214(d)(3).
 *  B: your GS base rate raised by two within-grade increases of your grade: the step s+2 base rate when
 *     s <= 8; above the range (steps 9 and 10), the rate plus two increments, and for GS-1 and GS-2 the
 *     increment is the step 9 to 10 one (531.214(d)(6)).
 *  C: the payable rate for that step: locality rate or table 001M where higher; above the range, the same
 *     locality percentage or special rate supplement that applies inside the range. Payable rates are capped.
 *  D: the lowest step of the new grade (highest applicable range) that equals or exceeds C, step 10 at most;
 *     if C is above step 10, step 10 (or a retained rate when your current rate is higher, part 536).
 */
export function promote(grade: number, step: number, newGrade: number, code = RUS): Promotion {
  const g = Math.min(15, Math.max(1, grade)), ng = Math.min(15, Math.max(g + 1, newGrade)), st = Math.min(10, Math.max(1, step));
  const cur = pay(g, st, code).annual;
  const a = area(code);
  const row = BASE[g - 1];
  const inc = baseIncrement(g);
  let target: number;
  if (st <= 8) target = pay(g, st + 2, code).annual;
  else {
    const b = row[st - 1] + 2 * inc;
    const loc = localityRate(b, a.pct);
    const sp10 = special001M(g, 10);
    const special = sp10 !== null ? b + (sp10 - row[9]) : 0;
    target = Math.min(CAP, Math.max(loc, special));
  }
  let s = 1;
  while (s < 10 && pay(ng, s, code).annual < target) s++;
  const annual = Math.max(pay(ng, s, code).annual, s === 10 && cur > pay(ng, 10, code).annual ? cur : 0);
  return { from: { grade: g, step: st, annual: cur }, to: { grade: ng, step: s, annual }, twoStepTarget: target, raise: annual - cur, raisePct: annual / cur - 1, stepIncrement: inc, capped: pay(ng, s, code).annual < target, waitResets: true };
}
/** Base-table step increment of a grade (the "within-grade increase" amount OPM prints on special tables). */
export const baseIncrement = (grade: number) => grade <= 2 ? BASE[grade - 1][9] - BASE[grade - 1][8] : BASE[grade - 1][2] - BASE[grade - 1][1];
