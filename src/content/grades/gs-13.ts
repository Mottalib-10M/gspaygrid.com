import { defineGrade } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const g = 13;
const rus1 = K.pay(g, 1, 'RUS'), rus10 = K.pay(g, 10, 'RUS'), dc1 = K.pay(g, 1, 'DCB'), dc10 = K.pay(g, 10, 'DCB'), bos1 = K.pay(g, 1, 'BOS');
const from12 = K.promote(12, 6, 13, 'RUS');
const to14 = K.promote(13, 4, 14, 'DCB');
const h3 = K.high3([K.pay(g, 8, 'DCB').annual, K.pay(g, 9, 'DCB').annual, dc10.annual]);
const pen = K.fers({ birthYear: 1970, retireAgeMonths: 57 * 12, serviceMonths: 30 * 12, high3: h3 });
const ot = K.pay(g, 1, 'RUS');

export default defineGrade({
  grade: g,
  title: 'GS-13 Pay Scale 2026: Salary Table, Steps and FERS High-3',
  description: `GS-13 pay 2026: ${K.usd(rus1.annual)} to ${K.usd(rus10.annual)} in Rest of U.S., ${K.usd(dc1.annual)} at step 1 in DC. Senior specialist grade, overtime limits, the GS-14 move and FERS pension.`,
  intro: 'The grade of senior specialists, team leads and many first-line supervisors. Choose your county to see your step and the next one.',
  resume: `GS-13 is where many federal careers settle for good: senior specialists, technical experts, team leaders and a share of first-line supervisors, often reached by a competitive announcement after several years at GS-12. In ${K.P.year} the base rate runs from ${K.usd(rus1.base)} at step 1 to ${K.usd(rus10.base)} at step 10. Locality lifts step 1 to ${K.usd(rus1.annual)} in Rest of U.S., ${K.usd(bos1.annual)} in Boston and ${K.usd(dc1.annual)} in the Washington area, where step 10 pays ${K.usd(dc10.annual)}. Every GS-13 hourly rate is above the GS-10 step 1 line, so FLSA-exempt overtime is paid at straight time: ${K.usd2(ot.hourly)} an hour at step 1 in Rest of U.S., the same as a regular hour. Because many employees spend their last years at GS-13, its upper steps often make the FERS high-3: three years at steps 8, 9 and 10 in Washington average ${K.usd(h3)}, and 30 years of service at the MRA turn that into about ${K.usd(pen.gross)} a year before any survivor election.`,
  body: (h) => `
<h2>The work behind a GS-13</h2>
<p>A GS-13 position usually means you are the person others come to: a specialist trusted with the hardest cases of your field, or an analyst who writes guidance rather than applies it. Some positions add the lead of a small team; others are first-line supervisory jobs in field offices. Few career ladders reach GS-13 on their own, so the step from GS-12 is often a competitive selection, and the specialized experience asked for is one year at the GS-12 level.</p>
<p>A GS-12 step 6 in Rest of U.S. who is selected moves from ${K.usd(from12.from.annual)} to GS-13 step ${from12.to.step}, ${K.usd(from12.to.annual)}, a gain of ${K.usd(from12.raise)}. Until January 18, 2027 a GS-12 needs 52 weeks in grade first. ${h.src('fr_tig_2026', 'OPM\'s October 19, 2026 final rule')} removes that wait from January 19, 2027; the experience requirement of the qualification standard does not change.</p>
<h2>Overtime at GS-13 is straight time</h2>
<p>Overtime for FLSA-exempt employees is capped at 1.5 times the hourly rate of GS-10 step 1 of your area, or your own hourly rate if that is higher. At GS-13 your own rate is always higher, at every step and in every area, so an hour of overtime pays the same as a regular hour. Paid overtime still raises your gross pay for the period, but it never counts toward the high-3. Employees still covered by the FLSA follow its own overtime rules.</p>
<h2>Your pension built on GS-13 pay</h2>
<p>FERS uses your highest three consecutive years of basic pay, locality included, with no overtime or awards. Take an employee born in 1970 who retires at the MRA of ${K.ym(K.mra(1970))} with 30 years and three final years at GS-13 steps 8, 9 and 10 in the Washington area. The high-3 is ${K.usd(h3)}; at 1 % per year of service the basic annuity is ${K.usd(pen.gross)} a year, or ${K.usd(pen.gross / 12)} a month, before the survivor election and before the FERS supplement paid until 62. A step increase that lands in those final years raises the pension for life, which is why the timing of your last within-grade increase is worth checking.</p>
${h.mini('high3', { t: 'Your GS-13 high-3 from your step and area', p: ['s', 'a', 'yrs'], d: { g: '13', s: '8', a: 'DCB', yrs: 3 } })}
<h2>Looking toward GS-14</h2>
<p>A GS-13 step 4 in Washington promoted to GS-14 moves from ${K.usd(to14.from.annual)} to GS-14 step ${to14.to.step}, ${K.usd(to14.to.annual)}. GS-13 is still below the ${K.usd(K.CAP)} cap everywhere: step 10 in ${K.area('SF').short} pays ${K.usd(K.pay(g, 10, 'SF').annual)}. The ${h.a('high-3-salary', 'high-3 guide')} and the ${h.a('fers-retirement-calculator', 'FERS calculator')} take the estimate further.</p>
`,
  faqs: [
    { q: 'What does a GS-13 make in Washington DC in 2026?', a: `From ${K.usd(dc1.annual)} at step 1 to ${K.usd(dc10.annual)} at step 10, with the ${K.dec(K.area('DCB').pct, 2)} % Washington-Baltimore locality percentage. The area covers the District and many surrounding counties. Your official worksite on the SF-50 decides the area, and a teleworker who reports to the office at least twice each pay period keeps the office's rate.` },
    { q: 'Do GS-13 employees get paid overtime?', a: 'Yes, when overtime is ordered or approved, but if you are exempt from the Fair Labor Standards Act the rate is capped at 1.5 times the GS-10 step 1 hourly rate of your area or your own hourly rate, whichever is greater. At GS-13 your own rate is greater, so overtime pays straight time. Overtime hours never count in the FERS high-3.' },
    { q: 'Is GS-13 a good grade to retire from?', a: `It is a common one. The FERS annuity uses your best three consecutive years of basic pay with locality, so GS-13 steps 8 to 10 in Washington give a high-3 near ${K.usd(h3)} and about ${K.usd(pen.gross)} a year after 30 years at 1 %. Retiring at 62 or later with 20 years raises the multiplier to 1.1 %.` },
  ],
  related: ['gs-12', 'gs-14', 'high-3-salary', 'fers-retirement-calculator', 'gs-promotion-calculator', 'area:washington-dc'],
});
