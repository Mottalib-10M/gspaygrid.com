import { defineGrade } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const g = 7;
const rus1 = K.pay(g, 1, 'RUS'), rus10 = K.pay(g, 10, 'RUS'), dc1 = K.pay(g, 1, 'DCB'), hou1 = K.pay(g, 1, 'HOU'), sf1 = K.pay(g, 1, 'SF');
const phx1 = K.pay(g, 1, 'PX'), bos1 = K.pay(g, 1, 'BOS');
const to9 = K.promote(7, 1, 9, 'HOU');
const to8 = K.promote(7, 4, 8, 'RUS');
const from5 = K.pay(5, 1, 'RUS').annual;
const inc = K.pay(g, 2, 'RUS').annual - rus1.annual;
const ranked = [...K.AREAS].sort((a, b) => K.pay(g, 1, b.code).annual - K.pay(g, 1, a.code).annual);

export default defineGrade({
  grade: g,
  title: 'GS-7 Salary 2026: Pay by Step, Locality and Promotion Path',
  description: `GS-7 pay 2026: ${K.usd(rus1.annual)} at step 1 in Rest of U.S., ${K.usd(dc1.annual)} in Washington DC, ${K.usd(sf1.annual)} in San Francisco. Graduate entry level, hourly rate and the GS-9 step.`,
  intro: 'The entry grade for superior academic achievement or a year of graduate study, and the middle of the 5, 7, 9 ladder. Pick your county below.',
  resume: `GS-7 is the second rung of the two-grade career ladders and a direct entry grade for many graduates. In a large number of professional and administrative series, the OPM qualification standards accept one full year of graduate education for GS-7, or a bachelor's degree with superior academic achievement, which is measured by class standing, grade point average or honor society membership. One year of specialized experience at the GS-5 level also qualifies. In ${K.P.year} the GS-7 base table goes from ${K.usd(rus1.base)} to ${K.usd(rus10.base)}. Step 1 pays ${K.usd(rus1.annual)} in Rest of U.S., ${K.usd(phx1.annual)} in Phoenix, ${K.usd(hou1.annual)} in Houston, ${K.usd(dc1.annual)} in Washington and ${K.usd(sf1.annual)} in ${K.area('SF').short}. Each step adds ${K.usd(inc)} a year in Rest of U.S., where step 10 pays ${K.usd(rus10.annual)}. At step 1 the hourly rate is ${K.usd2(rus1.hourly)} and overtime ${K.usd2(rus1.overtime)}. On a ladder, the promotion to GS-9 usually follows after about a year.`,
  body: (h) => `
<h2>Three ways in at GS-7</h2>
<p>Hiring managers see GS-7 applicants from three directions. The first is education: a year of graduate study in a related field, or a bachelor's degree earned with superior academic achievement as the OPM qualification standards define it. The second is experience: one year of specialized experience equivalent to GS-5 in federal service, or comparable work outside it. The third is promotion from GS-5 on a ladder. The announcement states which of these the position accepts, and the agency checks transcripts or work history before making the offer, so the grade you are offered can differ from the one you applied for.</p>
<p>Coming from GS-5 on a ladder, step 1 to step 1 in Rest of U.S. is ${K.usd(rus1.annual - from5)} a year more. Until January 18, 2027, that promotion requires 52 weeks at GS-5, the time-in-grade rule for two-grade-interval positions. ${h.src('fr_tig_2026', 'The OPM final rule of October 19, 2026')} removes the requirement from January 19, 2027; the year of specialized experience the qualification standard asks for still applies.</p>
<h2>How much the city changes GS-7 pay</h2>
<p>At GS-7 the locality percentage is the whole story of the difference between two offers. The highest-paying areas for GS-7 step 1 are ${ranked.slice(0, 3).map((a) => `${a.short} (${K.usd(K.pay(g, 1, a.code).annual)})`).join(', ')}. At the other end, Rest of U.S. pays ${K.usd(rus1.annual)}, a gap of ${K.usd(sf1.annual - rus1.annual)} a year for the same job. Boston sits in between at ${K.usd(bos1.annual)}. Living costs vary too, so a higher rate is not always more money in the bank. The area follows your official worksite, which for a teleworker reporting to the office at least twice each pay period is the office.</p>
${h.mini('gs', { t: 'GS-7 pay at your worksite', p: ['s', 'st', 'co'], d: { g: '7', s: '1', st: 'TX', co: 'Harris County' } })}
<h2>GS-9 next, or GS-8</h2>
<p>On a two-grade ladder the next stop is GS-9. A GS-7 step 1 in Houston earning ${K.usd(to9.from.annual)} moves to GS-9 step ${to9.to.step}, ${K.usd(to9.to.annual)}, a raise of ${K.usd(to9.raise)} or ${K.pct(to9.raisePct, 1)}. The ${h.a('gs-9', 'GS-9 page')} covers that grade. GS-7 is also a normal grade in one-grade-interval technical and assistant series, where the next step is GS-8: a GS-7 step 4 in Rest of U.S. goes from ${K.usd(to8.from.annual)} to GS-8 step ${to8.to.step} at ${K.usd(to8.to.annual)}. The waiting period for your next within-grade increase starts again after either promotion.</p>
<h2>Paycheck and overtime at GS-7</h2>
<p>A biweekly pay period of 80 hours at step 1 grosses ${K.usd2(rus1.biweekly)} in Rest of U.S. and ${K.usd2(dc1.biweekly)} in Washington. Overtime is paid at time and a half at every GS-7 step: step 10 in Rest of U.S. earns ${K.usd2(rus10.hourly)} an hour, still below the GS-10 step 1 rate of ${K.usd2(K.pay(10, 1, 'RUS').hourly)} where the overtime cap starts. The ${h.a('gs-hourly-pay', 'hourly pay guide')} explains the cap for the grades above.</p>
`,
  faqs: [
    { q: 'What is superior academic achievement for a GS-7 job?', a: 'It is a way to qualify for GS-7 with a bachelor\'s degree alone. Under the OPM qualification standards it is based on class standing in the upper third, a grade point average at or above the level the standard sets, or membership in a recognized national scholastic honor society. The agency checks your transcript, and the rules on which courses count are in the standard.' },
    { q: 'How much does GS-7 step 1 pay in 2026?', a: `${K.usd(rus1.annual)} in Rest of U.S., ${K.usd2(rus1.hourly)} an hour. In Washington it is ${K.usd(dc1.annual)}, in Houston ${K.usd(hou1.annual)} and in ${K.area('SF').short} ${K.usd(sf1.annual)}. These are ${K.P.year} rates after the ${K.dec(K.RAISE, 1)} % raise of January 2026, with every locality percentage unchanged from its 2025 level.` },
    { q: 'Is a year of graduate school enough for GS-7?', a: 'For many professional and administrative series, yes. OPM qualification standards accept one full year of graduate-level education in a related field for GS-7. Some series require specific coursework or a particular degree, so check the qualifications section of the announcement. Two full years of graduate study, or a master\'s degree, generally qualify for GS-9.' },
  ],
  related: ['gs-5', 'gs-8', 'gs-9', 'gs-promotion-calculator', 'locality-pay', 'gs-pay-scale-2026'],
});
