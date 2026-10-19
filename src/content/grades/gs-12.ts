import { defineGrade } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const g = 12;
const rus1 = K.pay(g, 1, 'RUS'), rus10 = K.pay(g, 10, 'RUS'), dc1 = K.pay(g, 1, 'DCB'), sf1 = K.pay(g, 1, 'SF');
const up = K.promote(11, 5, 12, 'RUS');
const to13 = K.promote(12, 3, 13, 'DCB');

export default defineGrade({
  grade: g,
  title: 'GS-12 Pay Scale 2026: Salary by Step and Locality Area',
  description: `GS-12 pay 2026: ${K.usd(rus1.annual)} to ${K.usd(rus10.annual)} in Rest of U.S., ${K.usd(dc1.annual)} at step 1 in Washington DC. All 10 steps in 58 areas, hourly rates and promotion from GS-11.`,
  intro: 'The full journeyman grade of most two-grade-interval careers. Pick your county to see your step and the next one.',
  resume: `GS-12 is where most federal professionals in a two-grade-interval series, the ladders that go 5, 7, 9, 11, land as full-performance employees: contract specialists, IT specialists, engineers after a few years, program analysts, auditors. In ${K.P.year} the base GS-12 table runs from ${K.usd(rus1.base)} at step 1 to ${K.usd(rus10.base)} at step 10, and nobody is paid the base alone: locality pay lifts it by ${K.dec(K.area('RUS').pct, 2)} % in Rest of U.S., to ${K.usd(rus1.annual)}, and by ${K.dec(K.area('DCB').pct, 2)} % in the Washington area, to ${K.usd(dc1.annual)}. The highest area, ${K.area('SF').short}, pays ${K.usd(sf1.annual)} at step 1. From step 1 to step 10 the grade adds ${K.usd(rus10.annual - rus1.annual)} in Rest of U.S. over 18 years of on-time step increases. The 2026 figures include the ${K.dec(K.RAISE, 1)} % raise of Executive Order 14368 with every locality percentage frozen at its 2025 level.`,
  body: (h) => `
<h2>Who is a GS-12</h2>
<p>For a two-grade-interval series, GS-12 is the first grade above the GS-11 developmental level and, in many agencies, the full-performance level: you are expected to work independently on assignments of full complexity. Positions above it, GS-13 and GS-14, are usually team leads, senior specialists or supervisors, and are often filled by competitive announcement rather than by career ladder. That is why GS-12 step increases matter more than at lower grades: many employees spend ten years or more here.</p>
<p>The entry route is almost always a promotion from GS-11. Until January 18, 2027 that promotion needs 52 weeks at GS-11, the time-in-grade rule of 5 CFR part 300. ${h.src('fr_tig_2026', 'An OPM final rule of October 19, 2026')} removes the requirement from January 19, 2027: the one year of specialized experience at the GS-11 level that the qualification standard asks for still applies, so in practice most GS-11 employees will still wait about a year. External hires come in at GS-12 when they show that same year of specialized experience, or a Ph.D. for some research positions.</p>
<h2>From GS-11 to GS-12: what the promotion pays</h2>
<p>A promotion is not a jump to step 1. Under the two-step rule of 5 CFR 531.214, OPM's standard method takes your GS-11 base rate, adds two GS-11 step increments, applies your locality percentage, and places you at the lowest GS-12 step that equals or beats that amount. A GS-11 step 5 in Rest of U.S. earns ${K.usd(up.from.annual)} and lands at GS-12 step ${up.to.step}, ${K.usd(up.to.annual)}, a raise of ${K.usd(up.raise)} or ${K.pct(up.raisePct, 1)}. The waiting period for the next step increase starts again on the day of the promotion.</p>
${h.mini('promo', { t: 'Where does your GS-11 step land at GS-12?', p: ['s'], d: { g: '11', s: '5', ng: '12', a: 'RUS' } })}
<h2>Step increases at GS-12</h2>
<p>Steps 2, 3 and 4 each come after 52 weeks, steps 5 to 7 after 104 weeks, steps 8 to 10 after 156 weeks, provided your performance is at an acceptable level of competence. Each step adds about 3.3 % of the base step 1 rate: ${K.usd(K.pay(g, 2, 'RUS').annual - rus1.annual)} a year in Rest of U.S. and ${K.usd(K.pay(g, 2, 'DCB').annual - dc1.annual)} in Washington. A quality step increase, granted for outstanding performance, adds one step at once without changing the waiting period that follows.</p>
<h2>GS-12 and the pay cap</h2>
<p>No GS-12 rate reaches the ${K.usd(K.CAP)} ceiling of Executive Schedule level IV in ${K.P.year}: even step 10 in ${K.area('SF').short} pays ${K.usd(K.pay(g, 10, 'SF').annual)}. Every step increase therefore shows in full on your paycheck, which is no longer true at the top steps of GS-15 in the highest areas.</p>
<h2>Moving up to GS-13</h2>
<p>Going from GS-12 step 3 to GS-13 in the Washington area moves you from ${K.usd(to13.from.annual)} to GS-13 step ${to13.to.step}, ${K.usd(to13.to.annual)}. The ${h.a('gs-promotion-calculator', 'promotion calculator')} runs the same rule for any grade, step and area, and the ${h.a('gs-step-increase', 'step increase page')} gives the dates of each step from your last one.</p>
<p>Your high-3 for FERS is built from your highest three consecutive years of basic pay with locality, so the years you spend at GS-12 steps 7 to 10 often decide the pension of an employee who never moves to GS-13. A GS-12 step 10 who retires in Rest of U.S. with 30 years at the MRA has a high-3 close to ${K.usd(rus10.annual)} and an annuity of about ${K.usd(rus10.annual * 0.3)} a year before any survivor reduction.</p>
`,
  faqs: [
    { q: 'What is the GS-12 starting salary in 2026?', a: `GS-12 step 1 pays ${K.usd(rus1.annual)} in Rest of U.S., the lowest locality area, and ${K.usd(dc1.annual)} in Washington-Baltimore. The base rate before locality is ${K.usd(rus1.base)}, but no employee in the 50 states is paid the base alone. Your area depends on your official worksite, so a teleworker who reports to an office keeps that office's area.` },
    { q: 'How long does it take to reach GS-12 step 10?', a: `Eighteen years from step 1 if every within-grade increase comes on time: three years at one year each, three at two years and three at three years. A quality step increase shortens the climb by a full step, and a promotion from GS-11 usually places you above step 1, at step 2 or 3, which cuts the wait further.` },
    { q: 'Is a GS-12 a supervisor?', a: 'Usually not. GS-12 is the full-performance grade of many professional and administrative series, so most GS-12 employees are senior specialists without supervisory duties. Some first-line supervisors are GS-12 in field offices, and team leaders can be GS-12, but supervisory positions in headquarters are more often classified GS-13 or GS-14.' },
  ],
  related: ['gs-11', 'gs-13', 'gs-promotion-calculator', 'gs-step-increase', 'gs-pay-scale-2026', 'area:washington-dc'],
});
