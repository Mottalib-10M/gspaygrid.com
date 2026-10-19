import { defineGrade } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const g = 11;
const rus1 = K.pay(g, 1, 'RUS'), rus10 = K.pay(g, 10, 'RUS'), dc1 = K.pay(g, 1, 'DCB'), sea1 = K.pay(g, 1, 'SEA');
const den6 = K.promote(11, 6, 12, 'DEN');
const from9 = K.promote(9, 4, 11, 'RUS');
const ot10 = K.pay(10, 1, 'RUS');
const atl = K.pay(g, 1, 'ATL');

export default defineGrade({
  grade: g,
  title: 'GS-11 Pay Scale 2026: Salary by Step, Ph.D. Entry, GS-12',
  description: `GS-11 pay 2026: ${K.usd(rus1.annual)} at step 1 in Rest of U.S., ${K.usd(dc1.annual)} in Washington DC. Ph.D. entry, the overtime cap set above GS-10, and the promotion to GS-12.`,
  intro: 'The last developmental rung before full performance for many careers, and an entry grade for Ph.D. holders. Set your county for your rate.',
  resume: `GS-11 is the grade where two-grade-interval careers stop moving two grades at a time: after GS-5, 7, 9 and 11, the next promotion is to GS-12 and then one grade at a time. It is also the usual entry grade for a Ph.D. or equivalent doctoral degree, or three full years of progressively higher graduate study, in the series whose OPM qualification standards accept education. In ${K.P.year} the base rate of step 1 is ${K.usd(rus1.base)}; with locality, step 1 pays ${K.usd(rus1.annual)} in Rest of U.S., ${K.usd(sea1.annual)} in Seattle and ${K.usd(dc1.annual)} in the Washington area, and step 10 reaches ${K.usd(rus10.annual)} in Rest of U.S. Hourly pay at step 1 is ${K.usd2(rus1.hourly)} in Rest of U.S., already above GS-10 step 1, so FLSA-exempt overtime is capped at ${K.usd2(rus1.overtime)} an hour instead of a full time and a half. Most GS-11 employees on a ladder to GS-12 are promoted after about a year.`,
  body: (h) => `
<h2>Three ways into GS-11</h2>
<p>The most common is the ladder: a GS-9 promoted after a year of satisfactory work. A GS-9 step 4 in Rest of U.S. moves from ${K.usd(from9.from.annual)} to GS-11 step ${from9.to.step} at ${K.usd(from9.to.annual)}. The second is education. For many research, scientific and analytical series, a Ph.D. or the equivalent doctoral degree, or three full years of graduate education leading to one, meets the GS-11 requirement without experience; the ${h.src('opm_qual_gs', 'qualification standard')} of each series says which fields count. The third is experience: one year of specialized experience at the GS-9 level, in or out of government, described in your resume so the specialist can match it.</p>
<h2>Time in grade before GS-12</h2>
<p>Until January 18, 2027, you need 52 weeks at GS-11 before a promotion to GS-12. ${h.src('fr_tig_2026', 'OPM\'s final rule of October 19, 2026')} ends that time-in-grade requirement from January 19, 2027. The change matters less than it sounds for most people on a ladder, because the qualification standard for GS-12 still asks for one year of specialized experience at the GS-11 level. Where it can help is for an employee whose earlier private sector or military experience already shows that level of work.</p>
<h2>What the GS-12 promotion pays here</h2>
<p>The two-step rule turns a GS-11 step into a GS-12 step. In Denver, a GS-11 step 6 earns ${K.usd(den6.from.annual)} and becomes GS-12 step ${den6.to.step} at ${K.usd(den6.to.annual)}, a raise of ${K.usd(den6.raise)} or ${K.pct(den6.raisePct, 1)}. The higher your GS-11 step, the higher the GS-12 step you reach, so a within-grade increase that falls just before the promotion still pays off afterward.</p>
${h.mini('promo', { t: 'Your GS-11 step and area, promoted to GS-12', p: ['s', 'a'], d: { g: '11', s: '6', ng: '12', a: 'DEN' } })}
<h2>The first grade where overtime is capped</h2>
<p>For employees exempt from the Fair Labor Standards Act, title 5 overtime cannot exceed 1.5 times the hourly rate of GS-10 step 1 in your area. In Rest of U.S. that rate is ${K.usd2(ot10.hourly)}, and every GS-11 step is above it. The result: a GS-11 earns ${K.usd2(rus1.overtime)} for each overtime hour at any step, rather than 1.5 times the step's own ${K.usd2(rus1.hourly)} or more. In Atlanta the cap is ${K.usd2(atl.overtime)}. Nonexempt employees, covered by the FLSA, follow its rules instead. The ${h.a('gs-hourly-pay', 'hourly pay page')} has the cap for each area.</p>
<p>GS-11 rates are well below the ${K.usd(K.CAP)} pay cap, so every step shows in full on your leave and earnings statement.</p>
`,
  faqs: [
    { q: 'Does a Ph.D. get you a GS-11 job?', a: 'In many series it qualifies you for GS-11 on education alone: OPM qualification standards accept a Ph.D. or equivalent doctoral degree, or three full years of progressively higher graduate study, in a field related to the position. Some research positions start a Ph.D. at GS-12 when the degree is directly related. You still have to apply, be rated qualified and be selected.' },
    { q: 'What is GS-11 overtime pay in 2026?', a: `For FLSA-exempt employees it is capped at 1.5 times GS-10 step 1: ${K.usd2(rus1.overtime)} an hour in Rest of U.S. and ${K.usd2(dc1.overtime)} in the Washington area, at every GS-11 step. Employees covered by the Fair Labor Standards Act are paid overtime under its rules, which can be higher. Your timekeeper or payroll office knows your FLSA status.` },
    { q: 'How much does a GS-11 make at step 10?', a: `${K.usd(rus10.annual)} in Rest of U.S. and ${K.usd(K.pay(g, 10, 'DCB').annual)} in the Washington area in ${K.P.year}. Reaching step 10 from step 1 takes 18 years if every within-grade increase is on time, and most employees in a two-grade ladder are promoted to GS-12 long before, so step 10 at GS-11 is mostly seen in positions whose full-performance level is GS-11.` },
  ],
  related: ['gs-9', 'gs-12', 'gs-promotion-calculator', 'gs-hourly-pay', 'gs-step-increase', 'gs-pay-scale-2026'],
});
