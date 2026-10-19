import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const eo = P.pay.eo;
const cell = (g: number, s: number, c: string) => { const now = K.pay(g, s, c).annual, was = K.pay2025(g, s, c); return { now, was, gain: now - was }; };
const a = cell(11, 5, 'DCB'), b = cell(7, 1, 'RUS'), c = cell(13, 1, 'NY'), top = cell(15, 10, 'SF');
const gains = K.AREAS.flatMap((x) => Array.from({ length: 15 }, (_, g) => Array.from({ length: 10 }, (_, s) => cell(g + 1, s + 1, x.code))).flat());
const zero = gains.filter((x) => x.gain === 0).length;
const maxGain = Math.max(...gains.map((x) => x.gain));

export default defineGuide({
  id: 'federal-pay-raise-2026', group: 'pay', order: 2, slug: 'federal-pay-raise-2026',
  nav: 'Federal pay raise 2026', card: `${K.dec(K.RAISE, 1)} % on the base table from January 11, 2026, locality frozen.`,
  title: 'Federal Pay Raise 2026: 1 % for GS, Locality Pay Frozen',
  description: `Federal pay raise 2026: ${K.dec(K.RAISE, 1)} % on the GS base table from January 11, locality frozen at 2025 levels (EO ${eo.number}). Your exact gain per year and per paycheck.`,
  h1: 'Federal pay raise 2026: what the 1 % gave each grade, step and area',
  intro: 'Pick your grade, step and area: the calculator compares the official 2025 and 2026 rates and gives the gain per paycheck.',
  resume: `General Schedule employees received a ${K.dec(K.RAISE, 1)} % raise in ${P.year}. Executive Order ${eo.number}, signed on ${K.day(eo.signed)} and published on ${K.day(eo.published)}, raised the base table by ${K.dec(K.RAISE, 1)} % and kept every one of the ${K.AREAS.length} locality percentages at its 2025 level. The new rates took effect on the first day of the first pay period beginning on or after January 1, 2026, which for most agencies was ${K.day(eo.effective)}. Because locality pay is a percentage of the base rate, every locality rate also rose by about ${K.dec(K.RAISE, 1)} %: a GS-11 step 5 in Washington went from ${K.usd(a.was)} to ${K.usd(a.now)}, ${K.usd(a.gain)} more a year or about ${K.usd(a.gain / 26)} per biweekly paycheck. The order also allowed OPM to raise certain law enforcement personnel by up to ${K.dec(P.pay.leo2026.upToTotalRaise, 1)} % in total. Employees held at the ${K.usd(K.CAP)} cap gained only the rise of the cap.`,
  tool: 'raise2026',
  toolArg: { g: '11', s: '5', a: 'DCB' },
  faqs: [
    { q: 'When did the 2026 federal pay raise take effect?', a: `On the first day of the first pay period beginning on or after January 1, 2026. For agencies on the standard biweekly calendar that was January 11, 2026, so the first paycheck with the new rate arrived in late January. Hours worked from January 1 to January 10 were paid at the 2025 rates.` },
    { q: 'Why did my locality pay not go up in 2026?', a: `The percentage did not change, but the dollar amount did. Executive Order ${eo.number} kept every locality percentage at its 2025 level, so ${K.dec(K.area('RUS').pct, 2)} % stays ${K.dec(K.area('RUS').pct, 2)} % in Rest of U.S. Since the percentage applies to a base rate that rose ${K.dec(K.RAISE, 1)} %, the locality payment in dollars rose by the same ${K.dec(K.RAISE, 1)} %.` },
    { q: 'Did federal law enforcement officers get more than 1 % in 2026?', a: `The executive order directed OPM to assess a total increase of up to ${K.dec(P.pay.leo2026.upToTotalRaise, 1)} %, the ${K.dec(K.RAISE, 1)} % included, for certain federal civilian law enforcement personnel. OPM carries this out through special rate tables for the covered positions, published on its 2026 law enforcement page. Whether you are covered depends on your occupation and agency, not on your grade alone.` },
    { q: 'Does the 2026 raise count toward my FERS high-3?', a: `Yes. The high-3 uses basic pay with locality, so every dollar of the January 2026 increase enters your average from the day it is paid. For someone retiring at the end of 2026, the raise lifts the last year of the three. With a 1 % multiplier and 30 years, each $1,000 of high-3 adds $300 to the yearly annuity.` },
    { q: 'Was there a pay raise for federal employees at the pay cap?', a: `Only the rise of the cap itself. The cap is the rate of Executive Schedule level IV, which went from ${K.usd(P.pay.cap2025)} in 2025 to ${K.usd(K.CAP)} in 2026. A GS-15 step 10 in ${K.area('SF').short} was held at the cap in both years, so the raise was ${K.usd(top.gain)}, about ${K.pct(top.gain / top.was, 2)}, rather than the ${K.dec(K.RAISE, 1)} % others received.` },
  ],
  body: (h) => `
<h2>The legal path to 1 %</h2>
<p>The Federal Employees Pay Comparability Act sets a formula for each January: an across-the-board raise equal to the rise in the Employment Cost Index minus half a point, plus locality payments meant to close the gap with non-federal pay. The formula almost always produces large numbers, and every year the President uses the authority of 5 U.S.C. 5303(b) and 5304a to send Congress an alternative plan instead. For ${P.year}, the alternative pay plan letter of ${K.day(eo.alternativePlanLetter)} announced ${K.dec(K.RAISE, 1)} % with no locality increase. Congress did not pass a different figure, and Executive Order ${eo.number} put the plan into effect. OPM then sent agencies its pay memo, ${eo.memo}, and the tables followed; the formal notice of the January ${P.year} schedules appeared in the Federal Register on ${K.day(eo.fedRegNotice)}.</p>
<h2>What it means for each cell</h2>
<p>Every base rate was multiplied by 1.01 and rounded to the dollar. Locality rates were then rebuilt from the new base rates with the 2025 percentages. The result is a raise of almost exactly ${K.dec(K.RAISE, 1)} % in every one of the ${K.num(gains.length)} cells of the ${K.AREAS.length} tables, with two exceptions. Cells already held at the cap in 2025 moved only to the new cap. And GS-1 to GS-4 cells paid from special table 001M followed that table, not the locality rule. The largest gain in dollars is ${K.usd(maxGain)} a year${zero ? `, and ${zero} cells did not change at all` : ''}.</p>
${h.table(['Grade and area', '2025', '2026', 'Gain per year', 'Per paycheck'], [
  ['GS-7 step 1, Rest of U.S.', K.usd(b.was), K.usd(b.now), K.usd(b.gain), K.usd2(b.gain / 26)],
  ['GS-11 step 5, Washington DC', K.usd(a.was), K.usd(a.now), K.usd(a.gain), K.usd2(a.gain / 26)],
  ['GS-13 step 1, New York', K.usd(c.was), K.usd(c.now), K.usd(c.gain), K.usd2(c.gain / 26)],
  [`GS-15 step 10, ${K.area('SF').short}`, K.usd(top.was), K.usd(top.now), K.usd(top.gain), K.usd2(top.gain / 26)],
], 'Official 2025 and 2026 annual rates. A paycheck here is one of 26 biweekly pay periods, before deductions.', ['l', 'r', 'r', 'r', 'r'])}
<h2>Your paycheck in January</h2>
<p>A biweekly paycheck is 80 hours at the hourly rate, which is the annual rate divided by ${K.num(2087)} and rounded to the cent. A ${K.dec(K.RAISE, 1)} % raise therefore adds about one hundredth of the old gross pay. Deductions move too: FERS contributions, TSP percentages, FEHB premiums for ${P.year} and federal and state withholding all changed in January, so the net gain on the leave and earnings statement is usually smaller than the gross gain, and can be negative when a health plan premium rose more than the raise.</p>
${h.mini('raise2026', { t: 'Your own 2025 to 2026 change', p: ['g', 's', 'a'], d: { g: '9', s: '3', a: 'HOU' } })}
<h2>Checking that your agency applied it</h2>
<p>Agencies process the annual adjustment as a mass personnel action, so most employees received an SF-50 dated January 11, ${P.year} with nature of action "pay adjustment". Three blocks matter. The basic pay should be the base rate of your grade and step in the ${P.year} table; the locality adjustment should be that base rate times your area's percentage, rounded; and the adjusted basic pay is their sum, or ${K.usd(K.CAP)} if the sum is higher. If your adjusted basic pay differs from the cell shown by the calculator above, look first at the pay plan and the pay rate determinant: a special rate, a retained rate or a law enforcement table each lead to a different figure, and none of them is an error.</p>
<p>The second check is the leave and earnings statement for the first full pay period of the year. The gross for 80 hours should equal the new hourly rate times 80. Hours of overtime, night work or holiday work in that period are paid at premium rates computed from the new hourly rate as well. If the first January statement still shows the 2025 rate, the adjustment usually arrives as a retroactive correction a pay period or two later; there is nothing to claim.</p>
<p>A within-grade increase or a promotion that fell on the same day is applied after the annual adjustment, on the new table. Someone promoted on January 11 was therefore placed in the higher grade using the ${P.year} rates, which the ${h.a('gs-promotion-calculator', 'promotion calculator')} uses as well.</p>
<h2>The frozen locality percentages</h2>
<p>A frozen locality percentage keeps the gap between areas unchanged in relative terms. Rest of U.S. stays at ${K.dec(K.area('RUS').pct, 2)} %, ${K.area('SF').short} at ${K.dec(K.area('SF').pct, 2)} %. The ${h.a('locality-pay', 'locality pay page')} shows each area's counties and its rank.</p>
<h2>Other schedules</h2>
<p>The same order set the ${P.year} Executive Schedule, with level IV at ${K.usd(K.CAP)} and level I at ${K.usd(P.pay.execSchedule2026.I)}, and adjusted other statutory pay systems. Wage grade employees under the Federal Wage System follow separate wage surveys and are not covered by these tables. Military basic pay rose by a different percentage set under title 37.</p>
<h2>And the retirees?</h2>
<p>The January ${P.year} pay raise applies to employees, not to annuitants. FERS retirees aged 62 or older received a cost-of-living adjustment of ${K.pct(P.fers.cola.y2026.fers, 1)}, under the diet COLA rule that gives 2 % when inflation is between 2 and 3 %; Social Security rose ${K.pct(P.fers.cola.y2026.ss, 1)}. The ${h.a('fers-cola', 'COLA page')} explains the gap. For January 2027, the President proposes no pay raise at all; see the ${h.a('federal-pay-raise-2027', '2027 raise page')}.</p>
`,
  related: ['federal-pay-raise-2027', 'gs-pay-scale-2026', 'locality-pay', 'gs-pay-cap', 'high-3-salary'],
  sources: ['eo_14368', 'cpm_2025_18', 'fr_pay_2026', 'opm_gs_2026', 'opm_leo_2026', 'opm_ex_2026', 'usc_5304'],
});
