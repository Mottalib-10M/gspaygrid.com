import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const ex = P.ssa.earningsTest.exempt2026;
const base = K.supplement(1900, 30, 0);
const working = K.supplement(1900, 30, 45000);
const short = K.supplement(1900, 22, 0);
const est = K.ss62(95000, 32);

export default defineGuide({
  id: 'fers-supplement', group: 'fers', order: 3, slug: 'fers-supplement',
  nav: 'FERS supplement', card: `Social Security at 62 x FERS years / 40, until 62; reduced above ${K.usd(ex)} of wages.`,
  title: 'FERS Supplement 2026: Amount, Who Gets It, Earnings Test',
  description: `FERS supplement 2026: your Social Security at 62 times FERS years over 40, paid to 62, cut $1 for every $2 earned above ${K.usd(ex)}. Calculator and rules.`,
  h1: 'FERS supplement 2026: how much, who qualifies, and the earnings test',
  intro: 'The supplement bridges the gap between leaving federal service at your MRA and claiming Social Security at 62. Type your SSA estimate and your years.',
  resume: `The FERS supplement pays a retiree who leaves before 62 roughly the share of Social Security earned in federal service: your estimated Social Security benefit at 62, times your years of FERS civilian service, divided by 40. With a ${K.usd(1900)} SSA estimate and 30 years, that is ${K.usd(base.monthly)} a month, ${K.usd(base.yearly)} a year, on top of the annuity, until the month you turn 62. Only immediate unreduced retirements qualify: the MRA with 30 years, age 60 with 20 years, the special provisions for law enforcement officers, firefighters and air traffic controllers, and early-out retirements once the MRA is reached. An MRA+10 retirement gets nothing. The supplement is also subject to the Social Security earnings test: in 2026, $1 is withheld for every $2 of wages or self-employment income above ${K.usd(ex)}, and the reduction is based on the previous year's earnings. It receives no cost-of-living adjustment. The 2025 budget law (P.L. 119-21) left it untouched.`,
  tool: 'supplement',
  toolArg: { ss: 1900, fy: 30, earn: 0 },
  faqs: [
    { q: 'Do I get the FERS supplement if I retire under MRA+10?', a: `No. Section 8421 pays the supplement only to immediate retirements under 5 U.S.C. 8412(a), (b), (d) or (e) and to early-out retirements under section 8414(b)(1)(B) once the MRA is reached. An MRA+10 annuity, even postponed, never carries it. That is one reason why reaching 30 years at the MRA, or 20 years at 60, is worth ${K.usd(base.yearly)} a year in the example on this page.` },
    { q: 'Is the FERS supplement reduced if I take a job after retiring?', a: `Yes, if you earn more than the Social Security exempt amount, ${K.usd(ex)} in 2026. OPM withholds $1 of supplement for every $2 above it, using the earnings of the previous calendar year that you report each spring. Pension income, TSP withdrawals and investment income do not count; wages and net self-employment income do. Earning ${K.usd(45000)} would cut a ${K.usd(base.yearly)} supplement to ${K.usd(working.after)}.` },
    { q: 'Does the FERS supplement get a COLA?', a: `No. The supplement stays at the amount computed when it starts until it stops at 62. Your basic annuity also receives no COLA before 62 on a regular retirement. At 62 the supplement ends and you claim Social Security, or postpone it; the supplement does not continue until you actually file with SSA.` },
    { q: 'How does OPM count my years for the FERS supplement?', a: `It uses your years of FERS civilian service, rounded to the nearest whole year, and leaves out military service, even if you bought it back, and unused sick leave. With 22 years the fraction is 22/40, so the same ${K.usd(1900)} estimate gives ${K.usd(short.monthly)} a month instead of ${K.usd(base.monthly)}.` },
    { q: 'Was the FERS supplement eliminated by the 2025 budget bill?', a: 'No. A House draft of 2025 proposed ending it for most new retirees, but the final One Big Beautiful Bill Act, Public Law 119-21 of July 4, 2025, contains no change to 5 U.S.C. 8421 or to FERS contributions. Bills to repeal it still come back regularly, so the rule as written in 2026 is the rule as of October 2026.' },
  ],
  body: (h) => `
<h2>The formula, step by step</h2>
<p>OPM computes the supplement when your annuity starts. First it estimates the Social Security benefit you would receive at 62 on your federal earnings alone, using SSA's formula and the maximum reduction for claiming at 62 for someone born in your year: 30 % for anyone with a full retirement age of 67. Then it multiplies that monthly figure by your FERS civilian years, rounded to the nearest year, over 40. The result is paid monthly with the annuity and stops at the end of the month before your 62nd birthday.</p>
<p>The SSA estimate on your own statement includes private-sector earnings, so OPM's figure is often lower than the one you see on ssa.gov. If your whole career was federal, the two are close. If you worked ten years in the private sector first, OPM's estimate will be smaller, and the supplement with it. Type the figure from your statement in the calculator above to see the upper bound, then a lower one to see the range.</p>
${h.table(['FERS years', 'Fraction', `Supplement with a ${K.usd(1900)} estimate`, 'Per year'], [20, 25, 30, 35].map((y) => [String(y), `${y}/40`, `${K.usd(K.supplement(1900, y, 0).monthly)}/mo`, K.usd(K.supplement(1900, y, 0).yearly)]), 'The supplement before the earnings test. Years are FERS civilian years only.', ['l', 'r', 'r', 'r'])}
<h2>If you do not know your Social Security estimate</h2>
<p>When the field is left at zero on the ${h.a('fers-retirement-calculator', 'FERS retirement calculator')}, we approximate it: average indexed monthly earnings from your salary and career length, the ${K.P.year} bend points of ${K.usd(P.ssa.bendPoints[0])} and ${K.usd(P.ssa.bendPoints[1])}, then the 70 % factor for claiming at 62. A ${K.usd(95000)} salary over 32 years gives about ${K.usd(est.at62)} a month at 62 in today's dollars. It is a rough figure: it ignores the wage indexing of each past year and any year of low pay, and it uses this year's bend points rather than those of the year you turn 62. The SSA statement, available with a my Social Security account, is always better.</p>
<h2>Who receives it, and who does not</h2>
<p>The supplement follows the type of retirement, not your age alone. It is paid with an immediate unreduced annuity at the MRA with 30 years, at 60 with 20 years, and under the special provisions for law enforcement officers, firefighters, air traffic controllers and the other covered groups, who can leave at 50 with 20 years or at any age with 25. Early retirement under a voluntary early retirement authority or a discontinued service retirement also qualifies, but the payments begin only when you reach your MRA: a 52-year-old who takes an early-out offer waits for the supplement until 57. Disability retirees, MRA+10 retirees and anyone who leaves at 62 or later never receive it.</p>
${h.mini('fers', { t: 'Does your retirement come with the supplement?', p: ['ra', 'sy'], d: { by: '1971', ra: 57, sy: 30, h3: 98000, ss: 1900 } })}
<h2>The earnings test in 2026</h2>
<p>The test is the one Social Security applies to beneficiaries under full retirement age. For ${K.P.year} the exempt amount is ${K.usd(ex)}. Above it, OPM withholds half of the excess from the supplement, never from the basic annuity. The count is on wages and net earnings from self-employment; the annuity itself, TSP withdrawals, rental income and dividends do not count. OPM sends a survey each year and applies the reduction from July of the following year, which is why a large final-year payout of annual leave or a new job taken in the autumn shows up in the supplement months later.</p>
${h.mini('earnings', { t: 'How much of your supplement survives a new job?', p: ['earn'], d: { sup: base.monthly, earn: 45000 } })}
<p>The test runs every year until 62. If you retire under the special provisions, earnings before your MRA are ignored; from the year after the MRA they count like everyone else's. A retiree who plans a second career should compare the job's salary with the supplement lost: at ${K.usd(base.zeroAt)} of wages the ${K.usd(base.yearly)} supplement in our example is gone entirely. The ${h.a('fers-supplement-earnings-test', 'earnings test page')} works through the timing with real dates.</p>
<h2>What it is worth over the years before 62</h2>
<p>For someone born in 1971 who leaves at the MRA of 57 with 30 years, the supplement runs for five years. At ${K.usd(base.yearly)} a year that is about ${K.usd(base.yearly * 5)} in total, with no COLA. This sum often decides the choice between leaving at the MRA and waiting: staying to 62 brings the 1.1 % multiplier and five more years of service, but gives up all five years of supplement and of annuity. The ${h.a('fers-retire-at-62', 'retire at 62 page')} puts both paths side by side.</p>
<h2>Proposals to end it</h2>
<p>Ending the supplement for new retirees has appeared in presidential budgets and in the House draft of the 2025 reconciliation bill. The text that became law on July 4, 2025 did not include it, and as of ${K.day(K.P.retrieved_at)} section 8421 still reads as it did. If a future law changes it, we will date the change on this page and in the calculator.</p>
`,
  related: ['fers-supplement-earnings-test', 'fers-retirement-calculator', 'fers-minimum-retirement-age', 'fers-early-retirement', 'fers-retire-at-62'],
  sources: ['usc_8421', 'usc_8421a', 'opm_fers_types', 'fr_ssa_2026', 'ssa_bend'],
});
