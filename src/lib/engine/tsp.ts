/**
 * TSP agency contributions for FERS employees (5 U.S.C. 8432(c)): 1 % automatic, then 100 % of the first
 * 3 % you contribute and 50 % of the next 2 %. Limits: params-2026.json > tsp.
 */
import P from '../../data/params-2026.json';

export function agencyMatch(salary: number, employeePct: number) {
  const c = Math.max(0, employeePct) / 100;
  const auto = salary * P.tsp.automatic;
  const match = salary * (Math.min(c, 0.03) + 0.5 * Math.min(Math.max(c - 0.03, 0), 0.02));
  const employee = salary * c;
  return { employee, auto, match, agency: auto + match, total: employee + auto + match };
}
/** Missed match when contributing less than 5 %. */
export function missedMatch(salary: number, employeePct: number) {
  return agencyMatch(salary, 5).match - agencyMatch(salary, employeePct).match;
}
/** Employee deferral limit for an age in 2026 (elective deferral plus the catch-up that applies). */
export function deferralLimit(age: number) {
  const T = P.tsp;
  const catchUp = age >= 60 && age <= 63 ? T.catchUp60to63 : age >= 50 ? T.catchUp50 : 0;
  return { base: T.deferral, catchUp, total: T.deferral + catchUp };
}
