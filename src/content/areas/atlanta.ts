import { defineArea } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const a = K.areaBySlug('atlanta')!;
const bh = K.area('BH'), hnt = K.area('HNT'), rus = K.area('RUS');
const ranked = [...K.AREAS].sort((x, y) => y.pct - x.pct);
const rank = ranked.findIndex((x) => x.code === a.code) + 1;
const st = K.countiesOfArea(a.code);
const ga = st.find((x) => x.st === 'GA')!.names, al = st.find((x) => x.st === 'AL')!.names;
const gaOnly = K.areasInState('GA').length === 1;
const g = (gr: number, s = 1, c = a.code) => K.pay(gr, s, c).annual;
const row15 = K.table(a.code)[14];
const capped = row15.filter((x) => x >= K.CAP).length;
const firstCap = row15.findIndex((x) => x >= K.CAP) + 1;
const n = ga.length + al.length;
const size = (c: string) => K.countiesOfArea(c).reduce((t, x) => t + x.names.length, 0);
const bigger = K.AREAS.filter((x) => size(x.code) > n).length;

export default defineArea({
  slug: 'atlanta',
  where: ['GA', 'Fulton County'],
  title: 'Atlanta Locality Pay 2026: GS Pay in Georgia and Alabama',
  description: `Atlanta locality pay 2026 is ${K.dec(a.pct, 2)} %: GS-9 step 1 earns ${K.usd(g(9))}, GS-12 ${K.usd(g(12))}. The ${ga.length} Georgia and ${al.length} Alabama counties, Savannah and Augusta, and the pay cap.`,
  intro: `${n} counties, from the Blue Ridge to Columbus and into east Alabama, share a ${K.dec(a.pct, 2)} % rate. Check your county below.`,
  resume: `The Atlanta locality pay area, officially Atlanta-Athens-Clarke County-Sandy Springs, GA-AL, pays ${K.dec(a.pct, 2)} % above the General Schedule base table in ${K.P.year}, frozen at its 2025 level. It is ${rank}th of the ${K.AREAS.length} areas, lower than the large coastal areas but ${K.dec(a.pct - rus.pct, 2)} points above Rest of U.S. On the ${K.P.year} Atlanta table, step 1 pays ${K.usd(g(5))} at GS-5, ${K.usd(g(7))} at GS-7, ${K.usd(g(9))} at GS-9, ${K.usd(g(11))} at GS-11, ${K.usd(g(12))} at GS-12, ${K.usd(g(13))} at GS-13 and ${K.usd(g(14))} at GS-14. ${bigger === 0 ? 'No other area lists as many counties' : `Only ${bigger} area${bigger > 1 ? 's list' : ' lists'} more counties`}: ${ga.length} Georgia counties, including Athens (Clarke), Rome (Floyd), Gainesville (Hall), LaGrange (Troup) and Columbus (Muscogee), plus ${al.length} Alabama counties along the state line, among them Lee and Russell. With a lower percentage, only ${capped} GS-15 steps reach the ${K.usd(K.CAP)} cap. Savannah and Augusta are not in the area; they are paid the Rest of U.S. rate, ${K.usd(g(12) - g(12, 1, 'RUS'))} less for a GS-12 step 1.`,
  body: (h) => `
<h2>Georgia has one named area, and it is not the whole state</h2>
<p>${gaOnly ? 'Every Georgia county that appears in the 2026 definitions belongs to Atlanta.' : 'Most Georgia counties named in the 2026 definitions belong to Atlanta.'} The other Georgia counties, including Chatham (Savannah), Richmond and Columbia (Augusta), Bibb (Macon) and Houston County near Warner Robins, are Rest of U.S. at ${K.dec(rus.pct, 2)} %. For employees used to thinking of "Atlanta" as the metro core, the reach of the list is the surprise: it stretches north to Rabun, Habersham, White and Gilmer in the mountains, east to Elbert, Oglethorpe and Taliaferro, and southwest to Muscogee, Chattahoochee, Stewart and Marion.</p>
${h.mini('lookup', { t: 'Is your Georgia or Alabama county in the Atlanta area?', p: ['st', 'co'], d: { st: 'GA', co: 'Muscogee County', g: '9' } })}
<h2>The Alabama strip</h2>
<p>Six Alabama counties are listed with Atlanta: ${al.join(', ')}. Phenix City (Russell County) is paid like Columbus across the river, and Auburn and Opelika (Lee County) are on the Atlanta table as well. Farther west, the Alabama areas take over: Birmingham-Hoover-Talladega at ${K.dec(bh.pct, 2)} % and ${h.a('area:huntsville', 'Huntsville')} at ${K.dec(hnt.pct, 2)} %. Cherokee County is a special case: there is one in Alabama and one in Georgia, and both are in Atlanta.</p>
<h2>Savannah versus Atlanta, in dollars</h2>
${h.table(['Grade, step 1', 'Atlanta area', 'Rest of U.S. (Savannah, Augusta, Macon)', 'Gap'], [5, 7, 9, 11, 12, 13].map((gr) => [`GS-${gr}`, K.usd(g(gr)), K.usd(g(gr, 1, 'RUS')), `+${K.usd(g(gr) - g(gr, 1, 'RUS'))}`]), `${K.P.year} annual rates: Atlanta ${K.dec(a.pct, 2)} %, Rest of U.S. ${K.dec(rus.pct, 2)} %.`, ['l', 'r', 'r', 'r'])}
<p>The gap grows with the grade because the locality payment is a percentage of base pay. A transfer from Atlanta to Savannah at the same grade lowers pay by these amounts; the reverse transfer raises it.</p>
<h2>Teleworking from outside the area</h2>
<p>Under 5 CFR 531.605, an Atlanta office remains the official worksite for someone scheduled to report there at least twice each biweekly pay period. That holds even for a home in Macon or Augusta. If the agency approves full remote work instead, the home becomes the worksite and the Rest of U.S. table applies to a home in those counties.</p>
<h2>Fewer capped cells</h2>
<p>At ${K.dec(a.pct, 2)} %, the Atlanta table reaches the ${K.usd(K.CAP)} cap only at GS-15 step ${firstCap}; ${capped} steps are capped in total, against more in higher areas such as ${h.a('area:houston', 'Houston')}. GS-14 step 10 pays ${K.usd(K.table(a.code)[13][9])} and GS-15 step 1 pays ${K.usd(g(15))}. The ${h.a('gs-15', 'GS-15 page')} shows each step.</p>
`,
  faqs: [
    { q: 'What is the Atlanta locality pay percentage for 2026?', a: `It is ${K.dec(a.pct, 2)} %, unchanged from 2025, for the Atlanta-Athens-Clarke County-Sandy Springs area. A GS-11 step 1 earns ${K.usd(g(11))} in ${K.P.year}, compared with ${K.usd(g(11, 1, 'RUS'))} in Rest of U.S. Each rate is rounded to the dollar and limited to ${K.usd(K.CAP)}, the 2026 pay cap.` },
    { q: 'Is Savannah in a GS locality pay area?', a: `No. Chatham County, which includes Savannah, does not appear in the ${K.P.year} locality definitions, so federal worksites there are paid at the Rest of U.S. rate of ${K.dec(rus.pct, 2)} %. A GS-9 step 1 earns ${K.usd(g(9, 1, 'RUS'))} in Savannah and ${K.usd(g(9))} in the Atlanta area.` },
    { q: 'Is Columbus, Georgia, paid at Atlanta locality rates?', a: `Yes. Muscogee County is one of the ${ga.length} Georgia counties in the Atlanta area, together with Chattahoochee and Harris nearby, and Russell County across the line in Alabama. A GS-11 step 1 at a Columbus worksite earns ${K.usd(g(11))} in ${K.P.year}.` },
  ],
  related: ['locality-pay', 'gs-pay-scale-2026', 'gs-9', 'gs-11', 'gs-15', 'area:huntsville', 'area:rest-of-us'],
});
