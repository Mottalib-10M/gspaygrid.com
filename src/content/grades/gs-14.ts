import { defineGrade } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const g = 14;
const rus1 = K.pay(g, 1, 'RUS'), rus10 = K.pay(g, 10, 'RUS'), dc1 = K.pay(g, 1, 'DCB'), dc10 = K.pay(g, 10, 'DCB');
const sf8 = K.pay(g, 8, 'SF'), sf10 = K.pay(g, 10, 'SF'), ny10 = K.pay(g, 10, 'NY');
const sfCapped = K.table('SF')[g - 1].filter((x) => x >= K.CAP).length;
const cappedAreas = K.AREAS.filter((a) => K.table(a.code)[g - 1].some((x) => x >= K.CAP)).length;
const from13 = K.promote(13, 4, 14, 'DCB');
const to15 = K.promote(14, 6, 15, 'RUS');
const h3 = K.high3([K.pay(g, 8, 'RUS').annual, K.pay(g, 9, 'RUS').annual, rus10.annual]);
const at62 = K.fers({ birthYear: 1964, retireAgeMonths: 62 * 12, serviceMonths: 25 * 12, high3: h3 });
const at60 = K.fers({ birthYear: 1964, retireAgeMonths: 60 * 12, serviceMonths: 25 * 12, high3: h3 });

export default defineGrade({
  grade: g,
  title: 'GS-14 Pay Scale 2026: Salary by Step, Locality and Pay Cap',
  description: `GS-14 pay 2026: ${K.usd(rus1.annual)} at step 1 in Rest of U.S., ${K.usd(dc1.annual)} in DC. Supervisor and expert grade, first steps held at the pay cap, FERS high-3 at age 62.`,
  intro: 'A grade of supervisors, program managers and recognized experts, and the first where the pay cap touches a step. Choose your county below.',
  resume: `GS-14 positions are mostly supervisors of a branch or office, program managers, and senior experts whose work sets policy or technical direction for others. Entry is almost always competitive, from GS-13 after at least a year of specialized experience at that level. In ${K.P.year} the GS-14 base rate goes from ${K.usd(rus1.base)} to ${K.usd(rus10.base)}; with locality, step 1 pays ${K.usd(rus1.annual)} in Rest of U.S. and ${K.usd(dc1.annual)} in the Washington area, and step 10 pays ${K.usd(rus10.annual)} and ${K.usd(dc10.annual)}. GS-14 is the lowest grade where the ${K.usd(K.CAP)} pay cap, the Executive Schedule level IV rate, holds a cell down: in ${K.area('SF').short}, ${sfCapped} steps stop at the cap. Overtime for FLSA-exempt employees is paid at straight time at every step. For FERS, a high-3 built on GS-14 steps 8 to 10 in Rest of U.S. averages ${K.usd(h3)}, and retiring at 62 with 25 years at the 1.1 % multiplier pays about ${K.usd(at62.gross)} a year.`,
  body: (h) => `
<h2>Who holds GS-14</h2>
<p>GS-14 is a management and expertise grade. In headquarters it is often the chief of a branch or the manager of a program; in the field it can be the head of a large office. Non-supervisory GS-14 positions exist too, for experts whose judgment others rely on across an agency. Since few positions sit at this level, promotions come through announcements rather than a ladder. A GS-13 step 4 in Washington who is selected moves from ${K.usd(from13.from.annual)} to GS-14 step ${from13.to.step} at ${K.usd(from13.to.annual)}. The 52-week time-in-grade wait at GS-13 applies until January 18, 2027 and ${h.src('fr_tig_2026', 'ends on January 19, 2027')}, while the year of GS-13 level experience stays in the qualification standard.</p>
<h2>Where the cap starts to bite</h2>
<p>Locality pay is capped at the rate of Executive Schedule level IV, ${K.usd(K.CAP)} in ${K.P.year}. At GS-14 it binds only in ${cappedAreas === 1 ? 'one area' : `${cappedAreas} areas`}, ${K.area('SF').short}, where the uncapped table would give step 10 more than the cap. There, step 8 pays ${K.usd(sf8.annual)} and steps 9 and 10 both pay ${K.usd(sf10.annual)}. In New York, step 10 is ${K.usd(ny10.annual)}, still under the line. A GS-14 at step 9 in ${K.area('SF').short} therefore gains nothing from the step 10 increase, a preview of what happens across many areas at GS-15.</p>
${h.mini('cap', { t: 'Is your GS-14 step at the pay cap?', p: ['s', 'a'], d: { g: '14', s: '10', a: 'SF' } })}
<h2>The 1.1 % multiplier and the GS-14 high-3</h2>
<p>Many GS-14 employees reach this grade late in their career, so the years here usually make the high-3. The multiplier rises from 1 % to 1.1 % for an employee who separates at 62 or older with at least 20 years. Take someone born in 1964 with 25 years of service and a high-3 of ${K.usd(h3)}, the average of GS-14 steps 8, 9 and 10 in Rest of U.S. Leaving at 60 gives an immediate annuity of ${K.usd(at60.gross)} a year at 1 %. Waiting until 62 gives ${K.usd(at62.gross)}, a difference of ${K.usd(at62.gross - at60.gross)} a year for life, before any survivor election or COLA. The ${h.a('fers-retire-at-62', 'retire at 62 page')} covers the rule in detail.</p>
<h2>Overtime and the road to GS-15</h2>
<p>Every GS-14 hourly rate is above GS-10 step 1, so FLSA-exempt overtime pays straight time, and overtime never counts in the high-3. A move to GS-15 from step 6 in Rest of U.S. lands at GS-15 step ${to15.to.step}, ${K.usd(to15.to.annual)}, a raise of ${K.usd(to15.raise)}. See the ${h.a('gs-pay-cap', 'pay cap page')} for all capped cells.</p>
`,
  faqs: [
    { q: 'Is GS-14 a manager position?', a: 'Often, but not always. Many GS-14 positions are supervisors or managers of a branch, office or program, and others are non-supervisory experts whose work guides policy or technical decisions. The position description and the title on your SF-50 show whether supervisory duties are part of the job. Pay is the same either way: a GS-14 step 5 is paid the same rate whether or not the position supervises anyone.' },
    { q: 'Does GS-14 pay hit the cap in 2026?', a: `Only in ${K.area('SF').short}, where ${sfCapped} steps of GS-14 are held at the ${K.usd(K.CAP)} cap, the Executive Schedule level IV rate. In every other locality area all ten GS-14 steps are below it, so each within-grade increase is paid in full. At GS-15 the cap applies to top steps in most large areas.` },
    { q: 'How much is the GS-14 step 10 salary?', a: `${K.usd(rus10.annual)} in Rest of U.S. and ${K.usd(dc10.annual)} in the Washington area in ${K.P.year}, on a base of ${K.usd(rus10.base)}. Step 10 is reached after 18 years in the grade with every increase on time, or sooner with a quality step increase or when a promotion places you at a higher step.` },
  ],
  related: ['gs-13', 'gs-15', 'gs-pay-cap', 'fers-retire-at-62', 'high-3-salary', 'area:san-francisco'],
});
