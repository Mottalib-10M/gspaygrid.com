import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const ex = P.ssa.earningsTest.exempt2026;
const ex27 = P.ssa.earningsTest.exempt2027;
const next = ex27 ? `${K.usd(ex27)} for 2027` : 'the 2027 amount, which we will add once SSA confirms it';
// The supplement used in the examples: $1,900 SSA estimate, 30 FERS years
const s0 = K.supplement(1900, 30, 0);
const s40 = K.supplement(1900, 30, 40000);
const s30 = K.supplement(1900, 30, 30000);
const s60 = K.supplement(1900, 30, 60000);
const cut40Month = s40.cut / 12;

export default defineGuide({
  id: 'fers-supplement-earnings-test', group: 'fers', order: 4, slug: 'fers-supplement-earnings-test',
  nav: 'Supplement earnings test', card: `$1 withheld for every $2 of wages above ${K.usd(ex)} in 2026, from July of the next year.`,
  title: 'FERS Supplement Earnings Test 2026: Limit, Timing, Cuts',
  description: `FERS supplement earnings test 2026: $1 withheld for every $2 of wages above ${K.usd(ex)}, applied from July of the next year. What counts, who is exempt, examples.`,
  h1: 'FERS supplement earnings test 2026: how a job after retirement cuts the supplement',
  intro: 'Working after you retire does not touch your FERS annuity, but it can shrink or erase the supplement. Enter your monthly supplement and the wages you expect.',
  resume: `Under 5 U.S.C. 8421a, the FERS supplement is reduced by half of your earnings above the Social Security exempt amount, which is ${K.usd(ex)} for ${P.year}. Only wages and net self-employment income count; the annuity, TSP withdrawals, interest and dividends do not. The reduction is based on the previous calendar year: the excess earned in ${P.year} is spread over the twelve months that begin in July ${P.year + 1}, never more than the supplement itself. With a ${K.usd(s0.monthly)} monthly supplement, ${K.usd(s0.yearly)} a year, wages of ${K.usd(40000)} cost ${K.usd(s40.cut)}, leaving ${K.usd(s40.after)}; at ${K.usd(s0.zeroAt)} of wages nothing is left. Earnings from the part of the year before you retired are not counted. Law enforcement officers, firefighters and air traffic controllers retired under the special provisions are exempt for earnings before their MRA. For 2027, our data does not yet hold the exempt amount: the page will use ${next}. The basic annuity is never reduced, whatever you earn.`,
  tool: 'earnings',
  toolArg: { sup: s0.monthly, earn: 40000 },
  faqs: [
    { q: 'What is the FERS supplement earnings limit for 2026?', a: `It is ${K.usd(ex)}, the same exempt amount Social Security uses for beneficiaries under full retirement age. Earnings above it cost $1 of supplement for every $2. Earning ${K.usd(30000)} in ${P.year} would remove ${K.usd(s30.cut)} from a ${K.usd(s0.yearly)} supplement, withheld from the payments of July ${P.year + 1} to June ${P.year + 2}.` },
    { q: 'Do TSP withdrawals reduce the FERS supplement?', a: 'No. The test looks only at wages and net earnings from self-employment, as defined for the Social Security earnings test. TSP withdrawals, your FERS annuity, other pensions, interest, dividends and capital gains are not earnings for this purpose. A retiree who lives on the annuity and the TSP keeps the full supplement whatever the size of the withdrawals.' },
    { q: 'When does OPM reduce the supplement for my earnings?', a: `The law charges the excess to the twelve months that begin on the first day of the seventh month after the year ends. Wages earned in ${P.year} therefore reduce the supplement from July ${P.year + 1} to June ${P.year + 2}. Until then, those wages do not lower the supplement. A job that ends in a given year still affects the payments of the following year and a half.` },
    { q: 'Are law enforcement retirees exempt from the FERS earnings test?', a: 'Partly. Section 8421a does not count earnings for a period before the minimum retirement age of someone who retired under the special provisions for law enforcement officers, firefighters or air traffic controllers. A retired officer who leaves at 50 can work freely until the MRA; from then on the test applies like for any other retiree, until the supplement ends at 62.' },
    { q: 'What is the 2027 earnings limit for the FERS supplement?', a: `SSA sets the 2027 exempt amount in its annual determinations. Our data does not hold a confirmed 2027 figure yet, so this page and the calculator still use the ${P.year} amount of ${K.usd(ex)}. We will update both when the 2027 figure is confirmed. Because the test looks at the prior year, 2027 wages reduce supplements only from July 2028.` },
  ],
  body: (h) => `
<h2>The rule in one sentence</h2>
<p>${h.src('usc_8421a', 'Section 8421a')} takes the earnings test that Social Security applies to people who claim benefits before full retirement age and applies it to the FERS supplement: for each year, half of your earnings above the exempt amount is withheld from the supplement. The basic annuity is never touched. For ${P.year} the exempt amount is ${K.usd(ex)}, set by ${h.src('fr_ssa_2026', "SSA's 2026 determinations")}. The supplement itself, how it is computed and who receives it, is explained on the ${h.a('fers-supplement', 'FERS supplement page')}.</p>
${h.mini('earnings', { t: 'Test a salary against your supplement', p: ['sup', 'earn'], d: { sup: s0.monthly, earn: 40000 } })}
<h2>What counts as earnings</h2>
<p>The statute says earnings and the exempt amount are determined as under section 203 of the Social Security Act. That means gross wages for work done during the year, before tax and insurance deductions, plus net earnings from self-employment, which is gross business income minus allowable business expenses, minus any net loss. A consulting business, a contract job with an agency contractor, a part-time position in a store and a seasonal job all count. Income that is not pay for work does not: your FERS annuity, TSP withdrawals, other pensions, interest, dividends and capital gains. A large TSP distribution in the year you leave does not touch the supplement.</p>
<h2>Which year counts, and when the cut arrives</h2>
<p>The test is backward-looking. The reduction for a year is computed from the earnings of the year before, and it is charged to the twelve months that start on the first day of the seventh month after that year. Earnings of ${P.year} are therefore charged from July ${P.year + 1} through June ${P.year + 2}. The yearly excess is divided evenly among the months you are entitled to the supplement in that period, and no month can lose more than its own supplement. The total cut can never be larger than the supplement you were paid for the year of the earnings.</p>
<p>Only earnings for the part of the year when you were entitled to the supplement count. If you retire on June 30, your salary from January to June is not used, even though it is far above ${K.usd(ex)}.</p>
<h2>Example: a new job the year after you retire</h2>
<p>Take a retiree with 30 years of FERS service and a ${K.usd(1900)} Social Security estimate at 62. The supplement is ${K.usd(s0.monthly)} a month, ${K.usd(s0.yearly)} a year. In ${P.year} the retiree takes a job paying ${K.usd(40000)}. The excess over ${K.usd(ex)} is ${K.usd(40000 - ex)}; half of it, ${K.usd(s40.cut)}, is the reduction. It is spread over July ${P.year + 1} to June ${P.year + 2}: about ${K.usd(cut40Month)} less each month, so roughly ${K.usd(s0.monthly - cut40Month)} paid instead of ${K.usd(s0.monthly)}. The annuity is paid in full.</p>
${h.table(['Wages in ' + P.year, 'Withheld over 12 months', 'Supplement kept per year', 'Per month'], [0, 20000, 30000, 40000, 50000, 60000].map((w) => { const x = K.supplement(1900, 30, w); return [K.usd(w), K.usd(x.cut), K.usd(x.after), K.usd(x.afterMonthly)]; }), `A ${K.usd(s0.yearly)} supplement ($1,900 SSA estimate, 30 FERS years) under the ${P.year} exempt amount of ${K.usd(ex)}.`, ['r', 'r', 'r', 'r'])}
<p>At ${K.usd(60000)}, the cut is ${K.usd(s60.cut)} and the retiree keeps ${K.usd(s60.after)} of supplement. The break point where the supplement disappears is ${K.usd(s0.zeroAt)}: the exempt amount plus twice the yearly supplement. Anyone planning a second career should compare the new salary with that loss, and with what the job adds to their own future Social Security record, which the supplement does not.</p>
<h2>Special provisions: free until the MRA</h2>
<p>Retirees under the special provisions for law enforcement officers, firefighters and air traffic controllers can leave at 50 with 20 years, or at any age with 25, and start the supplement at once. For them, the law does not count earnings attributable to a period before the minimum retirement age. An officer born in 1975 who retires at 50 can work full time until the MRA of ${K.ym(K.mra(1975))} with no effect on the supplement. Earnings after the MRA count like anyone else's, and the reduction for them follows the usual July timing. See the ${h.a('fers-special-provisions', 'special provisions page')} for the rest of their rules, and the ${h.a('fers-minimum-retirement-age', 'MRA table')} for your own date.</p>
<h2>Early outs and the earnings test</h2>
<p>Someone who leaves under a voluntary early retirement offer before the MRA receives no supplement until the MRA. Since only earnings for periods of entitlement count, wages before that date play no role. From the MRA on, the normal test applies.</p>
<h2>The year you turn 62</h2>
<p>The supplement stops at the end of the month before your 62nd birthday. The law shortens the number of entitlement months for that year, so a reduction charged to the last year is spread over fewer months, still capped at each month's supplement. Earnings after the supplement has ended play no part in it. From 62 on, Social Security's own earnings test applies to your Social Security benefit if you claim it before full retirement age; that is a separate rule handled by SSA, not OPM.</p>
<h2>2027 and later</h2>
<p>The exempt amount usually changes every year, and SSA publishes it with its annual determinations; our data does not yet hold the 2027 amount, so the calculator uses ${K.usd(ex)} for every year until the figure is confirmed. That covers the cut you face in mid ${P.year + 1}: it is based on ${P.year} earnings and the ${P.year} exempt amount. Our ${h.a('method', 'method page')} lists the figures used and their dates.</p>
`,
  related: ['fers-supplement', 'fers-retirement-calculator', 'fers-special-provisions', 'fers-minimum-retirement-age', 'fers-early-retirement'],
  sources: ['usc_8421a', 'usc_8421', 'fr_ssa_2026', 'opm_fers_types'],
});
