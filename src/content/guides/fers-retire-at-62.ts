import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const BY = 1970, H3 = 100000, SS = 1900;
const F = K.P.fers;
const mra = K.mra(BY);
const r = (age: number, yrs: number) => K.fers({ birthYear: BY, retireAgeMonths: age * 12, serviceMonths: yrs * 12, high3: H3, ss62: SS });
const early = r(mra / 12, 30), late = r(62, 35);
const yrsBefore = (62 * 12 - mra) / 12;
const earlyCash = (early.gross + early.supplement) * yrsBefore;
const gap = late.gross - early.gross;
const breakEven = earlyCash / gap;
const at60 = r(60, 20), at62b = r(62, 22);
const cash60 = (at60.gross + at60.supplement) * 2, gap60 = at62b.gross - at60.gross;
const y19 = r(62, 19), y20 = r(62, 20);

export default defineGuide({
  id: 'fers-retire-at-62', group: 'fers', order: 14, slug: 'fers-retire-at-62',
  nav: 'Retire at 62', card: `${K.pct(F.regular.enhanced, 1)} a year of service at 62 with 20 years; no supplement, COLA from the start.`,
  title: 'Retire at 62 Under FERS in 2026: 1.1 % Rule vs the MRA Exit',
  description: `Retire at 62 under FERS in 2026: ${K.pct(F.regular.enhanced, 1)} per year with 20 years, COLAs from the first year, no supplement. Leaving at the MRA vs waiting, with worked numbers.`,
  h1: 'Retiring at 62 under FERS in 2026: the 1.1 % multiplier against leaving at the MRA',
  intro: 'Age 62 is the point where FERS pays its best multiplier and the age limit on COLAs ends. Set the age you leave to 62 in the calculator, then compare with your MRA.',
  resume: `If you separate at 62 or later with at least 20 years of service, your FERS annuity uses ${K.pct(F.regular.enhanced, 1)} of the high-3 for each year instead of 1 %, a 10 % larger pension for life. With 5 to 19 years at 62, you still get an immediate unreduced annuity, at 1 %. There is no FERS supplement at 62, since it exists only to bridge the years before Social Security, and the annuity receives the diet COLA from the first December, prorated for the first year. Take an employee born in ${BY} with a ${K.usd(H3)} high-3: leaving at the MRA of ${K.ym(mra)} with 30 years pays ${K.usd(early.gross)} a year plus a ${K.usd(early.supplement / 12)} monthly supplement; working to 62 with 35 years pays ${K.usd(late.gross)}. The five years of early income, about ${K.usd(earlyCash)}, take the larger annuity roughly ${K.dec(breakEven, 0)} years to make up, before counting the salary, TSP contributions and Social Security credits earned by staying.`,
  tool: 'fers',
  toolArg: { by: String(BY), ra: 62, sy: 35, h3: H3, ss: SS, sv: 'none' },
  faqs: [
    { q: 'Do I need 20 years to get the 1.1 % FERS multiplier at 62?', a: `Yes. Section 8415(i) requires, at the time of separation, age 62 or more and at least 20 years of service. With 19 years and a ${K.usd(H3)} high-3 the annuity at 62 is ${K.usd(y19.gross)} a year; with 20 years it jumps to ${K.usd(y20.gross)}. Unused sick leave does not help reach the 20 years, though it is added in the computation once you qualify.` },
    { q: 'Do I get the FERS supplement if I retire at 62?', a: 'No. The supplement is paid only until the end of the month before your 62nd birthday, so a retirement that starts at 62 never carries it. At that age you can claim Social Security directly, or wait for a larger benefit, independently of the FERS annuity. The supplement exists only to fill the gap before Social Security becomes available.' },
    { q: 'Does it matter if I retire a month before turning 62?', a: `It does. The 1.1 % rate looks at your age on the day you separate. Leaving one month before 62 with 35 years means the 1 % rate, about ${K.usd(late.gross - early.gross * 35 / 30)} a year less than at 62 in the example on this page, and a small supplement for a single month. Check your birthday against the end of the pay period before choosing the date.` },
    { q: 'Is it better to retire at 60 with 20 years or wait until 62?', a: `At 60 with 20 years you get an unreduced annuity, ${K.usd(at60.gross)} a year with a ${K.usd(H3)} high-3, plus a supplement of ${K.usd(at60.supplement / 12)} a month for two years. Waiting to 62 with 22 years gives ${K.usd(at62b.gross)} for life. The two early years pay about ${K.usd(cash60)}, which the extra ${K.usd(gap60)} a year takes around ${K.dec(cash60 / gap60, 0)} years to recover.` },
  ],
  body: (h) => `
<h2>What changes at 62</h2>
<p>Three rules switch at 62. The multiplier rises to ${K.pct(F.regular.enhanced, 1)} if you have 20 years of service, under ${h.src('usc_8415', 'section 8415(i)')}. The ban on COLAs before 62 in section 8462 no longer applies, so the ${h.a('fers-cola', 'FERS COLA')} is paid from the first December, prorated by the months on the roll. And the ${h.a('fers-supplement', 'FERS supplement')} is gone: it ends at 62 for everyone and is never paid to someone who retires at that age. Section ${h.src('usc_8412', '8412(a)')} gives an immediate annuity at 62 with just 5 years of service, so even a short federal career opens the door at this age, at 1 %.</p>
<p>The 1.1 % test uses your age on the date of separation and the service you have then. Unused sick leave counts in the computation but does not help reach 20 years. Someone at 62 with 19 years and a ${K.usd(H3)} high-3 receives ${K.usd(y19.gross)} a year; one more year makes it ${K.usd(y20.gross)}, because the higher rate then applies to every year, not only the twentieth.</p>
${h.mini('fers', { t: 'Your annuity if you leave at 62', p: ['ra', 'sy', 'h3'], d: { by: String(BY), ra: 62, sy: 35, h3: H3, ss: SS, sv: 'none' } })}
<h2>Leaving at the MRA or staying to 62</h2>
<p>Take an employee born in ${BY}, hired at 27, with a ${K.usd(H3)} high-3 that we keep flat for clarity. At the MRA of ${K.ym(mra)} the employee has 30 years and can leave with an immediate unreduced annuity and the supplement. At 62 the employee would have 35 years and the 1.1 % rate.</p>
${h.table(['', `Leave at the MRA (${K.ym(mra)})`, 'Leave at 62'], [
  ['Service', '30 years', '35 years'],
  ['Multiplier', K.pct(early.multiplier, 1), K.pct(late.multiplier, 1)],
  ['Annuity per year', K.usd(early.gross), K.usd(late.gross)],
  ['Supplement until 62', `${K.usd(early.supplement / 12)}/mo`, 'none'],
  [`Income from the MRA to 62`, K.usd(earlyCash), 'salary instead'],
  ['COLA', 'none before 62', 'from the first December'],
], `Born ${BY}, ${K.usd(SS)} Social Security estimate at 62, no sick leave and no survivor election.`, ['l', 'r', 'r'])}
<p>The early path brings ${K.usd(earlyCash)} of annuity and supplement over the ${K.dec(yrsBefore, 0)} years before 62, with no COLA on either. From 62, the late path pays ${K.usd(gap)} a year more, for life. Dividing one by the other, the larger annuity needs about ${K.dec(breakEven, 0)} years after 62 to catch up, so the employee would have to live to about ${K.dec(62 + breakEven, 0)} for staying to win on the pension alone. Both annuities receive the same COLAs from 62, so inflation does not change that ratio much.</p>
<h2>What the pension comparison leaves out</h2>
<p>The break-even above treats the five extra years of work as if they paid nothing, which is never true. Over those years the employee keeps a full salary, and the TSP keeps receiving the agency's automatic 1 % and its matching on the first 5 % you contribute. The ${h.a('high-3-salary', 'high-3')} usually rises with pay raises and step increases, which lifts the annuity above our flat example. Social Security credits keep accruing too. Against that, the early retiree has five years of free time and can take another job; wages above the exempt amount reduce the supplement under the ${h.a('fers-supplement-earnings-test', 'earnings test')}.</p>
<p>Health cover matters on both paths. An immediate annuity at the MRA or at 62 lets you keep FEHB if you were enrolled for the five years before retiring, so the choice of age does not change that.</p>
<h2>The 60 with 20 case</h2>
<p>An employee who reaches 60 with 20 years has another option: an immediate unreduced annuity with the supplement. With a ${K.usd(H3)} high-3, that is ${K.usd(at60.gross)} a year and ${K.usd(at60.supplement / 12)} a month of supplement for two years. Waiting to 62 with 22 years gives ${K.usd(at62b.gross)}, because the extra two years and the higher rate stack. The two early years pay about ${K.usd(cash60)}; the gap of ${K.usd(gap60)} a year takes around ${K.dec(cash60 / gap60, 0)} years to recover. Here the 1.1 % rule is worth more in relative terms, because the career is shorter and two years of work add 10 % of service on top of the 10 % from the rate.</p>
<h2>If you would leave under MRA+10</h2>
<p>For a worker who leaves at the MRA with 10 to 29 years, 62 matters in a different way. An ${h.a('fers-mra-10', 'MRA+10 annuity')} taken before 62 is cut by 5 % a year, unless postponed to 60 with 20 years or to 62. Waiting to 62 to start the annuity removes the reduction, but does not bring the 1.1 % rate, which needs a separation at 62 or later with 20 years. The ${h.a('fers-retirement-calculator', 'FERS retirement calculator')} shows both effects when you change the separation age and the start age.</p>
<h2>Picking the date</h2>
<p>Write down your MRA, the day you reach 20 years if it falls near 62, and your 62nd birthday. If you are a few months from 20 years at 62, those months are worth 10 % of the annuity for life. If you already have 30 years at the MRA, the question is how much you value the years between the MRA and 62 against a pension about ${K.pct(gap / early.gross, 0)} larger afterward. Ask OPM or your agency for an estimate on both dates before you file.</p>
`,
  related: ['fers-retirement-calculator', 'fers-supplement', 'fers-minimum-retirement-age', 'fers-cola', 'high-3-salary'],
  sources: ['usc_8412', 'usc_8415', 'usc_8421', 'usc_8462', 'opm_fers_computation', 'opm_fehb_annuitants'],
});
