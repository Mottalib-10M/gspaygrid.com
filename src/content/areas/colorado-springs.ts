import { defineArea } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const a = K.areaBySlug('colorado-springs')!;
const den = K.area('DEN'), rus = K.area('RUS');
const sorted = [...K.AREAS].sort((x, y) => y.pct - x.pct);
const rank = sorted.findIndex((x) => x.code === a.code) + 1;
const ord = (n: number) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;
const join = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}` : xs[0]);
const names = K.countiesOfArea(a.code).flatMap((x) => x.names);
const denN = K.countiesOf('CO').filter(([, c]) => c === 'DEN').length;
const coListed = K.countiesOf('CO').length;
const g = (gr: number, s = 1, c = a.code) => K.pay(gr, s, c).annual;
const gapDen = (gr: number, s: number) => K.usd(g(gr, s, 'DEN') - g(gr, s));
const capped = K.table(a.code)[14].filter((x) => x >= K.CAP).length;

export default defineArea({
  slug: 'colorado-springs',
  title: 'Colorado Springs Locality Pay 2026: GS Pay vs Denver',
  description: `Colorado Springs locality pay 2026 is ${K.dec(a.pct, 2)} %, ${K.dec(den.pct - a.pct, 2)} points under Denver: GS-11 step 1 pays ${K.usd(g(11))}, GS-12 ${K.usd(g(12))}. Counties, pay table, nearby areas.`,
  intro: `El Paso, Fremont, Pueblo and Teller counties share a ${K.dec(a.pct, 2)} % locality in ${K.P.year}. Denver, to the north, is paid far more.`,
  resume: `The Colorado Springs locality pay area pays ${K.dec(a.pct, 2)} % above the General Schedule base table in ${K.P.year}, unchanged from 2025: Executive Order 14368 raised the base rates by ${K.dec(K.RAISE, 1)} % and kept every locality percentage where it was. It covers ${names.length} Colorado counties, ${join(names)}, and ranks ${ord(rank)} of the ${K.AREAS.length} areas. A GS-7 step 1 earns ${K.usd(g(7))}, a GS-9 ${K.usd(g(9))}, a GS-11 ${K.usd(g(11))}, a GS-12 ${K.usd(g(12))}, a GS-13 ${K.usd(g(13))} and a GS-14 ${K.usd(g(14))}. The defining fact of this area is its neighbor: the Denver-Aurora area, which starts at the next county line to the north, pays ${K.dec(den.pct, 2)} %. At GS-12 step 1 the gap is ${gapDen(12, 1)} a year, and at GS-13 step 5 it is ${gapDen(13, 5)}. Colorado counties outside both areas are Rest of U.S., at ${K.dec(rus.pct, 2)} %.`,
  body: (h) => `
<h2>Two Front Range tables</h2>
<p>Colorado has ${coListed} counties named in OPM's ${K.P.year} locality definitions. ${denN} of them form the Denver area and ${names.length} form Colorado Springs. Douglas and Elbert counties, on the northern edge of El Paso County, are in the Denver list, so the boundary between a ${K.dec(den.pct, 2)} % table and a ${K.dec(a.pct, 2)} % table runs between neighboring counties of the same metro corridor.</p>
<p>The percentages differ because each area's figure comes from its own survey of non-federal salaries, compared with federal pay for the same kinds of work. The surveys show a much larger gap in the Denver labor market than in the Colorado Springs one. Living costs do not enter the calculation.</p>
${h.mini('lookup', { t: 'Compare a Front Range county', p: ['st', 'co', 'g'], d: { st: 'CO', co: 'Douglas County', g: '12' } })}
<h2>What the gap means for a career</h2>
<p>A defense civilian offered the same grade in both areas faces a real choice. At GS-11 step 1 Denver pays ${gapDen(11, 1)} more; at GS-14 step 1 the difference is ${gapDen(14, 1)}. Over a career the gap reaches the pension too, because the FERS high-3 is an average of basic pay including locality. Three final years in the Denver table instead of the Colorado Springs one raise the high-3 by roughly the same proportion, ${K.pct((1 + den.pct / 100) / (1 + a.pct / 100) - 1, 1)}.</p>
<h2>Commuting does not move your rate</h2>
<p>Living in Castle Rock and driving south to a duty station in El Paso County means a Colorado Springs paycheck, and living in Colorado Springs while reporting to a Denver office means a Denver one. The official worksite on the SF-50 decides. For teleworkers, 5 CFR 531.605 keeps the office as worksite when you are scheduled to report there at least twice each biweekly pay period; below that, your home becomes the worksite and its county sets the table.</p>
<h2>South and west of the area</h2>
<p>Pueblo County to the south and Fremont County to the southwest are inside the Colorado Springs area, so Pueblo and Cañon City worksites use this table. Counties beyond them, and most of western Colorado, are in ${h.a('area:rest-of-us', 'Rest of U.S.')}. A GS-9 step 5 is paid ${K.usd(g(9, 5) - g(9, 5, 'RUS'))} more in Colorado Springs than in a Rest of U.S. county. ${capped ? `At the top, ${capped} GS-15 step${capped > 1 ? 's are' : ' is'} held at the ${K.usd(K.CAP)} cap.` : `No cell reaches the ${K.usd(K.CAP)} cap.`} The ${h.a('area:denver', 'Denver page')} has the northern table.</p>
`,
  faqs: [
    { q: 'What is the Colorado Springs locality pay rate in 2026?', a: `It is ${K.dec(a.pct, 2)} %, applied to the base GS table at worksites in El Paso, Fremont, Pueblo and Teller counties. The rate did not change from 2025, but base pay rose ${K.dec(K.RAISE, 1)} %. A GS-12 step 1 earns ${K.usd(g(12))}, and a GS-13 step 1 ${K.usd(g(13))}.` },
    { q: 'Why is Denver locality pay so much higher than Colorado Springs?', a: `Each area's percentage is set from its own comparison of federal and non-federal salaries, and the Denver comparison shows a wider gap. Denver gets ${K.dec(den.pct, 2)} % in ${K.P.year}, Colorado Springs ${K.dec(a.pct, 2)} %. The difference is ${gapDen(12, 1)} a year at GS-12 step 1, even though the two areas share a county line.` },
    { q: 'Is Pueblo in the Colorado Springs locality pay area?', a: `Yes. Pueblo County is one of the ${names.length} counties of the Colorado Springs area, so a federal worksite in Pueblo is paid ${K.dec(a.pct, 2)} %, the same as one in El Paso County. A GS-9 step 1 earns ${K.usd(g(9))} there in ${K.P.year}. Neighboring counties not on the list are Rest of U.S.` },
  ],
  related: ['locality-pay', 'area:denver', 'area:rest-of-us', 'high-3-salary', 'gs-12', 'gs-13'],
});
