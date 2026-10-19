import { defineArea } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const a = K.areaBySlug('san-diego')!;
const la = K.area('LA'), sf = K.area('SF'), dcb = K.area('DCB'), rus = K.area('RUS');
const ranked = [...K.AREAS].sort((x, y) => y.pct - x.pct);
const rank = ranked.findIndex((x) => x.code === a.code) + 1;
const counties = K.countiesOfArea(a.code);
const only = counties[0].names[0];
const single = K.AREAS.filter((x) => { const c = K.countiesOfArea(x.code); return c.length === 1 && c[0].names.length === 1; }).length;
const g = (gr: number, s = 1, c = a.code) => K.pay(gr, s, c).annual;
const p = (gr: number, s = 1, c = a.code) => K.pay(gr, s, c);
const row15 = K.table(a.code)[14];
const capped = row15.filter((x) => x >= K.CAP).length;
const firstCap = row15.findIndex((x) => x >= K.CAP) + 1;

export default defineArea({
  slug: 'san-diego',
  where: ['CA', 'San Diego County'],
  title: 'San Diego Locality Pay 2026: GS Pay Table and Pay Cap',
  description: `San Diego locality pay 2026 is ${K.dec(a.pct, 2)} %: GS-7 step 1 earns ${K.usd(g(7))}, GS-11 ${K.usd(g(11))}, GS-12 ${K.usd(g(12))}. One county, hourly rates, the GS-15 cap and Los Angeles.`,
  intro: `A single county, a single rate: ${K.dec(a.pct, 2)} % above the GS base table. Use the calculator for your grade and step in San Diego County.`,
  resume: `San Diego-Chula Vista-Carlsbad is a one-county locality pay area. Every federal worksite in ${only} uses the same ${K.P.year} table, with ${K.dec(a.pct, 2)} % added to the General Schedule base rates, the percentage it already had in 2025. That is the ${rank === 6 ? 'sixth' : `number ${rank}`} highest of ${K.AREAS.length} areas, just ${K.dec(dcb.pct - a.pct, 2)} points under Washington-Baltimore and ${K.dec(la.pct - a.pct, 2)} points under Los Angeles. At step 1, GS-5 pays ${K.usd(g(5))}, GS-7 ${K.usd(g(7))}, GS-9 ${K.usd(g(9))}, GS-11 ${K.usd(g(11))}, GS-12 ${K.usd(g(12))} and GS-13 ${K.usd(g(13))}; by the hour, GS-9 step 1 is ${K.usd2(p(9).hourly)}. GS-15 steps ${firstCap} through 10, ${capped} cells, are held at the ${K.usd(K.CAP)} cap. The counties around San Diego are not in this area: Orange and Riverside to the north and Imperial to the east all belong to Los Angeles-Long Beach, so a worksite across the county line is paid ${K.usd(g(12, 1, 'LA') - g(12))} more at GS-12 step 1, not less.`,
  body: (h) => `
<h2>Only one county, and its neighbors pay more</h2>
<p>${single > 1 ? `San Diego is one of ${single} areas made of a single county.` : 'San Diego is the only area made of a single county.'} The boundary question is therefore simple inside the county and counterintuitive outside it. Each county that touches San Diego County, Orange, Riverside and Imperial, sits in the Los Angeles area at ${K.dec(la.pct, 2)} %. A duty station in El Centro or Temecula earns more than one in downtown San Diego at the same grade and step. People moving north from San Diego often expect a lower rate and get a higher one.</p>
${h.mini('gs', { t: 'Your 2026 rate in San Diego County', p: ['g', 's'], d: { g: '11', s: '3', st: 'CA', co: only } })}
<h2>San Diego, Los Angeles and the Bay Area compared</h2>
${h.table(['Grade, step 5', 'San Diego', 'Los Angeles', 'San Francisco'], [7, 9, 11, 12, 13].map((gr) => [`GS-${gr}`, K.usd(g(gr, 5)), K.usd(g(gr, 5, 'LA')), K.usd(g(gr, 5, 'SF'))]), `${K.P.year} annual rates at step 5. San Diego ${K.dec(a.pct, 2)} %, Los Angeles ${K.dec(la.pct, 2)} %, San Jose-San Francisco-Oakland ${K.dec(sf.pct, 2)} %.`, ['l', 'r', 'r', 'r'])}
<p>The order does not match what people pay for housing. Percentages are set by comparing federal salaries with non-federal salaries for the same kinds of work in each area, using pay surveys. ${h.a('area:los-angeles', 'Los Angeles')} and ${h.a('area:san-francisco', 'San Francisco')} come out higher on that measure.</p>
<h2>Hourly pay and overtime</h2>
<p>Divide the annual rate by ${K.num(2087)} hours and you get the hourly rate. A GS-5 step 1 in San Diego earns ${K.usd2(p(5).hourly)} an hour, a GS-7 step 1 ${K.usd2(p(7).hourly)} and a GS-11 step 1 ${K.usd2(p(11).hourly)}. For a full biweekly pay period of 80 hours, a GS-9 step 1 receives ${K.usd2(p(9).biweekly)} gross. Overtime for FLSA-exempt employees above GS-10 step 1 is limited to one and a half times the area's GS-10 step 1 hourly rate, so a GS-12 step 1 gets ${K.usd2(p(12).overtime)} an hour of overtime instead of ${K.usd2(p(12).hourly * 1.5)}. The ${h.a('gs-hourly-pay', 'hourly pay page')} covers the rule.</p>
<h2>The capped top of the table</h2>
<p>At GS-15, the uncapped rate would pass ${K.usd(K.CAP)} from step ${firstCap}, so steps ${firstCap} to 10 pay that amount. GS-14 is not affected: step 10 is ${K.usd(K.table(a.code)[13][9])}. A GS-15 at step ${firstCap} sees no pay change from later step increases until the cap is raised.</p>
<h2>Remote work and the border</h2>
<p>For a teleworker, the official worksite rule of 5 CFR 531.605 applies: report to the San Diego office at least twice each biweekly pay period and you keep this table; otherwise the home address sets the area. A home in Riverside County moves you to Los Angeles rates. A home in a Rest of U.S. county elsewhere would pay ${K.usd(g(12) - g(12, 1, 'RUS'))} less than San Diego at GS-12 step 1.</p>
`,
  faqs: [
    { q: 'What is the San Diego locality pay rate for 2026?', a: `It is ${K.dec(a.pct, 2)} % for the San Diego-Chula Vista-Carlsbad area, which covers all of San Diego County. The percentage is unchanged from 2025. A GS-12 step 1 earns ${K.usd(g(12))} and a GS-13 step 1 ${K.usd(g(13))} in ${K.P.year}, capped at ${K.usd(K.CAP)}.` },
    { q: 'Why is San Diego locality pay lower than Los Angeles?', a: `The two areas are surveyed separately. The comparison of federal and non-federal salaries gives Los Angeles a higher result, ${K.dec(la.pct, 2)} % against ${K.dec(a.pct, 2)} % in ${K.P.year}. Housing prices are not part of the calculation, which is why the gap does not follow rents.` },
    { q: 'Is Temecula in the San Diego locality pay area?', a: `No. Temecula is in Riverside County, which belongs to the Los Angeles-Long Beach area. A federal worksite there is paid at ${K.dec(la.pct, 2)} %, so a GS-11 step 1 earns ${K.usd(g(11, 1, 'LA'))} instead of the San Diego figure of ${K.usd(g(11))}. Only San Diego County itself is in the San Diego area.` },
  ],
  related: ['locality-pay', 'gs-hourly-pay', 'gs-pay-scale-2026', 'gs-11', 'gs-pay-cap', 'area:los-angeles', 'area:san-francisco'],
});
