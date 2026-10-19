import { defineGrade } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const g = 5;
const rus1 = K.pay(g, 1, 'RUS'), rus10 = K.pay(g, 10, 'RUS'), dc1 = K.pay(g, 1, 'DCB'), la1 = K.pay(g, 1, 'LA'), den1 = K.pay(g, 1, 'DEN');
const to7 = K.promote(5, 3, 7, 'RUS');
const to7dc = K.promote(5, 1, 7, 'DCB');
const t = K.table('RUS');
const inc = K.pay(g, 2, 'RUS').annual - rus1.annual;
const gs4top = K.pay(4, 1, 'RUS').annual;

export default defineGrade({
  grade: g,
  title: "GS-5 Pay Scale 2026: Bachelor's Degree Salary by Locality",
  description: `GS-5 salary 2026: ${K.usd(rus1.annual)} at step 1 in Rest of U.S., ${K.usd(dc1.annual)} in Washington DC. The bachelor's degree entry grade, steps, hourly pay and the move to GS-7.`,
  intro: "The usual starting grade with a bachelor's degree, and the first rung of the 5, 7, 9, 11 ladder. Pick your county for your rate.",
  resume: `GS-5 is the grade at which many federal careers begin for someone with a bachelor's degree. For a large number of professional, administrative and technical series, the OPM qualification standards accept a four-year course of study leading to a bachelor's degree for GS-5, in place of one year of specialized experience at the GS-4 level. It is also the first grade paid entirely from the locality tables, since special rate table 001M stops at GS-4. In ${K.P.year} the GS-5 base table runs from ${K.usd(rus1.base)} to ${K.usd(rus10.base)}. With locality, step 1 pays ${K.usd(rus1.annual)} in Rest of U.S. (${K.dec(K.area('RUS').pct, 2)} %), ${K.usd(den1.annual)} in Denver, ${K.usd(dc1.annual)} in Washington and ${K.usd(la1.annual)} in Los Angeles. Step 10 in Rest of U.S. is ${K.usd(rus10.annual)}. Each step is worth ${K.usd(inc)} a year there, the hourly rate at step 1 is ${K.usd2(rus1.hourly)}, and a promotion to GS-7 after a year adds several thousand dollars.`,
  body: (h) => `
<h2>A degree, a grade, a ladder</h2>
<p>Many vacancy announcements for trainee and entry positions read "GS-5/7/9" or "GS-5/7/9/11". That means you can be hired at GS-5 and promoted up a career ladder without competing again, one rung at a time, as long as your work supports it. A bachelor's degree is the most common way to qualify at the bottom of that ladder. The ${h.src('opm_qual_gs', 'OPM qualification standards')} for each series set the details: some require specific coursework, a few require a degree in a named field, and experience can always substitute when it is at the right level.</p>
<p>GS-5 is also the grade where federal pay starts to look like a full salary everywhere. GS-1 to GS-4 are often held at the floor set by table 001M. From GS-5 on, your locality area alone sets the rate, so the spread between areas is wide: ${K.usd(la1.annual - rus1.annual)} a year between Rest of U.S. and Los Angeles at step 1. Compared with GS-4 step 1 in Rest of U.S., ${K.usd(gs4top)}, GS-5 step 1 pays ${K.usd(rus1.annual - gs4top)} more.</p>
<h2>The first year and the jump to GS-7</h2>
<p>On a ladder, the GS-7 promotion usually comes after one year. Until January 18, 2027, the time-in-grade rule requires 52 weeks at GS-5 before a two-grade promotion to GS-7. ${h.src('fr_tig_2026', 'OPM\'s final rule of October 19, 2026')} eliminates that requirement from January 19, 2027, but the GS-7 qualification standard still calls for one year of specialized experience equivalent to GS-5, so the one-year pace should not change much. The move to GS-5 itself was never subject to a waiting period: the time-in-grade rules covered advancement to GS-6 and above only.</p>
<p>The promotion is computed with the two-step rule. A GS-5 step 3 in Rest of U.S. earning ${K.usd(to7.from.annual)} goes to GS-7 step ${to7.to.step}, ${K.usd(to7.to.annual)}, a gain of ${K.usd(to7.raise)} or ${K.pct(to7.raisePct, 1)}. A new hire still at step 1 in Washington moves from ${K.usd(to7dc.from.annual)} to ${K.usd(to7dc.to.annual)}.</p>
${h.mini('promo', { t: 'From GS-5 to GS-7 in your area', p: ['s', 'a'], d: { g: '5', s: '1', ng: '7', a: 'RUS' } })}
<h2>When GS-5 is the full-performance grade</h2>
<p>Not every GS-5 is a trainee. In clerical and assistant series with one-grade steps, GS-5 can be the top of the position, and then within-grade increases are the main raise. At ${K.usd(inc)} a step in Rest of U.S., ten years of steady performance add a lot: step 10 pays ${K.usd(rus10.annual)}, which is more than GS-7 step 1 (${K.usd(t[6][0])}) and close to GS-6 step 6 (${K.usd(t[5][5])}). The ${h.a('gs-step-increase', 'step increase guide')} lists the waiting periods: 52 weeks for steps 2 to 4, 104 weeks for 5 to 7, 156 weeks for 8 to 10.</p>
<h2>Hours, overtime and the first paycheck</h2>
<p>A GS-5 step 1 in Rest of U.S. is paid ${K.usd2(rus1.hourly)} an hour and ${K.usd2(rus1.biweekly)} gross for an 80-hour pay period. Overtime is time and a half, ${K.usd2(rus1.overtime)} an hour, because every GS-5 rate is below the GS-10 step 1 hourly rate of the same area. Deductions for FERS, federal tax, health insurance and the TSP come out of that gross; the ${h.a('fers-contribution-rates', 'FERS contribution page')} shows the share taken for retirement.</p>
`,
  faqs: [
    { q: "Does a bachelor's degree qualify you for GS-5?", a: "For many series, yes. OPM qualification standards accept a four-year course of study leading to a bachelor's degree for GS-5 in a wide range of professional, administrative and technical positions. Some series require a degree in a specific field or a set number of credit hours in a subject. One year of experience at the GS-4 level is the usual alternative." },
    { q: 'What is the GS-5 salary in Washington DC for 2026?', a: `GS-5 step 1 pays ${K.usd(dc1.annual)} in the Washington-Baltimore area, the base rate of ${K.usd(dc1.base)} plus ${K.dec(K.area('DCB').pct, 2)} % locality pay. Step 10 pays ${K.usd(K.pay(g, 10, 'DCB').annual)}. The hourly rate at step 1 is ${K.usd2(dc1.hourly)}. The area is set by your official worksite, not where you live.` },
    { q: 'How soon can a GS-5 be promoted to GS-7?', a: 'Until January 18, 2027, after 52 weeks at GS-5 under the time-in-grade rule. From January 19, 2027 that rule no longer applies, but you still need one year of specialized experience equivalent to GS-5, or a qualifying level of education, and your agency must decide you are ready. On most career ladders the move comes about a year after entry.' },
  ],
  related: ['gs-4', 'gs-6', 'gs-7', 'gs-promotion-calculator', 'gs-step-increase', 'gs-pay-scale-2026'],
});
