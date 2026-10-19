import { defineArea } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const a = K.areaBySlug('hawaii')!;
const ak = K.area('AK'), rus = K.area('RUS'), la = K.area('LA');
const sorted = [...K.AREAS].sort((x, y) => y.pct - x.pct);
const rank = sorted.findIndex((x) => x.code === a.code) + 1;
const ord = (n: number) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;
const t = K.table(a.code);
const capped = t[14].filter((x) => x >= K.CAP).length;
const g4 = K.pay(4, 1, a.code), g6 = K.pay(6, 1, a.code), g8 = K.pay(8, 1, a.code), g10 = K.pay(10, 1, a.code), g11 = K.pay(11, 1, a.code), g12 = K.pay(12, 1, a.code), g13 = K.pay(13, 1, a.code);
const g7 = K.pay(7, 5, a.code);
let sp3 = 0, sp4 = 0;
for (let s = 1; s <= 10; s++) { for (let g = 1; g <= 3; g++) if (K.pay(g, s, a.code).usesSpecial) sp3++; if (K.pay(4, s, a.code).usesSpecial) sp4++; }
const close = sorted.filter((x) => Math.abs(x.pct - a.pct) < 0.3 && x.code !== a.code).map((x) => x.short);

export default defineArea({
  slug: 'hawaii',
  title: 'Hawaii Locality Pay 2026: GS Salaries on Every Island',
  description: `Hawaii locality pay 2026 is ${K.dec(a.pct, 2)} % statewide: GS-11 step 1 pays ${K.usd(g11.annual)}, GS-12 ${K.usd(g12.annual)}. Hourly rates, overtime, the pay cap and how Hawaii compares to Alaska.`,
  intro: `Oahu, Maui, the Big Island and Kauai share one table: ${K.dec(a.pct, 2)} % above the GS base rates in ${K.P.year}.`,
  resume: `The State of Hawaii is one of the ${K.AREAS.length} General Schedule locality pay areas, and it covers every island with a single percentage: ${K.dec(a.pct, 2)} % in ${K.P.year}, unchanged from 2025 because Executive Order 14368 froze all localities and raised the base table by ${K.dec(K.RAISE, 1)} %. That places Hawaii ${ord(rank)} of the ${K.AREAS.length} areas, in the middle of the ranking and well below ${ak.short} at ${K.dec(ak.pct, 2)} %. A GS-6 step 1 earns ${K.usd(g6.annual)}, a GS-8 ${K.usd(g8.annual)}, a GS-10 ${K.usd(g10.annual)}, a GS-11 ${K.usd(g11.annual)}, a GS-12 ${K.usd(g12.annual)} and a GS-13 ${K.usd(g13.annual)}. Only ${capped} cell of the table, GS-15 step 10, stops at the ${K.usd(K.CAP)} cap. Hawaii received locality pay through the Non-Foreign Area Retirement Equity Assurance Act of 2009, which phased it in for the nonforeign areas while the old nonforeign cost-of-living allowance was phased out.`,
  body: (h) => `
<h2>One rate from Kauai to the Big Island</h2>
<p>Hawaii's definition in OPM's ${K.P.year} list is the whole state. An office in Honolulu, a base on Oahu, a facility in Hilo and a park on Maui all pay the same ${K.dec(a.pct, 2)} % locality. Nothing in your county choice changes it, which is why the calculator above offers a single option for Hawaii. Pacific worksites outside the state are a different matter: Guam and the other Pacific nonforeign areas are part of ${h.a('area:rest-of-us', 'Rest of U.S.')}, at ${K.dec(rus.pct, 2)} %.</p>
<h2>Where Hawaii sits in the ranking</h2>
<p>Hawaii does not pay close to the top. Locality percentages measure the gap between federal and non-federal salaries for similar work, using Bureau of Labor Statistics surveys, and that gap in Hawaii is moderate. ${close.length ? `Its percentage is within a fraction of a point of ${close.length > 1 ? `${close.slice(0, -1).join(', ')} and ${close[close.length - 1]}` : close[0]}. ` : ''}${la.short}, the nearest mainland area across the Pacific, pays ${K.dec(la.pct, 2)} %, so the same GS-12 step 5 earns ${K.usd(K.pay(12, 5, 'LA').annual - K.pay(12, 5, a.code).annual)} more there. Alaska, the other state-wide area, pays ${K.usd(K.pay(12, 5, 'AK').annual - K.pay(12, 5, a.code).annual)} more at the same cell.</p>
<h2>Hourly pay and overtime</h2>
<p>Hourly figures matter to shift workers and to anyone paid overtime. The hourly rate is the annual rate divided by 2,087 hours, to the cent. A GS-7 step 5 in Hawaii earns ${K.usd(g7.annual)} a year, or ${K.usd2(g7.hourly)} an hour and ${K.usd2(g7.biweekly)} per 80-hour pay period. Overtime for an FLSA-exempt employee is time and a half, up to a ceiling of 1.5 times the Hawaii rate of GS-10 step 1, ${K.usd2(g10.hourly)} an hour.</p>
${h.mini('hourly', { t: 'Hourly and overtime pay in Hawaii', p: ['g', 's', 'ot'], d: { g: '7', s: '5', a: a.code, ot: 8 } })}
<h2>The lowest grades</h2>
<p>At GS-1 to GS-3, the nationwide special rate table 001M pays more than the Hawaii locality rate in ${sp3 === 30 ? 'every one of the 30 cells' : `${sp3} of the 30 cells`}, so those employees are paid the 001M figure. ${sp4 ? `At GS-4 it still applies to ${sp4} steps.` : `At GS-4 the Hawaii locality rate is already higher, so it applies at no step: GS-4 step 1 earns ${K.usd(g4.annual)}, the base plus ${K.dec(a.pct, 2)} %.`} From GS-5 upward every cell is the base rate plus the locality percentage, rounded to the dollar.</p>
<h2>Moving to or from the islands</h2>
<p>Your grade and step travel with you; the locality percentage does not. On the first day at a Hawaii duty station you switch to the Hawaii table. For teleworkers the official worksite rule of 5 CFR 531.605 decides: report to the agency office at least twice each biweekly pay period and the office counts; otherwise your approved home location sets the area. The ${h.a('gs-hourly-pay', 'hourly pay page')} has the other areas.</p>
`,
  faqs: [
    { q: 'What is the GS locality pay for Honolulu in 2026?', a: `Honolulu has no area of its own: it is part of the State of Hawaii area, at ${K.dec(a.pct, 2)} % in ${K.P.year}. A GS-9 step 1 there earns ${K.usd(K.pay(9, 1, a.code).annual)} and a GS-12 step 1 ${K.usd(g12.annual)}. The same rates apply on every other island, since the whole state is one locality pay area.` },
    { q: 'Why is Hawaii locality pay lower than Alaska?', a: `Because the percentages come from surveys comparing federal and non-federal pay, not from living costs. The surveys show a larger pay gap in Alaska, which gets ${K.dec(ak.pct, 2)} %, than in Hawaii, which gets ${K.dec(a.pct, 2)} %. For a GS-11 step 1 the difference is ${K.usd(K.pay(11, 1, 'AK').annual - g11.annual)} a year in ${K.P.year}.` },
    { q: 'Is Guam part of the Hawaii locality area?', a: `No. The Hawaii area covers the State of Hawaii only. Guam, Puerto Rico, the U.S. Virgin Islands and the other nonforeign areas outside Alaska and Hawaii are paid the Rest of U.S. rate, ${K.dec(rus.pct, 2)} % in ${K.P.year}. A GS-11 step 1 earns ${K.usd(g11.annual)} in Hawaii and ${K.usd(K.pay(11, 1, 'RUS').annual)} in Guam.` },
  ],
  related: ['locality-pay', 'area:alaska', 'area:los-angeles', 'area:rest-of-us', 'gs-hourly-pay', 'gs-11'],
});
