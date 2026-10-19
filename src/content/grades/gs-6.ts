import { defineGrade } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const g = 6;
const rus1 = K.pay(g, 1, 'RUS'), rus10 = K.pay(g, 10, 'RUS'), dc1 = K.pay(g, 1, 'DCB'), sea1 = K.pay(g, 1, 'SEA'), sa1 = K.pay(g, 1, 'SN');
const from5 = K.promote(5, 5, 6, 'RUS');
const to7 = K.promote(6, 3, 7, 'DCB');
const ahead = K.steps(g, 4, 6, 'RUS');
const inc = K.pay(g, 2, 'RUS').annual - rus1.annual;
const at = (s: number) => ahead.find((r) => r.step === s)!;

export default defineGrade({
  grade: g,
  title: 'GS-6 Pay Scale 2026: Salary, Steps and Hourly by Locality',
  description: `GS-6 pay 2026: ${K.usd(rus1.annual)} to ${K.usd(rus10.annual)} in Rest of U.S., ${K.usd(dc1.annual)} at step 1 in Washington DC. Technician and assistant grade, step dates and the promotion rules.`,
  intro: 'A grade of the one-grade-interval series: technicians and assistants who move up one grade at a time. Set your county to see your step.',
  resume: `GS-6 belongs to the one-grade-interval world of the General Schedule: technical, clerical and assistant series where careers move 5, 6, 7, 8 rather than 5, 7, 9. Typical GS-6 employees are technicians and specialized assistants who apply established procedures to a full range of cases, and in some series GS-6 is the full-performance level. In ${K.P.year} the base GS-6 rates run from ${K.usd(rus1.base)} at step 1 to ${K.usd(rus10.base)} at step 10. With locality pay, step 1 is ${K.usd(rus1.annual)} in Rest of U.S., ${K.usd(sa1.annual)} in San Antonio, ${K.usd(sea1.annual)} in Seattle and ${K.usd(dc1.annual)} in the Washington area. Each within-grade increase adds ${K.usd(inc)} a year in Rest of U.S., and step 10 there pays ${K.usd(rus10.annual)}. The hourly rate at step 1 is ${K.usd2(rus1.hourly)}, with overtime at ${K.usd2(rus1.overtime)}. A promotion from GS-5 to GS-6 typically adds a few thousand dollars, and the time-in-grade rule for it ends on January 19, 2027.`,
  body: (h) => `
<h2>One grade at a time</h2>
<p>The General Schedule has two kinds of career paths. In two-grade-interval series, the professional and administrative ones, grades go 5, 7, 9, 11 and GS-6 is skipped. In one-grade-interval series, the technical and assistant ones, every grade is used, and GS-6 is a normal rung: an engineering or medical technician, a program or management assistant, a specialized clerk with deep knowledge of one set of rules. The work is less about original analysis than about knowing procedures well and applying them without help. Classification standards for each series describe what separates GS-6 from GS-5 and GS-7, and the duties of the position decide the grade, not the person's education.</p>
<h2>Getting to GS-6</h2>
<p>GS-6 is the first grade covered by the time-in-grade rule. Until January 18, 2027, you need 52 weeks at GS-5 before a promotion to a GS-6 position in a one-grade-interval line. ${h.src('fr_tig_2026', 'OPM\'s final rule published October 19, 2026')} drops that requirement from January 19, 2027. What stays is the qualification standard: in general, one year of specialized experience equivalent to the next lower grade, so a year at GS-5 remains the typical path.</p>
<p>The pay gain follows the two-step rule. A GS-5 step 5 in Rest of U.S. earning ${K.usd(from5.from.annual)} becomes GS-6 step ${from5.to.step}, ${K.usd(from5.to.annual)}, a raise of ${K.usd(from5.raise)}. Only the lowest GS-5 steps land on GS-6 step 1: from step 3 up, the two-step target reaches into the middle of the new grade.</p>
<h2>Your step timeline if GS-6 is your target grade</h2>
<p>When GS-6 is the top of the position, step increases are the main raise. Suppose you are at step 4 with six months already served. Step 5 comes in about ${K.dec(Math.ceil(at(5).monthsFromNow), 0)} months, step 7 in about ${K.dec(Math.ceil(at(7).monthsFromNow), 0)} months, and step 10 in about ${K.dec(Math.round(at(10).monthsFromNow / 12), 0)} years, paying ${K.usd(at(10).annual)} at today's rates. A quality step increase for outstanding work moves you one step at once without changing the next waiting period.</p>
${h.mini('wgi', { t: 'GS-6 step increase dates from your current step', p: ['s', 'm'], d: { g: '6', s: '4', m: 6, a: 'RUS' } })}
<h2>The next rung: GS-7</h2>
<p>Many GS-6 technicians and assistants move to GS-7 in the same series, still one grade at a time. In Washington, GS-6 step 3 pays ${K.usd(to7.from.annual)}; the promotion places you at GS-7 step ${to7.to.step}, ${K.usd(to7.to.annual)}, a gain of ${K.usd(to7.raise)}. You can test other steps on the ${h.a('gs-promotion-calculator', 'promotion calculator')}. A move from a one-grade series into a two-grade professional ladder is possible too, when you meet that series' standard, and it usually means a new application.</p>
<h2>Hourly pay and overtime</h2>
<p>Overtime at GS-6 is time and a half at every step, because the grade stays below the GS-10 step 1 hourly rate that caps overtime for FLSA-exempt employees: ${K.usd2(rus10.hourly)} at step 10 in Rest of U.S. against ${K.usd2(K.pay(10, 1, 'RUS').hourly)} for GS-10 step 1. The ${h.a('gs-hourly-pay', 'hourly pay page')} shows the computation for any grade, step and area.</p>
`,
  faqs: [
    { q: 'What kind of jobs are GS-6?', a: 'Mostly technician and assistant positions in one-grade-interval series: engineering, biological or medical technicians, program and management assistants, and specialized clerks in fields such as payroll. The duties of the position set the grade under the OPM classification standard for the series. In some of these series GS-6 is the full-performance level; in others it leads to GS-7 or GS-8.' },
    { q: 'How much does a GS-6 make in 2026?', a: `From ${K.usd(rus1.annual)} at step 1 to ${K.usd(rus10.annual)} at step 10 in Rest of U.S., the lowest locality area. Step 1 is ${K.usd(dc1.annual)} in Washington and ${K.usd(K.pay(g, 1, 'SF').annual)} in ${K.area('SF').short}. These rates include the ${K.dec(K.RAISE, 1)} % raise of January 2026, with locality percentages frozen at their 2025 level.` },
    { q: 'Do you need time in grade to get promoted to GS-6?', a: 'Until January 18, 2027, yes: 52 weeks at GS-5 for a one-grade-interval position. From January 19, 2027, OPM removes the time-in-grade requirement. You still need to meet the qualification standard, which in general means one year of specialized experience at the GS-5 level, so the usual wait is unlikely to shrink much.' },
  ],
  related: ['gs-5', 'gs-7', 'gs-step-increase', 'gs-promotion-calculator', 'gs-hourly-pay', 'gs-pay-scale-2026'],
});
