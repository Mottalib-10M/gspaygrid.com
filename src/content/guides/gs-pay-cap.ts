import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { PLANNED_AREAS } from '../../lib/planned';

const P = K.P;
const EX = P.pay.execSchedule2026;
const capped = (code: string) => K.table(code).flat().filter((x) => x >= K.CAP).length;
const firstCapped = (code: string) => { const t = K.table(code); for (let g = 0; g < 15; g++) for (let s = 0; s < 10; s++) if (t[g][s] >= K.CAP) return `GS-${g + 1} step ${s + 1}`; return ''; };
const list = [...K.AREAS].filter((a) => capped(a.code) > 0).sort((a, b) => capped(b.code) - capped(a.code) || b.pct - a.pct);
const total = K.AREAS.reduce((n, a) => n + capped(a.code), 0);
const sf = K.area('SF');
const sf1510 = K.pay(15, 10, 'SF'), raw = Math.round(sf1510.base * (1 + sf.pct / 100));
const g14 = K.pay(14, 10, 'SF'), g15dc10 = K.pay(15, 10, 'DCB');
const dcFirst = K.table('DCB')[14].findIndex((x) => x >= K.CAP) + 1;
const dcYears = Array.from({ length: dcFirst - 1 }, (_, i) => K.wait(i + 2)).reduce((a, b) => a + b, 0) / 52;
const gs14Areas = K.AREAS.filter((a) => K.table(a.code)[13].some((x) => x >= K.CAP)).map((a) => a.short);

