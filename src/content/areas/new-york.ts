import { defineArea } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const a = K.areaBySlug('new-york')!;
const phl = K.area('PHL'), har = K.area('HAR'), bos = K.area('BOS'), dcb = K.area('DCB'), rus = K.area('RUS');
const ranked = [...K.AREAS].sort((x, y) => y.pct - x.pct);
const rank = ranked.findIndex((x) => x.code === a.code) + 1;
const top = ranked[0];
const st = K.countiesOfArea(a.code);
const n = st.reduce((s, x) => s + x.names.length, 0);
const of = (s: string) => st.find((x) => x.st === s)!.names.length;
const g = (gr: number, s = 1, c = a.code) => K.pay(gr, s, c).annual;
const row15 = K.table(a.code)[14];
const capped = row15.filter((x) => x >= K.CAP).length;
const firstCap = row15.findIndex((x) => x >= K.CAP) + 1;
const bases = st.find((x) => x.st === 'NJ')!.names.filter((x) => !/County$/.test(x));

export default defineArea({
  slug: 'new-york',
  where: ['NY', 'New York County'],
  title: 'New York Locality Pay 2026: GS Rates for NY, NJ, CT and PA',
  description: `New York locality pay 2026 is ${K.dec(a.pct, 2)} %: GS-9 step 1 earns ${K.usd(g(9))}, GS-12 ${K.usd(g(12))}. The ${n} counties and military bases of NY, NJ, CT and PA, plus the GS-15 cap.`,
  intro: `Second only to ${top.short}, the New York-Newark area adds ${K.dec(a.pct, 2)} % to the base table. Pick your county to check that it belongs here.`,
  resume: `Federal employees whose official worksite is in the New York-Newark locality pay area receive ${K.dec(a.pct, 2)} % on top of every General Schedule base rate in ${K.P.year}. That percentage ranks ${rank === 2 ? 'second' : `number ${rank}`} of the ${K.AREAS.length} areas, behind ${top.short} only, and it did not move from 2025: the January 2026 increase of ${K.dec(K.RAISE, 1)} % went to the base table. In dollars, GS-5 step 1 pays ${K.usd(g(5))}, GS-7 ${K.usd(g(7))}, GS-9 ${K.usd(g(9))}, GS-11 ${K.usd(g(11))}, GS-12 ${K.usd(g(12))} and GS-13 ${K.usd(g(13))}. The area covers ${n} entries in four states: ${of('NY')} New York counties, ${of('NJ')} New Jersey entries (counties plus military installations listed by name), ${of('CT')} Connecticut counties and ${of('PA')} Pennsylvania counties. From GS-15 step ${firstCap} upward, ${capped} steps are held at the ${K.usd(K.CAP)} cap. Next to Philadelphia, which covers southern New Jersey, the same GS-12 step 1 pays ${K.usd(g(12) - g(12, 1, 'PHL'))} more in New York.`,
  body: (h) => `
<h2>Four states, one rate</h2>
<p>The area is not only the five boroughs. In New York State it takes the Bronx, Kings, New York, Queens and Richmond counties, Long Island (Nassau and Suffolk) and the Hudson Valley up to Dutchess, Ulster, Orange and Sullivan. In New Jersey it takes the northern and central counties, from Bergen and Essex down to Mercer, Monmouth and Ocean. Connecticut contributes Fairfield, New Haven and Litchfield. Pennsylvania contributes the Lehigh Valley and the Poconos: Carbon, Lehigh, Monroe, Northampton, Pike and Wayne.</p>
<p>That last group surprises people. A worksite in Allentown or Stroudsburg is paid at ${K.dec(a.pct, 2)} %, while one in Philadelphia, a shorter drive from parts of the Lehigh Valley, is paid at ${K.dec(phl.pct, 2)} %. OPM builds these lists from commuting data and the federal statistical area definitions, not from distance on a map.</p>
${h.mini('lookup', { t: 'Is your New Jersey worksite in New York or Philadelphia?', p: ['st', 'co'], d: { st: 'NJ', co: 'Mercer County', g: '12' } })}
<h2>The split in New Jersey</h2>
<p>New Jersey is divided between two areas. The ${of('NJ') - bases.length} counties listed for New York sit in the north and center; ${K.countiesOfArea('PHL').find((x) => x.st === 'NJ')!.names.length} southern counties, among them Camden, Burlington, Atlantic and Cape May, belong to ${h.a('area:philadelphia', 'Philadelphia')}. OPM also lists ${bases.join(', ')} by name under New York, so those installations follow the New York table regardless of the county line. If your SF-50 names the base as the duty station, that listing is the one that counts.</p>
<h2>Connecticut and the Hartford line</h2>
<p>Three Connecticut counties are in New York. Hartford, Middlesex, New London and Tolland counties belong to the Hartford area at ${K.dec(har.pct, 2)} %, and Windham County goes to Boston at ${K.dec(bos.pct, 2)} %. Moving a duty station from New Haven to Hartford therefore lowers a GS-11 step 1 from ${K.usd(g(11))} to ${K.usd(g(11, 1, 'HAR'))}.</p>
<h2>Commuting from Pennsylvania, teleworking from home</h2>
<p>Pay follows the official worksite, never the address you sleep at. Under 5 CFR 531.605, a teleworker scheduled to report to the Manhattan or Newark office at least twice in each biweekly pay period keeps the New York rate, even when home is in a Rest of U.S. county. Drop below that and the home becomes the worksite. For a GS-13 step 1 the gap between New York and Rest of U.S. is ${K.usd(g(13) - g(13, 1, 'RUS'))} a year, and against the Washington-Baltimore rate of ${K.dec(dcb.pct, 2)} % it is ${K.usd(g(13) - g(13, 1, 'DCB'))}.</p>
<h2>Where the cap starts</h2>
<p>At ${K.dec(a.pct, 2)} %, GS-14 stays below the ceiling at every step, topping out at ${K.usd(K.table(a.code)[13][9])}. GS-15 is different: steps ${firstCap} to 10 all show ${K.usd(K.CAP)}, the Executive Schedule level IV rate. A senior specialist at GS-15 step ${firstCap} gains nothing from the next ${10 - firstCap} within-grade increases until the cap rises. The ${h.a('gs-pay-cap', 'pay cap page')} explains how the limit is set.</p>
`,
  faqs: [
    { q: 'What is the New York locality pay rate in 2026?', a: `It is ${K.dec(a.pct, 2)} % for the New York-Newark area, the same as in 2025. The base table rose ${K.dec(K.RAISE, 1)} % in January 2026, so a GS-12 step 1 went to ${K.usd(g(12))}. The percentage applies to every grade and step, rounded to the dollar and capped at ${K.usd(K.CAP)}.` },
    { q: 'Is the Lehigh Valley in the New York locality pay area?', a: `Yes. Lehigh and Northampton counties, along with Carbon, Monroe, Pike and Wayne in Pennsylvania, are part of the New York-Newark area in ${K.P.year}. A GS-9 step 1 there earns ${K.usd(g(9))}, the same as in Manhattan, while Philadelphia worksites are paid at ${K.dec(phl.pct, 2)} %.` },
    { q: 'Is Trenton paid at New York or Philadelphia locality rates?', a: `Trenton is in Mercer County, which OPM lists in the New York-Newark area, so federal worksites there get ${K.dec(a.pct, 2)} %. Burlington and Camden counties, just to the south, are in the Philadelphia area. Check the county printed on your duty station rather than the nearest big city.` },
    { q: 'Does a New York federal employee who lives in Pennsylvania lose locality pay?', a: 'Not while the official worksite stays in the New York area. If you are scheduled to report to that office at least twice each biweekly pay period, the office sets your rate, wherever you live. If you switch to full remote work, your home becomes the worksite and its county decides the area.' },
  ],
  related: ['locality-pay', 'gs-pay-scale-2026', 'gs-pay-cap', 'gs-13', 'gs-12', 'area:philadelphia', 'area:boston'],
});
