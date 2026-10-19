import { defineGrade } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const g = 4;
const rus1 = K.pay(g, 1, 'RUS'), rus5 = K.pay(g, 5, 'RUS'), rus6 = K.pay(g, 6, 'RUS'), rus10 = K.pay(g, 10, 'RUS');
const dc1 = K.pay(g, 1, 'DCB'), sf1 = K.pay(g, 1, 'SF'), atl1 = K.pay(g, 1, 'ATL');
const sp = (K.P.pay.special001M.rates[3] as Array<number | null>).filter((x): x is number => x !== null);
const covered = sp.length;
const count = (s: number) => K.AREAS.filter((a) => K.pay(g, s, a.code).usesSpecial).length;
const counts = Array.from({ length: covered }, (_, i) => count(i + 1));
const up = K.promote(4, 3, 5, 'RUS');
const upDc = K.promote(4, 6, 5, 'DCB');
const lift = rus1.annual - rus1.locality;

export default defineGrade({
  grade: g,
  title: 'GS-4 Pay Scale 2026: Steps, Special Rates and GS-5 Promotion',
  description: `GS-4 pay 2026: ${K.usd(rus1.annual)} at step 1 and ${K.usd(rus10.annual)} at step 10 in Rest of U.S., ${K.usd(dc1.annual)} in Washington DC. Where special table 001M stops and what GS-5 pays you.`,
  intro: 'The last grade lifted by special table 001M, and only at its lower steps. Choose your county to see your own rate.',
  resume: `GS-4 is a common grade for experienced clerks, technicians in training, office and program assistants, and aides who handle a full range of routine work with little supervision. For many of these series, OPM qualification standards generally accept two years of education above high school in place of experience. In ${K.P.year} GS-4 is the last grade touched by special rate table 001M, and only partly: the table covers steps 1 to ${covered}, from ${K.usd(sp[0])} to ${K.usd(sp[covered - 1])}, and leaves steps ${covered + 1} to 10 blank. In Rest of U.S. the 001M rate applies at step 1, ${K.usd(rus1.annual)}, which is ${K.usd(lift)} above the locality rate, and at the lower steps. From step ${covered + 1} the normal Rest of U.S. locality rate takes over, ${K.usd(rus6.annual)} at step ${covered + 1} and ${K.usd(rus10.annual)} at step 10. In larger areas locality wins from step 1: ${K.usd(dc1.annual)} in Washington and ${K.usd(sf1.annual)} in ${K.area('SF').short}. Hourly pay at step 1 is ${K.usd2(rus1.hourly)} in Rest of U.S.`,
  body: (h) => `
<h2>Where table 001M fades out</h2>
<p>OPM's ${h.src('opm_001m', 'special rate table 001M')} lists GS-4 rates for steps 1 to ${covered} only. Above that, the locality rate of every area is already higher, so a special rate would serve no purpose. Even within the covered steps the reach shrinks quickly. Counting the 58 locality areas where 001M pays more than locality, the number goes ${counts.map((c, i) => `${c} at step ${i + 1}`).join(', ')}. At step ${covered}, Rest of U.S. is the only area left: ${K.usd(rus5.annual)} from 001M against a locality rate of ${K.usd(rus5.locality)}, a difference of ${K.usd(rus5.annual - rus5.locality)}.</p>
<p>The practical effect is small but real. A GS-4 at step 1 in Atlanta earns ${K.usd(atl1.annual)} because Atlanta's ${K.dec(K.area('ATL').pct, 2)} % locality percentage already beats the special table. The same employee in an area with a low percentage, such as Rest of U.S. or a smaller metro, is paid the national ${K.usd(sp[0])}. Once you are past step ${covered}, every GS-4 is on the regular locality table of their area, like the grades above.</p>
<h2>Steps 1 to 10 in Rest of U.S.</h2>
<p>Because table 001M props up the lower steps, the first within-grade increases in Rest of U.S. follow the 001M spacing of ${K.usd(sp[1] - sp[0])} a year. Step ${covered} to step ${covered + 1} is different: you leave 001M at ${K.usd(rus5.annual)} and land on the locality rate of ${K.usd(rus6.annual)}, a gain of ${K.usd(rus6.annual - rus5.annual)}. From there each step adds ${K.usd(K.pay(g, 7, 'RUS').annual - rus6.annual)} or so. Steps 5 to 7 come after 104 weeks each and steps 8 to 10 after 156 weeks, so most GS-4 employees who stay in the grade spend many years on the upper, locality-paid steps.</p>
<h2>What the move to GS-5 pays</h2>
<p>GS-5 is the grade most GS-4 employees aim for, since it opens the two-grade ladders of many administrative and technical careers. Under the two-step rule of 5 CFR 531.214, a GS-4 step 3 in Rest of U.S. earning ${K.usd(up.from.annual)} is placed at GS-5 step ${up.to.step}, ${K.usd(up.to.annual)}, a raise of ${K.usd(up.raise)} or ${K.pct(up.raisePct, 1)}. In Washington, a GS-4 step 6 goes from ${K.usd(upDc.from.annual)} to GS-5 step ${upDc.to.step} at ${K.usd(upDc.to.annual)}. Your waiting period for the next step starts again on the promotion date.</p>
${h.mini('promo', { t: 'Your GS-4 step promoted to GS-5', p: ['s', 'a'], d: { g: '4', s: '3', ng: '5', a: 'RUS' } })}
<p>No 52-week time-in-grade wait applies to that move: the ${h.ext('https://www.ecfr.gov/current/title-5/chapter-I/subchapter-B/part-300/subpart-F', 'time-in-grade regulation')} lets agencies advance employees to any grade up to GS-5 as long as it is no more than two grades above the lowest grade held in the past 52 weeks. You still need to meet the GS-5 qualification standard, often one year of experience at the GS-4 level or a bachelor's degree. The ${h.a('gs-5', 'GS-5 page')} picks up from there.</p>
<h2>Overtime at GS-4</h2>
<p>Overtime is time and a half of your hourly rate at every GS-4 step: ${K.usd2(rus1.overtime)} at step 1 and ${K.usd2(rus10.overtime)} at step 10 in Rest of U.S. Even GS-4 step 10 in ${K.area('SF').short}, ${K.usd2(K.pay(g, 10, 'SF').hourly)} an hour, stays below that area's GS-10 step 1 rate of ${K.usd2(K.pay(10, 1, 'SF').hourly)}, so the overtime cap never applies.</p>
`,
  faqs: [
    { q: 'Does special table 001M cover GS-4 step 6?', a: `No. Table 001M lists GS-4 rates only for steps 1 to ${covered}. From step ${covered + 1} the locality rate is higher in every area, so the regular locality table applies: GS-4 step ${covered + 1} pays ${K.usd(rus6.annual)} in Rest of U.S. and ${K.usd(K.pay(g, 6, 'DCB').annual)} in Washington in ${K.P.year}.` },
    { q: 'How much more does GS-5 pay than GS-4?', a: `It depends on your step. Under the two-step promotion rule, a GS-4 step 3 in Rest of U.S. moves from ${K.usd(up.from.annual)} to ${K.usd(up.to.annual)} at GS-5 step ${up.to.step}, a raise of ${K.usd(up.raise)}. Step 1 to step 1, the gap is ${K.usd(K.pay(5, 1, 'RUS').annual - rus1.annual)} a year in Rest of U.S. Your locality area and current step change the result.` },
    { q: 'What does a GS-4 make an hour in 2026?', a: `${K.usd2(rus1.hourly)} at step 1 and ${K.usd2(rus10.hourly)} at step 10 in Rest of U.S., the annual rate divided by 2,087 hours. In Washington, step 1 is ${K.usd2(dc1.hourly)} an hour. Overtime is paid at time and a half at every step, before taxes and deductions.` },
  ],
  related: ['gs-3', 'gs-5', 'gs-special-rates', 'gs-promotion-calculator', 'gs-step-increase', 'gs-pay-scale-2026'],
});