export default defineGuide({
  id: 'gs-pay-cap', group: 'pay', order: 6, slug: 'gs-pay-cap',
  nav: 'GS pay cap', card: `${K.usd(K.CAP)} in ${P.year}: the Executive Schedule level IV rate, and the cells it holds back.`,
  title: 'GS Pay Cap 2026: $197,200 Limit and Every Capped Step',
  description: `GS pay cap 2026: no rate above ${K.usd(K.CAP)}, the Executive Schedule level IV pay. ${total} cells capped in ${list.length} locality areas. See whether your own step is held back.`,
  h1: 'GS pay cap 2026: the $197,200 limit and who it holds back',
  intro: 'Enter a grade, step and area: the calculator shows the rate the table would give without the cap and how far the cap cuts it.',
  resume: `No General Schedule employee can be paid more than the rate for level IV of the Executive Schedule, which is ${K.usd(K.CAP)} in ${P.year}, up from ${K.usd(P.pay.cap2025)} in 2025. The limit comes from 5 U.S.C. 5304(g) and applies to the rate of basic pay with locality. When the base rate times one plus the locality percentage goes above it, OPM's table prints ${K.usd(K.CAP)} instead. In ${P.year} that happens in ${total} cells of the ${K.AREAS.length} locality tables, spread over ${list.length} areas, all at GS-14 and GS-15. ${sf.short}, with the highest percentage, has ${capped('SF')} capped cells starting at ${firstCapped('SF')}; there, GS-15 step 10 would be ${K.usd(raw)} without the cap. An employee in a capped cell gains nothing from a step increase or a quality step increase, and in January ${P.year} received only the rise of the cap, ${K.usd(K.CAP - P.pay.cap2025)}, instead of the ${K.dec(K.RAISE, 1)} % raise.`,
  tool: 'cap',
  toolArg: { g: '15', s: '10', a: 'SF' },
  faqs: [
    { q: 'What is the maximum GS salary in 2026?', a: `${K.usd(K.CAP)} a year, the rate for level IV of the Executive Schedule. It is reached at the top steps of GS-15, and in ${sf.short} also at GS-14 step 10, in the areas with the highest locality percentages. In Rest of U.S. the highest rate is GS-15 step 10 at ${K.usd(K.pay(15, 10, 'RUS').annual)}, well below the cap.` },
    { q: 'Do capped GS employees still get step increases?', a: 'The step is granted on schedule and recorded on the SF-50, but the pay does not change while the higher step is also above the cap. The step matters later: if the cap rises enough, or if you move to an area with a lower percentage, the higher step pays more. It also counts as time served for the next step.' },
    { q: 'Does the pay cap reduce my FERS pension?', a: `Yes, indirectly. The high-3 is built from the rates you were actually paid, so a cap of ${K.usd(K.CAP)} caps your high-3 too. A GS-15 retiring in a capped cell with 30 years at the MRA has a basic annuity of at most ${K.usd(K.CAP * 0.3)} a year before survivor reductions, whatever the uncapped table would have given.` },
    { q: 'Will the GS pay cap rise in 2027?', a: `Only if the Executive Schedule rises. Level IV is set with the other Executive Schedule rates, and appropriations laws have often frozen them for several years at a time. The 2027 alternative pay plan proposes no raise. Until the 2027 Executive Schedule is published, we keep the cap at ${K.usd(K.CAP)} in every scenario.` },
  ],
  body: (h) => `
<h2>Where the limit comes from</h2>
<p>Section 5304(g) of title 5 says that locality pay may not raise a General Schedule rate above the rate for level IV of the Executive Schedule. The Executive Schedule is the pay system of political appointees and senior officials: level I is ${K.usd(EX.I)} in ${P.year}, level II ${K.usd(EX.II)}, level III ${K.usd(EX.III)}, level IV ${K.usd(EX.IV)} and level V ${K.usd(EX.V)}. Level IV is the ceiling for every GS employee in every area.</p>
<h2>The ${total} capped cells</h2>
${h.table(['Locality area', 'Percentage', 'Capped cells', 'First capped cell', 'GS-15 step 10 without cap'], list.map((a) => [PLANNED_AREAS.includes(a.slug) ? h.a(`area:${a.slug}`, a.short) : a.short, `${K.dec(a.pct, 2)} %`, String(capped(a.code)), firstCapped(a.code), K.usd(Math.round(K.GS.base[14][9] * (1 + a.pct / 100)))]), `${P.year} cells at or above ${K.usd(K.CAP)}, by area. Every other area has no capped cell.`, ['l', 'r', 'r', 'l', 'r'])}
<p>The pattern follows the percentage. GS-15 step 10 reaches the cap once the locality percentage passes ${K.dec((K.CAP / K.GS.base[14][9] - 1) * 100, 2)} %; below that, nothing is held back, and the higher the percentage, the lower the first capped step. ${gs14Areas.length === 1 ? `${gs14Areas[0]} is the only area where the cap reaches GS-14` : `The cap reaches GS-14 in ${gs14Areas.join(', ')}`}, at ${K.usd(g14.annual)} for step 10 in ${sf.short}.</p>
${h.mini('cap', { t: 'How close is your cell to the cap?', p: ['g', 's', 'a'], d: { g: '15', s: '5', a: 'DCB' } })}
<h2>Pay compression</h2>
<p>When several steps of the same grade pay the same, employees with very different seniority earn the same salary. In Washington, GS-15 step ${dcFirst} and GS-15 step 10 both pay ${K.usd(g15dc10.annual)}. A GS-14 step 10 promoted to GS-15 in ${sf.short} may get a raise of nothing at all, because both rates are capped. Supervisors can end up paid the same as the employees they supervise.</p>
<h2>What the cap does to raises</h2>
<p>For the ${P.year} adjustment, employees in uncapped cells received the ${K.dec(K.RAISE, 1)} % on their base rate. Employees in capped cells received the rise of level IV, from ${K.usd(P.pay.cap2025)} to ${K.usd(K.CAP)}, or ${K.pct(K.CAP / P.pay.cap2025 - 1, 2)}. In years when the Executive Schedule is frozen and the GS table rises, more cells become capped and capped employees get nothing. The ${h.a('federal-pay-raise-2027', '2027 page')} keeps the cap at its ${P.year} level in every scenario for that reason.</p>
<h2>How long until a step stops paying</h2>
<p>For a GS-15 in a high area, the useful question is how many step increases are left before the cap. In Washington, step ${dcFirst} is the first capped step, so a GS-15 hired at step 1 gains money from each increase until step ${dcFirst}, then nothing more until the cap moves. With on-time increases (52 weeks for steps 2 to 4, 104 weeks for steps 5 to 7, 156 weeks for steps 8 to 10), that is about ${K.dec(dcYears, 0)} years. The calculator on the ${h.a('gs-step-increase', 'step increase page')} gives the date of each increase from the time you have already served in your step.</p>
<p>Because the cap is a single number, it also hides differences between areas. A GS-15 step 10 is paid ${K.usd(K.CAP)} in every one of the ${list.filter((a) => K.table(a.code)[14][9] >= K.CAP).length} areas where that cell is capped, from ${K.area(list[list.length - 1].code).short} to ${sf.short}. Comparing job offers at the top of the scale therefore comes down to things other than salary: the location, the position's promotion potential, telework, and benefits.</p>
<h2>Benefits computed on capped pay</h2>
<p>Everything that is a percentage of basic pay follows the capped figure. Your TSP contributions and the agency's automatic and matching contributions are computed on ${K.usd(K.CAP)}, so the most a capped employee contributing 5 % can receive from the agency is ${K.usd(K.CAP * 0.05)} a year. Your FERS contribution is a percentage of the same figure, and so is your high-3 at retirement. Life insurance under FEGLI uses your annual rate of basic pay as well.</p>
<h2>Awards and incentives above the cap</h2>
<p>The cap limits the rate of basic pay. Performance awards, recruitment, relocation and retention incentives are paid on top of basic pay and are not limited by level IV, but by a separate aggregate limit on total pay in a calendar year, set at the rate for level I of the Executive Schedule, ${K.usd(EX.I)} in ${P.year}. Overtime and other premium pay have their own limit as well, described on the ${h.a('gs-hourly-pay', 'hourly pay page')}.</p>
<h2>Moving between areas</h2>
<p>A capped GS-15 moving from ${sf.short} to a lower area may keep the same salary even though the locality percentage falls, because the uncapped rate in the new area is still above the cap. Conversely, moving from Rest of U.S. to Washington at GS-15 step 10 raises pay only to ${K.usd(K.CAP)}, not to the ${K.usd(Math.round(K.GS.base[14][9] * (1 + K.area('DCB').pct / 100)))} the percentage would give. The ${h.a('locality-pay', 'locality pay page')} explains how your area is set, and the ${h.a('gs-15', 'GS-15 page')} shows the grade in every area.</p>
`,
  related: ['gs-15', 'gs-14', 'gs-pay-scale-2026', 'federal-pay-raise-2026', 'high-3-salary'],
  sources: ['usc_5304', 'opm_ex_2026', 'opm_gs_2026', 'eo_14368'],
});
