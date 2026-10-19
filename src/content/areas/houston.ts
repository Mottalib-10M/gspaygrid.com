import { defineArea } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const a = K.areaBySlug('houston')!;
const dfw = K.area('DFW'), au = K.area('AU'), dcb = K.area('DCB'), sd = K.area('SD'), rus = K.area('RUS');
const ranked = [...K.AREAS].sort((x, y) => y.pct - x.pct);
const rank = ranked.findIndex((x) => x.code === a.code) + 1;
const above = ranked.slice(0, rank - 1).map((x) => x.short);
const counties = K.countiesOfArea(a.code)[0].names;
const g = (gr: number, s = 1, c = a.code) => K.pay(gr, s, c).annual;
const row15 = K.table(a.code)[14];
const capped = row15.filter((x) => x >= K.CAP).length;
const firstCap = row15.findIndex((x) => x >= K.CAP) + 1;
const txAreas = K.areasInState('TX').length;

export default defineArea({
  slug: 'houston',
  where: ['TX', 'Harris County'],
  title: 'Houston Locality Pay 2026: GS Pay Table and Texas Counties',
  description: `Houston locality pay 2026 is ${K.dec(a.pct, 2)} %, above Washington DC: GS-11 step 1 pays ${K.usd(g(11))}, GS-13 ${K.usd(g(13))}. All ${counties.length} counties, the GS-15 cap and Dallas compared.`,
  intro: `Houston's ${K.dec(a.pct, 2)} % beats Washington, Boston and San Diego. Pick a Texas county below to see if your office is in the area.`,
  resume: `The Houston-The Woodlands locality pay area adds ${K.dec(a.pct, 2)} % to General Schedule base pay in ${K.P.year}. That is the ${rank === 4 ? 'fourth' : `number ${rank}`} highest percentage of ${K.AREAS.length}, behind only ${above.join(', ')}, and higher than Washington-Baltimore at ${K.dec(dcb.pct, 2)} %. The percentage is the same as in 2025; the ${K.dec(K.RAISE, 1)} % raise of January ${K.P.year} applied to the base table. A GS-5 step 1 earns ${K.usd(g(5))}, GS-7 ${K.usd(g(7))}, GS-9 ${K.usd(g(9))}, GS-11 ${K.usd(g(11))}, GS-12 ${K.usd(g(12))} and GS-13 ${K.usd(g(13))}. The ${counties.length} counties of the area run from Harris, Fort Bend, Montgomery, Brazoria and Galveston out to Walker, Grimes, Washington, Matagorda and Jackson. The pay cap of ${K.usd(K.CAP)} holds ${capped} GS-15 steps. Inside Texas the contrast is strong: Dallas-Fort Worth is ${K.dec(dfw.pct, 2)} %, ${K.usd(g(12) - g(12, 1, 'DFW'))} less for a GS-12 step 1, and Austin ${K.dec(au.pct, 2)} %.`,
  body: (h) => `
<h2>Why Houston outranks Washington</h2>
<p>Many federal employees assume the capital pays the most. It does not. Locality percentages are set from Bureau of Labor Statistics surveys that compare federal salaries with non-federal salaries for comparable work in each area. The figure that results for Houston is higher than the one for Washington: the Houston table is ${K.dec(a.pct - dcb.pct, 2)} points higher. In dollars, a GS-13 step 1 earns ${K.usd(g(13))} in Houston and ${K.usd(g(13, 1, 'DCB'))} in Washington. Living costs do not enter the calculation.</p>
<h2>The county named Austin is in Houston</h2>
<p>Austin County, west of Houston, is listed in the Houston-The Woodlands area. It has nothing to do with the city of Austin, which is in Travis County and belongs to the Austin-Round Rock-Georgetown area at ${K.dec(au.pct, 2)} %. Washington County and Madison County are other names that also appear in other states with other areas. The calculator asks for the state first, then the county, so these traps resolve themselves.</p>
${h.mini('lookup', { t: 'Check a Texas county', p: ['st', 'co'], d: { st: 'TX', co: 'Austin County', g: '11' } })}
<h2>Rural counties on the Houston table</h2>
<p>The area is larger than the metro region most people picture. North, it takes Walker, Trinity, San Jacinto, Grimes and Madison counties. West, it includes Waller, Austin, Washington and Colorado. South and along the coast, Brazoria, Galveston, Matagorda, Wharton and Jackson. East, Liberty and Chambers. A federal worksite in Huntsville, Texas, in Bay City or in Brenham is paid exactly what one in downtown Houston is.</p>
<h2>What the ${K.P.year} raise was worth in Houston</h2>
<p>Because the percentage was frozen, every Houston rate rose by about the base-table raise. The mini calculator compares your 2025 and ${K.P.year} rates for any grade and step.</p>
${h.mini('raise2026', { t: 'Your 2026 raise in Houston', p: ['g', 's'], d: { g: '11', s: '5', a: a.code } })}
<h2>Texas has ${txAreas} named areas</h2>
<p>Besides Houston, Texas has ${h.a('area:dallas-fort-worth', 'Dallas-Fort Worth')} at ${K.dec(dfw.pct, 2)} %, Austin at ${K.dec(au.pct, 2)} % and several smaller areas, with the rest of the state in Rest of U.S. at ${K.dec(rus.pct, 2)} %. A reassignment from Houston to a Rest of U.S. county costs a GS-12 step 5 ${K.usd(g(12, 5) - g(12, 5, 'RUS'))} a year. Teleworkers keep the Houston rate when they report to the Houston office at least twice each biweekly pay period (5 CFR 531.605); full remote work moves the worksite to the home county.</p>
<h2>Capped GS-15 steps</h2>
<p>From GS-15 step ${firstCap}, the Houston rate would exceed ${K.usd(K.CAP)}, so those ${capped} steps all pay the cap. That is more capped cells than ${h.a('area:san-diego', 'San Diego')}, whose percentage of ${K.dec(sd.pct, 2)} % is lower. The ${h.a('gs-pay-cap', 'pay cap page')} has the details.</p>
`,
  faqs: [
    { q: 'What is the Houston locality pay percentage in 2026?', a: `It is ${K.dec(a.pct, 2)} %, unchanged from 2025, for every GS grade and step in the Houston-The Woodlands area. A GS-12 step 1 earns ${K.usd(g(12))} in ${K.P.year}. Each rate is rounded to the dollar and capped at ${K.usd(K.CAP)}, the Executive Schedule level IV salary.` },
    { q: 'Does Houston pay more than Washington DC for GS employees?', a: `Yes. In ${K.P.year}, Houston's locality is ${K.dec(a.pct, 2)} % and Washington-Baltimore's is ${K.dec(dcb.pct, 2)} %. The same GS-11 step 1 earns ${K.usd(g(11))} in Houston and ${K.usd(g(11, 1, 'DCB'))} in Washington. The ranking reflects surveys of non-federal pay for similar jobs, not the cost of housing or of living.` },
    { q: 'Is Galveston in the Houston locality pay area?', a: `Yes. Galveston County is one of the ${counties.length} counties of the Houston-The Woodlands area, along with Brazoria, Matagorda and Chambers on the coast. Federal worksites on the island and the mainland are paid ${K.usd(g(9))} at GS-9 step 1 in ${K.P.year}.` },
  ],
  related: ['locality-pay', 'federal-pay-raise-2026', 'gs-pay-scale-2026', 'gs-11', 'gs-pay-cap', 'area:dallas-fort-worth', 'area:los-angeles'],
});
