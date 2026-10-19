/**
 * Writing kit (CONTRIBUTING-PAGES.md): every figure written in a page comes from here, never typed by hand.
 *   K.P                 params-2026.json (raise, cap, special rates, WGI weeks, FERS, SSA, TSP)
 *   K.GS                gs-2026.json (base table, 58 areas with their percentage)
 *   K.area(code) / K.areaBySlug(slug)   one locality area
 *   K.pay(grade, step, code)            2026 pay of a cell { annual, base, hourly, biweekly, overtime, capped, usesSpecial… }
 *   K.pay2025, K.pay2027(g, s, code, raisePct, localityPoints), K.table(code), K.countiesOfArea(code), K.areaOf(st, county)
 *   K.steps(g, s, monthsInStep, code), K.promote(g, s, newGrade, code), K.wait(step), K.yearsTo10()
 *   K.fers({...}), K.mra(birthYear), K.ym(months) "56 and 4 months", K.supplement(ss62, years, earnings), K.ss62(salary, years)
 *   K.cola(cpi), K.colaPath(annual, startAgeMonths, years, cpi), K.sick(hours), K.high3([..])
 *   K.match(salary, pct), K.missed(salary, pct), K.limit(age)
 *   K.tool(kind, args)  runs a calculator of tool-specs.ts and returns its result card
 *   formats             K.usd, K.usd2, K.pct(0.054, 2), K.num, K.dec, K.day('2026-10-19')
 */
import P from '../data/params-2026.json';
import GS from '../data/gs-2026.json';
import { usd, usd2, pct, runTool } from './tool-specs';
import { formatNumber, formatDecimal, displayDate } from './format';
import COUNTIES from '../data/counties-2026.json';
import { localityRate, AREAS, area, areaBySlug, pay, pay2025, pay2027, table, countiesOfArea, areaOf, countiesOf, areasInState, CAP, RAISE, STATE_NAMES } from './engine/gs';
import { stepsAhead, promote, waitWeeks, yearsStep1To10 } from './engine/career';
import { fers, mraMonths, fmtYM, supplement, ss62Estimate, fersCola, colaPath, sickLeaveMonths, high3, kindOf } from './engine/fers';
import { agencyMatch, missedMatch, deferralLimit } from './engine/tsp';

export const KIT = {
  P, GS, localityRate, countyCount: Object.values(COUNTIES.states).reduce((a, b) => a + b.length, 0), stateCount: Object.keys(COUNTIES.states).length, AREAS, CAP, RAISE, STATE_NAMES, area, areaBySlug, pay, pay2025, pay2027, table, countiesOfArea, countiesOf, areasInState, areaOf,
  steps: stepsAhead, promote, wait: waitWeeks, yearsTo10: yearsStep1To10,
  fers, mra: mraMonths, ym: fmtYM, supplement, ss62: ss62Estimate, cola: fersCola, colaPath, sick: sickLeaveMonths, high3, kindOf,
  match: agencyMatch, missed: missedMatch, limit: deferralLimit,
  tool: runTool, usd, usd2, pct, num: (x: number) => formatNumber(x, 0), dec: (x: number, d = 1) => formatDecimal(x, d), day: (iso: string) => displayDate(iso, 'en-US'),
};
export type Kit = typeof KIT;
