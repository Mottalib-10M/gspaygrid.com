import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const H = 2087;
const g7 = K.pay(7, 1, 'RUS'), g10 = K.pay(10, 1, 'RUS'), g12 = K.pay(12, 5, 'RUS'), g13dc = K.pay(13, 5, 'DCB'), g10dc = K.pay(10, 1, 'DCB');
const grades = [3, 5, 7, 9, 11, 12, 13, 14, 15];

export default defineGuide({
  id: 'gs-hourly-pay', group: 'pay', order: 5, slug: 'gs-hourly-pay',
  nav: 'GS hourly pay and overtime', card: `Annual rate / ${K.num(H)} hours, biweekly = 80 hours, overtime capped above GS-10 step 1.`,
  title: 'GS Hourly Pay 2026: Hourly, Biweekly and Overtime Rates',
  description: `GS hourly pay 2026: annual rate divided by ${K.num(H)}, biweekly gross for 80 hours, overtime at 1.5 times, capped at 1.5 x GS-10 step 1. Rates by grade and area.`,
  h1: 'GS hourly pay 2026: hourly rate, biweekly gross and overtime',
  intro: 'Pick a grade, step and area, and the hours of overtime in a pay period: you get the hourly rate, the overtime rate and the gross for the period.',
  resume: `The hourly rate of a General Schedule employee is the annual rate of basic pay, locality included, divided by ${K.num(H)} hours and rounded to the nearest cent. A full biweekly paycheck before deductions is 80 hours at that rate. In ${P.year} a GS-7 step 1 in Rest of U.S. earns ${K.usd(g7.annual)} a year, ${K.usd2(g7.hourly)} an hour and ${K.usd2(g7.biweekly)} per pay period. Overtime depends on the grade. For employees exempt from the Fair Labor Standards Act, overtime is paid at one and a half times the hourly rate, but never more than one and a half times the hourly rate of GS-10 step 1 in the same area, and never less than the employee's own hourly rate. In Rest of U.S. that ceiling is ${K.usd2(g10.hourly * 1.5)} an hour in ${P.year}, so a GS-12 step 5 earning ${K.usd2(g12.hourly)} an hour receives ${K.usd2(g12.overtime)} for each overtime hour, not ${K.usd2(g12.hourly * 1.5)}. Most employees up to GS-9 or GS-10 get the full time and a half.`,
  tool: 'hourly',
  toolArg: { g: '7', s: '1', a: 'RUS', ot: 8 },
  faqs: [
    { q: 'Why does OPM divide by 2,087 hours and not 2,080?', a: `Because ${K.num(H)} is the average number of working hours in a year over the long run, counting leap years and the way 26 biweekly pay periods fall on the calendar. The divisor is set in 5 U.S.C. 5504, which also says to round to the nearest cent. Using 2,080 would overstate the hourly rate slightly. The ${K.num(H)} divisor also sets the value of a year of sick leave in a FERS computation.` },
    { q: 'How much is GS-13 overtime pay in 2026?', a: `For an FLSA-exempt GS-13 it is the higher of the employee's hourly rate and one and a half times GS-10 step 1 of the area. In Washington, GS-10 step 1 pays ${K.usd2(g10dc.hourly)} an hour, so the cap is ${K.usd2(g10dc.hourly * 1.5)}. A GS-13 step 5 there earns ${K.usd2(g13dc.hourly)} an hour and is paid ${K.usd2(g13dc.overtime)} per overtime hour.` },
    { q: 'Is a GS biweekly paycheck exactly the annual salary divided by 26?', a: `Almost, but not exactly. Payroll pays 80 hours at the hourly rate, which is the annual rate divided by ${K.num(H)} and rounded to the cent. For a GS-7 step 1 in Rest of U.S., that is ${K.usd2(g7.biweekly)} against ${K.usd2(g7.annual / 26)} for the annual rate over 26. Over a year with 26 pay periods the difference is a few dollars.` },
    { q: 'Do FLSA nonexempt GS employees get time and a half without a cap?', a: 'Yes. Employees covered by the Fair Labor Standards Act, generally clerical, technical and lower-graded positions, receive overtime under whichever rule pays more: the title 5 rule or the FLSA rule of one and a half times the regular rate. Their exemption status is shown on the position description and on the SF-50. This calculator applies the title 5 rule for exempt employees.' },
  ],
  body: (h) => `
<h2>From annual to hourly</h2>
<p>All General Schedule rates are fixed as annual figures. Payroll offices convert them to hourly rates with the divisor of 5 U.S.C. 5504, ${K.num(H)}, and round to the cent. Every other figure on the leave and earnings statement is built from that hourly rate: regular pay for 80 hours, overtime, night differential, Sunday and holiday pay, the value of annual leave paid out at separation. The table gives the ${P.year} hourly rates at step 1 and step 10 in three areas.</p>
${h.table(['Grade', 'Rest of U.S. step 1', 'Rest of U.S. step 10', 'Washington step 1', `${K.area('SF').short} step 1`], grades.map((g) => [`GS-${g}`, K.usd2(K.pay(g, 1, 'RUS').hourly), K.usd2(K.pay(g, 10, 'RUS').hourly), K.usd2(K.pay(g, 1, 'DCB').hourly), K.usd2(K.pay(g, 1, 'SF').hourly)]), `${P.year} hourly rates of basic pay with locality. Switch the calculator on the GS pay scale page to "Hourly" for a full table.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>The biweekly paycheck</h2>
<p>Federal employees are paid every two weeks for 80 hours. Gross pay for a period with no premium hours is the hourly rate times 80; a part-time employee is paid for the hours in the tour. Deductions then take out FERS retirement contributions, TSP contributions, FEHB and FEGLI premiums, Social Security and Medicare, and federal and state income tax. The calculator stops at the gross, because deductions depend on choices only you know. A year usually has 26 pay periods; in a calendar year that contains 27 paydays, the extra one is paid like any other.</p>
<h2>Overtime for exempt employees</h2>
<p>Title 5 sets the overtime rate for employees exempt from the Fair Labor Standards Act in 5 U.S.C. 5542(a). If the hourly rate is at or below the hourly rate of GS-10 step 1 in the area, overtime is time and a half. Above it, overtime is the greater of the employee's own hourly rate and one and a half times the GS-10 step 1 rate. That is why a GS-14 may earn less per overtime hour than per regular hour multiplied by 1.5, and why at the top of the scale an overtime hour can pay the same as a regular hour.</p>
${h.table(['Grade, step 5, Rest of U.S.', 'Hourly rate', 'Overtime rate', 'Overtime / hourly'], [7, 9, 11, 12, 13, 14, 15].map((g) => { const p = K.pay(g, 5, 'RUS'); return [`GS-${g}`, K.usd2(p.hourly), K.usd2(p.overtime), `${K.dec(p.overtime / p.hourly, 2)}x`]; }), `Overtime rates in ${P.year}. The ceiling is 1.5 x GS-10 step 1 (${K.usd2(g10.hourly)} an hour in Rest of U.S.).`, ['l', 'r', 'r', 'r'])}
${h.mini('hourly', { t: 'Your overtime in one pay period', p: ['g', 's', 'ot'], d: { g: '12', s: '5', a: 'DCB', ot: 10 } })}
<h2>The eight-hour day</h2>
<p>Overtime under 5 U.S.C. 5542 is work officially ordered or approved beyond 40 hours in the administrative workweek, or beyond 8 hours in a day. The daily rule does not apply to employees paid above the GS-10 step 1 rate of their area, nor to professional engineers and scientists, when their basic workweek is the first 40 hours. Hours you choose to work on a flexible schedule are credit hours, earned hour for hour, and are not overtime. Compensatory time off can replace overtime pay in some cases under 5 U.S.C. 5543; it is not part of this calculator.</p>
<h2>Night, Sunday and holiday work</h2>
<p>Three other premiums are computed on the same hourly rate. Regularly scheduled work between 6 p.m. and 6 a.m. carries a night differential of 10 % of the hourly rate under 5 U.S.C. 5545(a). Regularly scheduled work on a Sunday, outside overtime, is paid an extra 25 % for up to eight hours under 5 U.S.C. 5546(a). Work on a federal holiday is paid twice the hourly rate for the hours of the regular tour under 5 U.S.C. 5546(b). For a GS-7 step 1 in Rest of U.S., that is ${K.usd2(g7.hourly * 0.1)} more per night hour, ${K.usd2(g7.hourly * 0.25)} more per Sunday hour and ${K.usd2(g7.hourly)} more per holiday hour. Wage grade employees under the Federal Wage System have different night rules.</p>
<h2>Annual leave at separation</h2>
<p>When you leave federal service or retire, unused annual leave is paid as a lump sum at your hourly rate, for the hours you would have worked had you stayed on the rolls. A retiring GS-12 step 5 in Rest of U.S. with 240 hours of annual leave receives about ${K.usd(g12.hourly * 240)} before taxes. That lump sum is not basic pay, so it does not enter the FERS high-3; the ${h.a('high-3-salary', 'high-3 page')} lists what does.</p>
<h2>Premium pay limits</h2>
<p>Overtime and other premium pay are themselves limited each pay period or each year by 5 U.S.C. 5547: basic pay plus premium pay for a pay period may not exceed the greater of the GS-15 step 10 rate of the area and the Executive Schedule level V rate, ${K.usd(P.pay.execSchedule2026.V)} a year in ${P.year}. For work in an emergency that threatens life or property, wildfires included, the limit becomes an annual one instead. Few employees reach either, so the calculator does not apply them.</p>
`,
  related: ['gs-pay-scale-2026', 'gs-10', 'gs-pay-cap', 'locality-pay', 'sick-leave-retirement-credit'],
  sources: ['usc_5504', 'usc_5542', 'usc_5545', 'usc_5546', 'usc_5547', 'opm_gs_2026', 'opm_ex_2026'],
});
