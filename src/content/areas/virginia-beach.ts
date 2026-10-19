import { defineArea } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const a = K.areaBySlug('virginia-beach')!;
const rch = K.area('RCH'), dc = K.area('DCB'), ra = K.area('RA'), rus = K.area('RUS');
const sorted = [...K.AREAS].sort((x, y) => y.pct - x.pct);
const rank = sorted.findIndex((x) => x.code === a.code) + 1;
const ord = (n: number) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;
const join = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}` : xs[0]);
const va = K.countiesOfArea(a.code).find((x) => x.st === 'VA')?.names ?? [];
const nc = K.countiesOfArea(a.code).find((x) => x.st === 'NC')?.names ?? [];
const cities = va.filter((n) => n.endsWith(' city'));
const counties = va.filter((n) => !n.endsWith(' city'));
const g = (gr: number, s = 1, c = a.code) => K.pay(gr, s, c).annual;
const top = K.table(a.code)[14][9];
const gs10 = K.pay(10, 1, a.code), gs8 = K.pay(8, 5, a.code);

export default defineArea({
  slug: 'virginia-beach',
  where: ['VA', 'Norfolk city'],
  title: 'Virginia Beach Locality Pay 2026: GS Pay in Hampton Roads',
  description: `Virginia Beach locality pay 2026 is ${K.dec(a.pct, 2)} % for Norfolk, Hampton Roads and ${nc.length} North Carolina counties: GS-11 step 1 pays ${K.usd(g(11))}, GS-12 ${K.usd(g(12))}. Full table.`,
  intro: `Norfolk, Newport News, Chesapeake and the rest of Hampton Roads are paid ${K.dec(a.pct, 2)} % above the GS base rates in ${K.P.year}.`,
  resume: `The Virginia Beach-Norfolk locality pay area adds ${K.dec(a.pct, 2)} % to the General Schedule base table in ${K.P.year}, unchanged from 2025, since Executive Order 14368 froze all localities while raising base pay ${K.dec(K.RAISE, 1)} %. It spans two states: ${va.length} Virginia jurisdictions, ${cities.length} of them independent cities such as Norfolk, Virginia Beach, Chesapeake, Hampton and Newport News, and ${nc.length} counties of northeastern North Carolina, including Dare and Currituck. A GS-5 step 1 earns ${K.usd(g(5))}, a GS-7 ${K.usd(g(7))}, a GS-9 ${K.usd(g(9))}, a GS-11 ${K.usd(g(11))}, a GS-12 ${K.usd(g(12))} and a GS-13 ${K.usd(g(13))}. The area ranks ${ord(rank)} of ${K.AREAS.length}. Richmond, the next area west, pays ${K.dec(rch.pct, 2)} %, and the Washington area ${K.dec(dc.pct, 2)} %, so a transfer north within Virginia usually brings a raise at the same grade and step. No cell of the table is capped: GS-15 step 10 pays ${K.usd(top)}.`,
  body: (h) => `
<h2>Independent cities and two states</h2>
<p>Virginia's independent cities are not part of any county, and OPM lists them one by one. The Hampton Roads area includes ${join(cities)}, plus ${join(counties)}. Across the state line it takes in ${join(nc)} in North Carolina. A worksite on the Outer Banks in Dare County is therefore paid the same table as one in downtown Norfolk, even though the rest of eastern North Carolina is mostly ${h.a('area:rest-of-us', 'Rest of U.S.')}.</p>
${h.mini('lookup', { t: 'Check a Hampton Roads or North Carolina worksite', p: ['st', 'co'], d: { st: 'NC', co: 'Dare County', g: '9' } })}
<h2>Defense jobs, one percentage</h2>
<p>The region holds a large defense civilian workforce. All of it is paid the same ${K.dec(a.pct, 2)} % whatever the agency, because locality is set by place, not employer. Hourly figures matter here for shift and overtime work: a GS-8 step 5 earns ${K.usd2(gs8.hourly)} an hour, and an FLSA-exempt employee's overtime is capped at 1.5 times the local GS-10 step 1 hourly rate of ${K.usd2(gs10.hourly)} once the regular rate goes above it.</p>
<h2>Richmond, Washington and Raleigh</h2>
<p>Hampton Roads sits in the lower part of the ranking, below each of the named areas around it. ${rch.short} pays ${K.dec(rch.pct, 2)} %, ${K.usd(g(12, 1, 'RCH') - g(12))} more at GS-12 step 1. The Washington area pays ${K.usd(g(12, 1, 'DCB') - g(12))} more at the same cell. ${ra.short}, the closest North Carolina metro with its own table, pays ${K.dec(ra.pct, 2)} %. These gaps come from surveys of non-federal pay in each market: the percentage is not an index of local living costs.</p>
<h2>Who gets the Hampton Roads rate</h2>
<p>The SF-50 worksite decides, not the home. A teleworker who lives in a Rest of U.S. county of Virginia but reports to an office in Portsmouth at least twice each biweekly pay period keeps this table under 5 CFR 531.605. Without that regular reporting, the approved home address becomes the worksite and its county sets the rate. A GS-11 step 5 who moves from a Norfolk office to full remote work from a Rest of U.S. county loses ${K.usd(g(11, 5) - g(11, 5, 'RUS'))} a year; one who takes a position in Arlington gains ${K.usd(g(11, 5, 'DCB') - g(11, 5))}.</p>
<h2>The top of the table</h2>
<p>With a percentage under ${K.dec(Math.ceil(a.pct), 0)} %, the Virginia Beach table never reaches the ${K.usd(K.CAP)} cap: GS-15 step 10 stops at ${K.usd(top)}, ${K.usd(K.CAP - top)} below. The ${h.a('area:washington-dc', 'Washington DC page')} covers the northern Virginia counties and the ${h.a('gs-hourly-pay', 'hourly pay page')} the overtime rule.</p>
`,
  faqs: [
    { q: 'What is the locality pay for Norfolk, Virginia, in 2026?', a: `Norfolk is in the Virginia Beach-Norfolk area, paid ${K.dec(a.pct, 2)} % above the base table in ${K.P.year}, the same percentage as in 2025. A GS-9 step 1 earns ${K.usd(g(9))}, a GS-11 step 1 ${K.usd(g(11))} and a GS-12 step 1 ${K.usd(g(12))}. Every independent city and county of Hampton Roads uses the same table.` },
    { q: 'Are the Outer Banks in the Virginia Beach locality pay area?', a: `Yes. Dare County, which covers most of the Outer Banks, is one of the ${nc.length} North Carolina counties in the Virginia Beach-Norfolk area, along with Currituck, Camden and Pasquotank. A federal worksite there is paid ${K.dec(a.pct, 2)} % in ${K.P.year}, not the Rest of U.S. rate that applies to most of eastern North Carolina.` },
    { q: 'Is Richmond locality pay higher than Hampton Roads?', a: `Yes. Richmond is paid ${K.dec(rch.pct, 2)} % in ${K.P.year}, against ${K.dec(a.pct, 2)} % for Virginia Beach-Norfolk. At GS-12 step 1 that is ${K.usd(g(12, 1, 'RCH') - g(12))} a year more, and at GS-13 step 1 ${K.usd(g(13, 1, 'RCH') - g(13))}. Grade and step stay the same on a transfer; only the locality changes.` },
  ],
  related: ['locality-pay', 'area:washington-dc', 'area:rest-of-us', 'gs-hourly-pay', 'gs-11', 'gs-12'],
});
