import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { PLANNED_AREAS } from '../../lib/planned';

const P = K.P;
const B = K.GS.base;
const rus = K.area('RUS'), sf = K.area('SF'), dc = K.area('DCB');
const sorted = [...K.AREAS].sort((a, b) => b.pct - a.pct);
const cappedIn = (code: string) => K.table(code).flat().filter((x) => x >= K.CAP).length;
const areasWithCap = K.AREAS.filter((a) => cappedIn(a.code) > 0).length;
const g9 = K.pay(9, 1, 'RUS'), g9sf = K.pay(9, 1, 'SF');
const sp = K.pay(2, 1, 'RUS');

export default defineGuide({
  id: 'gs-pay-scale-2026', group: 'pay', order: 1, slug: 'gs-pay-scale-2026',
  nav: 'GS pay scale 2026', card: `Base table, ${K.AREAS.length} locality tables, ${K.dec(K.RAISE, 1)} % raise, ${K.usd(K.CAP)} cap.`,
  title: 'GS Pay Scale 2026: Base Table and All 58 Locality Tables',
  description: `GS pay scale 2026: the base table from ${K.usd(B[0][0])} to ${K.usd(B[14][9])}, the ${K.AREAS.length} locality tables, the ${K.dec(K.RAISE, 1)} % raise and the ${K.usd(K.CAP)} cap, rebuilt cell by cell from OPM files.`,
  h1: 'GS pay scale 2026: the base table and every locality table',
  intro: 'Choose a locality area to print its full 2026 table, annual or hourly. Every cell is recomputed from the OPM base table and percentage.',
  resume: `The 2026 General Schedule has one base table of 15 grades and 10 steps, from ${K.usd(B[0][0])} for GS-1 step 1 to ${K.usd(B[14][9])} for GS-15 step 10, and ${K.AREAS.length} locality tables built on it. Executive Order ${P.pay.eo.number} of December 18, 2025 raised the base table by ${K.dec(K.RAISE, 1)} % from the first pay period beginning on or after January 1, 2026, which was January 11, and left every locality percentage at its 2025 level. The lowest, Rest of U.S., is ${K.dec(rus.pct, 2)} %; the highest, ${sf.short}, is ${K.dec(sf.pct, 2)} %. A locality rate is the base rate times one plus the percentage, rounded to the dollar, and capped at ${K.usd(K.CAP)}, the 2026 rate for level IV of the Executive Schedule. A GS-9 step 1 therefore earns ${K.usd(g9.annual)} in Rest of U.S. and ${K.usd(g9sf.annual)} in ${sf.short}. GS-1 to GS-4 can be paid from special table 001M when it is higher. The 2027 tables do not exist yet.`,
  tool: 'table',
  toolArg: { a: 'RUS', u: 'yr' },
  faqs: [
    { q: 'What is the GS base pay table for 2026?', a: `It is the national General Schedule table before locality pay: ${K.usd(B[0][0])} for GS-1 step 1, ${K.usd(B[6][0])} for GS-7 step 1, ${K.usd(B[11][0])} for GS-12 step 1 and ${K.usd(B[14][9])} for GS-15 step 10. No employee in the 50 states is paid these figures alone, because every county belongs to a locality area, at least Rest of U.S. at ${K.dec(rus.pct, 2)} %.` },
    { q: 'How many GS locality pay tables are there in 2026?', a: `${K.AREAS.length}: ${K.AREAS.length - 3} named metropolitan areas, Alaska, Hawaii and Rest of U.S. OPM publishes each one as a separate table with its own code, for example DCB for Washington-Baltimore-Arlington. The percentages are the same as in 2025 because the January 2026 executive order kept them frozen.` },
    { q: 'Why do the top GS-15 steps show the same salary in some cities?', a: `Because of the pay cap. No General Schedule rate may exceed the rate for level IV of the Executive Schedule, ${K.usd(K.CAP)} in 2026. When the base rate times the locality percentage goes above it, the payable rate stops at ${K.usd(K.CAP)}. In 2026 the cap cuts cells in ${areasWithCap} of the ${K.AREAS.length} areas, mostly at GS-15 and the top of GS-14.` },
    { q: 'What is the difference between the GS pay scale and the GS pay table?', a: 'People use both words for the same thing. Strictly, the General Schedule is the pay system of 15 grades and 10 steps set in title 5 of the U.S. Code, and each pay table is the set of rates for one locality area in one year. Your table is the one of your official worksite, printed on your SF-50.' },
    { q: 'Were the 2026 GS pay tables published late?', a: `The rates were set by Executive Order ${P.pay.eo.number}, signed on December 18, 2025 and published in the Federal Register on December 23. OPM issued its pay memo the same month and posted the tables, and the official notice of the January 2026 schedules followed in the Federal Register on February 3, 2026. Agencies paid the new rates from January 11, 2026.` },
    { q: 'Does the GS pay scale include overtime and bonuses?', a: 'No. The tables give annual rates of basic pay, the base rate plus locality pay. Overtime, night differential, Sunday and holiday premium pay, awards, recruitment and retention incentives come on top and are not part of these figures. Only basic pay with locality counts toward your FERS high-3 and your TSP contribution percentage.' },
  ],
  body: (h) => `
<h2>The base table</h2>
<p>Every General Schedule rate in ${P.year} starts from the table below. From GS-3 up, each step adds the same amount, one thirtieth of step 1, which is why the gap between steps grows with the grade: about ${K.usd(B[2][2] - B[2][1])} at GS-3 and ${K.usd(B[13][2] - B[13][1])} at GS-14. Between two grades the step 1 rates rise faster at the top of the scale, so that GS-15 step 1 is more than five times GS-1 step 1.</p>
${h.table(['Grade', 'Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5', 'Step 6', 'Step 7', 'Step 8', 'Step 9', 'Step 10'], B.map((r, i) => [`GS-${i + 1}`, ...r]), `${P.year} General Schedule base rates, before locality pay. GS-1 and GS-2 steps are not evenly spaced.`, ['l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>GS-1 and GS-2 are the exceptions: their increments are not equal, and at GS-1 step 9 adds only ${K.usd(B[0][8] - B[0][7])} over step 8. From GS-3 to GS-15, step 10 is 30 % above step 1, give or take a dollar of rounding.</p>
<h2>From base rate to the rate you are paid</h2>
<p>Locality pay is a percentage that 5 U.S.C. 5304 adds to the base rate in each area. OPM multiplies the base rate by one plus the percentage and rounds to the nearest dollar. If the result is above the Executive Schedule level IV rate, it is set to ${K.usd(K.CAP)}. For GS-1 to GS-4, OPM then compares the result with special rate table 001M, which applies across the United States, and pays the higher figure. That is the whole procedure. The ${h.a('method', 'method page')} shows that following it on the OPM base table reproduces each of the ${K.num(K.AREAS.length * 150)} cells of the ${K.AREAS.length} locality tables to the dollar.</p>
${h.mini('gs', { t: 'Your cell in your county', p: ['g', 's', 'st', 'co'], d: { g: '9', s: '1', st: 'TX', co: 'Harris County' } })}
<h2>The 58 locality percentages</h2>
<p>Each area has one percentage for every grade and step. The table below ranks them. ${sorted[0].short}, ${sorted[1].short} and ${sorted[2].short} lead; Rest of U.S., which covers every county outside a named area, is last. The percentages have not moved since January 2025: the ${P.year} raise came entirely from the base table. The ${h.a('locality-pay', 'locality pay page')} explains which counties belong to which area and how a teleworker's area is set.</p>
${h.table(['Rank', 'Locality area', 'Percentage', 'GS-9 step 1', 'GS-13 step 1'], sorted.map((a, i) => [String(i + 1), (PLANNED_AREAS.includes(a.slug) ? h.a(`area:${a.slug}`, a.short) : a.short), `${K.dec(a.pct, 2)} %`, K.usd(K.pay(9, 1, a.code).annual), K.usd(K.pay(13, 1, a.code).annual)]), `${P.year} locality percentages, highest first. Linked areas have their own page.`, ['r', 'l', 'r', 'r', 'r'])}
<h2>Special rate table 001M</h2>
<p>At the bottom of the scale, the national base table plus a low locality percentage would fall under the pay that the market requires for clerical and entry jobs. OPM's table 001M sets higher rates for GS-1 to GS-4 in every locality area. In ${P.year} a GS-2 step 1 in Rest of U.S. is paid ${K.usd(sp.annual)} from that table, against ${K.usd(sp.locality)} under the locality rule. Steps 6 to 10 of GS-4 are not covered and stay on the locality table. The ${h.a('gs-special-rates', 'special rates page')} lists every 001M cell and the areas where it matters.</p>
<h2>The pay cap</h2>
<p>The Executive Schedule level IV rate rose to ${K.usd(K.CAP)} in ${P.year}, from ${K.usd(P.pay.cap2025)} in 2025. Cells above it are paid exactly ${K.usd(K.CAP)}: ${cappedIn('SF')} cells in ${sf.short}, ${cappedIn('DCB')} in ${dc.short}, none in Rest of U.S. Employees in those cells get no money from a step increase, and the raise they received in January 2026 was the rise of the cap, not the ${K.dec(K.RAISE, 1)} %. The ${h.a('gs-pay-cap', 'pay cap page')} has the list by area.</p>
<h2>Annual, hourly, biweekly</h2>
<p>Switch the calculator above to "Hourly" to print an area's hourly table. The hourly rate is the annual rate divided by ${K.num(2087)}, rounded to the cent, and a full biweekly paycheck before deductions is 80 hours at that rate. A GS-9 step 1 in Rest of U.S. earns ${K.usd2(g9.hourly)} an hour and ${K.usd2(g9.biweekly)} per pay period. Overtime for employees exempt from the Fair Labor Standards Act has its own ceiling, explained on the ${h.a('gs-hourly-pay', 'hourly pay page')}.</p>
<h2>Grade by grade</h2>
<p>Each grade has its own page, with the grade across all ${K.AREAS.length} areas, the wait between steps and what a promotion to the next grade pays: ${Array.from({ length: 15 }, (_, i) => h.a(`gs-${i + 1}`, `GS-${i + 1}`)).join(', ')}.</p>
<h2>What 2026 changed and what 2027 may bring</h2>
<p>Compared with 2025, every base rate rose by about ${K.dec(K.RAISE, 1)} %, rounded to the dollar, and locality rates followed because the percentages stayed the same. The ${h.a('federal-pay-raise-2026', '2026 raise page')} gives the exact gain for each cell and each paycheck. For January 2027, the President's alternative pay plan of August 26, 2026 proposes no raise and no locality change. That is a proposal, not a table; OPM will post the 2027 tables once the rates are set by executive order or by law, expected ${P.pay.y2027.tablesExpected}. The ${h.a('federal-pay-raise-2027', '2027 raise page')} lets you test a scenario on your cell without presenting it as a rate.</p>
<h2>Where the figures come from</h2>
<p>We read OPM's ${P.year} salary tables in the XML files OPM publishes for each area, the 2026 locality pay area definitions, table 001M, and the executive order. Each figure on this site is computed from the base table and the percentage, then checked against the OPM file for that cell. Your official rate is the one printed on your SF-50 and your leave and earnings statement; if they differ from these tables, your pay plan is probably not GS, or another special rate table applies to your occupation.</p>
`,
  related: ['locality-pay', 'federal-pay-raise-2026', 'gs-pay-cap', 'gs-special-rates', 'gs-hourly-pay', 'federal-pay-raise-2027'],
  sources: ['opm_gs_2026', 'eo_14368', 'cpm_2025_18', 'fr_pay_2026', 'opm_001m', 'opm_locality_defs', 'opm_ex_2026', 'usc_5304'],
});
