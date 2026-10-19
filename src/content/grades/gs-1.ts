import { defineGrade } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const g = 1;
const rus1 = K.pay(g, 1, 'RUS'), rus10 = K.pay(g, 10, 'RUS'), sf1 = K.pay(g, 1, 'SF'), ny5 = K.pay(g, 5, 'NY');
const sp = K.P.pay.special001M.rates[0] as number[];
const base = K.GS.base[0];
const gaps = base.slice(1).map((x, i) => x - base[i]);
const minGap = Math.min(...gaps), minAt = gaps.indexOf(minGap) + 2;
const spStep = sp[1] - sp[0];
// cells of GS-1 paid at the locality rate instead of table 001M, all areas and steps
const exceptions = K.AREAS.flatMap((a) => Array.from({ length: 10 }, (_, i) => i + 1).filter((s) => !K.pay(g, s, a.code).usesSpecial).map((s) => ({ a, s })));
const ex = exceptions[0];
const gs2gap = K.pay(2, 1, 'RUS').annual - rus1.annual;
const gs3gap = K.pay(3, 1, 'RUS').annual - rus1.annual;

export default defineGrade({
  grade: g,
  title: 'GS-1 Pay Scale 2026: Special Rate Salary, Steps and Hourly',
  description: `GS-1 pay 2026: ${K.usd(rus1.annual)} at step 1 and ${K.usd(rus10.annual)} at step 10, the same in nearly every locality area under special table 001M. Hourly rates, overtime and steps.`,
  intro: 'The lowest grade of the General Schedule, and the one where locality matters least. Choose a county to confirm your rate.',
  resume: `GS-1 is the first grade of the General Schedule and very few federal positions are classified there. Its pay in ${K.P.year} works differently from the grades above it. The base table gives ${K.usd(rus1.base)} at step 1, and even the ${K.dec(K.area('RUS').pct, 2)} % Rest of U.S. locality payment only lifts that to ${K.usd(rus1.locality)}. Special rate table 001M, which OPM sets nationwide for GS-1 to GS-4, pays more: ${K.usd(sp[0])} at step 1 and ${K.usd(sp[9])} at step 10. Because 001M is higher than the locality rate almost everywhere, a GS-1 step 1 earns ${K.usd(rus1.annual)} in Rest of U.S., ${K.usd(K.pay(g, 1, 'DCB').annual)} in Washington and ${K.usd(sf1.annual)} in ${K.area('SF').short}, the highest locality area. Hourly pay at step 1 is ${K.usd2(rus1.hourly)}, overtime is ${K.usd2(rus1.overtime)} an hour, and each step adds ${K.usd(spStep)} a year. Those figures include the ${K.dec(K.RAISE, 1)} % raise of ${K.P.year}.`,
  body: (h) => `
<h2>One national rate instead of 58 local ones</h2>
<p>At every other grade, your locality area decides your pay: the same GS-9 step 1 is worth thousands of dollars more in New York than in a rural county. GS-1 is the exception. The locality percentages run from ${K.dec(K.P.pay.localityRange[0], 2)} % to ${K.dec(K.P.pay.localityRange[1], 2)} %, but the GS-1 base rates are so low that ${h.src('opm_001m', 'special rate table 001M')} beats the locality rate in ${exceptions.length ? 'all but ' + exceptions.length + ' of the 580 GS-1 cells' : 'all 580 GS-1 cells'} across the 58 areas. ${ex ? `The exception is step ${ex.s} in ${ex.a.short}, where the locality rate of ${K.usd(K.pay(g, ex.s, ex.a.code).annual)} is higher than the 001M rate of ${K.usd(sp[ex.s - 1])}.` : ''} In practice, a GS-1 is paid the same salary in Boston, Omaha or Honolulu.</p>
<p>The table in all 58 areas below this text shows it: the same three figures repeat line after line. Your official worksite still matters for the record on your SF-50, and it matters as soon as you move to a grade where locality pay takes over, but it does not change a GS-1 paycheck. The ${h.a('gs-special-rates', 'special rates page')} explains how OPM builds these tables and why they exist for the lowest grades.</p>
<h2>An uneven base table that nobody is paid</h2>
<p>The GS-1 base table has a quirk. Steps are normally spaced by a fixed amount, but GS-1 is not: the gaps run from about ${K.usd(Math.max(...gaps))} down to ${K.usd(minGap)}, the smallest one between step ${minAt - 1} and step ${minAt} (${K.usd(base[minAt - 2])} to ${K.usd(base[minAt - 1])}). Table 001M does not follow that pattern, with an even ${K.usd(spStep)} a year between each step, so the odd spacing has no effect on what you are paid.</p>
<h2>Hourly pay and overtime</h2>
<p>At a grade this low, the hourly rate is often the figure people compare with jobs outside government. OPM divides the annual rate by 2,087 hours: ${K.usd2(rus1.hourly)} at step 1, ${K.usd2(rus10.hourly)} at step 10. A full biweekly pay period of 80 hours at step 1 is ${K.usd2(rus1.biweekly)} gross. Overtime is time and a half at every step, because GS-1 sits far below the GS-10 step 1 rate that limits overtime for FLSA-exempt employees. In New York, GS-1 step 5 pays ${K.usd(ny5.annual)}, the 001M rate, and ${K.usd2(ny5.overtime)} for an overtime hour, exactly what it pays in Rest of U.S.</p>
${h.mini('hourly', { t: 'GS-1 hourly and overtime for one pay period', p: ['s', 'ot'], d: { g: '1', s: '1', a: 'RUS', ot: 8 } })}
<h2>Who is hired at GS-1</h2>
<p>Positions at this grade cover simple tasks done under close supervision. For most clerical and assistant series, ${h.src('opm_qual_gs', 'OPM qualification standards')} ask for little or nothing in education or experience at GS-1, and a high school diploma is enough for GS-2. That makes GS-1 a door for a first job, not a career: employees usually move to GS-2 or GS-3 as soon as the work allows. Advancement up to GS-5 has no 52-week waiting period under the ${h.ext('https://www.ecfr.gov/current/title-5/chapter-I/subchapter-B/part-300/subpart-F', 'time-in-grade rules of 5 CFR part 300')}, as long as the new grade is no more than two grades above the lowest grade held in the previous 52 weeks.</p>
<p>A move up pays less than you might expect, because table 001M compresses the low grades: GS-2 step 1 pays ${K.usd(gs2gap)} more than GS-1 step 1, and GS-3 step 1 pays ${K.usd(gs3gap)} more. See the ${h.a('gs-2', 'GS-2 page')} for the next rung.</p>
`,
  faqs: [
    { q: 'Is GS-1 pay the same in every city?', a: `Almost. Table 001M pays ${K.usd(sp[0])} at step 1 wherever it is higher than the locality rate, and for GS-1 that is the case in every one of the 58 locality areas, ${K.area('SF').short} included. ${ex ? `The only cell where local pay wins is step ${ex.s} in ${ex.a.short}.` : 'No cell pays a higher local rate.'} So moving to a high-cost area does not raise a GS-1 salary.` },
    { q: 'What is the GS-1 hourly rate in 2026?', a: `${K.usd2(rus1.hourly)} at step 1 and ${K.usd2(rus10.hourly)} at step 10, the annual 001M rate divided by 2,087 hours. Overtime is time and a half, ${K.usd2(rus1.overtime)} an hour at step 1. The biweekly gross for 80 hours at step 1 is ${K.usd2(rus1.biweekly)}, before taxes and deductions.` },
    { q: 'Why does the GS-1 base pay table skip unevenly between steps?', a: `The base table is not built on one fixed step amount at GS-1: some gaps are about ${K.usd(Math.max(...gaps))} and one is only ${K.usd(minGap)}. It rarely matters: GS-1 employees in the United States are paid from table 001M, whose steps are an even ${K.usd(spStep)} apart.` },
  ],
  related: ['gs-2', 'gs-3', 'gs-special-rates', 'gs-hourly-pay', 'gs-pay-scale-2026', 'area:rest-of-us'],
});
