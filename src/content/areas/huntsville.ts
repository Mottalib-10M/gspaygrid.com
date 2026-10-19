import { defineArea } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const a = K.areaBySlug('huntsville')!;
const bh = K.area('BH'), atl = K.area('ATL'), rus = K.area('RUS');
const sorted = [...K.AREAS].sort((x, y) => y.pct - x.pct);
const rank = sorted.findIndex((x) => x.code === a.code) + 1;
const ord = (n: number) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;
const join = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}` : xs[0]);
const byState = K.countiesOfArea(a.code);
const al = byState.find((x) => x.st === 'AL')?.names ?? [];
const others = byState.filter((x) => x.st !== 'AL');
const nCounties = byState.reduce((n, s) => n + s.names.length, 0);
const alAreas = K.areasInState('AL');
const g9 = K.pay(9, 1, a.code), g11 = K.pay(11, 1, a.code), g12 = K.pay(12, 1, a.code), g13 = K.pay(13, 1, a.code), g14 = K.pay(14, 1, a.code), g15 = K.pay(15, 1, a.code);
const p12to13 = K.promote(12, 4, 13, a.code);
const p13to14 = K.promote(13, 3, 14, a.code);
const capped = K.table(a.code)[14].filter((x) => x >= K.CAP).length;

export default defineArea({
  slug: 'huntsville',
  title: 'Huntsville Locality Pay 2026: GS Rates for North Alabama',
  description: `Huntsville locality pay 2026 is ${K.dec(a.pct, 2)} %: GS-12 step 1 pays ${K.usd(g12.annual)}, GS-13 ${K.usd(g13.annual)}. The ${nCounties} Alabama and Tennessee counties, promotions and the Birmingham gap.`,
  intro: `North Alabama's federal workforce is paid ${K.dec(a.pct, 2)} % above the base table in ${K.P.year}, more than Birmingham or rural Alabama.`,
  resume: `The Huntsville-Decatur locality pay area adds ${K.dec(a.pct, 2)} % to the General Schedule base table in ${K.P.year}, the same percentage as in 2025 because Executive Order 14368 froze every locality and put the ${K.dec(K.RAISE, 1)} % raise into the base rates. It ranks ${ord(rank)} of the ${K.AREAS.length} areas and is one of the ${alAreas.length} named areas that include Alabama counties, between ${atl.short} at ${K.dec(atl.pct, 2)} % and ${bh.short} at ${K.dec(bh.pct, 2)} %. The area takes in ${nCounties} counties: ${join(al)} in Alabama, plus ${others.map((o) => `${join(o.names)} in ${K.STATE_NAMES[o.st]}`).join(' and ')}. A GS-9 step 1 earns ${K.usd(g9.annual)}, a GS-11 ${K.usd(g11.annual)}, a GS-12 ${K.usd(g12.annual)}, a GS-13 ${K.usd(g13.annual)}, a GS-14 ${K.usd(g14.annual)} and a GS-15 ${K.usd(g15.annual)}. Compared with Birmingham, at ${K.dec(bh.pct, 2)} %, the same GS-13 step 1 is paid ${K.usd(g13.annual - K.pay(13, 1, 'BH').annual)} more a year.`,
  body: (h) => `
<h2>A defense workforce at every grade</h2>
<p>Huntsville and the Tennessee Valley around it hold a large defense workforce that spans the whole General Schedule. The upper half of this table, GS-12 to GS-15, is where the ${K.dec(a.pct, 2)} % percentage produces the largest dollar differences with the rest of Alabama, and where promotions, rather than step increases, drive most of a career's growth.</p>
<h2>Promotions in the Huntsville table</h2>
<p>A GS promotion follows the two-step rule of 5 CFR 531.214: take your current base rate, add two step increments of your current grade, apply the locality percentage, then find the lowest step of the new grade that equals or exceeds it. In the Huntsville table, a GS-12 step 4 earning ${K.usd(p12to13.from.annual)} moves to GS-13 step ${p12to13.to.step}, ${K.usd(p12to13.to.annual)}, a raise of ${K.usd(p12to13.raise)}. A GS-13 step 3 moving to GS-14 lands at step ${p13to14.to.step}, ${K.usd(p13to14.to.annual)}. In both cases the wait for the next within-grade increase starts again.</p>
${h.mini('promo', { t: 'Your next promotion in the Huntsville table', p: ['g', 's', 'ng'], d: { g: '12', s: '4', ng: '13', a: a.code } })}
<h2>Three Alabama tables</h2>
<p>Alabama counties are split among ${alAreas.length} named areas and Rest of U.S. Huntsville covers the north of the state. ${bh.short}, at ${K.dec(bh.pct, 2)} %, takes ${K.countiesOf('AL').filter(([, c]) => c === 'BH').length} counties in the center. ${atl.short}, at ${K.dec(atl.pct, 2)} %, reaches across the state line into ${K.countiesOf('AL').filter(([, c]) => c === 'ATL').length} eastern Alabama counties. Every other Alabama county is in ${h.a('area:rest-of-us', 'Rest of U.S.')} at ${K.dec(rus.pct, 2)} %. A GS-12 step 5 is worth ${K.usd(K.pay(12, 5, a.code).annual - K.pay(12, 5, 'RUS').annual)} more a year in Huntsville than in a Rest of U.S. county a short drive away, so a job announcement's duty station deserves a careful look.</p>
<p>Lincoln County, Tennessee, belongs here as well. Area definitions follow commuting patterns, not state lines, so a worksite there uses the Huntsville table rather than a Tennessee rate.</p>
<h2>Telework across county lines</h2>
<p>Commuting into Madison County from a county outside the area does not change your locality: you are paid at your official worksite. Under 5 CFR 531.605 the office stays your worksite as long as you are scheduled to report there at least twice each biweekly pay period. Switch to full remote work from a home in a Rest of U.S. county and the locality follows the home.</p>
<h2>The ceiling</h2>
<p>${capped ? `${capped} GS-15 cell${capped > 1 ? 's' : ''} in this table reach${capped > 1 ? '' : 'es'} the ${K.usd(K.CAP)} cap, so the very top step adds nothing until the cap rises.` : `No cell of this table reaches the ${K.usd(K.CAP)} cap.`} The ${h.a('gs-promotion-calculator', 'promotion calculator')} and the ${h.a('gs-13', 'GS-13 page')} cover the rest of the ladder.</p>
`,
  faqs: [
    { q: 'What is the Huntsville AL locality pay for 2026?', a: `It is ${K.dec(a.pct, 2)} %, the same as in 2025. The percentage applies to every GS grade and step at worksites in the ${nCounties} counties of the Huntsville-Decatur area. A GS-11 step 1 earns ${K.usd(g11.annual)} and a GS-13 step 1 ${K.usd(g13.annual)}. The ${K.dec(K.RAISE, 1)} % January raise was added to the base table.` },
    { q: 'Is Decatur, Alabama, in the Huntsville locality area?', a: `Yes. Morgan County, home of Decatur, is one of the Alabama counties of the Huntsville-Decatur area, along with Madison, Limestone and the others listed below the table. A worksite in Decatur is paid the same ${K.dec(a.pct, 2)} % as one in Huntsville: ${K.usd(g12.annual)} at GS-12 step 1 in ${K.P.year}.` },
    { q: 'How much more does Huntsville pay than Birmingham for GS jobs?', a: `Huntsville is ${K.dec(a.pct - bh.pct, 2)} points higher: ${K.dec(a.pct, 2)} % against ${K.dec(bh.pct, 2)} % in Birmingham. For a GS-12 step 1 that is ${K.usd(g12.annual - K.pay(12, 1, 'BH').annual)} a year, and for a GS-14 step 1 ${K.usd(g14.annual - K.pay(14, 1, 'BH').annual)}. The percentages come from local non-federal pay surveys, which show a wider gap in the Huntsville market.` },
  ],
  related: ['locality-pay', 'gs-promotion-calculator', 'gs-13', 'gs-14', 'area:atlanta', 'area:rest-of-us'],
});
