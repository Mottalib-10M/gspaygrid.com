import { defineGrade } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const g = 8;
const rus1 = K.pay(g, 1, 'RUS'), rus10 = K.pay(g, 10, 'RUS'), dc1 = K.pay(g, 1, 'DCB'), chi1 = K.pay(g, 1, 'CHI'), sd1 = K.pay(g, 1, 'SD');
const g10 = K.pay(10, 1, 'RUS');
const steps = Array.from({ length: 10 }, (_, i) => K.pay(g, i + 1, 'RUS'));
const firstCapped = steps.find((p) => p.overtime < 1.5 * p.hourly - 0.01)!;
const step7 = steps[6];
const from7 = K.promote(7, 2, 8, 'RUS');
const to9 = K.promote(8, 2, 9, 'RUS');
const to9dc = K.promote(8, 5, 9, 'DCB');
const inc = steps[1].annual - steps[0].annual;
const t = K.table('RUS');
const k9 = t[8].filter((x) => x < t[7][9]).length;

export default defineGrade({
  grade: g,
  title: 'GS-8 Pay Scale 2026: Salary, Overtime and Step Increases',
  description: `GS-8 pay 2026: ${K.usd(rus1.annual)} to ${K.usd(rus10.annual)} in Rest of U.S., ${K.usd(dc1.annual)} at step 1 in Washington DC. Senior technician grade, hourly rates and the overtime cap from step ${firstCapped.step}.`,
  intro: 'A senior grade of the one-grade-interval technical and assistant series, and the lowest grade where overtime can hit its cap. Set your county.',
  resume: `GS-8 is a less crowded grade than its neighbors: two-grade professional ladders skip it, so it is held mainly in one-grade-interval technical and assistant series, by senior technicians, lead assistants and specialists who handle the hardest cases of their line of work. In ${K.P.year} the GS-8 base table runs from ${K.usd(rus1.base)} at step 1 to ${K.usd(rus10.base)} at step 10. Locality pay brings step 1 to ${K.usd(rus1.annual)} in Rest of U.S., ${K.usd(sd1.annual)} in San Diego, ${K.usd(chi1.annual)} in Chicago and ${K.usd(dc1.annual)} in Washington. Step 10 in Rest of U.S. pays ${K.usd(rus10.annual)}, and every within-grade increase adds ${K.usd(inc)} a year there. The hourly rate at step 1 is ${K.usd2(rus1.hourly)}, with overtime at ${K.usd2(rus1.overtime)}. GS-8 is also the first grade where the hourly rate passes the GS-10 step 1 rate: from step ${firstCapped.step}, overtime for FLSA-exempt employees is capped at ${K.usd2(firstCapped.overtime)} an hour in Rest of U.S.`,
  body: (h) => `
<h2>Who holds a GS-8</h2>
<p>You will not find GS-8 on a 5, 7, 9, 11 ladder. The grade lives in series that move one grade at a time, where the work is technical or supporting rather than professional: experienced engineering, electronics or medical technicians, senior program and management assistants, and specialists in fields such as payroll, purchasing or legal support. A GS-8 knows the procedures of the field in depth and handles unusual cases, often guiding less experienced coworkers. In many of these series GS-8 is near the top of the line, and moving higher can mean a lead or supervisory role, or a switch to a two-grade series at GS-9.</p>
<p>Entry at GS-8 by external hire usually needs one year of specialized experience equivalent to GS-7. Promotion from GS-7 is the more common route. Until January 18, 2027, it requires 52 weeks at GS-7; ${h.src('fr_tig_2026', 'a final rule OPM published on October 19, 2026')} ends that requirement on January 19, 2027, while the specialized experience standard stays. A GS-7 step 2 in Rest of U.S. earning ${K.usd(from7.from.annual)} is placed at GS-8 step ${from7.to.step}, ${K.usd(from7.to.annual)}.</p>
<h2>The overtime cap starts here</h2>
<p>For FLSA-exempt employees, overtime is time and a half only up to a ceiling: 1.5 times the hourly rate of GS-10 step 1 in your area. Below GS-8 nobody reaches it. At GS-8 the upper steps do. In Rest of U.S., GS-10 step 1 is ${K.usd2(g10.hourly)} an hour. GS-8 step 7 pays ${K.usd2(step7.hourly)}, still below that line, so its overtime is ${K.usd2(step7.overtime)}. Step ${firstCapped.step} pays ${K.usd2(firstCapped.hourly)}, above it, and overtime stops at ${K.usd2(firstCapped.overtime)}, the same figure as steps 9 and 10. Because the cap moves with the locality percentage, it falls at step ${firstCapped.step} in every locality area. Your FLSA status, shown on your SF-50, decides which overtime rule payroll uses.</p>
${h.mini('hourly', { t: 'GS-8 overtime for a pay period, by step', p: ['s', 'a', 'ot'], d: { g: '8', s: String(firstCapped.step), a: 'RUS', ot: 10 } })}
<h2>Steps when GS-8 is the top of your series</h2>
<p>If no higher grade exists in your line, within-grade increases carry your pay. In Rest of U.S. the climb from step 1 to step 10 adds ${K.usd(rus10.annual - rus1.annual)}, over 18 years of on-time increases. GS-8 step 10 there, ${K.usd(t[7][9])}, pays more than GS-9 step ${k9} (${K.usd(t[8][k9 - 1])}), which is why some long-serving GS-8 employees gain little by moving one grade. The ${h.a('gs-step-increase', 'step increase guide')} lists the waiting periods and what a quality step increase changes.</p>
<h2>Moving up to GS-9</h2>
<p>A promotion to GS-9 follows the two-step rule. From GS-8 step 2 in Rest of U.S. you go from ${K.usd(to9.from.annual)} to GS-9 step ${to9.to.step}, ${K.usd(to9.to.annual)}, a raise of ${K.usd(to9.raise)}. From GS-8 step 5 in Washington, ${K.usd(to9dc.from.annual)}, you land at GS-9 step ${to9dc.to.step}, ${K.usd(to9dc.to.annual)}. Above GS-9 lies ${h.a('gs-10', 'GS-10')}, another grade used mostly by one-grade-interval series.</p>
`,
  faqs: [
    { q: 'Why is GS-8 overtime the same at steps 8, 9 and 10?', a: `Because those steps earn more per hour than GS-10 step 1 of the same area, and overtime for FLSA-exempt employees is capped at 1.5 times that rate. In Rest of U.S. the cap is ${K.usd2(firstCapped.overtime)} an hour, so steps ${firstCapped.step} to 10 all receive it. Steps 1 to 7 are paid a full time and a half.` },
    { q: 'What is the GS-8 pay range in 2026?', a: `In Rest of U.S., ${K.usd(rus1.annual)} at step 1 to ${K.usd(rus10.annual)} at step 10. In Washington the range is ${K.usd(dc1.annual)} to ${K.usd(K.pay(g, 10, 'DCB').annual)}, and in ${K.area('SF').short} ${K.usd(K.pay(g, 1, 'SF').annual)} to ${K.usd(K.pay(g, 10, 'SF').annual)}. These ${K.P.year} rates include the ${K.dec(K.RAISE, 1)} % raise and frozen locality percentages.` },
    { q: 'Is GS-8 a common federal grade?', a: 'Less than its neighbors. Two-grade-interval careers jump from GS-7 to GS-9, so GS-8 is used mainly in one-grade-interval technical, clerical and assistant series. In those lines it is a senior grade, held by experienced technicians and specialized assistants, and sometimes the full-performance level of the position.' },
  ],
  related: ['gs-7', 'gs-9', 'gs-hourly-pay', 'gs-step-increase', 'gs-promotion-calculator', 'gs-pay-scale-2026'],
});
