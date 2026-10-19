import { defineGrade } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const g = 3;
const rus1 = K.pay(g, 1, 'RUS'), rus10 = K.pay(g, 10, 'RUS'), dc1 = K.pay(g, 1, 'DCB'), sf1 = K.pay(g, 1, 'SF'), ny1 = K.pay(g, 1, 'NY');
const sp = K.P.pay.special001M.rates[2] as number[];
const localAt = (s: number) => K.AREAS.filter((a) => !K.pay(g, s, a.code).usesSpecial);
const loc1 = localAt(1), loc10 = localAt(10);
const chi = [1, 5, 10].map((s) => K.pay(g, s, 'CHI'));
const gs5 = K.pay(5, 1, 'RUS').annual;
const t = K.table('RUS');

export default defineGrade({
  grade: g,
  title: 'GS-3 Salary 2026: Step Rates, Table 001M and Locality Pay',
  description: `GS-3 pay 2026: ${K.usd(rus1.annual)} at step 1 in Rest of U.S. through special table 001M, ${K.usd(dc1.annual)} in Washington DC and ${K.usd(sf1.annual)} in San Francisco. Hourly rates and steps.`,
  intro: 'The grade where table 001M and locality pay start to compete. Pick your county to see which one sets your rate.',
  resume: `GS-3 covers clerks, office assistants, aides and trainees who work with more independence than at GS-2. For many of these series, OPM qualification standards generally accept one year of education above high school or general work experience in its place. The ${K.P.year} GS-3 base table starts at ${K.usd(rus1.base)}, and special rate table 001M, at ${K.usd(sp[0])} for step 1 and ${K.usd(sp[9])} for step 10, sets the pay in most of the country, Rest of U.S. included. GS-3 is also where the large metros begin to pay more through locality: at step 1, ${loc1.length} of the 58 areas beat table 001M, among them Washington (${K.usd(dc1.annual)}), New York (${K.usd(ny1.annual)}) and ${K.area('SF').short} (${K.usd(sf1.annual)}). By step 10 the count reaches ${loc10.length} areas. Hourly pay at step 1 in Rest of U.S. is ${K.usd2(rus1.hourly)}, overtime ${K.usd2(rus1.overtime)}, and each step is worth ${K.usd(sp[1] - sp[0])} a year where 001M applies.`,
  body: (h) => `
<h2>Two pay systems inside one grade</h2>
<p>Every GS-3 cell has two possible rates: the locality rate, which is the base rate plus your area's percentage, and the ${h.src('opm_001m', 'nationwide 001M rate')}. Payroll pays the higher one. In Rest of U.S., where the locality percentage is ${K.dec(K.area('RUS').pct, 2)} %, the locality rate at step 1 would be ${K.usd(rus1.locality)}, well under the 001M figure of ${K.usd(rus1.annual)}. In areas with a high percentage the order flips.</p>
<p>At step 1, the areas that pay their own locality rate are: ${loc1.map((a) => a.short).join(', ')}. In every other area, GS-3 step 1 is ${K.usd(sp[0])}. Because a base step, once your locality percentage is added, is worth more than the fixed 001M step, the list gets longer as you climb: ${loc10.length} areas pay locality at step 10. Chicago shows the switch inside a single grade. Its step 1 is the 001M rate of ${K.usd(chi[0].annual)}, but step 5 pays ${K.usd(chi[1].annual)} and step 10 ${K.usd(chi[2].annual)}, both from the Chicago locality table.</p>
${h.mini('lookup', { t: 'Does your county pay GS-3 above the national rate?', p: ['st', 'co'], d: { st: 'VA', co: 'Fairfax County', g: '3' } })}
<h2>Why moving does not always raise GS-3 pay</h2>
<p>A transfer from a small town to a city changes your locality area, and at most grades that is a raise. At GS-3 it depends on the destination. Moving from Rest of U.S. to Atlanta, Phoenix or Kansas City leaves step 1 at ${K.usd(sp[0])}, because 001M applies in all of them. Moving to Washington adds ${K.usd(dc1.annual - rus1.annual)} a year at step 1, and moving to ${K.area('SF').short} adds ${K.usd(sf1.annual - rus1.annual)}. The official worksite on your SF-50 decides it, not your home address.</p>
<h2>Education, experience and the next grade</h2>
<p>The general rule for many clerical and assistant series, per the ${h.src('opm_qual_gs', 'OPM qualification standards')}, is that education above high school can replace experience at GS-3 and GS-4. Specific series may also test skills. Once in the job, you can be advanced to GS-4 or GS-5 without a 52-week wait: the ${h.ext('https://www.ecfr.gov/current/title-5/chapter-I/subchapter-B/part-300/subpart-F', 'time-in-grade rules')} only cap the new grade at two above the lowest grade you held in the past 52 weeks. A GS-3 can therefore move to GS-5 in one action when the position and the qualifications allow it.</p>
<p>The gap between grades widens here. In Rest of U.S., GS-3 step 10 is ${K.usd(t[2][9])}, while GS-5 step 1 is ${K.usd(gs5)}, so a move to GS-5 can pay more than ten years of GS-3 step increases. The ${h.a('gs-4', 'GS-4 page')} covers the grade in between, the last one touched by table 001M.</p>
<h2>Hourly rate and overtime at GS-3</h2>
<p>GS-3 step 1 earns ${K.usd2(rus1.hourly)} an hour in Rest of U.S. and ${K.usd2(dc1.hourly)} in Washington. Overtime is a straight time and a half at every GS-3 step and in every area: ${K.usd2(rus1.overtime)} at step 1 in Rest of U.S., ${K.usd2(rus10.overtime)} at step 10. The cap tied to GS-10 step 1 never reaches this grade.</p>
`,
  faqs: [
    { q: 'Which cities pay GS-3 more than the special rate?', a: `At step 1, ${loc1.map((a) => a.short).join(', ')}. Those areas have locality percentages high enough that base pay plus locality beats the ${K.usd(sp[0])} of table 001M. At step 10 the list grows to ${loc10.length} areas. Everywhere else, including Rest of U.S., GS-3 is paid from table 001M.` },
    { q: 'Can a GS-3 be promoted straight to GS-5?', a: 'Yes, if the position and your qualifications support it. Advancement to grades up to GS-5 has no 52-week waiting period in 5 CFR part 300; the only limit is that the new grade is no more than two grades above the lowest grade you held in the previous 52 weeks. You still have to meet the qualification standard of the GS-5 position.' },
    { q: 'What is GS-3 step 10 in 2026?', a: `${K.usd(rus10.annual)} in Rest of U.S., the 001M rate, or ${K.usd2(rus10.hourly)} an hour. In areas where locality pay wins it is higher: ${K.usd(K.pay(g, 10, 'DCB').annual)} in Washington and ${K.usd(K.pay(g, 10, 'SF').annual)} in ${K.area('SF').short}. Reaching step 10 from step 1 takes 18 years when every within-grade increase comes on time.` },
  ],
  related: ['gs-2', 'gs-4', 'gs-5', 'gs-special-rates', 'locality-pay', 'gs-pay-scale-2026'],
});
