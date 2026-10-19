/**
 * The calculators of the site, one entry per subject. Every figure comes from the engine
 * (src/lib/engine/*), which reads gs-2026.json, counties-2026.json and params-2026.json.
 * A spec lists its inputs (visible first, `adv` ones folded) and a pure `run` that returns a result card.
 */
import P from '../data/params-2026.json';
import type { ToolSpec, V, Input, Opt } from './tool-types';
import { resolve } from './tool-types';
import { formatMoney, formatPercent, formatDecimal, formatNumber } from './format';
import { AREAS, area, pay, pay2025, pay2027, table as payTable, CAP, RAISE, STATE_NAMES, countiesOf, areaOf, RUS, HOURS_PER_YEAR } from './engine/gs';
import { stepsAhead, promote, waitWeeks } from './engine/career';
const svcYM = (mo: number) => { const y = Math.floor(mo / 12), m = mo % 12; return `${y} year${y === 1 ? '' : 's'}${m ? `, ${m} month${m > 1 ? 's' : ''}` : ''}`; };
import { fers, mraMonths, fmtYM, supplement, ss62Estimate, fersCola, colaPath, sickLeaveMonths, kindOf, type Survivor, type Plan } from './engine/fers';
import { agencyMatch, missedMatch, deferralLimit } from './engine/tsp';

export const usd = (x: number) => `${x < -0.5 ? '-' : ''}${formatMoney(Math.abs(Math.round(x)), 0)}`;
export const usd2 = (x: number) => formatMoney(x, 2);
export const pct = (x: number, d = 1) => formatPercent(x, d);
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k]);
const sign = (x: number) => (x >= 0 ? `+${usd(x)}` : usd(x));

/* ---------- shared inputs ---------- */
const GRADES: Opt[] = Array.from({ length: 15 }, (_, i) => ({ value: String(i + 1), label: `GS-${i + 1}` }));
const STEPS: Opt[] = Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: `Step ${i + 1}` }));
const gradeIn = (def = 12, id = 'g', label = 'Grade'): Input => ({ kind: 'select', id, label, def: String(def), options: GRADES });
const stepIn = (def = 1): Input => ({ kind: 'select', id: 's', label: 'Step', def: String(def), options: STEPS });
const AREA_OPTS: Opt[] = AREAS.map((a) => ({ value: a.code, label: `${a.short} (${formatDecimal(a.pct, 2)} %)` }));
const areaIn = (def = 'DCB', adv = false): Input => ({ kind: 'select', id: 'a', label: 'Locality pay area', def, options: AREA_OPTS, help: 'Set by your official worksite, not your home', adv });
const STATE_OPTS: Opt[] = Object.entries(STATE_NAMES).map(([k, v]) => ({ value: k, label: v })).sort((a, b) => a.label.localeCompare(b.label));
const stateIn = (def = 'DC'): Input => ({ kind: 'select', id: 'st', label: 'State of your worksite', def, options: STATE_OPTS });
const countyIn = (def = 'District of Columbia'): Input => ({
  kind: 'select', id: 'co', label: 'County or city', def,
  options: (v: V) => {
    const st = String(v.st);
    if (st === 'AK' || st === 'HI') return [{ value: 'all', label: `Anywhere in ${STATE_NAMES[st]}` }];
    return [...countiesOf(st).map(([c, code]) => ({ value: c, label: `${c} (${area(code).short})` })), { value: 'other', label: `Any other county in ${STATE_NAMES[st] ?? st}` }];
  },
  help: 'Counties outside every metro area are Rest of U.S.',
});
const where = (v: V) => areaOf(s(v, 'st'), s(v, 'co'));
const gs = (v: V) => ({ g: Number(v.g) || 1, st: Number(v.s) || 1 });

/* ---------- FERS inputs ---------- */
const BIRTH: Opt[] = Array.from({ length: 50 }, (_, i) => ({ value: String(1955 + i), label: String(1955 + i) }));
const birthIn = (def = 1970): Input => ({ kind: 'select', id: 'by', label: 'Year of birth', def: String(def), options: BIRTH });
const SURV: Opt[] = [{ value: 'none', label: 'None' }, { value: 'partial', label: '25 %' }, { value: 'full', label: '50 %' }];
const survIn = (def: Survivor = 'full', adv = false): Input => ({ kind: 'choice', id: 'sv', label: 'Survivor annuity', def, options: SURV, adv } as Input);
const PLAN: Opt[] = [{ value: 'regular', label: 'Regular FERS' }, { value: 'special', label: 'LEO, firefighter, ATC' }];
const ageMonths = (v: V, y = 'ra', m = 'rm') => Math.round(n(v, y) * 12 + n(v, m));

