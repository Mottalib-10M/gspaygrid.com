import { defineArea } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const a = K.area('RUS');
const sf = K.area('SF');
const sorted = [...K.AREAS].sort((x, y) => x.pct - y.pct);
const next = sorted[1];
const join = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}` : xs[0]);
const TERR = ['PR', 'GU', 'VI'];
const wholly = Object.keys(K.STATE_NAMES).filter((st) => !['AK', 'HI', ...TERR].includes(st) && K.countiesOf(st).length === 0).map((st) => K.STATE_NAMES[st]);
const partial = Object.keys(K.STATE_NAMES).filter((st) => !['AK', 'HI', 'DC', ...TERR].includes(st) && K.countiesOf(st).length > 0).length;
let special = 0;
for (let g = 1; g <= 4; g++) for (let s = 1; s <= 10; s++) if (K.pay(g, s, a.code).usesSpecial) special++;
const g5 = K.pay(5, 1, a.code), g7 = K.pay(7, 1, a.code), g9 = K.pay(9, 1, a.code), g11 = K.pay(11, 1, a.code), g12 = K.pay(12, 1, a.code), g13 = K.pay(13, 1, a.code), g15 = K.pay(15, 10, a.code);
const tx = K.countiesOf('TX').length, txAreas = K.areasInState('TX').length;
const gap = (g: number, s: number, c: string) => K.usd(K.pay(g, s, c).annual - K.pay(g, s, a.code).annual);

export default defineArea({
  slug: 'rest-of-us',
  title: 'Rest of U.S. Locality Pay 2026: GS Rates and Who Gets Them',
  description: `Rest of U.S. locality pay 2026 is ${K.dec(a.pct, 2)} %, the lowest of ${K.AREAS.length} areas: GS-9 step 1 earns ${K.usd(g9.annual)}, GS-12 ${K.usd(g12.annual)}. Plus the states and territories it covers.`,
  intro: `The default area: any worksite outside the named metro areas, Alaska and Hawaii is paid ${K.dec(a.pct, 2)} % above the base table.`,
  resume: `Rest of U.S. is the locality pay area for every federal worksite that OPM's ${K.P.year} definitions do not place in a named area: rural counties, small cities, Puerto Rico, Guam, the U.S. Virgin Islands and the other nonforeign areas. Its percentage, ${K.dec(a.pct, 2)} %, is the lowest of the ${K.AREAS.length} areas and the same as in 2025, since Executive Order 14368 raised only the base table, by ${K.dec(K.RAISE, 1)} %. A GS-5 step 1 earns ${K.usd(g5.annual)}, a GS-7 ${K.usd(g7.annual)}, a GS-9 ${K.usd(g9.annual)}, a GS-11 ${K.usd(g11.annual)}, a GS-12 ${K.usd(g12.annual)} and a GS-13 ${K.usd(g13.annual)}. GS-15 step 10 stops at ${K.usd(g15.annual)}, under the ${K.usd(K.CAP)} cap, so no cell of this table is capped. ${wholly.length} states have no county in any named area and are entirely Rest of U.S.: ${join(wholly)}. The next area up, ${next.short}, pays ${K.dec(next.pct - a.pct, 2)} points more.`,
  body: (h) => `
<h2>A definition by exclusion</h2>
<p>OPM's ${K.P.year} locality definitions describe Rest of U.S. in one line: those portions of the United States and its territories and possessions (nonforeign areas) not located within another locality pay area. There is no list of counties to check. If your duty station's county or independent city does not appear in any named area, and the worksite is not in Alaska or Hawaii, the Rest of U.S. table applies.</p>
<p>In ${wholly.length} states that test is easy, because no county there belongs to a named area: ${join(wholly)}. Every federal office, clinic, park and base in those states uses this table. In the ${partial} other states that have at least one named county, the answer depends on the exact county. Texas is a good example: ${tx} Texas counties are spread across ${txAreas} named areas, and every other county of the state is Rest of U.S.</p>
${h.mini('lookup', { t: 'Is your county outside every named area?', p: ['st', 'co'], d: { st: 'TX', co: 'other', g: '9' } })}
<h2>Puerto Rico, Guam and the Virgin Islands</h2>
<p>Puerto Rico, Guam and the U.S. Virgin Islands are not separate areas. They fall under Rest of U.S. like a county in Montana does. OPM's definitions page explains the history: the Non-Foreign Area Retirement Equity Assurance Act of 2009 phased in locality pay for the nonforeign areas of 5 CFR 591.205, and the old nonforeign cost-of-living allowance was phased out. Alaska and Hawaii ended up with their own percentages; the other nonforeign areas ended up here, at ${K.dec(a.pct, 2)} %. A GS-11 step 1 in San Juan is paid ${K.usd(g11.annual)}, exactly what the same grade and step pays in rural Arkansas.</p>
<h2>How far below the other areas</h2>
<p>The distance is small at the bottom of the ranking and large at the top. ${next.short}, the closest area at ${K.dec(next.pct, 2)} %, adds only ${gap(12, 1, next.code)} a year at GS-12 step 1. Washington-Baltimore at ${K.dec(K.area('DCB').pct, 2)} % adds ${gap(12, 1, 'DCB')}, and ${sf.short} at ${K.dec(sf.pct, 2)} % adds ${gap(12, 1, 'SF')}. These percentages come from comparisons of federal and non-federal salaries in each labor market, not from living costs, so the ranking does not follow any cost-of-living index.</p>
<h2>Where the special rate table takes over</h2>
<p>Because the Rest of U.S. percentage is the lowest, the nationwide special rate table 001M replaces the locality rate in more cells here than anywhere else: ${special} of the 40 cells of GS-1 to GS-4. Those employees are paid the 001M figure, which is higher than ${K.dec(a.pct, 2)} % on top of the base. From GS-5 up, every rate is the base plus the locality percentage, rounded to the dollar.</p>
<h2>Remote work and Rest of U.S.</h2>
<p>Many fully remote federal employees land in this table. Under 5 CFR 531.605 the worksite is the agency office only if you are scheduled to report there at least twice each biweekly pay period. Below that, your approved home address is the worksite, so a remote employee living in a county outside every named area is paid ${K.dec(a.pct, 2)} %, whatever the location of the supervisor or the team. A move from a ${K.area('DEN').short} office to remote work from a Rest of U.S. county costs a GS-13 step 5 ${gap(13, 5, 'DEN')} a year. The ${h.a('locality-pay', 'locality pay page')} ranks every area, and ${h.a('gs-pay-scale-2026', 'the base table')} shows the rates before any locality.</p>
`,
  faqs: [
    { q: 'What is the Rest of U.S. locality pay rate for 2026?', a: `It is ${K.dec(a.pct, 2)} %, the lowest of the ${K.AREAS.length} areas and unchanged from 2025. The January ${K.P.year} raise of ${K.dec(K.RAISE, 1)} % went into the base table, so Rest of U.S. salaries still rose by about that much. A GS-7 step 1 now earns ${K.usd(g7.annual)} and a GS-11 step 1 ${K.usd(g11.annual)}.` },
    { q: 'Does Puerto Rico have its own GS locality pay?', a: `No. Puerto Rico, Guam, the U.S. Virgin Islands and the other nonforeign areas outside Alaska and Hawaii are part of Rest of U.S. in ${K.P.year}. Federal employees there are paid the same table as a rural county on the mainland: a GS-9 step 1 earns ${K.usd(g9.annual)}. Locality pay replaced the former nonforeign cost-of-living allowance through a phase-in that began after the 2009 act.` },
    { q: 'Is Rest of U.S. the same as GS base pay?', a: `No. The base table is a starting point that almost nobody in the 50 states is paid alone. Rest of U.S. adds ${K.dec(a.pct, 2)} % to it: GS-12 step 1 has a base of ${K.usd(g12.base)} and a Rest of U.S. rate of ${K.usd(g12.annual)}. Your SF-50 shows both the base and the adjusted rate.` },
    { q: 'Which locality area pays the least after Rest of U.S.?', a: `${next.name}, at ${K.dec(next.pct, 2)} % in ${K.P.year}. The difference with Rest of U.S. is ${K.dec(next.pct - a.pct, 2)} points, which is ${gap(12, 1, next.code)} a year at GS-12 step 1. Several other areas sit just above it, so a small move between low areas changes pay much less than a move into a large coastal metro.` },
  ],
  related: ['locality-pay', 'gs-pay-scale-2026', 'gs-special-rates', 'gs-9', 'gs-12', 'area:alaska', 'area:hawaii'],
});
