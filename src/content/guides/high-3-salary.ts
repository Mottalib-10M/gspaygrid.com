import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.P.fers;
const p0 = (x: number) => `${K.dec(x * 100, 0)} %`;
const dc = K.area('DCB');
const g12 = K.pay(12, 5, 'DCB').annual, g12last = K.pay2025(12, 5, 'DCB');
const pr = K.promote(12, 5, 13, 'DCB');
const h0 = K.high3([g12, g12, g12]);
const h1 = K.high3([g12, g12, pr.to.annual]);
const h2 = K.high3([g12, pr.to.annual, pr.to.annual]);
const h3 = K.high3([pr.to.annual, pr.to.annual, pr.to.annual]);
const ann = (h: number, years = 30) => h * years * F.regular.base;
const dc13 = K.pay(13, 5, 'DCB').annual, rus13 = K.pay(13, 5, 'RUS').annual;
const hMove = K.high3([dc13, dc13, dc13, rus13, rus13]);
const top = K.pay(15, 10, 'DCB');

export default defineGuide({
  id: 'high-3-salary', group: 'fers', order: 7, slug: 'high-3-salary',
  nav: 'High-3 salary', card: 'Your highest 3 consecutive years of basic pay with locality: what counts, what does not, and what a late promotion adds.',
  title: 'High-3 Salary 2026: What Counts for Your FERS Annuity',
  description: 'High-3 salary 2026 for FERS: the highest 3 consecutive years of basic pay with locality, no overtime or bonuses. Examples: late promotion, locality move, cap.',
  h1: 'High-3 salary in 2026: how OPM averages your pay for the FERS annuity',
  intro: 'Your high-3 is one of the three numbers in the FERS formula, and the one you can still move in your last years. Pick your grade, step and area to estimate it.',
  resume: `Your high-3 is the highest average basic pay you earned during any three consecutive years of creditable service. Basic pay means the rate of your GS grade and step plus locality pay, so a GS-12 step 5 in the Washington DC area counts ${K.usd(g12)} in ${K.P.year}, with the ${K.dec(dc.pct, 2)} % locality included. Overtime, bonuses, awards and allowances do not count. The three years are usually the last three, but they can be any three in a row. Each dollar of high-3 is worth ${p0(F.regular.base)} per year of service in the annuity: with 30 years, a ${K.usd(1000)} higher high-3 adds ${K.usd(ann(1000))} a year for life. A promotion to GS-13 one year before retiring lifts the high-3 from ${K.usd(h0)} to ${K.usd(h1)}; held for three full years, the new rate of ${K.usd(pr.to.annual)} becomes the whole high-3. The pay cap of ${K.usd(K.CAP)} in ${K.P.year} also caps the high-3. With fewer than three years of service, OPM averages all of it.`,
  tool: 'high3',
  toolArg: { g: '12', s: '5', a: 'DCB', yrs: 3 },
  faqs: [
    { q: 'Does locality pay count in the FERS high-3?', a: `Yes. Locality pay is part of basic pay for retirement, so it is in your high-3 and you pay FERS contributions on it. That is why the same grade and step give a larger annuity in a high-locality area: GS-13 step 5 is ${K.usd(dc13)} in the Washington DC area and ${K.usd(rus13)} in Rest of U.S. in ${K.P.year}.` },
    { q: 'Does overtime count toward my high-3?', a: 'No. OPM says basic pay for the high-3 does not include overtime, bonuses and similar payments. Awards, cash incentives, the lump sum for annual leave and most allowances are left out too. Only the rate of basic pay you held, with locality, and the time you held it, enter the average. Working extra hours in your last year raises your take-home pay but not your annuity.' },
    { q: 'Do my high-3 years have to be my last three years?', a: `No. OPM takes the highest average over any three consecutive years. Someone who moves from a ${K.usd(dc13)} job in Washington DC to the same grade in Rest of U.S., at ${K.usd(rus13)}, two years before retiring keeps a high-3 of ${K.usd(hMove)} from the earlier years. The years must be consecutive, but they need not be calendar years.` },
    { q: 'Is it worth taking a promotion one year before retirement?', a: `Usually yes, if the pay rises. In our GS-12 to GS-13 example, one year at the new rate lifts the high-3 by ${K.usd(h1 - h0)}, which adds ${K.usd(ann(h1 - h0))} a year to a 30-year annuity. Three full years would add ${K.usd(ann(h3 - h0))}. Staying longer after the promotion lets the higher rate fill the whole three-year window.` },
  ],
  body: (h) => `
<h2>The definition</h2>
<p>${h.src('opm_fers_computation', "OPM's computation page")} defines the high-3 as the highest average basic pay you earned during any three consecutive years of service. Basic pay is the rate set for your position: for a GS employee, the grade and step rate of the ${h.a('gs-pay-scale-2026', 'GS pay table')} plus ${h.a('locality-pay', 'locality pay')}. The average is weighted by time: if you held one rate for eight months and another for four, each counts for that share of the year. The handbook worksheets round the result to the nearest dollar.</p>
<h2>What is in, what is out</h2>
${h.table(['Payment', 'In the high-3?'], [
  ['GS base rate of your grade and step', 'Yes'],
  ['Locality pay', 'Yes'],
  ['Within-grade and quality step increases', 'Yes, from the date they take effect'],
  ['Overtime', 'No'],
  ['Bonuses, awards, cash incentives', 'No'],
  ['Lump-sum payment for unused annual leave', 'No'],
], 'Basic pay for the FERS computation, as described by OPM.', ['l', 'l'])}
<p>Basic pay is also what your FERS contribution is taken from each pay period, which is a quick way to check: the payments that carry the FERS deduction on your leave and earnings statement are, in general, the ones in your high-3. If your service is shorter than three years, OPM averages your basic pay over all your periods of creditable service.</p>
${h.mini('high3', { t: 'Estimate your high-3', p: ['g', 's', 'a', 'yrs'], d: { g: '12', s: '5', a: 'DCB', yrs: 3 } })}
<h2>Example: three years at the same grade</h2>
<p>A GS-12 step 5 in the Washington DC area earned ${K.usd(g12last)} in 2025 and earns ${K.usd(g12)} in ${K.P.year}, after the ${K.dec(K.RAISE, 1)} % raise. If that rate held for the three years before retirement, the high-3 would be ${K.usd(h0)}, and a 30-year annuity at ${p0(F.regular.base)} would be ${K.usd(ann(h0))} a year. Every raise and every step increase inside the three-year window feeds into the average for the part of the window it covers, which is why the calculator lets you assume a yearly raise.</p>
<h2>Example: a promotion near the end</h2>
<p>Suppose the same employee is promoted to GS-13. Under the two-step rule, the new rate is GS-13 step ${pr.to.step}, ${K.usd(pr.to.annual)}. The effect on the high-3 depends on how much of the window the new rate fills.</p>
${h.table(['Time at GS-13 before retiring', 'High-3', '30-year annuity'], [
  ['None', K.usd(h0), K.usd(ann(h0))],
  ['1 year', K.usd(h1), K.usd(ann(h1))],
  ['2 years', K.usd(h2), K.usd(ann(h2))],
  ['3 years', K.usd(h3), K.usd(ann(h3))],
], `GS-12 step 5 to GS-13 step ${pr.to.step}, Washington DC, ${K.P.year} rates held constant.`, ['l', 'r', 'r'])}
<p>A late promotion is still worth having: one year adds ${K.usd(ann(h1 - h0))} a year for life to a 30-year annuity. But the full value arrives only when you stay three years at the higher rate. People who are close to an MRA with 30 years sometimes delay retirement by a year or two for this reason. The ${h.a('gs-promotion-calculator', 'promotion calculator')} shows the step you land on.</p>
<h2>Example: a move to a lower locality</h2>
<p>Because the three years can be any three in a row, moving to a lower-paid area at the end of a career does not destroy the high-3. A GS-13 step 5 who works in Washington DC at ${K.usd(dc13)} and then transfers to a Rest of U.S. location at ${K.usd(rus13)} for the last two years keeps a high-3 of ${K.usd(hMove)}, from the earlier years, as long as raises in the meantime do not change the comparison. The same reasoning applies to a voluntary change to a lower grade.</p>
<h2>Timing your last three years</h2>
<p>Three dates move the high-3 without any promotion. The annual raise takes effect with the first pay period beginning on or after January 1: in ${K.P.year} that was ${K.day(K.P.pay.eo.effective)}, so leaving in early January can mean leaving just before or just after a new rate. A within-grade increase falls due after a fixed waiting period, ${K.wait(4)} weeks for steps 2 to 4, ${K.wait(5)} for steps 5 to 7 and ${K.wait(8)} for steps 8 to 10, and a step that lands a few weeks after your planned date may be worth waiting for. For 2027, nothing is official: the President's plan of August 2026 proposes a ${K.P.pay.y2027.planRaise} % raise and no locality change, so a high-3 that runs into 2027 should be estimated as a scenario, not a projection. The ${h.a('gs-step-increase', 'step increase page')} gives the waiting periods in detail.</p>
<h2>The pay cap</h2>
<p>GS pay, locality included, cannot exceed Executive Schedule level IV, ${K.usd(K.CAP)} in ${K.P.year}. The high-3 is computed on the pay actually set, so it cannot exceed the cap either. A GS-15 step 10 in the Washington DC area is at ${K.usd(top.annual)}; its high-3 over three capped years cannot go higher. The ${h.a('gs-pay-cap', 'pay cap page')} lists the cells that hit it.</p>
<h2>How it enters the annuity</h2>
<p>The annuity is the high-3 times your years of service times ${p0(F.regular.base)}, or ${K.dec(F.regular.enhanced * 100, 1)} % if you leave at ${F.regular.enhancedAge} or later with ${F.regular.enhancedYears} years. A survivor annuity is a share of that annuity, so the high-3 also sets what a spouse would receive. Put your estimate in the ${h.a('fers-retirement-calculator', 'FERS retirement calculator')} to see the whole result, and check the ${h.a('method', 'method page')} for the assumptions. Your official high-3 is the one OPM computes from the pay history your payroll office certifies.</p>
`,
  related: ['fers-retirement-calculator', 'opm-retirement-calculator', 'gs-promotion-calculator', 'locality-pay', 'gs-pay-cap'],
  sources: ['opm_fers_computation', 'opm_handbook_50', 'usc_8415', 'opm_gs_2026'],
});