export const SPECS: Record<string, (arg?: Record<string, number | string>) => ToolSpec> = {
  /* Home: 2026 pay for grade, step and the locality of a county */
  gs: () => ({
    inputs: [gradeIn(12), stepIn(1), stateIn('DC'), countyIn('District of Columbia')],
    run: (v) => {
      const { g, st } = gs(v), code = where(v), a = area(code), p = pay(g, st, code), last = pay2025(g, st, code);
      const next = st < 10 ? pay(g, st + 1, code).annual - p.annual : 0;
      return {
        label: `GS-${g} step ${st}, ${a.short}, 2026`, value: usd(p.annual),
        sub: p.usesSpecial ? `Special rate table 001M applies: it is higher than the ${a.short} locality rate of ${usd(p.locality)}.` : p.capped ? `Capped at ${usd(CAP)}, the Executive Schedule level IV rate.` : `Base ${usd(p.base)} plus ${formatDecimal(a.pct, 2)} % locality pay.`,
        rows: [['Base pay (GS table)', usd(p.base), p.base], [`Locality payment, ${a.short}`, usd(p.annual - p.base), p.annual - p.base], ['Hourly rate', usd2(p.hourly)], ['Biweekly paycheck (gross, 80 hours)', usd2(p.biweekly)], ['Same cell in 2025', `${usd(last)} (${sign(p.annual - last)})`], ...(st < 10 ? [[`Next step (${waitWeeks(st + 1)} weeks in step)`, sign(next)] as [string, string]] : [])],
        note: code === RUS && s(v, 'st') !== 'AK' && s(v, 'st') !== 'HI' ? 'This county is outside every named locality area: Rest of U.S. rates apply.' : undefined,
      };
    },
  }),
  /* The full 15 x 10 table of one locality area */
  table: () => ({
    inputs: [areaIn('RUS'), { kind: 'choice', id: 'u', label: 'Show', def: 'yr', options: [{ value: 'yr', label: 'Annual' }, { value: 'hr', label: 'Hourly' }] } as Input],
    run: (v) => {
      const code = s(v, 'a'), a = area(code), t = payTable(code), hr = s(v, 'u') === 'hr';
      const lo = t[0][0], hi = Math.max(...t.flat());
      const capped = t.flat().filter((x) => x >= CAP).length;
      return {
        label: `2026 GS pay table, ${a.short}`, value: `${formatDecimal(a.pct, 2)} %`, sub: `Locality pay on top of the base table, frozen at its 2025 level. ${capped ? `${capped} cells stop at the ${usd(CAP)} cap.` : 'No cell reaches the pay cap.'}`,
        rows: [['GS-1 step 1', usd(lo)], ['GS-15 step 10', usd(hi)], ['Raise over 2025', pct(RAISE / 100, 1)]],
        table: { caption: `${a.name}: 2026 ${hr ? 'hourly' : 'annual'} rates, OPM table ${a.code}. GS-1 to GS-4 rates are raised to table 001M where it is higher.`, headers: ['Grade', ...Array.from({ length: 10 }, (_, i) => `Step ${i + 1}`)], align: ['l', ...Array(10).fill('r')], rows: t.map((r, g) => [`GS-${g + 1}`, ...r.map((x) => (hr ? usd2(Math.round((x / HOURS_PER_YEAR) * 100) / 100) : usd(x)))]) },
      };
    },
  }),
  /* County to locality area */
  lookup: () => ({
    inputs: [stateIn('VA'), countyIn('Fairfax County'), gradeIn(11)],
    run: (v) => {
      const code = where(v), a = area(code), g = Number(v.g) || 11, r = pay(g, 1, code), rus = pay(g, 1, RUS);
      return { label: 'Your locality pay area', value: a.short, sub: `${a.name}: ${formatDecimal(a.pct, 2)} % in 2026.`,
        rows: [[`GS-${g} step 1 here`, usd(r.annual), r.annual], [`GS-${g} step 1, Rest of U.S.`, usd(rus.annual), rus.annual], ['Difference per year', sign(r.annual - rus.annual)]] };
    },
  }),
  /* 2025 to 2026 */
  raise2026: () => ({
    inputs: [gradeIn(11), stepIn(5), areaIn('DCB')],
    run: (v) => {
      const { g, st } = gs(v), code = s(v, 'a'), now = pay(g, st, code).annual, before = pay2025(g, st, code);
      return { label: `Your 2026 raise, GS-${g} step ${st}`, value: sign(now - before), sub: `${usd(before)} in 2025, ${usd(now)} in 2026: ${pct(now / before - 1, 2)}.`,
        rows: [['2025 annual rate', usd(before), before], ['2026 annual rate', usd(now), now], ['Per biweekly paycheck', sign((now - before) / 26)], ['Locality percentage', `${formatDecimal(area(code).pct, 2)} % both years`]] };
    },
  }),
  /* 2027 scenario: never presented as a table */
  raise2027: () => ({
    inputs: [gradeIn(12), stepIn(3), areaIn('DCB'), { id: 'r', label: 'Across-the-board raise tested', def: P.pay.y2027.scenarioDefault, unit: '%', max: 10, decimals: 2, help: 'Scenario only: 2027 tables are not published' }, { id: 'l', label: 'Change of locality percentage', def: 0, unit: 'pts', max: 10, decimals: 2, adv: true, help: 'Points added to every area; 0 = frozen again' }],
    run: (v) => {
      const { g, st } = gs(v), code = s(v, 'a'), now = pay(g, st, code).annual, then = pay2027(g, st, code, n(v, 'r'), n(v, 'l'));
      return { label: 'Scenario for 2027 (not an official rate)', value: usd(then), sub: `${sign(then - now)} on your 2026 rate of ${usd(now)} if the raise is ${formatDecimal(n(v, 'r'), 2)} %.`,
        rows: [['2026 rate (official)', usd(now), now], ['2027 scenario', usd(then), then], ['Difference', sign(then - now)]], note: `Pay cap kept at the 2026 level of ${usd(CAP)} until the 2027 Executive Schedule is known.` };
    },
  }),
  /* Within-grade increases */
  wgi: () => ({
    inputs: [gradeIn(9), stepIn(2), { id: 'm', label: 'Months already in this step', def: 4, unit: 'mo', max: 200 }, areaIn('RUS', true)],
    run: (v) => {
      const { g, st } = gs(v), code = s(v, 'a'), rows = stepsAhead(g, st, n(v, 'm'), code);
      if (!rows.length) return { label: `GS-${g} step 10`, value: 'Top of the grade', sub: 'Further raises come from the annual increase or a promotion.', rows: [['2026 rate', usd(pay(g, 10, code).annual)]] };
      const first = rows[0];
      return { label: `Next step: step ${first.step}`, value: first.monthsFromNow < 0.5 ? 'Due now' : `in ${formatDecimal(Math.ceil(first.monthsFromNow), 0)} months`, sub: `${first.weeks} weeks in step ${st} are required, then ${sign(first.gain)} a year.`,
        rows: rows.slice(0, 3).map((r) => [`Step ${r.step} (${r.weeks} weeks)`, usd(r.annual)] as [string, string]),
        table: { headers: ['Step', 'Waiting period', 'Reached in about', '2026 rate', 'Gain'], align: ['l', 'r', 'r', 'r', 'r'], rows: rows.map((r) => [`Step ${r.step}`, `${r.weeks} weeks`, `${formatDecimal(Math.ceil(r.monthsFromNow), 0)} months`, usd(r.annual), sign(r.gain)]) } };
    },
  }),
  /* Promotion, two-step rule */
  promo: () => ({
    inputs: [gradeIn(11), stepIn(4), gradeIn(12, 'ng', 'Promoted to'), areaIn('RUS')],
    run: (v) => {
      const { g, st } = gs(v), ng = Math.max(g + 1, Number(v.ng) || g + 1), pr = promote(g, st, ng, s(v, 'a'));
      return { label: `Promotion to GS-${pr.to.grade}`, value: `Step ${pr.to.step}`, sub: `${usd(pr.to.annual)}, a raise of ${sign(pr.raise)} (${pct(pr.raisePct, 1)}).`,
        rows: [[`Now: GS-${g} step ${st}`, usd(pr.from.annual), pr.from.annual], ['Plus two step increases of your grade', usd(pr.twoStepTarget), pr.twoStepTarget], [`New rate: GS-${pr.to.grade} step ${pr.to.step}`, usd(pr.to.annual), pr.to.annual], ['Waiting period for the next step', 'starts again']],
        note: pr.capped ? 'The two-step result is above step 10 of the new grade: step 10 is the most you can get.' : undefined };
    },
  }),
  /* Hourly and overtime */
  hourly: () => ({
    inputs: [gradeIn(7), stepIn(1), areaIn('RUS'), { id: 'ot', label: 'Overtime hours per pay period', def: 8, unit: 'h', max: 120 }],
    run: (v) => {
      const { g, st } = gs(v), p = pay(g, st, s(v, 'a')), ot = n(v, 'ot');
      return { label: `GS-${g} step ${st}, hourly`, value: usd2(p.hourly), sub: `Annual rate divided by ${formatNumber(HOURS_PER_YEAR)} hours. Overtime: ${usd2(p.overtime)} an hour.`,
        rows: [['Regular 80 hours', usd2(p.biweekly), p.biweekly], [`Overtime, ${formatDecimal(ot, 1)} hours`, usd2(p.overtime * ot), p.overtime * ot], ['Gross for the pay period', usd2(p.biweekly + p.overtime * ot)], ['Overtime rule', p.overtime > p.hourly * 1.49 ? 'time and a half' : 'capped at 1.5 x GS-10 step 1']] };
    },
  }),
  /* Pay cap */
  cap: () => ({
    inputs: [gradeIn(15), stepIn(10), areaIn('SF')],
    run: (v) => {
      const { g, st } = gs(v), code = s(v, 'a'), p = pay(g, st, code), raw = Math.round(p.base * (1 + area(code).pct / 100));
      return { label: `GS-${g} step ${st} in ${area(code).short}`, value: usd(p.annual), sub: p.capped ? `Capped: the table would give ${usd(raw)}, ${usd(raw - CAP)} above the limit.` : `${usd(CAP - p.annual)} below the ${usd(CAP)} cap.`,
        rows: [['Base rate', usd(p.base)], ['Uncapped locality rate', usd(raw)], ['Pay cap (EX-IV)', usd(CAP)], ['Cells capped in this area', String(payTable(code).flat().filter((x) => x >= CAP).length)]] };
    },
  }),

  /* ---------- FERS ---------- */
  fers: () => ({
    inputs: [
      birthIn(1970), { id: 'ra', label: 'Age when you leave', def: 57, unit: 'yrs', max: 80 }, { id: 'sy', label: 'Years of creditable service', def: 30, unit: 'yrs', max: 50 },
      { id: 'h3', label: 'High-3 average salary', def: 110000, unit: '$', max: 400000, help: 'Basic pay with locality, best 3 consecutive years', wide: true },
      survIn('full'), { kind: 'choice', id: 'pl', label: 'Plan', def: 'regular', options: PLAN } as Input,
      { id: 'rm', label: 'Extra months of age', def: 0, unit: 'mo', max: 11, adv: true }, { id: 'sm', label: 'Extra months of service', def: 0, unit: 'mo', max: 11, adv: true },
      { id: 'sick', label: 'Unused sick leave', def: 1200, unit: 'h', max: 10000, adv: true, help: '2,087 hours add one year to the computation' },
      { id: 'ss', label: 'Your Social Security estimate at 62', def: 0, unit: '$/mo', max: 6000, adv: true, help: 'From your SSA statement; 0 = we estimate it' },
      { id: 'earn', label: 'Wages after you retire, per year', def: 0, unit: '$', max: 1000000, adv: true, help: 'Reduces the supplement above the SSA limit' },
      { id: 'start', label: 'Start a postponed or deferred annuity at', def: 0, unit: 'yrs', max: 70, adv: true, help: '0 = as early as allowed (deferred: 62)' },
      { kind: 'choice', id: 'eo', label: 'Early-out offer (VERA or DSR)', def: 'no', options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }], adv: true } as Input,
    ],
    run: (v) => {
      const by = Number(v.by), age = ageMonths(v), svc = Math.round(n(v, 'sy') * 12 + n(v, 'sm'));
      const ss = n(v, 'ss') > 0 ? n(v, 'ss') : ss62Estimate(n(v, 'h3'), Math.max(n(v, 'sy'), Math.min(35, n(v, 'ra') - 22))).at62;
      const r = fers({ birthYear: by, retireAgeMonths: age, serviceMonths: svc, high3: n(v, 'h3'), sickHours: n(v, 'sick'), plan: s(v, 'pl') as Plan, survivor: s(v, 'sv') as Survivor, ss62: ss, earnings: n(v, 'earn'), startAgeMonths: n(v, 'start') > 0 ? n(v, 'start') * 12 : undefined, earlyOut: s(v, 'eo') === 'yes' });
      if (!r.eligible) return { label: 'FERS annuity', value: usd(0), sub: r.rule, rows: [['Your MRA', fmtYM(r.mra)]] };
      const rows: Array<[string, string, number?]> = [
        [`Basic annuity (${svcYM(r.serviceCounted)} counted)`, usd(r.gross), r.gross],
        ...(r.reduction > 0 ? [[`Age reduction (${pct(r.ageReductionPct, 1)})`, `-${usd(r.reduction)}`, r.reduction] as [string, string, number]] : []),
        ...(r.survivorCut > 0 ? [['Survivor benefit cost', `-${usd(r.survivorCut)}`, r.survivorCut] as [string, string, number]] : []),
        ...(r.supplement > 0 ? [[`FERS supplement until 62${r.supplementAfterTest < r.supplement ? ' (after the earnings test)' : ''}`, `${usd(r.supplementAfterTest / 12)}/mo`, r.supplementAfterTest] as [string, string, number]] : []),
        ['Your MRA', fmtYM(r.mra)],
        ...(r.survivorAnnuity > 0 ? [['Survivor would receive', `${usd(Math.floor(r.survivorAnnuity / 12))}/mo`] as [string, string]] : []),
      ];
      return { label: `${r.label}, from age ${fmtYM(r.startAge)}`, value: `${usd(Math.floor(r.net / 12))}/mo`, sub: `${usd(r.net)} a year${r.supplementAfterTest > 0 ? `, plus ${usd(r.supplementAfterTest / 12)}/mo of supplement ${r.supplementStarts > r.startAge ? `from age ${fmtYM(r.supplementStarts)} (your MRA) ` : ''}until 62` : ''}.`, rows, note: `${r.rule}.${n(v, 'ss') > 0 ? '' : ` Social Security at 62 estimated at ${usd(ss)}/mo from your high-3; type your SSA figure for a better supplement.`}` };
    },
  }),
  /* Minimum retirement age */
  mra: () => ({
    inputs: [birthIn(1968), { id: 'sy', label: 'Years of service at your MRA', def: 25, unit: 'yrs', max: 50 }],
    run: (v) => {
      const by = Number(v.by), m = mraMonths(by), svc = n(v, 'sy') * 12, k = kindOf(m, svc, m);
      return { label: `MRA for someone born in ${by}`, value: `${fmtYM(m)}`, sub: `You reach it in ${by + Math.floor(m / 12)}${m % 12 ? `, ${m % 12} months after your ${Math.floor(m / 12)}th birthday` : ''}.`,
        rows: [['With 30 years at the MRA', 'unreduced, with supplement'], ['With 10 to 29 years', 'reduced 5 % a year under 62, or postponed'], ['At the MRA with your service', k.rule]] };
    },
  }),
  /* MRA+10 reduced vs postponed */
  mra10: () => ({
    inputs: [birthIn(1972), { id: 'sy', label: 'Years of service', def: 18, unit: 'yrs', max: 50 }, { id: 'h3', label: 'High-3 average salary', def: 95000, unit: '$', max: 400000 }, { id: 'start', label: 'Start the annuity at', def: 57, unit: 'yrs', max: 62 }],
    run: (v) => {
      const by = Number(v.by), m = mraMonths(by), svc = n(v, 'sy') * 12, start = Math.max(m, n(v, 'start') * 12);
      const now = fers({ birthYear: by, retireAgeMonths: m, serviceMonths: svc, high3: n(v, 'h3'), startAgeMonths: start });
      const at60 = fers({ birthYear: by, retireAgeMonths: m, serviceMonths: svc, high3: n(v, 'h3'), startAgeMonths: 60 * 12 });
      const at62 = fers({ birthYear: by, retireAgeMonths: m, serviceMonths: svc, high3: n(v, 'h3'), startAgeMonths: 62 * 12 });
      return { label: `MRA+10, annuity from ${fmtYM(start)}`, value: `${usd(Math.floor(now.net / 12))}/mo`, sub: now.ageReductionPct > 0 ? `Reduced ${pct(now.ageReductionPct, 1)} for starting before 62.` : 'No reduction at this starting age.',
        rows: [['Unreduced annuity', `${usd(Math.floor(now.gross / 12))}/mo`, now.gross], [`Starting at ${fmtYM(start)}`, `${usd(Math.floor(now.net / 12))}/mo`, now.net], ['Postponed to 60', `${usd(Math.floor(at60.net / 12))}/mo`, at60.net], ['Postponed to 62', `${usd(Math.floor(at62.net / 12))}/mo`, at62.net]], note: kindOf(m, svc, m).kind === 'immediate' ? 'With 30 years at your MRA you qualify for an unreduced annuity: MRA+10 does not apply.' : undefined };
    },
  }),
  /* FERS supplement and earnings test */
  supplement: () => ({
    inputs: [{ id: 'ss', label: 'Social Security estimate at 62', def: 1900, unit: '$/mo', max: 6000, help: 'From your SSA statement, at age 62' }, { id: 'fy', label: 'Years of FERS civilian service', def: 30, unit: 'yrs', max: 45 }, { id: 'earn', label: 'Wages after retiring, per year', def: 0, unit: '$', max: 1000000 }],
    run: (v) => {
      const x = supplement(n(v, 'ss'), n(v, 'fy'), n(v, 'earn'));
      return { label: 'FERS supplement until 62', value: `${usd(x.afterMonthly)}/mo`, sub: `${usd(n(v, 'ss'))} x ${x.years} / 40 = ${usd(x.monthly)} a month before the earnings test.`,
        rows: [['Supplement per year', usd(x.yearly), x.yearly], [`Earnings test (above ${usd(P.ssa.earningsTest.exempt2026)})`, x.cut ? `-${usd(x.cut)}` : usd(0), x.cut], ['Paid per year', usd(x.after), x.after], ['Wages that wipe it out', usd(x.zeroAt)]] };
    },
  }),
  /* Earnings test alone */
  earnings: () => ({
    inputs: [{ id: 'sup', label: 'Your supplement', def: 1300, unit: '$/mo', max: 5000 }, { id: 'earn', label: 'Wages or self-employment income', def: 40000, unit: '$', max: 1000000 }],
    run: (v) => {
      const yearly = n(v, 'sup') * 12, cut = Math.min(yearly, Math.max(0, Math.floor((n(v, 'earn') - P.ssa.earningsTest.exempt2026) / 2)));
      return { label: 'Supplement after the 2026 earnings test', value: `${usd((yearly - cut) / 12)}/mo`, sub: `$1 withheld for every $2 earned above ${usd(P.ssa.earningsTest.exempt2026)}.`,
        rows: [['Supplement before the test', usd(yearly), yearly], ['Withheld', cut ? `-${usd(cut)}` : usd(0), cut], ['Kept', usd(yearly - cut), yearly - cut], ['Earnings at which it is gone', usd(P.ssa.earningsTest.exempt2026 + 2 * yearly)]] };
    },
  }),
  /* Survivor election */
  survivor: () => ({
    inputs: [{ id: 'ann', label: 'Unreduced annuity', def: 3200, unit: '$/mo', max: 20000 }, survIn('full'), { id: 'yrs', label: 'Years the survivor may outlive you', def: 8, unit: 'yrs', max: 40, adv: true }],
    run: (v) => {
      const a = n(v, 'ann'), o = s(v, 'sv'), F = P.fers.survivor;
      const cost = o === 'full' ? F.fullCost : o === 'partial' ? F.partialCost : 0, ben = o === 'full' ? F.fullBenefit : o === 'partial' ? F.partialBenefit : 0;
      const breakEvenYears = ben ? (a * cost) / (a * ben) : 0;
      return { label: 'Your annuity after the survivor election', value: `${usd(a * (1 - cost))}/mo`, sub: ben ? `Your survivor would receive ${usd(a * ben)} a month for life, plus COLAs.` : 'No survivor annuity: payments stop at your death.',
        rows: [['Cost per month', usd(a * cost), a * cost], ['Survivor annuity per month', usd(a * ben), a * ben], ['Survivor years to recover each year of cost', ben ? formatDecimal(breakEvenYears, 2) : 'n/a'], [`Survivor total over ${n(v, 'yrs')} years`, usd(a * ben * 12 * n(v, 'yrs'))]] };
    },
  }),
  /* COLA */
  cola: () => ({
    inputs: [{ id: 'ann', label: 'Annuity at retirement', def: 36000, unit: '$/yr', max: 400000 }, { id: 'age', label: 'Age at retirement', def: 57, unit: 'yrs', max: 80 }, { id: 'cpi', label: 'Inflation (CPI-W) each year', def: 2.8, unit: '%', max: 15, decimals: 1 }, { kind: 'choice', id: 'pl', label: 'Plan', def: 'regular', options: PLAN, adv: true } as Input],
    run: (v) => {
      const sp = s(v, 'pl') === 'special', cpi = n(v, 'cpi') / 100, path = colaPath(n(v, 'ann'), n(v, 'age') * 12, 20, cpi, sp ? 'special' : 'regular'), at = (k: number) => path[Math.min(k, path.length - 1)];
      return { label: `FERS COLA when inflation is ${formatDecimal(n(v, 'cpi'), 1)} %`, value: pct(fersCola(cpi), 1), sub: `${sp ? 'Paid every year at any age under the special provisions' : 'Paid from age 62 on a regular annuity'}. Social Security and CSRS would get ${pct(cpi, 1)}.`,
        rows: [[`Annuity at ${at(10).age}`, usd(at(10).fers)], [`Annuity at ${at(20).age}`, usd(at(20).fers), at(20).fers], [`With full CPI at ${at(20).age}`, usd(at(20).csrsLike), at(20).csrsLike], ['Purchasing power lost after 20 years', pct(1 - at(20).fers / at(20).csrsLike, 1)]],
        table: { headers: ['Age', 'FERS annuity', 'If indexed to the full CPI'], align: ['l', 'r', 'r'], rows: path.filter((_, k) => k % 2 === 0).map((r) => [String(r.age), usd(r.fers), usd(r.csrsLike)]) } };
    },
  }),
  /* High-3 */
  high3: () => ({
    inputs: [gradeIn(12), stepIn(5), areaIn('DCB'), { id: 'yrs', label: 'Years before you retire', def: 3, unit: 'yrs', max: 10 }, { id: 'r', label: 'Yearly raise assumed', def: 1, unit: '%', max: 10, decimals: 1, adv: true }],
    run: (v) => {
      const { g, st } = gs(v), now = pay(g, st, s(v, 'a')).annual, k = Math.max(1, n(v, 'yrs')), r = n(v, 'r') / 100;
      const sal = Array.from({ length: k }, (_, i) => now * (1 + r) ** i);
      const last3 = sal.slice(-3), h = k >= 3 ? (last3[0] + last3[1] + last3[2]) / 3 : (now * (3 - k) + sal.reduce((a, b) => a + b, 0)) / 3;
      return { label: 'Estimated high-3', value: usd(h), sub: `Average of your last three years of basic pay with locality, at ${pct(r, 1)} a year.`,
        rows: [['Pay now', usd(now), now], ['Pay in your last year', usd(sal[sal.length - 1]), sal[sal.length - 1]], ['Annuity per year of service (1 %)', usd(h * 0.01)]] };
    },
  }),
  /* Sick leave credit */
  sick: () => ({
    inputs: [{ id: 'hrs', label: 'Unused sick leave at retirement', def: 1500, unit: 'h', max: 10000 }, { id: 'h3', label: 'High-3 average salary', def: 105000, unit: '$', max: 400000 }, { kind: 'choice', id: 'mul', label: 'Multiplier', def: '1', options: [{ value: '1', label: '1 %' }, { value: '1.1', label: '1.1 %' }] } as Input],
    run: (v) => {
      const mo = sickLeaveMonths(n(v, 'hrs')), gain = (n(v, 'h3') * (Number(v.mul) / 100) * mo) / 12;
      return { label: 'Service your sick leave adds', value: `${formatNumber(mo)} months`, sub: `${usd(gain)} a year on your annuity, for life.`,
        rows: [['Hours', formatNumber(n(v, 'hrs')), n(v, 'hrs')], ['Years and months', fmtYM(mo)], ['Annuity gained per month', usd(gain / 12)]], note: 'Counts in the computation of an immediate annuity only: never toward the 20 or 30 years you need to retire.' };
    },
  }),
  /* TSP agency contributions */
  tsp: () => ({
    inputs: [{ id: 'sal', label: 'Basic pay per year', def: 85000, unit: '$', max: 400000 }, { id: 'c', label: 'You contribute', def: 5, unit: '%', max: 100, decimals: 1 }, { id: 'age', label: 'Your age', def: 45, unit: 'yrs', max: 90, adv: true }],
    run: (v) => {
      const x = agencyMatch(n(v, 'sal'), n(v, 'c')), miss = missedMatch(n(v, 'sal'), n(v, 'c')), lim = deferralLimit(n(v, 'age'));
      return { label: 'Agency money into your TSP each year', value: usd(x.agency), sub: miss > 0 ? `You leave ${usd(miss)} of matching on the table: the full match needs 5 %.` : 'You receive the full 4 % match plus the automatic 1 %.',
        rows: [['Your contributions', usd(x.employee), x.employee], ['Agency automatic 1 %', usd(x.auto), x.auto], ['Agency matching', usd(x.match), x.match], [`Your 2026 limit at age ${n(v, 'age')}`, usd(lim.total)]], note: x.employee > lim.total ? 'Your contributions exceed the 2026 limit: payroll stops them when the limit is reached, and the match stops with them.' : undefined };
    },
  }),
  /* FERS employee contribution */
  contrib: () => ({
    inputs: [{ id: 'sal', label: 'Basic pay per year', def: 75000, unit: '$', max: 400000 }, { kind: 'select', id: 'cat', label: 'First hired under FERS', def: 'frae', options: [{ value: 'fers', label: 'Before 2013 (FERS)' }, { value: 'rae', label: 'In 2013 (FERS-RAE)' }, { value: 'frae', label: '2014 or later (FERS-FRAE)' }] }],
    run: (v) => {
      const r = (P.fers.employeeRate as Record<string, number>)[s(v, 'cat')], y = n(v, 'sal') * r;
      return { label: 'Your FERS deduction', value: `${usd(y / 26)} per paycheck`, sub: `${pct(r, 1)} of basic pay, ${usd(y)} a year.`, rows: [['FERS (before 2013)', pct(P.fers.employeeRate.fers, 1)], ['FERS-RAE (2013)', pct(P.fers.employeeRate.rae, 1)], ['FERS-FRAE (2014 on)', pct(P.fers.employeeRate.frae, 1)], ['Your yearly contribution', usd(y), y]] };
    },
  }),
};
/** A spec with its defaults overridden by `arg` (same keys as the input ids). */
export function getTool(kind: string, arg?: Record<string, number | string>): ToolSpec {
  const f = SPECS[kind];
  if (!f) throw new Error(`Unknown tool ${kind}`);
  const spec = f(arg);
  if (!arg) return spec;
  return { ...spec, inputs: spec.inputs.map((i) => (arg[i.id] === undefined ? i : ({ ...i, def: arg[i.id] } as typeof i))) };
}
/** Run a calculator with its defaults (or the values given), the way the page renders it. */
export function runTool(kind: string, args: V = {}) {
  const spec = getTool(kind);
  const v: V = resolve(spec.inputs, { ...Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])), ...args });
  return spec.run(v);
}
export const TOOL_KINDS = Object.keys(SPECS);
