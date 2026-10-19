/**
 * Within-grade increases (5 CFR 531.405) and the two-step promotion rule (5 CFR 531.214(c)).
 * Waiting periods and the rule itself live in params-2026.json > career.
 */
import P from '../../data/params-2026.json';
import { pay, BASE, RUS, area, localityRate } from './gs';

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
 * GS to GS promotion, standard method of 5 CFR 531.214(d)(3): (A) your GS base rate; (B) plus two
 * within-grade increases of the grade you leave; (C) that amount turned into a payable rate with your
 * locality percentage (table 001M where it is higher); (D) the lowest step of the new grade, in the same
 * highest applicable rate range, that equals or exceeds it (step 10 at most).
 */
export function promote(grade: number, step: number, newGrade: number, code = RUS): Promotion {
  const g = Math.min(15, Math.max(1, grade)), ng = Math.min(15, Math.max(g + 1, newGrade));
  const cur = pay(g, step, code).annual;
  const inc = baseIncrement(g);
  const a = area(code);
  const baseB = BASE[g - 1][step - 1] + 2 * inc;
  const target = localityRate(baseB, a.pct);
  let s = 1;
  while (s < 10 && pay(ng, s, code).annual < target) s++;
  const annual = pay(ng, s, code).annual;
  return { from: { grade: g, step, annual: cur }, to: { grade: ng, step: s, annual }, twoStepTarget: target, raise: annual - cur, raisePct: annual / cur - 1, stepIncrement: inc, capped: annual < target, waitResets: true };
}
/** Base-table step increment of a grade (the "within-grade increase" amount OPM prints on special tables). */
export const baseIncrement = (grade: number) => grade <= 1 ? Math.round((BASE[0][9] - BASE[0][0]) / 9) : BASE[grade - 1][2] - BASE[grade - 1][1];
