import { defineArea } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const a = K.areaBySlug('miami')!;
const pb = K.area('PB'), atl = K.area('ATL'), rus = K.area('RUS');
const sorted = [...K.AREAS].sort((x, y) => y.pct - x.pct);
const rank = sorted.findIndex((x) => x.code === a.code) + 1;
const ord = (n: number) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;
const join = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}` : xs[0]);
const names = K.countiesOfArea(a.code).flatMap((x) => x.names);
const fl = K.countiesOf('FL');
const pbN = fl.filter(([, c]) => c === 'PB').map(([n]) => n);
const g = (gr: number, s = 1, c = a.code) => K.pay(gr, s, c).annual;
const row15 = K.table(a.code)[14];
const capped = row15.filter((x) => x >= K.CAP).length;
const firstCapped = row15.findIndex((x) => x >= K.CAP) + 1;
const h7 = K.pay(7, 1, a.code), h11 = K.pay(11, 1, a.code);

export default defineArea({
  slug: 'miami',
  where: ['FL', 'Miami-Dade County'],
  title: 'Miami Locality Pay 2026: GS Pay from Miami-Dade to St. Lucie',
  description: `Miami locality pay 2026 is ${K.dec(a.pct, 2)} % in ${names.length} South Florida counties: GS-11 step 1 pays ${K.usd(g(11))}, GS-13 ${K.usd(g(13))}. Why Orlando, Tampa and Jacksonville get less.`,
  intro: `From the Keys to the Treasure Coast, ${names.length} Florida counties are paid ${K.dec(a.pct, 2)} % above the GS base table in ${K.P.year}.`,
  resume: `Miami-Port St. Lucie-Fort Lauderdale is the higher of the two locality pay areas in Florida. In ${K.P.year} it adds ${K.dec(a.pct, 2)} % to the General Schedule base table, the same percentage as in 2025, because Executive Order 14368 froze every locality while the base rates rose ${K.dec(K.RAISE, 1)} %. It covers ${names.length} counties: ${join(names)}. A GS-5 step 1 earns ${K.usd(g(5))}, a GS-7 ${K.usd(g(7))}, a GS-9 ${K.usd(g(9))}, a GS-11 ${K.usd(g(11))}, a GS-12 ${K.usd(g(12))}, a GS-13 ${K.usd(g(13))} and a GS-14 ${K.usd(g(14))}. It ranks ${ord(rank)} of the ${K.AREAS.length} areas. The only other named area in the state, Palm Bay-Melbourne-Titusville, pays ${K.dec(pb.pct, 2)} %, and every remaining Florida county, including those of Orlando, Tampa and Jacksonville, is Rest of U.S. at ${K.dec(rus.pct, 2)} %. GS-15 is capped at ${K.usd(K.CAP)} from step ${firstCapped}.`,
  body: (h) => `
<h2>Florida has one high-locality corridor</h2>
<p>Of all the counties in Florida, only ${fl.length} are named in OPM's ${K.P.year} locality definitions. ${names.length} of them form the Miami area along the southeast coast, from Monroe County and the Keys north through Miami-Dade, Broward and Palm Beach to Martin, St. Lucie and Indian River, with Okeechobee inland. ${join(pbN)} is the ${pb.short} area. Everything else, from the Panhandle to Orlando, Tampa and Jacksonville, is ${h.a('area:rest-of-us', 'Rest of U.S.')}.</p>
<p>That produces a sharp edge on the map. A GS-12 step 5 in Vero Beach, in Indian River County, earns ${K.usd(g(12, 5) - g(12, 5, 'PB'))} more than the same employee one county north in Brevard, and ${K.usd(g(12, 5) - g(12, 5, 'RUS'))} more than one in Orange County. Large metros like Tampa or Orlando have no area of their own in ${K.P.year}: an area exists only where OPM's definitions create one, and those counties are not listed.</p>
<h2>Hourly view of the Miami table</h2>
<p>For shift work and overtime, the hourly rate is what you see. A GS-7 step 1 in the Miami area earns ${K.usd2(h7.hourly)} an hour, ${K.usd2(h7.biweekly)} per 80-hour pay period; a GS-11 step 1 earns ${K.usd2(h11.hourly)}. The small table below switches between annual and hourly rates.</p>
${h.mini('table', { t: 'The Miami table, hourly or annual', p: ['u'], d: { a: a.code, u: 'hr' } })}
<h2>Capped GS-15 steps</h2>
<p>At ${K.dec(a.pct, 2)} %, the Miami table reaches the ${K.usd(K.CAP)} limit at GS-15 step ${firstCapped}. ${capped} step${capped > 1 ? 's' : ''} of GS-15 show${capped > 1 ? '' : 's'} that figure, so an employee at step ${firstCapped} gains nothing from a later step increase until the cap itself rises. The ${h.a('gs-pay-cap', 'pay cap page')} lists the capped cells of every area.</p>
<h2>Compared with Atlanta</h2>
<p>Miami is above ${atl.short}, at ${K.dec(atl.pct, 2)} %, by ${K.usd(g(12) - g(12, 1, 'ATL'))} at GS-12 step 1. These figures come from comparisons of federal and non-federal salaries in each labor market, carried out with Bureau of Labor Statistics surveys. They do not track housing costs, which is why the percentage is not a measure of how expensive South Florida is.</p>
<h2>Where you report decides</h2>
<p>A teleworker who lives in a Rest of U.S. county but is scheduled to report to a Fort Lauderdale office at least twice each biweekly pay period keeps the Miami rate (5 CFR 531.605). A remote employee whose approved worksite is a home in Orlando is paid Rest of U.S.</p>
`,
  faqs: [
    { q: 'What is the Miami locality pay for federal employees in 2026?', a: `It is ${K.dec(a.pct, 2)} %, unchanged from 2025, for worksites in the ${names.length} counties of the Miami-Port St. Lucie-Fort Lauderdale area. With the ${K.dec(K.RAISE, 1)} % base raise of January ${K.P.year}, a GS-9 step 1 earns ${K.usd(g(9))} and a GS-12 step 1 ${K.usd(g(12))}. Fort Lauderdale, West Palm Beach and Key West share the same table.` },
    { q: 'Does Orlando have its own GS locality pay area?', a: `No. Orange County and the other Orlando counties are not on any list in OPM's ${K.P.year} definitions, so federal worksites there are paid the Rest of U.S. rate of ${K.dec(rus.pct, 2)} %. The same is true of Tampa and Jacksonville. A GS-11 step 1 earns ${K.usd(g(11, 1, 'RUS'))} in Orlando and ${K.usd(g(11))} in Miami.` },
    { q: 'Is Port St. Lucie in the Miami locality area?', a: `Yes. St. Lucie County is part of the Miami-Port St. Lucie-Fort Lauderdale area, together with Martin, Indian River and Okeechobee counties to the north and west. A federal worksite in Port St. Lucie is paid ${K.dec(a.pct, 2)} % in ${K.P.year}, the same as Miami-Dade: ${K.usd(g(13))} at GS-13 step 1.` },
  ],
  related: ['locality-pay', 'area:atlanta', 'area:rest-of-us', 'gs-pay-cap', 'gs-hourly-pay', 'gs-12'],
});
