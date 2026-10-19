import { defineGrade } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const g = 2;
const rus1 = K.pay(g, 1, 'RUS'), rus10 = K.pay(g, 10, 'RUS'), sf1 = K.pay(g, 1, 'SF'), ny10 = K.pay(g, 10, 'NY');
const sp = K.P.pay.special001M.rates[1] as number[];
const base = K.GS.base[1];
const gaps = base.slice(1).map((x, i) => x - base[i]);
const small = Math.min(...gaps), smallAt = gaps.indexOf(small) + 2;
const local = K.AREAS.filter((a) => !K.pay(g, 10, a.code).usesSpecial);
const local1 = K.AREAS.filter((a) => !K.pay(g, 1, a.code).usesSpecial);
const ahead = K.steps(g, 1, 0, 'RUS');
const yearsTo4 = Math.round(ahead[2].monthsFromNow / 12);

export default defineGrade({
  grade: g,
  title: 'GS-2 Pay 2026: Salary by Step, Special Rates and Locality',
  description: `GS-2 salary 2026: ${K.usd(rus1.annual)} at step 1 in most areas under special rate table 001M, ${K.usd(sf1.annual)} in San Francisco. Every step, hourly pay, step dates and the GS-3 move.`,
  intro: 'A first-job grade, paid almost everywhere from OPM table 001M rather than the locality tables. Set your county to check.',
  resume: `GS-2 is an entry grade for clerical, office and aide positions, the kind of first federal job where OPM qualification standards generally accept a high school diploma or a short period of work experience. In ${K.P.year} the base table puts GS-2 step 1 at ${K.usd(rus1.base)} and step 10 at ${K.usd(rus10.base)}, but those rates are not what employees receive. Nationwide special rate table 001M pays ${K.usd(sp[0])} at step 1 and ${K.usd(sp[9])} at step 10 wherever it is higher than the locality rate, which covers ${K.AREAS.length - local1.length} of the 58 locality areas at step 1. Only ${local1.map((a) => a.short).join(', ')} pays more through locality, ${K.usd(sf1.annual)}. At step 10 a handful of large metros pass 001M too: New York pays ${K.usd(ny10.annual)}. The hourly rate at step 1 is ${K.usd2(rus1.hourly)}, overtime ${K.usd2(rus1.overtime)}, and each within-grade increase adds ${K.usd(sp[1] - sp[0])} a year.`,
  body: (h) => `
<h2>What GS-2 work looks like</h2>
<p>GS-2 positions handle routine tasks with clear instructions: sorting and filing, data entry, answering basic questions, supporting an office, a clinic or a mailroom. Supervisors check the work closely. The grade appears across many clerical and assistant series, and in a number of them the next rungs, GS-3 and GS-4, are reached by promotion once you have learned the job. For entry, OPM qualification standards for these series generally treat a high school diploma or its equivalent as enough at GS-2, or a few months of general work experience in place of it. The announcement for each position states exactly what it accepts.</p>
<h2>Where locality pay beats table 001M</h2>
<p>For most GS-2 employees the locality table is irrelevant. OPM's ${h.src('opm_001m', 'table 001M')} sets one rate per step for the whole country, and payroll uses it whenever it is higher than base pay plus your locality percentage. At GS-2 step 1 that happens in ${K.AREAS.length - local1.length} areas. ${K.area('SF').short}, with the highest locality percentage at ${K.dec(K.area('SF').pct, 2)} %, is the one place where the locality rate already wins at step 1.</p>
<p>Higher in the grade the picture shifts a little, because the base steps grow while table 001M rises by a fixed amount. At step 10, ${local.length} areas pay their own locality rate: ${local.map((a) => `${a.short} (${K.usd(K.pay(g, 10, a.code).annual)})`).join(', ')}. Everywhere else step 10 is ${K.usd(sp[9])}. The table under this article lists every area, so you can see which line uses which rate.</p>
<h2>Step increases from step 1</h2>
<p>The base table at GS-2 is irregular: the gap between step ${smallAt - 1} and step ${smallAt} is only ${K.usd(small)}, while most other steps are about ${K.usd(gaps[gaps.length - 1])} apart. Since table 001M uses an even step of ${K.usd(sp[1] - sp[0])}, your within-grade increases are regular in practice. Steps 2 to 4 come after 52 weeks each, so a GS-2 hired at step 1 reaches step 4 in about ${yearsTo4} years if the work is at an acceptable level of competence. Steps 5 to 7 need 104 weeks each and steps 8 to 10 need 156 weeks.</p>
${h.mini('wgi', { t: 'When your next GS-2 step comes due', p: ['s', 'm'], d: { g: '2', s: '1', m: 0, a: 'RUS' } })}
<p>Hourly pay follows the annual rate: ${K.usd2(rus1.hourly)} at step 1 and ${K.usd2(rus10.hourly)} at step 10 in Rest of U.S. Every hour of overtime is paid at time and a half, since GS-2 is well under the GS-10 step 1 hourly rate where the overtime limit for exempt employees begins. The ${h.a('gs-hourly-pay', 'hourly pay guide')} shows the full method.</p>
<h2>Leaving GS-2</h2>
<p>Advancement to GS-3, GS-4 or GS-5 has no waiting period under the ${h.ext('https://www.ecfr.gov/current/title-5/chapter-I/subchapter-B/part-300/subpart-F', 'time-in-grade regulation')}: the limit is that the new grade must be no more than two grades above the lowest one you held in the past 52 weeks. GS-3 step 1 pays ${K.usd(K.pay(3, 1, 'RUS').annual)} in Rest of U.S., ${K.usd(K.pay(3, 1, 'RUS').annual - rus1.annual)} above GS-2 step 1, so the first promotions at these grades are small. The ${h.a('gs-3', 'GS-3 page')} explains where the gap starts to widen.</p>
`,
  faqs: [
    { q: 'What qualifications do you need for a GS-2 job?', a: 'For most clerical and assistant series, OPM qualification standards treat a high school diploma or equivalent as enough for GS-2, or a short period of general work experience instead. Some positions also ask for a specific skill. The job announcement lists the requirements of that position, and the agency checks them during the application review.' },
    { q: 'Is GS-2 step 1 paid more in New York than in rural areas?', a: `No. GS-2 step 1 is ${K.usd(sp[0])} in New York and in Rest of U.S. alike, because table 001M is higher than both locality rates. Only ${K.area('SF').short} pays more at step 1. Local pay starts to matter at the top steps: GS-2 step 10 in New York is ${K.usd(ny10.annual)}, against ${K.usd(sp[9])} in most of the country.` },
    { q: 'How much is a GS-2 paid per hour in 2026?', a: `${K.usd2(rus1.hourly)} at step 1 and ${K.usd2(rus10.hourly)} at step 10 in Rest of U.S., the annual rate divided by 2,087. Overtime is time and a half: ${K.usd2(rus1.overtime)} an hour at step 1. Eighty hours at step 1 make a biweekly gross of ${K.usd2(rus1.biweekly)}.` },
  ],
  related: ['gs-1', 'gs-3', 'gs-special-rates', 'gs-step-increase', 'gs-hourly-pay', 'gs-pay-scale-2026'],
});
