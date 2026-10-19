import { defineArea } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const a = K.areaBySlug('dallas-fort-worth')!;
const hou = K.area('HOU'), au = K.area('AU'), rus = K.area('RUS');
const ranked = [...K.AREAS].sort((x, y) => y.pct - x.pct);
const rank = ranked.findIndex((x) => x.code === a.code) + 1;
const st = K.countiesOfArea(a.code);
const tx = st.find((x) => x.st === 'TX')!.names, ok = st.find((x) => x.st === 'OK')!.names;
const okNames = (() => { const b = ok.map((x) => x.replace(/ County$/, '')); return `${b.slice(0, -1).join(', ')} and ${b[b.length - 1]}`; })();
const okAll = K.countiesOf('OK').length;
const g = (gr: number, s = 1, c = a.code) => K.pay(gr, s, c).annual;
const row15 = K.table(a.code)[14];
const capped = row15.filter((x) => x >= K.CAP).length;
const firstCap = row15.findIndex((x) => x >= K.CAP) + 1;

export default defineArea({
  slug: 'dallas-fort-worth',
  where: ['TX', 'Dallas County'],
  title: 'Dallas-Fort Worth Locality Pay 2026: GS Table, TX and OK',
  description: `Dallas-Fort Worth locality pay 2026 is ${K.dec(a.pct, 2)} %: GS-9 step 1 earns ${K.usd(g(9))}, GS-12 ${K.usd(g(12))}. ${tx.length} Texas and ${ok.length} Oklahoma counties, and the gap with Houston pay.`,
  intro: `North Texas and three Oklahoma counties share a ${K.dec(a.pct, 2)} % rate. Choose your county to see whether your duty station is on this table.`,
  resume: `Federal workers in the Dallas-Fort Worth locality pay area earn ${K.dec(a.pct, 2)} % above the General Schedule base table in ${K.P.year}, the same percentage as in 2025. That ranks the area ${rank}th of ${K.AREAS.length}, in the upper third but well below Houston at ${K.dec(hou.pct, 2)} %. Annual step 1 rates are ${K.usd(g(5))} for GS-5, ${K.usd(g(7))} for GS-7, ${K.usd(g(9))} for GS-9, ${K.usd(g(11))} for GS-11, ${K.usd(g(12))} for GS-12, ${K.usd(g(13))} for GS-13 and ${K.usd(g(14))} for GS-14. The area holds ${tx.length + ok.length} counties: ${tx.length} in Texas, from Dallas, Tarrant, Collin and Denton out to Grayson, Henderson, Navarro and Palo Pinto, and ${ok.length} across the Red River in Oklahoma (${ok.join(', ')}). The ${K.usd(K.CAP)} cap affects ${capped} GS-15 steps, starting at step ${firstCap}. Comparing the two big Texas tables, a GS-12 step 1 earns ${K.usd(g(12, 1, 'HOU') - g(12))} more in Houston than in Dallas-Fort Worth, so a move between the two cities changes pay more than most promotions within a grade.`,
  body: (h) => `
<h2>The Oklahoma counties</h2>
<p>Only ${okAll} Oklahoma counties appear anywhere in the ${K.P.year} locality definitions, and all of them are in this area: ${ok.join(', ')}. That gives worksites in Durant and Ardmore a higher table than Oklahoma City or Tulsa, which are Rest of U.S. at ${K.dec(rus.pct, 2)} %. For a GS-11 step 1 the difference is ${K.usd(g(11) - g(11, 1, 'RUS'))} a year in favor of the smaller towns near the Texas line.</p>
${h.mini('lookup', { t: 'Is your Oklahoma or Texas county in Dallas-Fort Worth?', p: ['st', 'co'], d: { st: 'OK', co: 'Carter County', g: '11' } })}
<h2>A wide circle around the Metroplex</h2>
<p>Beyond the core of Dallas, Tarrant, Collin, Denton, Rockwall, Kaufman, Ellis, Johnson and Parker, the Texas list covers a ring that people outside the region rarely picture as Dallas. To the north: Cooke, Grayson, Fannin and Montague. To the east: Hunt, Rains, Van Zandt, Hopkins, Delta and Henderson. To the south and west: Navarro, Hill, Hood, Somervell, Palo Pinto, Jack and Wise. All ${tx.length} counties use one table.</p>
<h2>Houston, Austin and Dallas side by side</h2>
${h.table(['Grade, step 1', 'Dallas-Fort Worth', 'Houston', 'Austin', 'Rest of U.S.'], [7, 9, 11, 12, 13].map((gr) => [`GS-${gr}`, K.usd(g(gr)), K.usd(g(gr, 1, 'HOU')), K.usd(g(gr, 1, 'AU')), K.usd(g(gr, 1, 'RUS'))]), `${K.P.year} annual rates. Dallas-Fort Worth ${K.dec(a.pct, 2)} %, Houston ${K.dec(hou.pct, 2)} %, Austin ${K.dec(au.pct, 2)} %, Rest of U.S. ${K.dec(rus.pct, 2)} %.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The order surprises newcomers: Houston pays more than Dallas, and Dallas pays more than Austin. These figures come from comparisons with private and other non-federal salaries, area by area, not from prices or rents.</p>
<h2>Moving within Texas</h2>
<p>A reassignment from Fort Worth to Houston at the same grade and step raises pay by the gap in the table. At GS-12 step 5 it is ${K.usd(g(12, 5, 'HOU') - g(12, 5))} a year. The reverse move to Austin lowers the same cell by ${K.usd(g(12, 5) - g(12, 5, 'AU'))}. If the move comes with a promotion, the ${h.a('gs-promotion-calculator', 'promotion calculator')} applies the two-step rule first and the new area afterward.</p>
<h2>Teleworkers in North Texas</h2>
<p>The pay area is the one of the official worksite. Under 5 CFR 531.605, an employee who reports to a Dallas or Fort Worth office at least twice each biweekly pay period keeps that office as the worksite, even if home is in a Rest of U.S. county such as one near Waco or Wichita Falls. On full remote work, the home county decides.</p>
<h2>At the top of the scale</h2>
<p>GS-15 steps ${firstCap} to 10 are capped at ${K.usd(K.CAP)}; GS-14 step 10 pays ${K.usd(K.table(a.code)[13][9])}. With ${capped} capped steps, Dallas has fewer flat cells than ${h.a('area:houston', 'Houston')}, where the higher percentage reaches the cap sooner.</p>
`,
  faqs: [
    { q: 'What is the Dallas-Fort Worth locality pay for 2026?', a: `It is ${K.dec(a.pct, 2)} % for every GS grade and step, unchanged from 2025. A GS-11 step 1 in the area earns ${K.usd(g(11))} and a GS-13 step 1 ${K.usd(g(13))} in ${K.P.year}. The same table covers ${tx.length} Texas counties and ${ok.length} counties in southern Oklahoma.` },
    { q: 'Which Oklahoma counties get Dallas-Fort Worth locality pay?', a: `${okNames} counties, in southern Oklahoma near the Red River. They are the only Oklahoma counties in a named locality area for ${K.P.year}. Every other county in the state, including those of Oklahoma City and Tulsa, is paid at the Rest of U.S. rate of ${K.dec(rus.pct, 2)} %.` },
    { q: 'Is Sherman, Texas, in the Dallas-Fort Worth locality pay area?', a: `Yes. Sherman and Denison are in Grayson County, which OPM lists in the Dallas-Fort Worth area for ${K.P.year}. A GS-9 step 1 there earns ${K.usd(g(9))}, the same as in Dallas. Cooke, Fannin and Montague counties nearby are included too, all on one table.` },
  ],
  related: ['locality-pay', 'gs-promotion-calculator', 'gs-pay-scale-2026', 'gs-12', 'gs-13', 'area:houston', 'area:rest-of-us'],
});
