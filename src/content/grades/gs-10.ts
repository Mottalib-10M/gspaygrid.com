import { defineGrade } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const g = 10;
const rus1 = K.pay(g, 1, 'RUS'), rus10 = K.pay(g, 10, 'RUS'), dc1 = K.pay(g, 1, 'DCB'), sf1 = K.pay(g, 1, 'SF');
const la1 = K.pay(g, 1, 'LA');
const g11 = K.pay(11, 5, 'RUS'), g13 = K.pay(13, 1, 'RUS'), g9 = K.pay(9, 10, 'RUS');
const from9 = K.promote(9, 1, 10, 'HOU');
const to11 = K.promote(10, 3, 11, 'RUS');
const inc = K.pay(g, 3, 'DCB').annual - K.pay(g, 2, 'DCB').annual;

export default defineGrade({
  grade: g,
  title: 'GS-10 Pay Scale 2026: Salary, Steps and the Overtime Cap',
  description: `GS-10 pay 2026: ${K.usd(rus1.annual)} to ${K.usd(rus10.annual)} in Rest of U.S. A rare grade of one-grade technical and law enforcement series, and the base of the federal overtime cap.`,
  intro: 'Few employees hold GS-10, yet its step 1 rate sets the overtime ceiling for every grade above it. Pick your county to read your rate.',
  resume: `GS-10 is one of the least used grades of the General Schedule. Two-grade-interval careers skip it, going from GS-9 straight to GS-11, so the employees you find here are mostly in one-grade-interval series, such as technical, assistant and some law enforcement positions, where every grade from GS-5 up is a separate rung. In ${K.P.year} GS-10 step 1 pays ${K.usd(rus1.annual)} in Rest of U.S. on a base of ${K.usd(rus1.base)}, ${K.usd(dc1.annual)} in Washington DC and ${K.usd(sf1.annual)} in ${K.area('SF').short}, the highest area. Step 10 reaches ${K.usd(rus10.annual)} in Rest of U.S. The grade matters far beyond its own holders: for FLSA-exempt employees, overtime is limited to 1.5 times the GS-10 step 1 hourly rate of the area. In Rest of U.S. that rate is ${K.usd2(rus1.hourly)}, so overtime above GS-10 step 1 is capped at ${K.usd2(rus1.overtime)} an hour, unless your own hourly rate is higher.`,
  body: (h) => `
<h2>Why so few employees are GS-10</h2>
<p>The General Schedule has two kinds of series. In two-grade-interval series, the professional and administrative ones, a career ladder climbs 5, 7, 9, 11 and then 12. GS-10 does not appear on that path at all. In one-grade-interval series, the technical, clerical and assistant ones, each grade is a step of its own, and a position classified GS-10 there carries duties a notch above GS-9 but below the full professional level. Some federal law enforcement positions also use GS-10, and law enforcement officers can be paid from ${h.src('opm_leo_2026', 'special law enforcement tables')} rather than the regular locality table. Executive Order 14368 let OPM raise certain law enforcement personnel by up to ${K.dec(K.P.pay.leo2026.upToTotalRaise, 1)} % in total in ${K.P.year}, the ${K.dec(K.RAISE, 1)} % general raise included, so check which table your SF-50 names.</p>
<h2>The overtime line drawn at GS-10 step 1</h2>
<p>Federal overtime under title 5 is time and a half of your hourly rate, but for employees exempt from the Fair Labor Standards Act it stops growing once your hourly rate passes GS-10 step 1 of your area. Above that line you receive the greater of 1.5 times the GS-10 step 1 rate and your own hourly rate. Here is what that means in Rest of U.S. in ${K.P.year}:</p>
${h.table(['Grade and step', 'Hourly rate', 'Overtime hour'], [
    ['GS-9 step 10', K.usd2(g9.hourly), K.usd2(g9.overtime)],
    ['GS-10 step 1', K.usd2(rus1.hourly), K.usd2(rus1.overtime)],
    ['GS-11 step 5', K.usd2(g11.hourly), K.usd2(g11.overtime)],
    ['GS-13 step 1', K.usd2(g13.hourly), K.usd2(g13.overtime)],
  ], `Rest of U.S., ${K.P.year}, FLSA-exempt employees.`, ['l', 'r', 'r'])}
<p>A GS-11 step 5 earns more per regular hour than a GS-10 step 1, yet both receive the same overtime hour. By GS-13 the hourly rate itself is above the cap, so overtime is paid at straight time. Because the cap follows locality, it is higher in costly areas: in ${K.area('LA').short}, GS-10 step 1 is ${K.usd2(la1.hourly)} an hour and the overtime ceiling is ${K.usd2(la1.overtime)}.</p>
${h.mini('hourly', { t: 'Overtime at your grade against the GS-10 cap', p: ['g', 's', 'a'], d: { g: '11', s: '1', a: 'RUS', ot: 10 } })}
<h2>Moving in and out of GS-10</h2>
<p>A one-grade promotion from GS-9 step 1 in Houston pays ${K.usd(from9.from.annual)} before and ${K.usd(from9.to.annual)} after, at GS-10 step ${from9.to.step}. Leaving GS-10 step 3 for GS-11 in Rest of U.S. lands at GS-11 step ${to11.to.step}, ${K.usd(to11.to.annual)}, a raise of ${K.usd(to11.raise)}. In a one-grade series, the time-in-grade rule asks for 52 weeks at GS-9 before GS-10 until January 18, 2027; ${h.src('fr_tig_2026', 'OPM removed it')} from January 19, 2027, while the year of specialized experience in the qualification standard remains. Within the grade, each step adds ${K.usd(inc)} a year in Washington DC. The ${h.a('gs-hourly-pay', 'hourly and overtime page')} covers premium pay in more detail.</p>
`,
  faqs: [
    { q: 'Why is overtime capped at the GS-10 step 1 rate?', a: 'Title 5 of the U.S. Code sets the overtime rate of FLSA-exempt General Schedule employees at time and a half, but never more than 1.5 times the hourly rate of GS-10 step 1, locality included. When your own hourly rate is above that, you get the greater of your hourly rate and the capped rate. Employees covered by the FLSA are paid under its rules instead.' },
    { q: 'Which jobs are GS-10?', a: 'Mostly positions in one-grade-interval series, where each grade from GS-5 upward is its own level: technicians, specialized assistants and some law enforcement roles. Professional and administrative careers almost never use GS-10, because their ladders move two grades at a time from GS-5 to GS-11. The position description and your SF-50 show the series and grade.' },
    { q: 'How much does GS-10 step 1 pay in 2026?', a: `${K.usd(rus1.annual)} a year in Rest of U.S., ${K.usd(dc1.annual)} in Washington DC and ${K.usd(sf1.annual)} in ${K.area('SF').short}. The base rate is ${K.usd(rus1.base)}, raised by the locality percentage of your official worksite. Some law enforcement employees at GS-10 are paid from special tables that are higher than these rates.` },
  ],
  related: ['gs-9', 'gs-11', 'gs-hourly-pay', 'gs-special-rates', 'gs-promotion-calculator', 'gs-pay-scale-2026'],
});
