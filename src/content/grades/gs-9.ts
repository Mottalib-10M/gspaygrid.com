import { defineGrade } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const g = 9;
const rus1 = K.pay(g, 1, 'RUS'), rus10 = K.pay(g, 10, 'RUS'), dc1 = K.pay(g, 1, 'DCB'), hou1 = K.pay(g, 1, 'HOU');
const ny1 = K.pay(g, 1, 'NY');
const from7 = K.promote(7, 3, 9, 'RUS');
const to11 = K.promote(9, 4, 11, 'RUS');
const ahead = K.steps(g, 2, 4, 'RUS');
const step = K.pay(g, 2, 'RUS').annual - rus1.annual;

export default defineGrade({
  grade: g,
  title: 'GS-9 Pay Scale 2026: Salary Steps, Locality and Promotion',
  description: `GS-9 salary 2026: ${K.usd(rus1.annual)} at step 1 in Rest of U.S., ${K.usd(dc1.annual)} in Washington DC. Master's degree entry, step dates, overtime pay and the move up to GS-11.`,
  intro: 'The grade of a new hire with a master\'s degree and the middle rung of the 5, 7, 9, 11 ladder. Set your county to read your own rate.',
  resume: `GS-9 is the developmental grade that most two-grade-interval careers pass through on the way from GS-7 to GS-11. Many hires arrive here with a master's degree or two full years of graduate study, which the OPM qualification standards for a large number of professional and administrative series accept for GS-9 in place of specialized experience. In ${K.P.year} the GS-9 base table starts at ${K.usd(rus1.base)}, and locality pay brings step 1 to ${K.usd(rus1.annual)} in Rest of U.S. (${K.dec(K.area('RUS').pct, 2)} %), ${K.usd(hou1.annual)} in Houston and ${K.usd(dc1.annual)} in the Washington area. Step 10 in Rest of U.S. is ${K.usd(rus10.annual)}. Each step is worth ${K.usd(step)} a year in Rest of U.S. Hourly pay at step 1 there is ${K.usd2(rus1.hourly)}, and overtime is paid at time and a half, ${K.usd2(rus1.overtime)} an hour. Most GS-9 employees on a ladder are promoted to GS-11 after about a year, so the steps you climb here are fewer than at the grades above.`,
  body: (h) => `
<h2>How people get to GS-9</h2>
<p>There are two usual doors. The first is a career ladder: you were hired at GS-5 or GS-7 into a position with a full-performance level of GS-11 or GS-12, and your agency moves you up one rung each year if your work supports it. The second is a direct hire at GS-9, most often with a master's degree, two years of progressively higher graduate education, or a year of specialized experience equivalent to GS-7. Which of those counts, and in which field, is set by the ${h.src('opm_qual_gs', 'qualification standard')} of each series, so read the announcement before you count on a degree alone.</p>
<p>A promotion from GS-7 step 3 in Rest of U.S. shows how the ladder pays. You earn ${K.usd(from7.from.annual)} today; the two-step rule places you at GS-9 step ${from7.to.step}, ${K.usd(from7.to.annual)}, a gain of ${K.usd(from7.raise)}. That jump is larger than any within-grade increase you would get at GS-7.</p>
<h2>A grade you are meant to leave</h2>
<p>On a ladder, GS-9 is a training stage: assignments grow in difficulty and you work toward the duties of the full-performance grade. Until January 18, 2027, the time-in-grade rule asks for 52 weeks at GS-9 before a two-grade-interval promotion to GS-11. ${h.src('fr_tig_2026', 'The final rule OPM published on October 19, 2026')} removes that requirement from January 19, 2027. The qualification standard still asks for one year of specialized experience at the GS-9 level, so a year in the grade remains the normal pace for most people.</p>
<p>The move from GS-9 step 4 to GS-11 in Rest of U.S. goes from ${K.usd(to11.from.annual)} to GS-11 step ${to11.to.step}, ${K.usd(to11.to.annual)}. Test your own step below.</p>
${h.mini('promo', { t: 'Your GS-9 step promoted to GS-11', p: ['s', 'a'], d: { g: '9', s: '2', ng: '11', a: 'RUS' } })}
<h2>If you stay at GS-9</h2>
<p>Some positions have a full-performance level of GS-9, and in one-grade-interval series the next rung is GS-10 or a competitive move. Then the within-grade increases are your raises. From step 2 with four months already served, step 3 comes in about ${K.dec(Math.ceil(ahead[0].monthsFromNow), 0)} months, step 5 in about ${K.dec(Math.ceil(ahead[2].monthsFromNow), 0)} months, and step 10 only after ${K.dec(Math.ceil(ahead[ahead.length - 1].monthsFromNow / 12), 0)} years or so. The ${h.a('gs-step-increase', 'step increase guide')} explains how breaks in service and quality step increases change those dates.</p>
<h2>Overtime and hourly pay at GS-9</h2>
<p>GS-9 sits below the GS-10 step 1 line that limits overtime for FLSA-exempt employees, so at every GS-9 step overtime is a full time and a half. In New York, step 1 pays ${K.usd(ny1.annual)} a year, ${K.usd2(ny1.hourly)} an hour and ${K.usd2(ny1.overtime)} for each overtime hour. The ${h.a('gs-hourly-pay', 'hourly pay page')} shows where the cap starts.</p>
`,
  faqs: [
    { q: 'Does a master\'s degree qualify you for GS-9?', a: 'For many professional and administrative series, yes: the OPM qualification standards accept a master\'s degree, or two full years of graduate study in a related field, for GS-9. Some series require specific coursework or a license instead, and some positions also ask for experience. The job announcement lists what that position accepts, and the agency decides once it reviews your transcripts.' },
    { q: 'How long do you stay at GS-9 before GS-11?', a: 'On a two-grade career ladder, about one year. Until January 18, 2027 the time-in-grade rule requires 52 weeks at GS-9. From January 19, 2027 that rule is gone, but the qualification standard still asks for one year of specialized experience at the GS-9 level, and the agency must find your work ready for the next grade.' },
    { q: 'What is GS-9 step 1 per hour in 2026?', a: `In Rest of U.S. it is ${K.usd2(rus1.hourly)}, the annual rate of ${K.usd(rus1.annual)} divided by 2,087 hours. In the Washington area it is ${K.usd2(dc1.hourly)}. A biweekly paycheck of 80 hours is ${K.usd2(rus1.biweekly)} gross in Rest of U.S., before taxes, FERS, health insurance and TSP.` },
  ],
  related: ['gs-7', 'gs-11', 'gs-promotion-calculator', 'gs-step-increase', 'gs-hourly-pay', 'gs-pay-scale-2026'],
});
