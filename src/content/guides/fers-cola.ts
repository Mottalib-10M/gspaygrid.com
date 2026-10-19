import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const C = K.P.fers.cola;
const ss26 = C.y2026.ss, fe26 = C.y2026.fers, ss27 = C.y2027.ss, fe27 = C.y2027.fers;
const reg = K.colaPath(36000, 57 * 12, 20, ss26);
const spc = K.colaPath(36000, 57 * 12, 20, ss26, 'special');
const at = (rows: typeof reg, age: number) => rows.find((r) => r.age === age) ?? rows[rows.length - 1];
const r62 = at(reg, 62), r67 = at(reg, 67), r77 = at(reg, 77), s62 = at(spc, 62), s77 = at(spc, 77);
const lost = 1 - r77.fers / r77.csrsLike;
const prorated = (months: number) => Math.round((fe27 * months) / 12 * 1000) / 1000;

export default defineGuide({
  id: 'fers-cola', group: 'fers', order: 9, slug: 'fers-cola',
  nav: 'FERS COLA', card: `The diet COLA: ${K.pct(fe26, 1)} for 2026, ${K.pct(fe27, 1)} expected for 2027, none before 62 on a regular annuity.`,
  title: 'FERS COLA 2026: Diet COLA Rules, Age 62 and the 2027 Rate',
  description: `FERS COLA 2026: ${K.pct(fe26, 1)} against ${K.pct(ss26, 1)} for Social Security, ${K.pct(fe27, 1)} due for 2027, no increase before 62 on a regular annuity. Formula, proration, calculator.`,
  h1: 'FERS COLA 2026: the diet COLA, the age 62 rule and the 2027 increase',
  intro: 'A FERS annuity is indexed to inflation, but not fully, and not before 62 for most retirees. Type your annuity and an inflation rate to see what is left after twenty years.',
  resume: `The FERS cost-of-living adjustment follows the CPI-W like Social Security, with a cap known as the diet COLA: when inflation is 2 % or less, the annuity rises by the full CPI; between 2 % and 3 %, it rises by 2 %; above 3 %, it rises by the CPI minus one point. For 2026, Social Security and CSRS got ${K.pct(ss26, 1)} and FERS annuities got ${K.pct(fe26, 1)}. For 2027, SSA announced ${K.pct(ss27, 1)} on ${K.day(C.y2027.announced)}, which gives FERS retirees ${K.pct(fe27, 1)} under the formula; OPM had not yet published its own letter. A regular retiree receives no COLA at all before 62, so a ${K.usd(36000)} annuity started at 57 is still ${K.usd(at(reg, 61).fers)} at 61 while prices keep rising. Law enforcement officers, firefighters and air traffic controllers retiring under the special provisions, disability annuitants and survivors get the adjustment at any age. The first COLA after retirement is prorated: one-twelfth for each month the annuity was paid. The FERS supplement never receives a COLA.`,
  tool: 'cola',
  toolArg: { ann: 36000, age: 57, cpi: Math.round(ss26 * 1000) / 10 },
  faqs: [
    { q: 'What is the FERS COLA for 2027?', a: `SSA announced a ${K.pct(ss27, 1)} Social Security increase on ${K.day(C.y2027.announced)}. Since that is above 3 %, the FERS formula subtracts one point, which gives ${K.pct(fe27, 1)} for FERS annuitants who qualify. It takes effect on December 1, 2026 and shows up in the payment of early January 2027. OPM confirms the rate in a benefits administration letter, which had not been published when this page was updated.` },
    { q: 'Why is the FERS COLA lower than the Social Security COLA?', a: `Section 8462 of title 5 caps it. Inflation of 2 % or less is passed through in full, inflation between 2 % and 3 % gives exactly 2 %, and anything above 3 % gives the CPI minus one point. Social Security has no such cap. In 2026 the gap was ${K.pct(ss26, 1)} against ${K.pct(fe26, 1)}; for 2027 it is ${K.pct(ss27, 1)} against ${K.pct(fe27, 1)}.` },
    { q: 'Do I get a COLA if I retire at 57 under FERS?', a: `Not on a regular retirement. The law blocks any COLA while you are under 62, so an annuity that starts at 57 stays flat for five years. Once you turn 62, you receive the full diet COLA each December, not a catch-up for the missed years. Retirees under the special provisions for law enforcement, firefighters and air traffic controllers are the main exception.` },
    { q: 'How is the first FERS COLA prorated after retirement?', a: `If your annuity has not been increased before, the first COLA equals one-twelfth of the rate for each month the annuity was payable before the increase, counting a partial month as a month and capped at twelve. An annuity first payable in June 2026 to a retiree who qualifies by age would get about ${K.pct(prorated(6), 1)} in place of the full ${K.pct(fe27, 1)} for 2027.` },
    { q: 'Does the FERS disability annuity get a cost-of-living increase before 62?', a: 'Yes. The age 62 rule in 5 U.S.C. 8462(c)(3) covers only annuities paid under sections 8412, 8413 and 8414, which are the regular, deferred and early retirements. Disability annuities and survivor annuities are outside it, so they receive the FERS COLA each year at any age, subject to the same diet formula and the same proration in the first year.' },
  ],
  body: (h) => `
<h2>The diet COLA formula</h2>
<p>Every year SSA compares the average CPI-W of July, August and September with the same quarter of the year of the last increase. The result, rounded to a tenth of a point, is the Social Security and CSRS COLA. FERS then applies its own scale, written in ${h.src('usc_8462', '5 U.S.C. 8462(b)')}. The increase takes effect on December 1 and is first paid with the benefit of early January.</p>
${h.table(['Inflation (CPI-W)', 'Social Security and CSRS', 'FERS annuity'], [0.015, 0.02, 0.025, ss26, 0.03, ss27, 0.05].map((c) => [K.pct(c, 1), K.pct(c, 1), K.pct(K.cola(c), 1)]), 'The FERS rate for a few inflation levels. The band between 2 % and 3 % always gives 2 %.', ['l', 'r', 'r'])}
<p>The cut is zero in a low-inflation year and never more than one point. The loss comes from repetition: a retiree who lives thirty years in retirement absorbs that gap every year it applies. In any year above 3 % the gap is exactly one point; in a year at 2.5 %, it is half a point.</p>
<h2>2026 and 2027 in numbers</h2>
<p>For the increase paid from January 2026, SSA set ${K.pct(ss26, 1)}, which sits in the band between 2 % and 3 %, so FERS annuitants received ${K.pct(fe26, 1)}. OPM's ${h.src('opm_annuity_payments', 'annuity payments page')} states the ${K.pct(fe26, 1)} for FERS and FERS special annuitants on the roll for at least a year. For 2027, the ${h.src('ssa_cola_2027', 'SSA release of October 14, 2026')} gives ${K.pct(ss27, 1)}. That is above 3 %, so the FERS rate is ${K.pct(ss27, 1)} minus one point: ${K.pct(fe27, 1)}. The figure follows directly from the statute; OPM's own benefits administration letter for 2027 had not been posted when we last checked, and the rate shown here should be read as the result of the formula until it is.</p>
<h2>No COLA before 62 on a regular retirement</h2>
<p>Section 8462(c)(3) withholds the adjustment from any annuitant under 62 who retired under sections 8412, 8413 or 8414. That covers the immediate retirement at the MRA with 30 years or at 60 with 20 years, the reduced ${h.a('fers-mra-10', 'MRA+10 retirement')}, the deferred annuity and the ${h.a('fers-early-retirement', 'early-out retirement')}. The first increase arrives in the December after your 62nd birthday. Nothing is paid back for the years before.</p>
<p>The exceptions are written in the same paragraph. Retirees under section 8412(d)(1) or (e), which are the ${h.a('fers-special-provisions', 'special provisions')} for law enforcement officers, firefighters, Capitol and Supreme Court Police, nuclear materials couriers, customs and border protection officers and air traffic controllers, receive the COLA from the first year. Disability annuities and survivor annuities sit outside the three sections covered, so the age limit does not apply to them either.</p>
${h.mini('cola', { t: 'Your annuity after twenty years of diet COLAs', p: ['ann', 'age', 'cpi'], d: { ann: 36000, age: 57, cpi: 2.8 } })}
<h2>What a $36,000 annuity is worth after 20 years</h2>
<p>Take a regular retiree who starts a ${K.usd(36000)} annuity at 57 and assume prices rise ${K.pct(ss26, 1)} every year, the 2026 rate. From 57 to 61 the annuity does not move. At 62 it is ${K.usd(r62.fers)}, at 67 ${K.usd(r67.fers)} and at 77 ${K.usd(r77.fers)}. An annuity indexed to the full CPI from the first day would be ${K.usd(r77.csrsLike)} at 77. The FERS retiree has lost about ${K.pct(lost, 0)} of purchasing power in twenty years, a share that keeps growing as long as inflation stays above 2 %.</p>
${h.table(['Age', 'Regular FERS', 'Special provisions', 'Full CPI'], [57, 62, 67, 72, 77].map((a) => [String(a), K.usd(at(reg, a).fers), K.usd(at(spc, a).fers), K.usd(at(reg, a).csrsLike)]), `A ${K.usd(36000)} annuity from age 57 with ${K.pct(ss26, 1)} inflation each year. The first-year proration is left out.`, ['l', 'r', 'r', 'r'])}
<p>The same annuity under the special provisions receives the diet COLA from the start: ${K.usd(s62.fers)} at 62 and ${K.usd(s77.fers)} at 77. The difference with the regular retiree comes entirely from the five years without an increase, which push every later COLA onto a smaller base.</p>
<h2>The first COLA is prorated</h2>
<p>An annuity that has never been increased receives, in its first December, one-twelfth of the rate for each month it was payable before the increase, with a partial month counted as a full one and a maximum of twelve. An annuity first payable in June 2026 to someone already past 62 has six months on the roll before December 1, so the first increase would be about ${K.pct(prorated(6), 1)} in place of ${K.pct(fe27, 1)}. For a regular retiree under 62, there is no first COLA to prorate until the age condition is met. Our calculator ignores this proration and treats every year as a full year.</p>
<h2>What the COLA does not touch</h2>
<p>The ${h.a('fers-supplement', 'FERS supplement')} is excluded: it is set when it starts and stays flat until it ends at 62. The Social Security benefit you claim later follows its own, uncapped COLA. TSP savings are not indexed at all; their value depends on the funds you hold.</p>
<h2>Using the figure in a retirement plan</h2>
<p>When you compare leaving at the MRA with staying longer, look at the annuity in today's dollars at 62 and at 80, not only at the first payment. The ${h.a('fers-retirement-calculator', 'FERS retirement calculator')} gives the starting annuity; the COLA calculator above shows how far it drifts from prices. If inflation sits between 2 % and 3 % for most of your retirement, the gap with full indexing grows by up to a point a year. If it stays under 2 %, there is no gap after 62.</p>
`,
  related: ['fers-retirement-calculator', 'fers-supplement', 'fers-special-provisions', 'fers-retire-at-62', 'fers-survivor-benefit'],
  sources: ['usc_8462', 'opm_annuity_payments', 'ssa_cola_2027', 'opm_bal_26_101'],
});
