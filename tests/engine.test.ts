/**
 * Engine tests. The pay tests replay the official OPM files (research/opm-2026-tables.json, rebuilt from
 * the XML of opm.gov by scripts/data/build-pay-tables.py): every annual, hourly and overtime rate of the
 * 58 locality tables must come out of the engine to the cent.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { AREAS, pay, pay2025, localityRate, BASE, CAP, areaOf, special001M, countiesOfArea, pay2027, area } from '../src/lib/engine/gs';
import P from '../src/data/params-2026.json';
import { stepsAhead, promote, yearsStep1To10 } from '../src/lib/engine/career';
import { fers, mraMonths, supplement, fersCola, sickLeaveMonths, ss62Estimate, kindOf, high3, colaPath } from '../src/lib/engine/fers';
import { agencyMatch, deferralLimit } from '../src/lib/engine/tsp';
import { TOOL_KINDS, runTool } from '../src/lib/tool-specs';

const OPM = JSON.parse(readFileSync('research/opm-2026-tables.json', 'utf8')) as { base: number[][]; areas: Array<{ code: string; pct: number; annual: number[][]; hourly: number[][]; capped: boolean[][] }> };
const xmlOT = (code: string) => {
  const t = readFileSync(`research/opm-2026-xml/${code}.xml`, 'utf8');
  return [...t.matchAll(/<Grade>([\s\S]*?)<\/Grade>/g)].map((g) => [...g[1].matchAll(/<Overtime>([\d.]+)<\/Overtime>[\s\S]*?<Value>(\d+)<\/Value>/g)].sort((a, b) => +a[2] - +b[2]).map((m) => +m[1]));
};

describe('GS tables against the OPM files', () => {
  it('58 locality areas, base table 15 x 10, cap 197,200', () => {
    expect(AREAS).toHaveLength(58);
    expect(BASE).toEqual(OPM.base);
    expect(CAP).toBe(197200);
  });
  it('every locality cell (8,700) to the dollar, every hourly rate to the cent', () => {
    let cells = 0;
    for (const a of OPM.areas) for (let g = 1; g <= 15; g++) for (let s = 1; s <= 10; s++) {
      const want = a.annual[g - 1][s - 1];
      expect(localityRate(BASE[g - 1][s - 1], a.pct), `${a.code} GS-${g}/${s}`).toBe(want);
      if (g > 4) { expect(pay(g, s, a.code).annual).toBe(want); expect(pay(g, s, a.code).hourly).toBe(a.hourly[g - 1][s - 1]); }
      cells++;
    }
    expect(cells).toBe(8700);
  });
  it('overtime rates of every table match the OPM XML (GS-5 and up)', () => {
    for (const a of OPM.areas) { const ot = xmlOT(a.code); for (let g = 5; g <= 15; g++) for (let s = 1; s <= 10; s++) expect(pay(g, s, a.code).overtime, `${a.code} ${g}/${s}`).toBeCloseTo(ot[g - 1][s - 1], 2); }
  });
  it('capped flag matches OPM', () => {
    for (const a of OPM.areas) for (let g = 1; g <= 15; g++) for (let s = 1; s <= 10; s++) if (g > 4) expect(pay(g, s, a.code).capped, `${a.code} ${g}/${s}`).toBe(a.capped[g - 1][s - 1]);
  });
  it('GS-1 to GS-4: table 001M overrides lower locality rates', () => {
    expect(special001M(1, 1)).toBe(35048);
    expect(pay(1, 1, 'RUS').annual).toBe(35048);
    expect(pay(1, 1, 'RUS').usesSpecial).toBe(true);
    expect(special001M(4, 6)).toBeNull();
    expect(pay(4, 6, 'RUS').usesSpecial).toBe(false);
    // San Francisco GS-4 step 1: locality rate above the special rate
    expect(pay(4, 1, 'SF').annual).toBe(Math.max(37193, OPM.areas.find((a) => a.code === 'SF')!.annual[3][0]));
  });
  it('2025 -> 2026: 1 % on the base, locality percentages unchanged', () => {
    for (const a of AREAS) expect(a.prevPct).toBe(a.pct);
    const r = pay(12, 1, 'DCB').annual / pay2025(12, 1, 'DCB') - 1;
    expect(r).toBeGreaterThan(0.0095); expect(r).toBeLessThan(0.0105);
    expect(pay2027(12, 1, 'DCB', 0)).toBe(pay(12, 1, 'DCB').annual);
  });
  it('known cells', () => {
    expect(pay(12, 1, 'DCB').annual).toBe(OPM.areas.find((a) => a.code === 'DCB')!.annual[11][0]);
    expect(pay(15, 10, 'SF').annual).toBe(197200);
    expect(pay(7, 1, 'RUS').biweekly).toBeCloseTo(pay(7, 1, 'RUS').hourly * 80, 2);
  });
});

describe('locality definitions', () => {
  it('counties map to their area, the rest to Rest of U.S.', () => {
    expect(areaOf('DC', 'District of Columbia')).toBe('DCB');
    expect(areaOf('VA', 'Fairfax County')).toBe('DCB');
    expect(areaOf('CA', 'San Francisco County')).toBe('SF');
    expect(areaOf('AR', 'other')).toBe('RUS');
    expect(areaOf('AK', 'all')).toBe('AK');
    expect(areaOf('HI', 'all')).toBe('HI');
  });
  it('every named area has at least one county', () => {
    for (const a of AREAS) if (!['RUS', 'AK', 'HI'].includes(a.code)) expect(countiesOfArea(a.code).length, a.code).toBeGreaterThan(0);
  });
});

describe('steps and promotions', () => {
  it('step 1 to 10 takes 18 years', () => expect(yearsStep1To10()).toBe(18));
  it('waiting periods 52, 104, 156 weeks', () => {
    const r = stepsAhead(9, 1, 0, 'RUS');
    expect(r.map((x) => x.weeks)).toEqual([52, 52, 52, 104, 104, 104, 156, 156, 156]);
  });
  it('two-step rule: GS-11 step 4 to GS-12', () => {
    const p = promote(11, 4, 12, 'RUS');
    expect(p.twoStepTarget).toBe(pay(11, 6, 'RUS').annual);
    expect(pay(12, p.to.step, 'RUS').annual).toBeGreaterThanOrEqual(p.twoStepTarget);
    if (p.to.step > 1) expect(pay(12, p.to.step - 1, 'RUS').annual).toBeLessThan(p.twoStepTarget);
  });
  it('promotion never goes past step 10', () => expect(promote(14, 10, 15, 'RUS').to.step).toBeLessThanOrEqual(10));
  it('two-step rule uses table 001M at GS-1 to GS-3 and never cuts pay', () => {
    for (let g = 1; g <= 14; g++) for (let s = 1; s <= 10; s++) for (const c of ['RUS', 'DCB', 'SF']) {
      const p = promote(g, s, g + 1, c);
      expect(p.to.annual, `GS-${g}/${s} ${c}`).toBeGreaterThanOrEqual(p.from.annual);
    }
    expect(promote(1, 3, 2, 'RUS').twoStepTarget).toBe(pay(1, 5, 'RUS').annual);
  });
  it('GS-1 and GS-2 from step 9 or 10: two times the step 9 to 10 increase (531.214(d)(6))', () => {
    const inc = BASE[1][9] - BASE[1][8];
    expect(promote(2, 10, 3, 'NY').twoStepTarget).toBe(Math.max(localityRate(BASE[1][9] + 2 * inc, area('NY').pct), BASE[1][9] + 2 * inc + (P.pay.special001M.rates[1][9] - BASE[1][9])));
  });
});

describe('FERS', () => {
  it('MRA table of 5 U.S.C. 8412(h)', () => {
    expect(mraMonths(1947)).toBe(55 * 12);
    expect(mraMonths(1950)).toBe(55 * 12 + 6);
    expect(mraMonths(1960)).toBe(56 * 12);
    expect(mraMonths(1966)).toBe(56 * 12 + 4);
    expect(mraMonths(1970)).toBe(57 * 12);
    expect(mraMonths(1990)).toBe(57 * 12);
  });
  it('kinds of retirement', () => {
    expect(kindOf(57 * 12, 30 * 12, 57 * 12).kind).toBe('immediate');
    expect(kindOf(60 * 12, 20 * 12, 57 * 12).kind).toBe('immediate');
    expect(kindOf(62 * 12, 5 * 12, 57 * 12).kind).toBe('immediate');
    expect(kindOf(57 * 12, 15 * 12, 57 * 12).kind).toBe('mra10');
    expect(kindOf(45 * 12, 8 * 12, 57 * 12).kind).toBe('deferred');
    expect(kindOf(52 * 12, 22 * 12, 57 * 12, 'regular', true).kind).toBe('earlyout');
    expect(kindOf(50 * 12, 20 * 12, 57 * 12, 'special').kind).toBe('immediate');
  });
  it('OPM-style example: high-3 100,000, 30 years at 57: 30,000 a year', () => {
    const r = fers({ birthYear: 1970, retireAgeMonths: 57 * 12, serviceMonths: 360, high3: 100000 });
    expect(r.gross).toBeCloseTo(30000, 6);
  });
  it('1.1 % at 62 with 20 years', () => {
    const r = fers({ birthYear: 1964, retireAgeMonths: 62 * 12, serviceMonths: 240, high3: 80000 });
    expect(r.multiplier).toBe(0.011);
    expect(r.gross).toBeCloseTo(17600, 6);
    expect(fers({ birthYear: 1964, retireAgeMonths: 61 * 12 + 11, serviceMonths: 300, high3: 80000 }).multiplier).toBe(0.01);
  });
  it('MRA+10: 5 % a year under 62, none when postponed to 62', () => {
    const r = fers({ birthYear: 1970, retireAgeMonths: 57 * 12, serviceMonths: 15 * 12, high3: 90000 });
    expect(r.kind).toBe('mra10');
    expect(r.ageReductionPct).toBeCloseTo(0.25, 9);
    expect(r.net).toBeCloseTo(13500 * 0.75, 6);
    const p = fers({ birthYear: 1970, retireAgeMonths: 57 * 12, serviceMonths: 15 * 12, high3: 90000, startAgeMonths: 62 * 12 });
    expect(p.ageReductionPct).toBe(0);
    // from 60 with 20 years, no reduction
    expect(fers({ birthYear: 1970, retireAgeMonths: 57 * 12, serviceMonths: 22 * 12, high3: 90000, startAgeMonths: 60 * 12 }).ageReductionPct).toBe(0);
  });
  it('survivor: 10 % for 50 %, 5 % for 25 %', () => {
    const r = fers({ birthYear: 1970, retireAgeMonths: 57 * 12, serviceMonths: 360, high3: 100000, survivor: 'full' });
    expect(r.net).toBeCloseTo(27000, 6);
    expect(r.survivorAnnuity).toBeCloseTo(15000, 6);
    expect(fers({ birthYear: 1970, retireAgeMonths: 57 * 12, serviceMonths: 360, high3: 100000, survivor: 'partial' }).net).toBeCloseTo(28500, 6);
  });
  it('special provisions: 1.7 % for 20 years, 1 % after', () => {
    const r = fers({ birthYear: 1975, retireAgeMonths: 50 * 12, serviceMonths: 25 * 12, high3: 120000, plan: 'special' });
    expect(r.gross).toBeCloseTo(120000 * (0.017 * 20 + 0.01 * 5), 6);
  });
  it('sick leave: 2,087 hours = 12 months, computation only', () => {
    expect(sickLeaveMonths(2087)).toBe(12);
    expect(sickLeaveMonths(1043)).toBe(5);
    const r = fers({ birthYear: 1970, retireAgeMonths: 57 * 12, serviceMonths: 360, high3: 100000, sickHours: 2087 });
    expect(r.serviceCounted).toBe(372);
    // sick leave never makes 29 years count as 30 for eligibility
    expect(fers({ birthYear: 1970, retireAgeMonths: 57 * 12, serviceMonths: 29 * 12, high3: 100000, sickHours: 4000 }).kind).toBe('mra10');
  });
  it('supplement: SS at 62 x years / 40, earnings test 1 for 2 above the exempt amount', () => {
    const x = supplement(2000, 30, 0);
    expect(x.monthly).toBe(1500);
    const y = supplement(2000, 30, 34480);
    expect(y.cut).toBe(5000);
    expect(y.after).toBe(18000 - 5000);
    expect(supplement(2000, 30, 1e6).after).toBe(0);
  });
  it('no supplement for MRA+10 or after 62', () => {
    expect(fers({ birthYear: 1970, retireAgeMonths: 57 * 12, serviceMonths: 15 * 12, high3: 90000, ss62: 2000 }).supplement).toBe(0);
    expect(fers({ birthYear: 1964, retireAgeMonths: 62 * 12, serviceMonths: 25 * 12, high3: 90000, ss62: 2000 }).supplement).toBe(0);
    expect(fers({ birthYear: 1970, retireAgeMonths: 57 * 12, serviceMonths: 30 * 12, high3: 90000, ss62: 2000 }).supplement).toBe(18000);
  });
  it('diet COLA', () => {
    expect(fersCola(0.015)).toBeCloseTo(0.015, 9);
    expect(fersCola(0.028)).toBeCloseTo(0.02, 9);
    expect(fersCola(0.032)).toBeCloseTo(0.022, 9);
    expect(fersCola(0.087)).toBeCloseTo(0.077, 9);
    const p = colaPath(30000, 57 * 12, 10, 0.03);
    expect(p[4].fers).toBe(30000); // age 61: no COLA before 62
    expect(p[5].fers).toBeCloseTo(30000 * 1.02, 6);
    const sp = colaPath(30000, 50 * 12, 3, 0.03, 'special');
    expect(sp[1].fers).toBeCloseTo(30000 * 1.02, 6); // 8462(c)(3): special provisions, COLA before 62
  });
  it('SSA estimate and high-3', () => {
    const e = ss62Estimate(100000, 35);
    expect(e.aime).toBe(8333);
    expect(e.at62).toBeLessThan(e.pia);
    expect(high3([90000, 95000, 100000, 99000])).toBeCloseTo((95000 + 100000 + 99000) / 3, 6);
  });
});

describe('FERS edge cases from 5 U.S.C. 8415', () => {
  it('special plan but deferred: 1 %, not 1.7 %', () => {
    const r = fers({ birthYear: 1981, retireAgeMonths: 45 * 12, serviceMonths: 15 * 12, high3: 100000, plan: 'special', startAgeMonths: 62 * 12 });
    expect(r.kind).toBe('deferred');
    expect(r.multiplier).toBeCloseTo(0.01, 9);
  });
  it('deferred with 30 years started at the MRA: no reduction (8415(h)(2))', () => {
    const r = fers({ birthYear: 1970, retireAgeMonths: 52 * 12, serviceMonths: 30 * 12, high3: 100000, startAgeMonths: 57 * 12 });
    expect(r.ageReductionPct).toBe(0);
  });
});

describe('TSP', () => {
  it('5 % gets the full 4 % match plus 1 %', () => {
    const x = agencyMatch(100000, 5);
    expect(x.agency).toBeCloseTo(5000, 6);
    expect(agencyMatch(100000, 3).match).toBeCloseTo(3000, 6);
    expect(agencyMatch(100000, 4).match).toBeCloseTo(3500, 6);
    expect(agencyMatch(100000, 0).agency).toBeCloseTo(1000, 6);
  });
  it('2026 limits', () => {
    expect(deferralLimit(40).total).toBe(24500);
    expect(deferralLimit(55).total).toBe(32500);
    expect(deferralLimit(61).total).toBe(35750);
  });
});

describe('every calculator renders a result with its defaults', () => {
  for (const k of TOOL_KINDS) it(k, () => {
    const r = runTool(k);
    expect(r.value).not.toMatch(/NaN|undefined|Infinity/);
    for (const row of r.rows) expect(row[1], `${k} ${row[0]}`).not.toMatch(/NaN|undefined|Infinity/);
  });
});
