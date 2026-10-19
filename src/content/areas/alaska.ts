import { defineArea } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const a = K.areaBySlug('alaska')!;
const rus = K.area('RUS'), sea = K.area('SEA'), hi = K.area('HI');
const sorted = [...K.AREAS].sort((x, y) => y.pct - x.pct);
const rank = sorted.findIndex((x) => x.code === a.code) + 1;
const above = sorted[rank - 2], below = sorted[rank];
const ord = (n: number) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;
const t = K.table(a.code);
const capped = t[14].filter((x) => x >= K.CAP).length;
const firstCapped = t[14].findIndex((x) => x >= K.CAP) + 1;
const g5 = K.pay(5, 1, a.code), g7 = K.pay(7, 1, a.code), g9 = K.pay(9, 1, a.code), g11 = K.pay(11, 1, a.code), g12 = K.pay(12, 1, a.code), g13 = K.pay(13, 1, a.code), g14 = K.pay(14, 1, a.code);
const vsRus = (g: number, s: number) => K.usd(K.pay(g, s, a.code).annual - K.pay(g, s, 'RUS').annual);

export default defineArea({
  slug: 'alaska',
  title: 'Alaska Locality Pay 2026: GS Pay Table for the Whole State',
  description: `Alaska locality pay 2026 is ${K.dec(a.pct, 2)} % in every borough: GS-11 step 1 pays ${K.usd(g11.annual)}, GS-13 ${K.usd(g13.annual)}. Rank among ${K.AREAS.length} areas, the GS-15 cap and the COLA history.`,
  intro: `One percentage for the entire state, from Anchorage to the North Slope: ${K.dec(a.pct, 2)} % on top of the GS base table.`,
  resume: `Alaska is a single locality pay area: every federal worksite in the state, in Anchorage, Fairbanks, Juneau or a remote village, uses the same ${K.P.year} table at ${K.dec(a.pct, 2)} % above the base rates. That percentage did not change from 2025, because Executive Order 14368 raised the base table by ${K.dec(K.RAISE, 1)} % and froze every locality. It ranks ${ord(rank)} of the ${K.AREAS.length} areas, between ${above.short} and ${below.short}. A GS-5 step 1 earns ${K.usd(g5.annual)}, a GS-7 ${K.usd(g7.annual)}, a GS-9 ${K.usd(g9.annual)}, a GS-11 ${K.usd(g11.annual)}, a GS-12 ${K.usd(g12.annual)}, a GS-13 ${K.usd(g13.annual)} and a GS-14 ${K.usd(g14.annual)}. GS-15 reaches the ${K.usd(K.CAP)} cap from step ${firstCapped}, so ${capped} steps show the same figure. Locality pay came to Alaska through the Non-Foreign Area Retirement Equity Assurance Act of 2009; the old nonforeign cost-of-living allowance was phased out.`,
  body: (h) => `
<h2>No county lookup needed</h2>
<p>Most locality areas are lists of counties, and a worksite one county over can fall into another table. Alaska works differently. OPM's ${K.P.year} definitions name the State of Alaska as one area, so the borough or census area of your duty station does not matter. A ranger in a national park, a nurse at a federal clinic in Bethel and an analyst in a downtown Anchorage office at the same grade and step are paid the same rate. The calculator at the top of the page shows that: choose Alaska as the state and the only option is anywhere in the state.</p>
<h2>From allowance to locality pay</h2>
<p>Alaska was not always a locality pay area. The Non-Foreign Area Retirement Equity Assurance Act of 2009 phased in locality pay for the nonforeign areas of 5 CFR 591.205, and the old allowance was phased out. Today the Alaska percentage is set the same way as in any other area, from surveys of non-federal pay, not from prices in the state. The practical difference for a career employee is that locality pay is part of basic pay, which is what the FERS high-3 averages; the ${h.a('high-3-salary', 'high-3 page')} explains that average.</p>
<h2>How Alaska compares</h2>
<p>At ${K.dec(a.pct, 2)} %, Alaska sits close to the large West Coast and Northeast metros. ${sea.short}, the nearest area on the map, pays ${K.dec(sea.pct, 2)} %, so a transfer from Juneau to a Seattle office at GS-12 step 5 changes pay by ${K.usd(K.pay(12, 5, a.code).annual - K.pay(12, 5, sea.code).annual)} a year. Compared with Rest of U.S. the gap is ${vsRus(12, 5)} at the same cell, and compared with Hawaii, the other state-wide area at ${K.dec(hi.pct, 2)} %, it is ${K.usd(K.pay(12, 5, a.code).annual - K.pay(12, 5, hi.code).annual)}.</p>
<h2>The cap at GS-15</h2>
<p>A high percentage meets the ceiling sooner. In Alaska, GS-15 step ${firstCapped} and every step above it are held at ${K.usd(K.CAP)}, the rate of Executive Schedule level IV. A GS-15 at step ${firstCapped - 1} still gets a raise from the next within-grade increase; one already at step ${firstCapped} does not. Every grade from GS-1 to GS-14 is below the cap at all ten steps.</p>
${h.mini('cap', { t: 'Is your GS-15 step capped in Alaska?', p: ['s'], d: { g: '15', s: String(firstCapped), a: a.code } })}
<h2>Remote work from Alaska</h2>
<p>The worksite rule of 5 CFR 531.605 applies here as everywhere. If you report to an agency office at least twice each biweekly pay period, that office is your worksite. If your home in Alaska is the approved worksite for a remote position, you are paid the Alaska rate even when the team sits in another state. The reverse holds too: an employee who moves out of Alaska to work remotely from a Rest of U.S. county drops to ${K.dec(rus.pct, 2)} %. The ${h.a('locality-pay', 'locality pay page')} has the full ranking.</p>
`,
  faqs: [
    { q: 'What is the Alaska locality pay percentage in 2026?', a: `It is ${K.dec(a.pct, 2)} %, the same as in 2025, and it applies to every federal worksite in the state. A GS-9 step 1 earns ${K.usd(g9.annual)} and a GS-12 step 1 ${K.usd(g12.annual)}. The ${K.dec(K.RAISE, 1)} % raise of January ${K.P.year} went into the base table, which the percentage is applied to.` },
    { q: 'Do federal employees in Alaska still get a COLA?', a: 'Not the old nonforeign cost-of-living allowance. The Non-Foreign Area Retirement Equity Assurance Act of 2009 phased in locality pay for Alaska and the other nonforeign areas, and the allowance was phased out. GS employees in Alaska are now paid from the Alaska locality table. Retirement COLAs for annuitants are a different subject, set by the FERS and CSRS rules.' },
    { q: 'Is Anchorage paid more than rural Alaska?', a: `No. The whole state is one locality pay area, so Anchorage, Fairbanks, Kodiak and remote villages share the ${K.dec(a.pct, 2)} % rate. A GS-11 step 1 earns ${K.usd(g11.annual)} anywhere in Alaska. Separate payments, such as recruitment or retention incentives, can differ by position, but the locality table does not.` },
  ],
  related: ['locality-pay', 'area:hawaii', 'area:seattle', 'area:rest-of-us', 'gs-pay-cap', 'high-3-salary'],
});
