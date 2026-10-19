import { defineArea } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const a = K.areaBySlug('chicago')!;
const mil = K.area('MIL'), dv = K.area('DV'), sl = K.area('SL'), ind = K.area('IND'), rus = K.area('RUS');
const ranked = [...K.AREAS].sort((x, y) => y.pct - x.pct);
const rank = ranked.findIndex((x) => x.code === a.code) + 1;
const st = K.countiesOfArea(a.code);
const n = st.reduce((s, x) => s + x.names.length, 0);
const of = (s: string) => st.find((x) => x.st === s)!.names;
const g = (gr: number, s = 1, c = a.code) => K.pay(gr, s, c).annual;
const p = (gr: number, s = 1, c = a.code) => K.pay(gr, s, c);
const row15 = K.table(a.code)[14];
const capped = row15.filter((x) => x >= K.CAP).length;
const firstCap = row15.findIndex((x) => x >= K.CAP) + 1;
const below = ranked.slice(rank).length;

export default defineArea({
  slug: 'chicago',
  where: ['IL', 'Cook County'],
  title: 'Chicago Locality Pay 2026: GS Table for IL, IN and WI',
  description: `Chicago locality pay 2026 is ${K.dec(a.pct, 2)} %: GS-9 step 1 earns ${K.usd(g(9))}, GS-12 ${K.usd(g(12))}. All ${n} counties in Illinois, Indiana and Wisconsin, hourly rates and the cap.`,
  intro: `Cook County and ${n - 1} other counties across three states share a ${K.dec(a.pct, 2)} % locality rate. Choose your county to confirm.`,
  resume: `For ${K.P.year}, the Chicago-Naperville locality pay area adds ${K.dec(a.pct, 2)} % to General Schedule base rates, the same figure as in 2025, since the January raise of ${K.dec(K.RAISE, 1)} % went entirely to the base table. That places Chicago ${rank}th of ${K.AREAS.length} areas, with ${below} areas below it. Annual pay at step 1 is ${K.usd(g(5))} for GS-5, ${K.usd(g(7))} for GS-7, ${K.usd(g(9))} for GS-9, ${K.usd(g(11))} for GS-11, ${K.usd(g(12))} for GS-12 and ${K.usd(g(13))} for GS-13; by the hour, a GS-12 step 1 earns ${K.usd2(p(12).hourly)}. The area lists ${n} counties: ${of('IL').length} in Illinois, from Cook and DuPage out to Winnebago, LaSalle and Kankakee, ${of('IN').length} in northwest Indiana, and ${of('WI').join(', ')} in Wisconsin. GS-15 reaches the ${K.usd(K.CAP)} cap at step ${firstCap}, which leaves ${capped} steps capped. Milwaukee, to the north, is a separate area at ${K.dec(mil.pct, 2)} %, ${K.usd(g(12) - g(12, 1, 'MIL'))} lower for a GS-12 step 1.`,
  body: (h) => `
<h2>Kenosha yes, Racine no</h2>
<p>The Wisconsin line is the one people get wrong. Kenosha County is the only Wisconsin county in the Chicago area. Racine County, directly to its north, is part of Milwaukee-Racine-Waukesha, along with Milwaukee, Waukesha, Walworth and six others. Two worksites a few miles apart can therefore sit on tables ${K.dec(a.pct - mil.pct, 2)} points apart: a GS-11 step 5 earns ${K.usd(g(11, 5))} in Kenosha and ${K.usd(g(11, 5, 'MIL'))} in Racine.</p>
${h.mini('lookup', { t: 'Check a county near the Wisconsin or Indiana line', p: ['st', 'co'], d: { st: 'WI', co: 'Kenosha County', g: '11' } })}
<h2>How far into Illinois the area goes</h2>
<p>Beyond the six collar counties (Cook, DuPage, Kane, Lake, McHenry and Will), the list runs west and south. Rockford's Winnebago County and neighboring Boone, Ogle and Stephenson are included. So are DeKalb, Kendall and Grundy, the Illinois River counties of LaSalle, Bureau and Putnam, and Kankakee and Iroquois to the south. Farther out, other areas take over: Rock Island, Henry and Whiteside go to Davenport-Moline at ${K.dec(dv.pct, 2)} %, and the Metro East counties go to St. Louis at ${K.dec(sl.pct, 2)} %. The rest of central and southern Illinois is Rest of U.S.</p>
<h2>The Indiana side</h2>
<p>Lake and Porter counties are the obvious ones. LaPorte, Jasper, Newton and Starke are included too. Note that Lake County appears twice in the definitions, once for Illinois and once for Indiana, and both are in the Chicago area. Indianapolis is its own area at ${K.dec(ind.pct, 2)} %, so a transfer from Gary to Indianapolis at GS-12 step 1 would lower pay by ${K.usd(g(12) - g(12, 1, 'IND'))}.</p>
<h2>Hourly and overtime rates in Chicago</h2>
<p>Hourly pay is the annual rate divided by ${K.num(2087)} hours. A GS-7 step 1 earns ${K.usd2(p(7).hourly)} an hour and ${K.usd2(p(7).overtime)} for each overtime hour. Above GS-10 step 1, overtime for FLSA-exempt employees is capped at one and a half times the GS-10 step 1 hourly rate of the area, which is why a GS-13 step 1 at ${K.usd2(p(13).hourly)} an hour gets ${K.usd2(p(13).overtime)}, not time and a half.</p>
${h.mini('hourly', { t: 'Hourly and overtime pay in the Chicago area', p: ['g', 's', 'ot'], d: { g: '7', s: '1', a: a.code, ot: 8 } })}
<h2>Reporting to a downtown office from another area</h2>
<p>The rate depends on the official worksite, under 5 CFR 531.605. If you are scheduled to report to a Chicago office at least twice per biweekly pay period, that office sets your pay, even if you live in Racine or in a Rest of U.S. county. A fully remote arrangement moves the worksite to the home. For a GS-13 step 1 the gap between Chicago and Rest of U.S. is ${K.usd(g(13) - g(13, 1, 'RUS'))}. At the top, the ${capped} capped GS-15 steps are covered in the ${h.a('gs-pay-cap', 'pay cap guide')}.</p>
`,
  faqs: [
    { q: 'What is the 2026 locality pay percentage for Chicago?', a: `It is ${K.dec(a.pct, 2)} % for the Chicago-Naperville area, unchanged from 2025. Every GS base rate is multiplied by that figure, rounded to the dollar and capped at ${K.usd(K.CAP)}. A GS-11 step 1 earns ${K.usd(g(11))} in ${K.P.year}, compared with ${K.usd(g(11, 1, 'RUS'))} in Rest of U.S.` },
    { q: 'Is Rockford in the Chicago locality pay area?', a: `Yes. Winnebago County, home of Rockford, is one of ${of('IL').length} Illinois counties in the Chicago-Naperville area for ${K.P.year}, together with Boone, Ogle and Stephenson nearby. A GS-9 step 1 there is paid ${K.usd(g(9))}, the same as in Cook County, because one table applies to the whole area.` },
    { q: 'Is Gary, Indiana, paid at Chicago locality rates?', a: `Yes. Lake County, Indiana, which includes Gary and Hammond, belongs to the Chicago-Naperville area, as do Porter, LaPorte, Jasper, Newton and Starke counties. A GS-12 step 1 at a worksite there earns ${K.usd(g(12))}, while Indianapolis worksites are paid at ${K.dec(ind.pct, 2)} %.` },
  ],
  related: ['locality-pay', 'gs-hourly-pay', 'gs-pay-scale-2026', 'gs-12', 'gs-7', 'gs-pay-cap', 'area:denver'],
});
