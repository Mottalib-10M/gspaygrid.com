import { defineArea } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const a = K.areaBySlug('philadelphia')!;
const ny = K.area('NY'), dcb = K.area('DCB'), hb = K.area('HB'), rus = K.area('RUS');
const ranked = [...K.AREAS].sort((x, y) => y.pct - x.pct);
const rank = ranked.findIndex((x) => x.code === a.code) + 1;
const st = K.countiesOfArea(a.code);
const of = (s: string) => st.find((x) => x.st === s)!.names;
const n = st.reduce((s, x) => s + x.names.length, 0);
const deAll = K.countiesOf('DE').every(([, c]) => c === a.code);
const g = (gr: number, s = 1, c = a.code) => K.pay(gr, s, c).annual;
const row15 = K.table(a.code)[14];
const capped = row15.filter((x) => x >= K.CAP).length;
const firstCap = row15.findIndex((x) => x >= K.CAP) + 1;
const shoreDC = ['Caroline County', 'Dorchester County', 'Kent County', 'Talbot County', "Queen Anne's County"].filter((c) => K.areaOf('MD', c) === 'DCB');

export default defineArea({
  slug: 'philadelphia',
  where: ['PA', 'Philadelphia County'],
  title: 'Philadelphia Locality Pay 2026: GS Rates for PA, NJ, DE, MD',
  description: `Philadelphia locality pay 2026 is ${K.dec(a.pct, 2)} %: GS-11 step 1 pays ${K.usd(g(11))}, GS-12 ${K.usd(g(12))}. The ${n} counties in PA, NJ, DE and MD, and the New York and DC lines.`,
  intro: `Squeezed between New York and Washington, Philadelphia pays ${K.dec(a.pct, 2)} % across four states. Check your county before you assume.`,
  resume: `The Philadelphia-Reading-Camden locality pay area pays ${K.dec(a.pct, 2)} % above the General Schedule base table in ${K.P.year}, the rate set in 2025 and frozen for this year. It ranks ${rank}th of ${K.AREAS.length} areas and sits between two higher neighbors: New York-Newark at ${K.dec(ny.pct, 2)} % and Washington-Baltimore at ${K.dec(dcb.pct, 2)} %. The table gives ${K.usd(g(5))} at GS-5 step 1, ${K.usd(g(7))} at GS-7, ${K.usd(g(9))} at GS-9, ${K.usd(g(11))} at GS-11, ${K.usd(g(12))} at GS-12, ${K.usd(g(13))} at GS-13 and ${K.usd(g(14))} at GS-14. The area has ${n} counties in four states: ${of('PA').length} in Pennsylvania (Philadelphia, its suburbs, Berks and Schuylkill), ${of('NJ').length} in southern New Jersey, ${of('DE').length} in Delaware${deAll ? ', which is the whole state,' : ''} and ${of('MD').length} in Maryland (${of('MD').join(', ')}). GS-15 is capped at ${K.usd(K.CAP)} from step ${firstCap}, ${capped} steps in all. A worksite that falls on the New York side of the line in New Jersey pays a GS-12 step 1 ${K.usd(g(12, 1, 'NY') - g(12))} more; one on the Washington side in Maryland, ${K.usd(g(12, 1, 'DCB') - g(12))} more.`,
  body: (h) => `
<h2>Between two higher areas</h2>
<p>Philadelphia's geography makes its boundaries matter more than most. North and east, the New York area takes Mercer, Middlesex, Monmouth and Ocean counties in New Jersey and the Lehigh Valley in Pennsylvania. South and west, the Washington area takes York and Adams counties in Pennsylvania and most of Maryland. West, Lancaster, Lebanon and Dauphin belong to Harrisburg at ${K.dec(hb.pct, 2)} %. Whichever direction a duty station moves, the rate changes.</p>
<h2>The Delmarva split, county by county</h2>
<p>The Eastern Shore of Maryland is divided. Cecil County at the top and the three southern counties of Wicomico, Worcester and Somerset are in Philadelphia. ${shoreDC.length ? `The middle of the shore, ${shoreDC.join(', ').replace(/ County/g, '')} counties, is in Washington-Baltimore.` : ''} So a worksite in Salisbury (Wicomico) is on the ${K.dec(a.pct, 2)} % table while one in Cambridge (Dorchester) is on the ${K.dec(dcb.pct, 2)} % table. In Delaware there is no split: ${deAll ? 'all three counties, New Castle, Kent and Sussex,' : 'the listed counties'} belong to Philadelphia.</p>
${h.mini('lookup', { t: 'Check an Eastern Shore or Delaware worksite', p: ['st', 'co'], d: { st: 'MD', co: 'Wicomico County', g: '11' } })}
<h2>Southern New Jersey</h2>
<p>The New Jersey part of the area is the seven southern counties: ${of('NJ').join(', ')}. Burlington County is in Philadelphia, but OPM lists Fort Dix, McGuire Air Force Base and Joint Base McGuire-Dix-Lakehurst by name in the ${h.a('area:new-york', 'New York')} area. If your SF-50 names the joint base as the duty station, the New York table applies, ${K.usd(g(11, 1, 'NY') - g(11))} more for a GS-11 step 1.</p>
<h2>What the neighbors pay</h2>
${h.table(['Grade, step 1', 'Philadelphia', 'New York', 'Washington', 'Harrisburg'], [9, 11, 12, 13].map((gr) => [`GS-${gr}`, K.usd(g(gr)), K.usd(g(gr, 1, 'NY')), K.usd(g(gr, 1, 'DCB')), K.usd(g(gr, 1, 'HB'))]), `${K.P.year} annual rates. Philadelphia ${K.dec(a.pct, 2)} %, New York ${K.dec(ny.pct, 2)} %, Washington ${K.dec(dcb.pct, 2)} %, Harrisburg ${K.dec(hb.pct, 2)} %.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Living in one state, reporting in another</h2>
<p>This area has a lot of interstate commuting: Delaware to Pennsylvania, New Jersey to Philadelphia, Pennsylvania into Maryland. None of it affects pay by itself. The rule in 5 CFR 531.605 looks only at the official worksite. If you are scheduled to report to your office at least twice in each biweekly pay period, that office's county sets the rate. If you work remotely, your home county does, and a home in a Rest of U.S. county, such as most of central Pennsylvania, means ${K.dec(rus.pct, 2)} %.</p>
<h2>Cap and higher grades</h2>
<p>GS-14 stays below the ceiling at every step, with step 10 at ${K.usd(K.table(a.code)[13][9])}. GS-15 reaches ${K.usd(K.CAP)} at step ${firstCap}. Compared with ${h.a('area:washington-dc', 'Washington DC')}, the Philadelphia table has fewer capped steps, so step increases at GS-15 keep paying for longer.</p>
`,
  faqs: [
    { q: 'What is the Philadelphia locality pay for 2026?', a: `It is ${K.dec(a.pct, 2)} % for the Philadelphia-Reading-Camden area, the same as in 2025. Applied to the ${K.P.year} base table, it gives ${K.usd(g(9))} for GS-9 step 1 and ${K.usd(g(13))} for GS-13 step 1. Rates are rounded to the dollar and capped at ${K.usd(K.CAP)}.` },
    { q: 'Is Wilmington, Delaware, in the Philadelphia locality pay area?', a: `Yes. New Castle County, which includes Wilmington, is in the Philadelphia-Reading-Camden area, and so are Kent and Sussex counties. ${deAll ? 'Delaware is entirely inside the area, so' : 'So'} every federal worksite in the state uses the Philadelphia table: ${K.usd(g(11))} for GS-11 step 1 in ${K.P.year}.` },
    { q: 'Is Salisbury, Maryland, paid at Philadelphia or Washington rates?', a: `Philadelphia. Wicomico County, which includes Salisbury, is listed in the Philadelphia-Reading-Camden area together with Worcester, Somerset and Cecil counties. Dorchester and Talbot counties, farther up the shore, are in the Washington-Baltimore area at ${K.dec(dcb.pct, 2)} %. Check the county of the duty station.` },
    { q: 'Is Reading, Pennsylvania, in the Philadelphia locality area?', a: `Yes. Berks County, which includes Reading, is one of ${of('PA').length} Pennsylvania counties in the Philadelphia area, along with Schuylkill to its north. Lancaster County, to the southwest, belongs to Harrisburg at ${K.dec(hb.pct, 2)} %, and Lehigh County, to the northeast, to New York.` },
  ],
  related: ['locality-pay', 'gs-pay-scale-2026', 'gs-11', 'gs-12', 'gs-pay-cap', 'area:new-york', 'area:washington-dc'],
});
