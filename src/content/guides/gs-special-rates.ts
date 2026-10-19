import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const R = P.pay.special001M.rates as Array<Array<number | null>>;
const count = (code: string) => { let n = 0; for (let g = 1; g <= 4; g++) for (let s = 1; s <= 10; s++) if (K.pay(g, s, code).usesSpecial) n++; return n; };
const byCount = [...K.AREAS].sort((a, b) => count(a.code) - count(b.code));
const least = byCount[0], most = byCount[byCount.length - 1];
const rus = K.area('RUS');
const g1 = K.pay(1, 1, 'RUS'), g2 = K.pay(2, 1, 'RUS'), g4 = K.pay(4, 6, 'RUS'), g3ny = K.pay(3, 1, 'NY'), g3sf = K.pay(3, 1, 'SF');
const incr = (g: number) => (R[g - 1][1] as number) - (R[g - 1][0] as number);

export default defineGuide({
  id: 'gs-special-rates', group: 'pay', order: 7, slug: 'gs-special-rates',
  nav: 'Special rate table 001M', card: `GS-1 to GS-4 paid at least ${K.usd(R[0][0] as number)} anywhere in the U.S. in ${P.year}.`,
  title: 'GS Special Rates 2026: Table 001M for GS-1 to GS-4 Pay',
  description: `GS special rates 2026: table 001M pays GS-1 to GS-4 at least ${K.usd(R[0][0] as number)} anywhere in the U.S. when it beats the locality rate. Every cell, and when it applies.`,
  h1: 'GS special rates 2026: how table 001M lifts GS-1 to GS-4 pay',
  intro: 'Choose a low grade and a county: the calculator tells you whether the locality table or special table 001M sets your pay.',
  resume: `Special rate table 001M is a nationwide table that OPM sets for General Schedule grades 1 to 4. It applies to every GS employee whose official worksite is in the United States, territories and possessions included, whenever its rate is higher than the employee's locality rate at the same grade and step. In ${P.year} it starts at ${K.usd(R[0][0] as number)} for GS-1 step 1 and ends at ${K.usd(R[3][4] as number)} for GS-4 step 5; steps 6 to 10 of GS-4 are blank, because the Rest of U.S. locality rates are already higher there. The effect is large at the bottom: a GS-1 step 1 in Rest of U.S. would earn ${K.usd(g1.locality)} under the locality rule and is paid ${K.usd(g1.annual)} from table 001M. In areas with high locality percentages the table matters less: in ${least.short}, only ${count(least.code)} of the 40 cells from GS-1 to GS-4 follow it, against ${count(most.code)} in ${most.short}. Our calculators apply 001M automatically. The table includes the ${K.dec(K.RAISE, 1)} % January ${P.year} increase.`,
  tool: 'gs',
  toolArg: { g: '2', s: '1', st: 'AR', co: 'other' },
  faqs: [
    { q: 'Who is covered by special rate table 001M?', a: `Every General Schedule employee at GS-1, GS-2, GS-3 or GS-4 whose official worksite is in the United States, its territories or its possessions, in any agency and any occupation. The table applies only when its rate is higher than the locality rate of the same grade and step, so in high-paying areas some cells follow the locality table instead.` },
    { q: 'Why is GS-4 step 6 not on the 2026 special rate table?', a: `OPM leaves steps 6 to 10 of GS-4 blank because the Rest of U.S. locality rates are already higher than what the special rate would give there. A GS-4 step 6 in Rest of U.S. is paid ${K.usd(g4.annual)} from the locality table. Every other area has a higher percentage, so the locality table wins there too.` },
    { q: 'Does a special rate count for FERS and the TSP?', a: 'Yes. A special rate under 5 U.S.C. 5305 is basic pay for retirement, life insurance and the TSP, just like a locality rate. Your high-3 uses the higher rate you were actually paid. It also sets the hourly rate, so overtime, night differential and holiday pay are computed from it.' },
    { q: 'Are there other GS special rate tables besides 001M?', a: 'Yes, many. OPM approves special rate tables for occupations that agencies have trouble recruiting or keeping, such as some engineering, medical, information technology and law enforcement positions, often limited to certain areas. Each table has its own number and applies only to the series, grades and locations it lists. Your SF-50 shows the table number when one applies.' },
  ],
  body: (h) => `
<h2>The ${P.year} table</h2>
${h.table(['Grade', 'Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5', 'Step 6', 'Step 7', 'Step 8', 'Step 9', 'Step 10'], R.map((r, i) => [`GS-${i + 1}`, ...r.map((x) => (x == null ? 'n/a' : K.usd(x)))]), `Special rate table 001M, effective the first pay period beginning on or after January 1, ${P.year}. n/a: not covered, the locality rate applies.`, ['l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>Inside each grade the steps are evenly spaced, by ${K.usd(incr(1))} at GS-1, ${K.usd(incr(2))} at GS-2, ${K.usd(incr(3))} at GS-3 and ${K.usd(incr(4))} at GS-4. Those are also the amounts of a within-grade increase for an employee paid from the table. The waiting periods between steps are the same as on any General Schedule table: 52, 104 and 156 weeks.</p>
<h2>Locality rate or special rate: the comparison</h2>
<p>For each grade and step, the payroll system computes the locality rate of your area, the base rate times one plus the percentage, and compares it with 001M. You are paid the higher one, and your SF-50 shows the pay rate determinant for a special rate when 001M wins. In Rest of U.S., at ${K.dec(rus.pct, 2)} %, the special rate wins in ${count('RUS')} of the 40 cells. In New York a GS-3 step 1 is paid ${K.usd(g3ny.annual)}${g3ny.usesSpecial ? ' from the special table' : ' from the locality table, which is higher'}; in ${K.area('SF').short}, ${K.usd(g3sf.annual)}${g3sf.usesSpecial ? ' from the special table' : ' from the locality table'}.</p>
${h.table(['Area', 'Locality %', 'Cells paid from 001M (of 40)'], byCount.filter((_, i) => i < 6 || i >= byCount.length - 4).map((a) => [a.short, `${K.dec(a.pct, 2)} %`, String(count(a.code))]), 'GS-1 to GS-4 cells that follow 001M in each area, fewest and most.', ['l', 'r', 'r'])}
${h.mini('gs', { t: 'Is your GS-1 to GS-4 cell on the special table?', p: ['g', 's', 'st', 'co'], d: { g: '3', s: '4', st: 'NY', co: 'Kings County' } })}
<h2>Hourly pay on the special table</h2>
<p>Many GS-1 to GS-4 positions are part-time, seasonal or student jobs paid by the hour, so the hourly figure is often the one that matters. It is computed like any other: the annual special rate divided by ${K.num(2087)}, rounded to the cent. GS-1 step 1 on 001M is ${K.usd2(g1.hourly)} an hour, GS-2 step 1 ${K.usd2(g2.hourly)}, GS-3 step 1 ${K.usd2(K.pay(3, 1, 'RUS').hourly)} and GS-4 step 1 ${K.usd2(K.pay(4, 1, 'RUS').hourly)}. Overtime at these grades is always time and a half, since every rate is far below GS-10 step 1. A part-time employee earns these rates for the hours in the scheduled tour, and a seasonal employee keeps the same table from one season to the next.</p>
<p>Because 001M is a single national table, an employee at these grades who moves from Rest of U.S. to most metro areas sees little or no change in pay. Moving to an area where the locality rate beats 001M is what makes the difference, which in ${P.year} happens mostly at GS-3 and GS-4 in the areas with the highest percentages.</p>
<h2>Why the table exists</h2>
<p>The General Schedule base table rises by the same percentage every year at all grades, while entry-level wages outside government have risen faster in many places. Without 001M, the lowest grades in Rest of U.S. would fall below what agencies need to hire clerks, aides and trainees. Under 5 U.S.C. 5305, OPM can set higher rates for any group of positions when pay elsewhere makes recruitment or retention hard; 001M is the broadest use of that power, covering every agency and occupation at the bottom of the scale.</p>
<h2>What it means for promotions</h2>
<p>A promotion from a grade on the special table to a higher grade uses the two-step rule applied to the rates that include the special rate. For low grades, the result can be smaller than a promotion higher up, because the special rates of GS-2, GS-3 and GS-4 are close to each other: step 1 of GS-2 is ${K.usd(g2.annual)}, step 1 of GS-3 ${K.usd(R[2][0] as number)} in Rest of U.S. The ${h.a('gs-promotion-calculator', 'promotion calculator')} applies the table automatically, and the pages for ${h.a('gs-1', 'GS-1')}, ${h.a('gs-2', 'GS-2')}, ${h.a('gs-3', 'GS-3')} and ${h.a('gs-4', 'GS-4')} show the grade in every area.</p>
<h2>Occupational special rates</h2>
<p>Table 001M is one of many special rate tables. Others cover specific occupations, sometimes nationwide and sometimes in a list of areas, and they usually reach higher grades. Law enforcement officers have their own tables, which in ${P.year} carried a raise of up to ${K.dec(P.pay.leo2026.upToTotalRaise, 1)} % under Executive Order ${P.pay.eo.number}. This site computes the General Schedule tables and 001M only. If your SF-50 shows another table number, look it up in the OPM special rates database: the rates there replace the ones on this page for your position.</p>
<h2>Retirement and benefits</h2>
<p>A special rate is basic pay for every purpose. It counts in the high-3, sets the TSP contribution base and the FERS contribution, and fixes the hourly rate for overtime. An employee who spends the last three years of a career on the special table retires on the special rates, which the ${h.a('high-3-salary', 'high-3 calculator')} handles if you enter those figures.</p>
`,
  related: ['gs-pay-scale-2026', 'gs-1', 'gs-2', 'gs-3', 'gs-4', 'gs-promotion-calculator'],
  sources: ['opm_001m', 'opm_gs_2026', 'opm_leo_2026', 'eo_14368'],
});
