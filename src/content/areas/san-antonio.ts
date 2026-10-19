import { defineArea } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

// Found by its OPM name, not by slug: the area must be San Antonio-New Braunfels-Pearsall, TX.
const a = K.AREAS.find((x) => x.name.startsWith('San Antonio'))!;
const au = K.area('AU'), hou = K.area('HOU'), lr = K.area('LR'), cc = K.AREAS.find((x) => x.name.startsWith('Corpus Christi'))!, rus = K.area('RUS');
const sorted = [...K.AREAS].sort((x, y) => y.pct - x.pct);
const rank = sorted.findIndex((x) => x.code === a.code) + 1;
const ord = (n: number) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;
const names = K.countiesOfArea(a.code).flatMap((x) => x.names);
const tx = K.areasInState('TX');
const g = (gr: number, s = 1, c = a.code) => K.pay(gr, s, c).annual;
const w = K.steps(9, 1, 0, a.code);
const s10 = w[w.length - 1];
const g9s1 = g(9), g9s10 = g(9, 10), g11s10 = g(11, 10);
const top = K.table(a.code)[14][9];

export default defineArea({
  slug: 'san-antonio',
  where: ['TX', 'Bexar County'],
  title: 'San Antonio Locality Pay 2026: GS Salaries by Grade',
  description: `San Antonio locality pay 2026 is ${K.dec(a.pct, 2)} %: GS-9 step 1 pays ${K.usd(g(9))}, GS-12 ${K.usd(g(12))}. The ${names.length} Texas counties, step increases and how Austin and Houston compare.`,
  intro: `Bexar County and ${names.length - 1} other Texas counties are paid ${K.dec(a.pct, 2)} % above the GS base table in ${K.P.year}.`,
  resume: `San Antonio-New Braunfels-Pearsall is the locality pay area for federal worksites in Bexar County and ${names.length - 1} other Texas counties, including Comal, Guadalupe, Kendall and Medina. In ${K.P.year} it adds ${K.dec(a.pct, 2)} % to the General Schedule base table, the same percentage as in 2025, since Executive Order 14368 limited the January change to a ${K.dec(K.RAISE, 1)} % raise of the base rates. A GS-5 step 1 earns ${K.usd(g(5))}, a GS-7 ${K.usd(g(7))}, a GS-9 ${K.usd(g(9))}, a GS-11 ${K.usd(g(11))}, a GS-12 ${K.usd(g(12))} and a GS-13 ${K.usd(g(13))}. The area ranks ${ord(rank)} of ${K.AREAS.length}, and it is one of ${tx.length} named areas in Texas: ${au.short} pays ${K.dec(au.pct, 2)} % and ${hou.short} ${K.dec(hou.pct, 2)} %, both higher. GS-15 step 10 is ${K.usd(top)}, below the ${K.usd(K.CAP)} cap, so every step in this table pays more than the one before it.`,
  body: (h) => `
<h2>Counties of the area</h2>
<p>OPM's ${K.P.year} definition lists ${names.length} counties, all in Texas: ${names.join(', ')}. The list goes well past Bexar County. Kerr and Gillespie counties to the northwest, Frio and McMullen to the south and Gonzales and Karnes to the east all use this table. A Texas county missing from every list, such as Real or Edwards County just west of Kerr, is in ${h.a('area:rest-of-us', 'Rest of U.S.')}, at ${K.dec(rus.pct, 2)} %.</p>
<h2>Other Texas tables nearby</h2>
<p>San Antonio is surrounded by named areas with different percentages. ${h.a('area:houston', hou.short)}, at ${K.dec(hou.pct, 2)} %, is one of the highest in the country and pays ${K.usd(g(12, 1, 'HOU') - g(12))} more at GS-12 step 1. ${au.short}, just up the interstate, pays ${K.dec(au.pct, 2)} %, or ${K.usd(g(12, 1, 'AU') - g(12))} more. ${lr.short}, at ${K.dec(lr.pct, 2)} %, is also above San Antonio. Corpus Christi, at ${K.dec(cc.pct, 2)} %, is below it by ${K.usd(g(12) - g(12, 1, cc.code))} at the same cell. These differences come from separate surveys of non-federal pay in each labor market, not from local prices.</p>
<h2>A career at one grade: step increases</h2>
<p>San Antonio has a large defense workforce, and for anyone who stays at one grade, within-grade increases are the main source of raises. Under 5 CFR 531.405 steps 2 to 4 come after 52 weeks each, steps 5 to 7 after 104 weeks, steps 8 to 10 after 156 weeks, with performance at an acceptable level of competence. Starting at GS-9 step 1, ${K.usd(g9s1)} in this table, step 10 arrives after about ${K.dec(s10.monthsFromNow / 12, 0)} years and pays ${K.usd(g9s10)}, ${K.usd(g9s10 - g9s1)} more before any annual raise. At GS-11 the top step is ${K.usd(g11s10)}.</p>
${h.mini('wgi', { t: 'When is your next step in San Antonio?', p: ['g', 's', 'm'], d: { g: '9', s: '2', m: 4, a: a.code } })}
<h2>No capped cells</h2>
<p>Because the percentage is moderate, the whole table stays under the ${K.usd(K.CAP)} limit. GS-15 step 10 is ${K.usd(top)}, so a GS-15 employee here still gains from each step, unlike a GS-15 in ${hou.short} or other high areas where the top steps are frozen at the cap.</p>
<h2>Remote and hybrid schedules</h2>
<p>The table that applies is the one of your official worksite. 5 CFR 531.605 keeps an office as the worksite for a teleworker scheduled to report there at least twice each biweekly pay period. A remote employee in New Braunfels is paid the San Antonio rate because Comal County is in the area; one living in a Rest of U.S. county is not. The ${h.a('gs-step-increase', 'step increase page')} gives the timing for any grade.</p>
`,
  faqs: [
    { q: 'What is the GS locality pay for San Antonio in 2026?', a: `It is ${K.dec(a.pct, 2)} %, applied to every grade and step at worksites in the ${names.length} counties of the San Antonio-New Braunfels-Pearsall area. The percentage is the same as in 2025; the base table rose ${K.dec(K.RAISE, 1)} %. A GS-11 step 1 earns ${K.usd(g(11))} and a GS-12 step 1 ${K.usd(g(12))} in ${K.P.year}.` },
    { q: 'Is New Braunfels in the San Antonio locality area?', a: `Yes. New Braunfels lies in Comal County, and Comal County is one of the counties OPM places in the San Antonio area for ${K.P.year}. Guadalupe County, where part of the city extends, is in the area too. A federal worksite there is paid ${K.dec(a.pct, 2)} %, so a GS-9 step 1 earns ${K.usd(g(9))}.` },
    { q: 'Does Austin pay more than San Antonio for GS employees?', a: `Yes. Austin-Round Rock-Georgetown is paid ${K.dec(au.pct, 2)} % in ${K.P.year}, against ${K.dec(a.pct, 2)} % in San Antonio. For a GS-12 step 1 the difference is ${K.usd(g(12, 1, 'AU') - g(12))} a year; for a GS-13 step 1 it is ${K.usd(g(13, 1, 'AU') - g(13))}. Your rate follows the duty station, not where you live between the two cities.` },
  ],
  related: ['locality-pay', 'area:houston', 'area:dallas-fort-worth', 'gs-step-increase', 'gs-9', 'gs-11'],
});
