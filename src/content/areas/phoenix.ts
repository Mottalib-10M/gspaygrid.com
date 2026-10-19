import { defineArea } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const a = K.areaBySlug('phoenix')!;
const tu = K.area('TU'), lv = K.area('LV'), rus = K.area('RUS'), la = K.area('LA');
const sorted = [...K.AREAS].sort((x, y) => y.pct - x.pct);
const rank = sorted.findIndex((x) => x.code === a.code) + 1;
const ord = (n: number) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;
const join = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}` : xs[0]);
const names = K.countiesOfArea(a.code).flatMap((x) => x.names);
const az = K.countiesOf('AZ');
const tuN = az.filter(([, c]) => c === 'TU').map(([n]) => n);
const lvN = az.filter(([, c]) => c === 'LV').map(([n]) => n);
const g = (gr: number, s = 1, c = a.code) => K.pay(gr, s, c).annual;
const capped = K.table(a.code)[14].filter((x) => x >= K.CAP).length;
const r25 = K.pay2025(12, 5, a.code), r26 = g(12, 5);

export default defineArea({
  slug: 'phoenix',
  where: ['AZ', 'Maricopa County'],
  title: 'Phoenix Locality Pay 2026: GS Pay Table and Arizona Map',
  description: `Phoenix locality pay 2026 is ${K.dec(a.pct, 2)} % for Maricopa, Pinal and Gila counties: GS-11 step 1 pays ${K.usd(g(11))}, GS-13 ${K.usd(g(13))}. Tucson, the 2026 raise and 2027.`,
  intro: `Three Arizona counties, ${join(names)}, share the Phoenix-Mesa rate of ${K.dec(a.pct, 2)} % in ${K.P.year}.`,
  resume: `Phoenix-Mesa is the locality pay area for federal worksites in ${join(names)}, Arizona. In ${K.P.year} it adds ${K.dec(a.pct, 2)} % to the General Schedule base table, which ranks it ${ord(rank)} of the ${K.AREAS.length} areas and makes it the highest-paid of the three named areas with Arizona counties. The percentage is the same as in 2025, because Executive Order 14368 froze every locality and raised the base table ${K.dec(K.RAISE, 1)} %. A GS-5 step 1 earns ${K.usd(g(5))}, a GS-7 ${K.usd(g(7))}, a GS-9 ${K.usd(g(9))}, a GS-11 ${K.usd(g(11))}, a GS-12 ${K.usd(g(12))}, a GS-13 ${K.usd(g(13))} and a GS-14 ${K.usd(g(14))}. Tucson, to the south, pays ${K.dec(tu.pct, 2)} %, which is ${K.usd(g(12) - g(12, 1, 'TU'))} less at GS-12 step 1. Arizona counties outside the three named areas, such as Yavapai, Coconino and Yuma, are in Rest of U.S. at ${K.dec(rus.pct, 2)} %.`,
  body: (h) => `
<h2>Arizona on three tables, plus Rest of U.S.</h2>
<p>OPM's ${K.P.year} definitions name ${az.length} Arizona counties, split among three areas. Phoenix-Mesa takes ${join(names)}. ${tu.short} takes ${join(tuN)}, at ${K.dec(tu.pct, 2)} %. ${lvN.length ? `${join(lvN)}, in the northwest, belongs to the ${lv.short} area at ${K.dec(lv.pct, 2)} %, an area centered in Nevada.` : ''} Every other Arizona county is in ${h.a('area:rest-of-us', 'Rest of U.S.')}: a worksite in Flagstaff, Prescott or Yuma is paid ${K.dec(rus.pct, 2)} %, ${K.usd(g(11) - g(11, 1, 'RUS'))} less than Phoenix at GS-11 step 1.</p>
<p>Pinal County, between the two largest Arizona cities, is on the Phoenix side of the line, so a duty station in Casa Grande or Florence uses this table, not the Tucson one. Gila County, to the east, is also part of Phoenix-Mesa.</p>
<h2>What January 2026 changed in Phoenix</h2>
<p>The ${K.P.year} executive order raised the base table by ${K.dec(K.RAISE, 1)} % and left the Phoenix percentage at ${K.dec(a.pct, 2)} %. The effect on each cell is close to ${K.dec(K.RAISE, 1)} %, with rounding to the dollar. A GS-12 step 5 went from ${K.usd(r25)} in 2025 to ${K.usd(r26)} in ${K.P.year}, a gain of ${K.usd(r26 - r25)} a year. Try your own grade and step below.</p>
${h.mini('raise2026', { t: 'Your 2026 raise in the Phoenix table', p: ['g', 's'], d: { g: '12', s: '5', a: a.code } })}
<h2>Looking at 2027</h2>
<p>No 2027 figure is official. The President's alternative pay plan of August 26, 2026 proposes no across-the-board raise and no change of locality percentages for January 2027. If that holds, the Phoenix table stays as printed on this page. A raise voted by Congress or set by a later executive order would change it; the ${h.a('federal-pay-raise-2027', '2027 page')} lets you test a scenario on your cell.</p>
<h2>Compared with the West</h2>
<p>Phoenix pays more than ${tu.short} and ${lv.short}, and much less than ${la.short}, at ${K.dec(la.pct, 2)} %. A GS-13 step 1 who moves from Phoenix to Los Angeles gains ${K.usd(g(13, 1, 'LA') - g(13))} a year at the same grade and step. These gaps reflect surveys of non-federal pay in each labor market. They are not a measure of rent or prices.</p>
<h2>Worksite and the cap</h2>
<p>The table that applies is the one of the official worksite on your SF-50. A teleworker who reports to a Phoenix office at least twice each biweekly pay period keeps this rate under 5 CFR 531.605; a fully remote employee is paid the area of the approved home worksite. ${capped ? `At the top, ${capped} GS-15 cell${capped > 1 ? 's stop' : ' stops'} at the ${K.usd(K.CAP)} cap.` : `No cell reaches the ${K.usd(K.CAP)} cap.`}</p>
`,
  faqs: [
    { q: 'What is the Phoenix locality pay percentage for 2026?', a: `It is ${K.dec(a.pct, 2)} %, the same as in 2025, for worksites in Maricopa, Pinal and Gila counties. The base table rose ${K.dec(K.RAISE, 1)} % in January, so pay rose about that much. A GS-9 step 1 earns ${K.usd(g(9))} and a GS-12 step 1 ${K.usd(g(12))} in the Phoenix-Mesa area.` },
    { q: 'Is Flagstaff in the Phoenix locality pay area?', a: `No. Flagstaff is in Coconino County, which is not on any Arizona list in OPM's ${K.P.year} definitions, so it is Rest of U.S. at ${K.dec(rus.pct, 2)} %. A GS-11 step 1 earns ${K.usd(g(11, 1, 'RUS'))} there, against ${K.usd(g(11))} in Phoenix. The same applies to Prescott in Yavapai County and to Yuma.` },
    { q: 'How much more does Phoenix pay than Tucson?', a: `Phoenix is ${K.dec(a.pct - tu.pct, 2)} points higher in ${K.P.year}: ${K.dec(a.pct, 2)} % against ${K.dec(tu.pct, 2)} % for Tucson-Nogales. That is ${K.usd(g(11) - g(11, 1, 'TU'))} a year at GS-11 step 1 and ${K.usd(g(13) - g(13, 1, 'TU'))} at GS-13 step 1. Pinal County, between the two cities, is on the Phoenix list.` },
  ],
  related: ['locality-pay', 'federal-pay-raise-2026', 'federal-pay-raise-2027', 'area:los-angeles', 'area:rest-of-us', 'gs-13'],
});
